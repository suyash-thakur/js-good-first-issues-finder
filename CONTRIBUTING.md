# Contributing to JS Good First Issues Finder

Thank you for your interest in contributing to this project! We welcome contributions from developers of all experience levels. This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- A GitHub account and Personal Access Token

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/js-good-first-issues-finder.git
   cd js-good-first-issues-finder
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/vivekkumarrathour/js-good-first-issues-finder.git
   ```

4. **Install dependencies**
   ```bash
   # Root project
   npm install
   
   # Web application
   cd web
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GitHub token
   ```

## 🔄 Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. **Make your changes** in your feature branch

2. **Test your changes**
   ```bash
   # Test the scraper
   npm start
   
   # Test the web app
   cd web
   npm run dev
   ```

3. **Check code style**
   ```bash
   cd web
   npm run lint
   ```

4. **Commit your changes** with a descriptive message
   ```bash
   git add .
   git commit -m "feat: add new filtering option for issue labels"
   ```

### Commit Message Guidelines

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add dark mode toggle to header
fix: resolve rate limiting issue in API calls
docs: update installation instructions
refactor: simplify issue fetching logic
```

### Submitting a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with:
     - Clear title and description
     - Link to related issues (if any)
     - Screenshots (if UI changes)
     - Testing steps

3. **Wait for review**
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged!

## 🎯 What to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are perfect for newcomers!

### Areas That Need Help

- **Bug fixes**: Check the [issues page](https://github.com/vivekkumarrathour/js-good-first-issues-finder/issues)
- **Documentation**: Improve README, add examples, write tutorials
- **New features**: Propose and implement new functionality
- **Testing**: Add unit tests, integration tests, or end-to-end tests
- **Performance**: Optimize API calls, improve loading times
- **UI/UX**: Enhance the web interface, improve accessibility

## 📝 Code Style Guidelines

### JavaScript/TypeScript

- Use ES6+ features (async/await, arrow functions, destructuring)
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused
- Handle errors appropriately

### React/Next.js

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused on a single responsibility
- Use TypeScript for type safety
- Follow Next.js best practices

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Ensure dark mode compatibility
- Maintain consistent spacing and sizing

## 🧪 Testing

### Manual Testing

1. **Test the scraper**
   - Ensure it fetches issues correctly
   - Verify `issues.json` is generated properly
   - Check that README.md is updated

2. **Test the web app**
   - Test all filtering options
   - Verify search functionality
   - Test on different screen sizes
   - Check dark mode

### Adding Tests

We welcome test contributions! Areas that need tests:
- Unit tests for utility functions
- Integration tests for API routes
- End-to-end tests for user flows

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check the [existing issues](https://github.com/vivekkumarrathour/js-good-first-issues-finder/issues) to avoid duplicates
- Try to reproduce the bug with the latest version
- Gather relevant information (browser, Node.js version, etc.)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node.js version: [e.g. 18.17.0]

**Additional context**
Any other context about the problem.
```

## 💡 Suggesting Enhancements

### Before Submitting an Enhancement

- Check if the enhancement has already been suggested
- Consider if it aligns with the project's goals
- Think about how it would benefit other users

### Enhancement Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or other context.
```

## 📜 Code of Conduct

Please note that this project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior.

## ❓ Questions?

- Open a [Discussion](https://github.com/vivekkumarrathour/js-good-first-issues-finder/discussions)
- Reach out to the maintainers
- Check existing issues and documentation

## 🎉 Recognition

Contributors are recognized in:
- The project's README
- GitHub's Contributors page
- Release notes (for significant contributions)

---

Thank you for contributing! Your help makes this project better for everyone. 🙏

