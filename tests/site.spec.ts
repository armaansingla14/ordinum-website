import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };

const ROUTES = ["/", "/product", "/technology", "/research", "/vision", "/about", "/contact", "/terms"] as const;
const NAV = ["/product", "/technology", "/research", "/vision", "/about"] as const;

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
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

for (const width of WIDTHS) {
  test.describe(`pages @ ${width}px`, () => {
    test.use({ viewport: { width, height: HEIGHT[width] } });

    for (const route of ROUTES) {
      test(`${route}: 200, one h1, no console errors, no horizontal overflow`, async ({ page }) => {
        const errors = collectConsoleErrors(page);
        const response = await page.goto(route, { waitUntil: "networkidle" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await scrollThrough(page);
        await page.waitForTimeout(200);

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
          return { docScroll: document.documentElement.scrollWidth, bodyScroll: document.body.scrollWidth, vw, offenders };
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
  expect(hrefs).toEqual([...NAV]);

  for (const href of hrefs) {
    await page.locator(`header nav[aria-label='Primary'] a[href='${href}']`).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(`header nav[aria-label='Primary'] a[href='${href}']`)).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.locator("header nav[aria-label='Primary'] a[aria-current='page']")).toHaveCount(1);
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

test("cross-page deep links land on an existing id", async ({ page }) => {
  const targets = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page
      .locator("a[href^='/'][href*='#']")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    hrefs.forEach((h) => targets.add(h));
  }
  for (const target of targets) {
    const [path, id] = target.split("#");
    await page.goto(path || "/");
    await expect(page.locator(`[id="${id}"]`), target).toHaveCount(1);
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
  for (const [hash, url] of [
    ["research", /\/research$/],
    ["contact", /\/contact$/],
    ["product", /\/product$/],
    ["why-ordinum", /\/product#why-ordinum$/],
    ["stack", /\/technology#architecture$/],
    ["vision", /\/vision#vision$/],
    ["why-now", /\/vision$/],
    ["about", /\/about$/],
  ] as const) {
    await page.goto(`/#${hash}`);
    await expect(page, hash).toHaveURL(url);
  }
  // The legacy /problem redirect lands on the home Problem section and stays there.
  await page.goto("/problem");
  await expect(page).toHaveURL(/\/#problem$/);
  await expect(page.locator("#problem")).toHaveCount(1);
});

test("unknown route returns 404", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
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

test("contact form exposes the new optional fields with labels", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#contact-form form");
  await expect(form).toHaveCount(1);
  for (const name of ["email", "technologyCategory", "requestType", "hardestFailure"]) {
    const field = form.locator(`[name='${name}']`);
    await expect(field, name).toHaveCount(1);
    const id = await field.getAttribute("id");
    expect(id, name).toBeTruthy();
    await expect(form.locator(`label[for='${id}']`), name).toHaveCount(1);
  }
  await expect(form.locator("[name='email']")).toHaveAttribute("required", "");
  for (const name of ["technologyCategory", "requestType", "hardestFailure"]) {
    await expect(form.locator(`[name='${name}']`)).not.toHaveAttribute("required", "");
  }
});

test("pending co-founder profile is not published", async ({ page }) => {
  await page.goto("/about");
  // Both co-founders are named; Aarav's personal profile card stays hidden until the founder confirms it.
  await expect(page.locator("main")).toContainText("Aarav Singla");
  // Only the confirmed founder profile links to a personal LinkedIn page.
  const personal = await page
    .locator("main a[href*='linkedin.com/in/']")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(personal.every((href) => href.includes("linkedin.com/in/armaansingla"))).toBe(true);
});
