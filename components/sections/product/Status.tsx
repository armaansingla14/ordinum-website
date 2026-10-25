import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { integration, product, type Integration } from "@/lib/content";
import { MaturityChip, SECTION_PAD, SectionIntro, mono } from "../technology/shared";

/*
 * Column labels. Local copy: requested as product.status.todayLabel / nextLabel in lib/content.ts.
 */
const TODAY_LABEL = "Runs today";
const NEXT_LABEL = "In progress or planned";

function Column({ label, items }: { label: string; items: readonly Integration[] }) {
  return (
    <div className="min-w-0">
      <h3 className={cn(mono, "text-subtle")}>{label}</h3>
      <ul className="mt-4 border-t border-line">
        {items.map((it) => (
          <li key={it.id} className="border-b border-line py-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p
                className={cn(
                  "text-[16px] leading-[1.35] font-[550] tracking-[-0.02em]",
                  it.maturity === "planned" ? "text-muted" : "text-text",
                )}
              >
                {it.name}
              </p>
              <MaturityChip maturity={it.maturity} />
            </div>
            <p className="mt-2 text-[14px] leading-[1.65] text-muted">{it.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 004 What works today and what is planned (exact maturity labels from the one integration list),
 * then a short note on how Ordinum sits alongside existing tools.
 */
export default function Status() {
  const s = product.status;
  const a = product.alongside;

  return (
    <Section id="today" variant="charcoal" aria-labelledby="today-title" className={SECTION_PAD}>
      <SectionIntro
        kicker={s.kicker}
        title={s.title}
        titleMuted={s.titleMuted}
        titleId="today-title"
        aside={
          <Link
            href={s.link.href}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
          >
            {s.link.label}
            <span aria-hidden="true">→</span>
          </Link>
        }
      />

      <Reveal className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-2 lg:gap-12">
        <Column label={TODAY_LABEL} items={s.today.map(integration)} />
        <Column label={NEXT_LABEL} items={s.next.map(integration)} />
      </Reveal>

      <Reveal className="mt-16 border-t border-line pt-8 md:mt-20">
        <h3 className="text-[20px] leading-[1.25] font-[550] tracking-[-0.03em] text-text">{a.title}</h3>
        <dl className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {a.items.map((it) => (
            <div key={it.name}>
              <dt className="text-[14.5px] font-[550] text-text">{it.name}</dt>
              <dd className="mt-1 text-[14px] leading-[1.65] text-muted">{it.text}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
