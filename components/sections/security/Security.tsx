import Button from "@/components/ui/Button";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Caveat, MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { security } from "@/lib/content";

/** /security 001-004: scope, operating boundaries, "not a universal sandbox", and what runs where. */
export function Boundaries() {
  const { scope, boundaries, sandbox } = security;
  return (
    <>
      <Section id="scope" aria-labelledby="scope-title" className={SECTION_PAD}>
        <SectionIntro kicker={scope.kicker} title={scope.title} titleId="scope-title" lede={scope.body} />
      </Section>

      <Section id="boundaries" variant="charcoal" aria-labelledby="boundaries-title" className={SECTION_PAD}>
        <SectionIntro kicker={boundaries.kicker} title={boundaries.title} titleMuted={boundaries.titleMuted} titleId="boundaries-title" />
        <Reveal as="ul" stagger={0.04} amount={0.03} className="mt-12 border-t border-line md:mt-14">
          {boundaries.rows.map((row) => (
            <RevealItem
              key={row.id}
              as="li"
              id={row.id}
              className="grid gap-x-10 gap-y-3 border-b border-line py-6 md:grid-cols-[220px_minmax(0,1fr)]"
            >
              <h3 className="text-[17px] leading-[1.35] font-semibold tracking-[-0.02em] text-text">{row.title}</h3>
              <div className="max-w-[820px]">
                <p className="text-[15px] leading-[1.75] text-muted">{row.body}</p>
                {"caveat" in row && row.caveat && <Caveat className="mt-3">{row.caveat}</Caveat>}
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section id="not-a-sandbox" aria-labelledby="sandbox-title" className={SECTION_PAD}>
        <SectionIntro kicker={sandbox.kicker} title={sandbox.title} titleId="sandbox-title" lede={sandbox.body} />
      </Section>
    </>
  );
}

export function Fidelity() {
  const { fidelity, ci } = security;
  return (
    <Section id="fidelity" variant="charcoal" aria-labelledby="fidelity-title" className={SECTION_PAD}>
      <SectionIntro kicker={fidelity.kicker} title={fidelity.title} titleMuted={fidelity.titleMuted} titleId="fidelity-title" />
      <Reveal as="ul" stagger={0.05} amount={0.05} className="hairline-grid mt-12 grid-cols-1 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        {fidelity.rows.map((r) => (
          <RevealItem key={r.tier} as="li" className={cn("flex flex-col p-6", r.maturity === "planned" ? "bg-bg" : "bg-surface")}>
            <h3 className="text-[19px] leading-[1.25] font-semibold tracking-title text-text">{r.tier}</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-muted">{r.examples}</p>
            <MaturityChip maturity={r.maturity} note={r.note} className="mt-auto self-start" />
          </RevealItem>
        ))}
      </Reveal>
      <div className="mt-10 border-t border-line pt-6">
        <p className={cn(mono, "text-subtle")}>{ci.title}</p>
        <p className="mt-3 max-w-[760px] text-[15px] leading-[1.7] text-text">{ci.body}</p>
      </div>
    </Section>
  );
}

export function SecurityContact() {
  const c = security.contact;
  return (
    <Section id="report" aria-labelledby="report-title" className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleId="report-title" lede={c.body} />
      <Button href={c.cta.href} variant="secondary" icon="→" className="mt-8">
        {c.cta.label}
      </Button>
    </Section>
  );
}
