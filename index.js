const axios = require('axios');
const fs = require('fs');
const path = require('path');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

// Load environment variables
env.config();

// Configuration constants
const CONFIG = {
  API_URL: 'https://api.github.com',
  MAX_ELAPSED_TIME: 2 * 60 * 1000, // 2 minutes
  MAX_ISSUES_COUNT: 30,
  WAIT_TIME: 1500, // 1.5 seconds between requests
  RATE_LIMIT_HEADER: 'x-ratelimit-remaining',
  RESET_HEADER: 'x-ratelimit-reset',
  ACCEPT_HEADER: 'application/vnd.github.v3+json'
};

// Validate environment variables
if (!process.env.API_KEY) {
  console.error('Missing required API_KEY environment variable');
  process.exit(1);
}

/**
 * Safely sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Sleep promise
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handle GitHub API rate limiting
 * @param {object} headers - Response headers
 */
const handleRateLimiting = async (headers) => {
  const remaining = parseInt(headers[CONFIG.RATE_LIMIT_HEADER], 10);
  const resetTime = parseInt(headers[CONFIG.RESET_HEADER], 10) * 1000;
  
  if (remaining < 10) {
    const now = Date.now();
    const sleepDuration = Math.max(resetTime - now, 0) + 1000;
    console.log(`Approaching rate limit. Sleeping for ${sleepDuration}ms`);
    await sleep(sleepDuration);
  }
};

/**
 * Get JavaScript repositories with good first issues
 * @param {number} page - Pagination page number
 * @returns {Promise<Array>} - Array of repositories
 */
const getJavascriptRepos = async (page) => {
  try {
    const response = await axios.get(`${CONFIG.API_URL}/search/repositories`, {
      headers: {
        Authorization: `token ${process.env.API_KEY}`,
        Accept: CONFIG.ACCEPT_HEADER
      },
      params: {
        q: 'good-first-issues:>2 language:javascript',
        sort: 'updated',
        page,
        per_page: 30 // Max allowed per page
      }
    });

    await handleRateLimiting(response.headers);
    
    return response.data.items;
  } catch (error) {
    if (error.response) {
      console.error(`GitHub API Error: ${error.response.status} ${error.response.data.message}`);
    }
    return [];
  }
};

/**
 * Fetch and filter issues for a repository
 * @param {object} repo - Repository object
 * @returns {Promise<Array>} - Filtered issues array
 */
const getFilteredIssues = async (repo) => {
  try {
    const response = await axios.get(`${CONFIG.API_URL}/repos/${repo.full_name}/issues`, {
      headers: {
        Authorization: `token ${process.env.API_KEY}`,
        Accept: CONFIG.ACCEPT_HEADER
      },
      params: {
        state: 'open',
        labels: 'good first issue',
        sort: 'updated',
        direction: 'desc'
      }
    });

    await handleRateLimiting(response.headers);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // Last 30 days

    return response.data.filter(issue => {
      const updatedAt = new Date(issue.updated_at);
      return !issue.pull_request && updatedAt >= cutoffDate;
    });
  } catch (error) {
    console.error(`Failed to fetch issues for ${repo.full_name}: ${error.message}`);
    return [];
  }
};

/**
 * Generate formatted markdown content
 * @param {Array} issues - Array of issues grouped by repository
 * @returns {string} - Formatted markdown content
 */
const generateMarkdown = (issues) => {
  let markdown = `# Good First Issues in JavaScript Projects\n\n`;
  markdown += `Automatically curated list of JavaScript projects with welcoming issues for new contributors. \n\n`;
  markdown += `**Updated**: ${new Date().toUTCString()}\n\n`;
  markdown += `_This list is updated daily via [GitHub Actions](https://github.com/your-repo/actions)_\n\n`;

  issues.forEach(({ repo, issues }) => {
    const repoUrl = `https://github.com/${repo}`;
    markdown += `## [${repo}](${repoUrl})\n\n`;
    markdown += `**Recent Good First Issues**:\n\n`;
    
    issues.forEach(issue => {
      markdown += `- [${issue.title}](${issue.html_url}) `;
      markdown += `(Updated: ${new Date(issue.updated_at).toISOString().split('T')[0]})\n`;
    });
    
    markdown += '\n';
  });

  return markdown;
};

/**
 * Main function to generate and write results
 */
const generateIssueList = async () => {
  try {
    const startTime = Date.now();
    const seenRepos = new Set();
    let allIssues = [];
    let page = 1;

    while (
      (Date.now() - startTime) < CONFIG.MAX_ELAPSED_TIME &&
      allIssues.length < CONFIG.MAX_ISSUES_COUNT
    ) {
      const repos = await getJavascriptRepos(page);
      if (repos.length === 0) break;

      for (const repo of repos) {
        if (seenRepos.has(repo.id)) continue;
        seenRepos.add(repo.id);

        console.log(`Processing ${repo.full_name}`);
        const issues = await getFilteredIssues(repo);
        
        if (issues.length > 0) {
          allIssues.push({
            repo: repo.full_name,
            issues: issues.slice(0, 3) // Max 3 issues per repo
          });
        }

        await sleep(CONFIG.WAIT_TIME);
      }

      page++;
    }

    // Sort repositories by star count descending
    allIssues.sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);

    const markdownContent = generateMarkdown(allIssues);
    fs.writeFileSync(path.join(__dirname, 'README.md'), markdownContent);
    
    console.log(`Successfully generated ${allIssues.length} repositories with issues`);
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
};

// Execute the main workflow
generateIssueList();