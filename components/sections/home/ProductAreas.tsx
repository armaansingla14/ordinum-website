import Link from "next/link";
import { NavMaturityStatic } from "@/components/sections/products/NavMaturityStatic";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { home, nav, type NavEntry, type NavGroup, type NavItem } from "@/lib/content";
import { ArrowLink, SectionIntro } from "./shared";

const { areas } = home;
const group = (nav.entries as readonly NavEntry[]).find((e): e is NavGroup => e.kind === "group" && e.id === "products");
/** The three product areas: the nav's Products group without the overview and the roadmap. */
const AREAS: readonly NavItem[] = (group?.items ?? []).filter((i) => i.href.startsWith("/products/"));

/** Home section 4: the three product areas, each with its own maturity label and scope. */
export default function ProductAreas() {
  return (
    <Section id="product-areas" variant="charcoal" aria-labelledby="areas-title" className="py-[72px] md:py-[104px]">
      <SectionIntro kicker={areas.kicker} title={areas.title} titleMuted={areas.titleMuted} titleId="areas-title" />
      <Reveal as="ul" stagger={0.05} amount={0.1} className="hairline-grid mt-10 grid-cols-1 md:mt-14 md:grid-cols-3">
        {AREAS.map((a) => (
          <RevealItem key={a.href} as="li" className="bg-bg">
            <Link href={a.href} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface sm:p-7">
              <h3 className="text-[22px] leading-[1.2] font-semibold tracking-title text-text group-hover:text-lime">
                {a.label}
                <span aria-hidden="true" className="ml-2 inline-block text-lime transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </h3>
              <p className="text-[14.5px] leading-[1.65] text-muted">{a.description}</p>
              <NavMaturityStatic item={a} className="mt-auto pt-3" />
            </Link>
          </RevealItem>
        ))}
      </Reveal>
      <ArrowLink href={areas.roadmap.href} className="mt-6">
        {areas.roadmap.label}
      </ArrowLink>
    </Section>
  );
}
