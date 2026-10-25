import type { ReactNode } from "react";
import type { SectionVariant } from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { pad, splitLabel } from "@/components/sections/vision/shared";
import { about, type Founder } from "@/lib/content";

/**
 * Fields to render. Both profiles are approved (2026-10-24); the guard stays so a future
 * profile marked `pendingConfirmation: true` shows name and role only.
 */
function visible(f: Founder): Founder {
  return f.pendingConfirmation ? { name: f.name, role: f.role, pendingConfirmation: true } : f;
}

/** Skip the Education row when the summary already names the institution. */
function educationIsRedundant(f: Founder): boolean {
  if (!f.education || !f.summary) return false;
  const institution = f.education.split(",").pop()?.trim().toLowerCase();
  return !!institution && f.summary.toLowerCase().includes(institution);
}

function CardRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line px-6 py-6 md:grid-cols-[132px_1fr] md:gap-8 md:px-8">
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
    <article aria-labelledby={nameId} className="border border-line-2 bg-window">
      <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-6 md:px-8">
        <p aria-hidden="true" className="font-mono text-[11px] tracking-[0.13em] text-[#a5b1ad] uppercase">
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
      <div className="flex items-start gap-5 px-6 py-7 md:gap-6 md:px-8 md:py-8">
        <div
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center border border-line-2 bg-surface font-mono text-[15px] tracking-[0.06em] text-text"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 id={nameId} className="text-[26px] leading-[1.1] font-semibold tracking-title text-text md:text-[30px]">
            {founder.name}
          </h3>
          <p className="label-mono mt-3 text-lime">{founder.role}</p>
          {founder.summary && <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.65] text-[#c3cbc9]">{founder.summary}</p>}
        </div>
      </div>

      {founder.education && !educationIsRedundant(founder) && (
        <CardRow label="Education">
          <p className="text-[15px] leading-[1.6] text-text">{founder.education}</p>
        </CardRow>
      )}

      {founder.experience && founder.experience.length > 0 && (
        <CardRow label="Experience">
          <ul className="space-y-2.5">
            {founder.experience.map((line) => (
              <li key={line} className="flex items-baseline gap-3 text-[14px] leading-[1.65] text-muted">
                <span aria-hidden="true" className="relative top-[-2px] inline-block size-[5px] shrink-0 bg-line-2" />
                {line}
              </li>
            ))}
          </ul>
        </CardRow>
      )}
    </article>
  );
}

/**
 * /about 03: the team. Both co-founders, with approved details only (no photos, no résumé
 * blocks), and the independence note, always visible.
 */
export default function About({ variant = "charcoal" }: { variant?: SectionVariant } = {}) {
  const { team, independence } = about;
  const [label, index] = splitLabel(team.kicker);
  const founders = about.founders.map(visible);

  return (
    <Section id="team" variant={variant} aria-labelledby="team-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="flex flex-col lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="team-title" className="mt-6 md:mt-7">
            {team.title}
          </Heading>
          <p className="mt-7 max-w-[460px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{team.lede}</p>

          <aside aria-label="Independence" className="mt-10 max-w-[460px] border-l border-line-2 pl-5">
            <p className="label-mono text-subtle">Independence</p>
            <p className="mt-2 text-[13px] leading-[1.7] text-muted">{independence}</p>
          </aside>
        </Reveal>

        <Reveal delay={0.06} className="space-y-6 lg:col-span-7">
          {founders.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
