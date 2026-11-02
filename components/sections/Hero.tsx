import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { hero } from "@/lib/content";

/**
 * Hero (first screen): the platform ambition, what is available today (firmware and hardware
 * marked planned), how it is delivered, and the two CTAs ("Request an evaluation" -> /contact,
 * "Watch demo" -> #demo). Kept compact so the flagship recording starts inside a 1440x900
 * viewport (tests/site.spec.ts). The recording follows in components/sections/home/DemoVideo.tsx.
 */
export default function Hero() {
  const a = hero.availability;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg to-transparent"
      />

      <Container className="pt-10 pb-10 sm:pt-14 md:pb-12 lg:pt-10 lg:pb-10">
        <Kicker dot>{hero.eyebrow}</Kicker>

        <h1
          id="hero-title"
          className="mt-4 max-w-[1100px] text-[clamp(36px,10vw,48px)] leading-[1.04] font-[650] tracking-hero text-balance sm:text-[clamp(48px,5.6vw,72px)]"
        >
          <span className="block">{hero.titleLine1}</span>{" "}
          <span className="block text-quiet">{hero.titleLine2}</span>
        </h1>

        <div className="mt-6 grid gap-7 lg:mt-7 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-12">
          <div className="max-w-[640px]">
            <p className="text-[16px] leading-[1.65] tracking-[-0.017em] text-[#c3cbc9] md:text-[17.5px]">{hero.lede}</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <Button href={hero.primaryCta.href} icon="→">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" icon="↓">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <dl className="border-y border-line text-[14px] leading-[1.6] lg:border-y-0 lg:border-l lg:pl-8">
            <div className="py-2.5 lg:pt-0">
              <dt className="font-mono text-[10.5px] tracking-[0.12em] text-lime uppercase">{a.label}</dt>
              <dd className="mt-1.5 text-[#c9d1ce]">{a.text}</dd>
            </div>
            <div className="border-t border-line py-2.5">
              <dt className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">{a.plannedLabel}</dt>
              <dd className="mt-1.5 text-muted">{a.planned}</dd>
            </div>
            <div className="border-t border-line py-2.5 lg:pb-0">
              <dt className="sr-only">Delivery</dt>
              <dd className="text-muted">{hero.delivery}</dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
