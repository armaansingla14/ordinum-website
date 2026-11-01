import Link from "next/link";
import { NavMaturityStatic } from "@/components/sections/products/NavMaturityStatic";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Caveat, MaturityChip, SECTION_PAD, SectionIntro, mono } from "@/components/sections/technology/shared";
import { cn } from "@/lib/cn";
import { nav, platform, type NavEntry, type NavGroup, type NavItem } from "@/lib/content";

const products = (nav.entries as readonly NavEntry[]).find((e): e is NavGroup => e.kind === "group" && e.id === "products");
/** The product areas and the roadmap (the nav's Products group, minus this page). */
const AREAS: readonly NavItem[] = (products?.items ?? []).filter((i) => i.href !== "/products");

/** /products#capabilities: product areas with status, then the engine's capabilities at the stable checkpoint. */
export default function Capabilities() {
  const c = platform.capabilities;
  return (
    <Section id={c.id} variant="charcoal" aria-labelledby={`${c.id}-title`} className={SECTION_PAD}>
      <SectionIntro kicker={c.kicker} title={c.title} titleMuted={c.titleMuted} titleId={`${c.id}-title`} lede={c.lede} />

      <Reveal className="mt-12 md:mt-16">
        <h3 className={cn(mono, "text-subtle")}>{c.areasTitle}</h3>
        <ul className="hairline-grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <li key={a.href} className="bg-bg">
              <Link href={a.href} className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-surface sm:p-6">
                <span className="text-[18px] leading-[1.25] font-semibold tracking-[-0.025em] text-text group-hover:text-lime">
                  {a.label}
                  <span aria-hidden="true" className="ml-2 inline-block text-lime transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="text-[14px] leading-[1.6] text-muted">{a.description}</span>
                <NavMaturityStatic item={a} className="mt-auto pt-2" />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="ul" stagger={0.03} amount={0.03} className="mt-12 border-t border-line-2 md:mt-14">
        {c.items.map((it) => (
          <RevealItem
            key={it.name}
            as="li"
            className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,6fr)]"
          >
            <h3 className="text-[16.5px] leading-[1.35] font-semibold tracking-[-0.02em] text-text">
              {it.name}
              {"command" in it && it.command && (
                <span className="ml-2 font-mono text-[12px] font-normal tracking-[0.02em] text-[#b7c4bf]">ordinum {it.command}</span>
              )}
            </h3>
            <div>
              <MaturityChip maturity={it.maturity} note={"note" in it ? it.note : undefined} />
            </div>
            <p className="text-[14.5px] leading-[1.65] text-muted">{it.body}</p>
          </RevealItem>
        ))}
      </Reveal>

      <Caveat className="mt-8 max-w-[760px]">{c.ciStatus}</Caveat>
    </Section>
  );
}
