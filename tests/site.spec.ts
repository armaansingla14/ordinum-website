import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  AI_METHODS_NOTE,
  FLAGSHIP_LABEL,
  HOSTED_CI_STATUS,
  PRIMARY_CTA,
  WATCH_DEMO,
  agenticLoop,
  contact,
  demoWalkthrough,
  flagshipVideo,
  home,
  legal,
  nav,
  pages,
  security,
  site,
  testingAreas,
  type NavEntry,
  type NavGroup,
} from "../lib/content";
import { PENDING_LABEL, evidencePackages } from "../lib/evidence-packages";
import { labsArticles } from "../lib/labs";
import { REDIRECTS, ROUTES } from "./routes";

const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920] as const;
const HEIGHT: Record<number, number> = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };

const ENTRIES = nav.entries as readonly NavEntry[];
const GROUPS = ENTRIES.filter((e): e is NavGroup => e.kind === "group");
const PRODUCTS = GROUPS.find((g) => g.id === "products")!;
const WALKTHROUGH = "/demos/nav2-walkthrough";
const FOUNDER_LINKEDIN = ["linkedin.com/in/armaansingla", "linkedin.com/in/aaravsinglaa"] as const;

/**
 * Homepage copy budget. Copy pass (1 November 2026): the home page had 778 words of main text
 * (~/scratch/ordinum-human/wordcount-before.json); the brief set a hard ceiling of 650 words, kept
 * by the 9/10 pass. Word = whitespace-separated token with at least one Unicode letter.
 */
const HOME_WORD_BASELINE = 778;
const HOME_WORD_BUDGET = 650;

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

test("header primary CTA is 'Request an evaluation' and leads to /contact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect(nav.demo).toEqual(PRIMARY_CTA);
  expect(PRIMARY_CTA).toEqual({ label: "Request an evaluation", href: "/contact" });
  const cta = page.getByRole("banner").getByRole("link", { name: PRIMARY_CTA.label, exact: true });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", PRIMARY_CTA.href);
  await expect(cta).toContainText(PRIMARY_CTA.label);
  // Exactly one call to action in the header.
  await expect(page.locator("header a[href*='cal.com']")).toHaveCount(0);
  await cta.click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("banner").getByRole("link", { name: PRIMARY_CTA.label, exact: true })).toHaveAttribute("aria-current", "page");
});

test("CTAs: every link to /contact says 'Request an evaluation', every 'Watch demo' goes to /#demo, no competing buttons", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const contactLabels = await page.locator("main a[href='/contact'], footer a[href='/contact']").allInnerTexts();
    for (const label of contactLabels) expect(label.trim().toLowerCase(), route).toContain(PRIMARY_CTA.label.toLowerCase());
    const demoHrefs = await page
      .locator("a")
      .filter({ hasText: /^\s*Watch demo/ })
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const href of demoHrefs) expect(href, route).toBe(WATCH_DEMO.href);
    // "Book a call", "Talk to us" and "Talk to the founders" are gone everywhere; Cal.com is linked only on /contact.
    await expect(page.locator("a, button").filter({ hasText: /book a call|talk to us|talk to the founders/i }), route).toHaveCount(0);
    if (route !== "/contact") await expect(page.locator("a[href*='cal.com']"), route).toHaveCount(0);
  }
  await page.goto("/contact");
  await expect(page.locator("main a[href*='cal.com']")).toHaveCount(1);
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

test("home hero: 'Request an evaluation' -> /contact and 'Watch demo' -> #demo", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero.locator(`a[href='${PRIMARY_CTA.href}']`)).toContainText(PRIMARY_CTA.label);
  await expect(hero.locator(`a[href='${WATCH_DEMO.href}']`)).toContainText(WATCH_DEMO.label);
  await expect(page.locator("h1")).toContainText("Find security failures before they reach the real world.");
});

