import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { hero } from "@/lib/content";
import { MaturityMark } from "@/components/visuals/pipeline/maturity";

/**
 * Hero (first screen): what Ordinum does, who uses it and how it is delivered, the two CTAs
 * ("Watch the demo" -> /demos#demo-flagship, "Talk to us"), and the build status with exact
 * maturity labels. The flagship recording follows in components/sections/home/DemoVideo.tsx.
 */
export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* Background: masked 48px hairline grid + a faint sage bloom behind the pipeline */}
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_80%_85%,rgb(123_166_137/0.09),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg to-transparent"
      />

      <Container className="flex flex-col pt-14 pb-[56px] sm:pt-20 md:pb-20 lg:pt-[clamp(64px,11svh,120px)] lg:pb-[clamp(64px,10svh,112px)]">
        <div>
          <Kicker dot>{hero.eyebrow}</Kicker>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(38px,11.1vw,54px)] leading-[1.03] font-[650] tracking-hero [word-spacing:0.06em] text-balance sm:mt-7 sm:text-[clamp(54px,6.3vw,96px)]"
          >
            <span className="block">{hero.titleLine1}</span>{" "}
            <span className="block text-quiet">{hero.titleLine2}</span>
          </h1>

          <div className="mt-7 flex flex-col gap-8 sm:mt-8 md:gap-9">
            <div className="max-w-[640px]">
              <p className="text-[16px] leading-[1.7] tracking-[-0.017em] text-[#b9c2c0] md:text-[18px]">
                {hero.lede}
              </p>
              <p className="mt-4 text-[14.5px] leading-[1.65] text-muted md:text-[15px]">{hero.audience}</p>
              <p className="mt-4 border-l border-lime/60 pl-4 text-[14.5px] leading-[1.65] text-[#c9d1ce] md:text-[15px]">
                {hero.delivery}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:gap-[18px]">
              <Button href={hero.primaryCta.href} icon="→">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" icon="→">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <ul
              aria-label="Status"
              className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[11px] leading-[1.3] tracking-[0.09em] text-[#889591] uppercase sm:text-[10px]"
            >
              {hero.status.map(({ text, maturity }) => (
                <li key={text} className="flex items-center gap-2.5">
                  {maturity ? (
                    <MaturityMark maturity={maturity} />
                  ) : (
                    <span aria-hidden="true" className="inline-block size-[7px] shrink-0 border border-subtle" />
                  )}
                  <span className={maturity ? "text-[#b9c2c0]" : undefined}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
