import { ArticleCard } from "@/components/sections/labs/ArticleCard";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";
import { labsArticle, type LabsArticle } from "@/lib/labs";
import { ArrowLink, SectionIntro } from "./shared";

const { labs } = home;
const articles = labs.slugs.map(labsArticle).filter((a): a is LabsArticle => a !== undefined);

/** Home section 5: two Ordinum Labs articles. */
export default function SelectedLabs() {
  return (
    <Section id="labs" aria-labelledby="labs-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={labs.kicker} title={labs.title} titleMuted={labs.titleMuted} titleId="labs-title" />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-10 grid-cols-1 md:mt-14 md:grid-cols-2">
        {articles.map((a) => (
          <RevealItem key={a.slug} as="li">
            <ArticleCard article={a} />
          </RevealItem>
        ))}
      </Reveal>
      <ArrowLink href={labs.link.href} className="mt-6">
        {labs.link.label}
      </ArrowLink>
    </Section>
  );
}
