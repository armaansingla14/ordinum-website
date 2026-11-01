import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { ArticleCard, PlannedCard } from "@/components/sections/labs/ArticleCard";
import { SECTION_PAD } from "@/components/sections/technology/shared";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { LABS_CATEGORIES, labs, labsArticles, labsInPreparation } from "@/lib/labs";

export const metadata: Metadata = pageMetadata("labs");

const counts = LABS_CATEGORIES.map((c) => ({
  category: c,
  published: labsArticles.filter((a) => a.category === c).length,
  preparing: labsInPreparation.filter((a) => a.category === c).length,
}));

/** /labs: the article index. In-preparation titles carry no results and no link. */
export default function LabsPage() {
  return (
    <>
      <PageHeader page="labs">
        <ul aria-label="Categories" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase md:mt-12">
          {counts.map((c) => (
            <li key={c.category} className="flex items-center gap-2">
              <span aria-hidden="true" className={c.published > 0 ? "size-[7px] bg-lime" : "size-[7px] border border-dashed border-[#7d8c8a]"} />
              {c.category}
              <span className="text-subtle">
                {c.published > 0 ? `${c.published} published` : c.preparing > 0 ? "in preparation" : "none yet"}
              </span>
            </li>
          ))}
        </ul>
      </PageHeader>

      <Section id="articles" aria-labelledby="articles-title" className={SECTION_PAD}>
        <Kicker index={labs.indexKicker.split(" / ")[1]}>{labs.indexKicker.split(" / ")[0]}</Kicker>
        <h2 id="articles-title" className="sr-only">
          {labs.indexTitle}
        </h2>
        <ul className="hairline-grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {labsArticles.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="in-preparation" variant="charcoal" aria-labelledby="preparing-title" className="py-[56px] md:py-[88px]">
        <Kicker index={labs.preparingKicker.split(" / ")[1]}>{labs.preparingKicker.split(" / ")[0]}</Kicker>
        <h2 id="preparing-title" className="mt-5 text-[clamp(26px,2.6vw,34px)] leading-[1.15] font-semibold tracking-title text-text">
          {labs.preparingTitle}
        </h2>
        <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">{labs.preparingNote}</p>
        <ul className="hairline-grid mt-8 grid-cols-1 md:grid-cols-3">
          {labsInPreparation.map((e) => (
            <li key={e.title}>
              <PlannedCard entry={e} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand current="labs" />
    </>
  );
}
