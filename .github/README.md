# GitHub Actions Configuration

This directory contains GitHub Actions workflows for automated deployments.

## Workflows

### cloudflare-deploy.yml

Automates deployment to Cloudflare Pages and registers deployments in GitHub.

**Triggers:**
- Push to `main` branch → Production deployment
- Pull requests to `main` branch → Preview deployment

**Features:**
- Builds the Next.js application
- Deploys to Cloudflare Pages
- Registers deployments in GitHub's deployment system
- Adds deployment URLs to pull request comments

## Required Secrets

To use this workflow, configure the following secrets in your repository settings (`Settings → Secrets and variables → Actions`):

| Secret Name | Description | Where to Find |
|------------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages permissions | [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) → Create Token → Use "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Overview → Account ID |
| `CLOUDFLARE_PROJECT_NAME` | Your Cloudflare Pages project name | [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Your project name |

### Creating a Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template or create a custom token with:
   - Permissions: `Account → Cloudflare Pages → Edit`
4. Copy the token and add it as `CLOUDFLARE_API_TOKEN` secret in GitHub

### Finding Your Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on "Workers & Pages"
3. Your Account ID is displayed in the right sidebar

### Finding Your Project Name

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on "Workers & Pages"
3. Click on your Pages project
4. The project name is in the URL: `dash.cloudflare.com/<account-id>/pages/view/<project-name>`

## Deployment Environments

The workflow creates two GitHub environments:
- **production**: Deployments from the `main` branch
- **preview**: Deployments from pull requests

You can view deployments in the "Environments" section of your GitHub repository.

## Troubleshooting

If deployments fail, check:
1. All required secrets are configured correctly
2. The Cloudflare API token has the correct permissions
3. The project name matches your Cloudflare Pages project
4. The build output directory (`out`) is correct for your Next.js configuration
