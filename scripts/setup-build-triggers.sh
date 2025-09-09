#!/bin/bash

# CBL-MAIKOSH Build Triggers Setup Script
# Creates Cloud Build triggers for automated CI/CD pipeline execution

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
GITHUB_OWNER="${GITHUB_OWNER:-}"
GITHUB_REPO="${GITHUB_REPO:-cbl-maikosh}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation
validate_setup() {
    if [[ -z "$PROJECT_ID" ]]; then
        log_error "PROJECT_ID environment variable not set"
        exit 1
    fi

    if [[ -z "$GITHUB_OWNER" ]]; then
        log_error "GITHUB_OWNER environment variable not set"
        exit 1
    fi

    log_info "Validation completed successfully"
}

# Enable required APIs
enable_apis() {
    log_info "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com --project="$PROJECT_ID"
    gcloud services enable secretmanager.googleapis.com --project="$PROJECT_ID"
    gcloud services enable run.googleapis.com --project="$PROJECT_ID"
    log_success "APIs enabled"
}

# Connect GitHub repository (if not already connected)
connect_github_repo() {
    log_info "Connecting GitHub repository..."
    
    if [[ -n "$GITHUB_TOKEN" ]]; then
        # Connect using token
        gcloud alpha builds connections create github \
            --region=us-central1 \
            --name=cbl-maikosh-github-connection \
            --project="$PROJECT_ID" || log_warning "Connection may already exist"
            
        gcloud alpha builds repositories create \
            --region=us-central1 \
            --connection=cbl-maikosh-github-connection \
            --name=cbl-maikosh-repo \
            --remote-uri="https://github.com/$GITHUB_OWNER/$GITHUB_REPO.git" \
            --project="$PROJECT_ID" || log_warning "Repository may already be connected"
    else
        log_warning "GitHub token not provided. Please manually connect the repository:"
        log_info "1. Go to Cloud Build > Triggers"
        log_info "2. Click 'Connect Repository'"
        log_info "3. Select GitHub and authenticate"
        log_info "4. Select repository: $GITHUB_OWNER/$GITHUB_REPO"
    fi
}

# Create build triggers
create_build_triggers() {
    log_info "Creating build triggers..."

    # Development trigger (feature branches and develop)
    cat << EOF > dev-trigger.yaml
name: 'cbl-maikosh-dev-trigger'
description: 'CBL-MAIKOSH Development Environment Trigger'
github:
  owner: '$GITHUB_OWNER'
  name: '$GITHUB_REPO'
  push:
    branch: '^(develop|feature/.*)$'
filename: 'cloudbuild-dev.yaml'
substitutions:
  _ENVIRONMENT: 'dev'
includeBuildLogs: INCLUDE_BUILD_LOGS_WITH_STATUS
EOF

    gcloud builds triggers create github --trigger-config=dev-trigger.yaml --project="$PROJECT_ID"
    rm dev-trigger.yaml

    # Staging trigger (pull requests to main)
    cat << EOF > staging-trigger.yaml
name: 'cbl-maikosh-staging-trigger'
description: 'CBL-MAIKOSH Staging Environment Trigger'
github:
  owner: '$GITHUB_OWNER'
  name: '$GITHUB_REPO'
  pullRequest:
    branch: '^main$'
    commentControl: 'COMMENTS_ENABLED_FOR_EXTERNAL_CONTRIBUTORS_ONLY'
filename: 'cloudbuild-staging.yaml'
substitutions:
  _ENVIRONMENT: 'staging'
includeBuildLogs: INCLUDE_BUILD_LOGS_WITH_STATUS
EOF

    gcloud builds triggers create github --trigger-config=staging-trigger.yaml --project="$PROJECT_ID"
    rm staging-trigger.yaml

    # Production trigger (push to main)
    cat << EOF > prod-trigger.yaml
name: 'cbl-maikosh-prod-trigger'
description: 'CBL-MAIKOSH Production Environment Trigger'
github:
  owner: '$GITHUB_OWNER'
  name: '$GITHUB_REPO'
  push:
    branch: '^main$'
filename: 'cloudbuild-production.yaml'
substitutions:
  _ENVIRONMENT: 'prod'
includeBuildLogs: INCLUDE_BUILD_LOGS_WITH_STATUS
EOF

    gcloud builds triggers create github --trigger-config=prod-trigger.yaml --project="$PROJECT_ID"
    rm prod-trigger.yaml

    # Manual trigger for emergency deployments
    cat << EOF > manual-trigger.yaml
name: 'cbl-maikosh-manual-trigger'
description: 'CBL-MAIKOSH Manual Deployment Trigger'
github:
  owner: '$GITHUB_OWNER'
  name: '$GITHUB_REPO'
  push:
    tag: '^v.*'
filename: 'cloudbuild-enhanced.yaml'
substitutions:
  _ENVIRONMENT: 'prod'
includeBuildLogs: INCLUDE_BUILD_LOGS_WITH_STATUS
EOF

    gcloud builds triggers create github --trigger-config=manual-trigger.yaml --project="$PROJECT_ID"
    rm manual-trigger.yaml

    log_success "Build triggers created successfully"
}

