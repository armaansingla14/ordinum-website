import type { Metadata } from "next";
import { pageMetadata } from "@/components/layout/metadata";
import CtaBand from "@/components/sections/CtaBand";
import PageHeader from "@/components/sections/PageHeader";
import { ArticleCard } from "@/components/sections/labs/ArticleCard";
import { SECTION_PAD } from "@/components/sections/technology/shared";
import Section from "@/components/ui/Section";
import { labs, labsArticles } from "@/lib/labs";

export const metadata: Metadata = pageMetadata("labs");

/** /labs: the index of published articles. */
export default function LabsPage() {
  return (
    <>
      <PageHeader page="labs" />
      <Section id="articles" aria-labelledby="articles-title" className={SECTION_PAD}>
        <h2 id="articles-title" className="sr-only">
          {labs.indexTitle}
        </h2>
        <ul className="hairline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {labsArticles.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand current="labs" />
    </>
  );
}
