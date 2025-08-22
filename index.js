// index.js
const axios = require('axios');
const fs = require('fs');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

env.config();

/* ====== Config (via .env with fallbacks) ====== */
const API_URL = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN;
const LANGUAGE = process.env.SEARCH_LANGUAGE || 'javascript';
const LABEL = process.env.LABEL || 'good first issue';
const PER_PAGE = parseInt(process.env.PER_PAGE || '10', 10);
const MAX_ELAPSED_TIME = parseInt(process.env.MAX_ELAPSED_MS || String(2 * 60 * 1000), 10); // 2 minutes
const MAX_ISSUES_COUNT = parseInt(process.env.MAX_ISSUES || '30', 10);
const WAIT_TIME = parseInt(process.env.WAIT_MS || '1000', 10); // between repo pages

if (!TOKEN) {
  console.error('❌ No GitHub token loaded. Create .env with GITHUB_TOKEN=...');
  process.exit(1);
}

/* ====== Axios instance with default headers ====== */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'User-Agent': 'js-good-first-issues-finder (nimmi)',
    Accept: 'application/vnd.github+json',
  },
  timeout: 15000,
});

/* ====== Helper: Sleep ====== */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ====== Helper: Rate-limit handling in catch blocks ====== */
function explainError(ctx, error) {
  const status = error?.response?.status;
  const remaining = error?.response?.headers?.['x-ratelimit-remaining'];
  const resetTs = error?.response?.headers?.['x-ratelimit-reset'];
  const resetInMs = resetTs ? Math.max(0, parseInt(resetTs, 10) * 1000 - Date.now()) : null;

  if (status === 403 && remaining === '0') {
    const secs = resetInMs ? Math.ceil(resetInMs / 1000) : 'a bit';
    console.error(`⏳ Rate limit hit while ${ctx}. Try again in ~${secs}s.`);
  } else {
    console.error(`❌ ${ctx} failed: ${status || ''} ${error?.message}`);
  }
}

/* ====== Emoji mapping based on common labels/keywords ====== */
function labelToEmoji(labels = []) {
  const names = labels.map((l) => (typeof l === 'string' ? l : l.name || '')).join(' ').toLowerCase();
  if (names.includes('bug')) return '🐞';
  if (names.includes('enhancement') || names.includes('feature')) return '✨';
  if (names.includes('docs') || names.includes('documentation')) return '📄';
  if (names.includes('ui') || names.includes('ux') || names.includes('design')) return '🎨';
  if (names.includes('test')) return '🧪';
  if (names.includes('refactor')) return '♻️';
  return '🟢'; // default marker
}

/**
 * Search repositories that have good first issues in the chosen language.
 * Uses GitHub search API; we request per_page and page.
 */
async function getJavascriptRepos(page) {
  try {
    const res = await api.get('/search/repositories', {
      params: {
        q: `good-first-issues:>2 language:${LANGUAGE}`,
        sort: 'updated',
        order: 'desc',
        page,
        per_page: PER_PAGE,
      },
    });
    // Keep only repos explicitly tagged as JavaScript (safety)
    return (res.data.items || []).filter((repo) => repo.language === 'JavaScript');
  } catch (error) {
    explainError(`fetching repos (page ${page})`, error);
    return [];
  }
}

/**
 * Fetch open issues for a repository filtered by LABEL within the last month.
 */
async function getFilteredIssues(repo) {
  try {
    const res = await api.get(`/repos/${repo.full_name}/issues`, {
      params: {
        state: 'open',
        labels: LABEL,
        sort: 'updated',
        direction: 'desc',
        per_page: PER_PAGE,
      },
    });

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return (res.data || []).filter((issue) => {
      const updatedAt = new Date(issue.updated_at);
      return updatedAt > lastMonth && !issue.pull_request; // exclude PRs
    });
  } catch (error) {
    explainError(`fetching issues for ${repo.full_name}`, error);
    return [];
  }
}

/**
 * Main collector: loops over repo pages until limits are hit.
 */
async function getGoodFirstIssues() {
  let goodFirstIssues = [];
  let page = 1;
  let issuesCount = 0;
  let elapsedTime = 0;
  const start = Date.now();

  while (elapsedTime < MAX_ELAPSED_TIME && issuesCount < MAX_ISSUES_COUNT) {
    const repos = await getJavascriptRepos(page);
    if (!repos.length) break;

    for (const repo of repos) {
      console.log(`Fetching issues for ${repo.full_name}`);
      const issues = await getFilteredIssues(repo);

      if (issues.length > 0) {
        goodFirstIssues.push({ repo, issues });
        issuesCount += issues.length;
        if (issuesCount >= MAX_ISSUES_COUNT) break;
      }
    }

    page++;
    elapsedTime = Date.now() - start;
    await sleep(WAIT_TIME);
  }

  // Build Markdown
  const stamp = new Date().toISOString().slice(0, 10);
  let markdown = `# Good First Issues\n\n`;
  markdown += `This is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!\n\n`;
  markdown += `This list gets updated every day at midnight.\n\n`;
  markdown += `_Last updated: ${stamp}. Language: ${LANGUAGE}. Label: "${LABEL}"._\n\n`;

  for (const block of goodFirstIssues) {
    const repoUrl = block.repo.html_url || `https://github.com/${block.repo.full_name}`;
    markdown += `## [${block.repo.full_name}](${repoUrl})\n\n`;
    for (const item of block.issues) {
      const emoji = labelToEmoji(item.labels);
      markdown += `- ${emoji} [${item.title}](${item.html_url})\n`;
    }
    markdown += '\n';
  }

  fs.writeFileSync('README.md', markdown);
}

/**
 * Convert README.md to index.html with stylesheet
 */
async function convertToHtml() {
  try {
    const md = new Markdown();
    md.render(
      'README.md',
      {
        title: 'Good Javascript First Issues',
        highlight: true,
        highlightTheme: 'github',
        stylesheet: 'styles.css',
        context: 'https://github.com',
      },
      function (err) {
        if (err) throw err;
        md.pipe(fs.createWriteStream('index.html'));
      }
    );
  } catch (e) {
    console.error('>>> ' + e);
    process.exit(1);
  }
}

/* ====== Run ====== */
(async function main() {
  await getGoodFirstIssues();
  await convertToHtml();
})();
