#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Build script that conditionally includes Storybook in deployments
 *
 * For CloudFlare Pages:
 * - Production branch deployments: Only build Next.js app
 * - Preview/branch deployments: Build Next.js app + Storybook
 *
 * Environment variables:
 * - CF_PAGES_BRANCH: The branch being deployed (provided by CloudFlare Pages)
 * - STORYBOOK_ENABLED: Explicit flag to enable/disable Storybook (optional)
 */

const exec = (command, description) => {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
};

const copyDirectory = (src, dest) => {
  console.log(`\n📁 Copying ${src} to ${dest}...`);

  if (!fs.existsSync(src)) {
    console.error(`❌ Source directory ${src} does not exist`);
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Use native copy command to copy contents (not the directory itself)
  const command = process.platform === 'win32'
    ? `xcopy /E /I /Y "${src}\\*" "${dest}"`
    : `cp -r "${src}/." "${dest}"`;

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Copied ${src} to ${dest}\n`);
  } catch (error) {
    console.error(`❌ Failed to copy ${src} to ${dest}`);
    process.exit(1);
  }
};

const shouldIncludeStorybook = () => {
  // Check explicit flag first
  if (process.env.STORYBOOK_ENABLED !== undefined) {
    return process.env.STORYBOOK_ENABLED === 'true';
  }

  // For CloudFlare Pages
  const branch = process.env.CF_PAGES_BRANCH;
  if (branch) {
    // Exclude production and main branches
    const productionBranches = ['production', 'main', 'master'];
    const isProduction = productionBranches.includes(branch);

    console.log(`\n🌿 Branch detected: ${branch}`);
    console.log(`🏭 Is production branch: ${isProduction}`);

    return !isProduction;
  }

  // For other environments, check NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    console.log('\n🏭 NODE_ENV is production, excluding Storybook');
    return false;
  }

  // Default: include Storybook for development/preview
  console.log('\n🔧 No production environment detected, including Storybook');
  return true;
};

const main = () => {
  console.log('\n🚀 Starting build process...\n');

  // Build Next.js app - use local installation
  exec('npm run build:next-only', 'Building Next.js application');

  // Check if we should include Storybook
  const includeStorybook = shouldIncludeStorybook();

  if (includeStorybook) {
    console.log('\n📚 Storybook will be included in this deployment\n');

    // Build Storybook
    exec('npm run build-storybook', 'Building Storybook');

    // Copy Storybook to out/storybook
    const storybookSource = path.join(__dirname, '..', 'storybook-static');
    const storybookDest = path.join(__dirname, '..', 'out', 'storybook');

    copyDirectory(storybookSource, storybookDest);

    console.log('\n✅ Build completed with Storybook');
    console.log('📖 Storybook will be available at: /storybook/\n');
  } else {
    console.log('\n⏭️  Skipping Storybook build (production deployment)\n');
    console.log('✅ Build completed without Storybook\n');
  }
};

main();
