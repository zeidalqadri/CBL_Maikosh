#!/bin/bash

# CBL-MAIKOSH Basketball Coaching Platform - Complete GCP Deployment Script
# This script deploys the entire infrastructure for the CBL-MAIKOSH platform

set -e  # Exit on any error

# Initialize pyenv and set Python 3.12 for gsutil compatibility
if command -v pyenv >/dev/null 2>&1; then
    eval "$(pyenv init -)"
    export PATH="$HOME/.pyenv/shims:$PATH"
    echo "🐍 Using Python $(python3 --version) via pyenv"
else
    echo "⚠️  pyenv not found, using system Python $(python3 --version)"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-"zeidgeistdotcom"}
REGION=${REGION:-"us-central1"}
ENVIRONMENT=${ENVIRONMENT:-"prod"}
APP_NAME="cbl-maikosh"
SERVICE_NAME="${APP_NAME}-app"
DOMAIN=${DOMAIN:-"cbl-maikosh.com"}

# Derived variables
SERVICE_ACCOUNT_NAME="${APP_NAME}-service"
REPO_NAME="${APP_NAME}-repo"
VPC_CONNECTOR_NAME="${APP_NAME}-connector"
SECURITY_POLICY_NAME="${APP_NAME}-security-policy"

echo -e "${BLUE}🏀 CBL-MAIKOSH Basketball Coaching Platform Deployment${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "Project ID: ${GREEN}$PROJECT_ID${NC}"
echo -e "Region: ${GREEN}$REGION${NC}"
echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo -e "Domain: ${GREEN}$DOMAIN${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Python version compatibility
check_python_version() {
    local python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    local major=$(echo $python_version | cut -d. -f1)
    local minor=$(echo $python_version | cut -d. -f2)
    
    if [ "$major" -eq 3 ] && [ "$minor" -ge 8 ] && [ "$minor" -le 12 ]; then
        echo -e "${GREEN}✅ Python $python_version is compatible with gsutil${NC}"
        return 0
    else
        echo -e "${RED}❌ Python $python_version is not compatible with gsutil (requires 3.8-3.12)${NC}"
        echo -e "${YELLOW}💡 Tip: Use 'pyenv local 3.12.8' to switch to a compatible version${NC}"
        return 1
    fi
}

