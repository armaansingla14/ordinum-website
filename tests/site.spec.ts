import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

for (const viewport of WIDTHS) {
  test.describe(`home @ ${viewport.width}px`, () => {
    test.use({ viewport });

    test("renders without console errors or horizontal overflow", async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const response = await page.goto("/", { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await scrollThrough(page);
      await page.waitForTimeout(500);

      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed";
          })
          .filter((el) => !el.closest("[data-allow-overflow], [aria-hidden='true'], .sr-only"))
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)}`);
        return {
          docScroll: document.documentElement.scrollWidth,
          bodyScroll: document.body.scrollWidth,
          vw,
          offenders,
        };
      });
      expect(overflow.docScroll, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.vw);
      expect(overflow.bodyScroll, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.vw);
      expect(errors).toEqual([]);
    });
  });
}

test("every in-page anchor resolves to an element id", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() => {
    const hrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("#") || h.startsWith("/#"))
      .map((h) => h.replace(/^\/?#/, ""))
      .filter(Boolean);
    return Array.from(new Set(hrefs)).filter((id) => !document.getElementById(id));
  });
  expect(missing).toEqual([]);
});

test("primary nav links point at existing sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const ids = await page
    .locator("header nav a[href^='#']")
    .evaluateAll((links) => links.map((a) => (a.getAttribute("href") ?? "").slice(1)));
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) {
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
});

test("legacy /about redirects to /#about", async ({ page, request }) => {
  const res = await request.get("/about", { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(res.status());
  expect(res.headers()["location"]).toBe("/#about");

  await page.goto("/about");
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeVisible();
});

test("unknown route returns 404", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The browser logs the 404 document response itself; ignore that line only.
  expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
});

test("/terms renders", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  const res = await page.goto("/terms");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Service" })).toBeVisible();
  await expect(page.locator("header")).toBeVisible();
  await expect(page.getByRole("contentinfo").last()).toBeVisible();
  expect(errors).toEqual([]);
});
