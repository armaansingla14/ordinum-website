import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Caveat, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
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

/** A titled row list (deployment, data handling). */
function Rows({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <Reveal as="ul" stagger={0.04} amount={0.05} className="mt-8 border-t border-line md:mt-10">
      {items.map((it) => (
        <RevealItem key={it.title} as="li" className="grid gap-x-10 gap-y-2 border-b border-line py-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <h3 className="text-[16.5px] leading-[1.35] font-semibold tracking-[-0.02em] text-text">{it.title}</h3>
          <p className="max-w-[820px] text-[15px] leading-[1.7] text-muted">{it.body}</p>
        </RevealItem>
      ))}
    </Reveal>
  );
}

/** /security 001 (#deployment): where runs execute, what they may target, who runs them. */
export function Deployment() {
  const d = security.deployment;
  return (
    <Section id={d.id} aria-labelledby={`${d.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={d.kicker} title={d.title} titleMuted={d.titleMuted} titleId={`${d.id}-title`} />
      <Rows items={d.items} />
    </Section>
  );
}

/** /security 002 (#data): run data, published evidence and the contact form. */
export function DataHandling() {
  const d = security.data;
  return (
    <Section id={d.id} variant="charcoal" aria-labelledby={`${d.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={d.kicker} title={d.title} titleId={`${d.id}-title`} />
      <Rows items={d.items} />
      <div className="mt-6 flex max-w-[860px] flex-col gap-3">
        <Caveat>{d.caveat}</Caveat>
        <p className="text-[14px] leading-[1.6] text-muted">
          How we handle personal information:{" "}
          <Link href={d.privacy.href} className="text-text underline decoration-line-2 underline-offset-4 hover:text-lime">
            {d.privacy.label}
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}

/**
 * /security 003 (#network): network isolation, one row per integration. This table is the only
 * place the site describes isolation; other pages link here instead of generalizing.
 */
export function NetworkIsolation() {
  const n = security.network;
  return (
    <Section id={n.id} aria-labelledby={`${n.id}-title`} className={SECTION_PAD}>
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

/** /security 004: permissions, resource limits and cleanup. */
export function Boundaries() {
  const { boundaries } = security;
  return (
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
      <p id="not-a-sandbox" className="mt-8 max-w-[760px] text-[16px] leading-[1.7] text-text">
        {boundaries.sandbox}
      </p>
    </Section>
  );
}

/** /security 005 (#ci): what has run in hosted CI, in one sentence. */
export function HostedCi() {
  const c = security.ci;
  return (
    <Section id={c.id} aria-labelledby={`${c.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleId={`${c.id}-title`} lede={c.body} />
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
