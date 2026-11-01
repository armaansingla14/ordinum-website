import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { flagshipVideo } from "../lib/content";
import { ROUTES as SITE_ROUTES } from "./routes";

/**
 * Claims guard. The withdrawn v1 benchmark numbers, unsupported replay wording and the old
 * positioning must not appear anywhere a visitor or crawler can read them: rendered text,
 * <title>, meta/OG/Twitter tags and JSON-LD. The only allowed place for v1 terms is inside an
 * element marked [data-withdrawn] (the history note in the Labs research summary).
 */

/** "Watch the demo" is allowed only while the flagship recording (lib/content.ts flagshipVideo) exists in public/. */
const VIDEO_PUBLISHED = ["mp4", "webm", "captions", "poster"].every((k) =>
  fs.existsSync(path.resolve(__dirname, "..", "public", flagshipVideo[k as "mp4"].replace(/^\//, ""))),
);

const FORBIDDEN: readonly (string | RegExp)[] = [
  "+35",
  "35%",
  "+23",
  "139.1",
  "103.1",
  "996.6",
  "807.8",
  "6/7",
  "6 → 5",
  "6→5",
  "deterministic replay",
  "identically",
  "every time",
  "Break autonomous systems",
  "coverage-guided fuzzing for autonomous systems",
  "industry-leading",
  "the first platform",
  "Not a pentest",
  // Focus pass (2026-10-24): no progress ratios, no unsupported test counts, no reuse or
  // superiority claims, no competitor comparison, no customer/partner claims.
  "parts built",
  "764",
  "reuse rate",
  "beats random",
  "better than random",
  "Antithesis",
  "our customers",
  "design partners include",
  // Release (2026-11-01): reviews were by separate AI review agents, never "independent review";
  // transactions are a roadmap entry only (no treasury numbers, no M17 milestone).
  "independent review",
  "independently reviewed",
  "treasury",
  /(?<![\w.])M17(?!\w|\.\d)/,
  // Copy pass (2026-11-01): the only test figure is TEST_SUITE_STATUS (2229 passed, 32 skipped);
  // no "independent checks" (they are ground-truth checks); no stale recording, CI or bridge
  // status; no meta or self-congratulatory headings.
  "523 passed",
  "523 tests",
  "1 skipped",
  "independent check",
  "recording is in production",
  "Recording in production",
  "passes review",
  "edge bridge is still in progress",
  "no hosted CI",
  "Honest status",
  "labeled for what",
  "Limitations included",
  "Each with its own status",
  "Three integrations, three boundaries",
  "How results are produced and labeled",
  "Research and case studies, with their evidence",
  "command by command",
  "Agent authority and resource effects",
  "Targets run with no network or loopback only",
  // No video until a reviewed recording exists.
  ...(VIDEO_PUBLISHED ? [] : ["Watch the demo", "watch the video"]),
];

/**
 * Rendered-only rules (body text, attributes, <title>, meta and JSON-LD). Not applied to source
 * files: code comments and the verbatim recording transcript in public/media may use them.
 */
const FORBIDDEN_RENDERED: readonly (string | RegExp)[] = [
  // No em dashes in visible copy, titles, OG text or aria labels.
  "\u2014",
];

const ROUTES = [...SITE_ROUTES, "/no-such-page"];

/** Bare numbers ("764") only match as whole tokens, so hex trace ids and SVG path data don't trip them. */
const BARE_NUMBER = /^\d+$/;

function hits(text: string, terms: readonly (string | RegExp)[] = FORBIDDEN): string[] {
  const lower = text.toLowerCase();
  return terms.filter((term) =>
    term instanceof RegExp
      ? term.test(text)
      : BARE_NUMBER.test(term)
        ? new RegExp(`(?<![\\w.,])${term}(?!\\w|\\.\\d)`).test(text)
        : lower.includes(term.toLowerCase()),
  ).map(String);
}

for (const route of ROUTES) {
  test(`claims: ${route} body and head contain no withdrawn or forbidden claims`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const body = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-withdrawn], script, style").forEach((el) => el.remove());
      // textContent (not innerText) so visually hidden / collapsed text is checked too.
      const attrs = Array.from(clone.querySelectorAll<HTMLElement>("[aria-label], [alt], [title]"))
        .map((el) => [el.getAttribute("aria-label"), el.getAttribute("alt"), el.getAttribute("title")].join(" "))
        .join(" ");
      return `${clone.textContent ?? ""} ${attrs}`;
    });
    expect(hits(body), `${route} body`).toEqual([]);
    expect(hits(body, FORBIDDEN_RENDERED), `${route} body (rendered-only rules)`).toEqual([]);

    const head = await page.evaluate(() => {
      const meta = Array.from(document.querySelectorAll("meta[content]"))
        .map((m) => m.getAttribute("content") ?? "")
        .join("\n");
      const ld = Array.from(document.querySelectorAll("script[type='application/ld+json']"))
        .map((s) => s.textContent ?? "")
        .join("\n");
      return `${document.title}\n${meta}\n${ld}`;
    });
    expect(hits(head), `${route} head`).toEqual([]);
    expect(hits(head, FORBIDDEN_RENDERED), `${route} head (rendered-only rules)`).toEqual([]);
  });
}

test("claims: sitemap, robots and manifest-like text routes are clean", async ({ request }) => {
  for (const route of ["/sitemap.xml", "/robots.txt"]) {
    const res = await request.get(route);
    expect(res.status()).toBe(200);
    expect(hits(await res.text()), route).toEqual([]);
  }
});

test("claims: source files contain no withdrawn or forbidden claims", () => {
  const root = path.resolve(__dirname, "..");
  const dirs = ["app", "components", "lib", "public"];
  const exts = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md", ".svg", ".txt", ".html", ".xml"]);
  const offenders: string[] = [];
  // public/evidence holds verbatim, founder-exported product artifacts (scanned for secrets by the
  // export script, never edited by hand); they are checked by their own test, not by this copy guard.
  const SKIP = new Set([path.join(root, "public", "evidence")]);
  const walk = (dir: string) => {
    if (!fs.existsSync(dir) || SKIP.has(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.has(path.extname(entry.name))) {
        // Tailwind gradient stops like `transparent_35%` are CSS, not claims.
        const text = fs.readFileSync(full, "utf8").replace(/_35%/g, "");
        for (const term of hits(text)) offenders.push(`${path.relative(root, full)}: ${term}`);
      }
    }
  };
  dirs.forEach((d) => walk(path.join(root, d)));
  expect(offenders).toEqual([]);
});

/** Personal LinkedIn profiles approved for publication (both co-founders, approved 2026-10-24). */
const APPROVED_PROFILES = ["armaansingla", "aaravsinglaa"] as const;

test("claims: client JavaScript links only to approved founder LinkedIn profiles", () => {
  const root = path.resolve(__dirname, "..", ".next", "static");
  expect(fs.existsSync(root), "run `npm run build` first").toBe(true);
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|css|json|html|txt)$/.test(entry.name)) {
        const text = fs.readFileSync(full, "utf8");
        const personal = text.match(/linkedin\.com\/in\/[A-Za-z0-9_-]+/g) ?? [];
        for (const link of personal) {
          const handle = link.split("/").pop() ?? "";
          if (!(APPROVED_PROFILES as readonly string[]).includes(handle)) offenders.push(`${entry.name}: ${link}`);
        }
      }
    }
  };
  walk(root);
  expect(offenders).toEqual([]);
});
