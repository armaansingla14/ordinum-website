import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { MaturityChip, MaturityLegend, SECTION_PAD, SectionIntro } from "@/components/sections/technology/shared";
import { roadmap } from "@/lib/content";

/** /roadmap 001: what is in progress and what is planned. Nothing here is built. */
export default function RoadmapList() {
  const r = roadmap.items;
  return (
    <Section id="roadmap" aria-labelledby="roadmap-title" className={SECTION_PAD}>
      <SectionIntro kicker={r.kicker} title={r.title} titleMuted={r.titleMuted} titleId="roadmap-title" lede={r.lede} />
      <MaturityLegend only={["in-progress", "planned"]} className="mt-10" />
      <Reveal as="ul" stagger={0.04} amount={0.05} className="mt-6 border-t border-line-2">
        {r.list.map((item) => (
          <RevealItem
            key={item.name}
            as="li"
            className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,5fr)]"
          >
            <h3 className="text-[18px] leading-[1.35] font-semibold tracking-title text-text">{item.name}</h3>
            <div>
              <MaturityChip maturity={item.maturity} />
            </div>
            <p className="text-[14.5px] leading-[1.65] text-muted">{item.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
