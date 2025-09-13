"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Filter, Search as SearchIcon, ExternalLink, Code, Tag, Calendar, Star, GitFork, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type ApiIssue = {
  id: number;
  title: string;
  html_url: string;
  updated_at: string;
  labels?: string[];
  repo?: string;
  org?: string;
  repo_name?: string;
  repo_stars?: number;
  repo_forks?: number;
  repo_open_issues?: number;
  repo_pushed_at?: string;
  org_activity_frequency?: number;
  org_popularity_score?: number;
  org_total_stars?: number;
  org_total_forks?: number;
};

type Commit = { sha: string; date: string; subject: string };

type Filters = {
  q: string;
  org: string;
  repo: string;
  updatedSince: string;
  popularity?: "low" | "moderate" | "high" | "very_high" | "";
  activity?: "low" | "moderate" | "high" | "very_high" | "";
};

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

function formatNumberCompact(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  } catch {
    // Fallback for environments without Intl support
    if (n >= 1_000_000) return (Math.round((n / 1_000_000) * 10) / 10) + "M";
    if (n >= 1_000) return (Math.round((n / 1_000) * 10) / 10) + "K";
    return String(n);
  }
}

function getPopularityTag(score?: number): string | null {
  if (typeof score !== "number" || !isFinite(score)) return null;
  if (score <= 100) return "Low popularity";
  if (score <= 1_000) return "Moderate popularity";
  if (score <= 10_000) return "High popularity";
  return "Very high popularity";
}

function getActivityTag(freq?: number): string | null {
  if (typeof freq !== "number" || !isFinite(freq)) return null;
  if (freq < 2) return "Low activity";
  if (freq < 5) return "Moderate activity";
  if (freq < 15) return "High activity";
  return "Very high activity";
}

type SelectOption = { label: string; value: string } | string;

