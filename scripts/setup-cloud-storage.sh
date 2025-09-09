#!/bin/bash
# CBL-MAIKOSH Cloud Storage and CDN Setup Script
# This script sets up Cloud Storage buckets and CDN configuration for the basketball coaching platform

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${PROJECT_ID:-zeidgeistdotcom}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
REGION="${REGION:-us-central1}"
APP_NAME="cbl-maikosh"

# Bucket names
STORAGE_BUCKET="${APP_NAME}-${ENVIRONMENT}-storage-${PROJECT_ID}"
CDN_BUCKET="${APP_NAME}-${ENVIRONMENT}-cdn-${PROJECT_ID}"
BACKUP_BUCKET="${APP_NAME}-${ENVIRONMENT}-backup-${PROJECT_ID}"

# Service account
SERVICE_ACCOUNT="${APP_NAME}-service@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "${BLUE}🏀 CBL-MAIKOSH Cloud Storage & CDN Setup${NC}"
echo -e "Project: ${PROJECT_ID}"
echo -e "Environment: ${ENVIRONMENT}"
echo -e "Region: ${REGION}"
echo ""

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if bucket exists
bucket_exists() {
    gsutil ls "gs://$1" >/dev/null 2>&1
}

# Function to create bucket with proper configuration
create_bucket() {
    local bucket_name=$1
    local bucket_type=$2
    
    echo -e "\n${BLUE}Creating $bucket_type bucket: $bucket_name${NC}"
    
    if bucket_exists "$bucket_name"; then
        print_warning "Bucket $bucket_name already exists"
        return 0
    fi
    
    # Create bucket
    gsutil mb -p "$PROJECT_ID" -c STANDARD -l "$REGION" "gs://$bucket_name"
    print_status "Created bucket: $bucket_name"
    
    # Set versioning for app storage bucket
    if [[ "$bucket_type" == "storage" ]]; then
        gsutil versioning set on "gs://$bucket_name"
        print_status "Enabled versioning for $bucket_name"
    fi
    
    # Set lifecycle rules
    create_lifecycle_config "$bucket_name" "$bucket_type"
    
    # Set CORS policy
    create_cors_config "$bucket_name" "$bucket_type"
    
    # Set appropriate permissions
    set_bucket_permissions "$bucket_name" "$bucket_type"
}

# Function to create lifecycle configuration
create_lifecycle_config() {
    local bucket_name=$1
    local bucket_type=$2
    
    local lifecycle_file="/tmp/lifecycle-${bucket_type}.json"
    
    if [[ "$bucket_type" == "storage" ]]; then
        cat > "$lifecycle_file" <<EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365, "isLive": false}
    },
    {
      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
      "condition": {"age": 30, "isLive": true}
    },
    {
      "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
      "condition": {"age": 90, "isLive": true}
    }
  ]
}
EOF
    elif [[ "$bucket_type" == "cdn" ]]; then
        cat > "$lifecycle_file" <<EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 30, "isLive": false}
    }
  ]
}
EOF
    elif [[ "$bucket_type" == "backup" ]]; then
        cat > "$lifecycle_file" <<EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 90}
    },
    {
      "action": {"type": "SetStorageClass", "storageClass": "ARCHIVE"},
      "condition": {"age": 7}
    }
  ]
}
EOF
    fi
    
    gsutil lifecycle set "$lifecycle_file" "gs://$bucket_name"
    print_status "Applied lifecycle policy to $bucket_name"
    rm "$lifecycle_file"
}

