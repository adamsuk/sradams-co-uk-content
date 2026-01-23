# Close Irrelevant PRs Scripts

This directory contains scripts to help identify and close pull requests that are no longer relevant, particularly Snyk automated security upgrade PRs that target versions older than what's currently in the repository.

## Problem

Over time, automated tools like Snyk can create many pull requests for package upgrades. When packages are upgraded through other means (manual updates, consolidated PRs, etc.), older Snyk PRs become obsolete but remain open, cluttering the PR list.

## Solution

Two scripts are provided:

1. **`close-irrelevant-prs.js`** - Automated script that fetches PRs, identifies irrelevant ones, and closes them (requires authentication)
2. **`generate-pr-close-report.js`** - Report generator that analyzes PRs and creates a batch script (works without authentication)

## Quick Start

### Method 1: Using the Report Generator (Recommended)

This method doesn't require authentication and generates a batch script you can review before executing:

```bash
# Step 1: Fetch the list of open PRs (requires gh CLI authentication)
gh pr list --state open --json number,title,createdAt,url > scripts/pr-list.json

# Step 2: Generate the report and batch script
node scripts/generate-pr-close-report.js

# Step 3: Review the generated script
cat scripts/close-prs.sh

# Step 4: Execute the batch script to close all irrelevant PRs
./scripts/close-prs.sh
```

### Method 2: Using the Automated Script

This method requires authentication but does everything in one step:

```bash
# With dry-run (recommended first)
node scripts/close-irrelevant-prs.js --dry-run

# Actual execution
node scripts/close-irrelevant-prs.js
```

## Prerequisites

- Node.js installed
- GitHub CLI (`gh`) installed and authenticated
  - Install: https://cli.github.com/
  - Authenticate: `gh auth login`

## How It Works

The scripts identify PRs as "irrelevant" if:

1. The PR is a Snyk upgrade PR (title contains "[Snyk]")
2. The PR targets a package that exists in the current `package.json`
3. The target version is older than or equal to the current version

For each irrelevant PR, the scripts:
1. Add a comment explaining why it's being closed
2. Close the PR

## Script Details

### generate-pr-close-report.js

**Advantages:**
- Doesn't require GitHub authentication to analyze PRs
- Generates a reviewable batch script before any changes
- Creates a detailed report with all findings
- Safer for first-time use

**Usage:**
```bash
node scripts/generate-pr-close-report.js [pr-list-file.json]
```

**Output:**
- Detailed console report showing current versions, irrelevant PRs, and relevant PRs
- `close-prs.sh` - Executable batch script to close all irrelevant PRs
- Individual `gh pr close` commands you can run manually

### close-irrelevant-prs.js

**Advantages:**
- All-in-one solution
- Fetches PRs directly from GitHub
- Supports `--dry-run` mode for safe testing

**Usage:**
```bash
node scripts/close-irrelevant-prs.js [--dry-run]
```

**Options:**
- `--dry-run`: Only show which PRs would be closed without actually closing them

## Example Output

```
📊 Irrelevant PR Report Generator

================================================================================

📦 Current package versions:
  - next: 14.2.33
  - axios: 1.12.0
  - webpack: 5.80.0
  - tailwindcss: 3.4.13

📋 Analyzing 24 open pull requests
================================================================================


❌ IRRELEVANT PRs (13 total)

These PRs should be closed:

1. PR #145: [Snyk] Security upgrade next from 12.3.4 to 14.2.24
   Created: 2025-05-18T08:50:30Z
   Reason: Target version 14.2.24 is older than current version 14.2.33
   URL: https://github.com/adamsuk/sradams-co-uk-content/pull/145

...

✅ Batch script generated: scripts/close-prs.sh
```

## Current Analysis

Based on the current `package.json`:
- **Next.js**: 14.2.33 - Many old PRs targeting 13.x and 14.2.x versions can be closed
- **Axios**: 1.12.0 - Many old PRs targeting 1.6.x - 1.8.x versions can be closed  
- **Webpack**: 5.80.0 - Some PRs targeting newer versions should be kept
- **Tailwindcss**: 3.4.13 - PRs targeting 4.0.0 should be kept (major version upgrade)

## Troubleshooting

### "gh: command not found"

Install the GitHub CLI: https://cli.github.com/

### "You are not logged into any GitHub hosts"

Authenticate with: `gh auth login`

### "Make sure you are authenticated with GitHub CLI"

Run `gh auth login` to authenticate with GitHub.

## Safety Features

- The report generator lets you review changes before executing
- `--dry-run` flag in the automated script shows what would happen
- Each PR gets a comment explaining why it's being closed
- The scripts only close Snyk PRs that target older versions
- Scripts never modify code or package.json, only PR status
- Generated batch script can be reviewed before execution

## Files Generated

- `pr-list.json` - Cached list of open PRs (gitignored)
- `close-prs.sh` - Batch script to close irrelevant PRs (gitignored)

Both files are automatically added to `.gitignore` to prevent accidental commits.
