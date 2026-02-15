# Cloudflare Pages Setup Guide

## Problem: Authentication Failed (Error 9106)

If you're seeing this error:
```
Authentication failed (status: 400) [code: 9106]
```

This means you're using the wrong type of API credential. This guide will help you fix it.

## Important: Global API Key vs API Token

**❌ DO NOT USE**: Global API Key
- This is the old authentication method
- It's deprecated and doesn't work with Cloudflare Pages
- It looks like a long hex string from your Profile page

**✅ USE THIS**: API Token with specific permissions
- This is the modern, secure authentication method
- It has granular permissions and can be scoped to specific services
- Required for Cloudflare Pages deployments

## How to Create the Correct API Token

### Step 1: Navigate to API Tokens
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your profile icon (top right)
3. Select **"My Profile"**
4. Click on **"API Tokens"** in the left sidebar
5. Click **"Create Token"**

### Step 2: Set Up Token Permissions
1. Under **"Custom Token"**, click **"Get started"**
2. Give your token a name: `GitHub Actions - Pages Deploy`
3. Under **"Permissions"**, configure:
   - **Account** → **Cloudflare Pages** → **Edit**
4. (Optional) Under **"Account Resources"**:
   - Include → Specific account → Select your account
5. (Optional) Under **"IP Address Filtering"**:
   - You can leave this blank for GitHub Actions
6. (Optional) Set a **TTL** (Time To Live) for when the token expires
7. Click **"Continue to summary"**
8. Review your settings
9. Click **"Create Token"**

### Step 3: Save Your Token
1. **IMPORTANT**: Copy the token that is displayed
2. This is the **ONLY** time you'll see this token
3. Store it securely - you'll add it to GitHub Secrets next

### Step 4: Update GitHub Secrets
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Find the `CLOUDFLARE_API_TOKEN` secret
4. Click **"Update"** (or **"New repository secret"** if it doesn't exist)
5. Paste your new API Token
6. Click **"Update secret"**

### Step 5: Verify Your Other Secrets
Make sure you also have these secrets set correctly:

#### CLOUDFLARE_ACCOUNT_ID
- Find this in your Cloudflare URL: `https://dash.cloudflare.com/YOUR_ACCOUNT_ID/pages/...`
- Example: `fcaa04edb848e219bd85f8bfedb0c5b9`

#### CLOUDFLARE_PROJECT_NAME
- This is the name of your Pages project
- Find it in the URL: `https://dash.cloudflare.com/.../pages/view/YOUR_PROJECT_NAME`
- Example: `sradams-co-uk-content`

## Testing the Fix

After updating your secrets:
1. Go to the **Actions** tab in your repository
2. Find a recent failed workflow run
3. Click **"Re-run all jobs"**
4. The deployment should now succeed!

## Troubleshooting

### Still getting error 9106?
- Make sure you created an **API Token**, not copied the Global API Key
- Verify the token has **"Cloudflare Pages — Edit"** permission
- Check that you pasted the token correctly (no extra spaces)

### Getting a different error?
- Verify your `CLOUDFLARE_ACCOUNT_ID` matches the ID in your Cloudflare dashboard URL
- Verify your `CLOUDFLARE_PROJECT_NAME` matches exactly (case-sensitive)
- Check that the Pages project already exists in Cloudflare (create it manually if needed)

## Additional Resources

- [Cloudflare API Tokens Documentation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/platform/direct-upload/)
- [Wrangler Action Documentation](https://github.com/cloudflare/wrangler-action)
