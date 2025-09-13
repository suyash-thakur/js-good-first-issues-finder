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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("file");
    if (!key || !(key in ALLOWED)) {
      return NextResponse.json({ error: "Unsupported file key" }, { status: 400 });
    }
    const filePath = ALLOWED[key];
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json({ file: key, path: filePath, content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}


