import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home, nav } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { boundaries } = home;

/** Home section 7: operating boundaries (full version on /security) and the pilot invitation. */
export default function Boundaries() {
  return (
    <Section id="boundaries" aria-labelledby="boundaries-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={boundaries.kicker} title={boundaries.title} titleMuted={boundaries.titleMuted} titleId="boundaries-title" />
      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <Reveal>
          <ul className="border-t border-line">
            {boundaries.items.map((item, i) => (
              <li key={item} className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 border-b border-line py-4">
                <span aria-hidden="true" className="pt-[3px] font-mono text-[11px] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-[1.6] text-text">{item}</span>
              </li>
            ))}
          </ul>
          <ArrowLink href={boundaries.link.href} className="mt-4">
            {boundaries.link.label}
          </ArrowLink>
        </Reveal>
        <Reveal className="flex flex-col items-start border border-line bg-surface p-6 sm:p-8" delay={0.06}>
          <h3 className="font-mono text-[11px] tracking-[0.13em] text-lime uppercase">{boundaries.pilot.title}</h3>
          <p className="mt-4 text-[18px] leading-[1.55] tracking-[-0.02em] text-text">{boundaries.pilot.text}</p>
          <Button href={nav.demo.href} icon="→" className="mt-6">
            {nav.demo.label}
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
