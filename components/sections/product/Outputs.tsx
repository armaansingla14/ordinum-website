import Link from "next/link";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import EvidenceReport from "@/components/visuals/EvidenceReport";
import { cn } from "@/lib/cn";
import { product } from "@/lib/content";
import { SECTION_PAD, SectionIntro, mono, pad } from "../technology/shared";

/**
 * 003 What an engineer receives: the centre of the page. The real Nav2 report preview
 * (EvidenceReport, compact, re-rendered from lib/evidence.ts) beside the six outputs in plain
 * English, each with its value in that same run.
 */
export default function Outputs() {
  const o = product.outputs;
  return (
    <Section id="outputs" aria-labelledby="outputs-title" className={SECTION_PAD}>
      <SectionIntro kicker={o.kicker} title={o.title} titleId="outputs-title" lede={o.lede} />

      <div className="mt-12 grid gap-10 md:mt-16 xl:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] xl:gap-12">
        <Reveal amount={0.05} className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <EvidenceReport compact />
          <div className="mt-4 flex flex-wrap gap-x-8">
            {o.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
              >
                {l.label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="min-w-0">
        <Reveal as="ol" stagger={0.05} amount={0.03} className="border-t border-line">
          {o.items.map((item, i) => (
            <RevealItem as="li" key={item.id} className="border-b border-line py-5 md:py-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.08em] text-lime">{pad(i + 1)}</span>
                <h3 className="text-[18px] leading-[1.3] font-[550] tracking-[-0.025em] text-text">{item.title}</h3>
              </div>
              <p className="mt-2 pl-[34px] text-[14.5px] leading-[1.7] text-muted">{item.plain}</p>
              <p className="mt-2.5 pl-[34px] font-mono text-[11.5px] leading-[1.6] break-words text-[#b7c4bf]">
                <span className={cn(mono, "mr-2 text-subtle")}>In the Nav2 run</span>
                {item.example}
              </p>
            </RevealItem>
          ))}
        </Reveal>
        </div>
      </div>
    </Section>
  );
}
