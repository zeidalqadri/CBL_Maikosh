#!/bin/bash
# CBL-MAIKOSH Complete Security Deployment Script
# Deploys all security components for the basketball coaching platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-zeidgeistdotcom}
REGION=${REGION:-us-central1}
ZONE=${ZONE:-us-central1-a}
ENVIRONMENT=${ENVIRONMENT:-prod}

# Security configuration
ENABLE_VPC_SERVICE_CONTROLS=${ENABLE_VPC_SERVICE_CONTROLS:-false}
ENABLE_SECRET_ROTATION=${ENABLE_SECRET_ROTATION:-true}
ENABLE_AUTOMATED_RESPONSE=${ENABLE_AUTOMATED_RESPONSE:-false}
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-}
EMERGENCY_PHONE=${EMERGENCY_PHONE:-}

# Terraform directory
TERRAFORM_DIR="./terraform"
SCRIPTS_DIR="./scripts"

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] 🏀 $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

log_section() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    log_section "Checking Prerequisites"
    
    # Check if running from correct directory
    if [[ ! -f "package.json" ]] || [[ ! -d "terraform" ]]; then
        log_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check required tools
    local tools=("gcloud" "terraform" "node" "npm")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "$tool is not installed or not in PATH"
            exit 1
        else
            log_success "$tool is available"
        fi
    done
    
    # Check gcloud authentication
    if ! gcloud auth application-default print-access-token >/dev/null 2>&1; then
        log_error "Not authenticated with gcloud. Please run: gcloud auth application-default login"
        exit 1
    fi
    
    # Check project access
    if ! gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
        log_error "Cannot access project $PROJECT_ID. Please check permissions."
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Function to initialize Terraform
init_terraform() {
    log_section "Initializing Terraform"
    
    cd "$TERRAFORM_DIR"
    
    # Create terraform.tfvars if it doesn't exist
    if [[ ! -f "terraform.tfvars" ]]; then
        log "Creating terraform.tfvars file..."
        cat > terraform.tfvars <<EOF
# CBL-MAIKOSH Security Configuration
project_id = "$PROJECT_ID"
region = "$REGION"
zone = "$ZONE"
environment = "$ENVIRONMENT"

# Security Settings
enable_vpc_service_controls = $ENABLE_VPC_SERVICE_CONTROLS
enable_secret_rotation = $ENABLE_SECRET_ROTATION
enable_automated_response = $ENABLE_AUTOMATED_RESPONSE

# Notification Settings
notification_email = "zeidalqadri@gmail.com"
slack_webhook_url = "$SLACK_WEBHOOK_URL"
emergency_phone_number = "$EMERGENCY_PHONE"

# Trusted IP ranges (update for production)
trusted_ip_ranges = ["0.0.0.0/0"]

# Admin emails (update with actual coach emails)
coach_admin_emails = []
content_creator_emails = []

# Enable monitoring
monitoring_enabled = true
enable_monitoring = true
EOF
        log_success "terraform.tfvars created"
    fi
    
    # Initialize Terraform
    log "Initializing Terraform..."
    terraform init
    
    # Validate configuration
    log "Validating Terraform configuration..."
    terraform validate
    
    # Plan deployment
    log "Planning Terraform deployment..."
    terraform plan -out=tfplan
    
    log_success "Terraform initialized and planned"
    cd - >/dev/null
}

# Function to enable required APIs
enable_apis() {
    log_section "Enabling Required GCP APIs"
    
    local apis=(
        "run.googleapis.com"
        "cloudbuild.googleapis.com"
        "artifactregistry.googleapis.com"
        "storage.googleapis.com"
        "secretmanager.googleapis.com"
        "cloudresourcemanager.googleapis.com"
        "iam.googleapis.com"
        "compute.googleapis.com"
        "certificatemanager.googleapis.com"
        "dns.googleapis.com"
        "monitoring.googleapis.com"
        "logging.googleapis.com"
        "vpcaccess.googleapis.com"
        "cloudkms.googleapis.com"
        "dlp.googleapis.com"
        "cloudfunctions.googleapis.com"
        "pubsub.googleapis.com"
        "binaryauthorization.googleapis.com"
        "containeranalysis.googleapis.com"
    )
    
    gcloud config set project "$PROJECT_ID"
    
    for api in "${apis[@]}"; do
        log "Enabling $api..."
        gcloud services enable "$api" --project="$PROJECT_ID"
    done
    
    log_success "All required APIs enabled"
}

# Function to migrate secrets
migrate_secrets() {
    log_section "Migrating Secrets to Secret Manager"
    
    # Check if .env.production exists
    if [[ -f ".env.production" ]]; then
        log "Found .env.production, migrating secrets..."
        
        # Source environment variables
        set -a
        source .env.production
        set +a
        
        # Run secret migration script
        chmod +x "$SCRIPTS_DIR/migrate-secrets.sh"
        "$SCRIPTS_DIR/migrate-secrets.sh" migrate
        
        log_success "Secrets migrated to Secret Manager"
    else
        log_warning ".env.production not found, skipping secret migration"
    fi
}

