# Architecture Documentation

## Overview

This project consists of two main components:
1. **Node.js Scraper**: Fetches issues from GitHub and generates data files
2. **Next.js Web Application**: Modern UI for browsing and filtering issues

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub API                               │
│              (REST API v3 + GraphQL v4)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Calls with Token
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js Scraper                             │
│  (index.js)                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Fetch repositories with "good first issues"        │ │
│  │ 2. Filter by language, stars, activity               │ │
│  │ 3. Fetch issues for each repository                  │ │
│  │ 4. Calculate metrics and aggregations                │ │
│  │ 5. Generate issues.json                              │ │
│  │ 6. Generate README.md                                │ │
│  │ 7. Convert README to HTML                            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Outputs
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Generated Data Files                            │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ issues.json   │  │ README.md    │  │ index.html      │  │
│  │ (Source)      │  │ (Generated)  │  │ (Static View)   │  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Consumed by
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Web Application                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Frontend (React + TypeScript)                         │ │
│  │ ├─ IssuesListing Component                           │ │
│  │ ├─ Filtering & Search                                │ │
│  │ ├─ History Modal                                     │ │
│  │ └─ Responsive UI                                     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ API Routes (Next.js Server)                          │ │
│  │ ├─ /api/issues - Fetches and filters issues         │ │
│  │ ├─ /api/history - Git commit history                │ │
│  │ └─ /api/source - Source code viewing                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ Served to
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       Users                                  │
│              (Browser - Desktop/Mobile)                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Node.js Scraper (`index.js`)

**Purpose**: Fetches good first issues from GitHub and generates data files

**Key Functions**:
- `getCandidateRepos()`: Searches GitHub for repositories with good first issues
- `getFilteredIssues()`: Fetches and filters issues from repositories
- `getGoodFirstIssues()`: Main orchestration function
- `convertToHtml()`: Converts README.md to HTML

**Data Flow**:
1. Searches GitHub API for repositories with `good-first-issues:>1`
2. Fetches issues labeled "good first issue" from each repository
3. Filters issues updated in the last month
4. Aggregates metadata (stars, forks, activity)
5. Generates `issues.json` with structured data
6. Updates `README.md` with formatted issue list
7. Converts README to `index.html`

**Configuration**:
- `MAX_ELAPSED_TIME`: 2 minutes (prevents long-running processes)
- `MAX_ISSUES_COUNT`: 200 issues (reasonable limit)
- `WAIT_TIME`: 1 second between API calls (rate limit respect)
- `MAX_RETRIES`: 3 attempts for failed requests

### 2. Next.js Web Application

**Purpose**: Modern, interactive interface for browsing issues

#### Frontend Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Home page (imports IssuesListing)
├── globals.css             # Global styles and Tailwind config
├── api/                    # Server-side API routes
│   ├── issues/route.ts     # Issues API endpoint
│   ├── history/route.ts    # Git history API
│   └── source/route.ts     # Source code API
├── how-it-works/
│   └── page.tsx           # Documentation page
└── components/
    └── IssuesListing.tsx  # Main component (moved to /components)

