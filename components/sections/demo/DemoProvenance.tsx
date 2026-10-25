import Link from "next/link";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { demoPage, home } from "@/lib/content";
import { PRODUCT_SOURCE } from "@/lib/evidence";

const p = demoPage.provenance;

/** 004 Where every value on /demo comes from, plus a link to the research. */
export default function DemoProvenance() {
  return (
    <Section id="provenance" variant="charcoal" aria-labelledby="provenance-title" className="py-[64px] md:py-[88px]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Kicker as="div" index={p.kicker.split(" / ")[1]}>
            <h2 id="provenance-title" className="inline">
              {p.title}
            </h2>
          </Kicker>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.75] text-muted">{p.body}</p>
          <dl className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-[1.6]">
            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 py-1">
              <dt className="tracking-[0.08em] text-[#8a9894] uppercase">Branch</dt>
              <dd className="text-[#d6dedb]">{PRODUCT_SOURCE.branch}</dd>
            </div>
            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 py-1">
              <dt className="tracking-[0.08em] text-[#8a9894] uppercase">Commit</dt>
              <dd className="break-all text-[#d6dedb]">{PRODUCT_SOURCE.commit}</dd>
            </div>
          </dl>
          {/* The sage band below carries the founder CTAs; only a research link here. */}
          <Link
            href={home.demo.secondaryCta.href}
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-lime uppercase underline decoration-lime/40 underline-offset-4 transition-colors hover:decoration-lime"
          >
            {home.demo.secondaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <ul aria-label="Artifact files" className="border-t border-line">
            {p.files.map((f) => (
              <li key={f} className="border-b border-line py-2.5 font-mono text-[11px] leading-[1.6] break-all text-[#b7c4bf]">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
