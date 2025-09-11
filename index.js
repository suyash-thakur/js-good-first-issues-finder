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
    let markdown = `# Good First Issues\n\nThis is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!\n\n`;
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
