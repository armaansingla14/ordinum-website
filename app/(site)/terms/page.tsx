import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { legal, pages, site, type LegalSection } from "@/lib/content";

const doc = legal.terms;
const page = pages.terms;
const sections: readonly LegalSection[] = doc.sections;
const related = { href: pages.privacy.href, label: legal.privacy.title };

/** Draft text pending founder approval: kept out of search indexes and the sitemap until approved. */
export const metadata: Metadata = { ...pageMetadata("terms"), robots: { index: false, follow: true } };

const linkClass =
  "text-text underline decoration-line-2 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime";

/**
 * Interim Website Terms (text in lib/content.ts `legal.terms`). Replaces the retired
 * AI-governance Terms of Service completely (that text remains only in git history).
 * Production publication needs founder approval of the exact text; the draft status line
 * stays visible until then. Same layout as app/(site)/privacy/page.tsx.
 */
export default function TermsPage() {
  return (
    <article aria-labelledby="legal-title" className="relative">
      <Container className="py-[79px] md:py-[125px]">
        <div className="mx-auto max-w-[72ch]">
          <Kicker>{page.header.kicker}</Kicker>
          <h1
            id="legal-title"
            className="mt-6 text-[clamp(39px,5vw,64px)] font-semibold leading-[1.05] tracking-[-0.06em] text-text"
          >
            {doc.title}
          </h1>

          <p className="mt-7 inline-flex items-center gap-3 border border-dashed border-[#6b7b80] px-3 py-2 font-mono text-[11px] uppercase leading-[1.5] tracking-[0.12em] text-[#c9d1cf]">
            <span aria-hidden="true" className="size-[7px] shrink-0 border border-dashed border-[#9aa8ab]" />
            {doc.status}
          </p>

          <p className="mt-6 font-mono text-[12px] tracking-[0.02em] text-subtle">Last updated: {doc.lastUpdated}</p>
          <p className="mt-6 text-[17px] leading-[1.75] tracking-[-0.01em] text-muted">{doc.intro}</p>

          <div className="mt-14 border-t border-line">
            {sections.map((section, i) => {
              const headingId = `terms-${section.id}`;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={headingId}
                  className="grid scroll-mt-[88px] gap-4 border-b border-line py-10 md:grid-cols-[64px_1fr] md:gap-6"
                >
                  <span aria-hidden="true" className="pt-1 font-mono text-[11px] tracking-[0.14em] text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 id={headingId} className="text-[21px] font-semibold leading-[1.3] tracking-[-0.03em] text-text">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-[15.5px] leading-[1.8] text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.list && (
                      <ul className="mt-4 grid gap-3">
                        {section.list.map((item) => (
                          <li key={item} className="flex gap-3 text-[15.5px] leading-[1.8] text-muted">
                            <span aria-hidden="true" className="mt-[14px] h-px w-3 shrink-0 bg-line-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <footer className="mt-10 font-mono text-[12px] leading-[1.8] text-subtle">
            <p>
              Questions:{" "}
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </p>
            <p className="mt-2">
              See also:{" "}
              <Link href={related.href} className={linkClass}>
                {related.label}
              </Link>
            </p>
          </footer>
        </div>
      </Container>
    </article>
  );
}
