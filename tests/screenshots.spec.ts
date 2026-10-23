import fs from "node:fs";
import path from "node:path";
import { test, type Page } from "@playwright/test";

/**
 * Visual review capture, not an assertion suite.
 * Run: SHOTS_DIR=/some/dir npm run screenshots
 * Writes <SHOTS_DIR>/<width>/:
 *   reduced-<page>-full.png                  every width
 *   reduced-<page>-section-<id>.png          1440 and 375 only
 *   motion-<page>-full.png                   1440 only
 *   <mode>-terms.png, <mode>-404.png
 */
const ROUTES = [
  { name: "home", path: "/" },
  { name: "product", path: "/product" },
  { name: "technology", path: "/technology" },
  { name: "research", path: "/research" },
  { name: "vision", path: "/vision" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
] as const;
const OUT = process.env.SHOTS_DIR ?? path.join(process.cwd(), "test-results", "screenshots");

const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const SECTION_WIDTHS = new Set<number>([1440, 375]);
const MOTION_WIDTHS = new Set<number>([1440]);

const MODES = [
  { name: "reduced", reducedMotion: "reduce" as const, settle: 300 },
  { name: "motion", reducedMotion: "no-preference" as const, settle: 3000 },
];

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

      await page.goto("/terms", { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(dir, `${mode.name}-terms.png`), fullPage: true });
      await page.goto("/nope-404", { waitUntil: "networkidle" });
      await page.waitForTimeout(mode.settle);
      await page.screenshot({ path: path.join(dir, `${mode.name}-404.png`), fullPage: true });

      await context.close();
    });
  }
}
