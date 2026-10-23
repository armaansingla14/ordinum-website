import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import CoverageBars from "@/components/visuals/CoverageBars";
import FaultPathWindow from "@/components/visuals/FaultPathWindow";
import MinimizationTrace from "@/components/visuals/MinimizationTrace";
import { cn } from "@/lib/cn";
import { research, topline } from "@/lib/content";

/** "ENGINEERING EVIDENCE / 006" -> ["ENGINEERING EVIDENCE", "006"] */
function splitLabel(s: string): [string, string] {
  const i = s.lastIndexOf(" / ");
  return i === -1 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)];
}

type StatusKind = "built" | "measured" | "notyet" | "next";

function statusKind(tag: string): StatusKind {
  const t = tag.toUpperCase();
  if (t === "BUILT") return "built";
  if (t === "MEASURED") return "measured";
  if (t === "NOT YET") return "notyet";
  return "next";
}

const STATUS_STYLE: Record<StatusKind, { tag: string; text: string }> = {
  built: { tag: "text-lime", text: "text-text" },
  measured: { tag: "text-lime", text: "text-text" },
  notyet: { tag: "text-muted", text: "text-muted" },
  next: { tag: "text-subtle", text: "text-muted" },
};

/** Square status glyph: filled = built, outlined = measured, dashed = not yet, arrow = next. */
function StatusGlyph({ kind }: { kind: StatusKind }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0 self-center sm:row-span-1">
      {kind === "built" && (
        <>
          <rect x="0.5" y="0.5" width="11" height="11" fill="#c1e29e" />
          <path d="M3 6.2 5.1 8.2 9 3.9" fill="none" stroke="#0b0e10" strokeWidth="1.5" />
        </>
      )}
      {kind === "measured" && (
        <>
          <rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="#c1e29e" />
          <rect x="3.5" y="3.5" width="5" height="5" fill="#c1e29e" />
        </>
      )}
      {kind === "notyet" && (
        <rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="#7d8c8a" strokeDasharray="2 2" />
      )}
      {kind === "next" && <path d="M2 6h7.5M6.5 3l3 3-3 3" fill="none" stroke="#7d8c8a" strokeWidth="1.2" />}
    </svg>
  );
}

