import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { pages, pageOrder, type PageKey } from "@/lib/content";

/**
 * Inner-page hero: mono kicker, one h1 with a muted continuation, lede.
 * Same masked 48px grid as the home Hero, at a shorter height.
 */
export default function PageHeader({ page }: { page: PageKey }) {
  const { header } = pages[page];
  const position = (pageOrder as readonly PageKey[]).indexOf(page);
  const index = position >= 0 ? String(position + 1).padStart(2, "0") : undefined;

  return (
    <header className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_80%,rgb(123_166_137/0.08),transparent_55%)]"
      />
      <Container className="pb-16 pt-16 md:pb-24 md:pt-28">
        <Reveal>
          <Kicker dot index={index}>
            {header.kicker}
          </Kicker>
          <h1
            id="page-title"
            className="mt-6 max-w-[1050px] text-[clamp(38px,9.6vw,48px)] font-[650] leading-[1.04] tracking-hero text-balance sm:mt-7 sm:text-[clamp(48px,5.4vw,84px)]"
          >
            <span className="block">{header.title}</span>
            {"titleMuted" in header && header.titleMuted && (
              <>
                {" "}
                <span className="block text-quiet">{header.titleMuted}</span>
              </>
            )}
          </h1>
          <p className="mt-7 max-w-[640px] text-[16px] leading-[1.7] tracking-[-0.017em] text-[#b9c2c0] md:mt-8 md:text-[18px]">
            {header.lede}
          </p>
        </Reveal>
      </Container>
    </header>
  );
}
