# CBL-MAIKOSH Deployment Runbook

## 🏀 Emergency Response and Operations Guide

### Quick Reference

**Emergency Contacts**
- DevOps On-Call: [+1-XXX-XXX-XXXX]
- Platform Lead: [+1-XXX-XXX-XXXX]
- Security Team: [security@cbl-maikosh.com]

**Service URLs**
- Production: https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app
- Staging: https://cbl-maikosh-app-staging-zeidgeistdotcom.a.run.app
- Development: https://cbl-maikosh-app-dev-zeidgeistdotcom.a.run.app

**Monitoring Dashboard**
- [Google Cloud Monitoring](https://console.cloud.google.com/monitoring?project=zeidgeistdotcom)

---

## 🚨 Emergency Procedures

### Production Outage Response

#### Immediate Actions (0-5 minutes)
1. **Verify the Issue**
   ```bash
   curl -f https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app/api/health
   ```

2. **Check Monitoring Dashboard**
   - Open CBL-MAIKOSH Platform Dashboard
   - Check error rates, response times, instance count

3. **Immediate Rollback (if needed)**
   ```bash
   # Get current revisions
   gcloud run revisions list --service=cbl-maikosh-app-prod --region=us-central1 --limit=5
   
   # Rollback to last stable revision
   gcloud run services update-traffic cbl-maikosh-app-prod \
     --to-revisions=PREVIOUS_STABLE_REVISION=100 \
     --region=us-central1
   ```

#### Investigation (5-15 minutes)
1. **Collect Logs**
   ```bash
   # Application logs (last 1 hour)
   gcloud logs read "resource.type=cloud_run_revision resource.labels.service_name=cbl-maikosh-app-prod" \
     --since=1h --limit=100
   
   # Error logs only
   gcloud logs read "resource.type=cloud_run_revision resource.labels.service_name=cbl-maikosh-app-prod severity>=ERROR" \
     --since=1h --limit=50
   ```

2. **Check Build History**
   ```bash
   gcloud builds list --limit=10
   ```

3. **Verify Infrastructure**
   ```bash
   # Check service status
   gcloud run services describe cbl-maikosh-app-prod --region=us-central1
   
   # Check current traffic allocation
   gcloud run services describe cbl-maikosh-app-prod --region=us-central1 \
     --format="table(status.traffic[].percent,status.traffic[].revisionName,status.traffic[].tag)"
   ```

#### Communication (Within 15 minutes)
1. **Internal Notification**
   - Post in #incidents Slack channel
   - Email stakeholders
   - Update status page

2. **Status Update Template**
   ```
   🚨 PRODUCTION INCIDENT - CBL-MAIKOSH Platform
   
   Issue: [Brief description]
   Impact: [User impact description]
   Start Time: [Timestamp]
   Status: Investigating/Mitigating/Resolved
   ETA: [Estimated resolution time]
   
   Actions Taken:
   - [List actions]
   
   Next Update: [Time]
   ```

### Gradual Service Degradation

#### Symptoms
- Increased response times
- Higher error rates
- Memory/CPU alerts

#### Response Steps
1. **Scale Resources**
   ```bash
   # Increase instance limits
   gcloud run services update cbl-maikosh-app-prod \
     --max-instances=200 \
     --min-instances=5 \
     --region=us-central1
   
   # Increase memory/CPU if needed
   gcloud run services update cbl-maikosh-app-prod \
     --memory=4Gi \
     --cpu=2 \
     --region=us-central1
   ```

2. **Check Database Performance**
   ```bash
   # Check Firebase/database logs
   gcloud logs read "resource.type=cloud_run_revision textPayload=~'database'" --since=30m
   ```

3. **Monitor Recovery**
   - Watch monitoring dashboard
   - Verify response times normalize
   - Check error rates return to baseline

---

## 🚀 Standard Deployment Procedures

### Development Deployment

#### Automated (Recommended)
```bash
# Push to develop branch
git checkout develop
git merge feature-branch
git push origin develop

# Or push feature branch
git push origin feature/new-feature
```

#### Manual Deployment
```bash
# Using deployment script
PROJECT_ID=zeidgeistdotcom ./scripts/deploy-with-rollback.sh dev latest

# Using Cloud Build
gcloud builds submit --config cloudbuild-dev.yaml
```

#### Verification
```bash
# Check deployment status
gcloud run services describe cbl-maikosh-app-dev --region=us-central1

# Test health endpoint
curl -f https://cbl-maikosh-app-dev-zeidgeistdotcom.a.run.app/api/health

# Check logs
gcloud logs read "resource.type=cloud_run_revision resource.labels.service_name=cbl-maikosh-app-dev" \
  --since=10m --limit=20
```

### Staging Deployment

#### Automated (Recommended)
```bash
# Create pull request to main branch
gh pr create --base main --title "Feature: [Description]" --body "[Detailed description]"
```

#### Manual Deployment
```bash
# Using deployment script
PROJECT_ID=zeidgeistdotcom ./scripts/deploy-with-rollback.sh staging v1.2.3

# Using Cloud Build
gcloud builds submit --config cloudbuild-staging.yaml --substitutions=_ENVIRONMENT=staging
```

#### Canary Monitoring
```bash
# Monitor canary deployment
watch -n 30 'curl -s https://cbl-maikosh-app-staging-zeidgeistdotcom.a.run.app/api/health'

# Check traffic split
gcloud run services describe cbl-maikosh-app-staging --region=us-central1 \
  --format="table(status.traffic[].percent,status.traffic[].tag)"
```

### Production Deployment

#### Pre-deployment Checklist
- [ ] Staging deployment successful
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance tests acceptable
- [ ] Rollback plan confirmed
- [ ] Stakeholders notified

#### Automated Deployment
```bash
# Merge to main branch
git checkout main
git merge staging-branch
git push origin main
```

#### Manual Deployment (Emergency)
```bash
# Create release tag
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3

# Or use deployment script
PROJECT_ID=zeidgeistdotcom ./scripts/deploy-with-rollback.sh prod v1.2.3
```

#### Production Deployment Monitoring
```bash
# Monitor blue-green deployment progress
watch -n 15 'gcloud run services describe cbl-maikosh-app-prod --region=us-central1 --format="table(status.traffic[].percent,status.traffic[].revisionName)"'

# Monitor health during deployment
while true; do
  echo "$(date): $(curl -s -w "%{http_code}" https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app/api/health -o /dev/null)"
  sleep 10
done
```

---

## 🔄 Rollback Procedures

### Immediate Rollback (Emergency)
```bash
# List recent revisions
gcloud run revisions list --service=cbl-maikosh-app-prod --region=us-central1 --limit=5

# Rollback to previous revision
gcloud run services update-traffic cbl-maikosh-app-prod \
  --to-revisions=[PREVIOUS_REVISION_NAME]=100 \
  --region=us-central1

# Verify rollback
curl -f https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app/api/health
```

### Gradual Rollback
```bash
# Step 1: Route 50% traffic back to stable version
gcloud run services update-traffic cbl-maikosh-app-prod \
  --to-revisions=[STABLE_REVISION]=50,[CURRENT_REVISION]=50 \
  --region=us-central1

# Monitor for 5 minutes
sleep 300

# Step 2: Complete rollback if stable
gcloud run services update-traffic cbl-maikosh-app-prod \
  --to-revisions=[STABLE_REVISION]=100 \
  --region=us-central1
```

### Rollback Verification
```bash
# Check service status
gcloud run services describe cbl-maikosh-app-prod --region=us-central1

# Verify endpoints
endpoints=("/api/health" "/api/status" "/" "/dashboard")
for endpoint in "${endpoints[@]}"; do
  echo "Testing $endpoint"
  curl -f -s "https://cbl-maikosh-app-prod-zeidgeistdotcom.a.run.app$endpoint" > /dev/null && echo "✅ OK" || echo "❌ FAIL"
done

# Check recent logs
gcloud logs read "resource.type=cloud_run_revision resource.labels.service_name=cbl-maikosh-app-prod" \
  --since=5m --limit=10
```

---

## 🔧 Operational Procedures

### Environment Management

#### Create New Environment
```bash
# Deploy to new environment
SERVICE_NAME="cbl-maikosh-app-[ENVIRONMENT]"
gcloud run deploy $SERVICE_NAME \
  --image=us-central1-docker.pkg.dev/zeidgeistdotcom/cbl-maikosh-repo/cbl-maikosh-app:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=10 \
  --min-instances=0 \
  --port=8080 \
  --service-account=cbl-maikosh-service@zeidgeistdotcom.iam.gserviceaccount.com \
  --set-env-vars="NODE_ENV=[ENVIRONMENT]" \
  --labels="environment=[ENVIRONMENT],application=cbl-maikosh"
```

#### Clean Up Old Environments
```bash
# List all services
gcloud run services list --region=us-central1

# Delete environment
gcloud run services delete [SERVICE_NAME] --region=us-central1 --quiet

# Clean up container images
gcloud artifacts docker images list us-central1-docker.pkg.dev/zeidgeistdotcom/cbl-maikosh-repo/cbl-maikosh-app
gcloud artifacts docker images delete [IMAGE_URI] --quiet
```

### Database Operations

#### Backup Procedures
```bash
# Create Firestore backup (if applicable)
gcloud firestore export gs://cbl-maikosh-backups-zeidgeistdotcom/$(date +%Y%m%d_%H%M%S)

# Verify backup
gsutil ls gs://cbl-maikosh-backups-zeidgeistdotcom/
```

#### Restore Procedures
```bash
# Restore from backup
gcloud firestore import gs://cbl-maikosh-backups-zeidgeistdotcom/[BACKUP_NAME]
```

### Security Procedures

#### Secret Rotation
```bash
# List current secrets
gcloud secrets list --project=zeidgeistdotcom

# Create new secret version
echo "NEW_SECRET_VALUE" | gcloud secrets versions add [SECRET_NAME] --data-file=-

# Update service to use new secret version
gcloud run services update cbl-maikosh-app-prod \
  --update-secrets=[SECRET_NAME]=[SECRET_NAME]:latest \
  --region=us-central1
```

#### Access Review
```bash
# List IAM bindings
gcloud projects get-iam-policy zeidgeistdotcom --flatten="bindings[].members" \
  --format="table(bindings.role,bindings.members)"

# List service account keys
gcloud iam service-accounts keys list --iam-account=cbl-maikosh-service@zeidgeistdotcom.iam.gserviceaccount.com
```

---

## 📊 Monitoring and Alerting

### Key Metrics to Monitor

#### Application Metrics
- **Request Rate**: < 1000 req/sec normal
- **Error Rate**: < 1% acceptable, > 5% critical
- **Response Time**: < 2s normal, > 10s critical
- **Instance Count**: 2-100 instances for production

#### Infrastructure Metrics
- **Memory Usage**: < 80% normal, > 90% critical
- **CPU Usage**: < 70% normal, > 85% critical
- **Disk Usage**: Monitor build caches and logs

#### Business Metrics
- **User Logins**: Track authentication success/failure
- **Course Completions**: Monitor core business functionality
- **Payment Processing**: Track transaction success rates

### Custom Monitoring Queries

#### High Error Rate Detection
```bash
# Query error logs
gcloud logs read 'resource.type="cloud_run_revision" 
  resource.labels.service_name=~"cbl-maikosh-app.*" 
  severity>=ERROR' \
  --since=1h --format="table(timestamp,severity,textPayload)"
```

#### Performance Analysis
```bash
# Slow request analysis
gcloud logs read 'resource.type="cloud_run_revision" 
  resource.labels.service_name=~"cbl-maikosh-app.*" 
  httpRequest.latency>"5s"' \
  --since=1h --format="table(timestamp,httpRequest.requestMethod,httpRequest.requestUrl,httpRequest.latency)"
```

### Alert Response Procedures

#### High Error Rate Alert
1. Check application logs for error patterns
2. Verify database connectivity
3. Check external service dependencies
4. Scale resources if needed
5. Consider rollback if errors persist

#### High Memory Alert
1. Check memory usage patterns
2. Look for memory leaks in application logs
3. Scale instance memory if temporary spike
4. Plan code optimization if systemic issue

#### Low Instance Count Alert
1. Verify minimum instance configuration
2. Check if instances are crashing
3. Review application startup logs
4. Increase minimum instances if needed

---

## 🛠️ Troubleshooting Guide

### Common Issues

#### Build Failures

**Dependency Installation Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for version conflicts
npm audit
```

**Test Failures**
```bash
# Run tests locally
npm test

# Run tests with verbose output
npm test -- --verbose

# Run specific test suite
npm test -- --testPathPattern="integration"

# Check test coverage
npm test -- --coverage
```

#### Deployment Issues

**Container Build Failures**
```bash
# Check Dockerfile syntax
docker build -t test-image .

# Verify base image availability
docker pull node:20-alpine

# Check build logs
gcloud builds describe [BUILD_ID] --region=us-central1
```

**Service Startup Issues**
```bash
# Check service logs
gcloud logs read "resource.type=cloud_run_revision resource.labels.service_name=[SERVICE_NAME]" \
  --since=15m

# Verify environment variables
gcloud run services describe [SERVICE_NAME] --region=us-central1 \
  --format="value(spec.template.spec.template.spec.containers[0].env[].name,spec.template.spec.template.spec.containers[0].env[].value)"

# Check secret access
gcloud run services describe [SERVICE_NAME] --region=us-central1 \
  --format="value(spec.template.spec.template.spec.containers[0].env[].valueFrom.secretKeyRef.name)"
```

#### Performance Issues

**High Response Times**
1. Check database query performance
2. Review API endpoint efficiency
3. Analyze memory usage patterns
4. Consider caching implementation

**Memory Leaks**
```bash
# Monitor memory usage over time
gcloud monitoring metrics list --filter="metric.type=run.googleapis.com/container/memory/utilizations"

# Analyze memory patterns
gcloud logs read 'resource.type="cloud_run_revision" textPayload=~"memory"' --since=1h
```

### Emergency Contacts and Escalation

#### Level 1 - DevOps Team
- **Response Time**: 15 minutes
- **Contact**: devops@cbl-maikosh.com
- **On-Call**: +1-XXX-XXX-XXXX

#### Level 2 - Platform Engineering
- **Response Time**: 30 minutes  
- **Contact**: platform@cbl-maikosh.com
- **Escalation**: After 30 minutes of L1

#### Level 3 - Engineering Leadership
- **Response Time**: 1 hour
- **Contact**: engineering-leadership@cbl-maikosh.com
- **Escalation**: Critical issues affecting business operations

### Documentation Updates

After resolving incidents:
1. Update this runbook with lessons learned
2. Document new procedures
3. Update contact information
4. Review and test emergency procedures

---

**Last Updated**: $(date)
**Version**: 1.0
**Owner**: DevOps Team