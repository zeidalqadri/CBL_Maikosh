#!/bin/bash

# CBL-MAIKOSH Deployment Script with Rollback Capability
# Advanced deployment script with comprehensive error handling and rollback

set -euo pipefail

# Configuration
PROJECT_ID="${PROJECT_ID:-}"
ENVIRONMENT="${1:-dev}"
IMAGE_TAG="${2:-latest}"
DRY_RUN="${DRY_RUN:-false}"
REGION="${REGION:-us-central1}"
SERVICE_NAME="cbl-maikosh-app-${ENVIRONMENT}"
REGISTRY="us-central1-docker.pkg.dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Validation function
validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
        log_error "Invalid environment: $ENVIRONMENT. Must be dev, staging, or prod."
        exit 1
    fi

    if [[ -z "$PROJECT_ID" ]]; then
        log_error "PROJECT_ID environment variable not set"
        exit 1
    fi

    if ! gcloud projects describe "$PROJECT_ID" &>/dev/null; then
        log_error "Project $PROJECT_ID not found or not accessible"
        exit 1
    fi
}

# Get current revision for rollback
get_current_revision() {
    gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --format='value(status.traffic[0].revisionName)' 2>/dev/null || echo "none"
}

# Health check function
health_check() {
    local url="$1"
    local max_attempts="${2:-20}"
    local wait_time="${3:-15}"
    
    log_info "Performing health check on $url"
    
    for i in $(seq 1 $max_attempts); do
        log_info "Health check attempt $i/$max_attempts"
        
        if curl -f -s -m 10 "$url/api/health" >/dev/null; then
            log_success "Health check passed"
            return 0
        fi
        
        if [[ $i -lt $max_attempts ]]; then
            log_warning "Health check failed, retrying in ${wait_time}s..."
            sleep $wait_time
        fi
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback_deployment() {
    local previous_revision="$1"
    
    if [[ "$previous_revision" == "none" ]]; then
        log_warning "No previous revision found, cannot rollback"
        return 1
    fi
    
    log_warning "Rolling back to previous revision: $previous_revision"
    
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-revisions="$previous_revision=100" \
        --region="$REGION"
    
    log_success "Rollback completed"
}

# Environment-specific deployment configurations
get_deployment_config() {
    local env="$1"
    
    case $env in
        "dev")
            echo "memory=512Mi cpu=1 max-instances=5 min-instances=0 timeout=300"
            ;;
        "staging")
            echo "memory=1Gi cpu=1 max-instances=20 min-instances=1 timeout=600"
            ;;
        "prod")
            echo "memory=2Gi cpu=2 max-instances=100 min-instances=2 timeout=900"
            ;;
        *)
            log_error "Unknown environment: $env"
            exit 1
            ;;
    esac
}

# Deployment strategy based on environment
deploy_with_strategy() {
    local env="$1"
    local image_uri="$2"
    local config="$3"
    
    # Parse configuration
    local memory=$(echo "$config" | grep -o 'memory=[^ ]*' | cut -d= -f2)
    local cpu=$(echo "$config" | grep -o 'cpu=[^ ]*' | cut -d= -f2)
    local max_instances=$(echo "$config" | grep -o 'max-instances=[^ ]*' | cut -d= -f2)
    local min_instances=$(echo "$config" | grep -o 'min-instances=[^ ]*' | cut -d= -f2)
    local timeout=$(echo "$config" | grep -o 'timeout=[^ ]*' | cut -d= -f2)
    
    case $env in
        "dev")
            deploy_direct "$image_uri" "$memory" "$cpu" "$max_instances" "$min_instances" "$timeout"
            ;;
        "staging")
            deploy_canary "$image_uri" "$memory" "$cpu" "$max_instances" "$min_instances" "$timeout"
            ;;
        "prod")
            deploy_blue_green "$image_uri" "$memory" "$cpu" "$max_instances" "$min_instances" "$timeout"
            ;;
    esac
}

