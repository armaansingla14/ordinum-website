import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { ArticleCard } from "@/components/sections/labs/ArticleCard";
import { SECTION_PAD, SectionIntro } from "@/components/sections/technology/shared";
import Section from "@/components/ui/Section";
import { labs, labsArticles } from "@/lib/labs";

export const metadata: Metadata = pageMetadata("labs");

/** /labs: the index of published articles (newest finding first), then the evidence and sources block. */
export default function LabsPage() {
  const src = labs.sources;
  return (
    <>
      <PageHeader page="labs" />
      <Section id="articles" aria-labelledby="articles-title" className={SECTION_PAD}>
        <h2 id="articles-title" className="sr-only">
          {labs.indexTitle}
        </h2>
        <ul className="hairline-grid grid-cols-1 md:grid-cols-2">
          {labsArticles.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Section>
      <Section id="sources" variant="charcoal" aria-labelledby="sources-title" className={SECTION_PAD}>
        <SectionIntro kicker={src.kicker} title={src.title} titleId="sources-title" />
        <dl className="mt-8 border-t border-line md:mt-10">
          {src.items.map((r) => (
            <div key={r.k} className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
              <dt className="font-mono text-[10.5px] tracking-[0.1em] text-subtle uppercase sm:pt-[3px]">{r.k}</dt>
              <dd className="max-w-[860px] text-[15px] leading-[1.65] text-text">{r.v}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <CtaBand current="labs" />
    </>
  );
}
