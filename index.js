// Import required modules
const axios = require('axios');
const fs = require('fs');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

// Load environment variables
env.config();

// Define constants
const API_URL = 'https://api.github.com';
const TOKEN = process.env.API_KEY;
const MAX_ELAPSED_TIME = 2 * 60 * 1000;
const MAX_ISSUES_COUNT = 30;
const WAIT_TIME = 1000;

// Function to get JavaScript repositories from GitHub API
const getJavascriptRepos = async (page) => {
  try {
    const response = await axios.get(`${API_URL}/search/repositories`, {
      headers: { Authorization: `token ${TOKEN}` },
      params: { q: `good-first-issues:>2`, language: 'javascript', sort: 'updated', page },
    });
    return response.data.items.filter((repo) => repo.language === 'JavaScript');
  } catch (error) {
    console.error(`Failed to fetch repos from page ${page}: ${error.message}`);
    return [];
  }
};

// Function to fetch issues from a repository
const getFilteredIssues = async (repo) => {
  try {
    const response = await axios.get(`${API_URL}/repos/${repo.full_name}/issues`, {
      headers: { Authorization: `token ${TOKEN}` },
      params: { state: 'open', labels: 'good first issue', sort: 'updated' },
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

// Function to get good first issues
const getGoodFirstIssues = async () => {
  try {
    let goodFirstIssues = [];
    let page = 1;
    let issuesCount = 0;
    let elapsedTime = 0;

    const start = Date.now();

    while (elapsedTime < MAX_ELAPSED_TIME && issuesCount < MAX_ISSUES_COUNT) {
      const repos = await getJavascriptRepos(page);

      for (const repo of repos) {
        console.log(`Fetching issues for ${repo.full_name}`);
        const issues = await getFilteredIssues(repo);

        if (issues.length > 0) {
          goodFirstIssues.push({ repo: repo.full_name, issues });
          issuesCount += issues.length;
        }
      }

      page++;
      elapsedTime = Date.now() - start;
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    }

    // Generate Markdown content
    let markdown = `# Good First Issues\n\nThis is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!\n\n`;
    markdown += `This list gets updated every day at midnight.\n\n`;

    for (const issue of goodFirstIssues) {
      markdown += `## [${issue.repo}](${issue.issues[0].html_url.split('/issues')[0]})\n\n`;
      for (const item of issue.issues) {
        markdown += `- [${item.title}](${item.html_url})\n`;
      }
      markdown += '\n';
    }

    // Write Markdown content to file
    fs.writeFileSync('README.md', markdown);

    // Convert Markdown to HTML
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
      md.pipe(fs.createWriteStream ('index.html'));
    });
  } catch (error) {
    console.error('Failed to generate good first issues:', error.message);
  }
};

// Run the script
getGoodFirstIssues();
