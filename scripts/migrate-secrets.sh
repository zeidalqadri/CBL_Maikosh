#!/bin/bash
# CBL-MAIKOSH Secret Migration Script
# Migrates environment variables to Google Secret Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${PROJECT_ID:-zeidgeistdotcom}
ENV_FILE=${ENV_FILE:-".env.production"}
BACKUP_DIR="./secret-backups"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
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

# Function to check if secret exists
secret_exists() {
    local secret_name=$1
    gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1
}

# Function to create secret if it doesn't exist
create_secret() {
    local secret_name=$1
    local secret_value=$2
    local labels=$3
    
    if secret_exists "$secret_name"; then
        log_warning "Secret $secret_name already exists, updating version..."
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    else
        log "Creating secret $secret_name..."
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --project="$PROJECT_ID" $labels
    fi
}

# Function to backup current secrets
backup_secrets() {
    log "Creating backup of current secrets..."
    mkdir -p "$BACKUP_DIR"
    
    # Get list of existing secrets
    local secrets=($(gcloud secrets list --project="$PROJECT_ID" --format="value(name)" --filter="labels.application=cbl-maikosh"))
    
    for secret in "${secrets[@]}"; do
        local secret_name=$(basename "$secret")
        log "Backing up $secret_name..."
        gcloud secrets versions access latest --secret="$secret_name" --project="$PROJECT_ID" > "$BACKUP_DIR/$secret_name.backup"
    done
    
    log_success "Secrets backed up to $BACKUP_DIR"
}

