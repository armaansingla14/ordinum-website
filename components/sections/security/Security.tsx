import Button from "@/components/ui/Button";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Caveat, MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { security } from "@/lib/content";

/** Commands and addresses inside table text: kept on one line and set in mono. */
const CODE = /(unshare -rn|--network none|127\.0\.0\.1)/;
function WithCode({ text }: { text: string }) {
  return (
    <>
      {text.split(CODE).map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="font-mono text-[13px] whitespace-nowrap text-[#c9d1ce]">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** /security 001: what Ordinum may be pointed at. */
export function Scope() {
  const { scope } = security;
  return (
    <Section id="scope" aria-labelledby="scope-title" className={SECTION_PAD}>
      <SectionIntro kicker={scope.kicker} title={scope.title} titleId="scope-title" lede={scope.body} />
    </Section>
  );
}

/**
 * /security 002 (#network): network isolation, one row per integration. This table is the only
 * place the site describes isolation; other pages link here instead of generalizing.
 */
export function NetworkIsolation() {
  const n = security.network;
  return (
    <Section id={n.id} variant="charcoal" aria-labelledby={`${n.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={n.kicker} title={n.title} titleMuted={n.titleMuted} titleId={`${n.id}-title`} />
      <Reveal className="mt-12 md:mt-14" amount={0.05}>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Network isolation by integration</caption>
          <thead>
            <tr className="border-b border-line-2">
              <th scope="col" className={cn(mono, "w-[34%] py-3 pr-4 font-normal text-subtle sm:w-[240px]")}>
                Integration
              </th>
              <th scope="col" className={cn(mono, "py-3 font-normal text-subtle")}>
                Isolation
              </th>
            </tr>
          </thead>
          <tbody>
            {n.rows.map((r) => (
              <tr key={r.integration} className="border-b border-line align-top">
                <th scope="row" className="py-4 pr-4 text-[15px] leading-[1.45] font-semibold tracking-[-0.015em] text-text">
                  {r.integration}
                </th>
                <td className="py-4 text-[15px] leading-[1.65] break-words text-muted">
                  <WithCode text={r.isolation} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <div className="mt-8 flex max-w-[860px] flex-col gap-3">
        {n.notes.map((note) => (
          <Caveat key={note}>{note}</Caveat>
        ))}
      </div>
    </Section>
  );
}

/** /security 003: permissions, resource limits, cleanup and artifacts. */
export function Boundaries() {
  const { boundaries } = security;
  return (
    <Section id="boundaries" aria-labelledby="boundaries-title" className={SECTION_PAD}>
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
      <p id="not-a-sandbox" className="mt-8 max-w-[760px] text-[16px] leading-[1.7] text-text">
        {boundaries.sandbox}
      </p>
    </Section>
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
            <p className="mt-3 mb-5 text-[14px] leading-[1.6] text-muted">{r.examples}</p>
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
    <Section id="report" variant="charcoal" aria-labelledby="report-title" className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleId="report-title" lede={c.body} />
      <Button href={c.cta.href} variant="secondary" icon="→" className="mt-8">
        {c.cta.label}
      </Button>
    </Section>
  );
}
