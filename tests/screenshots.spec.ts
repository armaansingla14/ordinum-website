import fs from "node:fs";
import path from "node:path";
import { test, type Page } from "@playwright/test";
import { ROUTES as SITE_ROUTES } from "./routes";

/**
 * Visual review capture, not an assertion suite.
 * Run: SHOTS_DIR=/some/dir npm run screenshots
 * Writes <SHOTS_DIR>/<width>/:
 *   reduced-<page>-full.png                  every width
 *   reduced-<page>-section-<id>.png          1440 and 375 only
 *   motion-<page>-full.png                   1440 only
 *   <mode>-terms.png, <mode>-privacy.png, <mode>-404.png
 */
/** Every route except the legal pages (captured separately below). Name: path with "/" -> "-". */
const ALL_ROUTES = SITE_ROUTES.filter((r) => r !== "/terms" && r !== "/privacy").map((p) => ({
  name: p === "/" ? "home" : p.slice(1).replace(/\//g, "-"),
  path: p,
}));
/** Optional filters: SHOTS_ROUTES=home,products  SHOTS_WIDTHS=1440,375  SHOTS_MODES=reduced  SHOTS_EXTRAS=0 */
const ONLY_ROUTES = process.env.SHOTS_ROUTES?.split(",").map((x) => x.trim()).filter(Boolean);
const ROUTES = ONLY_ROUTES ? ALL_ROUTES.filter((r) => ONLY_ROUTES.includes(r.name)) : ALL_ROUTES;
const OUT = process.env.SHOTS_DIR ?? path.join(process.cwd(), "test-results", "screenshots");

const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
const ALL_WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const WIDTHS = process.env.SHOTS_WIDTHS
  ? ALL_WIDTHS.filter((w) => process.env.SHOTS_WIDTHS!.split(",").map(Number).includes(w))
  : ALL_WIDTHS;
const SECTION_WIDTHS = new Set<number>([1440, 375]);
const MOTION_WIDTHS = new Set<number>([1440]);

const ALL_MODES = [
  { name: "reduced", reducedMotion: "reduce" as const, settle: 300 },
  { name: "motion", reducedMotion: "no-preference" as const, settle: 3000 },
];
const MODES = process.env.SHOTS_MODES ? ALL_MODES.filter((m) => process.env.SHOTS_MODES!.split(",").includes(m.name)) : ALL_MODES;
const EXTRAS = process.env.SHOTS_EXTRAS !== "0";

async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
  });
}

for (const width of WIDTHS) {
  for (const mode of MODES) {
    if (mode.name === "motion" && !MOTION_WIDTHS.has(width)) continue;
    const sections = mode.name === "reduced" && SECTION_WIDTHS.has(width);

    test(`capture ${width}px ${mode.name}`, async ({ browser }) => {
      test.setTimeout(900_000);
      const dir = path.join(OUT, String(width));
      fs.mkdirSync(dir, { recursive: true });

      const context = await browser.newContext({ viewport: { width, height: HEIGHT[width] }, reducedMotion: mode.reducedMotion });
      const page = await context.newPage();
      for (const route of ROUTES) {
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await revealAll(page);
        await page.waitForTimeout(mode.settle);

        if (sections) {
          // The sticky navbar would otherwise sit on top of every section capture.
          const hideHeader = await page.addStyleTag({
            content: "body > header, header[class*='sticky'] { visibility: hidden !important; }",
          });
          const ids = await page.locator("section[id]").evaluateAll((els) => els.map((el) => el.id));
          for (const id of ids) {
            const section = page.locator(`section[id="${id}"]`).first();
            await section.scrollIntoViewIfNeeded();
            await page.waitForTimeout(mode.settle);
            await section.screenshot({ path: path.join(dir, `${mode.name}-${route.name}-section-${id}.png`) });
          }
          await hideHeader.evaluate((el) => (el as HTMLElement).remove());
        }

        // Full page last: every once-only reveal has fired by now.
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(mode.settle);
        await page.screenshot({ path: path.join(dir, `${mode.name}-${route.name}-full.png`), fullPage: true });
      }

      for (const legal of EXTRAS ? ["terms", "privacy"] : []) {
        await page.goto(`/${legal}`, { waitUntil: "networkidle" });
        await page.screenshot({ path: path.join(dir, `${mode.name}-${legal}.png`), fullPage: true });
      }
      if (EXTRAS) {
        await page.goto("/nope-404", { waitUntil: "networkidle" });
        await page.waitForTimeout(mode.settle);
        await page.screenshot({ path: path.join(dir, `${mode.name}-404.png`), fullPage: true });
      }

      await context.close();
    });
  }
}