# Main migration function
migrate_secrets() {
    log "🏀 Starting CBL-MAIKOSH Secret Migration..."
    
    # Check if gcloud is installed and authenticated
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if user is authenticated
    if ! gcloud auth application-default print-access-token >/dev/null 2>&1; then
        log_error "Not authenticated with gcloud. Please run: gcloud auth application-default login"
        exit 1
    fi
    
    # Set project
    gcloud config set project "$PROJECT_ID"
    
    # Enable Secret Manager API if not already enabled
    log "Enabling Secret Manager API..."
    gcloud services enable secretmanager.googleapis.com --project="$PROJECT_ID"
    
    # Create backup first
    backup_secrets
    
    # Common labels for all secrets
    local common_labels="--labels=application=cbl-maikosh,environment=production,managed-by=terraform"
    
    # Migrate Auth0 secrets
    log "🔐 Migrating Auth0 secrets..."
    
    # Auth0 configuration as JSON
    local auth0_config=$(cat <<EOF
{
    "AUTH0_BASE_URL": "${AUTH0_BASE_URL:-https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app}",
    "AUTH0_ISSUER_BASE_URL": "${AUTH0_ISSUER_BASE_URL}",
    "AUTH0_CLIENT_ID": "${AUTH0_CLIENT_ID}",
    "AUTH0_AUDIENCE": "${AUTH0_AUDIENCE:-}"
}
EOF
)
    
    create_secret "auth0-config" "$auth0_config" "$common_labels,component=auth0,category=configuration"
    create_secret "auth0-secret-key" "${AUTH0_SECRET}" "$common_labels,component=auth0,category=authentication"
    create_secret "auth0-client-secret" "${AUTH0_CLIENT_SECRET}" "$common_labels,component=auth0,category=authentication"
    
    # Migrate Firebase secrets
    log "🔥 Migrating Firebase secrets..."
    
    local firebase_config=$(cat <<EOF
{
    "FIREBASE_API_KEY": "${FIREBASE_API_KEY}",
    "FIREBASE_AUTH_DOMAIN": "${FIREBASE_AUTH_DOMAIN}",
    "FIREBASE_PROJECT_ID": "${FIREBASE_PROJECT_ID}",
    "FIREBASE_STORAGE_BUCKET": "${FIREBASE_STORAGE_BUCKET}",
    "FIREBASE_MESSAGING_SENDER_ID": "${FIREBASE_MESSAGING_SENDER_ID}",
    "FIREBASE_APP_ID": "${FIREBASE_APP_ID}"
}
EOF
)
    
    create_secret "firebase-config" "$firebase_config" "$common_labels,component=firebase,category=configuration"
    
    # Migrate Analytics secrets
    log "📊 Migrating Analytics secrets..."
    
    local analytics_config=$(cat <<EOF
{
    "NEXT_PUBLIC_GA_MEASUREMENT_ID": "${NEXT_PUBLIC_GA_MEASUREMENT_ID}",
    "NEXT_PUBLIC_LOGROCKET_ID": "${NEXT_PUBLIC_LOGROCKET_ID}"
}
EOF
)
    
    create_secret "analytics-config" "$analytics_config" "$common_labels,component=analytics,category=configuration"
    create_secret "sentry-dsn" "${NEXT_PUBLIC_SENTRY_DSN}" "$common_labels,component=monitoring,category=error-reporting"
    
    # Migrate SMTP secrets
    log "📧 Migrating SMTP secrets..."
    
    local smtp_config=$(cat <<EOF
{
    "SMTP_HOST": "${SMTP_HOST:-smtp.gmail.com}",
    "SMTP_PORT": "${SMTP_PORT:-587}",
    "SMTP_USER": "${SMTP_USER}",
    "SMTP_PASS": "${SMTP_PASS}"
}
EOF
)
    
    create_secret "smtp-config" "$smtp_config" "$common_labels,component=notifications,category=email"
    
    # Migrate API keys
    log "🔑 Migrating API keys..."
    
    local api_keys_config=$(cat <<EOF
{
    "VIMEO_ACCESS_TOKEN": "${VIMEO_ACCESS_TOKEN:-}",
    "YOUTUBE_API_KEY": "${YOUTUBE_API_KEY:-}",
    "NBA_API_KEY": "${NBA_API_KEY:-}",
    "SPORTS_RADAR_API_KEY": "${SPORTS_RADAR_API_KEY:-}"
}
EOF
)
    
    create_secret "external-api-keys" "$api_keys_config" "$common_labels,component=integrations,category=api-keys"
    
    # Generate and store application encryption key if not exists
    log "🔒 Creating application encryption key..."
    
    local app_encryption_key
    if secret_exists "app-encryption-key"; then
        log_warning "Application encryption key already exists, skipping generation..."
    else
        app_encryption_key=$(openssl rand -base64 32)
        create_secret "app-encryption-key" "$app_encryption_key" "$common_labels,component=encryption,category=application"
    fi
    
    # Generate and store JWT signing key if not exists
    log "🔐 Creating JWT signing key..."
    
    local jwt_signing_key
    if secret_exists "jwt-signing-key"; then
        log_warning "JWT signing key already exists, skipping generation..."
    else
        jwt_signing_key=$(openssl rand -base64 64)
        create_secret "jwt-signing-key" "$jwt_signing_key" "$common_labels,component=authentication,category=jwt"
    fi
    
    log_success "All secrets migrated successfully!"
}

# Function to verify migration
verify_migration() {
    log "🔍 Verifying secret migration..."
    
    local secrets=("auth0-config" "auth0-secret-key" "auth0-client-secret" "firebase-config" "analytics-config" "sentry-dsn" "smtp-config" "external-api-keys" "app-encryption-key" "jwt-signing-key")
    
    local failed=0
    for secret in "${secrets[@]}"; do
        if secret_exists "$secret"; then
            log_success "✅ $secret exists"
        else
            log_error "❌ $secret is missing"
            ((failed++))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        log_success "🎉 All secrets verified successfully!"
        return 0
    else
        log_error "💥 $failed secrets failed verification"
        return 1
    fi
}

