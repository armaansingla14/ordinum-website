import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { AI_METHODS_NOTE, flagshipVideo, demoWalkthrough, legal, nav, pages, site, type NavEntry, type NavGroup } from "../lib/content";
import { PENDING_LABEL, evidencePackages } from "../lib/evidence-packages";
import { labsArticles, labsInPreparation } from "../lib/labs";
import { REDIRECTS, ROUTES } from "./routes";

const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };

const ENTRIES = nav.entries as readonly NavEntry[];
const GROUPS = ENTRIES.filter((e): e is NavGroup => e.kind === "group");
const PRODUCTS = GROUPS.find((g) => g.id === "products")!;
const WALKTHROUGH = "/demos/nav2-walkthrough";
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

test("primary nav: Products, Demos, Ordinum Labs, Resources, Company in order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const primary = page.locator("header nav[aria-label='Primary']");
  const top = await primary.locator(":scope > ul > li > a, :scope > ul > li > button").allInnerTexts();
  expect(top.map((t) => t.trim().toLowerCase())).toEqual(ENTRIES.map((e) => e.label.toLowerCase()));
  // Plain links go straight to their pages and mark the current one.
  for (const entry of ENTRIES.filter((e) => e.kind === "link")) {
    await primary.locator(`a[href='${entry.href}']`).click();
    await expect(page).toHaveURL(new RegExp(`${entry.href}$`));
    await expect(primary.locator(`a[href='${entry.href}']`)).toHaveAttribute("aria-current", "page");
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("Products disclosure: keyboard open, Escape closes and returns focus, not hover-only", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const button = page.locator("header nav[aria-label='Primary'] button", { hasText: PRODUCTS.label });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  const panelId = await button.getAttribute("aria-controls");
  expect(panelId).toBeTruthy();
  const panel = page.locator(`[id="${panelId}"]`);

  // Hover alone does not open it.
  await button.hover();
  await page.waitForTimeout(150);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();

  // Enter opens; every item has a description and (for products) a maturity label.
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  const hrefs = await panel.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(hrefs).toEqual(PRODUCTS.items.map((i) => i.href));
  for (const item of PRODUCTS.items) {
    const link = panel.locator(`a[href='${item.href}']`);
    await expect(link).toContainText(item.description);
    if (item.maturity) await expect(link).toContainText(/Built & validated|Built, experimental|In progress|Planned/);
  }

  // Escape closes and returns focus to the button.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();

  // Space opens too; a click outside closes.
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.mouse.click(700, 700);
  await expect(button).toHaveAttribute("aria-expanded", "false");

  // Focus leaving the group closes it.
  await button.click();
  await expect(panel).toBeVisible();
  for (let i = 0; i < PRODUCTS.items.length + 1; i++) await page.keyboard.press("Tab");
  await expect(button).toHaveAttribute("aria-expanded", "false");

  // Following a link closes the panel and marks the item current on the new route.
  await button.click();
  await panel.locator("a[href='/products/software']").click();
  await expect(page).toHaveURL(/\/products\/software$/);
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await expect(panel.locator("a[href='/products/software']")).toHaveAttribute("aria-current", "page");
});

test("every nav group opens and lists its destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const group of GROUPS) {
    const button = page.locator("header nav[aria-label='Primary'] button", { hasText: group.label });
    await button.click();
    const panel = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
    const hrefs = await panel.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs, group.id).toEqual(group.items.map((i) => i.href));
    await page.keyboard.press("Escape");
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
});

test("mobile menu: accordion sections, focus trap, Escape closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNav = page.locator("nav[aria-label='Mobile']");
  await expect(mobileNav).toBeVisible();

  // Top level: direct links plus one accordion button per group, all collapsed on the home page.
  for (const entry of ENTRIES) {
    if (entry.kind === "link") await expect(mobileNav.locator(`a[href='${entry.href}']`)).toBeVisible();
    else await expect(mobileNav.getByRole("button", { name: entry.label })).toHaveAttribute("aria-expanded", "false");
  }

  const products = mobileNav.getByRole("button", { name: PRODUCTS.label });
  await products.click();
  await expect(products).toHaveAttribute("aria-expanded", "true");
  const section = page.locator(`[id="${await products.getAttribute("aria-controls")}"]`);
  await expect(section).toBeVisible();
  const hrefs = await section.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
  expect(hrefs).toEqual(PRODUCTS.items.map((i) => i.href));
  await products.click();
  await expect(section).toBeHidden();

  // Focus stays inside the toggle + sheet.
  const sheetId = await page.getByRole("button", { name: "Close menu" }).getAttribute("aria-controls");
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate((id) => {
      const el = document.activeElement;
      const sheet = id ? document.getElementById(id) : null;
      return !!el && (el.getAttribute("aria-controls") === id || !!sheet?.contains(el));
    }, sheetId);
    expect(inside, `tab ${i}`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(mobileNav).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("mobile menu opens the section that owns the current page", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/products/robotics");
  await page.getByRole("button", { name: "Open menu" }).click();
  const products = page.locator("nav[aria-label='Mobile']").getByRole("button", { name: PRODUCTS.label });
  await expect(products).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("nav[aria-label='Mobile'] a[href='/products/robotics']")).toHaveAttribute("aria-current", "page");
  await page.locator("nav[aria-label='Mobile'] a[href='/products/agents']").click();
  await expect(page).toHaveURL(/\/products\/agents$/);
  await expect(page.locator("nav[aria-label='Mobile']")).toHaveCount(0);
});

