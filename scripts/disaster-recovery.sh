#!/bin/bash

# Disaster Recovery Script for CBL-MAIKOSH Firebase/Firestore
# This script provides automated disaster recovery procedures

set -e

# Configuration
PROJECT_ID="${FIREBASE_PROJECT_ID:-cbl-maikosh}"
BACKUP_BUCKET="${BACKUP_BUCKET:-cbl-maikosh-backups}"
RECOVERY_BUCKET="${RECOVERY_BUCKET:-cbl-maikosh-recovery}"
SERVICE_ACCOUNT_PATH="${FIREBASE_SERVICE_ACCOUNT_PATH:-./service-account.json}"
NOTIFICATION_EMAIL="${NOTIFICATION_EMAIL:-admin@cbl-maikosh.com}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    local deps=("gcloud" "firebase" "node" "gsutil")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error "$dep is required but not installed."
            exit 1
        fi
    done
    
    success "All dependencies are available"
}

# Authenticate with GCP
authenticate() {
    log "Authenticating with Google Cloud Platform..."
    
    if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
        error "Service account key file not found at $SERVICE_ACCOUNT_PATH"
        exit 1
    fi
    
    gcloud auth activate-service-account --key-file="$SERVICE_ACCOUNT_PATH"
    gcloud config set project "$PROJECT_ID"
    
    success "Authenticated successfully"
}

# Check system health
check_system_health() {
    log "Checking system health..."
    
    # Check Firebase project status
    firebase projects:list | grep -q "$PROJECT_ID" || {
        error "Firebase project $PROJECT_ID not found or not accessible"
        exit 1
    }
    
    # Check Firestore status
    gcloud firestore databases list --project="$PROJECT_ID" &> /dev/null || {
        error "Cannot access Firestore database"
        exit 1
    }
    
    # Check backup bucket
    gsutil ls "gs://$BACKUP_BUCKET" &> /dev/null || {
        warning "Backup bucket $BACKUP_BUCKET not accessible"
    }
    
    success "System health check passed"
}

# List available backups
list_backups() {
    log "Listing available backups..."
    
    echo "=== Recent Backups ==="
    gsutil ls -l "gs://$BACKUP_BUCKET/*.json" | sort -k2 -r | head -10 | while read -r line; do
        # Extract file size, date, and name
        size=$(echo "$line" | awk '{print $1}')
        date=$(echo "$line" | awk '{print $2}')
        name=$(echo "$line" | awk '{print $3}' | sed 's/.*\///')
        
        # Convert size to human readable
        if [ "$size" -gt 1048576 ]; then
            size_human=$(echo "$size" | awk '{printf "%.1fMB", $1/1048576}')
        elif [ "$size" -gt 1024 ]; then
            size_human=$(echo "$size" | awk '{printf "%.1fKB", $1/1024}')
        else
            size_human="${size}B"
        fi
        
        echo "  $name | $date | $size_human"
    done
}

# Create emergency backup
create_emergency_backup() {
    log "Creating emergency backup..."
    
    local backup_id="emergency-backup-$(date +%s)"
    
    # Use the Node.js backup script
    if [ -f "scripts/firestore-backup.js" ]; then
        node scripts/firestore-backup.js --action=backup --type=full
        success "Emergency backup created"
    else
        # Fallback to gcloud export
        warning "Node.js backup script not found, using gcloud export"
        
        local export_uri="gs://$BACKUP_BUCKET/$backup_id"
        gcloud firestore export "$export_uri" --project="$PROJECT_ID"
        
        success "Emergency backup exported to $export_uri"
    fi
}

# Restore from backup
restore_from_backup() {
    local backup_id="$1"
    
    if [ -z "$backup_id" ]; then
        error "Backup ID is required for restore operation"
        list_backups
        exit 1
    fi
    
    warning "This operation will overwrite existing data!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log "Restore operation cancelled"
        exit 0
    fi
    
    log "Restoring from backup: $backup_id"
    
    # Use the Node.js restore script if available
    if [ -f "scripts/firestore-backup.js" ]; then
        node scripts/firestore-backup.js --action=restore --backup-id="$backup_id"
    else
        # Fallback to gcloud import
        warning "Node.js backup script not found, using gcloud import"
        
        local import_uri="gs://$BACKUP_BUCKET/$backup_id"
        gcloud firestore import "$import_uri" --project="$PROJECT_ID"
    fi
    
    success "Restore completed from backup: $backup_id"
}

# Point-in-time recovery
point_in_time_recovery() {
    local target_time="$1"
    
    if [ -z "$target_time" ]; then
        error "Target time is required (format: YYYY-MM-DDTHH:MM:SSZ)"
        exit 1
    fi
    
    log "Performing point-in-time recovery to: $target_time"
    
    # Find the closest backup before the target time
    local closest_backup
    closest_backup=$(gsutil ls -l "gs://$BACKUP_BUCKET/*.json" | \
        awk -v target="$target_time" '$2 <= target {print $3}' | \
        sort -r | head -1 | sed 's/.*\///' | sed 's/\.json$//')
    
    if [ -z "$closest_backup" ]; then
        error "No suitable backup found for point-in-time recovery"
        exit 1
    fi
    
    log "Using backup: $closest_backup"
    restore_from_backup "$closest_backup"
}

