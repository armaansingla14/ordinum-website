import type { SectionVariant } from "@/components/ui/Section";
import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import Container from "@/components/ui/Container";
import { about, topline, type PreviousRole } from "@/lib/content";

/* -------------------------------------------------------------------------- */
/* Helpers (pure string shaping of content.ts copy; no new facts)              */
/* -------------------------------------------------------------------------- */

/** "THE TEAM / 009" -> ["THE TEAM", "009"]; "09 / The team" -> ["09", "The team"]. */
function splitSlash(value: string): [string, string] {
  const i = value.indexOf(" / ");
  return i === -1 ? [value, ""] : [value.slice(0, i), value.slice(i + 3)];
}

/** "Software Engineer Intern, AMD Product Security Office — building ..." -> parts. */
function parseCurrent(current: string) {
  const [head, desc] = current.split(" — ");
  const comma = head?.indexOf(", ") ?? -1;
  if (!head || !desc || comma === -1) return null;
  return {
    title: head.slice(0, comma),
    org: head.slice(comma + 2),
    desc: desc.charAt(0).toUpperCase() + desc.slice(1),
  };
}

const normalize = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();

/** Hide the focus line when it only repeats the team name. */
function showFocus(role: PreviousRole) {
  return normalize(role.focus) !== normalize(role.team);
}

/* -------------------------------------------------------------------------- */
/* Edge icons: small line drawings, 28px, lime stroke                          */
/* -------------------------------------------------------------------------- */