test("home hero: 'Watch the demo' -> the flagship recording and 'Talk to us'", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero.locator("a[href='/demos#demo-flagship']")).toContainText("Watch the demo");
  await expect(hero.locator("a[href='/contact#talk']")).toContainText("Talk to us");
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

test("no internal link points at a missing or redirecting route", async ({ page, request }) => {
  const targets = new Map<string, string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (href.startsWith("//")) continue;
      const pathOnly = href.split("#")[0].split("?")[0] || "/";
      if (!targets.has(pathOnly)) targets.set(pathOnly, route);
    }
  }
  expect(targets.size).toBeGreaterThanOrEqual(ROUTES.length - 2);
  for (const [target, from] of targets) {
    const res = await request.get(target, { maxRedirects: 0 });
    expect(res.status(), `${target} (linked from ${from})`).toBe(200);
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

test("titles: home is exactly 'Ordinum'; every other page ends ' | Ordinum'", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const title = await page.title();
    if (route === "/") expect(title).toBe("Ordinum");
    else {
      expect(title, route).toMatch(/ \| Ordinum$/);
      expect(title, route).not.toBe(" | Ordinum");
    }
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
    await expect(page.locator("meta[property='og:site_name']"), route).toHaveAttribute("content", "Ordinum");
    await expect(page.locator("meta[name='twitter:card']"), route).toHaveAttribute("content", "summary_large_image");
  }
  // Inner pages must not inherit the home page's social title.
  await page.goto("/");
  const homeOg = await page.locator("meta[property='og:title']").getAttribute("content");
  await page.goto("/labs");
  expect(await page.locator("meta[property='og:title']").getAttribute("content")).not.toBe(homeOg);
});

test("JSON-LD: one Organization + WebSite graph, both co-founders, no ordinum.ai", async ({ page }) => {
  await page.goto("/");
  const scripts = page.locator("script[type='application/ld+json']");
  await expect(scripts).toHaveCount(1);
  const raw = (await scripts.first().textContent()) ?? "{}";
  expect(raw).not.toContain("ordinum.ai");
  const data = JSON.parse(raw) as { "@graph": { "@type": string; url?: string; founder?: { name: string }[] }[] };
  expect(data["@graph"].map((n) => n["@type"]).sort()).toEqual(["Organization", "WebSite"]);
  const org = data["@graph"].find((n) => n["@type"] === "Organization");
  expect(org?.url).toBe(`${site.url}/`);
  expect((org?.founder ?? []).map((f) => f.name).sort()).toEqual(["Aarav Singla", "Armaan Singla"]);
});

test("sitemap lists every public page and no redirected URL; robots points at it", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const route of ROUTES) {
    const url = route === "/" ? site.url : `${site.url}${route}`;
    expect(xml, route).toContain(`<loc>${url}</loc>`);
  }
  for (const [from] of REDIRECTS) {
    if (from === "/problem") continue;
    expect(xml, from).not.toContain(`<loc>${site.url}${from}</loc>`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`${site.url}/sitemap.xml`);
});

test("old routes redirect in one hop to their final pages", async ({ request }) => {
  for (const [from, to] of REDIRECTS) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(308);
    expect(res.headers()["location"], from).toBe(to);
    const next = await request.get(to.split("#")[0], { maxRedirects: 0 });
    expect(next.status(), `${from} -> ${to}`).toBe(200);
  }
});

