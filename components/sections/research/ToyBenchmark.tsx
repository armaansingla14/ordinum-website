import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { research } from "@/lib/content";
import { PRODUCT_SOURCE, TOY_ARMS_SOURCE, TOY_CLASS_TOTAL, toyArms } from "@/lib/evidence";
import { ClassChip, Provenance, Tag } from "./badges";
import { Bullets, SectionHead, SubHead, TargetAside } from "./shared";

const toy = research.toy;
const pos = (v: number) => `${(v / TOY_CLASS_TOTAL) * 100}%`;
/** 10 is left out so it never collides with the dashed 11 (maximum) label. */
const TICKS = [0, 2, 4, 6, 8];

/** Per-strategy means with 95% bootstrap intervals on the full 0-11 class scale (no truncated axis). */
function ClassChart() {
  const summary = toyArms
    .map((a) => `${a.arm}: mean ${a.mean.toFixed(2)}, 95% CI ${a.ci[0].toFixed(2)} to ${a.ci[1].toFixed(2)}`)
    .join("; ");
  return (
    <figure className="flex min-w-0 flex-col">
      <div className="border border-line-2 bg-window">
        <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-3 font-mono text-[10px] tracking-[0.08em] text-[#a5b1ad] uppercase sm:px-5">
          <span>Distinct confirmed classes per campaign</span>
          <span className="text-[#8a9894]">of {TOY_CLASS_TOTAL} planted</span>
        </div>
        <div
          role="img"
          aria-label={`Mean distinct confirmed failure classes per campaign, out of ${TOY_CLASS_TOTAL}, with 95% bootstrap intervals. ${summary}.`}
          className="px-4 pt-5 pb-5 sm:px-5"
        >
          <div aria-hidden="true">
            {toyArms.map((a) => (
              <div key={a.arm} className="grid grid-cols-1 gap-y-1.5 py-2 sm:grid-cols-[150px_minmax(0,1fr)_136px] sm:items-center sm:gap-x-4">
                <span className="flex items-baseline justify-between gap-3 font-mono text-[11px] text-[#d6dedb] sm:block">
                  <span>{a.arm}</span>
                  <span className="tabular-nums whitespace-nowrap text-[#8a9894] sm:hidden">
                    {a.mean.toFixed(2)} [{a.ci[0].toFixed(2)}–{a.ci[1].toFixed(2)}]
                  </span>
                </span>
                <span className="relative block h-5">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute inset-y-0 w-px bg-line/70" style={{ left: pos(t) }} />
                  ))}
                  <span className="absolute inset-y-0 w-px border-l border-dashed border-line-2" style={{ left: pos(TOY_CLASS_TOTAL) }} />
                  {/* interval */}
                  <span
                    className="absolute top-1/2 h-px -translate-y-1/2 bg-text"
                    style={{ left: pos(a.ci[0]), width: `calc(${pos(a.ci[1])} - ${pos(a.ci[0])})` }}
                  />
                  <span className="absolute top-1/2 h-[9px] w-px -translate-y-1/2 bg-text" style={{ left: pos(a.ci[0]) }} />
                  <span className="absolute top-1/2 h-[9px] w-px -translate-x-px -translate-y-1/2 bg-text" style={{ left: pos(a.ci[1]) }} />
                  {/* mean */}
                  <span
                    className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 border border-window bg-text"
                    style={{ left: pos(a.mean) }}
                  />
                </span>
                <span className="hidden text-right font-mono text-[11px] tabular-nums whitespace-nowrap text-[#8a9894] sm:block">
                  {a.mean.toFixed(2)} [{a.ci[0].toFixed(2)}–{a.ci[1].toFixed(2)}]
                </span>
              </div>
            ))}
            {/* Axis */}
            <div className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)_136px] sm:gap-x-4">
              <span className="hidden sm:block" />
              <span className="relative block h-5 border-t border-line">
                {TICKS.map((t) => (
                  <span
                    key={t}
                    className={cn("absolute top-1.5 font-mono text-[10px] tabular-nums text-[#8a9894]", t !== 0 && "-translate-x-1/2")}
                    style={{ left: pos(t) }}
                  >
                    {t}
                  </span>
                ))}
                <span className="absolute top-1.5 -translate-x-full font-mono text-[10px] text-[#8a9894]" style={{ left: pos(TOY_CLASS_TOTAL) }}>
                  {TOY_CLASS_TOTAL}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 space-y-1">
        <Provenance kind="Reported result">
          {TOY_ARMS_SOURCE} @ {PRODUCT_SOURCE.commitShort}
        </Provenance>
        <p className="font-mono text-[10.5px] leading-[1.7] tracking-[0.04em] text-[#8a9894]">
          Intervals are per strategy and not adjusted for multiple comparisons; the tests below are Holm-corrected. Seven of the
          eleven classes are found by every campaign of both main strategies, so the metric saturates.
        </p>
      </figcaption>
    </figure>
  );
}

