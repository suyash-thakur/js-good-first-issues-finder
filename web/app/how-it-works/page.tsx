"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Database, 
  Clock, 
  Search, 
  FileText, 
  Code2, 
  Workflow, 
  Zap,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Sparkles
} from "lucide-react";
import Link from "next/link";

type SourceKey = "index.js" | "api-issues" | "api-history";

function CodeBlock({ code, language, title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }
  return (
    <div className="relative group">
      {title && (
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
          <Code2 className="w-3 h-3" />
          {title}
        </div>
      )}
      <button
        type="button"
        aria-label="Copy code"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-foreground/10 px-2 py-1 text-xs text-foreground hover:bg-foreground/20 z-10"
        onClick={onCopy}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-auto rounded-md bg-black/90 p-4 text-sm text-white">
        <code className={`language-${language || "tsx"}`}>{code}</code>
      </pre>
    </div>
  );
}

function FeatureHighlight({ icon: Icon, title, description, variant = "default" }: {
  icon: React.ElementType;
  title: string;
  description: string;
  variant?: "default" | "accent";
}) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${
      variant === "accent" 
        ? "bg-muted border-border" 
        : "bg-muted/50 border-border/60"
    }`}>
      <div className={`rounded-full p-2 ${
        variant === "accent" 
          ? "bg-primary text-primary-foreground" 
          : "bg-primary/10 text-primary"
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="font-medium text-sm text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description, icon: Icon, isLast = false }: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full text-sm font-bold">
          {number}
        </div>
        {!isLast && (
          <div className="w-px h-12 bg-border mt-2" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

type Commit = { sha: string; date: string; subject: string };

export default function HowItWorksPage() {
  const [active, setActive] = useState<SourceKey>("index.js");
  const [source, setSource] = useState<string>("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedSha, setSelectedSha] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");

  const sectionIds = useMemo(
    () => [
      { id: "intro", label: "Introduction" },
      { id: "overview", label: "How it Works" },
      { id: "pipeline", label: "Architecture" },
      { id: "discovery", label: "Repository Discovery" },
      { id: "aggregation", label: "Data Aggregation" },
      { id: "api", label: "API Layer" },
      { id: "history", label: "Git History" },
      { id: "frontend", label: "Frontend" },
      { id: "deep-dive", label: "Technical Deep Dive" },
    ],
    []
  );

  const observedRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/source?file=${encodeURIComponent(active)}`, { cache: "no-store" });
      const j = await r.json();
      setSource(j.content || "");
    }
    load();
  }, [active]);

  useEffect(() => {
    async function loadCommits() {
      const r = await fetch(`/api/history?limit=30`, { cache: "no-store" });
      const j = await r.json();
      setCommits(j.commits || []);
    }
    loadCommits();
  }, []);

  useEffect(() => {
    if (!selectedSha) return;
    setLoading(true);
    fetch(`/api/history?sha=${encodeURIComponent(selectedSha)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setSnapshot(j))
      .finally(() => setLoading(false));
  }, [selectedSha]);

  const tabs: { key: SourceKey; label: string }[] = useMemo(
    () => [
      { key: "index.js", label: "Cron script (root)" },
      { key: "api-issues", label: "API • /api/issues" },
      { key: "api-history", label: "API • /api/history" },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) {
          const id = visible[0].target.getAttribute("id");
          if (id) setActiveSection(id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <div className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Go to home"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div className="hidden sm:block text-left">
                  <h1 className="text-lg font-bold">FirstIssue</h1>
                  <p className="text-xs text-muted-foreground -mt-0.5">Open Source Gateway</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button 
                asChild 
                variant="outline" 
                className="rounded-full border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 px-5"
              >
                <Link href="/">Browse issues</Link>
              </Button>
              <div className="hidden sm:flex items-center">
                <iframe
                  src={`https://ghbtns.com/github-btn.html?user=${(process.env.NEXT_PUBLIC_REPO_OWNER as string) || (process.env.VERCEL_GIT_REPO_OWNER as string) || "suyash-thakur"}&repo=${(process.env.NEXT_PUBLIC_REPO_NAME as string) || (process.env.VERCEL_GIT_REPO_SLUG as string) || "js-good-first-issues-finder"}&type=star&count=true&size=large`}
                  title="GitHub Stars"
                  width="160"
                  height="30"
                  className="border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 md:p-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      <nav className="sticky top-20 hidden h-fit self-start lg:block">
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Table of Contents
            </h3>
        <ul className="space-y-1 text-sm">
          {sectionIds.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                      activeSection === s.id 
                        ? "bg-muted text-foreground font-medium border" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
          </div>
      </nav>
        <div className="space-y-12">
        <section id="intro" data-section ref={(el) => { observedRefs.current["intro"] = el; }}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium border">
                <Sparkles className="w-4 h-4" />
                Behind the Scenes
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                How Good First Issues Works
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover how we built a <strong>zero-database</strong> system that automatically curates GitHub issues, 
                preserves history through git, and serves thousands of developers looking for their next contribution.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <FeatureHighlight 
                icon={Database} 
                title="No Database Required" 
                description="Uses JSON files and git commits as the source of truth, eliminating database complexity."
                variant="accent"
              />
              <FeatureHighlight 
                icon={Zap} 
                title="Automated Curation" 
                description="Runs daily to discover new repositories and filter high-quality beginner issues."
              />
              <FeatureHighlight 
                icon={GitBranch} 
                title="Git-Powered History" 
                description="Leverages git commits to provide historical data without additional storage."
              />
            </div>
          </section>

          <section id="overview" data-section ref={(el) => { observedRefs.current["overview"] = el; }}>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">The Big Picture</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our system runs on a simple but powerful principle: <strong>let git be the database</strong>. 
                Here's how the magic happens, step by step.
            </p>
          </div>
            
            <div className="space-y-8">
              <ProcessStep 
                number={1}
                icon={Search}
                title="Discover Repositories"
                description="Every day at midnight, our cron script searches GitHub for JavaScript repositories that have good first issues. We look for repos with active maintainers, recent commits, and genuine beginner-friendly issues."
              />
              
              <ProcessStep 
                number={2}
                icon={FileText}
                title="Filter & Aggregate Issues"
                description="For each discovered repository, we fetch open issues labeled 'good first issue' that have been updated in the last month. We also collect repository metrics like stars, forks, and activity levels."
              />
              
              <ProcessStep 
                number={3}
                icon={Database}
                title="Generate Static Data"
                description="All the curated data gets written to two files: issues.json (structured data for the app) and README.md (human-readable list). These files become our source of truth."
              />
              
              <ProcessStep 
                number={4}
                icon={Workflow}
                title="Serve Through APIs"
                description="The Next.js app reads from these static files and provides filtering, pagination, and search capabilities. No database queries, just fast file reads and in-memory processing."
                isLast={true}
              />
          </div>
        </section>

        <section id="pipeline" data-section ref={(el) => { observedRefs.current["pipeline"] = el; }}>
            <Card className="border">
        <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Workflow className="w-6 h-6" />
                  System Architecture
                  <Badge variant="secondary">Zero DB</Badge>
                  <Badge variant="outline">Git-Native</Badge>
          </CardTitle>
        </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Why This Architecture?
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span><strong>Simplicity:</strong> No database setup, migrations, or hosting costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span><strong>Reliability:</strong> Static files are incredibly stable and fast to serve</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span><strong>Transparency:</strong> All data changes are visible in git commits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span><strong>Scalability:</strong> CDN-friendly static files serve millions of requests</span>
            </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Data Flow
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>GitHub API → Cron Script</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>Cron Script → JSON + Markdown</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>Static Files → Next.js API</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>API → React Frontend</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <details className="rounded-xl border bg-card p-4 group">
                  <summary className="cursor-pointer font-medium flex items-center gap-2 group-open:mb-4">
                    <Code2 className="w-4 h-4" />
                    Why JSON + README? (Click to expand)
                  </summary>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      We maintain two formats of the same data for different use cases:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground">issues.json:</strong>
                        <span>Structured data optimized for the web application with full metadata</span>
            </li>
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground">README.md:</strong>
                        <span>Human-readable format for GitHub browsing and as a fallback data source</span>
            </li>
                    </ul>
              <p>
                      This dual approach provides <strong>resilience</strong> (API can parse README if JSON fails) and 
                      <strong>accessibility</strong> (users can browse issues directly on GitHub).
              </p>
            </div>
          </details>
        </CardContent>
        </Card>
        </section>

          <section id="discovery" data-section ref={(el) => { observedRefs.current["discovery"] = el; }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Repository Discovery</h2>
                <p className="text-lg text-muted-foreground">
                  The heart of our system is a smart repository discovery algorithm that finds the best JavaScript projects for newcomers.
                </p>
              </div>
              
        <Card>
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    How We Find Great Repositories
                  </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Search Strategy</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Search for repos with <code className="bg-muted px-1 rounded">good-first-issues:&gt;1</code></li>
                        <li>• Focus on JavaScript repositories only</li>
                        <li>• Sort by both recent updates and star count</li>
                        <li>• Process up to 2 pages per search combination</li>
                        <li>• Deduplicate by repository full name</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Quality Filters</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Issues must be labeled "good first issue"</li>
                        <li>• Only open issues are considered</li>
                        <li>• Issues must be updated within the last month</li>
                        <li>• Repository must have recent activity</li>
                        <li>• Exclude forks to focus on original projects</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Core Discovery Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    title="getCandidateRepos() - Repository Search"
                    language="js"
                    code={`const getCandidateRepos = async () => {
  const languages = ['JavaScript'];
  const sorts = ['updated', 'stars'];
  const per_page = 50; // be gentle with rate limits
  const unique = new Map();

  for (const lang of languages) {
    for (const sort of sorts) {
      for (let page = 1; page <= 2; page++) { // up to 2 pages per combo
        try {
          const response = await axios.get(\`\${API_URL}/search/repositories\`, {
            headers: { Authorization: \`token \${TOKEN}\` },
            params: {
              q: \`good-first-issues:>1 fork:false language:\${lang}\`,
              sort,
              order: sort === 'stars' ? 'desc' : 'desc',
              per_page,
              page,
            },
          });
          const items = response.data.items || [];
          for (const repo of items) {
            if (!unique.has(repo.full_name)) {
              unique.set(repo.full_name, repo);
            }
          }
          // brief delay between calls
          await new Promise((r) => setTimeout(r, 250));
        } catch (error) {
          console.error(\`Failed to fetch repos: \${error.message}\`);
          break;
        }
      }
    }
  }

  return unique;
};`}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="aggregation" data-section ref={(el) => { observedRefs.current["aggregation"] = el; }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Data Aggregation & Processing</h2>
                <p className="text-lg text-muted-foreground">
                  Once we discover repositories, we need to extract and process their issues efficiently.
                </p>
          </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Issue Filtering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock
                      title="getFilteredIssues() - Issue Extraction"
                      language="js"
                      code={`const getFilteredIssues = async (repo) => {
  try {
    const response = await axios.get(\`\${API_URL}/repos/\${repo.full_name}/issues\`, {
      headers: { Authorization: \`token \${TOKEN}\` },
      params: { 
        state: 'open', 
        labels: 'good first issue', 
        sort: 'updated', 
        per_page: 100 
      },
    });

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return response.data.filter(issue => {
      const updatedAt = new Date(issue.updated_at);
      return updatedAt > lastMonth;
    });
  } catch (error) {
    console.error(\`Failed to fetch issues for \${repo.full_name}\`);
    return [];
  }
};`}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metrics Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium">Repository Metrics</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Stars:</strong> Community interest indicator</li>
                        <li>• <strong>Forks:</strong> Development activity measure</li>
                        <li>• <strong>Open issues:</strong> Project health indicator</li>
                        <li>• <strong>Last pushed:</strong> Recent activity timestamp</li>
                        <li>• <strong>Language:</strong> Primary programming language</li>
                      </ul>
                      
                      <h4 className="font-medium mt-4">Organization Metrics</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Total repos:</strong> Organization size</li>
                        <li>• <strong>Combined stars:</strong> Community reach</li>
                        <li>• <strong>Activity frequency:</strong> Issues per repository</li>
                        <li>• <strong>Popularity score:</strong> Stars + (Forks × 2)</li>
            </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="api" data-section ref={(el) => { observedRefs.current["api"] = el; }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">API Layer</h2>
                <p className="text-lg text-muted-foreground">
                  Our Next.js API routes provide a robust, fault-tolerant interface for accessing the curated issue data.
                </p>
              </div>
              
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5" />
                      /api/issues - Main Data Endpoint
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg border">
                        <h4 className="font-semibold">Primary Source</h4>
                        <p className="text-muted-foreground">Remote issues.json from GitHub</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg border">
                        <h4 className="font-semibold">Fallback 1</h4>
                        <p className="text-muted-foreground">Local issues.json file</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg border">
                        <h4 className="font-semibold">Fallback 2</h4>
                        <p className="text-muted-foreground">Parse README.md directly</p>
                      </div>
                    </div>
                    
                    <details className="border rounded-lg p-4 bg-muted/30">
                      <summary className="cursor-pointer font-medium">View API Implementation Highlights</summary>
                      <div className="mt-4">
                        <CodeBlock
                          title="Multi-source Data Loading with Fallbacks"
                          language="ts"
                          code={`// Fetch remote JSON as primary source
const issuesJsonUrl = process.env.ISSUES_JSON_URL;
if (issuesJsonUrl) {
  try {
    const r = await fetch(issuesJsonUrl, { next: { revalidate: 60 } });
    if (r.ok) {
      const parsed = await r.json();
      issues = (parsed.items || []) as LocalIssue[];
      orgSummaries = parsed.org_summaries || undefined;
    }
  } catch {}
}

// Fallback: read local issues.json
if (!issues || issues.length === 0) {
  try {
    const localIssuesPath = path.resolve(process.cwd(), "..", "issues.json");
    const file = await fs.readFile(localIssuesPath, "utf-8");
    const parsed = JSON.parse(file);
    issues = parsed.items || parsed;
  } catch {}
}

// Final fallback: parse README.md
if (!issues || issues.length === 0) {
  // Parse markdown format as backup...
}`}
                        />
                      </div>
          </details>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Features & Capabilities</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Real-time filtering by organization</li>
                          <li>• Repository-specific searches</li>
                          <li>• Full-text search across titles</li>
                          <li>• Date-based filtering</li>
                        </ul>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Popularity-based bucketing</li>
                          <li>• Activity-level categorization</li>
                          <li>• Pagination support</li>
                          <li>• Graceful error handling</li>
                        </ul>
                      </div>
                    </div>
        </CardContent>
        </Card>
              </div>
            </div>
        </section>

        <section id="history" data-section ref={(el) => { observedRefs.current["history"] = el; }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Git-Powered History</h2>
                <p className="text-lg text-muted-foreground">
                  Instead of a database, we use git commits as our time-series data store. Every data update is a commit, 
                  giving us free history, diffs, and auditability.
                </p>
              </div>
              
              <Card className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    How Git Becomes Our Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <FeatureHighlight 
                      icon={Clock} 
                      title="Automatic Timestamps" 
                      description="Every commit has a precise timestamp, giving us temporal data for free"
                    />
                    <FeatureHighlight 
                      icon={FileText} 
                      title="Complete Snapshots" 
                      description="Each commit preserves the full state of our data at that point in time"
                    />
                    <FeatureHighlight 
                      icon={Search} 
                      title="Queryable History" 
                      description="Git log commands let us query commits by date, file changes, or content"
                    />
                  </div>
                  
                  <details className="border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium">History API Implementation</summary>
                    <div className="mt-4">
                      <CodeBlock
                        title="/api/history - Git-based Time Travel"
                        language="ts"
                        code={`async function getCommits(limit: number = 20) {
  // Get commits that touched our data files
  const { stdout } = await execFileAsync("git", [
    "-C", REPO_ROOT, "log",
    "-n", String(limit),
    "--pretty=format:%H;%cI;%s",  // SHA;ISO-date;subject
    "--",
    "issues.json", "README.md",  // Only commits touching these files
  ]);
  
  return stdout.trim().split("\\n").filter(Boolean).map((line) => {
    const [sha, date, subject] = line.split(";");
    return { sha, date, subject };
  });
}

async function getFileAtCommit(sha: string, filePath: string) {
  // Get file contents at specific commit
  const { stdout } = await execFileAsync("git", [
    "-C", REPO_ROOT, "show", \`\${sha}:\${filePath}\`
  ]);
  return stdout;
}`}
                      />
                    </div>
                  </details>
                </CardContent>
              </Card>
              
        <Card>
        <CardHeader>
                  <CardTitle>Interactive History Explorer</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Browse through historical commits to see how our curated issues have evolved over time.
                  </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-72 overflow-auto rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">SHA</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {commits.map((c) => (
                          <tr key={c.sha} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(c.date).toLocaleString()}</td>
                            <td className="px-3 py-2 font-mono text-xs">{c.sha.slice(0, 10)}</td>
                            <td className="px-3 py-2 max-w-xs truncate" title={c.subject}>{c.subject}</td>
                    <td className="px-3 py-2 text-right">
                              <Button size="sm" onClick={() => setSelectedSha(c.sha)} className="text-xs">
                                Inspect
                              </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSha && (
                    <div className="space-y-3">
              <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">{selectedSha.slice(0, 10)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Commit snapshot from {commits.find(c => c.sha === selectedSha)?.date && 
                            new Date(commits.find(c => c.sha === selectedSha)!.date).toLocaleDateString()}
                        </span>
                        {loading && <span className="text-sm text-primary">Loading…</span>}
              </div>
              {snapshot?.json ? (
                        <CodeBlock 
                          title={`issues.json at commit ${selectedSha.slice(0, 7)}`}
                          code={JSON.stringify(snapshot.json, null, 2)} 
                          language="json" 
                        />
              ) : snapshot?.content ? (
                        <CodeBlock 
                          title={`README.md at commit ${selectedSha.slice(0, 7)}`}
                          code={snapshot.content} 
                          language="markdown" 
                        />
              ) : null}
            </div>
          )}
        </CardContent>
        </Card>
            </div>
        </section>

          <section id="frontend" data-section ref={(el) => { observedRefs.current["frontend"] = el; }}>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Frontend Architecture</h2>
                <p className="text-lg text-muted-foreground">
                  The user interface is built with Next.js and React, providing a fast, responsive experience 
                  for browsing and filtering thousands of issues.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
        <Card>
        <CardHeader>
                    <CardTitle className="text-lg">Key Features</CardTitle>
        </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Real-time Search:</strong> Instant filtering across issue titles and repository names
                        </div>
            </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Smart Filtering:</strong> Filter by organization, repository, popularity, and activity levels
                        </div>
            </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Responsive Design:</strong> Works perfectly on desktop, tablet, and mobile devices
                        </div>
            </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <strong>Performance:</strong> Client-side rendering with optimized API calls and caching
                        </div>
            </li>
          </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 bg-muted rounded border">
                          <strong>Next.js 14</strong>
                          <p className="text-muted-foreground text-xs">React framework</p>
                        </div>
                        <div className="p-2 bg-muted rounded border">
                          <strong>TypeScript</strong>
                          <p className="text-muted-foreground text-xs">Type safety</p>
                        </div>
                        <div className="p-2 bg-muted rounded border">
                          <strong>Tailwind CSS</strong>
                          <p className="text-muted-foreground text-xs">Styling</p>
                        </div>
                        <div className="p-2 bg-muted rounded border">
                          <strong>Framer Motion</strong>
                          <p className="text-muted-foreground text-xs">Animations</p>
                        </div>
                      </div>
                      
                      <details className="border rounded p-3 bg-muted/20">
                        <summary className="cursor-pointer font-medium text-sm">Component Architecture</summary>
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <div>• <code>IssuesListing.tsx</code> - Main issues browser</div>
                          <div>• <code>SearchableSelect</code> - Filterable dropdowns</div>
                          <div>• <code>Card</code> components - Issue display</div>
                          <div>• <code>Badge</code> system - Labels and categories</div>
                          <div>• <code>Dialog</code> modals - Detailed views</div>
                        </div>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="deep-dive" data-section ref={(el) => { observedRefs.current["deep-dive"] = el; }}>
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Technical Deep Dive</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  For developers who want to understand the nitty-gritty implementation details, 
                  here's a comprehensive look at our system's internals.
                </p>
              </div>
              
              <div className="grid gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5" />
                      Data Structure & JSON Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Our issues.json follows a structured schema optimized for both machine consumption and human readability.
                    </p>
                    
            <CodeBlock
                      title="Complete Data Schema"
              language="json"
              code={JSON.stringify(
                {
                          generated_at: "2025-01-13T00:00:00.000Z",
                  items: [
                    {
                              id: 12345,
                              title: "Add dark mode toggle to settings",
                              html_url: "https://github.com/example/awesome-app/issues/42",
                              updated_at: "2025-01-12T15:30:00.000Z",
                              labels: ["good first issue", "enhancement"],
                              repo: "example/awesome-app",
                              org: "example",
                              repo_name: "awesome-app",
                              repo_stars: 1250,
                              repo_forks: 89,
                              repo_pushed_at: "2025-01-12T14:20:00.000Z"
                            }
                          ],
                          org_summaries: {
                            "example": {
                              total_repos: 3,
                              total_stars: 4200,
                              total_forks: 210,
                              recent_issues_count: 8,
                              activity_frequency: 2.67,
                              popularity_score: 4620
                            }
                          },
                          repo_summaries: {
                            "example/awesome-app": {
                              stars: 1250,
                              forks: 89,
                              open_issues: 23,
                              pushed_at: "2025-01-12T14:20:00.000Z",
                              updated_at: "2025-01-12T14:20:00.000Z",
                              language: "JavaScript",
                              recent_issues_count: 3
                            }
                          }
                },
                null,
                2
              )}
            />
                  </CardContent>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rate Limiting Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p className="text-muted-foreground">
                        GitHub's API has strict rate limits, so we implement intelligent throttling:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• 250ms delay between repository search requests</li>
                        <li>• 1000ms delay between issue fetching for different repos</li>
                        <li>• Maximum 2-minute total execution time</li>
                        <li>• Graceful degradation on API failures</li>
                        <li>• Stop early if we hit 200 issues total</li>
                      </ul>
                      
                      <CodeBlock
                        title="Smart Rate Limiting"
                        language="js"
                        code={`// Gentle rate limiting between API calls
await new Promise((r) => setTimeout(r, 250));

// Stop early if hitting limits
if ((Date.now() - start) > MAX_ELAPSED_TIME || 
    issuesCount >= MAX_ISSUES_COUNT) {
  break;
}`}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Optimizations</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <p className="text-muted-foreground">
                        Several techniques keep our system fast and efficient:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• In-memory deduplication using Map objects</li>
                        <li>• Client-side filtering reduces API load</li>
                        <li>• Static file caching with 60-second revalidation</li>
                        <li>• Lazy loading of code exploration features</li>
                        <li>• Progressive enhancement for history features</li>
                      </ul>
                      
                      <CodeBlock
                        title="Efficient Deduplication"
                        language="js"
                        code={`const unique = new Map();
for (const repo of items) {
  if (!unique.has(repo.full_name)) {
    unique.set(repo.full_name, repo);
  }
}`}
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="w-5 h-5" />
                      Complete System Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Daily Cron Job Process</h4>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>1. Discovery</strong>
                          <p className="text-muted-foreground text-xs mt-1">Search GitHub for JS repos with good-first-issues</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>2. Filtering</strong>
                          <p className="text-muted-foreground text-xs mt-1">Extract recent open issues with proper labels</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>3. Processing</strong>
                          <p className="text-muted-foreground text-xs mt-1">Aggregate metrics, normalize data structure</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>4. Output</strong>
                          <p className="text-muted-foreground text-xs mt-1">Write JSON + Markdown, commit to git</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Request Processing Flow</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>1. Data Loading</strong>
                          <p className="text-muted-foreground text-xs mt-1">Remote JSON → Local JSON → README fallback</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>2. Filtering</strong>
                          <p className="text-muted-foreground text-xs mt-1">Apply search, org, repo, popularity filters</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg border">
                          <strong>3. Response</strong>
                          <p className="text-muted-foreground text-xs mt-1">Sort, paginate, return minimal JSON shape</p>
                        </div>
                      </div>
                    </div>
                    
                    <details className="border rounded-lg p-4 bg-muted/20">
                      <summary className="cursor-pointer font-medium">Full Implementation Walkthrough</summary>
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tabs.map((t) => (
                            <Button key={t.key} variant={active === t.key ? "default" : "secondary"} onClick={() => setActive(t.key)} size="sm">
                              {t.label}
                            </Button>
                          ))}
                        </div>
                        
                        <CodeBlock 
                          code={source} 
                          language={active === "index.js" ? "js" : "ts"} 
                          title={tabs.find(t => t.key === active)?.label}
                        />
                        
                        <div className="text-sm text-muted-foreground space-y-2">
                          <h5 className="font-medium text-foreground">Key Implementation Notes:</h5>
                          <ul className="space-y-1 pl-4">
                            <li>• <strong>index.js:</strong> Repository discovery, issue filtering, metrics aggregation, and file output</li>
                            <li>• <strong>/api/issues:</strong> Multi-source data loading with fallbacks, client-side filtering, and pagination</li>
                            <li>• <strong>/api/history:</strong> Git command execution for commit history and file snapshots</li>
                          </ul>
                        </div>
                      </div>
          </details>
        </CardContent>
        </Card>
                
                <Card className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Why This Architecture Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">Advantages</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span><strong>Zero Infrastructure:</strong> No database servers to manage or scale</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span><strong>Perfect Caching:</strong> Static files can be cached indefinitely by CDNs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span><strong>Audit Trail:</strong> Every change is visible in git history</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span><strong>Disaster Recovery:</strong> Data lives in git, backups are automatic</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-orange-700">Trade-offs</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <span><strong>Update Frequency:</strong> Limited to cron job schedule (daily)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <span><strong>Data Size:</strong> Works best with moderate data volumes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <span><strong>Complex Queries:</strong> Limited to what can be done client-side</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <span><strong>Real-time Updates:</strong> Not suitable for live data scenarios</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="text-center mt-6 p-4 bg-muted/30 rounded-lg border">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Perfect for:</strong> Content aggregation, daily digests, 
                        documentation sites, and any application where eventual consistency is acceptable and 
                        infrastructure simplicity is valued.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </section>
      </div>
    </div>
    </>
  );
}


