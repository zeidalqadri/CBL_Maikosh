# Domain Migration: alloui.zeidgeist.com Setup

## ✅ New Domain Mapping Created Successfully

The new domain mapping for `alloui.zeidgeist.com` has been created in Google Cloud Run. Now you need to configure DNS records in Cloudflare.

## 🔧 Required DNS Configuration

### Add the following CNAME record in Cloudflare:

| Type  | Name   | Target                | Proxy Status |
|-------|--------|----------------------|--------------|
| CNAME | alloui | ghs.googlehosted.com | DNS only     |

### Step-by-Step Instructions for Cloudflare:

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select the `zeidgeist.com` domain

2. **Navigate to DNS Management**
   - Click on the "DNS" tab in the left sidebar

3. **Add CNAME Record**
   - Click "Add record"
   - Type: `CNAME`
   - Name: `alloui` (just the subdomain, not the full domain)
   - Target: `ghs.googlehosted.com`
   - Proxy status: **DNS only** (important: turn OFF the orange cloud)
   - TTL: Auto

4. **Save the Record**
   - Click "Save"

## 📊 Current Status

- ✅ Domain mapping created for alloui.zeidgeist.com
- ✅ Cloud Run service configured
- ⏳ **NEXT STEP**: Configure DNS in Cloudflare (you need to do this)
- ⏳ SSL certificate will be provisioned after DNS configuration

## 🔍 Monitoring Commands

Check certificate provisioning status:
```bash
gcloud beta run domain-mappings describe \
  --domain=alloui.zeidgeist.com \
  --region=us-central1 \
  --format="value(status.conditions[0].message)"
```

Check DNS propagation:
```bash
nslookup alloui.zeidgeist.com 8.8.8.8
```

Test domain (after SSL is ready):
```bash
curl -I https://alloui.zeidgeist.com
curl https://alloui.zeidgeist.com/api/health
```

## 🔄 Domain Migration Status

### Current Domains:
- **Old Domain**: alueii.zeidgeist.com ✅ (currently working)
- **New Domain**: alloui.zeidgeist.com ⏳ (waiting for DNS setup)

### Migration Strategy:
Both domains will work simultaneously during the transition period. No downtime expected.

## ⏱️ Expected Timeline

1. **Configure DNS in Cloudflare**: 2 minutes (you need to do this step)
2. **DNS propagation**: 5-30 minutes
3. **SSL certificate provisioning**: 15-60 minutes after DNS propagates
4. **Domain fully operational**: ~1 hour total

## 🎯 Final URLs After Migration

- **Primary Domain**: https://alloui.zeidgeist.com
- **Legacy Domain**: https://alueii.zeidgeist.com (can be kept or removed)
- **Cloud Run URL**: https://cbl-maikosh-app-n6ofijmqgq-uc.a.run.app (always works)

## ✅ Next Steps

1. **YOU**: Add the CNAME record in Cloudflare as described above
2. **AUTO**: DNS propagation (5-30 minutes)
3. **AUTO**: SSL certificate provisioning (15-60 minutes)
4. **TEST**: Verify new domain works
5. **OPTIONAL**: Remove old domain mapping after confirming new one works

## 🚨 Important Notes

- Both domains can work simultaneously - no service interruption
- The application code doesn't need any changes
- Firebase and all services will work on the new domain
- SSL certificates are provisioned automatically by Google