test("home: hero with availability and delivery, demo with strip and result, workflow, four areas, ambition, Labs, one band", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  const hero = page.locator("#top");
  await expect(hero).toContainText("firmware");
  await expect(hero).toContainText("Firmware and physical hardware");
  await expect(hero).toContainText("CLI with Python integrations");
  await expect(hero).toContainText("guided by the founders");
  await expect(hero).not.toContainText(/pip install|installed from source/i);
  const ids = await main.locator(":scope > section[id]").evaluateAll((els) => els.map((el) => el.id));
  expect(ids).toEqual(["top", "demo", "workflow", "areas", "ambition", "labs", "get-started"]);

  // Demo: the recording, the five-step strip, the before/after card, and the planted label exactly once.
  const demo = main.locator("#demo");
  await expect(demo.locator("video")).toHaveCount(1);
  await expect(demo.locator("video")).toHaveAttribute("preload", "none");
  await expect(demo.locator("video")).not.toHaveAttribute("autoplay", /.*/);
  const strip = demo.locator("ol[aria-label] > li");
  await expect(strip).toHaveCount(5);
  for (const [i, step] of home.demo.strip.entries()) {
    await expect(strip.nth(i)).toContainText(step.label);
    await expect(strip.nth(i)).toContainText(step.value);
  }
  await expect(demo).toContainText("10/10");
  await expect(demo).toContainText("0/10");
  await expect(demo).toContainText("FIX_VERIFIED");
  const demoText = (await demo.textContent()) ?? "";
  expect(demoText.split(FLAGSHIP_LABEL).length - 1).toBe(1);
  await expect(demo.locator("a[href^='/evidence/']")).toHaveCount(1);
  await expect(demo.locator(`a[href='${flagshipVideo.transcript}']`)).toHaveCount(1);

  await expect(main.locator("#workflow ol > li")).toHaveCount(5);
  await expect(main.locator("#workflow")).toContainText("Diagram");
  for (const area of testingAreas) {
    await expect(main.locator("#areas"), area.label).toContainText(area.label);
    for (const i of area.integrations) await expect(main.locator("#areas"), i.name).toContainText(i.name);
  }
  await expect(main.locator("#areas")).toContainText("Firmware, native fuzzing, devices and physical hardware");
  for (const label of ["Today", "In development", "Planned"]) await expect(main.locator("#ambition"), label).toContainText(label);
  await expect(main.locator("#ambition")).toContainText(agenticLoop.note);
  await expect(main.locator("#labs li")).toHaveCount(home.labs.slugs.length);
  // One evaluation band; it does not repeat the hero's "Watch demo".
  await expect(main.locator("#get-started")).toHaveCount(1);
  await expect(main.locator("#get-started a", { hasText: PRIMARY_CTA.label })).toHaveCount(1);
  await expect(main.locator("#get-started a", { hasText: WATCH_DEMO.label })).toHaveCount(0);
});

test("home: the demo recording starts inside the first 1440x900 viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const box = await page.locator("#demo video").boundingBox();
  expect(box, "video has a box").not.toBeNull();
  expect(box!.y).toBeGreaterThan(0);
  expect(box!.y).toBeLessThan(900);
});

test("products: Transaction assurance has its own page; AI agent security separates the built part from the vision", async ({ page }) => {
  await page.goto("/products/transactions");
  const main = page.locator("main");
  await expect(main).toContainText("reference application");
  await expect(main).toContainText("not real payment software", { ignoreCase: true });
  await expect(main).toContainText("NOT_FIXED in 10/10");
  await page.goto("/products/agents");
  await expect(page.locator("#scope li")).toHaveCount(2);
  await expect(page.locator("#scope")).toContainText("Today");
  await expect(page.locator("#scope")).toContainText("Planned");
  for (const key of ["software", "agents", "robotics", "transactions"] as const) {
    await page.goto(pages[key].href);
    const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((el) => el.id));
    const order = ["test", "example", "connect", "runs", "outputs", "today", "evaluate"];
    expect(ids.filter((id) => order.includes(id)), key).toEqual(order);
    await expect(page.locator("main"), key).not.toContainText(/pip install|installed from source/i);
  }
  await page.goto("/products/robotics");
  await expect(page.locator("#example")).toContainText("Recorded simulation trace · harness artifact, not a Nav2 bug");
});

test("anchors: how a run works lives on /products; /security is deployment, data, isolation, CI and reporting", async ({ page }) => {
  await page.goto("/products");
  for (const id of ["how-it-works", "engine", "delivery", "capabilities", "outputs", "architecture", "lifecycle", "reproduction", "limitations"]) {
    await expect(page.locator(`[id="${id}"]`), `/products #${id}`).toHaveCount(1);
  }
  await page.goto("/security");
  for (const id of ["deployment", "data", "network", "ci", "report"]) await expect(page.locator(`[id="${id}"]`), `/security #${id}`).toHaveCount(1);
  for (const id of ["architecture", "lifecycle", "reproduction"]) await expect(page.locator(`[id="${id}"]`), `/security #${id}`).toHaveCount(0);
  await expect(page.locator("#network tbody tr")).toHaveCount(security.network.rows.length);
});

