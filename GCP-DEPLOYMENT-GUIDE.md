# CBL-MAIKOSH Basketball Coaching Platform - GCP Deployment Guide

## 🏀 Complete Google Cloud Platform Infrastructure Setup

This comprehensive guide covers the deployment of the CBL-MAIKOSH basketball coaching platform on Google Cloud Platform with production-ready infrastructure.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start Deployment](#quick-start-deployment)
4. [Manual Deployment Steps](#manual-deployment-steps)
5. [Infrastructure Components](#infrastructure-components)
6. [Security Configuration](#security-configuration)
7. [Monitoring & Observability](#monitoring--observability)
8. [Cost Optimization](#cost-optimization)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

---

## Prerequisites

### Required Tools
- **Google Cloud SDK** (gcloud CLI) - [Install Guide](https://cloud.google.com/sdk/docs/install)
- **Docker** - [Install Guide](https://docs.docker.com/get-docker/)
- **Terraform** (optional) - [Install Guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)

### GCP Requirements
- **GCP Project**: `zeidgeistdotcom` (or your project ID)
- **Billing Account**: Enabled with sufficient credits
- **IAM Permissions**: Project Owner or Editor role
- **Domain** (optional): For custom SSL certificates

### Authentication Setup
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project zeidgeistdotcom

# Enable Application Default Credentials
gcloud auth application-default login
```

---

## Architecture Overview

### Infrastructure Components

```
Internet → Cloud Load Balancer (Global) → Cloud Armor (DDoS Protection)
    ↓
Cloud Run Service (Auto-scaling)
    ↓
VPC Connector → Private Network
    ↓
Cloud Storage (Media Assets) + Secret Manager (Credentials)
    ↓
Cloud Monitoring + Cloud Logging (Observability)
```

### Key Features
- **Auto-scaling**: Handle 0 to thousands of concurrent users
- **Global CDN**: Fast content delivery worldwide
- **DDoS Protection**: Cloud Armor security policies
- **SSL/TLS**: Managed certificates for HTTPS
- **Monitoring**: Comprehensive observability stack
- **Cost Optimization**: Pay-per-use serverless architecture

---

## Quick Start Deployment

### Option 1: One-Click Deployment Script

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd terang_tenderang

# Make the script executable
chmod +x deploy-cbl-maikosh.sh

# Run the complete deployment
./deploy-cbl-maikosh.sh \
  --project-id=zeidgeistdotcom \
  --region=us-central1 \
  --environment=prod \
  --domain=cbl-maikosh.com
```

**Deployment Time**: ~15-20 minutes

### Option 2: Terraform Infrastructure as Code

```bash
# Navigate to Terraform directory
cd terraform

# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Apply the infrastructure
terraform apply
```

---

## Manual Deployment Steps

### Step 1: Enable APIs and Create Service Account

```bash
# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  vpcaccess.googleapis.com

# Create service account
gcloud iam service-accounts create cbl-maikosh-service \
  --display-name="CBL-MAIKOSH Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding zeidgeistdotcom \
  --member="serviceAccount:cbl-maikosh-service@zeidgeistdotcom.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

### Step 2: Create Artifact Registry

```bash
# Create Docker repository
gcloud artifacts repositories create cbl-maikosh-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="CBL-MAIKOSH container registry"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Step 3: Set Up Storage Buckets

```bash
# Apply storage configuration
kubectl apply -f gcp-storage-config.yaml

# Or run the storage deployment script
bash -c "$(kubectl get configmap storage-deployment-script -o jsonpath='{.data.deploy-storage\.sh}')"
```

### Step 4: Build and Deploy Application

```bash
# Build and push container using Cloud Build
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=prod

# Deploy Cloud Run service
gcloud run services replace cloud-run-service.yaml --region=us-central1
```

### Step 5: Configure Load Balancer and SSL

```bash
# Run the load balancer deployment script
bash -c "$(kubectl get configmap load-balancer-deployment -o jsonpath='{.data.deploy-load-balancer\.sh}')"
```

### Step 6: Set Up Security (Cloud Armor)

```bash
# Deploy Cloud Armor security policies
bash -c "$(kubectl get configmap cloud-armor-deployment -o jsonpath='{.data.deploy-cloud-armor\.sh}')"
```

### Step 7: Configure Monitoring

```bash
# Set up comprehensive monitoring
bash -c "$(kubectl get configmap alert-policies -o jsonpath='{.data.create-alert-policies\.sh}')"
bash -c "$(kubectl get configmap monitoring-dashboard -o jsonpath='{.data.create-dashboard\.sh}')"
```

---

## Infrastructure Components

### Cloud Run Configuration

| Setting | Value | Purpose |
|---------|--------|---------|
| **CPU** | 2 vCPU | Handle compute-intensive operations |
| **Memory** | 2 GiB | Support multiple concurrent users |
| **Min Instances** | 1 | Reduce cold starts |
| **Max Instances** | 100 | Handle traffic spikes |
| **Concurrency** | 1000 | Requests per container |
| **Timeout** | 900s | Long-running operations |

### Storage Buckets

| Bucket | Purpose | Storage Class | Public Access |
|--------|---------|---------------|---------------|
| **Main Storage** | Application assets | Standard | Private |
| **CDN Bucket** | Static content | Standard | Public |
| **User Uploads** | User-generated content | Standard | Private |
| **Backup Bucket** | Disaster recovery | Nearline | Private |

### Networking

- **VPC Network**: Private networking for enhanced security
- **VPC Connector**: Connect Cloud Run to VPC
- **Global Load Balancer**: HTTPS termination and CDN
- **Cloud Armor**: DDoS protection and WAF rules

---

## Security Configuration

### Cloud Armor Security Policies

1. **Rate Limiting**: 100 requests/minute per IP
2. **Geo-blocking**: Block traffic from high-risk regions
3. **Attack Pattern Detection**: SQL injection, XSS protection
4. **User Agent Filtering**: Block suspicious bots
5. **Health Check Allowlist**: Allow Google health checkers

### SSL/TLS Configuration

```bash
# Create managed SSL certificate
gcloud compute ssl-certificates create cbl-maikosh-ssl-cert \
  --domains=cbl-maikosh.com,www.cbl-maikosh.com \
  --global
```

### Secret Management

Store sensitive configuration in Google Secret Manager:

```bash
# Create secrets
echo "your-auth0-secret" | gcloud secrets create auth0-secret --data-file=-
echo "your-auth0-client-id" | gcloud secrets create auth0-client-id --data-file=-
echo "your-firebase-api-key" | gcloud secrets create firebase-api-key --data-file=-
```

---

## Monitoring & Observability

### Key Metrics Monitored

1. **Application Performance**
   - Request latency (95th percentile < 2s)
   - Error rate (< 1%)
   - Availability (> 99.9%)

2. **Infrastructure Health**
   - CPU utilization (< 80%)
   - Memory usage (< 80%)
   - Instance count

3. **Security Events**
   - Blocked requests
   - Rate limit violations
   - Geographic attack patterns

### Alert Policies

- **High Error Rate**: > 5% errors for 5 minutes
- **High Latency**: > 2s 95th percentile for 3 minutes
- **Service Down**: No requests for 5 minutes
- **Security Events**: > 50 blocked requests for 5 minutes

### Dashboards

Access your monitoring dashboard:
```
https://console.cloud.google.com/monitoring/dashboards
```

---

## Cost Optimization

### Expected Monthly Costs (Production)

| Service | Estimated Cost | Notes |
|---------|----------------|-------|
| **Cloud Run** | $20-100 | Based on usage |
| **Load Balancer** | $25 | Fixed cost |
| **Cloud Storage** | $10-50 | Based on data volume |
| **Cloud Armor** | $10 | Security protection |
| **Monitoring** | $5-15 | Logs and metrics |
| **Total** | **$70-200** | Scales with usage |

### Cost Optimization Tips

1. **Auto-scaling**: Cloud Run scales to zero when idle
2. **Storage Lifecycle**: Automatic transition to cheaper storage classes
3. **CDN Caching**: Reduce origin requests
4. **Log Retention**: Automatic cleanup after 90 days
5. **Budget Alerts**: Notifications when approaching limits

---

## Troubleshooting

### Common Issues

#### 1. SSL Certificate Provisioning Failed
```bash
# Check certificate status
gcloud compute ssl-certificates describe cbl-maikosh-ssl-cert --global

# Common causes:
# - DNS not pointing to static IP
# - Domain verification pending
```

#### 2. Cloud Run Service Not Accessible
```bash
# Check service status
gcloud run services describe cbl-maikosh-app --region=us-central1

# Check logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=cbl-maikosh-app" --limit=50
```

#### 3. Health Check Failures
```bash
# Test health endpoint directly
curl -I https://your-service-url.a.run.app/api/health

# Check health check configuration
gcloud compute health-checks describe cbl-maikosh-health-check
```

#### 4. Permission Denied Errors
```bash
# Verify service account permissions
gcloud projects get-iam-policy zeidgeistdotcom \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:cbl-maikosh-service@zeidgeistdotcom.iam.gserviceaccount.com"
```

### Debug Commands

```bash
# View all resources
gcloud run services list
gcloud compute backend-services list
gcloud storage buckets list

# Check logs
gcloud logs read "resource.type=cloud_run_revision" --limit=100

# Monitor real-time traffic
gcloud logs tail "resource.type=cloud_run_revision"
```

---

## Maintenance

### Regular Tasks

#### Weekly
- [ ] Review monitoring dashboard
- [ ] Check security alerts
- [ ] Monitor costs and usage

#### Monthly
- [ ] Review and rotate secrets
- [ ] Update SSL certificates (if needed)
- [ ] Analyze performance metrics
- [ ] Review log retention policies

#### Quarterly
- [ ] Update container dependencies
- [ ] Review scaling policies
- [ ] Audit IAM permissions
- [ ] Test disaster recovery procedures

### Update Procedures

#### Deploy New Version
```bash
# Build new container
gcloud builds submit --config=cloudbuild.yaml

# Deploy with rolling update
gcloud run services update cbl-maikosh-app \
  --image=us-central1-docker.pkg.dev/zeidgeistdotcom/cbl-maikosh-repo/cbl-maikosh-app:latest \
  --region=us-central1
```

#### Rollback if Needed
```bash
# List revisions
gcloud run revisions list --service=cbl-maikosh-app --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic cbl-maikosh-app \
  --to-revisions=cbl-maikosh-app-00001-abc=100 \
  --region=us-central1
```

---

## DNS Configuration

### Required DNS Records

Point your domain to the static IP address:

```dns
# A Records
cbl-maikosh.com.        300    IN    A    YOUR_STATIC_IP
www.cbl-maikosh.com.    300    IN    A    YOUR_STATIC_IP

# Optional CNAME (alternative)
app.cbl-maikosh.com.    300    IN    CNAME cbl-maikosh.com.
```

Get your static IP:
```bash
gcloud compute addresses describe cbl-maikosh-global-ip --global --format="value(address)"
```

---

## Support and Resources

### Documentation Links
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google Cloud Load Balancing](https://cloud.google.com/load-balancing/docs)
- [Cloud Armor Documentation](https://cloud.google.com/armor/docs)
- [Cloud Monitoring](https://cloud.google.com/monitoring/docs)

### Support Channels
- **Email**: zeidalqadri@gmail.com
- **Project Repository**: Check the README for updates
- **GCP Support**: Available through Google Cloud Console

---

## 🎯 Success Checklist

After deployment, verify these items:

- [ ] Application loads at your domain
- [ ] Health check endpoint responds (200 OK)
- [ ] HTTPS redirect works (HTTP → HTTPS)
- [ ] Monitoring dashboard shows data
- [ ] Alerts are configured and tested
- [ ] Backup procedures are in place
- [ ] Security policies are active
- [ ] Performance meets requirements
- [ ] Cost monitoring is set up
- [ ] Documentation is updated

---

**🏀 Your CBL-MAIKOSH Basketball Coaching Platform is now ready to serve thousands of coaches worldwide!**

*For support or questions, contact: zeidalqadri@gmail.com*