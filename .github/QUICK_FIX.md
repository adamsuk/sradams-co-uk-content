# Quick Fix for Error 9106

## The Problem
You're getting: `Authentication failed (status: 400) [code: 9106]`

**Cause**: You're using a Global API Key instead of an API Token.

## The Solution (5 minutes)

### Step 1: Create API Token in Cloudflare
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click: **"Create Token"**
3. Click: **"Get started"** under "Custom Token"
4. Name: `GitHub Actions`
5. Permissions: Set **Account** → **Cloudflare Pages** → **Edit**
6. Click: **"Continue to summary"** → **"Create Token"**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Update GitHub Secret
1. Go to: https://github.com/adamsuk/sradams-co-uk-content/settings/secrets/actions
2. Find: `CLOUDFLARE_API_TOKEN`
3. Click: **"Update"**
4. Paste: Your new token from Step 1
5. Click: **"Update secret"**

### Step 3: Re-run Workflow
1. Go to: https://github.com/adamsuk/sradams-co-uk-content/actions
2. Click: The failed workflow
3. Click: **"Re-run all jobs"**
4. ✅ Should succeed now!

## Need More Help?
See the detailed guide: `.github/CLOUDFLARE_SETUP.md`

## Verify Your Settings
```
CLOUDFLARE_ACCOUNT_ID: fcaa04edb848e219bd85f8bfedb0c5b9 ✓
CLOUDFLARE_PROJECT_NAME: sradams-co-uk-content ✓
CLOUDFLARE_API_TOKEN: [Update this with new API Token] ⚠️
```
