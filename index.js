const axios = require('axios');
const fs = require('fs');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

env.config();

const API_URL = 'https://api.github.com';
const TOKEN = process.env.API_KEY;
const MAX_ELAPSED_TIME = 2 * 60 * 1000;
const MAX_ISSUES_COUNT = 200;
const WAIT_TIME = 1000;

/**
 * Build a broader candidate set of repositories across multiple languages and sorts.
 * Returns a Map keyed by full_name to unique repo objects with metrics.
 */
const getCandidateRepos = async () => {
  const languages = ['JavaScript'];
  const sorts = ['updated', 'stars'];
  const per_page = 50; // be gentle with rate limits
  const unique = new Map();

  for (const lang of languages) {
    for (const sort of sorts) {
      for (let page = 1; page <= 2; page++) { // up to 2 pages per combo
        try {
          const response = await axios.get(`${API_URL}/search/repositories`, {
            headers: { Authorization: `token ${TOKEN}` },
            params: {
              q: `good-first-issues:>1 fork:false language:${lang}`,
              sort,
              order: sort === 'stars' ? 'desc' : 'desc',
              per_page,
              page,
            },
          });
          const items = response.data.items || [];
          for (const repo of items) {
            console.log(repo.full_name);
            if (!unique.has(repo.full_name)) {
              unique.set(repo.full_name, repo);
            }
          }
          // brief delay between calls
          await new Promise((r) => setTimeout(r, 250));
        } catch (error) {
          console.error(`Failed to fetch repos lang=${lang} sort=${sort} page=${page}: ${error.message}`);
          break;
        }
      }
    }
  }

  return unique;
};



/**
 * Fetches issues from a repository
 * @param {object} repo - The repository object
 * @returns {array} - The issues array
 */

const getFilteredIssues = async (repo) => {
  try {
    const response = await axios.get(`${API_URL}/repos/${repo.full_name}/issues`, {
      headers: { Authorization: `token ${TOKEN}` },
      params: { state: 'open', labels: 'good first issue', sort: 'updated', per_page: 100 },
    });

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return response.data.filter(issue => {
      const updatedAt = new Date(issue.updated_at);
      return updatedAt > lastMonth;
    });
  } catch (error) {
    console.error(`Failed to fetch issues for ${repo.full_name}: ${error.message}`);
    return [];
  }
};