test("CI wording: one sentence, used verbatim", async ({ page }) => {
  for (const route of ["/products", "/security", "/roadmap"]) {
    await page.goto(route);
    await expect(page.locator("main"), route).toContainText(HOSTED_CI_STATUS);
    await expect(page.locator("main"), route).not.toContainText(/no hosted CI/i);
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

test("PocketBase evidence: both terminal logs are published, served and nothing is pending", async ({ page, request }) => {
  const slug = "pocketbase-verified-fix";
  for (const name of ["verify-terminal.log", "ci-terminal.log"]) {
    const local = path.resolve(__dirname, "..", "public", "evidence", slug, name);
    expect(fs.existsSync(local), `${name} must be committed (see .gitignore exception)`).toBe(true);
    const res = await request.get(`/evidence/${slug}/${name}`);
    expect(res.status(), name).toBe(200);
    const sha = createHash("sha256").update(await res.body()).digest("hex");
    expect(sha, name).toBe(createHash("sha256").update(fs.readFileSync(local)).digest("hex"));
  }
  await page.goto(`/evidence/${slug}`);
  await expect(page.locator("main [data-pending]")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(PENDING_LABEL);
});

test("/demos: flagship card plays the recorded run with captions, labeled before playback", async ({ page, request }) => {
  await page.goto("/demos");
  const main = page.locator("main");
  const card = main.locator("#demo-flagship");
  // The recording sits in the page header, the first thing on the page.
  await expect(page.locator("main > header #demo-flagship")).toHaveCount(1);
  await expect(card).toContainText("not a PocketBase bug");
  await expect(card).toContainText("FIX_VERIFIED");
  await expect(card).toContainText("Affected 10/10 vs fixed 0/10");
  expect(((await card.textContent()) ?? "").split(FLAGSHIP_LABEL).length - 1).toBe(1);
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

test("Labs: articles lead with the finding and carry author, date, methods note and evidence links", async ({ page }) => {
  const order = ["finding", "tested", "why-it-matters", "how-it-worked", "what-it-shows", "not-established", "artifacts", "methods-note"];
  for (const article of labsArticles) {
    await page.goto(`/labs/${article.slug}`);
    const main = page.locator("main");
    await expect(page.locator("h1")).toContainText(article.title);
    await expect(main).toContainText("Armaan Singla");
    await expect(main).toContainText(article.date);
    await expect(main).toContainText(AI_METHODS_NOTE);
    for (const id of order) {
      await expect(main.locator(`[id="${id}"]`), `${article.slug} #${id}`).toHaveCount(1);
    }
    // The finding first, the methods note last.
    const ids = await main.locator("article section[id]").evaluateAll((els) => els.map((el) => el.id));
    const positions = order.map((id) => ids.indexOf(id));
    expect(positions, article.slug).toEqual([...positions].sort((a, b) => a - b));
    expect(ids[0], article.slug).toBe("finding");
    // Technical details are collapsed by default.
    await expect(main.locator("#artifacts details")).toHaveCount(1);
    await expect(main.locator("#artifacts details")).not.toHaveAttribute("open", /.*/);
    expect(article.reproducibility.some((l) => l.href.startsWith("/evidence/"))).toBe(true);
  }
  await page.goto("/labs/research-summary");
  await expect(page.locator("[data-withdrawn]")).toHaveCount(1);
  // The agent article is clearly about our own reference application.
  await page.goto("/labs/ordinum-found-a-bug-in-our-own-reference-agent");
  for (const text of ["our own reference application", "not third-party software", "release candidate", "CANNOT_VERIFY", "9a70c5c"]) {
    await expect(page.locator("main"), text).toContainText(text, { ignoreCase: true });
  }
  // The index lists published articles only, newest finding first: no category counts, no placeholders.
  await page.goto("/labs");
  const hrefs = await page.locator("#articles li a").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual(labsArticles.map((a) => `/labs/${a.slug}`));
  expect(hrefs[0]).toBe("/labs/ordinum-found-a-bug-in-our-own-reference-agent");
  await expect(page.locator("#in-preparation")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/in preparation/i);
  await expect(page.locator("main ul[aria-label='Categories']")).toHaveCount(0);
  await expect(page.locator("#sources")).toContainText("Release candidate");
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
  // Heading, the plain "what happens" steps and the next-steps line under the form.
  await expect(page.locator("h1")).toHaveText(contact.talk.title);
  await expect(page.locator("main")).toContainText(contact.talk.body);
  await expect(page.locator("main #talk ol > li")).toHaveCount(contact.talk.steps.length);
  await expect(form).toContainText(contact.form.nextLine);
  await expect(form.locator("button[type='submit']")).toContainText(contact.form.submit);
  // Old /contact#talk links still land on an element.
  await expect(page.locator("#talk")).toHaveCount(1);
});

test("contact form: client-side validation message without sending", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  const form = page.locator("#contact-form form");
  await form.locator("[name='email']").fill("not-an-email");
  await form.locator("button[type='submit']").click();
  await expect(form.locator("[role='status']")).toHaveText(contact.form.messages.invalid);
  await expect(form.locator("[name='email']")).toHaveAttribute("aria-invalid", "true");
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