# Function to check Docker context size
check_docker_context() {
    echo -e "${YELLOW}📦 Checking Docker build context...${NC}"
    
    # Check if .dockerignore exists
    if [ ! -f ".dockerignore" ]; then
        echo -e "${RED}❌ .dockerignore file is missing!${NC}"
        echo -e "${YELLOW}💡 This will cause unnecessary uploads of node_modules (~828MB) and build cache${NC}"
        exit 1
    fi
    
    # Calculate context size
    local context_size
    if command_exists tar; then
        tar --exclude-from=.dockerignore -cf /tmp/docker_context_test.tar . 2>/dev/null
        context_size=$(du -h /tmp/docker_context_test.tar 2>/dev/null | cut -f1 || echo "unknown")
        rm -f /tmp/docker_context_test.tar
    else
        context_size="unknown"
    fi
    
    echo -e "📊 Docker build context size: ${GREEN}$context_size${NC}"
    
    # Check for common oversized uploads
    if [ -d "node_modules" ]; then
        local nm_size=$(du -sh node_modules/ 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "${YELLOW}⚠️  node_modules/ detected ($nm_size) - should be excluded by .dockerignore${NC}"
    fi
    
    if [ -d ".next" ]; then
        local next_size=$(du -sh .next/ 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "${YELLOW}⚠️  .next/ build cache detected ($next_size) - should be excluded by .dockerignore${NC}"
    fi
    
    echo -e "${GREEN}✅ Docker context optimized for minimal uploads${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check Python version compatibility
    if ! check_python_version; then
        exit 1
    fi
    
    if ! command_exists gcloud; then
        echo -e "${RED}❌ Google Cloud SDK is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    if ! command_exists docker; then
        echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    # Check if logged in to gcloud
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 > /dev/null; then
        echo -e "${RED}❌ Not authenticated with Google Cloud. Please run 'gcloud auth login'${NC}"
        exit 1
    fi
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Check Docker context after basic prerequisites
    check_docker_context
    
    echo -e "${GREEN}✅ Prerequisites checked${NC}"
}

# Function to enable APIs
enable_apis() {
    echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
    
    apis=(
        "run.googleapis.com"
        "cloudbuild.googleapis.com"
        "artifactregistry.googleapis.com"
        "compute.googleapis.com"
        "storage.googleapis.com"
        "secretmanager.googleapis.com"
        "monitoring.googleapis.com"
        "logging.googleapis.com"
        "vpcaccess.googleapis.com"
        "certificatemanager.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        echo "Enabling $api..."
        gcloud services enable $api --project=$PROJECT_ID
    done
    
    echo -e "${GREEN}✅ APIs enabled${NC}"
}

# Function to create service account
create_service_account() {
    echo -e "${YELLOW}👤 Creating service account...${NC}"
    
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="CBL-MAIKOSH Service Account" \
        --description="Service account for CBL-MAIKOSH application" \
        --project=$PROJECT_ID || echo "Service account already exists"
    
    # Grant necessary roles
    roles=(
        "roles/storage.objectAdmin"
        "roles/secretmanager.secretAccessor"
        "roles/logging.logWriter"
        "roles/monitoring.metricWriter"
        "roles/errorreporting.writer"
        "roles/cloudtrace.agent"
    )
    
    for role in "${roles[@]}"; do
        gcloud projects add-iam-policy-binding $PROJECT_ID \
            --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
            --role="$role"
    done
    
    echo -e "${GREEN}✅ Service account created and configured${NC}"
}

# Function to create Artifact Registry
create_artifact_registry() {
    echo -e "${YELLOW}📦 Creating Artifact Registry...${NC}"
    
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Container registry for CBL-MAIKOSH application" \
        --project=$PROJECT_ID || echo "Repository already exists"
    
    # Configure Docker auth
    gcloud auth configure-docker ${REGION}-docker.pkg.dev
    
    echo -e "${GREEN}✅ Artifact Registry created${NC}"
}

# Function to create storage buckets
create_storage_buckets() {
    echo -e "${YELLOW}🪣 Creating storage buckets...${NC}"
    
    # Main storage bucket
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://${APP_NAME}-${ENVIRONMENT}-storage-${PROJECT_ID} || echo "Main bucket already exists"
    gsutil versioning set on gs://${APP_NAME}-${ENVIRONMENT}-storage-${PROJECT_ID}
    
    # CDN bucket
    gsutil mb -p $PROJECT_ID -c STANDARD -l US gs://${APP_NAME}-${ENVIRONMENT}-cdn-${PROJECT_ID} || echo "CDN bucket already exists"
    gsutil iam ch allUsers:objectViewer gs://${APP_NAME}-${ENVIRONMENT}-cdn-${PROJECT_ID}
    
    # User uploads bucket
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://${APP_NAME}-${ENVIRONMENT}-uploads-${PROJECT_ID} || echo "Uploads bucket already exists"
    gsutil ubla set on gs://${APP_NAME}-${ENVIRONMENT}-uploads-${PROJECT_ID}
    
    # Backup bucket
    gsutil mb -p $PROJECT_ID -c NEARLINE -l $REGION gs://${APP_NAME}-${ENVIRONMENT}-backup-${PROJECT_ID} || echo "Backup bucket already exists"
    
    # Set IAM permissions
    gsutil iam ch serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com:objectAdmin gs://${APP_NAME}-${ENVIRONMENT}-storage-${PROJECT_ID}
    gsutil iam ch serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com:objectAdmin gs://${APP_NAME}-${ENVIRONMENT}-cdn-${PROJECT_ID}
    gsutil iam ch serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com:objectAdmin gs://${APP_NAME}-${ENVIRONMENT}-uploads-${PROJECT_ID}
    gsutil iam ch serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com:objectAdmin gs://${APP_NAME}-${ENVIRONMENT}-backup-${PROJECT_ID}
    
    echo -e "${GREEN}✅ Storage buckets created${NC}"
}

# Function to create VPC and connector
create_vpc() {
    echo -e "${YELLOW}🌐 Creating VPC and connector...${NC}"
    
    # Create VPC
    gcloud compute networks create ${APP_NAME}-vpc \
        --subnet-mode=custom \
        --description="VPC network for CBL-MAIKOSH application" \
        --project=$PROJECT_ID || echo "VPC already exists"
    
    # Create subnet
    gcloud compute networks subnets create ${APP_NAME}-subnet \
        --network=${APP_NAME}-vpc \
        --range=10.0.0.0/24 \
        --region=$REGION \
        --enable-private-ip-google-access \
        --project=$PROJECT_ID || echo "Subnet already exists"
    
    # Create VPC connector
    gcloud compute networks vpc-access connectors create $VPC_CONNECTOR_NAME \
        --region=$REGION \
        --subnet=${APP_NAME}-subnet \
        --subnet-project=$PROJECT_ID \
        --min-instances=2 \
        --max-instances=3 \
        --project=$PROJECT_ID || echo "VPC connector already exists"
    
    echo -e "${GREEN}✅ VPC and connector created${NC}"
}

# Function to build and push container
build_and_push_container() {
    echo -e "${YELLOW}🐳 Building and pushing container...${NC}"
    
    # Build using Cloud Build
    gcloud builds submit \
        --config=cloudbuild.yaml \
        --substitutions=_ENVIRONMENT=$ENVIRONMENT \
        --project=$PROJECT_ID
    
    echo -e "${GREEN}✅ Container built and pushed${NC}"
}

# Function to deploy Cloud Run service
deploy_cloud_run() {
    echo -e "${YELLOW}🚀 Deploying Cloud Run service...${NC}"
    
    # Deploy using existing cloud-run-service.yaml
    gcloud run services replace cloud-run-service.yaml \
        --region=$REGION \
        --project=$PROJECT_ID
    
    # Ensure traffic is routed to latest revision
    gcloud run services update-traffic $SERVICE_NAME \
        --to-latest \
        --region=$REGION \
        --project=$PROJECT_ID
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" --project=$PROJECT_ID)
    echo -e "Service URL: ${GREEN}$SERVICE_URL${NC}"
    
    echo -e "${GREEN}✅ Cloud Run service deployed${NC}"
}

# Function to create Cloud Armor security policy
create_cloud_armor() {
    echo -e "${YELLOW}🛡️ Creating Cloud Armor security policy...${NC}"
    
    # Create security policy
    gcloud compute security-policies create $SECURITY_POLICY_NAME \
        --description="Security policy for CBL-MAIKOSH basketball coaching platform" \
        --project=$PROJECT_ID || echo "Policy already exists"
    
    # Add rate limiting rule
    gcloud compute security-policies rules create 1000 \
        --security-policy=$SECURITY_POLICY_NAME \
        --expression="true" \
        --action="rate_based_ban" \
        --rate-limit-threshold-count=100 \
        --rate-limit-threshold-interval-sec=60 \
        --ban-duration-sec=600 \
        --conform-action=allow \
        --exceed-action="deny-429" \
        --enforce-on-key=IP \
        --project=$PROJECT_ID || echo "Rate limit rule already exists"
    
    # Block malicious regions
    gcloud compute security-policies rules create 1200 \
        --security-policy=$SECURITY_POLICY_NAME \
        --expression="origin.region_code == 'CN' || origin.region_code == 'RU'" \
        --action="deny-403" \
        --project=$PROJECT_ID || echo "Geo-blocking rule already exists"
    
    # Allow health checks
    gcloud compute security-policies rules create 500 \
        --security-policy=$SECURITY_POLICY_NAME \
        --src-ip-ranges="130.211.0.0/22,35.191.0.0/16" \
        --action=allow \
        --project=$PROJECT_ID || echo "Health check rule already exists"
    
    echo -e "${GREEN}✅ Cloud Armor security policy created${NC}"
}

# Function to create load balancer
create_load_balancer() {
    echo -e "${YELLOW}⚖️ Creating global load balancer...${NC}"
    
    # Reserve static IP
    gcloud compute addresses create ${APP_NAME}-global-ip \
        --global \
        --project=$PROJECT_ID || echo "IP already exists"
    
    STATIC_IP=$(gcloud compute addresses describe ${APP_NAME}-global-ip --global --format="value(address)" --project=$PROJECT_ID)
    echo -e "Static IP: ${GREEN}$STATIC_IP${NC}"
    
    # Create NEG for Cloud Run
    gcloud compute network-endpoint-groups create ${APP_NAME}-neg \
        --region=$REGION \
        --network-endpoint-type=serverless \
        --cloud-run-service=$SERVICE_NAME \
        --project=$PROJECT_ID || echo "NEG already exists"
    
    # Create health check
    gcloud compute health-checks create http ${APP_NAME}-health-check \
        --request-path="/api/health" \
        --port=8080 \
        --check-interval=30s \
        --timeout=10s \
        --healthy-threshold=2 \
        --unhealthy-threshold=3 \
        --project=$PROJECT_ID || echo "Health check already exists"
    
    # Create backend service with CDN
    gcloud compute backend-services create ${APP_NAME}-backend-service \
        --global \
        --health-checks=${APP_NAME}-health-check \
        --enable-cdn \
        --cache-mode=CACHE_ALL_STATIC \
        --default-ttl=3600 \
        --max-ttl=86400 \
        --client-ttl=3600 \
        --negative-caching \
        --security-policy=$SECURITY_POLICY_NAME \
        --project=$PROJECT_ID || echo "Backend service already exists"
    
    # Add NEG to backend service
    gcloud compute backend-services add-backend ${APP_NAME}-backend-service \
        --global \
        --network-endpoint-group=${APP_NAME}-neg \
        --network-endpoint-group-region=$REGION \
        --project=$PROJECT_ID || echo "Backend already added"
    
    # Create SSL certificate
    if [ "$DOMAIN" != "cbl-maikosh.com" ]; then
        gcloud compute ssl-certificates create ${APP_NAME}-ssl-cert \
            --domains=$DOMAIN,www.$DOMAIN \
            --global \
            --project=$PROJECT_ID || echo "SSL cert already exists"
    fi
    
    # Create URL map
    gcloud compute url-maps create ${APP_NAME}-url-map \
        --default-service=${APP_NAME}-backend-service \
        --global \
        --project=$PROJECT_ID || echo "URL map already exists"
    
    # Create HTTPS proxy (only if custom domain)
    if [ "$DOMAIN" != "cbl-maikosh.com" ]; then
        gcloud compute target-https-proxies create ${APP_NAME}-https-proxy \
            --url-map=${APP_NAME}-url-map \
            --ssl-certificates=${APP_NAME}-ssl-cert \
            --global \
            --project=$PROJECT_ID || echo "HTTPS proxy already exists"
        
        # Create HTTPS forwarding rule
        gcloud compute forwarding-rules create ${APP_NAME}-https-forwarding-rule \
            --address=${APP_NAME}-global-ip \
            --global \
            --target-https-proxy=${APP_NAME}-https-proxy \
            --ports=443 \
            --project=$PROJECT_ID || echo "HTTPS forwarding rule already exists"
    fi
    
    # Create HTTP to HTTPS redirect
    gcloud compute url-maps create ${APP_NAME}-redirect-map \
        --default-url-redirect-response-code=301 \
        --default-url-redirect-https-redirect \
        --global \
        --project=$PROJECT_ID || echo "Redirect map already exists"
    
    gcloud compute target-http-proxies create ${APP_NAME}-http-proxy \
        --url-map=${APP_NAME}-redirect-map \
        --global \
        --project=$PROJECT_ID || echo "HTTP proxy already exists"
    
    gcloud compute forwarding-rules create ${APP_NAME}-http-forwarding-rule \
        --address=${APP_NAME}-global-ip \
        --global \
        --target-http-proxy=${APP_NAME}-http-proxy \
        --ports=80 \
        --project=$PROJECT_ID || echo "HTTP forwarding rule already exists"
    
    echo -e "${GREEN}✅ Load balancer created${NC}"
}

# Function to setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring and alerting...${NC}"
    
    # Create notification channel for alerts
    cat > notification-channel.json << EOF
{
    "displayName": "CBL-MAIKOSH Alerts",
    "type": "email",
    "labels": {
        "email_address": "zeidalqadri@gmail.com"
    }
}
EOF
    
    # Create uptime check
    cat > uptime-check.json << EOF
{
    "displayName": "CBL-MAIKOSH Health Check",
    "httpCheck": {
        "path": "/api/health",
        "port": 443,
        "useSsl": true
    },
    "monitoredResource": {
        "type": "uptime_url",
        "labels": {
            "project_id": "$PROJECT_ID",
            "host": "$SERVICE_URL"
        }
    },
    "timeout": "10s",
    "period": "60s"
}
EOF
    
    echo -e "${GREEN}✅ Monitoring configured${NC}"
    
    # Cleanup temporary files
    rm -f notification-channel.json uptime-check.json
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}🧪 Running health checks...${NC}"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" --project=$PROJECT_ID)
    
    # Test health endpoint
    echo "Testing health endpoint..."
    if curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api/health" | grep -q "200"; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${RED}❌ Health check failed${NC}"
        exit 1
    fi
    
    # Test main page
    echo "Testing main page..."
    if curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL" | grep -q "200"; then
        echo -e "${GREEN}✅ Main page accessible${NC}"
    else
        echo -e "${RED}❌ Main page not accessible${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All tests passed${NC}"
}

