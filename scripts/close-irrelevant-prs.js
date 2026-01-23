#!/usr/bin/env node

/**
 * Script to identify and close irrelevant pull requests
 * 
 * This script:
 * 1. Fetches all open PRs from the repository
 * 2. Identifies Snyk PRs that are upgrading to versions older than current package.json
 * 3. Closes those PRs with an appropriate message
 * 
 * Usage:
 *   node scripts/close-irrelevant-prs.js [--dry-run]
 * 
 * Options:
 *   --dry-run: Only show which PRs would be closed without actually closing them
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

// Read current package.json to get current versions
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Important packages to display in summary
const IMPORTANT_PACKAGES = ['next', 'axios', 'webpack', 'tailwindcss', 'firebase', 'ramda'];

// Generate comment for closing PR
function generateCloseComment(reason) {
  return `Closing this PR as it is now irrelevant.

Reason: ${reason}

The package has been upgraded to a newer version in the main branch, making this PR obsolete.`;
}

// Extract version from dependency string (e.g., "^14.2.33" -> "14.2.33")
function extractVersion(versionString) {
  if (!versionString) return null;
  return versionString.replace(/^[\^~]/, '');
}

// Compare semantic versions
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

// Get current versions from package.json
function getCurrentVersions() {
  const allDependencies = {
    ...packageJson.dependencies || {},
    ...packageJson.devDependencies || {}
  };
  
  const versions = {};
  for (const [pkg, version] of Object.entries(allDependencies)) {
    versions[pkg] = extractVersion(version);
  }
  
  return versions;
}

// Parse Snyk PR title to extract package name and target version
// Example: "[Snyk] Security upgrade next from 12.3.4 to 14.2.32"
function parseSnykPR(title) {
  const upgradeMatch = title.match(/\[Snyk\]\s+(?:Security\s+)?[Uu]pgrade\s+(\S+)\s+from\s+[\d.]+\s+to\s+([\d.]+)/);
  if (upgradeMatch) {
    return {
      package: upgradeMatch[1],
      targetVersion: upgradeMatch[2]
    };
  }
  
  // Some PRs might have different format
  // "[Snyk] Fix for X vulnerabilities" - we'll need to check the PR details
  return null;
}

// Check if a PR is irrelevant
function isIrrelevantPR(pr, currentVersions) {
  // Skip non-Snyk PRs
  if (!pr.title.includes('[Snyk]')) {
    return { irrelevant: false };
  }
  
  const parsed = parseSnykPR(pr.title);
  if (!parsed) {
    // Can't parse - might need manual review
    return { irrelevant: false, reason: 'Unable to parse Snyk PR format' };
  }
  
  const { package: pkg, targetVersion } = parsed;
  const currentVersion = currentVersions[pkg];
  
  if (!currentVersion) {
    return { irrelevant: false, reason: `Package ${pkg} not found in package.json` };
  }
  
  // Compare versions
  const comparison = compareVersions(targetVersion, currentVersion);
  
  if (comparison < 0) {
    return {
      irrelevant: true,
      reason: `Target version ${targetVersion} is older than current version ${currentVersion}`
    };
  } else if (comparison === 0) {
    return {
      irrelevant: true,
      reason: `Target version ${targetVersion} is the same as current version ${currentVersion}`
    };
  }
  
  return { irrelevant: false, reason: `Target version ${targetVersion} is newer than current version ${currentVersion}` };
}

// Get all open PRs using GitHub CLI
function getOpenPRs() {
  try {
    // Check if GH_TOKEN is available (GitHub Actions environment)
    const env = process.env.GH_TOKEN ? { ...process.env, GH_TOKEN: process.env.GH_TOKEN } : process.env;
    
    const output = execSync('gh pr list --state open --json number,title,createdAt,url --limit 1000', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
      env: env
    });
    return JSON.parse(output);
  } catch (error) {
    console.error('Error fetching PRs:', error.message);
    console.error('\nTo use this script:');
    console.error('1. In GitHub Actions: Set GH_TOKEN environment variable');
    console.error('2. Locally: Authenticate with GitHub CLI (gh auth login)');
    console.error('\nAlternatively, use the report-only mode to generate a list of PRs to close manually.');
    process.exit(1);
  }
}

// Close a PR with a comment
function closePR(prNumber, reason) {
  const comment = generateCloseComment(reason);
  
  try {
    // Add comment - using JSON to properly escape the comment
    const commentFile = path.join('/tmp', `pr-comment-${prNumber}.txt`);
    fs.writeFileSync(commentFile, comment);
    
    execSync(`gh pr comment ${prNumber} --body-file "${commentFile}"`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    
    // Clean up temp file
    fs.unlinkSync(commentFile);
    
    // Close PR
    execSync(`gh pr close ${prNumber}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });
    
    return true;
  } catch (error) {
    console.error(`Error closing PR #${prNumber}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🔍 Analyzing pull requests...\n');
  
  const currentVersions = getCurrentVersions();
  console.log('📦 Current package versions:');
  Object.entries(currentVersions)
    .filter(([pkg]) => IMPORTANT_PACKAGES.includes(pkg))
    .forEach(([pkg, version]) => {
      console.log(`  - ${pkg}: ${version}`);
    });
  console.log('');
  
  const openPRs = getOpenPRs();
  console.log(`📋 Found ${openPRs.length} open pull requests\n`);
  
  const irrelevantPRs = [];
  const relevantPRs = [];
  
  for (const pr of openPRs) {
    const result = isIrrelevantPR(pr, currentVersions);
    if (result.irrelevant) {
      irrelevantPRs.push({ ...pr, ...result });
    } else {
      relevantPRs.push({ ...pr, ...result });
    }
  }
  
  // Display results
  if (irrelevantPRs.length > 0) {
    console.log(`❌ Found ${irrelevantPRs.length} irrelevant PRs:\n`);
    irrelevantPRs.forEach(pr => {
      console.log(`  #${pr.number}: ${pr.title}`);
      console.log(`    Created: ${pr.createdAt}`);
      console.log(`    Reason: ${pr.reason}`);
      console.log(`    URL: ${pr.url}`);
      console.log('');
    });
  } else {
    console.log('✅ No irrelevant PRs found!\n');
  }
  
  if (relevantPRs.length > 0) {
    console.log(`✅ ${relevantPRs.length} relevant PRs (not closing):\n`);
    relevantPRs.forEach(pr => {
      console.log(`  #${pr.number}: ${pr.title}`);
      if (pr.reason) {
        console.log(`    Note: ${pr.reason}`);
      }
      console.log('');
    });
  }
  
  // Close PRs if not in dry-run mode
  if (irrelevantPRs.length > 0) {
    if (isDryRun) {
      console.log('🏃 DRY RUN: Would close these PRs, but not actually doing it.');
      console.log('   Run without --dry-run to actually close them.');
    } else {
      console.log('🚀 Closing irrelevant PRs...\n');
      let successCount = 0;
      let failCount = 0;
      
      for (const pr of irrelevantPRs) {
        process.stdout.write(`  Closing PR #${pr.number}... `);
        if (closePR(pr.number, pr.reason)) {
          console.log('✅ Done');
          successCount++;
        } else {
          console.log('❌ Failed');
          failCount++;
        }
      }
      
      console.log(`\n✨ Summary: ${successCount} closed, ${failCount} failed`);
    }
  }
}

// Run the script
main();