components/
├── IssuesListing.tsx      # Main issues display component
└── ui/                    # Shadcn UI components
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    └── sheet.tsx
```

#### API Routes

**`/api/issues`**
- Fetches issues from multiple sources (priority order):
  1. Remote `issues.json` (ISSUES_JSON_URL env var)
  2. Local `../issues.json` file
  3. Remote README.md parsing (README_RAW_URL env var)
  4. Local `../README.md` parsing
- Applies filters: organization, repository, search query, date range, popularity, activity
- Returns paginated results (24 per page)
- Includes metadata: stars, forks, org stats

**`/api/history`**
- Fetches Git commit history using GitHub API
- Returns commits that modified `issues.json` or `README.md`
- Can retrieve file content at specific commit SHA
- Supports JSON and Markdown parsing

**`/api/source`**
- Returns source code of specific files
- Used by "How It Works" page
- Security: Whitelist of allowed files only

#### State Management

The application uses React hooks for state management:
- `useState` for component state
- `useEffect` for side effects and data fetching
- `useMemo` for computed values
- Custom hooks: `useIsMobile()` for responsive behavior

#### Key Features

**Filtering**:
- Text search across titles and repositories
- Organization filter (dropdown with search)
- Repository filter (dropdown with search)
- Date range filter (updated since)
- Popularity filter (low/moderate/high/very high)
- Activity filter (low/moderate/high/very high)

**History View**:
- Browse past commits
- View snapshots of issues at specific points in time
- Compare changes over time

**Responsive Design**:
- Mobile-first approach
- Collapsible filters on mobile (sheet component)
- Optimized touch interactions
- Adaptive layouts

## Data Format

### issues.json Structure

```json
{
  "generated_at": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 12345,
      "title": "Issue title",
      "html_url": "https://github.com/org/repo/issues/123",
      "updated_at": "2024-01-01T00:00:00Z",
      "labels": ["good first issue", "bug"],
      "repo": "org/repo",
      "org": "org",
      "repo_name": "repo",
      "repo_stars": 1000,
      "repo_forks": 100,
      "repo_pushed_at": "2024-01-01T00:00:00Z"
    }
  ],
  "org_summaries": {
    "org": {
      "total_repos": 5,
      "total_stars": 5000,
      "total_forks": 500,
      "recent_issues_count": 20,
      "activity_frequency": 4.0,
      "popularity_score": 6000
    }
  },
  "repo_summaries": {
    "org/repo": {
      "stars": 1000,
      "forks": 100,
      "open_issues": 50,
      "pushed_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "language": "JavaScript",
      "recent_issues_count": 5
    }
  }
}
```

## Performance Optimizations

### Scraper
1. **Retry Logic**: Automatically retries failed API calls (max 3 attempts)
2. **Rate Limiting**: 1-second delay between requests
3. **Efficient Deduplication**: Uses Map for O(1) lookups
4. **Parallel Requests**: Could be improved with Promise.all
5. **Timeout Protection**: MAX_ELAPSED_TIME prevents infinite loops

### Web Application
1. **React Server Components**: Reduces client-side JavaScript
2. **Data Revalidation**: 60-second cache for remote fetches
3. **Lazy Loading**: Components loaded on demand
4. **Memoization**: useMemo for expensive computations
5. **Debouncing**: Search input (could be added)
6. **Pagination**: 24 issues per page
7. **Incremental Loading**: Load more button instead of infinite scroll

## Security Considerations

1. **API Tokens**:
   - Stored in `.env` (not committed)
   - Never exposed to client
   - Rate limit aware

2. **Input Validation**:
   - Query parameter sanitization
   - File path restrictions in `/api/source`
   - XSS prevention via React's automatic escaping

3. **CORS**:
   - API routes are same-origin
   - External fetches use `next: { revalidate }` for caching

4. **Error Handling**:
   - Graceful degradation on API failures
   - User-friendly error messages
   - Stack traces hidden in production

## Deployment

### Vercel (Recommended)
- Zero-config deployment
- Automatic HTTPS
- Edge functions for global performance
- Environment variable management

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### GitHub Actions
- Scheduled workflow to run scraper daily
- Commits generated files back to repository
- Triggers web deployment automatically

## Future Improvements

1. **Testing**:
   - Unit tests for utility functions
   - Integration tests for API routes
   - E2E tests with Playwright

2. **Performance**:
   - Implement debounced search
   - Add virtual scrolling for large lists
   - Cache API responses in memory

3. **Features**:
   - User accounts and saved filters
   - Email notifications for new issues
   - Analytics dashboard
   - Issue difficulty estimation

4. **Infrastructure**:
   - Database for historical data
   - GraphQL API
   - Webhooks for real-time updates

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **axios**: HTTP client
- **dotenv**: Environment variable management
- **markdown-to-html**: README conversion

### Frontend
- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **Framer Motion**: Animations
- **Radix UI**: Accessible components
- **Lucide React**: Icons

## Monitoring & Logging

Currently uses console logging. Future improvements:
- Structured logging (Winston/Pino)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- API usage metrics

---

Last updated: November 2024
