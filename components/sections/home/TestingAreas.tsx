import Link from "next/link";
import { MaturityChip } from "@/components/sections/technology/shared";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home, testingAreas } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { areas } = home;

/**
 * Home section 4: the three testing areas, each with the integrations it supports today and their
 * exact maturity labels and scope. Network isolation is described per integration on /security.
 */
export default function TestingAreas() {
  return (
    <Section id="areas" variant="charcoal" aria-labelledby="areas-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={areas.kicker} title={areas.title} titleMuted={areas.titleMuted} titleId="areas-title" />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-10 grid-cols-1 md:mt-14 lg:grid-cols-3">
        {testingAreas.map((a) => (
          <RevealItem key={a.key} as="li" className="flex flex-col bg-bg p-6 sm:p-7">
            <h3 className="text-[22px] leading-[1.2] font-semibold tracking-title text-text">
              <Link href={a.href} className="group hover:text-lime">
                {a.label}
                <span aria-hidden="true" className="ml-2 inline-block text-lime transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-muted">{a.body}</p>
            <span aria-hidden="true" className="flex-1" />
            <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
              {a.integrations.map((i) => (
                <li key={i.name} className="flex flex-col items-start gap-2">
                  <span className="text-[14.5px] leading-[1.4] font-[550] tracking-[-0.015em] text-text">{i.name}</span>
                  <MaturityChip maturity={i.maturity} note={i.note} />
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </Reveal>
      <div className="mt-6 flex flex-wrap gap-x-8">
        {areas.links.map((l) => (
          <ArrowLink key={l.href} href={l.href}>
            {l.label}
          </ArrowLink>
        ))}
      </div>
    </Section>
  );
}