function normalizeOptions(options: SelectOption[]): { label: string; value: string }[] {
  return options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  inputClassName
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const normalized = React.useMemo(() => normalizeOptions(options), [options]);
  const shown = React.useMemo(() => {
    const q = (query || value).toLowerCase();
    if (!q) return normalized.slice(0, 20);
    return normalized.filter(o => o.label.toLowerCase().includes(q)).slice(0, 20);
  }, [normalized, query, value]);

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setQuery(e.target.value); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={inputClassName || "w-full rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors"}
      />
      {open && shown.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-auto max-h-64 z-50">
          <ul className="py-2 text-sm">
            {shown.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Header({ value, onChange, onOpenHistory }: { value: string; onChange: (v: string) => void; onOpenHistory: () => void; }) {
  const [open, setOpen] = useState(false);
  const suggestions = ["react", "typescript", "docs", "testing", "performance"];
  const REPO_OWNER = (process.env.NEXT_PUBLIC_REPO_OWNER as string) || (process.env.VERCEL_GIT_REPO_OWNER as string) || "suyash-thakur";
  const REPO_NAME = (process.env.NEXT_PUBLIC_REPO_NAME as string) || (process.env.VERCEL_GIT_REPO_SLUG as string) || "js-good-first-issues-finder";
  return (
    <div className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <button
            type="button"
            aria-label="Reset to default"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            onClick={() => {
              const event = new CustomEvent("app:reset");
              window.dispatchEvent(event);
            }}
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
          </button>
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
            <Input
              aria-label="Search issues"
              className="pl-12 pr-4 h-12 rounded-full bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 text-base"
              placeholder="Search issues, repositories, topics…"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
            {open && !value && (
              <div className="absolute left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                <div className="px-4 py-3 text-xs font-medium text-muted-foreground border-b border-border/50">Popular searches</div>
                <div className="p-3 grid grid-cols-2 gap-2">
                  {suggestions.map((s) => (
                    <Button 
                      key={s} 
                      variant="ghost" 
                      className="justify-start h-auto py-2.5 px-3 text-sm rounded-xl hover:bg-accent/50 transition-colors" 
                      onMouseDown={(e) => e.preventDefault()} 
                      onClick={() => onChange(s)}
                    >
                      <Tag className="h-3.5 w-3.5 mr-2 opacity-50" />
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              asChild
              variant="outline" 
              className="rounded-full border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 px-5"
            >
              <a href="/how-it-works">How it works</a>
            </Button>
            <Button 
              variant="outline" 
              aria-label="Open history" 
              onClick={onOpenHistory} 
              className="rounded-full border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 px-5"
            >
              <History className="h-4 w-4 mr-2" /> 
              <span className="hidden sm:inline">History</span>
            </Button>
            
            <div className="hidden sm:flex items-center">
              <iframe
                src={`https://ghbtns.com/github-btn.html?user=${REPO_OWNER}&repo=${REPO_NAME}&type=star&count=true&size=large`}
                title="GitHub Stars"
                width="160"
                height="30"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltersPanel({ filters, setFilters, orgOptions = [], repoOptions = [] }: { filters: Filters; setFilters: (f: Filters) => void; orgOptions?: string[]; repoOptions?: string[]; }) {
  return (
    <div className="h-fit w-72 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 space-y-5 hidden lg:block shadow-lg" aria-label="Filters">
      <div className="flex items-center gap-2 mb-1">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Filters</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Organization</label>
          <SearchableSelect 
            value={filters.org}
            onChange={(v) => setFilters({ ...filters, org: v })}
            options={orgOptions}
            placeholder="Search org…"
            inputClassName="w-full h-9 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Repository</label>
          <SearchableSelect 
            value={filters.repo}
            onChange={(v) => setFilters({ ...filters, repo: v })}
            options={repoOptions}
            placeholder="Search repo…"
            inputClassName="w-full h-9 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Updated Since</label>
          <Input 
            type="date" 
            className="w-full rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors" 
            value={filters.updatedSince} 
            onChange={(e) => setFilters({ ...filters, updatedSince: e.target.value })} 
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Popularity</label>
          <SearchableSelect 
            value={filters.popularity || ""}
            onChange={(v) => setFilters({ ...filters, popularity: v as Filters["popularity"] })}
            options={[
              { label: "Any", value: "" },
              { label: "Low", value: "low" },
              { label: "Moderate", value: "moderate" },
              { label: "High", value: "high" },
              { label: "Very high", value: "very_high" },
            ]}
            placeholder="Popularity level"
            inputClassName="w-full h-9 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Activity</label>
          <SearchableSelect 
            value={filters.activity || ""}
            onChange={(v) => setFilters({ ...filters, activity: v as Filters["activity"] })}
            options={[
              { label: "Any", value: "" },
              { label: "Low", value: "low" },
              { label: "Moderate", value: "moderate" },
              { label: "High", value: "high" },
              { label: "Very high", value: "very_high" },
            ]}
            placeholder="Activity level"
            inputClassName="w-full h-9 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full rounded-xl border-border/50 hover:border-destructive hover:bg-destructive/5 transition-all duration-200" 
        onClick={() => setFilters({ q: "", org: "", repo: "", updatedSince: "", popularity: "", activity: "" })}
      >
        Clear All
      </Button>
    </div>
  );
}

function MobileFilters({ open, onClose, filters, setFilters, orgOptions = [], repoOptions = [] }: { open: boolean; onClose: () => void; filters: Filters; setFilters: (f: Filters) => void; orgOptions?: string[]; repoOptions?: string[]; }) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-t border-border/50">
        <SheetHeader className="pb-4">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Organization</label>
            <SearchableSelect 
              value={filters.org}
              onChange={(v) => setFilters({ ...filters, org: v })}
              options={orgOptions}
              placeholder="Search org…"
              inputClassName="w-full h-10 rounded-xl bg-background/50 border-border/50 px-3"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Repository</label>
            <SearchableSelect 
              value={filters.repo}
              onChange={(v) => setFilters({ ...filters, repo: v })}
              options={repoOptions}
              placeholder="Search repo…"
              inputClassName="w-full h-10 rounded-xl bg-background/50 border-border/50 px-3"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Updated Since</label>
            <Input 
              type="date" 
              value={filters.updatedSince} 
              onChange={(e) => setFilters({ ...filters, updatedSince: e.target.value })} 
              className="rounded-xl bg-background/50 border-border/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Popularity</label>
            <SearchableSelect 
              value={filters.popularity || ""}
              onChange={(v) => setFilters({ ...filters, popularity: v as Filters["popularity"] })}
              options={[
                { label: "Any", value: "" },
                { label: "Low", value: "low" },
                { label: "Moderate", value: "moderate" },
                { label: "High", value: "high" },
                { label: "Very high", value: "very_high" },
              ]}
              placeholder="Popularity level"
              inputClassName="w-full h-10 rounded-xl bg-background/50 border-border/50 px-3"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Activity</label>
            <SearchableSelect 
              value={filters.activity || ""}
              onChange={(v) => setFilters({ ...filters, activity: v as Filters["activity"] })}
              options={[
                { label: "Any", value: "" },
                { label: "Low", value: "low" },
                { label: "Moderate", value: "moderate" },
                { label: "High", value: "high" },
                { label: "Very high", value: "very_high" },
              ]}
              placeholder="Activity level"
              inputClassName="w-full h-10 rounded-xl bg-background/50 border-border/50 px-3"
            />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-border/50 hover:border-destructive hover:bg-destructive/5" 
            onClick={() => setFilters({ q: "", org: "", repo: "", updatedSince: "", popularity: "", activity: "" })}
          >
            Clear All
          </Button>
          <Button 
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90" 
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function IssueCard({ it, index }: { it: ApiIssue; index: number; }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(it.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const hasValidDate = React.useMemo(() => {
    if (!it.updated_at) return false;
    const t = new Date(it.updated_at).getTime();
    return Number.isFinite(t);
  }, [it.updated_at]);
  
  return (
    <motion.li 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
    >
      <Card className="group p-6 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/80">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            <Code className="h-3.5 w-3.5" />
            <span className="font-medium">{it.repo}</span>
          </div>
          {hasValidDate && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 opacity-50" />
                <span>{new Date(it.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <a 
              className="text-base sm:text-lg font-semibold text-foreground hover:text-primary/80 transition-colors duration-200 line-clamp-2" 
              href={it.html_url} 
              target="_blank" 
              rel="noreferrer"
            >
              {it.title}
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {typeof it.repo_stars === 'number' && (
                <span title="Repository stars" className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 border border-border/50">
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                  {formatNumberCompact(it.repo_stars)}
                </span>
              )}
              {typeof it.repo_forks === 'number' && (
                <span title="Repository forks" className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 border border-border/50">
                  <GitFork className="h-3.5 w-3.5" />
                  {formatNumberCompact(it.repo_forks)}
                </span>
              )}
              {typeof it.repo_open_issues === 'number' && (
                <span title="Open issues in repository" className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 border border-border/50">
                  <Tag className="h-3.5 w-3.5" />
                  {formatNumberCompact(it.repo_open_issues)}
                </span>
              )}
              {getPopularityTag(it.org_popularity_score) && (
                <span title="Organization popularity" className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 border border-border/50">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  {getPopularityTag(it.org_popularity_score)!}
                </span>
              )}
              {getActivityTag(it.org_activity_frequency) && (
                <span title="Organization activity" className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 border border-border/50">
                  <History className="h-3.5 w-3.5" />
                  {getActivityTag(it.org_activity_frequency)!}
                </span>
              )}
            </div>
          </div>
          
          <div className="shrink-0 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-4 text-sm rounded-full border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200" 
              onClick={() => window.open(it.html_url, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Open
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-accent/50 transition-colors" 
              onClick={handleCopy}
              aria-label="Copy link"
            >
              {copied ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  ✓
                </motion.div>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </Button>
          </div>
        </div>
        
        {!!(it.labels && it.labels.length) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {it.labels!.slice(0, 6).map((l, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="text-xs px-2.5 py-0.5 rounded-full bg-accent/50 hover:bg-accent/70 transition-colors border-0 inline-flex items-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {l}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </motion.li>
  );
}

function HistoryModal({ open, onOpenChange, commits, selectedSha, onChangeSha, onViewSnapshot, onViewSnapshotFor }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  commits: Commit[];
  selectedSha: string;
  onChangeSha: (sha: string) => void;
  onViewSnapshot: () => void;
  onViewSnapshotFor: (sha: string) => void;
}) {
  const selected = React.useMemo(() => commits.find((c) => c.sha === selectedSha), [commits, selectedSha]);
  const selectedDate = selected ? new Date(selected.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border-border/50 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <span className="truncate">{selectedDate || 'Recent Commits'}</span>
            </DialogTitle>
            {selected && (
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{selected.subject}</div>
            )}
          </div>
          <DialogClose className="h-9 px-4 rounded-full border border-border/50 text-sm hover:bg-accent/50 transition-colors shrink-0">
            <span className="hidden sm:inline">Close</span>
            <span className="sm:hidden">×</span>
          </DialogClose>
        </div>

        <div className="flex flex-col gap-3 min-h-0 flex-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-muted/30 rounded-xl">
            <select 
              className="h-10 rounded-xl border border-border/50 bg-background/50 px-4 text-sm flex-1 min-w-0 max-w-full" 
              value={selectedSha} 
              onChange={(e) => onChangeSha(e.target.value)}
            >
              <option value="">Select a commit…</option>
              {commits.map((c) => (
                <option key={c.sha} value={c.sha}>
                  {c.date.split("T")[0]} — {c.subject.slice(0, 50)}{c.subject.length > 50 ? '...' : ''}
                </option>
              ))}
            </select>
            <Button 
              variant="outline" 
              className="h-10 px-6 rounded-xl border-border/50 hover:border-primary hover:bg-primary/5 transition-all" 
              onClick={onViewSnapshot} 
              disabled={!selectedSha}
            >
              View Snapshot
            </Button>
          </div>

          <div className="pr-1 overflow-y-auto flex-1 min-h-0">
            {commits.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-3 size-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No commits found or rate limited.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {commits.map((c) => (
                  <li 
                    key={c.sha} 
                    className="rounded-xl border border-border/50 p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => { onChangeSha(c.sha); onViewSnapshotFor(c.sha); }}
                  >
                    <div className="text-sm text-foreground font-semibold">{new Date(c.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs text-muted-foreground mb-1">{c.subject}</div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="font-mono bg-muted/50 px-2 py-0.5 rounded">{c.sha.slice(0,7)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Open Source Contribution Platform
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Find Your First
            <span className="block gradient-text mt-2">Open Source Contribution</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            Discover beginner-friendly GitHub issues from top repositories. 
            Start your open source journey with carefully curated "good first issues" 
            that match your skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Updated Daily
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Popular Repositories
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Beginner Friendly
            </div>
          </div>
        </motion.div>
        
        {/* Bottom gradient + divider to blend into list section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-8 sm:h-10 bg-gradient-to-b from-transparent to-background" />
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}

 

export default function IssuesListing() {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<Filters>({ q: "", org: "", repo: "", updatedSince: "", popularity: "", activity: "" });
  const [items, setItems] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedSha, setSelectedSha] = useState("");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(true);
  const REPO_OWNER = (process.env.NEXT_PUBLIC_REPO_OWNER as string) || (process.env.VERCEL_GIT_REPO_OWNER as string) || "suyashthakur";
  const REPO_NAME = (process.env.NEXT_PUBLIC_REPO_NAME as string) || (process.env.VERCEL_GIT_REPO_SLUG as string) || "js-good-first-issues-finder";
  const [contributors, setContributors] = useState<Array<{ login: string; html_url: string; avatar_url: string }>>([]);

  function parseIssuesFromReadme(markdown: string): ApiIssue[] {
    try {
      const lines = (markdown || "").split("\n");
      let currentRepo: string | undefined;
      const result: ApiIssue[] = [];
      const repoHeaderRE = /^##\s+\([^\)]+\)/; // placeholder, not used directly
      const repoHeaderFullRE = /^##\s+\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/;
      const issueLineRE = /^\s*-\s\[(.+)\]\((https?:\/\/[^\)]+)\)/;
      for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        const repoMatch = line.match(repoHeaderFullRE);
        if (repoMatch) {
          currentRepo = repoMatch[1];
          continue;
        }
        const issueMatch = line.match(issueLineRE);
        if (issueMatch && currentRepo) {
          const title = issueMatch[1].trim();
          const html_url = issueMatch[2].trim();
          const id = Math.abs((title + html_url).split("").reduce((a, c) => a + c.charCodeAt(0), 0));
          const org = currentRepo.split("/")[0];
          const repoName = currentRepo.split("/")[1];
          result.push({
            id,
            title,
            html_url,
            updated_at: new Date().toISOString(),
            labels: [],
            repo: currentRepo,
            org,
            repo_name: repoName,
          });
        }
      }
      return result;
    } catch {
      return [];
    }
  }

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set("q", filters.q);
    if (filters.org) p.set("org", filters.org);
    if (filters.repo) p.set("repo", filters.repo);
    if (filters.updatedSince) p.set("updatedSince", filters.updatedSince);
    if (filters.popularity) p.set("popularity", filters.popularity);
    if (filters.activity) p.set("activity", filters.activity);
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
  }, [filters.q, filters.org, filters.repo, filters.updatedSince, filters.popularity, filters.activity]);

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

  async function viewSelectedSnapshot() {
    if (!selectedSha) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/history?sha=${selectedSha}`);
      const j = await r.json();
      // If we received JSON issues, use them directly; otherwise parse README
      let parsed: ApiIssue[] = [];
      if (j && j.json) {
        const items = Array.isArray(j.json) ? j.json : j.json.items;
        if (Array.isArray(items)) {
          parsed = (items as any[]).map((it) => ({
            id: it.id,
            title: it.title,
            html_url: it.html_url,
            updated_at: it.updated_at,
            labels: it.labels || [],
            repo: it.repo,
            org: it.org,
            repo_name: it.repo_name,
            repo_stars: typeof it.repo_stars === 'number' ? it.repo_stars : undefined,
            repo_forks: typeof it.repo_forks === 'number' ? it.repo_forks : undefined,
            repo_open_issues: typeof it.repo_open_issues === 'number' ? it.repo_open_issues : undefined,
            repo_pushed_at: it.repo_pushed_at,
            org_activity_frequency: typeof it.org_activity_frequency === 'number' ? it.org_activity_frequency : undefined,
            org_popularity_score: typeof it.org_popularity_score === 'number' ? it.org_popularity_score : undefined,
            org_total_stars: typeof it.org_total_stars === 'number' ? it.org_total_stars : undefined,
            org_total_forks: typeof it.org_total_forks === 'number' ? it.org_total_forks : undefined,
          }));
        }
      }
      if (parsed.length === 0) {
        const md = j.content || "";
        parsed = parseIssuesFromReadme(md);
        // Use the commit date for README-derived items so the date is correct for snapshots
        const commit = commits.find((c) => c.sha === selectedSha);
        if (commit) {
          parsed = parsed.map((p) => ({ ...p, updated_at: commit.date }));
        }
      }
      setItems(parsed);
      setHasMore(false);
      setHistoryOpen(false);
      setSnapshot(null);
      setShowHero(false);
      setPage(1);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function viewSnapshotFor(sha: string) {
    if (!sha) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/history?sha=${sha}`);
      const j = await r.json();
      let parsed: ApiIssue[] = [];
      if (j && j.json) {
        const items = Array.isArray(j.json) ? j.json : j.json.items;
        if (Array.isArray(items)) {
          parsed = (items as any[]).map((it) => ({
            id: it.id,
            title: it.title,
            html_url: it.html_url,
            updated_at: it.updated_at,
            labels: it.labels || [],
            repo: it.repo,
            org: it.org,
            repo_name: it.repo_name,
            repo_stars: typeof it.repo_stars === 'number' ? it.repo_stars : undefined,
            repo_forks: typeof it.repo_forks === 'number' ? it.repo_forks : undefined,
            repo_open_issues: typeof it.repo_open_issues === 'number' ? it.repo_open_issues : undefined,
            repo_pushed_at: it.repo_pushed_at,
            org_activity_frequency: typeof it.org_activity_frequency === 'number' ? it.org_activity_frequency : undefined,
            org_popularity_score: typeof it.org_popularity_score === 'number' ? it.org_popularity_score : undefined,
            org_total_stars: typeof it.org_total_stars === 'number' ? it.org_total_stars : undefined,
            org_total_forks: typeof it.org_total_forks === 'number' ? it.org_total_forks : undefined,
          }));
        }
      }
      if (parsed.length === 0) {
        const md = j.content || "";
        parsed = parseIssuesFromReadme(md);
        const commit = commits.find((c) => c.sha === sha);
        if (commit) {
          parsed = parsed.map((p) => ({ ...p, updated_at: commit.date }));
        }
      }
      setSelectedSha(sha);
      setItems(parsed);
      setHasMore(false);
      setHistoryOpen(false);
      setSnapshot(null);
      setShowHero(false);
      setPage(1);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  // Hide hero after user starts interacting
  useEffect(() => {
    if (filters.q || filters.org || filters.repo || filters.updatedSince || filters.popularity || filters.activity) {
      setShowHero(false);
    }
  }, [filters]);

  // Listen to global reset event from header logo
  useEffect(() => {
    function onReset() {
      setFilters({ q: "", org: "", repo: "", updatedSince: "", popularity: "", activity: "" });
      setItems([]);
      setPage(1);
      setHasMore(true);
      setSelectedSha("");
      setSnapshot(null);
      setShowHero(true);
      fetchIssues(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.addEventListener("app:reset", onReset as EventListener);
    return () => window.removeEventListener("app:reset", onReset as EventListener);
  }, []);

  // Fetch contributors once
  useEffect(() => {
    async function loadContributors() {
      try {
        const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=30`);
        if (!r.ok) return;
        const data = await r.json();
        const list = (Array.isArray(data) ? data : []).map((c: any) => ({
          login: c.login,
          html_url: c.html_url,
          avatar_url: c.avatar_url,
        })).filter(Boolean);
        setContributors(list);
      } catch {}
    }
    loadContributors();
  }, [REPO_OWNER, REPO_NAME]);

  return (
    <div className="min-h-screen">
      <Header value={filters.q} onChange={(q) => setFilters({ ...filters, q })} onOpenHistory={loadCommits} />
      
      {showHero && (
        <>
          <HeroSection />
        </>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex gap-8">
          <div className="hidden lg:flex lg:flex-col gap-4 sticky top-[88px] h-fit">
            <FiltersPanel 
              filters={filters} 
              setFilters={setFilters} 
              orgOptions={[...new Set(items.map(i => (i.org || (i.repo ? i.repo.split('/')[0] : ""))).filter(Boolean))] as string[]} 
              repoOptions={[...new Set(items.map(i => (i.repo_name || (i.repo ? i.repo.split('/')[1] : ""))).filter(Boolean))] as string[]} 
            />
            {!!contributors.length && (
              <section className="w-72 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Contributors</h3>
                  <a
                    href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/graphs/contributors`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View all
                  </a>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {contributors.slice(0, 8).map((c) => (
                    <li key={c.login} className="rounded-xl border border-border/50 p-2 bg-card/60 hover:bg-card/80 transition-colors">
                      <a href={c.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <img src={c.avatar_url} alt={c.login} className="h-8 w-8 rounded-full" />
                        <span className="truncate text-xs">{c.login}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  {showHero ? "Browse All Issues" : "Search Results"}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {items.length > 0 ? (
                    <>
                      Found <span className="font-semibold text-foreground">{items.length}</span> beginner-friendly opportunities
                    </>
                  ) : (
                    "Discover your next open source contribution"
                  )}
                </p>
              </div>
              {isMobile && (
                <Button 
                  variant="outline" 
                  className="lg:hidden rounded-full border-border/50 hover:border-primary hover:bg-primary/5" 
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" /> 
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              )}
            </div>

            {loading && items.length === 0 ? (
              <ul className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="rounded-2xl border border-border/50 p-6 bg-card/30 backdrop-blur-sm">
                    <div className="animate-pulse space-y-3">
                      <div className="flex gap-3">
                        <div className="h-6 w-32 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full" />
                        <div className="h-6 w-24 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full" />
                      </div>
                      <div className="h-5 w-[85%] bg-gradient-to-r from-muted/40 to-muted/60 rounded-lg" />
                      <div className="flex gap-2">
                        <div className="h-6 w-20 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full" />
                        <div className="h-6 w-24 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full" />
                        <div className="h-6 w-16 bg-gradient-to-r from-muted/30 to-muted/50 rounded-full" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <ul role="list" aria-label="Issue results" className="space-y-4">
                  <AnimatePresence>
                    {items.map((it, i) => (
                      <IssueCard key={`${it.id}-${it.html_url}`} it={it} index={i} />
                    ))}
                  </AnimatePresence>
                </ul>
                {items.length === 0 && (
                  <div className="text-center py-20">
                    <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <SearchIcon className="h-8 w-8 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No issues found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Try adjusting your filters or search terms to discover more opportunities.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="mt-8 flex items-center justify-center">
              <Button 
                variant="outline" 
                onClick={() => setPage((p) => p + 1)} 
                disabled={!hasMore || loading} 
                className="rounded-full px-8 py-2.5 border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="h-4 w-4 mr-2 border-2 border-primary/30 border-t-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Loading more issues...
                  </>
                ) : hasMore ? (
                  <>
                    Load more issues
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  "You've reached the end 🎉"
                )}
              </Button>
            </div>

            {snapshot !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-border/50 p-6 bg-card/50 backdrop-blur-sm max-h-[50vh] overflow-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Snapshot Content</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-xs"
                    onClick={() => setSnapshot(null)}
                  >
                    Close
                  </Button>
                </div>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                  {snapshot || "Empty file"}
                </pre>
              </motion.div>
            )}

            
          </div>
        </div>
      </main>

      <MobileFilters 
        open={filtersOpen} 
        onClose={() => setFiltersOpen(false)} 
        filters={filters} 
        setFilters={setFilters}
        orgOptions={[...new Set(items.map(i => (i.org || (i.repo ? i.repo.split('/')[0] : ""))).filter(Boolean))] as string[]}
        repoOptions={[...new Set(items.map(i => (i.repo_name || (i.repo ? i.repo.split('/')[1] : ""))).filter(Boolean))] as string[]}
      />

      <HistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        commits={commits}
        selectedSha={selectedSha}
        onChangeSha={setSelectedSha}
        onViewSnapshot={viewSelectedSnapshot}
        onViewSnapshotFor={viewSnapshotFor}
      />
    </div>
  );
}