# Create required storage buckets
create_storage_buckets() {
    log_info "Creating required storage buckets..."

    # Build cache bucket
    gsutil mb -p "$PROJECT_ID" gs://cbl-maikosh-build-cache-"$PROJECT_ID" 2>/dev/null || log_warning "Build cache bucket may already exist"

    # Reports bucket
    gsutil mb -p "$PROJECT_ID" gs://cbl-maikosh-reports-"$PROJECT_ID" 2>/dev/null || log_warning "Reports bucket may already exist"

    # Artifacts bucket
    gsutil mb -p "$PROJECT_ID" gs://cbl-maikosh-build-artifacts-"$PROJECT_ID" 2>/dev/null || log_warning "Artifacts bucket may already exist"

    # Set lifecycle policies for cost optimization
    cat << 'EOF' > lifecycle-policy.json
{
  "lifecycle": {
    "rule": [
      {
        "condition": {
          "age": 30
        },
        "action": {
          "type": "Delete"
        }
      }
    ]
  }
}
EOF

    gsutil lifecycle set lifecycle-policy.json gs://cbl-maikosh-build-cache-"$PROJECT_ID"
    gsutil lifecycle set lifecycle-policy.json gs://cbl-maikosh-build-artifacts-"$PROJECT_ID"
    rm lifecycle-policy.json

    # Set up versioning for reports (keep longer)
    gsutil versioning set on gs://cbl-maikosh-reports-"$PROJECT_ID"

    log_success "Storage buckets created and configured"
}

# Set up Cloud Build service account permissions
setup_service_account() {
    log_info "Setting up Cloud Build service account permissions..."

    PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
    CLOUDBUILD_SA="$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"

    # Grant necessary permissions
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/run.admin"

    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/iam.serviceAccountUser"

    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/secretmanager.secretAccessor"

    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/storage.admin"

    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/artifactregistry.admin"

    log_success "Service account permissions configured"
}

# Create Artifact Registry repository
create_artifact_registry() {
    log_info "Creating Artifact Registry repository..."

    gcloud artifacts repositories create cbl-maikosh-repo \
        --repository-format=docker \
        --location=us-central1 \
        --project="$PROJECT_ID" \
        --description="CBL-MAIKOSH container registry" || log_warning "Repository may already exist"

    log_success "Artifact Registry repository created"
}

# Create notification configurations
create_notifications() {
    log_info "Creating build notification configurations..."

    # Cloud Build notifications (requires Pub/Sub topic)
    gcloud pubsub topics create cloud-builds --project="$PROJECT_ID" || log_warning "Topic may already exist"

    # Create subscription for build notifications
    gcloud pubsub subscriptions create build-notifications \
        --topic=cloud-builds \
        --project="$PROJECT_ID" || log_warning "Subscription may already exist"

    log_success "Notification configurations created"
}

