import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Topline from "@/components/ui/Topline";
import PillarIcon from "@/components/visuals/PillarIcons";
import { pillars, topline } from "@/lib/content";

/** "THE PRODUCT / 005" -> ["THE PRODUCT", "005"] */
function splitLabel(s: string): [string, string | undefined] {
  const at = s.lastIndexOf(" / ");
  return at === -1 ? [s, undefined] : [s.slice(0, at), s.slice(at + 3)];
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Pillars() {
  const [kicker, index] = splitLabel(pillars.kicker);
  const [lineIndex, lineLabel] = topline[4].split(" / ") as [string, string];
  const total = pillars.items.length;

  return (
    <Section id="product" aria-labelledby="product-title" className="pt-0 md:pt-0">
      <Topline index={lineIndex} contained={false}>
        {lineLabel}
      </Topline>

      <Reveal className="mt-[64px] grid gap-8 md:mt-[100px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Kicker index={index}>{kicker}</Kicker>
          <Heading id="product-title" className="mt-6 max-w-[15ch]">
            {pillars.title}
          </Heading>
        </div>
        <p className="max-w-[540px] text-[16px] leading-[1.8] text-muted md:text-[17px]">{pillars.lede}</p>
      </Reveal>

      <Reveal
        as="ul"
        stagger={0.07}
        amount={0.1}
        className="hairline-grid mt-14 grid-cols-1 md:mt-20 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pillars.items.map((item, i) => (
          <RevealItem as="li" key={item.id} className="group relative flex bg-surface">
            <article className="relative flex w-full flex-col p-7 transition-colors duration-300 group-hover:bg-surface-2 sm:min-h-[300px] md:p-9 lg:min-h-[330px]">
              {/* Lime hairline that draws in on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-lime transition-transform duration-500 ease-out-expo group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <div className="flex items-start justify-between gap-6">
                <span className="relative grid size-[72px] place-items-center border border-line bg-window text-muted transition-colors duration-300 group-hover:border-line-2 group-hover:text-text">
                  {/* Corner ticks, like a viewfinder */}
                  <span aria-hidden="true" className="absolute -top-px -left-px size-2 border-t border-l border-line-2 transition-colors duration-300 group-hover:border-lime" />
                  <span aria-hidden="true" className="absolute -right-px -bottom-px size-2 border-r border-b border-line-2 transition-colors duration-300 group-hover:border-lime" />
                  <PillarIcon name={item.icon} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-quiet">
                  <span className="text-lime">{pad(i + 1)}</span>
                  <span aria-hidden="true"> / {pad(total)}</span>
                </span>
              </div>
              <h3 className="mt-10 text-[22px] leading-[1.2] font-[550] tracking-title text-text md:mt-12 md:text-[23px]">
                {item.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.85] text-muted">{item.body}</p>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
