import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { research } from "@/lib/content";
import { StatusMark, Tag } from "./badges";
import { SectionHead } from "./shared";

const rm = research.roadmap;

/** F. Research roadmap. Every item is planned; the basis says whether it is on the repo roadmap or founder vision only. */
export default function ResearchRoadmap() {
  return (
    <Section id="roadmap" variant="charcoal" aria-labelledby="roadmap-title">
      <SectionHead
        id="roadmap-title"
        kicker={rm.kicker}
        title={rm.title}
        aside={<p className="text-[14px] leading-[1.7] text-muted lg:text-right">{rm.note}</p>}
      />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {rm.items.map((item) => (
          <RevealItem as="li" key={item.title} className="flex flex-col bg-surface p-6 sm:last:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusMark status="planned" />
              <Tag tone="quiet">{item.basis === "roadmap" ? "Repo roadmap" : "Founder vision"}</Tag>
            </div>
            <h3 className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.02em] text-text">{item.title}</h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-muted">{item.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