# Function to generate Cloud Run environment file with secret references
generate_cloud_run_env() {
    log "📝 Generating Cloud Run environment configuration..."
    
    cat > ".env.cloud-run" <<EOF
# CBL-MAIKOSH Cloud Run Environment Configuration
# This file contains secret references for Cloud Run deployment

# Application Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HOSTNAME=0.0.0.0
PORT=8080

# GCP Configuration
GCP_PROJECT_ID=$PROJECT_ID
GCP_STORAGE_BUCKET=cbl-maikosh-prod-storage-$PROJECT_ID

# Secret Manager References (use in Cloud Run YAML)
# AUTH0_CONFIG_SECRET=projects/$PROJECT_ID/secrets/auth0-config/versions/latest
# AUTH0_SECRET_SECRET=projects/$PROJECT_ID/secrets/auth0-secret-key/versions/latest
# AUTH0_CLIENT_SECRET_SECRET=projects/$PROJECT_ID/secrets/auth0-client-secret/versions/latest
# FIREBASE_CONFIG_SECRET=projects/$PROJECT_ID/secrets/firebase-config/versions/latest
# ANALYTICS_CONFIG_SECRET=projects/$PROJECT_ID/secrets/analytics-config/versions/latest
# SENTRY_DSN_SECRET=projects/$PROJECT_ID/secrets/sentry-dsn/versions/latest
# SMTP_CONFIG_SECRET=projects/$PROJECT_ID/secrets/smtp-config/versions/latest
# API_KEYS_SECRET=projects/$PROJECT_ID/secrets/external-api-keys/versions/latest
# APP_ENCRYPTION_KEY_SECRET=projects/$PROJECT_ID/secrets/app-encryption-key/versions/latest
# JWT_SIGNING_KEY_SECRET=projects/$PROJECT_ID/secrets/jwt-signing-key/versions/latest

# Public Configuration (safe to expose)
NEXT_PUBLIC_API_URL=https://cbl-maikosh-app-prod-$PROJECT_ID.a.run.app/api
ALLOWED_ORIGINS=https://cblmaikosh.com,https://www.cblmaikosh.com,https://cbl-maikosh-app-prod-$PROJECT_ID.a.run.app

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_A11Y_FEATURES=true
ENABLE_ADVANCED_MODULES=true
ENABLE_VIDEO_STREAMING=true
ENABLE_PROGRESS_TRACKING=true
ENABLE_COACH_DASHBOARD=true

# Performance Configuration
NEXT_CACHE_TTL=86400
STATIC_CACHE_TTL=31536000
NEXT_SHARP=1
IMAGES_CACHE_TTL=86400

# Rate Limiting
API_RATE_LIMIT_WINDOW=900000
API_RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_SKIP_SUCCESS=false

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_FREQUENCY=daily
BACKUP_RETENTION_DAYS=30

# Localization
DEFAULT_LOCALE=en-US
SUPPORTED_LOCALES=en-US,es-ES,fr-FR

# Performance Budgets
MAX_CONCURRENT_USERS=1000
PERFORMANCE_BUDGET_JS=200kb
PERFORMANCE_BUDGET_CSS=50kb
PERFORMANCE_BUDGET_IMAGES=500kb
EOF
    
    log_success "Cloud Run environment configuration generated: .env.cloud-run"
}

# Function to update Cloud Run service with secrets
update_cloud_run_secrets() {
    log "🚀 Updating Cloud Run service with secret references..."
    
    # This would typically be done via Terraform or Cloud Run YAML
    cat > "cloud-run-secrets.yaml" <<EOF
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: cbl-maikosh-app-prod
  labels:
    application: cbl-maikosh
    environment: production
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
        run.googleapis.com/cpu-throttling: "false"
    spec:
      serviceAccountName: ${PROJECT_ID}@appspot.gserviceaccount.com
      containers:
      - image: gcr.io/${PROJECT_ID}/cbl-maikosh:latest
        env:
        - name: AUTH0_SECRET
          valueFrom:
            secretKeyRef:
              key: auth0-secret-key
              name: auth0-secret-key
        - name: AUTH0_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              key: auth0-client-secret
              name: auth0-client-secret
        - name: FIREBASE_CONFIG
          valueFrom:
            secretKeyRef:
              key: firebase-config
              name: firebase-config
        - name: SENTRY_DSN
          valueFrom:
            secretKeyRef:
              key: sentry-dsn
              name: sentry-dsn
        - name: SMTP_CONFIG
          valueFrom:
            secretKeyRef:
              key: smtp-config
              name: smtp-config
        - name: APP_ENCRYPTION_KEY
          valueFrom:
            secretKeyRef:
              key: app-encryption-key
              name: app-encryption-key
        - name: JWT_SIGNING_KEY
          valueFrom:
            secretKeyRef:
              key: jwt-signing-key
              name: jwt-signing-key
        resources:
          limits:
            memory: 2Gi
            cpu: 2000m
        ports:
        - containerPort: 8080
EOF
    
    log_success "Cloud Run secrets configuration generated: cloud-run-secrets.yaml"
}

