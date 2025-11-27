import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

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

  if (!(key in allowed)) {
    throw { status: 400, message: `Unsupported file key: ${key}` };
  }

  const filePath = allowed[key];

  // Extra safety: ensure file exists and is readable
  try {
    await fs.access(filePath, fsConstants.R_OK);
  } catch {
    throw { status: 404, message: `File not found or not readable: ${filePath}` };
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
    // Use request.nextUrl when available (Next.js Request)
    const searchParams = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
    const key = searchParams.get("file");

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