# Function to create CORS configuration
create_cors_config() {
    local bucket_name=$1
    local bucket_type=$2
    
    local cors_file="/tmp/cors-${bucket_type}.json"
    
    if [[ "$bucket_type" == "storage" ]]; then
        cat > "$cors_file" <<EOF
[
  {
    "origin": ["https://${APP_NAME}-${ENVIRONMENT}-${PROJECT_ID}.a.run.app", "https://cblmaikosh.com", "https://www.cblmaikosh.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
EOF
    elif [[ "$bucket_type" == "cdn" ]]; then
        cat > "$cors_file" <<EOF
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Cache-Control", "ETag"],
    "maxAgeSeconds": 86400
  }
]
EOF
    fi
    
    if [[ "$bucket_type" != "backup" ]]; then
        gsutil cors set "$cors_file" "gs://$bucket_name"
        print_status "Applied CORS policy to $bucket_name"
        rm "$cors_file"
    fi
}

# Function to set bucket permissions
set_bucket_permissions() {
    local bucket_name=$1
    local bucket_type=$2
    
    if [[ "$bucket_type" == "cdn" ]]; then
        # Make CDN bucket publicly readable
        gsutil iam ch allUsers:objectViewer "gs://$bucket_name"
        print_status "Made $bucket_name publicly readable"
    else
        # Private buckets - only service account access
        gsutil iam ch "serviceAccount:$SERVICE_ACCOUNT:objectAdmin" "gs://$bucket_name"
        print_status "Granted service account access to $bucket_name"
    fi
    
    # Enable uniform bucket-level access
    gsutil uniformbucketlevelaccess set on "gs://$bucket_name"
    print_status "Enabled uniform bucket-level access for $bucket_name"
}

# Function to setup Cloud CDN
setup_cdn() {
    echo -e "\n${BLUE}Setting up Cloud CDN${NC}"
    
    # Create load balancer backend bucket
    gcloud compute backend-buckets create "${APP_NAME}-cdn-backend" \
        --gcs-bucket-name="$CDN_BUCKET" \
        --project="$PROJECT_ID" \
        --enable-cdn \
        --cache-mode=CACHE_ALL_STATIC \
        --default-ttl=86400 \
        --max-ttl=31536000 || print_warning "Backend bucket may already exist"
    
    print_status "Created CDN backend bucket"
    
    # Create URL map
    gcloud compute url-maps create "${APP_NAME}-cdn-map" \
        --default-backend-bucket="${APP_NAME}-cdn-backend" \
        --project="$PROJECT_ID" || print_warning "URL map may already exist"
    
    print_status "Created URL map for CDN"
    
    # Create HTTPS proxy (requires SSL certificate)
    print_warning "SSL certificate setup required for HTTPS proxy - see deployment documentation"
}

# Function to upload sample assets
upload_sample_assets() {
    echo -e "\n${BLUE}Uploading sample basketball coaching assets${NC}"
    
    # Create sample directory structure
    mkdir -p /tmp/cbl-assets/{images,videos,documents}
    
    # Create sample files (in production, these would be your actual assets)
    echo "Basketball coaching placeholder" > /tmp/cbl-assets/documents/course-outline.txt
    echo "Module 1: Basketball Fundamentals" > /tmp/cbl-assets/documents/module1.txt
    
    # Upload to storage bucket
    gsutil -m cp -r /tmp/cbl-assets/* "gs://$STORAGE_BUCKET/course-materials/"
    print_status "Uploaded sample course materials"
    
    # Set cache control headers for different file types
    gsutil -m setmeta -h "Cache-Control:public, max-age=86400" "gs://$STORAGE_BUCKET/course-materials/images/**"
    gsutil -m setmeta -h "Cache-Control:public, max-age=604800" "gs://$STORAGE_BUCKET/course-materials/documents/**"
    
    # Clean up temp files
    rm -rf /tmp/cbl-assets
}

# Function to create monitoring for buckets
setup_monitoring() {
    echo -e "\n${BLUE}Setting up bucket monitoring${NC}"
    
    # Enable logging for buckets
    for bucket in "$STORAGE_BUCKET" "$CDN_BUCKET" "$BACKUP_BUCKET"; do
        gsutil logging set on -b "gs://${PROJECT_ID}-access-logs" "gs://$bucket" || print_warning "Access logging setup failed for $bucket"
    done
    
    print_status "Configured access logging"
    
    # Set up notifications (requires Pub/Sub topic)
    print_warning "Pub/Sub notifications can be configured separately for file upload/delete events"
}

# Main execution
main() {
    echo -e "${BLUE}Starting Cloud Storage setup...${NC}\n"
    
    # Verify gcloud is configured
    if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -n1 > /dev/null; then
        print_error "Please run 'gcloud auth login' first"
        exit 1
    fi
    
    # Set project
    gcloud config set project "$PROJECT_ID"
    
    # Create buckets
    create_bucket "$STORAGE_BUCKET" "storage"
    create_bucket "$CDN_BUCKET" "cdn" 
    create_bucket "$BACKUP_BUCKET" "backup"
    
    # Setup CDN
    setup_cdn
    
    # Upload sample assets
    upload_sample_assets
    
    # Setup monitoring
    setup_monitoring
    
    echo -e "\n${GREEN}🏀 Cloud Storage and CDN setup completed successfully!${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo -e "1. Configure SSL certificates for custom domain"
    echo -e "2. Update DNS records to point to load balancer"
    echo -e "3. Upload your basketball course materials"
    echo -e "4. Configure monitoring alerts"
    echo -e "\n${BLUE}Bucket URLs:${NC}"
    echo -e "Storage: gs://$STORAGE_BUCKET"
    echo -e "CDN: gs://$CDN_BUCKET"
    echo -e "Backup: gs://$BACKUP_BUCKET"
}

# Run main function
main "$@"