function Verdict({ v }: { v: "Supported" | "Not supported" }) {
  return <Tag tone={v === "Supported" ? "lime" : "neutral"}>{v}</Tag>;
}

export default function ToyBenchmark() {
  return (
    <Section id={toy.id} aria-labelledby="toy-title">
      <SectionHead id="toy-title" kicker={toy.kicker} title={toy.title} titleMuted={toy.titleMuted} lede={toy.lede} aside={<TargetAside id="toy" />} />

      {/* Plain result first, with its label; the statistics follow further down. */}
      <Reveal className="mt-14 md:mt-20">
        <ClassChip classes={["positive-control"]} label={toy.label} />
        <p className="mt-5 max-w-[820px] border-l border-lime/70 pl-5 text-[16px] leading-[1.75] text-[#c9d1ce]">{toy.plainResult}</p>
      </Reveal>

      <Reveal className="hairline-grid mt-10 grid-cols-1 md:grid-cols-2" amount={0.15}>
        <div className="bg-surface p-6 sm:p-8">
          <h3 className="label-mono text-lime">What this supports</h3>
          <Bullets items={toy.supports} mark="solid" className="mt-5" />
        </div>
        <div className="bg-bg p-6 sm:p-8">
          <h3 className="label-mono text-text">What this does not support</h3>
          <Bullets items={toy.doesNotSupport} mark="dashed" className="mt-5" />
        </div>
      </Reveal>

      <div className="mt-14 grid gap-10 border-t border-line pt-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="space-y-8 lg:col-span-5">
          <div>
            <SubHead>What was compared</SubHead>
            <p className="mt-3 text-[15px] leading-[1.75] text-muted">{toy.target}</p>
            <ul className="mt-5 space-y-2.5">
              {toy.design.map((d) => (
                <li key={d} className="flex gap-3 text-[14.5px] leading-[1.6] text-text">
                  <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-line-2" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubHead>What was measured</SubHead>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{toy.metric}</p>
          </div>
        </Reveal>
        <Reveal className="min-w-0 lg:col-span-7" delay={0.06}>
          <ClassChart />
        </Reveal>
      </div>

      {/* Pre-registered comparisons */}
      <Reveal className="mt-14 md:mt-16" amount={0.1}>
        <SubHead id="toy-tests">Pre-registered comparisons · Holm-corrected</SubHead>
        {/* Table from md up */}
        <div className="mt-4 hidden border border-line md:block">
          <table aria-labelledby="toy-tests" className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">
                <th scope="col" className="px-5 py-3 font-normal">ID</th>
                <th scope="col" className="px-5 py-3 font-normal">Comparison</th>
                <th scope="col" className="px-5 py-3 font-normal">Mean classes</th>
                <th scope="col" className="px-5 py-3 font-normal">Holm p</th>
                <th scope="col" className="px-5 py-3 font-normal">A12</th>
                <th scope="col" className="px-5 py-3 font-normal">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {toy.rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-5 py-3.5 font-mono text-[12px] font-normal text-lime">{r.id}</th>
                  <td className="px-5 py-3.5 text-[14px] text-text">{r.comparison}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums text-muted">{r.result}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums text-muted">{r.holmP}</td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums text-muted">{r.a12}</td>
                  <td className="px-5 py-3.5"><Verdict v={r.verdict} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Cards below md */}
        <ul className="hairline-grid mt-4 grid-cols-1 md:hidden">
          {toy.rows.map((r) => (
            <li key={r.id} className="bg-surface p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[12px] text-lime">{r.id}</span>
                <Verdict v={r.verdict} />
              </div>
              <p className="mt-2 text-[14.5px] leading-[1.5] text-text">{r.comparison}</p>
              <dl className="mt-3 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.7fr)] gap-3 font-mono text-[11px] tabular-nums">
                <div>
                  <dt className="text-[10px] tracking-[0.08em] text-subtle uppercase">Mean classes</dt>
                  <dd className="mt-1 whitespace-nowrap text-muted">{r.result.replace(/ classes$/, "")}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.08em] text-subtle uppercase">Holm p</dt>
                  <dd className="mt-1 text-muted">{r.holmP}</dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.08em] text-subtle uppercase">A12</dt>
                  <dd className="mt-1 text-muted">{r.a12}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[900px] border-l border-line-2 pl-5 text-[15px] leading-[1.75] text-muted">{toy.narrowResult}</p>
      </Reveal>

      <Reveal className="mt-8">
        <ul className="flex flex-col gap-2 font-mono text-[11px] leading-[1.7] text-subtle">
          {toy.notes.map((n) => (
            <li key={n}>
              <span aria-hidden="true" className="text-line-2">— </span>
              {n}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
