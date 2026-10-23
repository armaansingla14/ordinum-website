import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Lifecycle from "@/components/visuals/Lifecycle";
import { lifecycle } from "@/lib/content";

/** "HOW IT WORKS / 003" -> ["HOW IT WORKS", "003"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

/**
 * The seven-stage adversarial testing lifecycle (lib/content.ts `lifecycle`) with Visual 2.
 * Usable on any page; `id` defaults to "how-it-works".
 */
export default function HowItWorks({ id = "how-it-works" }: { id?: string }) {
  const [kicker, index] = splitLabel(lifecycle.kicker);
  const titleId = `${id}-title`;

  return (
    <Section id={id} variant="charcoal" aria-labelledby={titleId}>
      <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id={titleId} muted={lifecycle.titleMuted} className="mt-6 max-w-[18ch]">
            {lifecycle.title}
          </Heading>
        </div>
        <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{lifecycle.lede}</p>
      </Reveal>

      <Reveal className="mt-14 md:mt-20" amount={0.1}>
        <Lifecycle />
      </Reveal>
    </Section>
  );
}
