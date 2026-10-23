import Reveal, { RevealItem } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { product } from "@/lib/content";
import { SectionIntro, pad } from "./shared";

/**
 * Complementary approaches. Replaces the old comparison table: no Ordinum column, no
 * check/cross matrix, no competitor named. Each card says what the approach contributes,
 * what it is best at, and where Ordinum intends to fit beside it. Ends with the hypothesis.
 */
export default function Approaches() {
  const { comparison } = product;
  const total = comparison.approaches.length;

  return (
    <Section id="approaches" variant="charcoal" aria-labelledby="approaches-title">
      {/* Old /#why-ordinum links land here (HashRedirect -> /product#why-ordinum). */}
      <span id="why-ordinum" aria-hidden="true" className="absolute top-0" />

      <SectionIntro
        kicker={comparison.kicker}
        title={comparison.title}
        titleId="approaches-title"
        lede={comparison.lede}
      />

      <Reveal
        as="ul"
        stagger={0.07}
        amount={0.05}
        className="hairline-grid mt-14 grid-cols-1 md:mt-20 md:grid-cols-2 xl:grid-cols-3"
      >
        {comparison.approaches.map((a, i) => (
          <RevealItem as="li" key={a.id} className="group relative flex bg-surface">
            <article
              aria-labelledby={`approach-${a.id}`}
              className="flex w-full flex-col p-6 transition-colors duration-300 group-hover:bg-surface-2 sm:p-7 md:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-lime/70 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <span className="font-mono text-[11px] tracking-[0.08em] text-quiet">
                <span className="text-lime">{pad(i + 1)}</span>
                <span aria-hidden="true"> / {pad(total)}</span>
              </span>
              <h3
                id={`approach-${a.id}`}
                className="mt-6 text-[20px] leading-[1.25] font-[550] tracking-title text-balance text-text md:text-[22px]"
              >
                {a.name}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.7] text-text/90">{a.contributes}</p>

              <dl className="mt-6 flex flex-1 flex-col gap-5 border-t border-line pt-5">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase">Best at</dt>
                  <dd className="mt-2 text-[14px] leading-[1.75] text-muted">{a.bestAt}</dd>
                </div>
                <div className="mt-auto border-l border-lime/50 pl-4">
                  <dt className="font-mono text-[10px] tracking-[0.13em] text-lime uppercase">Where Ordinum fits</dt>
                  <dd className="mt-2 text-[14px] leading-[1.75] text-muted">{a.whereOrdinumFits}</dd>
                </div>
              </dl>
            </article>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12 lg:gap-12">
        <p className="font-mono text-[10px] tracking-[0.13em] text-subtle uppercase lg:col-span-3 lg:pt-3">
          <span className="text-lime">Hypothesis</span>
        </p>
        <p className="border-l border-lime pl-6 text-[clamp(22px,2.3vw,32px)] leading-[1.25] font-semibold tracking-title text-balance text-text md:pl-10 lg:col-span-9">
          {comparison.hypothesis}
        </p>
      </Reveal>
    </Section>
  );
}