test("old single-page hash links forward to the new pages", async ({ page }) => {
  for (const [hash, url] of [
    ["research", /\/labs\/research-summary$/],
    ["contact", /\/contact$/],
    ["product", /\/products$/],
    ["why-ordinum", /\/products$/],
    ["technology", /\/products#architecture$/],
    ["stack", /\/products#architecture$/],
    ["vision", /\/roadmap$/],
    ["why-now", /\/roadmap#why-now$/],
    ["about", /\/about$/],
  ] as const) {
    await page.goto(`/#${hash}`);
    await expect(page, hash).toHaveURL(url);
  }
});

test("evidence packages link only published files, and each matches its SHA-256", async ({ page, request }) => {
  for (const pkg of evidencePackages) {
    await page.goto(`/evidence/${pkg.slug}`);
    const main = page.locator("main");
    await expect(main).toContainText(pkg.label);
    for (const file of pkg.files) {
      const local = path.resolve(__dirname, "..", "public", "evidence", pkg.slug, file.name);
      const link = main.locator(`a[href='/evidence/${pkg.slug}/${file.name}']`);
      if (fs.existsSync(local)) {
        await expect(link, file.name).toHaveCount(1);
        const res = await request.get(`/evidence/${pkg.slug}/${file.name}`);
        expect(res.status(), file.name).toBe(200);
        const sha = createHash("sha256").update(await res.body()).digest("hex");
        await expect(main, file.name).toContainText(sha);
      } else {
        await expect(link, file.name).toHaveCount(0);
      }
    }
    const missing = pkg.files.filter((f) => !fs.existsSync(path.resolve(__dirname, "..", "public", "evidence", pkg.slug, f.name)));
    await expect(main.locator("[data-pending]")).toHaveCount(missing.length);
    if (missing.length) await expect(main).toContainText(PENDING_LABEL);
  }
});

test("/demos: flagship card plays the recorded run with captions, labeled before playback", async ({ page, request }) => {
  await page.goto("/demos");
  const main = page.locator("main");
  const card = main.locator("#demo-flagship");
  await expect(card).toContainText("not a PocketBase bug");
  await expect(card).toContainText("10/10 vs 0/10");
  await expect(card).toContainText(flagshipVideo.duration);
  const video = card.locator("video");
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("autoplay", /.*/);
  await expect(card.locator("track[kind='captions']")).toHaveAttribute("src", flagshipVideo.captions);
  for (const src of [flagshipVideo.mp4, flagshipVideo.webm, flagshipVideo.poster, flagshipVideo.captions, flagshipVideo.transcript]) {
    const res = await request.get(src);
    expect(res.status(), src).toBe(200);
  }
  const vtt = await (await request.get(flagshipVideo.captions)).text();
  expect(vtt.startsWith("WEBVTT")).toBe(true);
  // The recording actually decodes and has the advertised length.
  const duration = await video.evaluate(async (el: HTMLVideoElement) => {
    el.preload = "metadata";
    el.load();
    await new Promise((r) => el.addEventListener("loadedmetadata", r, { once: true }));
    return el.duration;
  });
  expect(duration).toBeGreaterThan(90);
  expect(duration).toBeLessThan(100);
  await expect(main.locator(`a[href='${WALKTHROUGH}']`).first()).toBeVisible();
  await expect(main.locator("a[href='/evidence/testbed-planted-control']").first()).toBeVisible();
});

test("Labs: articles carry author, date, methods note and evidence links; in-preparation titles have no link", async ({ page }) => {
  for (const article of labsArticles) {
    await page.goto(`/labs/${article.slug}`);
    const main = page.locator("main");
    await expect(page.locator("h1")).toContainText(article.title);
    await expect(main).toContainText("Armaan Singla");
    await expect(main).toContainText(article.date);
    await expect(main).toContainText(AI_METHODS_NOTE);
    for (const id of ["leading-result", "question", "system", "method", "results", "article-limitations", "related", "reproduce", "corrections", "methods-note"]) {
      await expect(main.locator(`[id="${id}"]`), `${article.slug} #${id}`).toHaveCount(1);
    }
    expect(article.reproducibility.some((l) => l.href.startsWith("/evidence/"))).toBe(true);
  }
  await page.goto("/labs/research-summary");
  await expect(page.locator("[data-withdrawn]")).toHaveCount(1);
  await page.goto("/labs");
  for (const entry of labsInPreparation) {
    const card = page.locator("#in-preparation li", { hasText: entry.title });
    await expect(card).toContainText("In preparation");
    await expect(card.locator("a")).toHaveCount(0);
  }
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

test.describe("Nav2 walkthrough without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every step and the evidence label are in the static HTML", async ({ page }) => {
    await page.goto(WALKTHROUGH);
    const text = (await page.locator("main").textContent()) ?? "";
    for (const step of demoWalkthrough.steps) expect(text, step.id).toContain(step.label);
    expect(text).toContain("not a Nav2 defect");
  });
});

test("Nav2 walkthrough steps are keyboard-reachable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(WALKTHROUGH, { waitUntil: "networkidle" });
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