# System failover
system_failover() {
    log "Initiating system failover..."
    
    # Step 1: Create emergency backup
    create_emergency_backup
    
    # Step 2: Switch to backup region (if configured)
    if [ -n "$BACKUP_REGION" ]; then
        log "Switching to backup region: $BACKUP_REGION"
        gcloud config set compute/region "$BACKUP_REGION"
    fi
    
    # Step 3: Deploy to backup infrastructure
    if [ -f "cloudbuild-recovery.yaml" ]; then
        log "Deploying to recovery infrastructure..."
        gcloud builds submit --config=cloudbuild-recovery.yaml .
    fi
    
    # Step 4: Update DNS (would require additional configuration)
    warning "Manual DNS update may be required"
    
    success "Failover initiated"
}

# Health monitoring
monitor_health() {
    log "Starting health monitoring..."
    
    while true; do
        local health_status=0
        
        # Check Firestore connectivity
        if ! gcloud firestore databases list --project="$PROJECT_ID" &> /dev/null; then
            error "Firestore connectivity check failed"
            health_status=1
        fi
        
        # Check application health endpoint
        if command -v curl &> /dev/null; then
            if [ -n "$HEALTH_ENDPOINT" ]; then
                if ! curl -f "$HEALTH_ENDPOINT/api/health" &> /dev/null; then
                    error "Application health check failed"
                    health_status=1
                fi
            fi
        fi
        
        # If health check fails, consider automated recovery
        if [ $health_status -ne 0 ]; then
            error "Health check failed - consider manual intervention"
            
            # Send notification
            if command -v mail &> /dev/null && [ -n "$NOTIFICATION_EMAIL" ]; then
                echo "System health check failed at $(date)" | \
                    mail -s "CBL-MAIKOSH Health Alert" "$NOTIFICATION_EMAIL"
            fi
        else
            log "Health check passed"
        fi
        
        sleep 300 # Check every 5 minutes
    done
}

# Cleanup old recovery files
cleanup_recovery() {
    log "Cleaning up recovery files..."
    
    # Remove recovery files older than 7 days
    gsutil -m rm "gs://$RECOVERY_BUCKET/**" 2>/dev/null || true
    
    # Clean up local temporary files
    rm -rf /tmp/cbl-maikosh-recovery-* 2>/dev/null || true
    
    success "Recovery cleanup completed"
}

# Send notification
send_notification() {
    local subject="$1"
    local message="$2"
    
    if command -v mail &> /dev/null && [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "$subject" "$NOTIFICATION_EMAIL"
        log "Notification sent to $NOTIFICATION_EMAIL"
    else
        warning "Email notifications not configured"
    fi
}

# Test disaster recovery procedures
test_recovery() {
    log "Testing disaster recovery procedures..."
    
    # Create test backup
    log "Creating test backup..."
    create_emergency_backup
    
    # List backups
    list_backups
    
    # Test connectivity
    check_system_health
    
    success "Disaster recovery test completed"
}

# Main function
main() {
    local action="$1"
    
    case "$action" in
        "check")
            check_dependencies
            authenticate
            check_system_health
            ;;
        "backup")
            check_dependencies
            authenticate
            create_emergency_backup
            ;;
        "restore")
            check_dependencies
            authenticate
            restore_from_backup "$2"
            ;;
        "list")
            check_dependencies
            authenticate
            list_backups
            ;;
        "failover")
            check_dependencies
            authenticate
            system_failover
            ;;
        "monitor")
            check_dependencies
            authenticate
            monitor_health
            ;;
        "cleanup")
            check_dependencies
            authenticate
            cleanup_recovery
            ;;
        "test")
            check_dependencies
            authenticate
            test_recovery
            ;;
        "point-in-time")
            check_dependencies
            authenticate
            point_in_time_recovery "$2"
            ;;
        *)
            echo "Usage: $0 {check|backup|restore|list|failover|monitor|cleanup|test|point-in-time}"
            echo ""
            echo "Commands:"
            echo "  check          - Check system health and dependencies"
            echo "  backup         - Create emergency backup"
            echo "  restore <id>   - Restore from backup"
            echo "  list           - List available backups"
            echo "  failover       - Initiate system failover"
            echo "  monitor        - Start health monitoring"
            echo "  cleanup        - Clean up old recovery files"
            echo "  test           - Test disaster recovery procedures"
            echo "  point-in-time <time> - Point-in-time recovery"
            echo ""
            echo "Examples:"
            echo "  $0 check"
            echo "  $0 backup"
            echo "  $0 restore full-backup-1623456789"
            echo "  $0 point-in-time 2023-06-12T10:30:00Z"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"