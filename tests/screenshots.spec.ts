import fs from "node:fs";
import path from "node:path";
import { test, type Page } from "@playwright/test";

/**
 * Visual review capture, not an assertion suite.
 * Run: SHOTS_DIR=/some/dir npm run screenshots
 * Writes <SHOTS_DIR>/<width>/{reduced,motion}-<page>-full.png and -<page>-section-<id>.png.
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

const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

const MODES = [
  { name: "reduced", reducedMotion: "reduce" as const, settle: 400 },
  { name: "motion", reducedMotion: "no-preference" as const, settle: 3000 },
];

async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  });
}

for (const viewport of WIDTHS) {
  for (const mode of MODES) {
    test(`capture ${viewport.width}px ${mode.name}`, async ({ browser }) => {
      test.setTimeout(900_000);
      const dir = path.join(OUT, String(viewport.width));
      fs.mkdirSync(dir, { recursive: true });

      const context = await browser.newContext({ viewport, reducedMotion: mode.reducedMotion });
      const page = await context.newPage();
      for (const route of ROUTES) {
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await revealAll(page);
        await page.waitForTimeout(mode.settle);

        // The sticky navbar would otherwise sit on top of every section capture.
        const hideHeader = await page.addStyleTag({ content: "body > header, header[class*='sticky'] { visibility: hidden !important; }" });
        const ids = await page.locator("section[id]").evaluateAll((els) => els.map((el) => el.id));
        for (const id of ids) {
          const section = page.locator(`section[id="${id}"]`);
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(mode.settle);
          await section.screenshot({ path: path.join(dir, `${mode.name}-${route.name}-section-${id}.png`) });
        }
        await hideHeader.evaluate((el) => (el as HTMLElement).remove());

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
