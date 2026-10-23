import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
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
            <p className="mt-6 font-mono text-[10px] leading-[1.7] tracking-[0.1em] text-subtle uppercase">
              Source: {research.asOf}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-2" delay={0.08}>
            <div className="border border-line bg-surface">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
                <h3 className="label-mono text-muted">Status</h3>
                <span className="label-mono text-[10px] text-subtle">Research stage</span>
              </div>
              <ul className="divide-y divide-line">
                {status.map((s) => {
                  const st = STATUS_STYLE[s.kind];
                  return (
                    <li
                      key={s.text}
                      className="grid grid-cols-[12px_minmax(0,1fr)] gap-x-3.5 gap-y-1 px-5 py-3.5 sm:grid-cols-[12px_72px_minmax(0,1fr)] sm:items-baseline"
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

        {/* Studies: setup, results with verdicts, what each supports and does not */}
        <Reveal as="ul" stagger={0.08} amount={0.1} className="hairline-grid mt-16 grid-cols-1 md:mt-24 lg:grid-cols-2">
          {research.studies.map((study) => (
            <RevealItem as="li" key={study.label} className="flex flex-col bg-surface p-6 sm:p-8">
              <h3 className="label-mono text-lime">{study.label}</h3>
              <p className="mt-5 text-[15px] leading-[1.7] text-muted">{study.setup}</p>
              <dl className="mt-7 divide-y divide-line border-y border-line">
                {study.results.map((r) => (
                  <div key={r.label} className="grid gap-1.5 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-6">
                    <dt className="text-[14px] leading-[1.5] text-muted">{r.label}</dt>
                    <dd>
                      <span className="block font-mono text-[14px] tabular-nums text-text">{r.value}</span>
                      <span className="mt-1 block text-[13px] leading-[1.5] text-subtle">{r.verdict}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label-mono text-[10px] text-lime">Supports</p>
                  <p className="mt-2.5 text-[14px] leading-[1.65] text-text">{study.supports}</p>
                </div>
                <div>
                  <p className="label-mono text-[10px] text-muted">Does not support</p>
                  <p className="mt-2.5 text-[14px] leading-[1.65] text-muted">{study.notSupported}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        {/* Limitations + withdrawn results: stated in full, not tucked away */}
        <Reveal className="mt-16 md:mt-20" amount={0.15}>
          <div className="hairline-grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="bg-surface p-6 sm:p-8">
              <h3 className="label-mono text-text">What we have not shown</h3>
              <ol className="mt-5 space-y-4">
                {research.limitations.map((c, i) => (
                  <li key={c} className="flex gap-4 text-[15px] leading-[1.65] text-text">
                    <span aria-hidden="true" className="mt-[3px] font-mono text-[11px] text-subtle tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-bg p-6 sm:p-8" data-withdrawn="">
              <h3 className="label-mono text-muted">Withdrawn results</h3>
              <p className="mt-5 text-[15px] leading-[1.8] text-muted">{research.withdrawn}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
