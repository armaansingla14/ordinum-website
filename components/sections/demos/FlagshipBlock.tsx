import { cn } from "@/lib/cn";
import { home } from "@/lib/content";
import BeforeAfter from "@/components/visuals/BeforeAfter";
import FlagshipVideo from "./FlagshipVideo";
import SeekButton from "./SeekButton";

const mono = "font-mono text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase";

/** The five-step annotated strip: Failure, Reproduction, Engineer's fix, Verification, Saved regression. */
export function DemoStrip({ className }: { className?: string }) {
  return (
    <ol aria-label="What the recording shows, step by step" className={cn("hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5", className)}>
      {home.demo.strip.map((s, i) => (
        <li key={s.n} className={cn("flex flex-col bg-surface px-4 pt-4 pb-2", i === 4 && "sm:col-span-2 lg:col-span-1")}>
          <p className={cn(mono, "flex items-center gap-2 text-subtle")}>
            <span className="text-lime">{s.n}</span>
            {s.label}
          </p>
          <p className={cn("mt-2.5 font-mono text-[14px] leading-[1.35] tracking-[0.01em]", i === 0 ? "text-orange" : "text-text")}>{s.value}</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-muted">{s.caption}</p>
          <span aria-hidden="true" className="flex-1" />
          {"at" in s && s.at !== undefined ? <SeekButton at={s.at} label={s.label} /> : <span className="hidden min-h-11 lg:block" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

/**
 * The flagship demo: the recording with the before/after result card beside it (lg+), then the
 * five-step strip. Used on the home page (#demo) and on /demos (#demo-flagship).
 */
export default function FlagshipBlock({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:items-start lg:gap-6">
        <FlagshipVideo className="min-w-0" />
        <BeforeAfter className="min-w-0 lg:mt-[27px]" />
      </div>
      <DemoStrip className="mt-6" />
    </div>
  );
}
