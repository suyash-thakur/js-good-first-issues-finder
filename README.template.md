# 🚀 JavaScript Good First Issues Finder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org)

A powerful tool to discover beginner-friendly GitHub issues from popular JavaScript repositories. Perfect for developers looking to make their first open source contribution!

## ✨ Features

- 🔍 **Smart Search**: Automatically discovers repositories with "good first issue" labels
- 📊 **Rich Metadata**: Displays repository stats, activity levels, and popularity metrics
- 🌐 **Modern Web UI**: Beautiful Next.js interface with advanced filtering
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Auto-Update**: Can be scheduled to refresh issues daily
- 📈 **Historical Snapshots**: Browse past issues to see repository evolution
- ⚡ **Fast Performance**: Optimized API calls with retry logic and caching

## 🏗️ Project Structure

```
js-good-first-issues-finder/
├── index.js                 # Node.js scraper (generates issues.json and README.md)
├── index.html              # Static HTML view (auto-generated)
├── styles.css              # Styling for static HTML
├── issues.json             # Generated JSON data source
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── web/                    # Next.js modern web application
│   ├── app/
│   │   ├── api/           # API routes for issues, history, source
│   │   ├── components/    # React components
│   │   ├── how-it-works/  # Documentation page
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Shared UI components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
└── README.md              # You are here!
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **GitHub Personal Access Token** ([Get one here](https://github.com/settings/tokens))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vivekkumarrathour/js-good-first-issues-finder.git
   cd js-good-first-issues-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your GitHub token:
   ```env
   API_KEY=your_github_personal_access_token_here
   ```

### Running the Scraper

Generate the issues list:

```bash
npm start
```

This will:
- Fetch good first issues from GitHub
- Generate `issues.json` with structured data
- Create `README.md` with the issues list
- Convert README to `index.html`

### Running the Web Application

1. **Navigate to the web directory**
   ```bash
   cd web
   ```

2. **Install web dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   
   Create `web/.env.local`:
   ```env
   # Optional: URLs for remote data sources
   ISSUES_JSON_URL=https://raw.githubusercontent.com/your-org/your-repo/main/issues.json
   README_RAW_URL=https://raw.githubusercontent.com/your-org/your-repo/main/README.md
   
   # Optional: GitHub integration for history feature
   GITHUB_REPO=your-org/your-repo
   GITHUB_TOKEN=your_github_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

**Root Directory:**
- `npm start` - Run the scraper to fetch issues
- `npm run dev` - Run with nodemon for auto-restart

**Web Directory:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Deployment

### Deploy the Web App

The Next.js application can be deployed to:

- **Vercel** (Recommended): Click the button below
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vivekkumarrathour/js-good-first-issues-finder)

- **Netlify**: Connect your repository and set build command to `cd web && npm run build`
- **Docker**: Build with `docker build -t issues-finder .`

### Automate Issue Updates

Set up a GitHub Action to run the scraper daily:

```yaml
# .github/workflows/update-issues.yml
name: Update Issues Daily

on:
  schedule:
    - cron: '0 0 * * *'  # Run at midnight UTC
  workflow_dispatch:     # Allow manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm start
        env:
          API_KEY: ${{ secrets.GITHUB_TOKEN }}
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: '🤖 Update issues'
```

## 🎨 Features Deep Dive

### Web Application Features

- **Advanced Filtering**: Filter by organization, repository, date, popularity, and activity
- **Search**: Full-text search across issue titles and repositories
- **Historical View**: Browse past snapshots of issues
- **Responsive Design**: Mobile-first design with smooth animations
- **Dark Mode**: Automatic dark mode support
- **Performance**: Optimized rendering with React Server Components

### Scraper Features

- **Retry Logic**: Automatically retries failed API requests
- **Rate Limit Handling**: Respects GitHub API rate limits
- **Smart Caching**: Avoids duplicate API calls
- **Pull Request Filtering**: Excludes pull requests from issues list
- **Comprehensive Metadata**: Collects stars, forks, activity metrics

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- How to report bugs
- How to suggest enhancements
- How to submit pull requests
- Code style guidelines
- Development workflow

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub for providing the amazing GraphQL/REST API
- All the maintainers who label issues as "good first issue"
- The open source community for inspiration

## 🔗 Links

- **Live Demo**: [https://js-good-first-issues.vercel.app](https://js-good-first-issues.vercel.app)
- **Issues**: [Report a bug or request a feature](https://github.com/vivekkumarrathour/js-good-first-issues-finder/issues)
- **Discussions**: [Join the conversation](https://github.com/vivekkumarrathour/js-good-first-issues-finder/discussions)

## 💡 How It Works

Check out the [How It Works](web/app/how-it-works/page.tsx) page in the web app for a detailed explanation of the architecture and data flow.

---

Made with ❤️ by the open source community

**Star ⭐ this repository if you find it helpful!**
