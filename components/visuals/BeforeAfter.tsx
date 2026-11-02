import Link from "next/link";
import { cn } from "@/lib/cn";
import { FLAGSHIP_LABEL, home } from "@/lib/content";

const r = home.demo.result;
const mono = "font-mono text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase";

/** One row of run outcomes: filled orange = the property was violated in that run, hollow = it held. */
function Runs({ failures, runs, label }: { failures: number; runs: number; label: string }) {
  return (
    <span role="img" aria-label={`${label}: read_authz violated in ${failures} of ${runs} runs`} className="grid grid-cols-10 gap-1">
      {Array.from({ length: runs }, (_, i) => (
        <span key={i} className={cn("block h-5 sm:h-6", i < failures ? "bg-orange" : "border border-[#5d6b6c]")} />
      ))}
    </span>
  );
}

/**
 * Before/after result card for the flagship run (real numbers from lib/content.ts `flagship`):
 * affected build 10/10 vs fixed build 0/10, FIX_VERIFIED. The planted-defect label sits here,
 * beside the result, and nowhere else in the demo block.
 */
export default function BeforeAfter({ className, evidenceLink = true }: { className?: string; evidenceLink?: boolean }) {
  const rows = [r.affected, r.fixed];
  return (
    <figure className={cn("flex flex-col border border-line-2 bg-window", className)} aria-labelledby="before-after-title">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <p id="before-after-title" className={cn(mono, "text-[#a5b1ad]")}>
          {r.title}
        </p>
        <p className={cn(mono, "text-lime")}>Recorded run</p>
      </div>
      <div className="flex flex-col gap-5 px-5 py-5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[14.5px] leading-snug font-[550] tracking-[-0.015em] text-text">
                {row.label} <span className="font-normal text-muted">· {row.detail}</span>
              </span>
              <span className={cn("font-mono text-[15px] tracking-[0.02em]", row.failures > 0 ? "text-orange" : "text-lime")}>
                {row.failures}/{row.runs}
              </span>
            </p>
            <div className="mt-2.5">
              <Runs failures={row.failures} runs={row.runs} label={row.label} />
            </div>
          </div>
        ))}
        <p className="text-[12.5px] leading-[1.5] text-subtle">Each square is one comparison run; filled means read_authz was violated.</p>
        <p className="font-mono text-[12px] leading-[1.5] tracking-[0.02em] text-lime">{r.verdict}</p>
      </div>
      <figcaption className="mt-auto border-t border-orange/50 bg-orange/[0.07] px-5 py-3 font-mono text-[11px] leading-[1.55] tracking-[0.03em] text-orange">
        {FLAGSHIP_LABEL}
      </figcaption>
      {evidenceLink && (
        <Link
          href={home.demo.link.href}
          className="group flex min-h-11 items-center justify-between border-t border-line px-5 font-mono text-[11px] tracking-[0.12em] text-lime uppercase hover:bg-surface"
        >
          {home.demo.link.label}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </figure>
  );
}
