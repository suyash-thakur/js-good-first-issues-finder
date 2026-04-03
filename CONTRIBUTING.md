# Contributing Guidelines

Thank you for your interest in contributing to the JS Good First Issues Finder! We welcome contributions from developers of all experience levels.

## Overview

This project is a Node.js application that automatically fetches "good first issues" from JavaScript repositories on GitHub and generates a curated list in both Markdown and HTML formats.

## Quick Start for Contributors

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Git

### Setup Instructions

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/js-good-first-issues-finder.git
   cd js-good-first-issues-finder
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add your GitHub Personal Access Token:
     ```
     API_KEY=your_github_token_here
     ```
   - To get a token: Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)

5. **Run the application:**
   ```bash
   npm start
   ```
   This will fetch the latest issues and update both `README.md` and `index.html`.

## Development Workflow

### Making Changes

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make your changes** and test locally:
   ```bash
   npm start
   ```

3. **Verify your changes:**
   - Check that `README.md` is properly formatted
   - Open `index.html` in a browser to verify the HTML output
   - Ensure the JSON structure in `issues.json` is correct

### Code Style Guidelines

- Use JavaScript ES6+ features consistently
- Follow the existing code formatting and indentation
- Add comments for complex logic
- Use meaningful variable and function names

### Testing Your Changes

Before submitting a pull request:

1. **Run the application locally** to ensure it works without errors
2. **Check the generated files:**
   - `README.md` should be valid Markdown
   - `index.html` should render properly in a browser
   - `issues.json` should contain valid JSON

3. **Test edge cases:**
   - What happens when the API rate limit is reached?
   - How does the code handle repositories with no issues?
   - Verify error handling for network issues

## Types of Contributions

We welcome the following types of contributions:

### 🐛 Bug Reports
- Use the issue tracker to report bugs
- Include steps to reproduce the issue
- Provide error messages and screenshots if applicable

### ✨ Feature Requests
- Suggest new features that would improve the project
- Explain the use case and potential benefits
- Consider if the feature aligns with the project's goals

### 🔧 Code Contributions
- **Core functionality:** Improve the issue fetching logic
- **Performance:** Optimize API calls or data processing
- **UI/UX:** Enhance the HTML output or styling
- **Documentation:** Improve README, comments, or these guidelines

### 📝 Documentation
- Fix typos or grammatical errors
- Improve explanations
- Add examples or tutorials

## Before Submitting a Pull Request

- [ ] Your code follows the project's coding style
- [ ] You have tested your changes thoroughly
- [ ] You have updated documentation if needed
- [ ] Your branch is up to date with the main branch
- [ ] You have included clear commit messages

## Pull Request Guidelines

1. **Use a descriptive title** for your pull request
2. **Provide a clear description** of the changes you made
3. **Reference the issue** you're addressing (if applicable)
4. **Include screenshots** for UI changes
5. **Be patient** - maintainers will review your PR as soon as possible

## Getting Help

If you need help with:

- **Setup issues:** Check the troubleshooting section below or open an issue
- **Code questions:** Use GitHub Discussions or open an issue
- **General questions:** Feel free to reach out to maintainers

## Troubleshooting

### Common Issues

**API Rate Limit Errors:**
- Ensure your GitHub token has proper permissions
- Wait for rate limits to reset if you hit them
- Consider using multiple tokens for heavy development

**Environment Variable Issues:**
- Double-check your `.env` file is in the correct location
- Verify the token is valid and not expired
- Ensure the variable name is exactly `API_KEY`

**Module Installation Issues:**
- Try deleting `node_modules` and running `npm install` again
- Ensure you're using a compatible Node.js version

## Project Structure

```
js-good-first-issues-finder/
├── index.js          # Main application logic
├── index.html        # Generated HTML output
├── README.md         # Generated Markdown output
├── issues.json       # Raw JSON data
├── styles.css        # Styling for HTML output
├── package.json      # Dependencies and scripts
└── CONTRIBUTING.md   # This file
```

Thank you for contributing to this project! Every contribution helps make open source more accessible to newcomers. 🚀
