#!/bin/bash

# CBL-MAIKOSH Monitoring and Alerting Setup Script
# Configures comprehensive monitoring, logging, and alerting for the platform

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-}"
NOTIFICATION_CHANNEL="${SLACK_CHANNEL:-}"
EMAIL_RECIPIENTS="${EMAIL_RECIPIENTS:-}"

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

# Validate prerequisites
validate_setup() {
    if [[ -z "$PROJECT_ID" ]]; then
        log_error "PROJECT_ID environment variable not set"
        exit 1
    fi

    # Check if user has required permissions
    if ! gcloud projects get-iam-policy "$PROJECT_ID" &>/dev/null; then
        log_error "Insufficient permissions for project $PROJECT_ID"
        exit 1
    fi

    log_info "Validation completed successfully"
}

# Enable required APIs
enable_apis() {
    log_info "Enabling required Google Cloud APIs..."
    
    local apis=(
        "monitoring.googleapis.com"
        "logging.googleapis.com"
        "clouderrorreporting.googleapis.com"
        "cloudtrace.googleapis.com"
        "cloudprofiler.googleapis.com"
        "run.googleapis.com"
    )

    for api in "${apis[@]}"; do
        log_info "Enabling $api..."
        gcloud services enable "$api" --project="$PROJECT_ID"
    done

    log_success "APIs enabled successfully"
}

# Create custom log-based metrics
create_log_metrics() {
    log_info "Creating custom log-based metrics..."

    # Error rate metric
    gcloud logging metrics create cbl_maikosh_error_rate \
        --description="CBL-MAIKOSH application error rate" \
        --log-filter='resource.type="cloud_run_revision"
resource.labels.service_name=~"cbl-maikosh-app.*"
severity>=ERROR' \
        --project="$PROJECT_ID" || log_warning "Error rate metric may already exist"

    # Response time metric (for requests over 5 seconds)
    gcloud logging metrics create cbl_maikosh_slow_requests \
        --description="CBL-MAIKOSH slow requests (>5s)" \
        --log-filter='resource.type="cloud_run_revision"
resource.labels.service_name=~"cbl-maikosh-app.*"
httpRequest.latency>"5s"' \
        --project="$PROJECT_ID" || log_warning "Slow requests metric may already exist"

    # User authentication failures
    gcloud logging metrics create cbl_maikosh_auth_failures \
        --description="CBL-MAIKOSH authentication failures" \
        --log-filter='resource.type="cloud_run_revision"
resource.labels.service_name=~"cbl-maikosh-app.*"
textPayload=~"authentication.*failed"' \
        --project="$PROJECT_ID" || log_warning "Auth failures metric may already exist"

    # Database connection errors
    gcloud logging metrics create cbl_maikosh_db_errors \
        --description="CBL-MAIKOSH database connection errors" \
        --log-filter='resource.type="cloud_run_revision"
resource.labels.service_name=~"cbl-maikosh-app.*"
(textPayload=~"database.*error" OR textPayload=~"connection.*failed")' \
        --project="$PROJECT_ID" || log_warning "DB errors metric may already exist"

    log_success "Log-based metrics created successfully"
}

# Create notification channels
create_notification_channels() {
    log_info "Creating notification channels..."

    # Create email notification channel
    if [[ -n "$EMAIL_RECIPIENTS" ]]; then
        cat << EOF > email_channel.json
{
  "type": "email",
  "displayName": "CBL-MAIKOSH Email Alerts",
  "description": "Email notifications for CBL-MAIKOSH platform alerts",
  "labels": {
    "email_address": "$EMAIL_RECIPIENTS"
  }
}
EOF

        gcloud alpha monitoring channels create --channel-content-from-file=email_channel.json --project="$PROJECT_ID"
        rm email_channel.json
        log_success "Email notification channel created"
    fi

    # Create Slack notification channel (if webhook provided)
    if [[ -n "$NOTIFICATION_CHANNEL" ]]; then
        cat << EOF > slack_channel.json
{
  "type": "slack",
  "displayName": "CBL-MAIKOSH Slack Alerts",
  "description": "Slack notifications for CBL-MAIKOSH platform alerts",
  "labels": {
    "url": "$NOTIFICATION_CHANNEL"
  }
}
EOF

        gcloud alpha monitoring channels create --channel-content-from-file=slack_channel.json --project="$PROJECT_ID"
        rm slack_channel.json
        log_success "Slack notification channel created"
    fi
}

