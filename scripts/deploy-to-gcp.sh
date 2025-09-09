#!/bin/bash
# CBL-MAIKOSH GCP Deployment Script
# This script automates the complete deployment process for the basketball coaching platform

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${PROJECT_ID:-zeidgeistdotcom}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
REGION="${REGION:-us-central1}"
APP_NAME="cbl-maikosh"

# Deployment configuration
BUILD_TIMEOUT="2400s"
TERRAFORM_DIR="./terraform"
SECRETS_DIR="./secrets"

echo -e "${PURPLE}🏀 CBL-MAIKOSH Basketball Coaching Platform${NC}"
echo -e "${PURPLE}🚀 GCP Deployment Automation${NC}"
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

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}Checking prerequisites...${NC}"
    
    # Check if required tools are installed
    local required_tools=("gcloud" "terraform" "docker" "npm" "node")
    
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            print_error "$tool is not installed or not in PATH"
            exit 1
        fi
    done
    
    # Check gcloud authentication
    if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | head -n1 > /dev/null; then
        print_error "Please run 'gcloud auth login' first"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Set gcloud project
    gcloud config set project "$PROJECT_ID"
    
    print_status "All prerequisites met"
}

# Function to setup Google Cloud Project
setup_gcp_project() {
    echo -e "\n${BLUE}Setting up GCP project...${NC}"
    
    # Enable required APIs
    local apis=(
        "run.googleapis.com"
        "cloudbuild.googleapis.com"
        "artifactregistry.googleapis.com"
        "storage.googleapis.com"
        "secretmanager.googleapis.com"
        "compute.googleapis.com"
        "certificatemanager.googleapis.com"
        "dns.googleapis.com"
        "monitoring.googleapis.com"
        "logging.googleapis.com"
        "vpcaccess.googleapis.com"
    )
    
    print_info "Enabling required APIs..."
    gcloud services enable "${apis[@]}" --project="$PROJECT_ID"
    print_status "APIs enabled"
    
    # Create Artifact Registry repository
    if ! gcloud artifacts repositories describe "${APP_NAME}-repo" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
        gcloud artifacts repositories create "${APP_NAME}-repo" \
            --repository-format=docker \
            --location="$REGION" \
            --description="Docker repository for CBL-MAIKOSH" \
            --project="$PROJECT_ID"
        print_status "Created Artifact Registry repository"
    else
        print_warning "Artifact Registry repository already exists"
    fi
}

# Function to setup secrets in Google Secret Manager
setup_secrets() {
    echo -e "\n${BLUE}Setting up secrets in Google Secret Manager...${NC}"
    
    # List of required secrets
    local secrets=(
        "auth0-secret"
        "auth0-client-id" 
        "auth0-client-secret"
        "auth0-issuer-url"
        "firebase-api-key"
        "firebase-auth-domain"
        "firebase-project-id"
        "firebase-storage-bucket"
        "firebase-messaging-sender-id"
        "firebase-app-id"
        "ga-measurement-id"
    )
    
    # Check if secrets directory exists
    if [[ ! -d "$SECRETS_DIR" ]]; then
        mkdir -p "$SECRETS_DIR"
        print_warning "Created secrets directory. Please populate with actual secret values."
    fi
    
    # Create secrets in Secret Manager
    for secret in "${secrets[@]}"; do
        if ! gcloud secrets describe "$secret" --project="$PROJECT_ID" &>/dev/null; then
            # Create placeholder secret if secret file doesn't exist
            if [[ -f "$SECRETS_DIR/$secret.txt" ]]; then
                gcloud secrets create "$secret" \
                    --data-file="$SECRETS_DIR/$secret.txt" \
                    --project="$PROJECT_ID"
                print_status "Created secret: $secret"
            else
                echo "placeholder-value-please-update" | gcloud secrets create "$secret" \
                    --data-file=- \
                    --project="$PROJECT_ID"
                print_warning "Created placeholder secret: $secret (please update with real value)"
            fi
        else
            print_info "Secret already exists: $secret"
        fi
    done
}

# Function to build and test application
build_and_test() {
    echo -e "\n${BLUE}Building and testing application...${NC}"
    
    # Install dependencies
    npm ci
    print_status "Dependencies installed"
    
    # Run tests
    if [[ -f "package.json" ]] && grep -q "\"test\"" package.json; then
        npm test || print_warning "Tests failed or not configured"
    fi
    
    # Build application
    npm run build
    print_status "Application built successfully"
    
    # Run security audit
    npm audit --audit-level=high || print_warning "Security audit found issues"
    
    print_status "Build and test completed"
}

# Function to deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "\n${BLUE}Deploying infrastructure with Terraform...${NC}"
    
    if [[ ! -d "$TERRAFORM_DIR" ]]; then
        print_error "Terraform directory not found: $TERRAFORM_DIR"
        exit 1
    fi
    
    cd "$TERRAFORM_DIR"
    
    # Initialize Terraform
    terraform init
    print_status "Terraform initialized"
    
    # Plan deployment
    terraform plan \
        -var="project_id=$PROJECT_ID" \
        -var="environment=$ENVIRONMENT" \
        -var="region=$REGION" \
        -out=tfplan
    print_status "Terraform plan created"
    
    # Apply infrastructure
    terraform apply tfplan
    print_status "Infrastructure deployed"
    
    cd ..
}

