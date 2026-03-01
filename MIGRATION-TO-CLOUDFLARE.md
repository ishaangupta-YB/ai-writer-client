# Migration: AWS (S3 + CloudFront) → Cloudflare Pages

Migrate the React SPA frontend from AWS S3 + CloudFront to Cloudflare Pages, including the `/api/*` proxy to the backend ALB.

## Why Cloudflare Pages (not Workers)

**Pages** is purpose-built for static sites + SPAs. It gives you:
- Automatic CDN + SPA routing (no custom error responses needed)
- `git push` → auto-deploy (no manual `s3 sync` + cache invalidation)
- Preview deploys per branch/PR
- Pages Functions for the `/api/*` proxy (runs on Workers under the hood, but integrated)

**Workers** is raw serverless compute. You'd have to manually handle static asset serving, caching headers, SPA fallback routing, etc. Unnecessary complexity for a static React app.

---

## Current Architecture (AWS)

```
Browser → CloudFront (HTTPS)
             ├── /*        → S3 bucket (private, OAC) → static files
             └── /api/*    → ALB (HTTP:80) → ECS Fargate (port 8000)
```

## Target Architecture (Cloudflare)

```
Browser → Cloudflare Pages (HTTPS)
             ├── /*        → static files (auto-served from build output)
             └── /api/*    → Pages Function (edge proxy) → ALB (HTTP:80) → ECS Fargate
```

---

## Prerequisites

- Cloudflare account (free tier works)
- `npm` installed (already in project)
- Backend ALB running and accessible: `http://blog-writer-alb-1956679534.us-east-1.elb.amazonaws.com`

---

## Step 1: Install Wrangler CLI

```bash
npm install -D wrangler
```

Or globally:

```bash
npm install -g wrangler
```

Then authenticate:

```bash
npx wrangler login
```

---

## Step 2: Create Pages Function for `/api/*` Proxy

The `/api/*` proxy is the critical piece. Cloudflare Pages Functions use a file-based routing convention. Create a catch-all function that proxies all `/api/*` requests to the backend ALB.

Create the file `functions/api/[[path]].ts`:

```bash
mkdir -p functions/api
```

**File: `functions/api/[[path]].ts`**

```typescript
// Proxy all /api/* requests to the backend ALB
// [[path]] is a Cloudflare Pages catch-all route segment

const BACKEND_ORIGIN = "http://blog-writer-alb-1956679534.us-east-1.elb.amazonaws.com";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Rebuild the URL pointing to the backend ALB
  const backendUrl = `${BACKEND_ORIGIN}${url.pathname}${url.search}`;

  // Clone the incoming request, forwarding method, headers, and body
  const backendRequest = new Request(backendUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "follow",
  });

  // Remove headers that shouldn't be forwarded
  backendRequest.headers.delete("host");

  const response = await fetch(backendRequest);

  // Return the backend response as-is (preserves SSE streaming)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
```

**Why this works for SSE streaming:** Cloudflare Workers/Pages Functions support streaming responses natively. The `response.body` (a ReadableStream) is passed through directly — no buffering, no timeout issues.

---

## Step 3: Add Wrangler Config

Create `wrangler.toml` in the client root:

**File: `wrangler.toml`**

```toml
name = "ai-blog-writer"
compatibility_date = "2025-01-01"

[vars]
BACKEND_ORIGIN = "http://blog-writer-alb-1956679534.us-east-1.elb.amazonaws.com"

# Pages will auto-detect the build output directory
```

Then update the proxy function to read from env instead of hardcoding:

**Updated `functions/api/[[path]].ts`:**

```typescript
interface Env {
  BACKEND_ORIGIN: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const backendOrigin = context.env.BACKEND_ORIGIN;
  const url = new URL(context.request.url);

  const backendUrl = `${backendOrigin}${url.pathname}${url.search}`;

  const backendRequest = new Request(backendUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "follow",
  });

  backendRequest.headers.delete("host");

  const response = await fetch(backendRequest);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
```

> **Note:** Use `BACKEND_ORIGIN` as an environment variable so you can change it without code changes. Set it in Cloudflare dashboard or `wrangler.toml`.

---

## Step 4: Verify No Code Changes Needed

The client app requires **zero code changes**:

- `VITE_API_URL` defaults to `/api` (from `.env`) — same-origin relative path, works with Cloudflare Pages Functions proxy
- `src/lib/api.ts` calls `fetch("/api/generate", ...)` — unchanged
- SSE streaming via `ReadableStream` — works through Cloudflare's proxy

---

## Step 5: Test Locally

```bash
cd client

# Build the static site
npm run build

# Preview with Pages Functions locally (serves dist/ + functions/)
npx wrangler pages dev dist
```

This starts a local server that:
- Serves static files from `dist/`
- Runs Pages Functions from `functions/`
- Proxies `/api/*` to the backend ALB

Test by opening the local URL and generating a blog.

---

## Step 6: Deploy to Cloudflare Pages

### Option A: Direct Upload (no git connection)

```bash
# First-time: create the project
npx wrangler pages project create ai-blog-writer --production-branch main

# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name ai-blog-writer
```

### Option B: Connect Git Repo (auto-deploy on push)

1. Go to **Cloudflare Dashboard → Pages → Create a project**
2. Connect your GitHub repo (`ai-writer-client`)
3. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `VITE_API_URL` = `/api`
4. Deploy