# Create alerting policies
create_alerting_policies() {
    log_info "Creating alerting policies..."

    # High Error Rate Alert
    cat << 'EOF' > high_error_rate_policy.json
{
  "displayName": "CBL-MAIKOSH High Error Rate",
  "documentation": {
    "content": "Alert when error rate exceeds 5% over 5 minutes",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "Error rate condition",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\"",
        "comparison": "COMPARISON_GREATER_THAN",
        "thresholdValue": 5.0,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_RATE",
            "crossSeriesReducer": "REDUCE_SUM",
            "groupByFields": [
              "resource.label.service_name"
            ]
          }
        ],
        "trigger": {
          "count": 1
        }
      }
    }
  ],
  "alertStrategy": {
    "autoClose": "1800s"
  },
  "combiner": "OR",
  "enabled": true
}
EOF

    gcloud alpha monitoring policies create --policy-from-file=high_error_rate_policy.json --project="$PROJECT_ID"
    rm high_error_rate_policy.json

    # High Response Time Alert
    cat << 'EOF' > high_response_time_policy.json
{
  "displayName": "CBL-MAIKOSH High Response Time",
  "documentation": {
    "content": "Alert when average response time exceeds 10 seconds over 5 minutes",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "Response time condition",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/request_latencies\"",
        "comparison": "COMPARISON_GREATER_THAN",
        "thresholdValue": 10000,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_MEAN",
            "crossSeriesReducer": "REDUCE_MEAN",
            "groupByFields": [
              "resource.label.service_name"
            ]
          }
        ],
        "trigger": {
          "count": 1
        }
      }
    }
  ],
  "alertStrategy": {
    "autoClose": "1800s"
  },
  "combiner": "OR",
  "enabled": true
}
EOF

    gcloud alpha monitoring policies create --policy-from-file=high_response_time_policy.json --project="$PROJECT_ID"
    rm high_response_time_policy.json

    # Low Instance Count Alert (for production)
    cat << 'EOF' > low_instance_count_policy.json
{
  "displayName": "CBL-MAIKOSH Low Instance Count (Production)",
  "documentation": {
    "content": "Alert when production instance count falls below 1 for more than 2 minutes",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "Instance count condition",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=\"cbl-maikosh-app-prod\" metric.type=\"run.googleapis.com/container/instance_count\"",
        "comparison": "COMPARISON_LESS_THAN",
        "thresholdValue": 1,
        "duration": "120s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_MEAN",
            "crossSeriesReducer": "REDUCE_MEAN"
          }
        ],
        "trigger": {
          "count": 1
        }
      }
    }
  ],
  "alertStrategy": {
    "autoClose": "300s"
  },
  "combiner": "OR",
  "enabled": true
}
EOF

    gcloud alpha monitoring policies create --policy-from-file=low_instance_count_policy.json --project="$PROJECT_ID"
    rm low_instance_count_policy.json

    # High Memory Utilization Alert
    cat << 'EOF' > high_memory_policy.json
{
  "displayName": "CBL-MAIKOSH High Memory Utilization",
  "documentation": {
    "content": "Alert when memory utilization exceeds 85% for 5 minutes",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "Memory utilization condition",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/container/memory/utilizations\"",
        "comparison": "COMPARISON_GREATER_THAN",
        "thresholdValue": 0.85,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_MEAN",
            "crossSeriesReducer": "REDUCE_MEAN",
            "groupByFields": [
              "resource.label.service_name"
            ]
          }
        ],
        "trigger": {
          "count": 1
        }
      }
    }
  ],
  "alertStrategy": {
    "autoClose": "1800s"
  },
  "combiner": "OR",
  "enabled": true
}
EOF

    gcloud alpha monitoring policies create --policy-from-file=high_memory_policy.json --project="$PROJECT_ID"
    rm high_memory_policy.json

    log_success "Alerting policies created successfully"
}

