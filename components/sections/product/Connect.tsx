import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { product } from "@/lib/content";
import { SECTION_PAD, SectionIntro, mono } from "../technology/shared";

/**
 * 001 What you connect: the adapter idea, the systems Ordinum runs today (one sentence; the
 * maturity of each lives on /technology#adapters, not repeated here), and who we build for first.
 */
export default function Connect() {
  const c = product.connect;

  return (
    <Section id="connect" aria-labelledby="connect-title" className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleMuted={c.titleMuted} titleId="connect-title" lede={c.body} />

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 xl:gap-16">
        <Reveal>
          <h3 className={cn(mono, "text-subtle")}>{c.targetsLabel}</h3>
          <p className="mt-4 max-w-[640px] border-t border-line pt-5 text-[17px] leading-[1.65] tracking-[-0.015em] text-text">
            {c.runsToday}
          </p>
          <Link
            href={c.targetsLink.href}
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
          >
            {c.targetsLink.label}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="self-start border border-line-2 bg-window p-6 md:p-7">
          <p className={cn(mono, "flex items-center gap-2 text-lime")}>
            <span aria-hidden="true" className="size-[7px] border border-dashed border-lime" />
            Hypothesis
          </p>
          <h3 className="mt-4 text-[20px] leading-[1.25] font-[550] tracking-[-0.03em] text-text">{c.firstFor.title}</h3>
          <ul className="mt-4 space-y-3">
            {c.firstFor.items.map((item) => (
              <li key={item} className="flex gap-3 text-[14.5px] leading-[1.7] text-muted">
                <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-lime/70" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-[13px] leading-[1.6] text-subtle">{c.firstFor.note}</p>
        </Reveal>
      </div>
    </Section>
  );
}
