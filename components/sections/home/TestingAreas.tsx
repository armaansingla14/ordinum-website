import Link from "next/link";
import { ChannelTag, MaturityChip } from "@/components/sections/technology/shared";
import { MaturityMarker } from "@/components/ui/MaturityMarker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { MATURITY_LABELS, home, plannedAreas, testingAreas } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { areas } = home;

/**
 * Home section 4: the four product areas, each with the integration it supports today, its exact
 * maturity label and scope, and whether it ships in the stable checkpoint or the release
 * candidate; then the planned firmware/hardware row.
 */
export default function TestingAreas() {
  return (
    <Section id="areas" variant="charcoal" aria-labelledby="areas-title" className="py-[56px] md:py-[80px]">
      <SectionIntro kicker={areas.kicker} title={areas.title} titleId="areas-title" />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-8 grid-cols-1 sm:grid-cols-2 md:mt-10 xl:grid-cols-4">
        {testingAreas.map((a) => (
          <RevealItem key={a.key} as="li" className="flex min-w-0 flex-col bg-bg p-5 sm:p-6">
            <h3 className="text-[19px] leading-[1.25] font-semibold tracking-title text-text">
              <Link href={a.href} className="group hover:text-lime">
                {a.label}
                <span aria-hidden="true" className="ml-2 inline-block text-lime transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{a.body}</p>
            <ul className="mt-5 flex flex-col gap-3.5 border-t border-line pt-4">
              {a.integrations.map((i) => (
                <li key={i.name} className="flex flex-col items-start gap-2">
                  <span className="text-[14px] leading-[1.4] font-[550] tracking-[-0.015em] text-text">{i.name}</span>
                  <MaturityChip maturity={i.maturity} note={i.note} />
                  <ChannelTag channel={i.channel} />
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal className="mt-px flex flex-col gap-3 border border-dashed border-line-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14.5px] leading-[1.5] text-muted">
          <span className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">
            <MaturityMarker maturity="planned" />
            {MATURITY_LABELS.planned}
          </span>
          <span className="text-text">{plannedAreas.label}</span>
        </p>
        <ArrowLink href={plannedAreas.link.href} className="shrink-0">
          {plannedAreas.link.label}
        </ArrowLink>
      </Reveal>
      <ArrowLink href={areas.link.href} className="mt-4">
        {areas.link.label}
      </ArrowLink>
    </Section>
  );
}