# Create custom dashboard
create_dashboard() {
    log_info "Creating monitoring dashboard..."

    cat << 'EOF' > cbl_dashboard.json
{
  "displayName": "CBL-MAIKOSH Platform Dashboard",
  "mosaicLayout": {
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Request Count by Service",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/request_count\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE",
                      "crossSeriesReducer": "REDUCE_SUM",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "LINE"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "Requests/sec",
              "scale": "LINEAR"
            }
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "xPos": 6,
        "widget": {
          "title": "Response Latency",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/request_latencies\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_MEAN",
                      "crossSeriesReducer": "REDUCE_MEAN",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "LINE"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "Latency (ms)",
              "scale": "LINEAR"
            }
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "yPos": 4,
        "widget": {
          "title": "Instance Count",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/container/instance_count\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_MEAN",
                      "crossSeriesReducer": "REDUCE_MEAN",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "STACKED_AREA"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "Instances",
              "scale": "LINEAR"
            }
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "xPos": 6,
        "yPos": 4,
        "widget": {
          "title": "Memory Utilization",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/container/memory/utilizations\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_MEAN",
                      "crossSeriesReducer": "REDUCE_MEAN",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "LINE"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "Utilization %",
              "scale": "LINEAR"
            }
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "yPos": 8,
        "widget": {
          "title": "Error Count",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"logging.googleapis.com/user/cbl_maikosh_error_rate\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE",
                      "crossSeriesReducer": "REDUCE_SUM",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "STACKED_BAR"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "Errors/sec",
              "scale": "LINEAR"
            }
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "xPos": 6,
        "yPos": 8,
        "widget": {
          "title": "CPU Utilization",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\" resource.label.service_name=~\"cbl-maikosh-app.*\" metric.type=\"run.googleapis.com/container/cpu/utilizations\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_MEAN",
                      "crossSeriesReducer": "REDUCE_MEAN",
                      "groupByFields": [
                        "resource.label.service_name"
                      ]
                    }
                  }
                },
                "plotType": "LINE"
              }
            ],
            "timeshiftDuration": "0s",
            "yAxis": {
              "label": "CPU Utilization %",
              "scale": "LINEAR"
            }
          }
        }
      }
    ]
  }
}
EOF

    gcloud monitoring dashboards create --config-from-file=cbl_dashboard.json --project="$PROJECT_ID"
    rm cbl_dashboard.json

    log_success "Dashboard created successfully"
}

# Create uptime checks
create_uptime_checks() {
    log_info "Creating uptime checks..."

    # Production uptime check
    cat << EOF > prod_uptime_check.json
{
  "displayName": "CBL-MAIKOSH Production Uptime",
  "monitoredResource": {
    "type": "uptime_url",
    "labels": {
      "project_id": "$PROJECT_ID",
      "host": "cbl-maikosh-app-prod-$PROJECT_ID.a.run.app"
    }
  },
  "httpCheck": {
    "path": "/api/health",
    "port": 443,
    "useSsl": true,
    "validateSsl": true
  },
  "period": "60s",
  "timeout": "10s"
}
EOF

    gcloud monitoring uptime create --config-from-file=prod_uptime_check.json --project="$PROJECT_ID"
    rm prod_uptime_check.json

    # Staging uptime check
    cat << EOF > staging_uptime_check.json
{
  "displayName": "CBL-MAIKOSH Staging Uptime",
  "monitoredResource": {
    "type": "uptime_url",
    "labels": {
      "project_id": "$PROJECT_ID",
      "host": "cbl-maikosh-app-staging-$PROJECT_ID.a.run.app"
    }
  },
  "httpCheck": {
    "path": "/api/health",
    "port": 443,
    "useSsl": true,
    "validateSsl": true
  },
  "period": "300s",
  "timeout": "10s"
}
EOF

    gcloud monitoring uptime create --config-from-file=staging_uptime_check.json --project="$PROJECT_ID"
    rm staging_uptime_check.json

    log_success "Uptime checks created successfully"
}

