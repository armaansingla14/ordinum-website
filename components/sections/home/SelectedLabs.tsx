import { ArticleCard } from "@/components/sections/labs/ArticleCard";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";
import { labsArticle, type LabsArticle } from "@/lib/labs";
import { ArrowLink, SectionIntro } from "./shared";

const { labs } = home;
const articles = labs.slugs.map(labsArticle).filter((a): a is LabsArticle => a !== undefined);

/** Home section 6: three Ordinum Labs articles, as compact cards (title, label, date). */
export default function SelectedLabs() {
  return (
    <Section id="labs" variant="charcoal" aria-labelledby="labs-title" className="py-[56px] md:py-[80px]">
      <SectionIntro kicker={labs.kicker} title={labs.title} titleId="labs-title" />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-8 grid-cols-1 md:mt-10 md:grid-cols-3">
        {articles.map((a) => (
          <RevealItem key={a.slug} as="li">
            <ArticleCard article={a} compact />
          </RevealItem>
        ))}
      </Reveal>
      <ArrowLink href={labs.link.href} className="mt-4">
        {labs.link.label}
      </ArrowLink>
    </Section>
  );
}
