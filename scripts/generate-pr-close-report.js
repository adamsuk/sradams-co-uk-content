#!/usr/bin/env node

/**
 * Generate a report of irrelevant PRs that should be closed
 * This version doesn't require GitHub authentication - it works with a pre-fetched PR list
 * 
 * Usage:
 *   node scripts/generate-pr-close-report.js <pr-list-file.json>
 * 
 * The PR list file should be JSON output from: gh pr list --state open --json number,title,createdAt,url
 * Or you can use the included pr-list.json if available
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const prListFile = args[0] || path.join(__dirname, 'pr-list.json');

// Read current package.json to get current versions
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Important packages to display in summary
const IMPORTANT_PACKAGES = ['next', 'axios', 'webpack', 'tailwindcss', 'firebase', 'ramda'];

// Generate comment for closing PR
function generateCloseComment(reason) {
  return `Closing this PR as it is now irrelevant. ${reason}. The package has been upgraded to a newer version in the main branch, making this PR obsolete.`;
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
function parseSnykPR(title) {
  const upgradeMatch = title.match(/\[Snyk\]\s+(?:Security\s+)?[Uu]pgrade\s+(\S+)\s+from\s+[\d.]+\s+to\s+([\d.]+)/);
  if (upgradeMatch) {
    return {
      package: upgradeMatch[1],
      targetVersion: upgradeMatch[2]
    };
  }
  
  return null;
}

// Check if a PR is irrelevant
function isIrrelevantPR(pr, currentVersions) {
  if (!pr.title.includes('[Snyk]')) {
    return { irrelevant: false };
  }
  
  const parsed = parseSnykPR(pr.title);
  if (!parsed) {
    return { irrelevant: false, reason: 'Unable to parse Snyk PR format' };
  }
  
  const { package: pkg, targetVersion } = parsed;
  const currentVersion = currentVersions[pkg];
  
  if (!currentVersion) {
    return { irrelevant: false, reason: `Package ${pkg} not found in package.json` };
  }
  
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

// Main function
function main() {
  console.log('📊 Irrelevant PR Report Generator\n');
  console.log('='.repeat(80));
  
  // Check if PR list file exists
  if (!fs.existsSync(prListFile)) {
    console.error(`\n❌ Error: PR list file not found: ${prListFile}`);
    console.error('\nTo generate a PR list, run:');
    console.error('  gh pr list --state open --json number,title,createdAt,url > scripts/pr-list.json');
    console.error('\nThen run this script again.');
    process.exit(1);
  }
  
  const currentVersions = getCurrentVersions();
  console.log('\n📦 Current package versions:');
  Object.entries(currentVersions)
    .filter(([pkg]) => IMPORTANT_PACKAGES.includes(pkg))
    .forEach(([pkg, version]) => {
      console.log(`  - ${pkg}: ${version}`);
    });
  
  const openPRs = JSON.parse(fs.readFileSync(prListFile, 'utf8'));
  console.log(`\n📋 Analyzing ${openPRs.length} open pull requests`);
  console.log('='.repeat(80));
  
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
  
  // Generate report
  if (irrelevantPRs.length > 0) {
    console.log(`\n\n❌ IRRELEVANT PRs (${irrelevantPRs.length} total)\n`);
    console.log('These PRs should be closed:\n');
    
    irrelevantPRs.forEach((pr, index) => {
      console.log(`${index + 1}. PR #${pr.number}: ${pr.title}`);
      console.log(`   Created: ${pr.createdAt}`);
      console.log(`   Reason: ${pr.reason}`);
      console.log(`   URL: ${pr.url}`);
      console.log('');
    });
    
    // Generate GitHub CLI commands
    console.log('\n' + '='.repeat(80));
    console.log('\n📝 COMMANDS TO CLOSE THESE PRs:\n');
    console.log('Copy and paste these commands to close all irrelevant PRs:\n');
    
    irrelevantPRs.forEach(pr => {
      console.log(`# Close PR #${pr.number}: ${pr.title.substring(0, 60)}${pr.title.length > 60 ? '...' : ''}`);
      const comment = generateCloseComment(pr.reason);
      console.log(`gh pr close ${pr.number} --comment "${comment}"`);
      console.log('');
    });
    
    // Generate a batch script file
    const scriptContent = irrelevantPRs.map(pr => {
      const comment = generateCloseComment(pr.reason);
      return `gh pr close ${pr.number} --comment "${comment}"`;
    }).join('\n');
    
    const scriptPath = path.join(__dirname, 'close-prs.sh');
    fs.writeFileSync(scriptPath, '#!/bin/bash\n\n' + scriptContent + '\n');
    fs.chmodSync(scriptPath, '755');
    
    console.log(`\n✅ Batch script generated: ${scriptPath}`);
    console.log('\nYou can also run: ./scripts/close-prs.sh');
    
  } else {
    console.log('\n\n✅ No irrelevant PRs found!');
  }
  
  if (relevantPRs.length > 0) {
    console.log(`\n\n✅ RELEVANT PRs (${relevantPRs.length} total)\n`);
    console.log('These PRs should be kept open:\n');
    
    relevantPRs.forEach((pr, index) => {
      console.log(`${index + 1}. PR #${pr.number}: ${pr.title}`);
      if (pr.reason) {
        console.log(`   Note: ${pr.reason}`);
      }
      console.log('');
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('Report generated successfully!');
}

main();
