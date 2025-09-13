"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Filter, Search as SearchIcon, ExternalLink, Star, MessageCircle, Code, Tag, Calendar, GitFork } from "lucide-react";

type ApiIssue = {
  id: number;
  title: string;
  html_url: string;
  updated_at: string;
  labels?: string[];
  repo?: string;
};

type Commit = { sha: string; date: string; subject: string };

type Filters = {
  q: string;
  org: string;
  repo: string;
  updatedSince: string;
};

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function Header({ value, onChange, onOpenHistory }: { value: string; onChange: (v: string) => void; onOpenHistory: () => void; }) {
  const [open, setOpen] = useState(false);
  const suggestions = ["react", "typescript", "test", "docs", "performance"];
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            aria-label="Search issues"
            className="w-full h-10 rounded-md pl-9 pr-3 bg-background border text-sm"
            placeholder="Search issues, repositories, topics…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && !value && (
            <div className="absolute left-0 right-0 mt-1 bg-background border rounded-md shadow-sm">
              <div className="p-2 text-xs text-muted-foreground">Try</div>
              <div className="p-2 pt-0 grid grid-cols-2 gap-2">
                {suggestions.map((s) => (
                  <button key={s} className="text-left text-sm rounded px-2 py-1 hover:bg-accent" onMouseDown={(e) => e.preventDefault()} onClick={() => onChange(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button aria-label="Open history" className="h-10 w-10 inline-flex items-center justify-center rounded-md border" onClick={onOpenHistory}>
          <History className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FiltersPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void; }) {
  return (
    <div className="sticky top-[68px] h-fit w-72 bg-background border rounded-lg p-4 space-y-4 hidden md:block" aria-label="Filters">
      <div>
        <label className="text-sm mb-1 block">Org</label>
        <input className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={filters.org} onChange={(e) => setFilters({ ...filters, org: e.target.value })} placeholder="e.g. vercel" />
      </div>
      <div>
        <label className="text-sm mb-1 block">Repo</label>
        <input className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={filters.repo} onChange={(e) => setFilters({ ...filters, repo: e.target.value })} placeholder="e.g. next.js" />
      </div>
      <div>
        <label className="text-sm mb-1 block">Updated since</label>
        <input type="date" className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={filters.updatedSince} onChange={(e) => setFilters({ ...filters, updatedSince: e.target.value })} />
      </div>
      <button className="w-full h-9 rounded-md border text-sm" onClick={() => setFilters({ q: "", org: "", repo: "", updatedSince: "" })}>Clear</button>
    </div>
  );
}

function MobileFilters({ open, onClose, filters, setFilters }: { open: boolean; onClose: () => void; filters: Filters; setFilters: (f: Filters) => void; }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t rounded-t-xl p-4" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Filters</div>
                <button className="h-8 px-3 rounded-md border text-sm" onClick={onClose}>Done</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Org" value={filters.org} onChange={(e) => setFilters({ ...filters, org: e.target.value })} />
                <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="Repo" value={filters.repo} onChange={(e) => setFilters({ ...filters, repo: e.target.value })} />
                <input type="date" className="h-9 rounded-md border bg-background px-3 text-sm col-span-2" value={filters.updatedSince} onChange={(e) => setFilters({ ...filters, updatedSince: e.target.value })} />
                <button className="h-9 rounded-md border text-sm col-span-2" onClick={() => setFilters({ q: "", org: "", repo: "", updatedSince: "" })}>Clear</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function IssueCard({ it, index }: { it: ApiIssue; index: number; }) {
  return (
    <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="rounded-xl border p-4 bg-card">
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
        <Code className="h-3.5 w-3.5" />
        <span>{it.repo}</span>
        <span>•</span>
        <Calendar className="h-3.5 w-3.5" />
        <span>Updated {new Date(it.updated_at).toLocaleDateString()}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <a className="text-base sm:text-lg font-semibold hover:underline" href={it.html_url} target="_blank" rel="noreferrer">
          {it.title}
        </a>
        <div className="shrink-0 flex items-center gap-1">
          <button className="h-8 px-3 rounded-md border text-xs sm:text-sm" onClick={() => window.open(it.html_url, "_blank")}>Open</button>
          <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border" onClick={() => navigator.clipboard.writeText(it.html_url)} aria-label="Copy link">
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
      {!!(it.labels && it.labels.length) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {it.labels!.slice(0, 6).map((l, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full border bg-secondary text-secondary-foreground inline-flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {l}
            </span>
          ))}
        </div>
      )}
    </motion.li>
  );
}

export default function IssuesListing() {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<Filters>({ q: "", org: "", repo: "", updatedSince: "" });
  const [items, setItems] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedSha, setSelectedSha] = useState("");
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set("q", filters.q);
    if (filters.org) p.set("org", filters.org);
    if (filters.repo) p.set("repo", filters.repo);
    if (filters.updatedSince) p.set("updatedSince", filters.updatedSince);
    p.set("page", String(page));
    p.set("per_page", "24");
    return p.toString();
  }, [filters, page]);

  async function fetchIssues(append = false) {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues?${query}`);
      const json = await res.json();
      const next = (json.items || []) as ApiIssue[];
      setItems((prev) => (append ? [...prev, ...next] : next));
      setHasMore(next.length >= 24);
    } catch {
      setItems(append ? items : []);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.q, filters.org, filters.repo, filters.updatedSince]);

  useEffect(() => {
    fetchIssues(page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  async function loadCommits() {
    try {
      const r = await fetch(`/api/history?limit=25`);
      const j = await r.json();
      setCommits(j.commits || []);
      setHistoryOpen(true);
    } catch {
      setCommits([]);
      setHistoryOpen(true);
    }
  }

  async function openSnapshot(sha: string) {
    try {
      const r = await fetch(`/api/history?sha=${sha}`);
      const j = await r.json();
      setSnapshot(j.content || j.file || "");
    } catch {
      setSnapshot(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Header value={filters.q} onChange={(q) => setFilters({ ...filters, q })} onOpenHistory={loadCommits} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <FiltersPanel filters={filters} setFilters={setFilters} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Good First Issues</h1>
                <p className="text-sm text-muted-foreground">{items.length} results</p>
              </div>
              {isMobile && (
                <button className="h-9 px-3 rounded-md border text-sm inline-flex items-center gap-2 md:hidden" onClick={() => setFiltersOpen(true)}>
                  <Filter className="h-4 w-4" /> Filters
                </button>
              )}
            </div>

            <ul role="list" aria-label="Issue results" className="space-y-3">
              <AnimatePresence>
                {items.map((it, i) => (
                  <IssueCard key={it.id} it={it} index={i} />
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                className="h-9 px-4 rounded-md border text-sm disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore || loading}
              >
                {loading ? "Loading…" : hasMore ? "Load more" : "No more results"}
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4" />
                <div className="font-medium">History</div>
              </div>
              <div className="flex gap-2">
                <select className="h-9 rounded-md border bg-background px-3 text-sm min-w-56" value={selectedSha} onChange={(e) => setSelectedSha(e.target.value)}>
                  <option value="">Select a commit…</option>
                  {commits.map((c) => (
                    <option key={c.sha} value={c.sha}>{c.date.split("T")[0]} — {c.subject}</option>
                  ))}
                </select>
                <button className="h-9 px-3 rounded-md border text-sm" onClick={() => selectedSha && openSnapshot(selectedSha)} disabled={!selectedSha}>View snapshot</button>
                <button className="h-9 px-3 rounded-md border text-sm" onClick={loadCommits}>Reload commits</button>
              </div>
              {snapshot !== null && (
                <div className="mt-4 rounded-lg border p-3 bg-card max-h-[50vh] overflow-auto text-sm whitespace-pre-wrap">
                  {snapshot || "Empty file"}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileFilters open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}