# Function to display deployment summary
deployment_summary() {
    echo -e "${BLUE}📋 DEPLOYMENT SUMMARY${NC}"
    echo -e "${BLUE}===================${NC}"
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" --project=$PROJECT_ID 2>/dev/null || echo "Not deployed")
    STATIC_IP=$(gcloud compute addresses describe ${APP_NAME}-global-ip --global --format="value(address)" --project=$PROJECT_ID 2>/dev/null || echo "Not created")
    
    echo -e "Project ID: ${GREEN}$PROJECT_ID${NC}"
    echo -e "Region: ${GREEN}$REGION${NC}"
    echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
    echo -e "Service URL: ${GREEN}$SERVICE_URL${NC}"
    echo -e "Static IP: ${GREEN}$STATIC_IP${NC}"
    echo -e "Domain: ${GREEN}$DOMAIN${NC}"
    echo ""
    echo -e "${YELLOW}📍 Next Steps:${NC}"
    echo "1. Update your DNS records:"
    echo "   A Record: $DOMAIN -> $STATIC_IP"
    echo "   A Record: www.$DOMAIN -> $STATIC_IP"
    echo ""
    echo "2. Configure your secrets in Google Secret Manager"
    echo "3. Test your application thoroughly"
    echo "4. Set up monitoring dashboards"
    echo ""
    echo -e "${GREEN}🏀 CBL-MAIKOSH deployment completed successfully!${NC}"
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting CBL-MAIKOSH deployment...${NC}"
    
    check_prerequisites
    enable_apis
    create_service_account
    create_artifact_registry
    create_storage_buckets
    create_vpc
    build_and_push_container
    deploy_cloud_run
    create_cloud_armor
    create_load_balancer
    setup_monitoring
    run_tests
    deployment_summary
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --help)
            echo "CBL-MAIKOSH Basketball Coaching Platform Deployment Script"
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --project-id     GCP Project ID (default: zeidgeistdotcom)"
            echo "  --region         GCP Region (default: us-central1)"
            echo "  --environment    Environment (default: prod)"
            echo "  --domain         Custom domain (default: cbl-maikosh.com)"
            echo "  --help           Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main deployment
main