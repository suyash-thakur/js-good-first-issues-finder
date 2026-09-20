import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Only allow reading a small, explicit set of files needed for the docs page
const ALLOWED: Record<string, string> = {
  "index.js": path.resolve(process.cwd(), "..", "..", "index.js"),
  "api-issues": path.resolve(process.cwd(), "app", "api", "issues", "route.ts"),
  "api-history": path.resolve(process.cwd(), "app", "api", "history", "route.ts"),
};


function validateKey(searchParams: URLSearchParams): string | null {
  const key = searchParams.get("file");
  if (!key || !(key in ALLOWED_FILES)) {
    return null;
  }
  return key;
};

async function readAllowedFile(key: string): Promise<{ filePath: string; content: string }> {
  const filePath = ALLOWED_FILES[key];
  const content = await fs.readFile(filePath, "utf-8");
  return { filePath, content };
};

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ error: message }, { status: 500 });
};


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = validatekey(searchParams);
    if (!key ) {
      return NextResponse.json({ error: "Unsupported file key" }, { status: 400 });
    }
    const { filePath, content } = await readAllowedFile(key);
    return NextResponse.json({ file: key, path: filePath, content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
