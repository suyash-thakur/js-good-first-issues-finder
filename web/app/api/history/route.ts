import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

// Root of the monorepo is two levels up from this file's directory
const REPO_ROOT = path.resolve(process.cwd(), "..");

async function getCommits(limit: number = 20) {
  // Prefer commits that touch issues.json; fallback includes README.md
  // Format: <sha>;<iso-date>;<subject>
  const { stdout } = await execFileAsync("git", [
    "-C",
    REPO_ROOT,
    "log",
    "-n",
    String(limit),
    "--pretty=format:%H;%cI;%s",
    "--",
    "issues.json",
    "README.md",
  ]);
  return stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, date, subject] = line.split(";");
      return { sha, date, subject };
    });
}

async function getFileAtCommit(sha: string, filePath: string) {
  const { stdout } = await execFileAsync("git", ["-C", REPO_ROOT, "show", `${sha}:${filePath}`]);
  return stdout;
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
        // Fallback to README.md
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