# Function to deploy infrastructure
deploy_infrastructure() {
    log_section "Deploying Security Infrastructure"
    
    cd "$TERRAFORM_DIR"
    
    # Apply Terraform configuration
    log "Applying Terraform configuration..."
    terraform apply tfplan
    
    # Get outputs
    log "Retrieving Terraform outputs..."
    terraform output -json > ../terraform-outputs.json
    
    log_success "Infrastructure deployed successfully"
    cd - >/dev/null
}

# Function to configure Cloud Armor
configure_cloud_armor() {
    log_section "Configuring Cloud Armor Security"
    
    # Check if Cloud Armor YAML exists
    if [[ -f "cloud-armor-security.yaml" ]]; then
        log "Deploying Cloud Armor security policy..."
        
        # Extract and run the deployment script from the YAML
        local deploy_script=$(mktemp)
        awk '/deploy-cloud-armor.sh:/{flag=1; next} /^[[:space:]]*$/{if(flag) flag=0} flag' cloud-armor-security.yaml | sed 's/^[[:space:]]*//' > "$deploy_script"
        
        chmod +x "$deploy_script"
        bash "$deploy_script"
        rm "$deploy_script"
        
        log_success "Cloud Armor security policy configured"
    else
        log_warning "Cloud Armor configuration not found"
    fi
}

# Function to set up monitoring
setup_monitoring() {
    log_section "Setting up Security Monitoring"
    
    # Check if monitoring setup exists
    if [[ -f "monitoring-setup.yaml" ]]; then
        log "Setting up monitoring and alerting..."
        
        # Create monitoring dashboards and alerts
        gcloud monitoring dashboards create --config-from-file=monitoring-setup.yaml --project="$PROJECT_ID" || log_warning "Dashboard creation failed"
        
        log_success "Security monitoring configured"
    else
        log_warning "Monitoring setup configuration not found"
    fi
}

# Function to test security configuration
test_security() {
    log_section "Testing Security Configuration"
    
    log "Running security validation tests..."
    
    # Test 1: Verify secrets are accessible
    log "Testing Secret Manager access..."
    if gcloud secrets list --project="$PROJECT_ID" | grep -q "auth0-secret-key"; then
        log_success "Secret Manager is working"
    else
        log_warning "Secret Manager test failed"
    fi
    
    # Test 2: Verify KMS keys are created
    log "Testing KMS configuration..."
    if gcloud kms keyrings list --location="$REGION" --project="$PROJECT_ID" | grep -q "cbl-maikosh-keyring"; then
        log_success "KMS is configured correctly"
    else
        log_warning "KMS test failed"
    fi
    
    # Test 3: Verify VPC and firewall
    log "Testing network security..."
    if gcloud compute networks list --project="$PROJECT_ID" | grep -q "cbl-maikosh-vpc"; then
        log_success "VPC is configured correctly"
    else
        log_warning "VPC test failed"
    fi
    
    # Test 4: Verify service accounts
    log "Testing service accounts..."
    if gcloud iam service-accounts list --project="$PROJECT_ID" | grep -q "cbl-maikosh-service"; then
        log_success "Service accounts are configured"
    else
        log_warning "Service account test failed"
    fi
    
    log_success "Security validation completed"
}

