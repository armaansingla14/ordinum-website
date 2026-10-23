import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { research } from "@/lib/content";
import { splitKicker } from "./shared";
import { Tag } from "./badges";

const w = research.withdrawn;

/** History note: the withdrawn v1 results. Secondary in weight, never hidden, and it repeats none of the v1 numbers. */
export default function WithdrawnNote() {
  const [label, index] = splitKicker(w.kicker);
  return (
    <section id="withdrawn-v1" data-withdrawn="" aria-labelledby="withdrawn-title" className="border-t border-line py-[64px] md:py-[88px]">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="label-mono text-subtle">
              {label}
              {index && (
                <>
                  <span aria-hidden="true"> / </span>
                  <span className="sr-only">, section </span>
                  {index}
                </>
              )}
            </p>
            <h2 id="withdrawn-title" className="mt-4 text-[24px] font-semibold leading-[1.2] tracking-title text-text md:text-[28px]">
              {w.title}
            </h2>
            <Tag tone="quiet" className="mt-4">
              Withdrawn · not current evidence
            </Tag>
          </div>
          <div className="space-y-4 lg:col-span-8">
            {w.body.map((p) => (
              <p key={p} className="max-w-[760px] text-[15px] leading-[1.75] text-muted">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
