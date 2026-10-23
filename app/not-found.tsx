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

/* ---------- Illustrative route check: a three-lane timeline ending in a failed property ---------- */

type Mark = { at: number; label: string; kind: "event" | "lookup" | "missing" | "fail" };

const LANES: { name: string; marks: Mark[] }[] = [
  {
    name: "Browser",
    marks: [
      { at: 14, label: "Request", kind: "event" },
      { at: 84, label: "404", kind: "fail" },
    ],
  },
  { name: "Router", marks: [{ at: 38, label: "Lookup", kind: "lookup" }] },
  { name: "Page", marks: [{ at: 62, label: "None", kind: "missing" }] },
];

const MARK_CLASS: Record<Mark["kind"], string> = {
  event: "bg-text border-text",
  lookup: "bg-window border-text",
  missing: "border-dashed border-lime bg-transparent",
  fail: "bg-orange border-orange",
};

const LABEL_CLASS: Record<Mark["kind"], string> = {
  event: "text-muted",
  lookup: "text-muted",
  missing: "text-lime",
  fail: "text-orange",
};

function RouteCheck() {
  return (
    <figure className="w-full max-w-[460px] lg:ml-auto">
      <div className="border border-line-2 bg-window shadow-[0_28px_70px_rgb(0_0_0/0.34)]">
        <div className="flex h-11 items-center justify-between border-b border-line px-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#a5b1ad]">
          <span>Route check</span>
          <span className="text-subtle">Illustrative</span>
        </div>

        <div className="p-5 sm:p-6">
          <p className="sr-only">
            Illustration: the browser sends a request, the router looks up the address, no page exists, and the
            browser receives a 404. The property &ldquo;every link resolves to a page&rdquo; is violated.
          </p>
          <ol aria-hidden="true" className="border-t border-line">
            {LANES.map((lane) => (
              <li key={lane.name} className="grid grid-cols-[64px_minmax(0,1fr)] items-center border-b border-line sm:grid-cols-[76px_minmax(0,1fr)]">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-subtle">{lane.name}</span>
                <span className="relative block h-14">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
                  {lane.marks.map((mark) => (
                    <span
                      key={mark.label}
                      className="absolute top-1/2 flex -translate-x-1/2 flex-col items-center"
                      style={{ left: `${mark.at}%` }}
                    >
                      <span className={`block size-[9px] -translate-y-1/2 border ${MARK_CLASS[mark.kind]}`} />
                      <span
                        className={`mt-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em] ${LABEL_CLASS[mark.kind]}`}
                      >
                        {mark.label}
                      </span>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <p aria-hidden="true" className="mt-2 flex justify-end font-mono text-[9px] uppercase tracking-[0.1em] text-subtle">
            Time →
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.1em]">
            <div>
              <dt className="text-subtle">Status</dt>
              <dd className="mt-1.5 text-text">404</dd>
            </div>
            <div>
              <dt className="text-subtle">Property</dt>
              <dd className="mt-1.5 text-text">Route resolves</dd>
            </div>
            <div>
              <dt className="text-subtle">Verdict</dt>
              <dd className="mt-1.5 flex items-center gap-1.5 text-orange">
                <span aria-hidden="true" className="inline-block size-[6px] bg-orange" />
                Violated
              </dd>
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
              No such route
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

          <RouteCheck />
        </Container>
      </main>
      <Footer onHome={false} />
    </>
  );
}