# Generate trigger summary
generate_summary() {
    log_info "Generating build triggers summary..."

    cat << EOF > build-triggers-summary.md
# CBL-MAIKOSH Build Triggers Summary

## Configured Build Triggers

### 🔧 Development Trigger
- **Name**: cbl-maikosh-dev-trigger
- **Trigger**: Push to develop branch or feature/* branches
- **Pipeline**: cloudbuild-dev.yaml
- **Environment**: Development
- **Duration**: ~15 minutes

### 🧪 Staging Trigger
- **Name**: cbl-maikosh-staging-trigger
- **Trigger**: Pull requests to main branch
- **Pipeline**: cloudbuild-staging.yaml
- **Environment**: Staging
- **Duration**: ~40 minutes

### 🚀 Production Trigger
- **Name**: cbl-maikosh-prod-trigger
- **Trigger**: Push to main branch
- **Pipeline**: cloudbuild-production.yaml
- **Environment**: Production
- **Duration**: ~60 minutes

### 🆘 Manual Trigger
- **Name**: cbl-maikosh-manual-trigger
- **Trigger**: Git tags (v*)
- **Pipeline**: cloudbuild-enhanced.yaml
- **Environment**: Production
- **Use Case**: Emergency deployments

## Storage Buckets

### Build Cache
- **Bucket**: gs://cbl-maikosh-build-cache-$PROJECT_ID
- **Purpose**: npm cache and build artifacts
- **Retention**: 30 days

### Reports
- **Bucket**: gs://cbl-maikosh-reports-$PROJECT_ID
- **Purpose**: Test reports, performance audits
- **Retention**: Versioned (long-term)

### Artifacts
- **Bucket**: gs://cbl-maikosh-build-artifacts-$PROJECT_ID
- **Purpose**: Build artifacts and logs
- **Retention**: 30 days

## Container Registry

### Artifact Registry
- **Repository**: us-central1-docker.pkg.dev/$PROJECT_ID/cbl-maikosh-repo/cbl-maikosh-app
- **Location**: us-central1
- **Format**: Docker

## Service Account Permissions

The Cloud Build service account has been granted:
- Cloud Run Admin
- IAM Service Account User
- Secret Manager Secret Accessor
- Storage Admin
- Artifact Registry Admin

## Usage Examples

### Triggering Development Build
\`\`\`bash
git checkout develop
git push origin develop
# Or create feature branch:
git checkout -b feature/new-feature
git push origin feature/new-feature
\`\`\`

### Triggering Staging Build
\`\`\`bash
# Create pull request to main branch
gh pr create --base main --title "Feature: New Feature"
\`\`\`

### Triggering Production Build
\`\`\`bash
git checkout main
git merge feature-branch
git push origin main
\`\`\`

### Manual Production Deployment
\`\`\`bash
git tag v1.2.3
git push origin v1.2.3
\`\`\`

## Monitoring Build Status

### Cloud Console
- URL: https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID

### Command Line
\`\`\`bash
# List recent builds
gcloud builds list --limit=10 --project=$PROJECT_ID

# Get build details
gcloud builds describe BUILD_ID --project=$PROJECT_ID

# Stream build logs
gcloud builds log BUILD_ID --project=$PROJECT_ID
\`\`\`

## Troubleshooting

### Build Failures
1. Check build logs in Cloud Console
2. Verify trigger configuration
3. Check service account permissions
4. Validate cloudbuild.yaml syntax

### Permission Issues
- Ensure Cloud Build service account has required roles
- Verify GitHub repository connection
- Check secret access permissions

Generated on: $(date)
EOF

    log_success "Build triggers summary generated: build-triggers-summary.md"
}

# Main setup function
main() {
    log_info "Setting up CBL-MAIKOSH build triggers..."

    validate_setup
    enable_apis
    create_artifact_registry
    create_storage_buckets
    setup_service_account
    connect_github_repo
    create_build_triggers
    create_notifications
    generate_summary

    log_success "🎉 CBL-MAIKOSH build triggers setup completed successfully!"
    log_info "Check build-triggers-summary.md for detailed information"
    log_info "Triggers will automatically execute on configured GitHub events"
}

# Print usage
usage() {
    cat << EOF
Usage: $0

Environment Variables:
  PROJECT_ID      GCP Project ID (required)
  GITHUB_OWNER    GitHub repository owner/organization (required)
  GITHUB_REPO     GitHub repository name (default: cbl-maikosh)
  GITHUB_TOKEN    GitHub personal access token (optional, for automatic connection)

Examples:
  PROJECT_ID=zeidgeistdotcom GITHUB_OWNER=myorg $0
  PROJECT_ID=zeidgeistdotcom GITHUB_OWNER=myorg GITHUB_TOKEN=ghp_xxx $0

EOF
}

# Handle command line arguments
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

# Run main function
main "$@"