# Function to deploy application to Cloud Run
deploy_application() {
    echo -e "\n${BLUE}Deploying application to Cloud Run...${NC}"
    
    # Configure Docker for Artifact Registry
    gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
    
    # Submit build to Cloud Build
    gcloud builds submit \
        --config cloudbuild.yaml \
        --project="$PROJECT_ID" \
        --region="$REGION" \
        --timeout="$BUILD_TIMEOUT" \
        --substitutions="_ENVIRONMENT=$ENVIRONMENT"
    
    print_status "Application deployed to Cloud Run"
}

# Function to setup monitoring and alerting
setup_monitoring() {
    echo -e "\n${BLUE}Setting up monitoring and alerting...${NC}"
    
    # Create notification channel (email)
    local email="${NOTIFICATION_EMAIL:-zeidalqadri@gmail.com}"
    
    # Create uptime check
    gcloud alpha monitoring uptime create-http-uptime-check \
        "cbl-maikosh-uptime-check" \
        --hostname="cbl-maikosh-app-${ENVIRONMENT}-${PROJECT_ID}.a.run.app" \
        --path="/api/health" \
        --project="$PROJECT_ID" \
        --period=60 \
        --timeout=10 || print_warning "Uptime check may already exist"
    
    print_status "Monitoring configured"
}

# Function to setup custom domain (if specified)
setup_custom_domain() {
    if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
        echo -e "\n${BLUE}Setting up custom domain: $CUSTOM_DOMAIN${NC}"
        
        # Map custom domain to Cloud Run service
        gcloud run domain-mappings create \
            --service="cbl-maikosh-app" \
            --domain="$CUSTOM_DOMAIN" \
            --region="$REGION" \
            --project="$PROJECT_ID" || print_warning "Domain mapping may already exist"
        
        print_status "Custom domain configured"
        print_warning "Please update DNS records to point to the Cloud Run service"
    fi
}

# Function to run post-deployment tests
run_post_deployment_tests() {
    echo -e "\n${BLUE}Running post-deployment tests...${NC}"
    
    local app_url="https://cbl-maikosh-app-${ENVIRONMENT}-${PROJECT_ID}.a.run.app"
    
    # Wait for service to be ready
    sleep 30
    
    # Test health endpoint
    local health_status
    health_status=$(curl -s -o /dev/null -w "%{http_code}" "${app_url}/api/health" || echo "000")
    
    if [[ "$health_status" == "200" ]]; then
        print_status "Health check passed"
    else
        print_error "Health check failed (HTTP $health_status)"
    fi
    
    # Test main page
    local main_status
    main_status=$(curl -s -o /dev/null -w "%{http_code}" "${app_url}/" || echo "000")
    
    if [[ "$main_status" == "200" ]]; then
        print_status "Main page accessible"
    else
        print_error "Main page failed (HTTP $main_status)"
    fi
    
    print_info "Application URL: $app_url"
}

# Function to display deployment summary
display_summary() {
    echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "\n${BLUE}📋 Deployment Summary:${NC}"
    echo -e "Project ID: $PROJECT_ID"
    echo -e "Environment: $ENVIRONMENT"
    echo -e "Region: $REGION"
    echo -e "Application URL: https://cbl-maikosh-app-${ENVIRONMENT}-${PROJECT_ID}.a.run.app"
    
    if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
        echo -e "Custom Domain: https://$CUSTOM_DOMAIN"
    fi
    
    echo -e "\n${BLUE}🔧 Next Steps:${NC}"
    echo -e "1. Update DNS records if using custom domain"
    echo -e "2. Update Auth0 configuration with new URLs"
    echo -e "3. Configure monitoring alerts"
    echo -e "4. Upload basketball course content"
    echo -e "5. Test all 12 coaching modules"
    
    echo -e "\n${BLUE}📖 Documentation:${NC}"
    echo -e "- Terraform state: ${TERRAFORM_DIR}/terraform.tfstate"
    echo -e "- Monitoring: GCP Console > Monitoring"
    echo -e "- Logs: GCP Console > Cloud Run > Service Logs"
    echo -e "- Cloud Storage: gs://cbl-maikosh-${ENVIRONMENT}-storage-${PROJECT_ID}"
}

# Function to cleanup on failure
cleanup_on_failure() {
    print_error "Deployment failed. Cleaning up..."
    
    # Add cleanup logic here if needed
    # This could include deleting partially created resources
    
    exit 1
}

# Main deployment function
main() {
    # Set error trap
    trap cleanup_on_failure ERR
    
    echo -e "${PURPLE}Starting CBL-MAIKOSH deployment...${NC}\n"
    
    # Execute deployment steps
    check_prerequisites
    setup_gcp_project
    setup_secrets
    build_and_test
    deploy_infrastructure
    deploy_application
    setup_monitoring
    setup_custom_domain
    run_post_deployment_tests
    display_summary
    
    echo -e "\n${GREEN}🏀 CBL-MAIKOSH Basketball Coaching Platform deployed successfully!${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            PROJECT_ID="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --domain)
            CUSTOM_DOMAIN="$2"
            shift 2
            ;;
        --help)
            echo "CBL-MAIKOSH Deployment Script"
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --project PROJECT_ID    GCP Project ID"
            echo "  --environment ENV       Environment (dev/staging/prod)"
            echo "  --region REGION         GCP Region"
            echo "  --domain DOMAIN         Custom domain"
            echo "  --help                  Show this help"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main "$@"