After connecting, every `git push` triggers an automatic build + deploy. PRs get preview URLs.

---

## Step 7: Set Environment Variables in Cloudflare

In the **Cloudflare Dashboard → Pages → ai-blog-writer → Settings → Environment variables**:

| Variable | Value | Scope |
|----------|-------|-------|
| `BACKEND_ORIGIN` | `http://blog-writer-alb-1956679534.us-east-1.elb.amazonaws.com` | Production |
| `VITE_API_URL` | `/api` | Production (build-time) |

> `BACKEND_ORIGIN` is used by the Pages Function at runtime.
> `VITE_API_URL` is used by Vite at build time (baked into JS bundle).

---

## Step 8: Update Backend CORS

After getting your Cloudflare Pages URL (e.g. `https://ai-blog-writer.pages.dev`), update the backend CORS:

```bash
cd server/infra

CORS_ORIGINS=https://ai-blog-writer.pages.dev ./deploy.sh YOUR_ACCOUNT_ID
```

This is defense-in-depth — since API calls go through the Pages Function proxy (server-to-server), CORS isn't strictly needed. But it blocks direct ALB access from unauthorized browser origins.

---

## Step 9: Verify

```bash
PAGES_URL="https://ai-blog-writer.pages.dev"  # Replace with your actual URL

# Frontend loads
curl -s -o /dev/null -w "%{http_code}" "$PAGES_URL/"
# Should return 200

# SPA routing works
curl -s -o /dev/null -w "%{http_code}" "$PAGES_URL/blog/test"
# Should return 200

# API proxy works
curl -s -o /dev/null -w "%{http_code}" -X POST "$PAGES_URL/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"topic":"test","as_of":"2026-03-01"}'
# Should return 200
```

---

## Step 10: Tear Down AWS Frontend Resources

Once Cloudflare Pages is verified working, remove the AWS frontend infra:

```bash
BUCKET_NAME="ai-blog-writer-frontend-YOUR_ACCOUNT_ID"
DIST_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"

# 1. Empty and delete S3 bucket
aws s3 rm "s3://$BUCKET_NAME" --recursive
aws s3api delete-bucket --bucket "$BUCKET_NAME"

# 2. Disable CloudFront distribution
ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)
aws cloudfront update-distribution --id "$DIST_ID" --if-match "$ETAG" \
  --distribution-config "$(aws cloudfront get-distribution-config --id "$DIST_ID" \
    --query 'DistributionConfig' --output json | python3 -c '
import sys, json
c = json.load(sys.stdin)
c["Enabled"] = False
print(json.dumps(c))
')" --no-cli-pager

# 3. Wait for disable (~5-15 min)
echo "Waiting for CloudFront to disable..."
aws cloudfront wait distribution-deployed --id "$DIST_ID"

# 4. Delete CloudFront distribution
ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)
aws cloudfront delete-distribution --id "$DIST_ID" --if-match "$ETAG"

# 5. Delete OAC
OAC_ID=$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='blog-writer-oac'].Id" --output text)
ETAG=$(aws cloudfront get-origin-access-control --id "$OAC_ID" --query 'ETag' --output text)
aws cloudfront delete-origin-access-control --id "$OAC_ID" --if-match "$ETAG"
```

> **Do NOT delete the ALB, ECS, or any backend resources.** Only the S3 bucket, CloudFront distribution, and OAC are replaced by Cloudflare Pages.

---

## Files to Create

| File | Purpose |
|------|---------|
| `functions/api/[[path]].ts` | Pages Function — proxies `/api/*` to ALB |
| `wrangler.toml` | Wrangler config (project name, env vars) |

## Files That Don't Change

| File | Why |
|------|-----|
| `src/lib/api.ts` | Already uses relative `/api` path |
| `.env` | Already has `VITE_API_URL=/api` |
| `vite.config.ts` | Dev proxy unchanged (still proxies to `localhost:8000`) |
| `package.json` | No script changes needed |
| All React components | No changes — same data flow |

---

## Cloudflare Pages Free Tier Limits

| Resource | Limit |
|----------|-------|
| Requests | 100,000/day |
| Pages Functions invocations | 100,000/day |
| Build minutes | 500/month |
| Bandwidth | Unlimited |
| Max file size (static) | 25 MB |
| Pages Function CPU time | 10ms (free) / 50ms (paid) |

> The 10ms CPU time limit for Pages Functions is per-invocation **CPU time** (not wall clock). The proxy function just forwards a request — well under 1ms of CPU. The SSE stream is I/O wait, not CPU. No issue.

---

## Summary

| Step | Action | What changes |
|------|--------|-------------|
| 1 | Install wrangler | Dev dependency |
| 2 | Create `functions/api/[[path]].ts` | New file — API proxy |
| 3 | Create `wrangler.toml` | New file — config |
| 4 | Verify no code changes | Nothing |
| 5 | Test locally | `wrangler pages dev dist` |
| 6 | Deploy to Cloudflare Pages | Static files + functions |
| 7 | Set env vars | `BACKEND_ORIGIN` in dashboard |
| 8 | Update backend CORS | Redeploy with new origin |
| 9 | Verify | curl checks |
| 10 | Tear down AWS frontend | S3 + CloudFront + OAC only |
