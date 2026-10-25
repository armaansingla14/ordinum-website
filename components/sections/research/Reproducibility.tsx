import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { FACT_SOURCE, research } from "@/lib/content";
import { SectionHead, SubHead } from "./shared";

const r = research.reproducibility;
const demoLink = research.nav2.traceLink;

/** How to check the work: commits, the pre-registration tag, the cited files, and the /demo walkthrough. */
export default function Reproducibility() {
  return (
    <Section id={r.id} aria-labelledby="repro-title">
      <SectionHead id="repro-title" kicker={r.kicker} title={r.title} />

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <dl className="border-t border-line">
            {r.items.map((it) => (
              <div key={it.k} className="grid grid-cols-1 gap-1.5 border-b border-line py-4 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-6">
                <dt className="font-mono text-[10.5px] tracking-[0.1em] text-subtle uppercase sm:pt-[3px]">{it.k}</dt>
                <dd className="text-[14.5px] leading-[1.65] text-text">{it.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-5" delay={0.06}>
          <div className="border border-line bg-surface p-6">
            <SubHead id="repro-files">Cited files · {FACT_SOURCE.repo}</SubHead>
            <ul aria-labelledby="repro-files" className="mt-4 space-y-2">
              {r.files.map((f) => (
                <li key={f} className="font-mono text-[11.5px] leading-[1.6] break-all text-[#c9d1ce]">
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13.5px] leading-[1.65] text-muted">{r.access}</p>
          </div>
          <Link
            href={demoLink.href}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
          >
            {demoLink.label}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