# Function to set up secret access permissions
setup_secret_permissions() {
    log "🔐 Setting up secret access permissions..."
    
    local service_account="cbl-maikosh-service@${PROJECT_ID}.iam.gserviceaccount.com"
    local secrets=("auth0-config" "auth0-secret-key" "auth0-client-secret" "firebase-config" "analytics-config" "sentry-dsn" "smtp-config" "external-api-keys" "app-encryption-key" "jwt-signing-key")
    
    for secret in "${secrets[@]}"; do
        log "Granting access to $secret..."
        gcloud secrets add-iam-policy-binding "$secret" \
            --member="serviceAccount:$service_account" \
            --role="roles/secretmanager.secretAccessor" \
            --project="$PROJECT_ID"
    done
    
    log_success "Secret access permissions configured"
}

# Function to clean up old environment variables
cleanup_instructions() {
    log "📋 Cleanup Instructions:"
    log_warning "After verifying that secrets are working correctly:"
    log_warning "1. Remove sensitive values from .env.production"
    log_warning "2. Update your deployment scripts to use secret references"
    log_warning "3. Rotate any secrets that may have been exposed"
    log_warning "4. Update your documentation with new secret management procedures"
    
    cat > "cleanup-checklist.md" <<EOF
# CBL-MAIKOSH Secret Migration Cleanup Checklist

## ✅ Post-Migration Tasks

### 1. Verify Secret Access
- [ ] Test that the application can access all secrets
- [ ] Verify authentication flows work correctly
- [ ] Check that Firebase integration is functional
- [ ] Test email notifications (if applicable)

### 2. Security Cleanup
- [ ] Remove sensitive values from .env.production
- [ ] Remove sensitive values from any other environment files
- [ ] Update CI/CD pipelines to use secret references
- [ ] Revoke any exposed API keys and generate new ones

### 3. Documentation Updates
- [ ] Update deployment documentation
- [ ] Document secret rotation procedures
- [ ] Update troubleshooting guides
- [ ] Train team members on new secret management

### 4. Monitoring Setup
- [ ] Set up alerts for secret access failures
- [ ] Monitor secret usage patterns
- [ ] Set up secret rotation schedules
- [ ] Review access logs regularly

### 5. Backup and Recovery
- [ ] Verify secret backups are working
- [ ] Test secret recovery procedures
- [ ] Document emergency access procedures
- [ ] Set up cross-region replication if needed

## 📋 Secret Rotation Schedule
- JWT Signing Key: Every 30 days
- Auth0 Client Secret: Every 90 days
- Application Encryption Key: Every 180 days
- API Keys: As required by providers
- SMTP Password: Every 180 days

## 🚨 Emergency Contacts
- Project Owner: zeidalqadri@gmail.com
- GCP Support: [Contact information]
- Security Team: [Contact information]
EOF
    
    log_success "Cleanup checklist created: cleanup-checklist.md"
}

# Main execution
main() {
    case "${1:-migrate}" in
        "migrate")
            migrate_secrets
            verify_migration
            generate_cloud_run_env
            update_cloud_run_secrets
            setup_secret_permissions
            cleanup_instructions
            ;;
        "verify")
            verify_migration
            ;;
        "backup")
            backup_secrets
            ;;
        "permissions")
            setup_secret_permissions
            ;;
        *)
            echo "Usage: $0 [migrate|verify|backup|permissions]"
            echo ""
            echo "Commands:"
            echo "  migrate     - Migrate all secrets to Secret Manager (default)"
            echo "  verify      - Verify that all secrets exist"
            echo "  backup      - Backup existing secrets"
            echo "  permissions - Set up secret access permissions"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"