# Create log sinks for long-term storage
create_log_sinks() {
    log_info "Creating log sinks for long-term storage..."

    # Create storage bucket for logs
    gsutil mb -p "$PROJECT_ID" gs://cbl-maikosh-logs-"$PROJECT_ID" 2>/dev/null || log_warning "Log storage bucket may already exist"

    # Create sink for application logs
    gcloud logging sinks create cbl-maikosh-app-logs \
        gs://cbl-maikosh-logs-"$PROJECT_ID"/app-logs \
        --log-filter='resource.type="cloud_run_revision" resource.labels.service_name=~"cbl-maikosh-app.*"' \
        --project="$PROJECT_ID" || log_warning "App logs sink may already exist"

    # Create sink for error logs
    gcloud logging sinks create cbl-maikosh-error-logs \
        gs://cbl-maikosh-logs-"$PROJECT_ID"/error-logs \
        --log-filter='resource.type="cloud_run_revision" resource.labels.service_name=~"cbl-maikosh-app.*" severity>=ERROR' \
        --project="$PROJECT_ID" || log_warning "Error logs sink may already exist"

    log_success "Log sinks created successfully"
}

# Generate monitoring summary
generate_summary() {
    log_info "Generating monitoring setup summary..."

    cat << EOF > monitoring-summary.md
# CBL-MAIKOSH Monitoring Setup Summary

## Monitoring Components Configured

### 📊 Dashboards
- **CBL-MAIKOSH Platform Dashboard**: Custom dashboard with key metrics
  - Request count and rate
  - Response latency
  - Instance count and resource utilization
  - Error rates

### 🚨 Alerting Policies
- **High Error Rate**: Triggers when error rate > 5% for 5 minutes
- **High Response Time**: Triggers when avg response time > 10s for 5 minutes  
- **Low Instance Count**: Triggers when production instances < 1 for 2 minutes
- **High Memory Utilization**: Triggers when memory > 85% for 5 minutes

### 📈 Custom Metrics
- Error rate metric
- Slow requests metric (>5s)
- Authentication failures metric
- Database connection errors metric

### ⏰ Uptime Checks
- Production environment: Every 60 seconds
- Staging environment: Every 5 minutes

### 📝 Log Management
- Application logs sink for long-term storage
- Error logs sink with severity filtering
- Log-based metrics for custom alerting

## Access Information

### Monitoring Console
- URL: https://console.cloud.google.com/monitoring?project=$PROJECT_ID
- Dashboard: Navigate to Dashboards → CBL-MAIKOSH Platform Dashboard

### Log Storage
- Bucket: gs://cbl-maikosh-logs-$PROJECT_ID
- Application logs: gs://cbl-maikosh-logs-$PROJECT_ID/app-logs
- Error logs: gs://cbl-maikosh-logs-$PROJECT_ID/error-logs

## Next Steps

1. **Configure Notification Channels**: 
   - Add email addresses and Slack webhooks for alerts
   - Test notification channels

2. **Fine-tune Alerting**:
   - Adjust thresholds based on actual usage patterns
   - Add environment-specific alerting rules

3. **Set up Log Analysis**:
   - Create log-based alerts for business-specific events
   - Set up log analysis queries for troubleshooting

4. **Performance Monitoring**:
   - Enable detailed request tracing
   - Set up custom SLI/SLO monitoring

Generated on: $(date)
EOF

    log_success "Monitoring summary generated: monitoring-summary.md"
}

# Main setup function
main() {
    log_info "Starting CBL-MAIKOSH monitoring setup..."

    validate_setup
    enable_apis
    create_log_metrics
    create_notification_channels
    create_alerting_policies
    create_dashboard
    create_uptime_checks
    create_log_sinks
    generate_summary

    log_success "🎉 CBL-MAIKOSH monitoring setup completed successfully!"
    log_info "Check monitoring-summary.md for detailed information"
}

# Print usage
usage() {
    cat << EOF
Usage: $0

Environment Variables:
  PROJECT_ID          GCP Project ID (required)
  SLACK_CHANNEL       Slack webhook URL for notifications (optional)
  EMAIL_RECIPIENTS    Email address for alerts (optional)

Examples:
  PROJECT_ID=my-project $0
  PROJECT_ID=my-project SLACK_CHANNEL=https://hooks.slack.com/... EMAIL_RECIPIENTS=admin@company.com $0

EOF
}

# Handle command line arguments
if [[ "${1:-}" == "-h" ]] || [[ "${1:-}" == "--help" ]]; then
    usage
    exit 0
fi

# Run main function
main "$@"