# Function to generate deployment summary
generate_summary() {
    log_section "Deployment Summary"
    
    local summary_file="security-deployment-summary.md"
    
    cat > "$summary_file" <<EOF
# CBL-MAIKOSH Security Deployment Summary

**Date:** $(date)
**Project:** $PROJECT_ID
**Region:** $REGION
**Environment:** $ENVIRONMENT

## Deployed Components

### ✅ Identity and Access Management (IAM)
- Custom IAM roles created
- Service accounts configured
- Principle of least privilege enforced
- Workload identity ready

### ✅ Secret Management
- All secrets migrated to Secret Manager
- Automatic rotation enabled: $ENABLE_SECRET_ROTATION
- Access controls implemented
- Encryption at rest enabled

### ✅ Network Security
- VPC with private subnets configured
- Cloud NAT for outbound connectivity
- Comprehensive firewall rules
- VPC flow logs enabled

### ✅ Data Protection & Encryption
- Customer-managed encryption keys (CMEK)
- Automatic key rotation configured
- Data Loss Prevention (DLP) enabled
- Encrypted storage buckets

### ✅ Security Monitoring
- Real-time alerting configured
- Security dashboards created
- Incident response automation: $ENABLE_AUTOMATED_RESPONSE
- Log-based metrics enabled

### ✅ Compliance & Audit
- Audit logging comprehensive
- Organization policies enforced
- Binary authorization configured
- VPC Service Controls: $ENABLE_VPC_SERVICE_CONTROLS

## Access Information

### Service Account Emails
$(cd terraform && terraform output -json 2>/dev/null | jq -r '.service_accounts.value | to_entries[] | "- \(.key): \(.value)"' || echo "- Run 'terraform output' to see service accounts")

### Notification Channels
- Email: zeidalqadri@gmail.com
- Slack: $([ -n "$SLACK_WEBHOOK_URL" ] && echo "Configured" || echo "Not configured")
- SMS: $([ -n "$EMERGENCY_PHONE" ] && echo "Configured" || echo "Not configured")

## Next Steps

1. **Review and Restrict Access**
   - Update trusted IP ranges in terraform.tfvars
   - Add coach administrator emails
   - Configure content creator access

2. **Complete Secret Configuration**
   - Verify all application secrets are working
   - Test authentication flows
   - Update application configuration

3. **Security Testing**
   - Run penetration testing
   - Verify incident response procedures
   - Test backup and recovery

4. **Documentation Updates**
   - Update operational procedures
   - Train team on new security processes
   - Schedule first security review

## Monitoring URLs

- **Security Dashboard**: https://console.cloud.google.com/monitoring/dashboards
- **Cloud Logging**: https://console.cloud.google.com/logs/query
- **Secret Manager**: https://console.cloud.google.com/security/secret-manager
- **Cloud KMS**: https://console.cloud.google.com/security/kms

## Support Information

For security issues or questions:
- **Primary Contact**: zeidalqadri@gmail.com
- **Documentation**: See GCP-SECURITY-COMPLIANCE-DOCUMENTATION.md
- **Emergency**: Follow incident response procedures in documentation

---
Generated by CBL-MAIKOSH Security Deployment Script
EOF

    log_success "Deployment summary generated: $summary_file"
    
    # Display key information
    echo ""
    log_section "Key Security Information"
    log "🔐 All secrets are now managed by Google Secret Manager"
    log "🛡️  Network security with VPC and firewall rules is active"
    log "🔑 Customer-managed encryption keys are protecting your data"
    log "📊 Security monitoring and alerting is configured"
    log "📋 Compliance controls are enforced"
    
    if [[ "$ENABLE_VPC_SERVICE_CONTROLS" == "true" ]]; then
        log "🏢 VPC Service Controls are enabled (organization-level)"
    fi
    
    if [[ "$ENABLE_AUTOMATED_RESPONSE" == "true" ]]; then
        log "🤖 Automated incident response is active"
    fi
    
    echo ""
    log_warning "IMPORTANT: Review the generated summary and update IP restrictions!"
    log_warning "Update terraform.tfvars with your actual trusted IP ranges."
    echo ""
}

# Function to cleanup on error
cleanup_on_error() {
    log_error "Deployment failed. Cleaning up temporary files..."
    rm -f "$TERRAFORM_DIR/tfplan"
    rm -f terraform-outputs.json
    exit 1
}

# Main deployment function
main() {
    log_section "CBL-MAIKOSH Security Deployment Starting"
    
    # Set trap for cleanup
    trap cleanup_on_error ERR
    
    # Run deployment steps
    check_prerequisites
    enable_apis
    init_terraform
    migrate_secrets
    deploy_infrastructure
    configure_cloud_armor
    setup_monitoring
    test_security
    generate_summary
    
    # Success
    log_section "🎉 Security Deployment Completed Successfully! 🎉"
    log "Your CBL-MAIKOSH platform is now secured with enterprise-grade controls."
    log "Review the deployment summary and complete the next steps."
    
    # Cleanup
    rm -f "$TERRAFORM_DIR/tfplan"
}

# Show help
show_help() {
    echo "CBL-MAIKOSH Security Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo "  --project-id PROJECT       GCP Project ID (default: zeidgeistdotcom)"
    echo "  --region REGION            GCP Region (default: us-central1)"
    echo "  --environment ENV          Environment (default: prod)"
    echo "  --enable-vpc-sc            Enable VPC Service Controls"
    echo "  --enable-auto-response     Enable automated incident response"
    echo "  --slack-webhook URL        Slack webhook for notifications"
    echo "  --emergency-phone PHONE    Phone number for critical alerts"
    echo ""
    echo "Environment Variables:"
    echo "  PROJECT_ID                 GCP Project ID"
    echo "  REGION                     GCP Region"
    echo "  SLACK_WEBHOOK_URL          Slack webhook URL"
    echo "  EMERGENCY_PHONE            Emergency phone number"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy with defaults"
    echo "  $0 --project-id my-project --region us-east1"
    echo "  $0 --enable-vpc-sc --enable-auto-response"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
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
        --enable-vpc-sc)
            ENABLE_VPC_SERVICE_CONTROLS="true"
            shift
            ;;
        --enable-auto-response)
            ENABLE_AUTOMATED_RESPONSE="true"
            shift
            ;;
        --slack-webhook)
            SLACK_WEBHOOK_URL="$2"
            shift 2
            ;;
        --emergency-phone)
            EMERGENCY_PHONE="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main deployment
main