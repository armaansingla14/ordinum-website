import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { explore, pages } from "@/lib/content";

/** Home: hairline-joined link cards into each inner page. 3 + 2 on desktop, stacked on mobile. */
export default function ExploreGrid() {
  const [label, index] = explore.kicker.split(" / ");

  return (
    <Section id="explore" variant="charcoal" aria-labelledby="explore-title">
      <Kicker index={index}>{label}</Kicker>
      <Heading id="explore-title" className="mt-6">
        {explore.title}
      </Heading>

      <Reveal
        as="ul"
        stagger={0.06}
        className="mt-12 grid grid-cols-1 gap-px border border-line bg-line md:mt-14 md:grid-cols-6"
      >
        {explore.cards.map((card, i) => {
          const page = pages[card.page];
          return (
            <RevealItem
              key={card.page}
              as="li"
              className={i < 3 ? "md:col-span-2" : "md:col-span-3"}
            >
              <Link
                href={page.href}
                className="group flex h-full min-h-[220px] flex-col justify-start bg-surface p-7 transition-colors duration-200 hover:bg-[#19211f] md:min-h-[250px] md:p-9"
              >
                <span className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-lime">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden="true"
                    className="text-[15px] text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-lime"
                  >
                    →
                  </span>
                </span>
                <span className="mt-14 block md:mt-16">
                  <span className="block text-[23px] font-[550] leading-tight tracking-[-0.04em] text-text">
                    {page.label}
                  </span>
                  <span className="mt-3 block max-w-[440px] text-[14px] leading-[1.75] text-muted">
                    {card.summary}
                  </span>
                </span>
              </Link>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
