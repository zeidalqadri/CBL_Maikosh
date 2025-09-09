# Custom Domain Setup for alueii.zeidgeist.com

## Domain Mapping Created Successfully ✅

The domain mapping has been created in Google Cloud Run. Now you need to configure your DNS records in Cloudflare.

## Required DNS Configuration

### Add the following CNAME record in Cloudflare:

| Type  | Name   | Target                | Proxy Status |
|-------|--------|----------------------|--------------|
| CNAME | alueii | ghs.googlehosted.com | DNS only     |

### Step-by-Step Instructions for Cloudflare:

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select the `zeidgeist.com` domain

2. **Navigate to DNS Management**
   - Click on the "DNS" tab in the left sidebar

3. **Add CNAME Record**
   - Click "Add record"
   - Type: `CNAME`
   - Name: `alueii` (just the subdomain, not the full domain)
   - Target: `ghs.googlehosted.com`
   - Proxy status: **DNS only** (important: turn OFF the orange cloud)
   - TTL: Auto

4. **Save the Record**
   - Click "Save"

## Important Notes

- **Proxy Status**: Must be set to "DNS only" (gray cloud) initially. Do NOT use Cloudflare proxy (orange cloud) until SSL is provisioned.
- **SSL Certificate**: Google will automatically provision an SSL certificate after DNS propagation (15-60 minutes)
- **DNS Propagation**: Changes typically take 5-30 minutes to propagate globally

## Verification Commands

Check DNS propagation:
```bash
# Check if DNS is configured correctly
nslookup alueii.zeidgeist.com 8.8.8.8

# Expected result: Should show CNAME pointing to ghs.googlehosted.com
```

Check domain mapping status:
```bash
# Check certificate provisioning status
gcloud beta run domain-mappings describe \
  --domain=alueii.zeidgeist.com \
  --region=us-central1 \
  --format="value(status.conditions[0].message)"
```

Test the domain (after SSL is ready):
```bash
# Test HTTPS connection
curl -I https://alueii.zeidgeist.com

# Should return HTTP 200 when ready
```

## Current Status

- ✅ Domain ownership verified (parent domain zeidgeist.com is verified)
- ✅ Domain mapping created in Cloud Run
- ⏳ Waiting for DNS configuration in Cloudflare
- ⏳ SSL certificate will be provisioned after DNS is configured

## Monitoring Progress

You can monitor the certificate provisioning progress:
```bash
watch -n 30 'gcloud beta run domain-mappings describe \
  --domain=alueii.zeidgeist.com \
  --region=us-central1 \
  --format="value(status.conditions[0].message)"'
```

## Expected Timeline

1. Add DNS record in Cloudflare: 2 minutes
2. DNS propagation: 5-30 minutes
3. SSL certificate provisioning: 15-60 minutes after DNS propagates
4. Domain fully operational: ~1 hour total

## Final URLs

Once configured, your application will be accessible at:
- **Custom Domain**: https://alueii.zeidgeist.com
- **Original Cloud Run URL**: https://cbl-maikosh-app-n6ofijmqgq-uc.a.run.app (still works)

## Troubleshooting

If the domain doesn't work after 1 hour:
1. Verify DNS record is correctly configured in Cloudflare
2. Ensure proxy status is "DNS only" (gray cloud)
3. Check certificate status with the verification commands above
4. Wait up to 24 hours for full propagation in rare cases

## Next Steps

1. Configure the CNAME record in Cloudflare as described above
2. Wait for DNS propagation (5-30 minutes)
3. Monitor certificate provisioning status
4. Test the domain once certificate is ready