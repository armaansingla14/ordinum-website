import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { FACT_SOURCE, research } from "@/lib/content";
import { Tag } from "./badges";
import { SectionHead } from "./shared";

/** A. Current engineering status: what the evidence supports, then verified counts pinned to a commit and date. */
export default function EngineeringStatus() {
  const s = research.status;
  return (
    <Section id="status" aria-labelledby="status-title">
      <SectionHead
        id="status-title"
        kicker={s.kicker}
        title={s.title}
        immediate
        lede={
          <span className="flex flex-col gap-4">
            {s.summary.map((p, i) => (
              <span key={p.slice(0, 24)} className={cn("block", i === 0 && "text-[#c9d1ce]")}>
                {p}
              </span>
            ))}
          </span>
        }
        aside={
          <div className="border border-line bg-surface p-5">
            <Tag tone="lime">
              As of {FACT_SOURCE.commitShort} · {FACT_SOURCE.checkedOn}
            </Tag>
            <p className="mt-4 text-[14px] leading-[1.65] text-muted">{s.asOf}</p>
          </div>
        }
      />

      <Reveal as="ul" immediate className="hairline-grid mt-14 grid-cols-1 sm:grid-cols-2 md:mt-20 lg:grid-cols-5">
        {s.stats.map((stat) => {
          const isZero = stat.value === "0";
          return (
            <RevealItem as="li" key={stat.label} className="relative flex flex-col bg-surface p-6 sm:last:col-span-2 lg:last:col-span-1">
              {!isZero && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-lime" />}
              <p
                className={cn(
                  "font-semibold leading-[0.95] tracking-hero tabular-nums",
                  // Long values (e.g. 655,218) get a smaller size so they fit a fifth of the row.
                  stat.value.length > 4 ? "text-[clamp(40px,3.3vw,52px)]" : "text-[clamp(52px,5vw,72px)]",
                  isZero ? "text-text" : "text-lime",
                )}
              >
                {stat.value}
              </p>
              <h3 className="label-mono mt-5 text-text">{stat.label}</h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-muted">{stat.caption}</p>
            </RevealItem>
          );
        })}
      </Reveal>

      <Reveal className="mt-6 flex flex-col gap-3 border-l border-line-2 pl-5 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="label-mono shrink-0 text-[10px] text-subtle">Review</span>
        <p className="max-w-[820px] text-[15px] leading-[1.7] text-muted">{s.review}</p>
      </Reveal>
    </Section>
  );
}
