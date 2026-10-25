import { expect, test, type Page } from "@playwright/test";
import { demoWalkthrough, legal, nav, pages, site } from "../lib/content";

const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };

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
] as const;
const NAV = ["/product", "/technology", "/research", "/vision", "/about"] as const;
const FOUNDER_LINKEDIN = ["linkedin.com/in/armaansingla", "linkedin.com/in/aaravsinglaa"] as const;

/**
 * Homepage copy budget. Baseline: 1600 words of main innerText on the pre-focus home page
 * (~/scratch/ordinum-focus/wordcount-before.json, generated 2026-10-25T03:10Z at 1440px with
 * reduced motion). The brief asks for a 40-50% cut, so the home page may use at most 60% of
 * that: 1600 * 0.6 = 960 words. Counting method matches the baseline script exactly.
 */
const HOME_WORD_BASELINE = 1600;
const HOME_WORD_BUDGET = Math.floor(HOME_WORD_BASELINE * 0.6); // 960

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

test("header primary CTA is 'Talk to us' and leads to /contact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect(nav.demo.label).toBe("Talk to us");
  expect(nav.demo.href.startsWith("/contact")).toBe(true);
  const cta = page.locator(`header a[href='${nav.demo.href}']`);
  await expect(cta).toBeVisible();
  await expect(cta).toContainText("Talk to us");
  await cta.click();
  await expect(page).toHaveURL(/\/contact(#talk)?$/);
  await expect(page.locator(`header a[href='${nav.demo.href}']`)).toHaveAttribute("aria-current", "page");
  // /demo is reached from the hero and CTAs, not from the primary nav.
  await expect(page.locator("header nav[aria-label='Primary'] a[href='/demo']")).toHaveCount(0);
});

test("mobile menu opens, lists the nav and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const mobileNav = page.locator("nav[aria-label='Mobile']");
  await expect(mobileNav).toBeVisible();
  const hrefs = await mobileNav.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(hrefs).toEqual([...NAV]);
  await page.keyboard.press("Escape");
  await expect(mobileNav).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("home hero links to the walkthrough and to the founders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main a[href='/demo']").first()).toBeVisible();
  await expect(page.locator("main a[href^='/contact']").first()).toBeVisible();
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

test("every page has its own canonical URL and social metadata", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
    const expected = route === "/" ? new RegExp(`^${site.url}/?$`) : new RegExp(`^${site.url}${route}$`);
    expect(canonical, route).toMatch(expected);
    for (const prop of ["og:title", "og:description", "og:image"]) {
      const content = await page.locator(`meta[property='${prop}']`).first().getAttribute("content");
      expect(content, `${route} ${prop}`).toBeTruthy();
    }
    await expect(page.locator("meta[name='twitter:card']"), route).toHaveAttribute("content", "summary_large_image");
  }
  // Inner pages must not inherit the home page's social title.
  await page.goto("/");
  const homeOg = await page.locator("meta[property='og:title']").getAttribute("content");
  await page.goto("/research");
  expect(await page.locator("meta[property='og:title']").getAttribute("content")).not.toBe(homeOg);
});

test("JSON-LD names the organization and both co-founders", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator("script[type='application/ld+json']").first().textContent();
  const data = JSON.parse(raw ?? "{}") as { "@graph": { "@type": string; founder?: { name: string }[] }[] };
  const org = data["@graph"].find((n) => n["@type"] === "Organization");
  expect(org).toBeTruthy();
  expect((org?.founder ?? []).map((f) => f.name).sort()).toEqual(["Aarav Singla", "Armaan Singla"]);
});

test("sitemap lists every public page; robots points at it", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const route of ROUTES) {
    const url = route === "/" ? site.url : `${site.url}${route}`;
    expect(xml, route).toContain(`<loc>${url}</loc>`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`${site.url}/sitemap.xml`);
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
    ["why-ordinum", /\/product$/],
    ["technology", /\/technology$/],
    ["stack", /\/technology#architecture$/],
    ["vision", /\/vision$/],
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
  await expect(page.locator("main a[href='/']").first()).toBeVisible();
  // The browser logs the 404 document response itself; ignore that line only.
  expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
});

for (const key of ["terms", "privacy"] as const) {
  test(`/${key} renders the interim legal page inside the site chrome`, async ({ page }) => {
    const res = await page.goto(pages[key].href);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: legal[key].title })).toBeVisible();
    await expect(page.locator("main")).toContainText(legal.status);
    await expect(page.locator("main")).not.toContainText("AI governance");
    await expect(page.locator("meta[name='robots'][content*='noindex']")).toHaveCount(0);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.getByRole("contentinfo").last()).toBeVisible();
  });
}

