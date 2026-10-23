"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import type { Bar, Strategy } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type CoverageBarsProps = {
  title: string;
  caption: string;
  bars: readonly Bar[];
  /** Strategies with no value for this metric, rendered as an explicit "n/a" row. */
  notApplicable?: readonly string[];
  /** Unit word used in the accessible summary, e.g. "coverage keys". */
  unit: string;
  className?: string;
};

const STRATEGY_STYLE: Record<Strategy, { bar: string; value: string; label: string }> = {
  feedback: { bar: "bg-lime", value: "text-lime", label: "text-text" },
  random: { bar: "bg-[#7e9096]", value: "text-muted", label: "text-muted" },
  scripted: { bar: "bar-scripted", value: "text-muted", label: "text-muted" },
};

/** Round a step up to 1, 2, 2.5, 3, 4, 5 or 10 × 10^k so the axis reads cleanly. */
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / pow;
  const nice = [1, 2, 2.5, 3, 4, 5, 10].find((n) => n >= unit) ?? 10;
  return nice * pow;
}

function axisFor(bars: readonly Bar[]) {
  const top = Math.max(...bars.map((b) => b.mean + (b.sd ?? 0)));
  const step = niceStep(top / 4);
  const max = Math.ceil(top / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return { max, ticks };
}

const fmt = (n: number, digits: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Means with a standard deviation keep one decimal (2.0, not 2); bare integers stay integers. */
function digitsFor(bar: Bar) {
  return bar.sd !== undefined || !Number.isInteger(bar.mean) ? 1 : 0;
}

function valueText(bar: Bar) {
  const d = digitsFor(bar);
  return bar.sd !== undefined ? `${fmt(bar.mean, d)} ± ${fmt(bar.sd, 1)}` : fmt(bar.mean, d);
}

const pct = (v: number, max: number) => `${(v / max) * 100}%`;

/**
 * Horizontal bars drawn to scale from zero, with ±1 SD whiskers.
 * The drawing is a single role="img" with a spoken summary; the exact numbers are
 * also exposed as a visually hidden table.
 */
export default function CoverageBars({ title, caption, bars, notApplicable = [], unit, className }: CoverageBarsProps) {
  const titleId = useId();
  const { max, ticks } = axisFor(bars);

  const summary =
    `${title}. ` +
    bars
      .map((b) =>
        b.sd !== undefined
          ? `${b.label}: ${fmt(b.mean, digitsFor(b))} ${unit}, plus or minus ${fmt(b.sd, 1)}`
          : `${b.label}: ${fmt(b.mean, digitsFor(b))} ${unit}`,
      )
      .join("; ") +
    (notApplicable.length ? `; ${notApplicable.join(", ")}: not applicable` : "") +
    ".";

  return (
    <figure className={cn("flex flex-col", className)} aria-labelledby={titleId}>
      <div className="flex items-baseline justify-between gap-4">
        <h4 id={titleId} className="text-[17px] font-semibold tracking-[-0.03em] text-text md:text-[19px]">
          {title}
        </h4>
        <span aria-hidden="true" className="label-mono shrink-0 text-[#8a9894]">
          Mean ± 1 SD
        </span>
      </div>

      <div role="img" aria-label={summary} className="mt-7">
        <div className="space-y-5 sm:space-y-4">
          {bars.map((bar, i) => {
            const s = STRATEGY_STYLE[bar.strategy];
            const lo = bar.sd !== undefined ? Math.max(0, bar.mean - bar.sd) : bar.mean;
            const hi = bar.sd !== undefined ? bar.mean + bar.sd : bar.mean;
            return (
              <div
                key={bar.label}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 [grid-template-areas:'label_value''track_track'] sm:grid-cols-[124px_minmax(0,1fr)_104px] sm:[grid-template-areas:'label_track_value']"
              >
                <span className={cn("text-[13px] font-medium tracking-[-0.01em] [grid-area:label]", s.label)}>
                  {bar.label}
                </span>
                <div className="relative h-7 [grid-area:track]">
                  <Gridlines ticks={ticks} max={max} />
                  <motion.div
                    className={cn("absolute top-1/2 left-0 h-3.5 origin-left -translate-y-1/2", s.bar)}
                    style={{ width: pct(bar.mean, max) }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.1 }}
                  />
                  {bar.sd !== undefined && (
                    <motion.div
                      className="absolute inset-y-0"
                      style={{ left: pct(lo, max), width: pct(hi - lo, max) }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                    >
                      <span className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-text" />
                      <span className="absolute top-[3px] bottom-[3px] left-0 w-px bg-text" />
                      <span className="absolute top-[3px] right-0 bottom-[3px] w-px bg-text" />
                    </motion.div>
                  )}
                </div>
                <span
                  className={cn(
                    "font-mono text-[12px] tabular-nums tracking-[0.02em] [grid-area:value] sm:text-right",
                    s.value,
                  )}
                >
                  {valueText(bar)}
                </span>
              </div>
            );
          })}

          {notApplicable.map((label) => (
            <div
              key={label}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 [grid-template-areas:'label_value''track_track'] sm:grid-cols-[124px_minmax(0,1fr)_104px] sm:[grid-template-areas:'label_track_value']"
            >
              <span className="text-[13px] font-medium tracking-[-0.01em] text-muted [grid-area:label]">{label}</span>
              <div className="relative h-7 [grid-area:track]">
                <Gridlines ticks={ticks} max={max} />
                <span className="absolute top-1/2 right-0 left-0 border-t border-dashed border-line-2" />
              </div>
              <span className="font-mono text-[12px] tracking-[0.02em] text-[#8a9894] [grid-area:value] sm:text-right">
                n/a
              </span>
            </div>
          ))}
        </div>

        {/* Axis */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-[124px_minmax(0,1fr)_104px] sm:gap-x-4">
          <div className="relative h-5 border-t border-line-2 sm:col-start-2">
            {ticks.map((t, i) => (
              <span
                key={t}
                className={cn(
                  "absolute top-1.5 font-mono text-[10px] tabular-nums text-[#8a9894]",
                  i === 0 ? "translate-x-0" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                )}
                style={{ left: pct(t, max) }}
              >
                {fmt(t, 0)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-6 font-mono text-[11px] leading-[1.7] text-[#8a9894]">{caption}</figcaption>

      {/* sr-only on a <table> itself does not clip it; wrap it so it cannot cause overflow. */}
      <div className="sr-only">
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Strategy</th>
              <th scope="col">Mean</th>
              <th scope="col">Standard deviation</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.label}>
                <th scope="row">{b.label}</th>
                <td>{fmt(b.mean, digitsFor(b))}</td>
                <td>{b.sd !== undefined ? fmt(b.sd, 1) : "not reported"}</td>
              </tr>
            ))}
            {notApplicable.map((label) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>not applicable</td>
                <td>not applicable</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Gridlines({ ticks, max }: { ticks: number[]; max: number }) {
  return (
    <span aria-hidden="true" className="absolute inset-0">
      {ticks.map((t) => (
        <span
          key={t}
          className={cn("absolute inset-y-0 w-px", t === 0 ? "bg-line-2" : "bg-line/70")}
          style={{ left: pct(t, max) }}
        />
      ))}
    </span>
  );
}
