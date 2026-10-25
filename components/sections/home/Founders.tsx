import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { founders } = home;

/**
 * Home section 5 (with the CtaBand that follows): why this team, in one sentence taken from the
 * verified /about story, then the two co-founders in one line each with their approved
 * LinkedIn profiles. Backgrounds in full are on /about; no career history on the home page.
 */
export default function Founders() {
  return (
    <Section id="founders" aria-labelledby="founders-title" className="py-[72px] md:py-[104px]">
      <SectionIntro
        kicker={founders.kicker}
        title={founders.title}
        titleMuted={founders.titleMuted}
        titleId="founders-title"
        lede={founders.lede}
      />

      <Reveal as="ul" stagger={0.06} className="hairline-grid mt-10 grid-cols-1 md:mt-14 md:grid-cols-2">
        {founders.people.map((p) => (
          <RevealItem key={p.name} as="li" className="flex flex-col bg-bg p-6 sm:p-7">
            <p className="font-mono text-[10px] tracking-[0.14em] text-lime uppercase">{p.role}</p>
            <h3 className="mt-3 text-[22px] leading-[1.25] font-semibold tracking-title text-text">{p.name}</h3>
            <p className="mt-3 max-w-[520px] text-[15px] leading-[1.7] text-muted">{p.line}</p>
            <a
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-3 font-mono text-[11px] tracking-[0.12em] text-muted uppercase underline-offset-4 transition-colors hover:text-lime hover:underline"
            >
              LinkedIn
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> profile of {p.name} (opens in a new tab)</span>
            </a>
          </RevealItem>
        ))}
      </Reveal>

      <div className="mt-8">
        <ArrowLink href={founders.link.href}>{founders.link.label}</ArrowLink>
      </div>
    </Section>
  );
}
