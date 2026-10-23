import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

const ROUTES = ["/", "/product", "/technology", "/research", "/vision", "/about", "/contact", "/terms"] as const;

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
  test.describe(`pages @ ${viewport.width}px`, () => {
    test.use({ viewport });

    for (const route of ROUTES) {
      test(`${route}: one h1, no console errors, no horizontal overflow`, async ({ page }) => {
        const errors = collectConsoleErrors(page);
        const response = await page.goto(route, { waitUntil: "networkidle" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await scrollThrough(page);
        await page.waitForTimeout(300);

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
    }
  });
}

test("primary nav links open their pages and mark the current one", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const hrefs = await page
    .locator("header nav[aria-label='Primary'] a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(hrefs).toEqual(["/product", "/technology", "/research", "/vision", "/about"]);

  for (const href of hrefs) {
    await page.locator(`header nav[aria-label='Primary'] a[href='${href}']`).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(`header nav[aria-label='Primary'] a[href='${href}']`)).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("every same-page anchor resolves to an element id", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const missing = await page.evaluate(() => {
      const hrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='#']"))
        .map((a) => (a.getAttribute("href") ?? "").slice(1))
        .filter(Boolean);
      return Array.from(new Set(hrefs)).filter((id) => !document.getElementById(id));
    });
    expect(missing, route).toEqual([]);
  }
});

test("legacy routes redirect to their new pages", async ({ request }) => {
  for (const [from, to] of [
    ["/solution", "/product"],
    ["/how-it-works", "/technology"],
    ["/problem", "/#problem"],
  ] as const) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([301, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toBe(to);
  }
});

test("old single-page hash links forward to the new pages", async ({ page }) => {
  await page.goto("/#research");
  await expect(page).toHaveURL(/\/research$/);
  await page.goto("/#contact");
  await expect(page).toHaveURL(/\/contact$/);
});

test("unknown route returns 404", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The browser logs the 404 document response itself; ignore that line only.
  expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
});

test("/terms renders inside the site chrome", async ({ page }) => {
  const res = await page.goto("/terms");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Service" })).toBeVisible();
  await expect(page.locator("header").first()).toBeVisible();
  await expect(page.getByRole("contentinfo").last()).toBeVisible();
});
