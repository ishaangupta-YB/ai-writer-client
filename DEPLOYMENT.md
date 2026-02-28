# Frontend Deployment Guide

Deploy the React SPA to AWS S3 + CloudFront (with Origin Access Control).

## Architecture

```
Browser → CloudFront (HTTPS) → S3 bucket (private, OAC) → static files (index.html, JS, CSS)
                                   ↓
                           API calls go to:
                           ALB (HTTP:80) → ECS Fargate (port 8000)
```

The frontend is a static single-page app. CloudFront serves it over HTTPS from a private S3 bucket. API requests go directly from the browser to the backend ALB.

## Prerequisites

- Node.js 18+ and npm
- AWS CLI v2 configured with an IAM user
- Backend already deployed (see `server/DEPLOYMENT.md`)
- The IAM user needs these policies (managed or inline):
  - `AmazonS3FullAccess`
  - `CloudFrontFullAccess`

> **Note:** If the IAM user has hit the 10 managed policy limit, attach CloudFront access as an inline policy:
> ```bash
> aws iam put-user-policy \
>   --user-name YOUR_IAM_USER \
>   --policy-name CloudFrontAccess \
>   --policy-document '{
>     "Version":"2012-10-17",
>     "Statement":[{"Effect":"Allow","Action":"cloudfront:*","Resource":"*"}]
>   }'
> ```

---

## One-Time AWS Setup

Replace `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID throughout.

### 1. Create S3 Bucket

```bash
BUCKET_NAME="ai-blog-writer-frontend-YOUR_ACCOUNT_ID"

aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region us-east-1

# Block all public access (CloudFront will access via OAC)
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### 2. Create CloudFront Origin Access Control (OAC)

```bash
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config '{
    "Name": "blog-writer-oac",
    "OriginAccessControlOriginType": "s3",
    "SigningBehavior": "always",
    "SigningProtocol": "sigv4"
  }' \
  --query 'OriginAccessControl.Id' --output text)

echo "OAC_ID=$OAC_ID"
```

### 3. Create CloudFront Distribution

Save this as `/tmp/cf-config.json` (replace `YOUR_BUCKET_NAME` and `YOUR_OAC_ID`):

```json
{
  "CallerReference": "blog-writer-frontend-1",
  "Comment": "AI Blog Writer Frontend",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-origin",
        "DomainName": "YOUR_BUCKET_NAME.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": { "OriginAccessIdentity": "" },
        "OriginAccessControlId": "YOUR_OAC_ID"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] },
    "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 0
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 0
      }
    ]
  },
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  }
}
```

> **Custom error responses** are required for SPA routing — when the user navigates to `/blog/123`, S3 returns 404 because that file doesn't exist. CloudFront catches it and serves `index.html` instead, letting React Router handle the route.

Create the distribution:

```bash
# Edit /tmp/cf-config.json first (replace YOUR_BUCKET_NAME and YOUR_OAC_ID)

DIST_ID=$(aws cloudfront create-distribution \
  --distribution-config file:///tmp/cf-config.json \
  --query 'Distribution.Id' --output text)

CF_DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" \
  --query 'Distribution.DomainName' --output text)

echo "Distribution ID: $DIST_ID"
echo "CloudFront URL:  https://$CF_DOMAIN"
```

### 4. Add S3 Bucket Policy (allow CloudFront OAC)

```bash
BUCKET_NAME="ai-blog-writer-frontend-YOUR_ACCOUNT_ID"
DIST_ID="YOUR_DISTRIBUTION_ID"  # From step 3

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [{
      \"Sid\": \"AllowCloudFrontOAC\",
      \"Effect\": \"Allow\",
      \"Principal\": { \"Service\": \"cloudfront.amazonaws.com\" },
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\",
      \"Condition\": {
        \"StringEquals\": {
          \"AWS:SourceArn\": \"arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/$DIST_ID\"
        }
      }
    }]
  }"
```

### 5. Update Backend CORS

After getting the CloudFront URL, redeploy the backend with strict CORS:

```bash
cd ../server/infra

CORS_ORIGINS=https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net ./deploy.sh YOUR_ACCOUNT_ID
```

This ensures only your frontend can call the backend API.

---

## Build & Deploy

### First-Time Build

```bash
cd client

# Install dependencies
npm install

# Build with the backend ALB URL
VITE_API_URL=http://YOUR_ALB_DNS/api npm run build
```

