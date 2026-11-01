import "server-only";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Build-time lookup of published evidence files in public/evidence/<slug>/<name>.
 * Pages are static, so this runs once per build: a file is linked only if it exists then, and its
 * SHA-256 is computed from the bytes that will be served. Missing files return null, and the
 * page shows "Artifact pending publication" instead of a link.
 */

export type PublishedFile = {
  readonly href: string;
  readonly bytes: number;
  readonly sha256: string;
};

const ROOT = path.join(process.cwd(), "public", "evidence");
const SAFE = /^[A-Za-z0-9._-]+$/;

export function publishedFile(slug: string, name: string): PublishedFile | null {
  if (!SAFE.test(slug) || !SAFE.test(name)) return null;
  const full = path.join(ROOT, slug, name);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return null;
  const data = fs.readFileSync(full);
  return {
    href: `/evidence/${slug}/${name}`,
    bytes: data.byteLength,
    sha256: createHash("sha256").update(data).digest("hex"),
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KiB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MiB`;
}
