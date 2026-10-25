import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { technology } from "@/lib/content";
import { Caveat, Disclosure, SECTION_PAD, SectionIntro, mono } from "./shared";

/**
 * Section 4: fault injection and observation, per target: how it is observed and checked, with
 * the exact fault vocabulary (DM Mono) behind a disclosure. Then the testbed's policy clauses.
 */
export default function Faults() {
  const f = technology.faults;
  return (
    <Section id={f.id} variant="charcoal" aria-labelledby={`${f.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={f.kicker} title={f.title} titleMuted={f.titleMuted} titleId={`${f.id}-title`} lede={f.lede} />

      <Reveal as="ul" stagger={0.06} amount={0.05} className="hairline-grid mt-12 grid-cols-1 md:mt-16 lg:grid-cols-3">
        {f.targets.map((t) => (
          <RevealItem as="li" key={t.id} className="flex min-w-0 flex-col bg-surface p-6 md:p-7">
            <h3 className="text-[19px] leading-[1.25] font-[550] tracking-[-0.025em] text-text">{t.name}</h3>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className={cn(mono, "text-subtle")}>Observation</dt>
                <dd className="mt-2 text-[14px] leading-[1.7] text-muted">{t.observation}</dd>
              </div>
              <div>
                <dt className={cn(mono, "text-subtle")}>Checks</dt>
                <dd className="mt-2 text-[14px] leading-[1.7] text-muted">{t.checks}</dd>
              </div>
            </dl>
            <Disclosure summary={`${t.kinds.length} fault kinds`} className="mt-auto pt-4">
              <ul className="flex flex-wrap gap-1.5">
                {t.kinds.map((k) => (
                  <li key={k} className="border border-line-2 bg-window px-2 py-1 font-mono text-[11px] leading-none text-[#d6dedb]">
                    {k}
                  </li>
                ))}
              </ul>
              {"kindsNote" in t && t.kindsNote && (
                <p className="mt-3 text-[13px] leading-[1.6] text-subtle">{t.kindsNote}</p>
              )}
            </Disclosure>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal className="mt-12 md:mt-14">
        <h3 className={cn(mono, "text-lime")}>{f.policyTitle}</h3>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {f.policy.map((p) => (
            <li key={p.id} className="grid gap-x-8 gap-y-1.5 py-4 sm:grid-cols-[170px_minmax(0,1fr)]">
              <span className="font-mono text-[12px] tracking-[0.04em] text-text">{p.id}</span>
              <span className="text-[14.5px] leading-[1.65] text-muted">{p.text}</span>
            </li>
          ))}
        </ul>
        <Caveat className="mt-6 max-w-[760px]">{f.note}</Caveat>
      </Reveal>
    </Section>
  );
}
