# Irrelevant PRs - Analysis and Recommendations

This document lists all open Snyk PRs and identifies which ones should be closed and why.

## Current Package Versions (from package.json)

| Package | Current Version |
|---------|----------------|
| next | 14.2.33 |
| axios | 1.12.0 |
| webpack | 5.80.0 |
| tailwindcss | 3.4.13 |
| ramda | 0.28.0 |
| firebase | *(not installed)* |

---

## ❌ PRs That Should Be CLOSED (13 total)

These PRs target versions that are **older than or equal to** the current versions, making them obsolete.

### Next.js PRs (8 PRs - all obsolete)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #147 | [Snyk] Security upgrade next from 12.3.4 to 14.2.32 | 14.2.32 | **14.2.33** | ❌ Close - older |
| #145 | [Snyk] Security upgrade next from 12.3.4 to 14.2.24 | 14.2.24 | **14.2.33** | ❌ Close - older |
| #142 | [Snyk] Security upgrade next from 12.3.4 to 14.2.25 | 14.2.25 | **14.2.33** | ❌ Close - older |
| #138 | [Snyk] Security upgrade next from 12.3.4 to 14.2.15 | 14.2.15 | **14.2.33** | ❌ Close - older |
| #135 | [Snyk] Security upgrade next from 12.3.4 to 14.2.7 | 14.2.7 | **14.2.33** | ❌ Close - older |
| #128 | [Snyk] Security upgrade next from 12.3.4 to 13.5.0 | 13.5.0 | **14.2.33** | ❌ Close - much older |
| #127 | [Snyk] Security upgrade next from 12.3.4 to 13.5.4 | 13.5.4 | **14.2.33** | ❌ Close - much older |

**Reason:** Next.js has already been upgraded to 14.2.33. All these PRs target older versions and are therefore obsolete.

### Axios PRs (5 PRs - all obsolete)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #143 | [Snyk] Security upgrade axios from 1.6.0 to 1.8.3 | 1.8.3 | **1.12.0** | ❌ Close - older |
| #141 | [Snyk] Security upgrade axios from 1.6.0 to 1.8.2 | 1.8.2 | **1.12.0** | ❌ Close - older |
| #137 | [Snyk] Security upgrade axios from 1.6.0 to 1.7.8 | 1.7.8 | **1.12.0** | ❌ Close - older |
| #132 | [Snyk] Security upgrade axios from 1.6.0 to 1.7.4 | 1.7.4 | **1.12.0** | ❌ Close - older |
| #131 | [Snyk] Security upgrade axios from 1.6.0 to 1.6.4 | 1.6.4 | **1.12.0** | ❌ Close - older |
| #130 | [Snyk] Security upgrade axios from 1.6.0 to 1.6.3 | 1.6.3 | **1.12.0** | ❌ Close - older |

**Reason:** Axios has already been upgraded to 1.12.0. All these PRs target older versions (1.6.x - 1.8.x) and are therefore obsolete.

---

## ✅ PRs That Should Be KEPT (10 total)

These PRs either target newer versions or involve packages not currently installed.

### Webpack PRs (3 PRs - keep, newer versions)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #140 | [Snyk] Security upgrade webpack from 5.80.0 to 5.98.0 | 5.98.0 | **5.80.0** | ✅ Keep - upgrade available |
| #133 | [Snyk] Security upgrade webpack from 5.80.0 to 5.94.0 | 5.94.0 | **5.80.0** | ✅ Keep - upgrade available |
| #125 | [Snyk] Upgrade webpack from 5.80.0 to 5.81.0 | 5.81.0 | **5.80.0** | ✅ Keep - upgrade available |

**Reason:** These PRs offer genuine upgrades to webpack. Consider reviewing and merging #140 (most recent).

### Tailwindcss PRs (2 PRs - keep, major version upgrade)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #146 | [Snyk] Security upgrade tailwindcss from 3.4.13 to 4.0.0 | 4.0.0 | **3.4.13** | ✅ Keep - major upgrade |
| #139 | [Snyk] Security upgrade tailwindcss from 3.4.13 to 4.0.0 | 4.0.0 | **3.4.13** | ✅ Keep - major upgrade (duplicate) |

**Reason:** These propose a major version upgrade (v3 → v4). This requires careful testing. Note: #139 is a duplicate of #146.

### Firebase PRs (2 PRs - keep, package not installed)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #136 | [Snyk] Security upgrade firebase from 8.10.1 to 10.9.0 | 10.9.0 | *N/A* | ✅ Keep - may be needed |
| #126 | [Snyk] Security upgrade firebase from 8.10.1 to 10.2.0 | 10.2.0 | *N/A* | ✅ Keep - may be needed |

**Reason:** Firebase is not currently in package.json. These might be relevant if firebase was removed but is still needed.

### Ramda PR (1 PR - keep, newer version)

| PR # | Title | Target Version | Current | Status |
|------|-------|----------------|---------|--------|
| #118 | [Snyk] Upgrade ramda from 0.28.0 to 0.29.0 | 0.29.0 | **0.28.0** | ✅ Keep - upgrade available |

**Reason:** This offers a genuine upgrade to ramda.

### Generic Fix PRs (2 PRs - keep, cannot parse)

| PR # | Title | Status |
|------|-------|--------|
| #134 | [Snyk] Fix for 3 vulnerabilities | ✅ Keep - needs manual review |
| #150 | [Snyk] Fix for 1 vulnerabilities | ✅ Keep - needs manual review |

**Reason:** Cannot automatically determine which packages these affect. Require manual review.

---

## Summary Statistics

- **Total open Snyk PRs:** 23 (excluding #151 which is this PR, and #150 added recently)
- **Should be closed:** 13 PRs (57%)
  - 8 next.js PRs
  - 5 axios PRs
- **Should be kept:** 10 PRs (43%)
  - 3 webpack PRs (genuine upgrades)
  - 2 tailwindcss PRs (major version upgrade)
  - 2 firebase PRs (package not currently installed)
  - 1 ramda PR (genuine upgrade)
  - 2 generic fix PRs (need manual review)

---

## Recommended Actions

### 1. Close the 13 Obsolete PRs

You can close these manually with the following comment template:

```
Closing this PR as it is now irrelevant. The package has already been upgraded to version X.X.X in the main branch, which is newer than the version targeted by this PR (Y.Y.Y). This makes this PR obsolete.
```

### 2. Review the Remaining PRs

- **Webpack (#140):** Consider merging - security upgrade from 5.80.0 to 5.98.0
- **Tailwindcss (#146):** Major version upgrade - requires testing before merging
- **Ramda (#118):** Consider merging - minor version upgrade
- **Generic fixes (#134, #150):** Review to understand what vulnerabilities they address
- **Firebase (#136, #126):** Determine if firebase is needed; if not, close both
- **Duplicates:** Close #139 (duplicate of #146) and #133/#125 after merging #140

---

## Version Comparison Logic

A PR is considered **obsolete** if:
1. It's a Snyk security/upgrade PR
2. The package exists in the current package.json
3. The target version ≤ current version (using semantic version comparison)

This ensures that only PRs targeting outdated versions are marked for closure, while genuine upgrades are preserved.