# Direct deployment (development)
deploy_direct() {
    local image_uri="$1"
    local memory="$2"
    local cpu="$3"
    local max_instances="$4"
    local min_instances="$5"
    local timeout="$6"
    
    log_info "Deploying directly to $ENVIRONMENT environment"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy $image_uri to $SERVICE_NAME"
        return 0
    fi
    
    gcloud run deploy "$SERVICE_NAME" \
        --image="$image_uri" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --memory="$memory" \
        --cpu="$cpu" \
        --timeout="$timeout" \
        --concurrency=100 \
        --max-instances="$max_instances" \
        --min-instances="$min_instances" \
        --port=8080 \
        --service-account="cbl-maikosh-service@$PROJECT_ID.iam.gserviceaccount.com" \
        --set-env-vars="NODE_ENV=$ENVIRONMENT,NEXT_PUBLIC_API_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app/api,AUTH0_BASE_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app,GCP_PROJECT_ID=$PROJECT_ID,NEXT_TELEMETRY_DISABLED=1" \
        --set-secrets="AUTH0_SECRET=auth0-secret:latest,AUTH0_CLIENT_ID=auth0-client-id:latest,AUTH0_CLIENT_SECRET=auth0-client-secret:latest,AUTH0_ISSUER_BASE_URL=auth0-issuer-url:latest" \
        --labels="environment=$ENVIRONMENT,application=cbl-maikosh,tier=web"
}

# Canary deployment (staging)
deploy_canary() {
    local image_uri="$1"
    local memory="$2"
    local cpu="$3"
    local max_instances="$4"
    local min_instances="$5"
    local timeout="$6"
    local canary_tag="canary-$(date +%s)"
    
    log_info "Deploying with canary strategy to $ENVIRONMENT environment"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy canary $image_uri to $SERVICE_NAME"
        return 0
    fi
    
    # Deploy canary with no traffic
    gcloud run deploy "$SERVICE_NAME" \
        --image="$image_uri" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --memory="$memory" \
        --cpu="$cpu" \
        --timeout="$timeout" \
        --concurrency=500 \
        --max-instances="$max_instances" \
        --min-instances="$min_instances" \
        --port=8080 \
        --service-account="cbl-maikosh-service@$PROJECT_ID.iam.gserviceaccount.com" \
        --set-env-vars="NODE_ENV=$ENVIRONMENT,NEXT_PUBLIC_API_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app/api,AUTH0_BASE_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app,GCP_PROJECT_ID=$PROJECT_ID,NEXT_TELEMETRY_DISABLED=1" \
        --set-secrets="AUTH0_SECRET=auth0-secret:latest,AUTH0_CLIENT_ID=auth0-client-id:latest,AUTH0_CLIENT_SECRET=auth0-client-secret:latest,AUTH0_ISSUER_BASE_URL=auth0-issuer-url:latest" \
        --labels="environment=$ENVIRONMENT,application=cbl-maikosh,tier=web,deployment=canary" \
        --tag="$canary_tag" \
        --no-traffic
    
    log_info "Canary deployed, starting traffic split"
    
    # Route 10% traffic to canary
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-tags="$canary_tag=10" \
        --region="$REGION"
    
    # Monitor canary for 5 minutes
    local service_url=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
    
    log_info "Monitoring canary deployment for 5 minutes..."
    for i in {1..10}; do
        log_info "Canary monitoring check $i/10"
        
        if ! health_check "$service_url" 3 10; then
            log_error "Canary health check failed, rolling back"
            gcloud run services update-traffic "$SERVICE_NAME" --to-latest --region="$REGION"
            return 1
        fi
        
        sleep 30
    done
    
    # Promote canary to 100% traffic
    log_info "Promoting canary to 100% traffic"
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-tags="$canary_tag=100" \
        --region="$REGION"
    
    log_success "Canary deployment completed successfully"
}