function EdgeIcon({ index }: { index: number }) {
  const common = {
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    className: "size-7",
    "aria-hidden": true,
  } as const;

  if (index === 0) {
    // Fuzzing: an input space sampled, with one path pushing into new territory.
    return (
      <svg {...common}>
        <rect x="2.5" y="2.5" width="23" height="23" stroke="var(--color-line-2)" />
        <path d="M6 21l5-4 3 2 4-6 4-7" strokeLinecap="square" />
        {[
          [7, 8],
          [11, 11],
          [16, 7],
          [8, 14],
          [20, 18],
        ].map(([cx, cy]) => (
          <rect key={`${cx}-${cy}`} x={cx! - 0.75} y={cy! - 0.75} width="1.5" height="1.5" fill="currentColor" stroke="none" />
        ))}
        <rect x="20.5" y="2.5" width="3" height="3" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (index === 1) {
    // Multi-agent: components exchanging state; the handoff is where it breaks.
    return (
      <svg {...common}>
        <rect x="2.5" y="4.5" width="7" height="7" />
        <rect x="18.5" y="4.5" width="7" height="7" />
        <rect x="10.5" y="17.5" width="7" height="7" />
        <path d="M9.5 8h9" strokeDasharray="2 2" />
        <path d="M6 11.5v3.5h4.5M22 11.5v3.5h-4.5" />
      </svg>
    );
  }

  // Production observability: a signal over time, with the failure moved earlier.
  return (
    <svg {...common}>
      <path d="M2.5 25.5h23" stroke="var(--color-line-2)" />
      <path d="M2.5 17h5l2-6 3 11 2.5-8H25.5" strokeLinejoin="miter" />
      <path d="M9.5 3v4M9.5 3l-2 2M9.5 3l2 2" />
    </svg>
  );
}

/**
 * Which documented role each edge comes from. Company and team names are from content.ts
 * (about.founder); the GuestLogix team is shortened so all three footers stay one line.
 */
const EDGE_SOURCES: readonly string[] = [
  "AMD Product Security Office",
  "Geotab · Agent Center of Excellence",
  "GuestLogix · Observability",
];

function edgeSource(index: number): string | null {
  return EDGE_SOURCES[index] ?? null;
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

function FounderCard() {
  const { founder } = about;
  const current = parseCurrent(founder.current);
  const initials = founder.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("");

  return (
    <article
      aria-labelledby="founder-name"
      className="border border-line-2 bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
    >
      {/* Window bar */}
      <div className="flex h-[47px] items-center justify-between gap-4 border-b border-line px-6 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#a5b1ad]">
          Founder <span className="text-line-2">/</span> 01
        </p>
        <a
          href={founder.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group -my-2.5 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-muted transition-colors hover:text-lime"
        >
          LinkedIn
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px">
            ↗
          </span>
          <span className="sr-only"> profile of {founder.name} (opens in a new tab)</span>
        </a>
      </div>

      {/* Identity */}
      <div className="flex items-start gap-5 px-6 py-7 md:gap-6 md:px-8 md:py-9">
        <div
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center border border-line-2 bg-surface font-mono text-[15px] tracking-[0.06em] text-text md:size-16"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 id="founder-name" className="text-[28px] font-semibold leading-[1.1] tracking-title text-text md:text-[34px]">
            {founder.name}
          </h3>
          <p className="label-mono mt-3 text-lime">{founder.role}</p>
        </div>
      </div>

      <CardRow label="Education">
        <p className="text-[15px] leading-[1.6] text-text">{founder.education}</p>
      </CardRow>

      <CardRow label="Now">
        {current ? (
          <>
            <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.02em] text-text">{current.org}</p>
            <p className="mt-1 font-mono text-[12px] tracking-[0.02em] text-muted">{current.title}</p>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.7] text-muted">
              <span aria-hidden="true" className="mr-2 inline-block size-[6px] -translate-y-px bg-lime" />
              {current.desc}
            </p>
          </>
        ) : (
          <p className="text-[15px] leading-[1.7] text-muted">{founder.current}</p>
        )}
      </CardRow>

      <CardRow label="Previously">
        <ul className="-mt-1">
          {founder.previous.map((role, i) => (
            <li
              key={role.company}
              className="grid gap-1.5 border-b border-line/70 py-4 last:border-b-0 last:pb-0 sm:grid-cols-[132px_1fr] sm:gap-6"
            >
              <p className="flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.015em] text-text">
                <span aria-hidden="true" className="font-mono text-[10px] text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {role.company}
              </p>
              <div className="pl-[29px] sm:pl-0">
                <p className="font-mono text-[11px] uppercase leading-[1.6] tracking-[0.08em] text-muted">{role.team}</p>
                {showFocus(role) && <p className="mt-1 text-[14px] leading-[1.6] text-subtle">{role.focus}</p>}
              </div>
            </li>
          ))}
        </ul>
      </CardRow>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export default function About({ variant = "default" }: { variant?: SectionVariant } = {}) {
  const [kickerLabel, kickerIndex] = splitSlash(about.kicker);
  const [toplineIndex, toplineLabel] = splitSlash(topline[8]);
  const disciplines = about.edge.map((e) => e.title);

  return (
    <Section id="about" variant={variant} aria-labelledby="about-heading" contained={false} className="pt-0 md:pt-0">
      <Container>
        <Topline index={toplineIndex} contained={false}>
          {toplineLabel}
        </Topline>
      </Container>

      <Container className="pt-[64px] md:pt-[100px]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Kicker index={kickerIndex || undefined}>{kickerLabel}</Kicker>
            <Heading id="about-heading" className="mt-6 md:mt-7">
              {about.title}
            </Heading>
            <p className="mt-7 max-w-[500px] text-[16px] leading-[1.8] text-muted">{about.lede}</p>

            <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-quiet">
              {disciplines.map((d, i) => (
                <span key={d} className="inline-flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-lime">
                      ×
                    </span>
                  )}
                  {d}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-7">
            <FounderCard />
          </Reveal>
        </div>

        {/* Why we can build this */}
        <div className="mt-20 md:mt-28">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-[22px] font-semibold tracking-title text-text md:text-[26px]">Why we can build this</h3>
            <p className="label-mono text-subtle">Three disciplines / one problem</p>
          </div>

          <Reveal as="ul" stagger={0.08} className="hairline-grid mt-8 md:grid-cols-3">
            {about.edge.map((edge, i) => {
              const source = edgeSource(i);
              return (
                <RevealItem
                  as="li"
                  key={edge.title}
                  className="group flex flex-col bg-surface p-7 transition-colors duration-200 hover:bg-surface-2 md:min-h-[300px] md:p-9"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Same framed tile as the product pillars, so both grids read as one system. */}
                    <span className="grid size-[56px] place-items-center border border-line bg-window text-muted transition-colors duration-300 group-hover:border-line-2 group-hover:text-text">
                      <EdgeIcon index={i} />
                    </span>
                  </div>
                  <h4 className="mt-10 text-[22px] font-semibold leading-[1.2] tracking-title text-text md:mt-12 md:text-[23px]">
                    {edge.title}
                  </h4>
                  <p className="mb-8 mt-4 text-[14px] leading-[1.85] text-muted">{edge.body}</p>
                  {source && (
                    <p className="mt-auto border-t border-line pt-5 font-mono text-[10px] uppercase leading-[1.6] tracking-[0.1em] text-subtle">
                      <span className="text-quiet">From </span>
                      {source}
                    </p>
                  )}
                </RevealItem>
              );
            })}
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}
