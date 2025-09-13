import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RepoRef = {
  owner: string;
  repo: string;
  branch: string;
};

function resolveRepo(): RepoRef {
  const repoEnv = process.env.GITHUB_REPO || process.env.GITHUB_REPOSITORY; // e.g. owner/repo
  const branchEnv = process.env.GITHUB_BRANCH || process.env.DEFAULT_BRANCH || "main";
  if (repoEnv) {
    const [owner, repo] = repoEnv.split("/");
    if (owner && repo) return { owner, repo, branch: branchEnv };
  }
  const readmeUrl = process.env.README_RAW_URL; // e.g. https://raw.githubusercontent.com/<owner>/<repo>/<branch>/README.md
  if (readmeUrl) {
    try {
      const u = new URL(readmeUrl);
      const parts = u.pathname.split("/").filter(Boolean); // [owner, repo, branch, ...]
      const owner = parts[0];
      const repo = parts[1];
      const branch = parts[2] || branchEnv;
      if (owner && repo) return { owner, repo, branch };
    } catch { }
  }
  throw new Error("Repository not configured. Set GITHUB_REPO=owner/repo or README_RAW_URL.");
}

function githubHeaders(json: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: json ? "application/vnd.github+json" : "application/vnd.github.raw",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_PAT;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchCommitsForPath(ref: RepoRef, path: string, limit: number) {
  const url = new URL(`https://api.github.com/repos/${ref.owner}/${ref.repo}/commits`);
  url.searchParams.set("sha", ref.branch);
  url.searchParams.set("per_page", String(Math.min(limit, 100)));
  url.searchParams.set("path", path);
  const r = await fetch(url, { headers: githubHeaders(true), next: { revalidate: 60 } });
  if (!r.ok) return [] as any[];
  return (await r.json()) as any[];
}

async function getCommits(limit: number = 20) {
  const ref = resolveRepo();
  // Prefer commits that touch issues.json; also include README.md and de-dup
  const [issuesCommits, readmeCommits] = await Promise.all([
    fetchCommitsForPath(ref, "issues.json", limit),
    fetchCommitsForPath(ref, "README.md", limit),
  ]);
  const merged = new Map<string, any>();
  for (const c of [...issuesCommits, ...readmeCommits]) {
    merged.set(c.sha, c);
  }
  const items = Array.from(merged.values())
    .sort((a, b) => new Date(b.commit?.author?.date || b.commit?.committer?.date || 0).getTime() - new Date(a.commit?.author?.date || a.commit?.committer?.date || 0).getTime())
    .slice(0, limit)
    .map((c) => ({
      sha: c.sha as string,
      date: (c.commit?.author?.date || c.commit?.committer?.date) as string,
      subject: (c.commit?.message || "").split("\n")[0] as string,
    }));
  return items;
}

async function getFileAtCommit(sha: string, filePath: string) {
  const ref = resolveRepo();
  // Use contents API with raw accept header to fetch file at a specific ref
  const url = `https://api.github.com/repos/${ref.owner}/${ref.repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(sha)}`;
  const r = await fetch(url, { headers: githubHeaders(false), next: { revalidate: 60 } });
  if (!r.ok) throw new Error(`Failed to fetch ${filePath} at ${sha}`);
  return await r.text();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sha = searchParams.get("sha");
    const limit = Number(searchParams.get("limit") || "20");

    if (sha) {
      // Try JSON first
      try {
        const jsonContent = await getFileAtCommit(sha, "issues.json");
        const parsed = JSON.parse(jsonContent);
        return NextResponse.json({ sha, file: "issues.json", json: parsed });
      } catch {
        // Fallback to README.md (raw text)
        const content = await getFileAtCommit(sha, "README.md");
        return NextResponse.json({ sha, file: "README.md", content });
      }
    }

    const commits = await getCommits(limit);
    return NextResponse.json({ commits });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}


