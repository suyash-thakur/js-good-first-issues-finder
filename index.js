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
 * Fetches repositories from the GitHub API based on search parameters.
 * @param {number} page - The page number to fetch repositories from.
 * @returns {Array} - The list of repositories that match the search criteria.
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
 * Fetches filtered issues from a repository.
 * @param {Object} repo - The repository object.
 * @param {string} repo.full_name - The full name of the repository (e.g., "owner/repo-name").
 * @param {string} repo.language - The programming language of the repository (e.g., "JavaScript").
 * @param {string} repo.html_url - The URL to the repository on GitHub.
 * @returns {Array} - The list of open issues that are labeled "good first issue" and updated in the last month.
 */
const getFilteredIssues = async (repo) => {
  try {
    const response = await axios.get(`${API_URL}/repos/${repo.full_name}/issues`, {
      headers: { Authorization: `token ${TOKEN}` },
      params: { state: 'open', labels: 'good first issue', sort: 'updated' },
    });

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return response.data
      .filter(issue => !issue.pull_request)
      .filter(issue => new Date(issue.updated_at) > lastMonth);
  } catch (error) {
    console.error(`Failed to fetch issues for ${repo.full_name}: ${error.message}`);
    return [];
  }
};

/**
 * Fetches good first issues from multiple JavaScript repositories and generates a markdown report.
 * @returns {Promise<void>} - This function doesn't return anything, it writes the data to a file.
 */
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

/**
 * Converts the markdown file to HTML using the markdown-to-html library.
 * Injects the converted content into an HTML template.
 * @returns {Promise<void>} - This function doesn't return anything, it writes the final HTML to a file.
 */
const convertToHtml = async () => {
  try {
    const md = new Markdown();
    let htmlOutput = '';

    md.bufmax = 2048;
    md.render('README.md', {}, function (err) {
      if (err) throw err;
    });

    const input = fs.createReadStream('README.md');

    md.once('end', () => {
      const content = htmlOutput;
      const template = fs.readFileSync('template.html', 'utf8');
      const finalHtml = template.replace('{{content}}', content);
      fs.writeFileSync('index.html', finalHtml);
      console.log('✅ index.html created successfully');
    });

    md.on('data', (chunk) => {
      htmlOutput += chunk;
    });

    md.render(input);
  } catch (e) {
    console.error('>>> ' + e);
    process.exit();
  }
};

/**
 * Main function to fetch good first issues and convert the markdown to HTML.
 * @returns {Promise<void>} - This function doesn't return anything, it orchestrates the other functions.
 */
const main = async () => {
  await getGoodFirstIssues();
  await convertToHtml();
};

main();