test("footer links to Terms and Privacy", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo").last();
  await expect(footer.locator("a[href='/terms']")).toHaveCount(1);
  await expect(footer.locator("a[href='/privacy']")).toHaveCount(1);
});

test("contact form: labelled short fields, optional details, privacy link", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#contact-form form");
  await expect(form).toHaveCount(1);
  const fields = ["email", "company", "workingOn", "message", "technologyCategory", "requestType"];
  for (const name of fields) {
    const field = form.locator(`[name='${name}']`);
    await expect(field, name).toHaveCount(1);
    const id = await field.getAttribute("id");
    expect(id, name).toBeTruthy();
    await expect(form.locator(`label[for='${id}']`), name).toHaveCount(1);
  }
  await expect(form.locator("[name='email']")).toHaveAttribute("required", "");
  for (const name of fields.filter((n) => n !== "email")) {
    await expect(form.locator(`[name='${name}']`), name).not.toHaveAttribute("required", "");
  }
  // The four short fields are visible without opening anything.
  for (const name of ["email", "company", "workingOn", "message"]) {
    await expect(form.locator(`[name='${name}']`), name).toBeVisible();
  }
  // Retired fields are gone.
  for (const name of ["role", "hardestFailure"]) {
    await expect(form.locator(`[name='${name}']`), name).toHaveCount(0);
  }
  await expect(form.locator("a[href='/privacy']")).toHaveCount(1);
  // Talk-to-us path is the #talk anchor on the same page.
  await expect(page.locator("#talk")).toHaveCount(1);
});

test.describe("/demo walkthrough without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every step and the evidence label are in the static HTML", async ({ page }) => {
    await page.goto("/demo");
    const text = (await page.locator("main").textContent()) ?? "";
    for (const step of demoWalkthrough.steps) expect(text, step.id).toContain(step.label);
    expect(text).toContain("not a Nav2 defect");
  });
});

test("/demo walkthrough steps are keyboard-reachable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/demo", { waitUntil: "networkidle" });
  const labels = demoWalkthrough.steps.map((s) => s.label);

  /** The single step label named by the focused element (inside main), if any. */
  const focusedStep = async () =>
    page.evaluate((all) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || !el.closest("main")) return { inMain: false, label: null as string | null, role: null as string | null };
      const name = `${el.innerText ?? ""} ${el.getAttribute("aria-label") ?? ""}`;
      const matches = all.filter((l) => name.includes(l));
      return { inMain: true, label: matches.length === 1 ? matches[0] : null, role: el.getAttribute("role") };
    }, labels);

  const reached = new Set<string>();
  for (let i = 0; i < 200 && reached.size < labels.length; i++) {
    await page.keyboard.press("Tab");
    const now = await focusedStep();
    if (now.label) reached.add(now.label);
    // Roving-tabindex tab lists and radio groups move with the arrow keys, not Tab.
    if (now.role === "tab" || now.role === "radio") {
      for (let k = 0; k < labels.length; k++) {
        await page.keyboard.press("ArrowRight");
        const next = await focusedStep();
        if (next.label) reached.add(next.label);
      }
    }
  }
  expect([...reached].sort()).toEqual([...labels].sort());
});

test("both founder profiles are published with approved LinkedIn links only", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toContainText("Armaan Singla");
  await expect(page.locator("main")).toContainText("Aarav Singla");
  const personal = await page
    .locator("main a[href*='linkedin.com/in/']")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(personal.every((href) => FOUNDER_LINKEDIN.some((ok) => href.includes(ok)))).toBe(true);
  for (const ok of FOUNDER_LINKEDIN) expect(personal.some((href) => href.includes(ok)), ok).toBe(true);
});

test.describe("home page copy budget", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test(`main text is at most ${HOME_WORD_BUDGET} words (60% of the ${HOME_WORD_BASELINE}-word baseline)`, async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const words = await page.evaluate(() => {
      const text = document.querySelector("main")?.innerText ?? "";
      // Word = whitespace-separated token containing at least one Unicode letter (same as the baseline).
      return text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
    });
    console.log(`home main words: ${words} (budget ${HOME_WORD_BUDGET}, baseline ${HOME_WORD_BASELINE})`);
    expect(words).toBeLessThanOrEqual(HOME_WORD_BUDGET);
  });
});