# Blue-Green deployment (production)
deploy_blue_green() {
    local image_uri="$1"
    local memory="$2"
    local cpu="$3"
    local max_instances="$4"
    local min_instances="$5"
    local timeout="$6"
    local green_tag="green-$(date +%s)"
    
    log_info "Deploying with blue-green strategy to $ENVIRONMENT environment"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy blue-green $image_uri to $SERVICE_NAME"
        return 0
    fi
    
    # Deploy green environment with no traffic
    gcloud run deploy "$SERVICE_NAME" \
        --image="$image_uri" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --memory="$memory" \
        --cpu="$cpu" \
        --timeout="$timeout" \
        --concurrency=1000 \
        --max-instances="$max_instances" \
        --min-instances="$min_instances" \
        --port=8080 \
        --service-account="cbl-maikosh-service@$PROJECT_ID.iam.gserviceaccount.com" \
        --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_API_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app/api,AUTH0_BASE_URL=https://$SERVICE_NAME-$PROJECT_ID.a.run.app,GCP_PROJECT_ID=$PROJECT_ID,NEXT_TELEMETRY_DISABLED=1" \
        --set-secrets="AUTH0_SECRET=auth0-secret:latest,AUTH0_CLIENT_ID=auth0-client-id:latest,AUTH0_CLIENT_SECRET=auth0-client-secret:latest,AUTH0_ISSUER_BASE_URL=auth0-issuer-url:latest" \
        --labels="environment=$ENVIRONMENT,application=cbl-maikosh,tier=web,deployment=blue-green" \
        --tag="$green_tag" \
        --no-traffic
    
    # Test green environment
    local green_url="https://$green_tag---$SERVICE_NAME-$PROJECT_ID.a.run.app"
    
    log_info "Testing green environment: $green_url"
    if ! health_check "$green_url" 20 15; then
        log_error "Green environment health check failed"
        return 1
    fi
    
    # Gradual traffic switch
    log_info "Starting gradual traffic switch to green environment"
    
    # 5% traffic
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-tags="$green_tag=5" \
        --region="$REGION"
    
    log_info "5% traffic routed to green, monitoring..."
    sleep 60
    
    local service_url=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
    if ! health_check "$service_url" 5 20; then
        log_error "5% traffic test failed, rolling back"
        gcloud run services update-traffic "$SERVICE_NAME" --to-latest --region="$REGION"
        return 1
    fi
    
    # 50% traffic
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-tags="$green_tag=50" \
        --region="$REGION"
    
    log_info "50% traffic routed to green, monitoring..."
    sleep 120
    
    if ! health_check "$service_url" 5 20; then
        log_error "50% traffic test failed, rolling back"
        gcloud run services update-traffic "$SERVICE_NAME" --to-latest --region="$REGION"
        return 1
    fi
    
    # 100% traffic
    gcloud run services update-traffic "$SERVICE_NAME" \
        --to-tags="$green_tag=100" \
        --region="$REGION"
    
    log_success "Blue-green deployment completed successfully"
}

# Main deployment function
main() {
    local previous_revision=""
    
    log_info "Starting CBL-MAIKOSH deployment to $ENVIRONMENT environment"
    
    # Validate inputs
    validate_environment
    
    # Get current revision for potential rollback
    previous_revision=$(get_current_revision)
    log_info "Current revision: $previous_revision"
    
    # Construct image URI
    local image_uri="$REGISTRY/$PROJECT_ID/cbl-maikosh-repo/cbl-maikosh-app:$IMAGE_TAG"
    log_info "Deploying image: $image_uri"
    
    # Get deployment configuration
    local config=$(get_deployment_config "$ENVIRONMENT")
    
    # Trap for error handling
    trap 'log_error "Deployment failed, attempting rollback..."; rollback_deployment "$previous_revision"; exit 1' ERR
    
    # Execute deployment
    deploy_with_strategy "$ENVIRONMENT" "$image_uri" "$config"
    
    # Final health check
    local service_url=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
    
    if ! health_check "$service_url" 10 15; then
        log_error "Final health check failed, rolling back"
        rollback_deployment "$previous_revision"
        exit 1
    fi
    
    log_success "Deployment completed successfully!"
    log_success "Service URL: $service_url"
    
    # Generate deployment report
    cat << EOF > "deployment-report-$(date +%Y%m%d-%H%M%S).json"
{
    "deployment": {
        "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "environment": "$ENVIRONMENT",
        "image": "$image_uri",
        "service_url": "$service_url",
        "previous_revision": "$previous_revision",
        "status": "success"
    }
}
EOF
    
    log_success "Deployment report generated"
}

# Print usage
usage() {
    cat << EOF
Usage: $0 <environment> [image_tag]

Arguments:
  environment    Target environment (dev|staging|prod)
  image_tag      Image tag to deploy (default: latest)

Environment Variables:
  PROJECT_ID     GCP Project ID (required)
  DRY_RUN        Set to 'true' for dry run mode
  REGION         GCP region (default: us-central1)

Examples:
  $0 dev
  $0 staging v1.2.3
  PROJECT_ID=my-project $0 prod latest
  DRY_RUN=true $0 staging test-tag

EOF
}

# Handle command line arguments
if [[ $# -eq 0 ]] || [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    usage
    exit 0
fi

# Run main function
main "$@"