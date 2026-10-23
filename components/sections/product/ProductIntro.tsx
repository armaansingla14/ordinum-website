import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { product } from "@/lib/content";
import { splitLabel } from "./shared";

/** The idea in two paragraphs: different systems need different techniques, but can share one workflow. */
export default function ProductIntro() {
  const { intro } = product;
  const [label, index] = splitLabel(intro.kicker);

  return (
    <Section id="product-idea" aria-labelledby="product-idea-title">
      <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Kicker index={index}>{label}</Kicker>
          <Heading id="product-idea-title" muted={intro.titleMuted} className="mt-6 max-w-[14ch]">
            {intro.title}
          </Heading>
        </div>
        <div className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-[52px]">
          {intro.body.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[17px] leading-[1.75] tracking-[-0.017em] text-text md:text-[19px]"
                  : "text-[16px] leading-[1.8] text-muted md:text-[17px]"
              }
            >
              {p}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