const getGoodFirstIssues = async () => {
  try {
    let goodFirstIssues = [];
    let issuesCount = 0;
    const start = Date.now();

    // Broaden candidate repos
    const uniqueRepos = await getCandidateRepos();

    // Fetch issues for each repo until limits
    for (const repo of uniqueRepos.values()) {
      if ((Date.now() - start) > MAX_ELAPSED_TIME || issuesCount >= MAX_ISSUES_COUNT) break;
      console.log(`Fetching issues for ${repo.full_name}`);
      const issues = await getFilteredIssues(repo);
      if (issues.length > 0) {
        goodFirstIssues.push({
          repo: repo.full_name, repo_metrics: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            pushed_at: repo.pushed_at,
            updated_at: repo.updated_at,
            language: repo.language,
          }, issues
        });
        issuesCount += issues.length;
      }
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    }

    // Write JSON source of truth for the web app
    const flatItems = [];
    const orgSummaries = {};
    const repoSummaries = {};
    for (const entry of goodFirstIssues) {
      const [org, repoName] = entry.repo.split('/');
      const metrics = entry.repo_metrics || {};

      // repo summary
      repoSummaries[entry.repo] = {
        stars: metrics.stars,
        forks: metrics.forks,
        open_issues: metrics.open_issues,
        pushed_at: metrics.pushed_at,
        updated_at: metrics.updated_at,
        language: metrics.language,
        recent_issues_count: entry.issues.length,
      };

      // org aggregation
      if (!orgSummaries[org]) {
        orgSummaries[org] = { total_repos: 0, total_stars: 0, total_forks: 0, recent_issues_count: 0 };
      }
      orgSummaries[org].total_repos += 1;
      orgSummaries[org].total_stars += metrics.stars || 0;
      orgSummaries[org].total_forks += metrics.forks || 0;
      orgSummaries[org].recent_issues_count += entry.issues.length;

      for (const item of entry.issues) {
        flatItems.push({
          id: item.id,
          title: item.title,
          html_url: item.html_url,
          updated_at: item.updated_at,
          labels: (item.labels || []).map(l => l && l.name).filter(Boolean),
          repo: entry.repo,
          org,
          repo_name: repoName,
          repo_stars: metrics.stars,
          repo_forks: metrics.forks,
          repo_pushed_at: metrics.pushed_at,
        });
      }
    }
    // derive activity frequency per org
    for (const org of Object.keys(orgSummaries)) {
      const o = orgSummaries[org];
      o.activity_frequency = o.total_repos ? Number((o.recent_issues_count / o.total_repos).toFixed(2)) : 0;
      // naive popularity score: stars + forks*2
      o.popularity_score = o.total_stars + (o.total_forks * 2);
    }

    const jsonOut = { generated_at: new Date().toISOString(), items: flatItems, org_summaries: orgSummaries, repo_summaries: repoSummaries };
    fs.writeFileSync('./issues.json', JSON.stringify(jsonOut, null, 2));


    // Rebuild README content
    let markdown = `# 🚀 Good First Issues Finder\n\n`;
    markdown += `> Discover beginner-friendly open source issues in JavaScript repositories — updated automatically every day at midnight.\n\n`;
    markdown += `![GitHub Actions](https://img.shields.io/github/actions/workflow/status/suyash-thakur/js-good-first-issues-finder/main.yml?label=Daily%20Update&style=flat-square)\n`;
    markdown += `![License](https://img.shields.io/github/license/suyash-thakur/js-good-first-issues-finder?style=flat-square)\n`;
    markdown += `![Issues](https://img.shields.io/badge/issues-good%20first%20issue-brightgreen?style=flat-square)\n\n`;
    markdown += `---\n\n`;
    markdown += `## 📖 About\n\n`;
    markdown += `**Good First Issues Finder** is an automated tool that scans GitHub daily for JavaScript repositories with open issues labelled \`good first issue\`. It helps new contributors find approachable tasks in active, real-world projects — no experience required!\n\n`;
    markdown += `The project has two parts:\n`;
    markdown += `- A **Node.js script** (\`index.js\`) that fetches issues from the GitHub API and writes this README, \`issues.json\`, and \`index.html\`.\n`;
    markdown += `- A **Next.js web app** (\`web/\`) with search, filtering, and sorting — hosted live for easy browsing.\n\n`;
    markdown += `---\n\n`;
    markdown += `## ⚙️ How It Works\n\n`;
    markdown += `1. A GitHub Actions workflow runs every day at midnight (UTC).\n`;
    markdown += `2. The script queries the GitHub Search API for JavaScript repositories with more than one \`good first issue\`.\n`;
    markdown += `3. For each repository found, it fetches open issues labelled \`good first issue\` updated within the last month.\n`;
    markdown += `4. Results are written to \`issues.json\` (used by the web app), \`README.md\` (this file), and \`index.html\`.\n\n`;
    markdown += `---\n\n`;
    markdown += `## 🛠️ Local Setup\n\n`;
    markdown += `### Prerequisites\n`;
    markdown += `- [Node.js](https://nodejs.org/) v18 or higher\n`;
    markdown += `- A [GitHub Personal Access Token](https://github.com/settings/tokens) with \`public_repo\` scope\n\n`;
    markdown += `### Steps\n\n`;
    markdown += `\`\`\`bash\n`;
    markdown += `# 1. Clone the repository\n`;
    markdown += `git clone https://github.com/suyash-thakur/js-good-first-issues-finder.git\n`;
    markdown += `cd js-good-first-issues-finder\n\n`;
    markdown += `# 2. Install dependencies\n`;
    markdown += `npm install\n\n`;
    markdown += `# 3. Create your environment file\n`;
    markdown += `cp .env.example .env\n`;
    markdown += `# Then open .env and add your GitHub token\n\n`;
    markdown += `# 4. Run the script\n`;
    markdown += `node index.js\n`;
    markdown += `\`\`\`\n\n`;
    markdown += `### Running the Web App\n\n`;
    markdown += `\`\`\`bash\n`;
    markdown += `cd web\n`;
    markdown += `npm install\n`;
    markdown += `npm run dev\n`;
    markdown += `# Open http://localhost:3000\n`;
    markdown += `\`\`\`\n\n`;
    markdown += `---\n\n`;
    markdown += `## 🤝 Contributing\n\n`;
    markdown += `Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.\n\n`;
    markdown += `Some good first contributions to this project itself:\n`;
    markdown += `- Add support for more programming languages\n`;
    markdown += `- Improve the web app UI\n`;
    markdown += `- Fix bugs listed in open issues\n`;
    markdown += `- Improve documentation\n\n`;
    markdown += `---\n\n`;
    markdown += `## 📋 Good First Issues List\n\n`;
    markdown += `> ⚡ This section is **auto-generated** and updated every day at midnight.\n\n`;
    markdown += `This list gets updated every day at midnight.\n\n`;

    for (const issue of goodFirstIssues) {
      markdown += `## [${issue.repo}](${issue.issues[0].html_url.split('/issues')[0]})\n\n`;
      for (const item of issue.issues) {
        markdown += `- [${item.title}](${item.html_url})\n`;
      }
      markdown += '\n';
    }

    fs.writeFileSync('README.md', markdown);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    process.exit();
  }
};

const convertToHtml = async () => {
  try {
    const md = new Markdown();

    md.render('README.md', {
      title: 'Good Javascript First Issues',
      highlight: true,
      highlightTheme: 'github',
      stylesheet: 'styles.css',
      context: 'https://github.com',
    }, function (err) {
      if (err) {
        throw err;
      }
      md.pipe(fs.createWriteStream('index.html'));
    });
  } catch (e) {
    console.error('>>>' + e);
    process.exit();
  }
};

const main = async () => {
  await getGoodFirstIssues();
  await convertToHtml();
};

main();
