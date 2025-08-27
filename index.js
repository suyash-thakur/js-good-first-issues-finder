const axios = require('axios');
const fs = require('fs');
const env = require('dotenv');
const Markdown = require('markdown-to-html').Markdown;

env.config();

const API_URL = 'https://api.github.com';
const TOKEN = process.env.API_KEY;
const MAX_ELAPSED_TIME = 2 * 60 * 1000;
const MAX_ISSUES_COUNT = 30;
const WAIT_TIME = 1000;

/**
 * Get repositories from GitHub API.
 * @param {number} page Page number
 * @returns {Promise} Promise with repositories
 */
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



/**
 * Fetches issues from a repository
 * @param {object} repo - The repository object
 * @returns {array} - The issues array
 */

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
    let convertedHTML = "";

    md.bufmax = 2048;

    md.render('README.md', {
      title: 'Good Javascript First Issues',
      highlight: true,
      highlightTheme: 'github',
      stylesheet: 'styles.css',
      context: 'https://github.com',
    });

    md.on('data', function (data) {
      convertedHTML += data;
    });

    md.on('end', function () {
      const template = fs.readFileSync('template.html', 'utf-8');
      const finalHtml = template.replace('{{content}}', convertedHTML);

      fs.writeFileSync('index.html', finalHtml);
      console.log("✅ index.html created successfully using custom template!");
    });

    md.on('error', function (err) {
      console.error('Error while converting markdown:', err);
      process.exit();
    });

  } catch (e) {
    console.error('>>> ' + e);
    process.exit();
  }
};


main();
