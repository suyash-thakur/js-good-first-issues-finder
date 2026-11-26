# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Proper project README with about section, setup guide, how-it-works, and contributing instructions (preserved across daily auto-regeneration via template in `index.js`)
- `CHANGELOG.md` to track notable changes over time
- `.env.example` file to guide new contributors on required environment variables

### Fixed
- README.md now includes a complete project description header that persists through the daily auto-generation cycle
- Removed duplicate `order: 'desc'` value in the ternary expression in `getCandidateRepos()` (`index.js`)

### Changed
- Updated GitHub Actions workflow to use `actions/checkout@v4` and `actions/setup-node@v4`
- Bumped Node.js version in CI from `16.x` (End of Life) to `20.x` (LTS)
- CI git commit step now uses `github-actions[bot]` identity instead of a hardcoded maintainer name and email
- `issues.json` is now included in the automated git commit so the web app always has fresh data

---

## [1.2.0] - 2024-05-01

### Added
- Next.js web app (`web/`) with interactive issue browsing, search, and filtering
- Organisation and repository filter dropdowns with searchable select
- Popularity and activity tag filters based on star count and issue frequency
- Mobile-responsive layout with sheet-based filter panel on small screens
- History panel to track previously viewed issues
- "How it works" page at `/how-it-works`
- Dark mode support using CSS variables and `prefers-color-scheme`
- Glassmorphism UI effects and smooth Framer Motion animations

### Changed
- `issues.json` output expanded to include `org_summaries` and `repo_summaries` for richer web app filtering
- Flat issue items in `issues.json` now carry `org`, `repo_name`, `repo_stars`, `repo_forks`, and `repo_pushed_at` fields

---

## [1.1.0] - 2024-02-10

### Added
- Candidate repository fetching via `getCandidateRepos()` — queries multiple sort orders (`updated`, `stars`) to broaden the pool
- Per-org aggregation metrics: `total_repos`, `total_stars`, `total_forks`, `activity_frequency`, `popularity_score`
- `issues.json` file generated alongside `README.md` and `index.html` for structured data access
- Time-box limit (`MAX_ELAPSED_TIME`) and issue count cap (`MAX_ISSUES_COUNT`) to avoid hitting API rate limits
- 1-second wait between repository issue fetches to be gentle on GitHub's API

### Changed
- `getFilteredIssues()` now filters to issues updated within the last month only
- `index.js` script restructured into clearly separated async functions: `getCandidateRepos`, `getFilteredIssues`, `getGoodFirstIssues`, `convertToHtml`

### Fixed
- Duplicate repository entries removed using a `Map` keyed by `full_name`

---

## [1.0.0] - 2023-11-01

### Added
- Initial release of the Good First Issues Finder
- `index.js` Node.js script to fetch JavaScript repositories with `good first issue` labels from the GitHub API
- Daily scheduled GitHub Actions workflow (`main.yml`) to run the script and commit updated `README.md` and `index.html`
- `styles.css` for the generated `index.html` page with responsive design
- CSS variables for font sizes (`--size-20`, `--size-56`, etc.) for accessible scaling
- `CONTRIBUTING.md` with guidelines for contributors
- `CODE_OF_CONDUCT.md` to set community expectations
- `.gitignore` for Node.js projects
- Issue templates for bug reports and feature requests

---

[Unreleased]: https://github.com/suyash-thakur/js-good-first-issues-finder/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/suyash-thakur/js-good-first-issues-finder/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/suyash-thakur/js-good-first-issues-finder/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/suyash-thakur/js-good-first-issues-finder/releases/tag/v1.0.0