> **`VITE_API_URL`** is baked into the JS bundle at build time (Vite replaces `import.meta.env.VITE_API_URL`). You must rebuild if the backend URL changes.

### Upload to S3

```bash
BUCKET_NAME="ai-blog-writer-frontend-YOUR_ACCOUNT_ID"

aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete
```

### Invalidate CloudFront Cache

After uploading new files, invalidate the cache so users get the latest version:

```bash
DIST_ID="YOUR_DISTRIBUTION_ID"

aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"
```

> First deployment doesn't need invalidation. Subsequent deploys do.

---

## Redeploy (Quick Reference)

```bash
cd client

# 1. Build
VITE_API_URL=http://YOUR_ALB_DNS/api npm run build

# 2. Upload
aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ --delete

# 3. Invalidate cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Environment Variables

| Variable | Description | When |
|----------|-------------|------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://your-alb-dns.amazonaws.com/api`) | Build time only |

- In development, `VITE_API_URL` defaults to `/api` (proxied by Vite dev server to `localhost:8000`)
- In production, set it to the full ALB URL when running `npm run build`
- This value is **baked into the JS bundle** — changing it requires a rebuild + redeploy

---

## Verify

```bash
# Check if CloudFront serves the app
curl -s -o /dev/null -w "%{http_code}" https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net/

# Should return 200

# Check SPA routing works (deep link should also return 200)
curl -s -o /dev/null -w "%{http_code}" https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net/blog/test

# Should return 200 (served by custom error response → index.html)
```

---

## Troubleshooting

```bash
# CloudFront returns 403 — bucket policy likely wrong
# Verify the policy allows cloudfront.amazonaws.com with the correct distribution ARN
aws s3api get-bucket-policy --bucket YOUR_BUCKET_NAME --output text | python3 -m json.tool

# CloudFront shows old content — invalidate cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# API calls fail (CORS error in browser console)
# → Backend CORS_ORIGINS doesn't match the CloudFront URL
# → Redeploy backend: CORS_ORIGINS=https://YOUR_CF_DOMAIN ./deploy.sh YOUR_ACCOUNT_ID

# API calls fail (network error)
# → VITE_API_URL was wrong at build time → rebuild with correct URL

# Check CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DIST_ID \
  --query 'Distribution.{Status:Status,Domain:DomainName,Enabled:DistributionConfig.Enabled}'

# List all invalidations
aws cloudfront list-invalidations --distribution-id YOUR_DIST_ID \
  --query 'InvalidationList.Items[*].{Id:Id,Status:Status,Created:CreateTime}' --output table
```

---

## Teardown

```bash
BUCKET_NAME="ai-blog-writer-frontend-YOUR_ACCOUNT_ID"
DIST_ID="YOUR_DISTRIBUTION_ID"

# 1. Empty the S3 bucket
aws s3 rm "s3://$BUCKET_NAME" --recursive

# 2. Delete the S3 bucket
aws s3api delete-bucket --bucket "$BUCKET_NAME"

# 3. Disable the CloudFront distribution (required before deletion)
# Get current config
aws cloudfront get-distribution-config --id "$DIST_ID" > /tmp/cf-dist.json
ETAG=$(python3 -c "import json; print(json.load(open('/tmp/cf-dist.json'))['ETag'])")
# Set Enabled=false
python3 -c "
import json
with open('/tmp/cf-dist.json') as f:
    data = json.load(f)
config = data['DistributionConfig']
config['Enabled'] = False
with open('/tmp/cf-disable.json', 'w') as f:
    json.dump(config, f)
"
aws cloudfront update-distribution --id "$DIST_ID" --if-match "$ETAG" \
  --distribution-config file:///tmp/cf-disable.json --no-cli-pager

# 4. Wait for distribution to fully disable (~5-15 min)
echo "Waiting for distribution to disable..."
aws cloudfront wait distribution-deployed --id "$DIST_ID"

# 5. Delete the distribution
ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)
aws cloudfront delete-distribution --id "$DIST_ID" --if-match "$ETAG"

# 6. Delete OAC
OAC_ID=$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='blog-writer-oac'].Id" --output text)
ETAG=$(aws cloudfront get-origin-access-control --id "$OAC_ID" --query 'ETag' --output text)
aws cloudfront delete-origin-access-control --id "$OAC_ID" --if-match "$ETAG"
```
