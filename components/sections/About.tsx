import type { ReactNode } from "react";
import type { SectionVariant } from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { pad, splitLabel } from "@/components/sections/vision/shared";
import { about, type Founder } from "@/lib/content";
import { pendingProfiles } from "@/lib/team.server";

/** "Data & AI" and "Data and AI" say the same thing; don't print it twice. */
const sameText = (a: string, b: string) => {
  const norm = (x: string) => x.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
  return norm(a) === norm(b);
};

/**
 * Profile to render. A pending profile shows only name and role (approved); its drafted
 * details stay in lib/team.server.ts until the founder confirms.
 */
function resolve(f: Founder): Founder {
  if (f.pendingConfirmation) return { name: f.name, role: f.role, pendingConfirmation: true };
  const extra = (pendingProfiles as Readonly<Record<string, Partial<Founder>>>)[f.name];
  return extra ? { ...extra, ...f } : f;
}

/* -------------------------------------------------------------------------- */
/* Founder card                                                                */
/* -------------------------------------------------------------------------- */

function CardRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line px-6 py-6 md:grid-cols-[148px_1fr] md:gap-8 md:px-8 md:py-7">
      <p className="label-mono pt-[3px] text-subtle">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const nameId = `founder-${index}-name`;
  const initials = founder.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("");

  return (
    <article aria-labelledby={nameId} className="border border-line-2 bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
      {/* Window bar */}
      <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-6 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.13em] text-[#a5b1ad] uppercase">
          {founder.role} <span className="text-line-2">/</span> {pad(index + 1)}
        </p>
        {founder.linkedin && (
        <a
          href={founder.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group -my-2.5 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] tracking-[0.13em] text-muted uppercase transition-colors hover:text-lime"
        >
          LinkedIn
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px">
            ↗
          </span>
          <span className="sr-only"> profile of {founder.name} (opens in a new tab)</span>
        </a>
        )}
      </div>

      {/* Identity (no photos, by policy) */}
      <div className="flex items-start gap-5 px-6 py-7 md:gap-6 md:px-8 md:py-9">
        <div
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center border border-line-2 bg-surface font-mono text-[15px] tracking-[0.06em] text-text md:size-16"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 id={nameId} className="text-[28px] leading-[1.1] font-semibold tracking-title text-text md:text-[34px]">
            {founder.name}
          </h3>
          <p className="label-mono mt-3 text-lime">{founder.role}</p>
          {founder.summary && <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.65] text-muted">{founder.summary}</p>}
        </div>
      </div>

      {founder.education && (
        <CardRow label="Education">
          <p className="text-[15px] leading-[1.6] text-text">{founder.education}</p>
        </CardRow>
      )}

      {founder.current && (
        <CardRow label="Now">
          <p className="text-[15px] leading-[1.65] text-[#c3cbc9]">
            <span aria-hidden="true" className="mr-2 inline-block size-[6px] -translate-y-px bg-lime" />
            {founder.current}
          </p>
        </CardRow>
      )}

      {founder.previous && founder.previous.length > 0 && (
        <CardRow label="Previously">
          <ul className="-mt-1">
            {founder.previous.map((role, i) => (
              <li
                key={role.company}
                className="grid gap-1.5 border-b border-line/70 py-4 last:border-b-0 last:pb-0 sm:grid-cols-[132px_1fr] sm:gap-6"
              >
                <p className="flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.015em] text-text">
                  <span aria-hidden="true" className="font-mono text-[10px] text-subtle">
                    {pad(i + 1)}
                  </span>
                  {role.company}
                </p>
                <div className="pl-[29px] sm:pl-0">
                  <p className="font-mono text-[11px] leading-[1.6] tracking-[0.08em] text-muted uppercase">{role.team}</p>
                  {sameText(role.focus, role.team) || (
                    <p className="mt-1 text-[14px] leading-[1.6] text-subtle">{role.focus}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardRow>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * /about: the team. Both co-founders get a card (name and title are approved). A profile with
 * `pendingConfirmation: true` (lib/content.ts) shows name and role only; its drafted details
 * stay server-side (lib/team.server.ts) until the founder confirms.
 */
export default function About({ variant = "charcoal" }: { variant?: SectionVariant } = {}) {
  const { team, independence } = about;
  const [label, index] = splitLabel(team.kicker);
  const cards = about.founders.map(resolve);

  return (
    <Section id="team" variant={variant} aria-labelledby="team-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="flex flex-col lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="team-title" className="mt-6 md:mt-7">
            {team.title}
          </Heading>
          <p className="mt-7 max-w-[460px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{team.lede}</p>

          {/* Independence note: discreet, but always visible (not hidden on small screens). */}
          <aside aria-label="Independence" className="mt-10 max-w-[460px] border-l border-line-2 pl-5">
            <p className="label-mono text-subtle">Independence</p>
            <p className="mt-2 text-[13px] leading-[1.7] text-muted">{independence}</p>
          </aside>
        </Reveal>

        <Reveal delay={0.06} className="space-y-6 lg:col-span-7">
          {cards.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
