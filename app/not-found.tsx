import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { notFound } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  // Next already injects noindex for not-found; don't inherit the home canonical.
  alternates: { canonical: null },
};

/* ---------- Illustrative coverage map: a field of visited states with one unreached cell ---------- */

const COLS = 9;
const ROWS = 7;
const CELL = 30;
const GAP = 4;
const PITCH = CELL + GAP;
const TARGET = { c: 7, r: 1 }; // the "404" state nobody reaches
const START = { c: 1, r: 5 };

/** Deterministic visit intensity per cell (0 = never visited). Fixed so server output is stable. */
function intensity(c: number, r: number) {
  if (c === TARGET.c && r === TARGET.r) return -1;
  const d = Math.hypot(c - START.c, r - START.r);
  const noise = ((c * 73 + r * 151 + c * r * 17) % 11) / 11;
  const v = 1 - d / 7.2 + (noise - 0.5) * 0.55;
  if (v < 0.12) return 0;
  return Math.min(1, v);
}

const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return { c, r, v: intensity(c, r) };
});

const W = COLS * PITCH - GAP;
const H = ROWS * PITCH - GAP;
const cx = (c: number) => c * PITCH + CELL / 2;
const cy = (r: number) => r * PITCH + CELL / 2;

/* Search frontier: a trajectory that stalls two cells short of the target. */
const PATH = [
  [START.c, START.r],
  [3, 5],
  [3, 3],
  [5, 3],
  [5, 2],
]
  .map(([c, r], i) => `${i === 0 ? "M" : "L"}${cx(c)} ${cy(r)}`)
  .join(" ");

function CoverageMap() {
  return (
    <figure className="w-full max-w-[460px] lg:ml-auto">
      <div className="border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        <div className="flex h-11 items-center justify-between border-b border-line px-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#a5b1ad]">
          <span>Coverage map / route lookup</span>
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="block size-[7px] rounded-full border border-[#798982]" />
            <i className="block size-[7px] rounded-full border border-[#798982]" />
            <i className="block size-[7px] rounded-full border border-[#798982]" />
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <svg
            viewBox={`-2 -2 ${W + 4} ${H + 4}`}
            className="h-auto w-full"
            role="img"
            aria-label="Illustration: a grid of explored states lit in lime, with a search path that stops short of one dashed, unreached cell."
          >
            {CELLS.map(({ c, r, v }) =>
              v === -1 ? null : (
                <rect
                  key={`${c}-${r}`}
                  x={c * PITCH}
                  y={r * PITCH}
                  width={CELL}
                  height={CELL}
                  fill={v > 0 ? "#c1e29e" : "transparent"}
                  fillOpacity={v > 0 ? 0.08 + v * 0.42 : 0}
                  stroke={v > 0 ? "#c1e29e" : "#2a3235"}
                  strokeOpacity={v > 0 ? 0.18 + v * 0.3 : 1}
                />
              ),
            )}

            <path d={PATH} fill="none" stroke="#f2f3f0" strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="5 4" />
            <circle cx={cx(START.c)} cy={cy(START.r)} r="5" fill="#f2f3f0" />
            <circle cx={cx(5)} cy={cy(2)} r="3.5" fill="#0c1113" stroke="#f2f3f0" strokeWidth="1.5" />

            {/* Unreached target */}
            <rect
              x={TARGET.c * PITCH + 0.5}
              y={TARGET.r * PITCH + 0.5}
              width={CELL - 1}
              height={CELL - 1}
              fill="none"
              stroke="#c1e29e"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={cx(TARGET.c)}
              y={cy(TARGET.r) + 4}
              textAnchor="middle"
              fill="#c1e29e"
              fontSize="11"
              fontFamily="var(--font-dm-mono), monospace"
            >
              ?
            </text>
          </svg>

          <dl className="mt-5 grid grid-cols-3 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.1em]">
            <div>
              <dt className="text-subtle">Status</dt>
              <dd className="mt-1.5 text-text">404</dd>
            </div>
            <div>
              <dt className="text-subtle">Coverage key</dt>
              <dd className="mt-1.5 text-text">None</dd>
            </div>
            <div>
              <dt className="text-subtle">Trajectories</dt>
              <dd className="mt-1.5 text-text">0 reach</dd>
            </div>
          </dl>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">
        Illustrative / not product output
      </figcaption>
    </figure>
  );
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="relative overflow-hidden focus:outline-none">
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_60%,rgb(123_166_137/0.09),transparent_55%)]"
        />
        <Container className="relative grid min-h-[calc(100dvh-62px)] content-center items-center gap-14 py-[79px] md:py-[110px] lg:min-h-[calc(100dvh-72px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <p className="label-mono flex items-center text-lime">
              <span
                aria-hidden="true"
                className="mr-2.5 inline-block size-[7px] rounded-full bg-lime shadow-[0_0_18px_var(--color-lime)]"
              />
              404
              <span aria-hidden="true" className="mx-2 text-line-2">
                /
              </span>
              No such state
            </p>

            <h1 className="mt-7 max-w-[760px] text-[clamp(40px,5.4vw,76px)] font-semibold leading-[1.04] tracking-hero text-text">
              {notFound.headline}
              <span className="block text-quiet">{notFound.title}</span>
            </h1>

            <p className="mt-7 max-w-[520px] text-[16px] leading-[1.7] tracking-[-0.012em] text-muted md:text-[17px]">
              {notFound.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button href={notFound.cta.href} icon="→">
                {notFound.cta.label}
              </Button>
              <Button href={notFound.secondaryCta.href} variant="secondary">
                {notFound.secondaryCta.label}
              </Button>
            </div>
          </div>

          <CoverageMap />
        </Container>
      </main>
      <Footer onHome={false} />
    </>
  );
}
