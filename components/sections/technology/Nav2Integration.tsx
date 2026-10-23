import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { FACT_SOURCE, technology } from "@/lib/content";
import { StatusChip, pad, splitLabel } from "./shared";

/* Local copy (requested move to lib/content.ts as technology.nav2.{panel,links}). */
const COPY = {
  panelTitle: "ROS 2 / Nav2 adapter",
  faultsLabel: "Fault kinds",
  faultsSource: "src/ordinum/targets/nav2/mutations.py",
  perEpisodeLabel: "Invariants checked per episode",
  perCampaignLabel: "Checked once per campaign",
  invariantsSource: "src/ordinum/targets/nav2/invariants.py",
  limitsLabel: "Limits",
  researchLink: { label: "Read the Nav2 pilot results", href: "/research" },
} as const;

function Chips({
  items,
  tone,
}: {
  items: readonly string[];
  tone: "lime" | "neutral";
}) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {items.map((f) => (
        <li key={f}>
          <code
            className={
              tone === "lime"
                ? "inline-flex items-center gap-2 border border-lime/30 bg-lime/[0.06] px-2 py-[6px] font-mono text-[11px] leading-none text-lime sm:text-[12px]"
                : "inline-flex items-center gap-2 border border-line-2 px-2 py-[6px] font-mono text-[11px] leading-none text-text sm:text-[12px]"
            }
          >
            <span
              aria-hidden="true"
              className={
                tone === "lime" ? "size-[4px] bg-lime" : "size-[4px] bg-muted"
              }
            />
            {f}
          </code>
        </li>
      ))}
    </ul>
  );
}

function PanelLabel({
  label,
  count,
  source,
}: {
  label: string;
  count: number;
  source: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
        {label} <span className="text-subtle">/ {pad(count)}</span>
      </p>
      <p className="font-mono text-[10px] tracking-[0.04em] text-subtle">
        {source}
      </p>
    </div>
  );
}

/** First integration: what the Nav2 adapter does, its exact fault vocabulary and invariants, and its limits. */
export default function Nav2Integration() {
  const n = technology.nav2;
  const [label, index] = splitLabel(n.kicker);

  return (
    <Section id="nav2" aria-labelledby="nav2-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14 xl:gap-20">
        <Reveal>
          <Kicker index={index}>{label}</Kicker>
          <Heading id="nav2-title" className="mt-6">
            {n.title}
          </Heading>
          <p className="mt-8 max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">
            {n.body}
          </p>

          <div className="mt-10 max-w-[540px] border-t border-line pt-6">
            <h3 className="font-mono text-[10px] tracking-[0.13em] text-quiet uppercase">
              {COPY.limitsLabel}
            </h3>
            <ul className="mt-4 grid gap-3">
              {n.limits.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-3 text-[14px] leading-[1.7] text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[10px] h-px w-3 shrink-0 bg-line-2"
                  />
                  {l}
                </li>
              ))}
            </ul>
            <Link
              href={COPY.researchLink.href}
              className="group mt-6 inline-flex min-h-11 items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-lime uppercase"
            >
              <span className="border-b border-lime/40 pb-0.5 transition-colors duration-200 group-hover:border-lime">
                {COPY.researchLink.label}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <figure className="border border-[#3c4749] bg-window shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
              <figcaption className="font-mono text-[10px] tracking-[0.1em] text-[#a5b1ad] uppercase">
                {COPY.panelTitle}
              </figcaption>
              <StatusChip status="implemented" />
            </div>

            <div className="grid gap-7 px-4 py-6 sm:px-6 sm:py-7">
              <div>
                <PanelLabel
                  label={COPY.faultsLabel}
                  count={n.faultKinds.length}
                  source={COPY.faultsSource}
                />
                <Chips items={n.faultKinds} tone="lime" />
              </div>
              <div className="border-t border-line pt-6">
                <PanelLabel
                  label={COPY.perEpisodeLabel}
                  count={n.invariants.perEpisode.length}
                  source={COPY.invariantsSource}
                />
                <Chips items={n.invariants.perEpisode} tone="neutral" />
                <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                  {COPY.perCampaignLabel}{" "}
                  <span className="text-subtle">
                    / {pad(n.invariants.perCampaign.length)}
                  </span>
                </p>
                <Chips items={n.invariants.perCampaign} tone="neutral" />
              </div>
            </div>

            <p className="border-t border-line px-4 py-3 font-mono text-[10px] leading-[1.6] tracking-[0.08em] text-subtle uppercase sm:px-6">
              Names as in the product repo <span aria-hidden="true">@</span>
              <span className="sr-only">at commit</span>{" "}
              {FACT_SOURCE.commitShort}
            </p>
          </figure>
        </Reveal>
      </div>

      {/* Why this target first, and what carries over to other kinds of systems. */}
      <Reveal className="mt-16 md:mt-20">
        <h3 id="why-ros2-first" className="text-[22px] leading-[1.2] font-semibold tracking-title text-text md:text-[26px]">
          {technology.whyFirst.title}
        </h3>
        <ul className="hairline-grid mt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" aria-labelledby="why-ros2-first">
          {technology.whyFirst.points.map((p, i) => (
            <li key={p.title} className="bg-surface p-6">
              <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
              <h4 className="mt-4 text-[16px] leading-[1.3] font-semibold tracking-title text-text">{p.title}</h4>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex max-w-[860px] gap-3 text-[14.5px] leading-[1.7] text-muted">
          <span aria-hidden="true" className="mt-[8px] size-[7px] shrink-0 border border-dashed border-subtle" />
          {technology.whyFirst.next}
        </p>
      </Reveal>
    </Section>
  );
}
