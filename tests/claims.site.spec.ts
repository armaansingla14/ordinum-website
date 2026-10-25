import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Claims guard. The withdrawn v1 benchmark numbers, unsupported replay wording and the old
 * positioning must not appear anywhere a visitor or crawler can read them: rendered text,
 * <title>, meta/OG/Twitter tags and JSON-LD. The only allowed place for v1 terms is inside an
 * element marked [data-withdrawn] (the history note on /research).
 */
const FORBIDDEN = [
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
  // superiority claims, no competitor comparison, no customer/partner claims, no video yet.
  "parts built",
  "764",
  "reuse rate",
  "beats random",
  "better than random",
  "Antithesis",
  "our customers",
  "design partners include",
  "Watch the demo",
] as const;

const ROUTES = [
  "/",
  "/demo",
  "/product",
  "/technology",
  "/research",
  "/vision",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/no-such-page",
];

/** Bare numbers ("764") only match as whole tokens, so hex trace ids and SVG path data don't trip them. */
const BARE_NUMBER = /^\d+$/;

function hits(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN.filter((term) =>
    BARE_NUMBER.test(term)
      ? new RegExp(`(?<![\\w.,])${term}(?!\\w|\\.\\d)`).test(text)
      : lower.includes(term.toLowerCase()),
  );
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
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
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
