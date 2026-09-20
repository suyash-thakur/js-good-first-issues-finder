import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/** max file size allowed to return (in bytes). Adjust as needed. */
const MAX_FILE_BYTES = 1_200_000; // ~1.2 MB

/** Return allowed paths mapping (kept in function for easy extraction later) */
function getAllowedPaths(): Record<string, string> {
  const cwd = process.cwd();
  return {
    "index.js": path.resolve(cwd, "..", "..", "index.js"),
    "api-issues": path.resolve(cwd, "app", "api", "issues", "route.ts"),
    "api-history": path.resolve(cwd, "app", "api", "history", "route.ts"),
  };
}

/** Standard successful JSON response */
function jsonSuccess(payload: unknown, status = 200) {
  return NextResponse.json({ success: true, data: payload }, { status });
}

/** Standard error JSON response */
function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Validate requested key and return resolved file path or throw with status/message */
async function validateKey(key: string | null, allowed: Record<string, string>) {
  if (!key) {
    throw { status: 400, message: "Missing 'file' query parameter" };
  }

  const normalizedKey = key.trim();
  if (!normalizedKey) {
    throw { status: 400, message: "Empty 'file' query parameter" };
  }

  if (!(normalizedKey in allowed)) {
    throw { status: 400, message: `Unsupported file key: ${normalizedKey}` };
  }

  const filePath = allowed[normalizedKey];

  // Ensure file exists and is readable
  try {
    await fs.access(filePath, fsConstants.R_OK);
  } catch {
    throw { status: 404, message: `File not found or not readable: ${filePath}` };
  }

  // Optional: check file size to avoid returning huge files
  try {
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_BYTES) {
      throw { status: 413, message: `File too large to return (${stats.size} bytes)` };
    }
  } catch (e: any) {
    // if fs.stat failed for other reason, surface as 500
    if (e && typeof e === "object" && "status" in e) throw e;
    // else keep going (or throw generic)
  }

  return filePath;
}

/** Read the file content (utf-8) */
async function readFileContent(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

export async function GET(request: NextRequest) {
  const allowed = getAllowedPaths();

  try {
    // Prefer request.nextUrl when available (Next.js runtime), fallback to URL()
    const searchParams = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
    const rawKey = searchParams.get("file");
    const key = rawKey ? rawKey.trim() : null;

    const filePath = await validateKey(key, allowed);
    const content = await readFileContent(filePath);

    return jsonSuccess({ file: key, path: filePath, content });
  } catch (err: any) {
    // If we threw an object with status/message, respect it
    if (err && typeof err === "object" && "status" in err) {
      const status = Number(err.status) || 500;
      const message = String(err.message ?? "Unknown error");
      return jsonError(message, status);
    }

    // Fallback generic error
    return jsonError(err?.message ? String(err.message) : "Unknown server error", 500);
  }
}

