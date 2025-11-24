require('dotenv').config();

const axios = require('axios');
const fs = require('fs').promises;
const fsSync = require('fs');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

env.config();

// Configuration constants
const API_URL = 'https://api.github.com';
const TOKEN = process.env.API_KEY;
const MAX_ELAPSED_TIME = 2 * 60 * 1000; // 2 minutes
const MAX_ISSUES_COUNT = 200;
const WAIT_TIME = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Validate environment variables
if (!TOKEN) {
  console.error('ERROR: API_KEY environment variable is not set.');
  console.error('Please create a .env file with your GitHub API token.');
  process.exit(1);
}

/**
 * Delays execution for the specified number of milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Makes an API request with retry logic
 * @param {string} url - The API endpoint URL
 * @param {object} config - Axios configuration object
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<object>} API response
 */
const makeRequestWithRetry = async (url, config, retries = MAX_RETRIES) => {
  try {
    return await axios.get(url, config);
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      console.warn(`Request failed, retrying... (${retries} attempts left)`);
      await delay(RETRY_DELAY);
      return makeRequestWithRetry(url, config, retries - 1);
    }
    throw error;
  }
};

/**
 * Build a broader candidate set of repositories across multiple languages and sorts.
 * Returns a Map keyed by full_name to unique repo objects with metrics.
 * @returns {Promise<Map<string, object>>} Map of unique repositories
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
          const response = await makeRequestWithRetry(`${API_URL}/search/repositories`, {
            headers: { Authorization: `token ${TOKEN}` },
            params: {
              q: `good-first-issues:>1 fork:false language:${lang}`,
              sort,
              order: 'desc', // Always descending order
              per_page,
              page,
            },
          });
          const items = response.data?.items || [];
          for (const repo of items) {
            console.log(repo.full_name);
            if (!unique.has(repo.full_name)) {
              unique.set(repo.full_name, repo);
            }
          }
          // Brief delay between calls to respect rate limits
          await delay(250);
        } catch (error) {
          console.error(`Failed to fetch repos lang=${lang} sort=${sort} page=${page}: ${error.message}`);
          if (error.response?.status === 403) {
            console.error('Rate limit exceeded. Please try again later.');
          }
          break;
        }
      }
    }
  }

  return unique;
};



/**
 * Fetches issues from a repository with proper filtering
 * @param {object} repo - The repository object with full_name property
 * @returns {Promise<Array>} Array of filtered issues
 */
const getFilteredIssues = async (repo) => {
  if (!repo?.full_name) {
    console.error('Invalid repository object: missing full_name');
    return [];
  }

  try {
    const response = await makeRequestWithRetry(`${API_URL}/repos/${repo.full_name}/issues`, {
      headers: { Authorization: `token ${TOKEN}` },
      params: { 
        state: 'open', 
        labels: 'good first issue', 
        sort: 'updated', 
        per_page: 100 
      },
    });

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return (response.data || []).filter(issue => {
      const updatedAt = new Date(issue.updated_at);
      return updatedAt > lastMonth && !issue.pull_request; // Exclude PRs
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
      await delay(WAIT_TIME);
    }

    // Write JSON source of truth for the web app
    const flatItems = [];
    const orgSummaries = {};
    const repoSummaries = {};
    
    console.log(`\nProcessing ${goodFirstIssues.length} repositories...`);
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

    const jsonOut = { 
      generated_at: new Date().toISOString(), 
      items: flatItems, 
      org_summaries: orgSummaries, 
      repo_summaries: repoSummaries 
    };
    
    await fs.writeFile('./issues.json', JSON.stringify(jsonOut, null, 2), 'utf-8');
    console.log(`✅ Generated issues.json with ${flatItems.length} issues from ${goodFirstIssues.length} repositories`);


    // Rebuild README content
    let markdown = `# Good First Issues\n\nThis is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!\n\n`;
    markdown += `This list gets updated every day at midnight.\n\n`;

    for (const issue of goodFirstIssues) {
      // Extract repository URL safely
      const repoUrl = issue.issues[0]?.html_url?.match(/(https:\/\/github\.com\/[^\/]+\/[^\/]+)/)?.[1] || 
                      `https://github.com/${issue.repo}`;
      markdown += `## [${issue.repo}](${repoUrl})\n\n`;
      for (const item of issue.issues) {
        markdown += `- [${item.title}](${item.html_url})\n`;
      }
      markdown += '\n';
    }

    await fs.writeFile('README.md', markdown, 'utf-8');
    console.log('✅ Generated README.md');
  } catch (error) {
    console.error(`\n❌ An error occurred: ${error.message}`);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

/**
 * Converts README.md to index.html using markdown-to-html
 * @returns {Promise<void>}
 */
const convertToHtml = () => {
  return new Promise((resolve, reject) => {
    try {
      const md = new Markdown();

      md.render('README.md', {
        title: 'Good JavaScript First Issues',
        highlight: true,
        highlightTheme: 'github',
        stylesheet: 'styles.css',
        context: 'https://github.com',
      }, function (err) {
        if (err) {
          reject(err);
          return;
        }
        md.pipe(fsSync.createWriteStream('index.html'));
        md.on('end', () => {
          console.log('✅ Generated index.html');
          resolve();
        });
        md.on('error', reject);
      });
    } catch (e) {
      console.error('❌ Failed to convert to HTML:', e.message);
      reject(e);
    }
  });
};

/**
 * Main execution function
 * @returns {Promise<void>}
 */
const main = async () => {
  console.log('🚀 Starting Good First Issues Finder...\n');
  const startTime = Date.now();
  
  try {
    await getGoodFirstIssues();
    await convertToHtml();
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Completed successfully in ${elapsedTime}s`);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { getGoodFirstIssues, getCandidateRepos, getFilteredIssues };
