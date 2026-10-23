import PipelineHero from "@/components/visuals/PipelineHero";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import { hero } from "@/lib/content";

/**
 * "Research-stage platform · First implemented integration: ROS 2 / Nav2" -> two mono items.
 * The stage gets a hollow marker; the implemented integration gets the solid lime "implemented" marker.
 */
const statusItems = hero.status.split(" · ");

/**
 * Hero: thesis, plain-language lede, CTAs, honest build status, and the conceptual PipelineHero loop.
 * Desktop: copy on top, the pipeline band anchored to the bottom of a viewport-high
 * (capped) frame. Mobile: copy first, then the vertical pipeline.
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

      <Container className="flex flex-col pt-14 pb-[56px] sm:pt-20 md:pb-16 lg:min-h-[min(calc(100svh-72px),900px)] lg:pt-[clamp(56px,9svh,96px)] lg:pb-10">
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
            <p className="max-w-[600px] text-[16px] leading-[1.7] tracking-[-0.017em] text-[#b9c2c0] md:text-[18px]">
              {hero.lede}
            </p>

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
              {statusItems.map((item, i) => {
                const last = i === statusItems.length - 1;
                return (
                  <li key={item} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={
                        last
                          ? "inline-block size-[7px] shrink-0 bg-lime"
                          : "inline-block size-[7px] shrink-0 border border-subtle"
                      }
                    />
                    <span className={last ? "text-[#b9c2c0]" : undefined}>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-12 md:pt-14 lg:mt-auto lg:pt-12">
          <PipelineHero />
        </div>
      </Container>
    </section>
  );
}