export default function Research() {
  const [kicker, kickerIndex] = splitLabel(research.kicker);
  const [lineIndex, lineLabel] = topline[5].split(" / ");
  const m = research.minimization;
  const violationTick = Math.max(...research.faultPath.events.map((e) => e.t));

  // Status lines are "TAG / text": split on the first separator.
  const status = research.status.map((line) => {
    const i = line.indexOf(" / ");
    const tag = i === -1 ? "" : line.slice(0, i);
    return { tag, text: i === -1 ? line : line.slice(i + 3), kind: statusKind(tag) };
  });

  return (
    <Section id="research" variant="charcoal" aria-labelledby="research-title" contained={false} className="pt-0 md:pt-0">
      <Container>
        <Topline index={lineIndex} contained={false}>
          {lineLabel}
        </Topline>
      </Container>

      <Container className="pt-[64px] md:pt-[100px]">
        {/* Header: narrative + status ledger */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <Kicker index={kickerIndex}>{kicker}</Kicker>
            <Heading id="research-title" muted={research.titleMuted} className="mt-6">
              {research.title}
            </Heading>
            <p className="mt-7 max-w-[560px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{research.lede}</p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-2" delay={0.08}>
            <div className="border border-line bg-surface">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
                <h3 className="label-mono text-muted">Status</h3>
                <span className="label-mono text-[10px] text-subtle">Research preview</span>
              </div>
              <ul className="divide-y divide-line">
                {status.map((s) => {
                  const st = STATUS_STYLE[s.kind];
                  return (
                    <li
                      key={s.text}
                      className="grid grid-cols-[12px_minmax(0,1fr)] gap-x-3.5 gap-y-1 px-5 py-3.5 sm:grid-cols-[12px_64px_minmax(0,1fr)] sm:items-baseline"
                    >
                      <StatusGlyph kind={s.kind} />
                      <span className={cn("label-mono text-[11px] sm:text-[10px]", st.tag)}>{s.tag}</span>
                      <p
                        className={cn(
                          "col-start-2 min-w-0 text-[14px] leading-[1.55] tracking-[-0.005em] sm:col-start-3",
                          st.text,
                        )}
                      >
                        {s.text}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Headline metrics */}
        <Reveal as="ul" stagger={0.08} amount={0.15} className="hairline-grid mt-16 grid-cols-1 md:mt-24 md:grid-cols-3">
          {research.metrics.map((metric) => {
            const isTie = metric.value.includes("/");
            return (
              <RevealItem as="li" key={metric.label} className="relative flex flex-col bg-surface p-6 sm:p-8">
                {!isTie && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-lime" />}
                <div className="flex h-6 items-center justify-between gap-4">
                  <h3 className="label-mono text-muted">{metric.label}</h3>
                  {isTie ? (
                    <span className="label-mono border border-line-2 px-2 py-0 text-[10px] leading-[22px] text-text">
                      Tie with random
                    </span>
                  ) : (
                    <span className="label-mono text-[10px] text-subtle">vs. random</span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-8 font-semibold leading-[0.9] tracking-hero tabular-nums",
                    "text-[clamp(64px,7.4vw,104px)]",
                    isTie ? "text-text" : "text-lime",
                  )}
                >
                  {metric.value}
                </p>
                <p className="mt-6 max-w-[360px] text-[15px] leading-[1.65] text-muted">{metric.caption}</p>
                <span aria-hidden="true" className="min-h-7 flex-1" />
                <p className="border-t border-line pt-4 font-mono text-[10px] leading-[1.7] tracking-[0.1em] text-subtle uppercase">
                  {metric.footnote}
                </p>
              </RevealItem>
            );
          })}
        </Reveal>

        {/* Benchmarks */}
        <Reveal className="mt-16 md:mt-24" amount={0.1}>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line pb-5">
            <h3 className="text-[24px] font-semibold tracking-title text-text md:text-[28px]">Benchmarks</h3>
            <p className="label-mono text-[10px] text-subtle">
              {research.campaign.seeds} seeds × {research.campaign.executionsPerCampaign} executions / campaign
            </p>
          </div>
          <div className="hairline-grid mt-8 grid-cols-1 lg:grid-cols-2">
            <div className="bg-surface p-6 sm:p-8">
              <CoverageBars
                title={research.charts.coverage.title}
                caption={research.charts.coverage.caption}
                bars={research.bars.coverage}
                unit="coverage keys"
              />
            </div>
            <div className="bg-surface p-6 sm:p-8">
              <CoverageBars
                title={research.charts.trajectories.title}
                caption={research.charts.trajectories.caption}
                bars={research.bars.trajectories}
                notApplicable={["Scripted suite"]}
                unit="unique trajectories"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.1em] text-subtle uppercase" aria-hidden="true">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-4 bg-lime" /> Feedback-guided
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-4 bg-[#7e9096]" /> Random fault injection
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="bar-scripted h-2 w-4" /> Scripted suite
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="relative h-2 w-4">
                <span className="absolute inset-x-0 top-1/2 h-px bg-text" />
                <span className="absolute inset-y-0 left-0 w-px bg-text" />
                <span className="absolute inset-y-0 right-0 w-px bg-text" />
              </span>
              ±1 SD
            </span>
          </div>
        </Reveal>

        {/* One failure, start to finish: the trace and the grid world tell one story side by side. */}
        <div className="mt-20 md:mt-24">
          <Reveal className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-5">
              <p className="label-mono text-subtle">Worked example</p>
              <h3 className="mt-4 text-[clamp(28px,2.6vw,36px)] font-semibold leading-[1.12] tracking-title text-text text-balance">
                {m.title}
              </h3>
            </div>
            <div className="lg:col-span-7">
              <p className="max-w-[620px] text-[15px] leading-[1.75] text-muted">{m.summary}</p>
              <p className="mt-3 inline-flex items-center gap-2.5 font-mono text-[12px] text-muted">
                <span aria-hidden="true" className="size-[7px] rounded-full bg-orange" />
                Violates <span className="text-orange">{m.invariant}</span>
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-8">
            <Reveal className="min-w-0 lg:col-span-7" amount={0.1}>
              <MinimizationTrace
                chips={m.chips}
                faultsBefore={m.faultsBefore}
                faultsAfter={m.faultsAfter}
                invariant={m.invariant}
                violationTick={violationTick}
                regressionLabel={m.regressionLabel}
                replay={m.replay}
                note={m.note}
              />
            </Reveal>
            {/* Desktop only; on small screens the trace carries the same story. */}
            <Reveal className="hidden min-w-0 lg:col-span-5 lg:block" delay={0.08} amount={0.1}>
              <FaultPathWindow
                compact
                title={research.faultPath.title}
                events={research.faultPath.events}
                note={research.faultPath.note}
              />
            </Reveal>
          </div>
        </div>

        {/* Methodology + caveats: stated in full, not tucked away */}
        <Reveal className="mt-16 md:mt-20" amount={0.15}>
          <div className="hairline-grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="bg-bg p-6 sm:p-8">
              <h3 className="label-mono text-muted">Methodology</h3>
              <p className="mt-5 text-[15px] leading-[1.8] text-muted">{research.methodology}</p>

            </div>
            <div className="bg-surface p-6 sm:p-8">
              <h3 className="label-mono text-text">Caveats</h3>
              <ol className="mt-5 space-y-4">
                {research.caveats.map((c, i) => (
                  <li key={c} className="flex gap-4 text-[15px] leading-[1.65] text-text">
                    <span aria-hidden="true" className="mt-[3px] font-mono text-[11px] text-subtle tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
              
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
