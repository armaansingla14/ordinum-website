import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { ctaBand, pages, type Link, type PageKey } from "@/lib/content";

/** Page-specific copy for the band (e.g. `product.cta` on /product). Unset fields fall back to `ctaBand`. */
export type CtaBandCopy = {
  readonly title: string;
  readonly titleMuted?: string;
  readonly body: string;
  readonly primary: Link;
  readonly secondary?: Link;
};

type CtaBandProps = {
  /**
   * The page this band closes. When a button would link to the current page (the secondary
   * "See Ordinum in action" on /demo), it is swapped for the Cal.com "Book a call" link.
   */
  current?: PageKey | "home";
  /** Optional page-specific copy; the design-partner note and Book-a-call link always come from `ctaBand`. */
  copy?: CtaBandCopy;
};

/**
 * Slim sage band closing the home page and every inner page except /contact: design-partner
 * invitation, primary "Talk to the founders", secondary "See Ordinum in action", and a quiet
 * "Book a call" link. All copy from `ctaBand` in lib/content.ts.
 */
export default function CtaBand({ current, copy }: CtaBandProps) {
  const title = copy?.title ?? ctaBand.title;
  const titleMuted = copy ? copy.titleMuted : ctaBand.titleMuted;
  const body = copy?.body ?? ctaBand.body;
  const primary = copy?.primary ?? ctaBand.demo;
  const wanted = copy?.secondary ?? ctaBand.secondary;

  const currentHref = current !== undefined && current !== "home" ? pages[current].href : current === "home" ? "/" : null;
  const selfLink = currentHref !== null && wanted.href.split("#")[0] === currentHref;
  const secondary = selfLink ? ctaBand.bookCall : wanted;

  return (
    <Section
      id="get-started"
      variant="sage"
      aria-labelledby="get-started-title"
      className="overflow-hidden py-[64px] md:py-[88px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_35%,black_90%)]"
      />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="max-w-[720px]">
          <Kicker tone="sage" dot>
            {ctaBand.kicker}
          </Kicker>
          <Heading id="get-started-title" tone="sage" muted={titleMuted} className="mt-5">
            {title}
          </Heading>
          <p className="mt-6 max-w-[600px] text-[16px] leading-[1.65] tracking-[-0.012em] text-sage-ink/80 md:text-[17px]">
            {body}
          </p>
          <p className="mt-4 flex max-w-[600px] gap-3 text-[14px] leading-[1.65] text-sage-ink/70">
            <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 border border-sage-ink/50" />
            {ctaBand.note}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:flex sm:gap-[14px]">
            <Button href={primary.href} variant="dark" icon="→">
              {primary.label}
            </Button>
            <Button
              href={secondary.href}
              variant="dark"
              className="bg-transparent text-sage-ink hover:text-[#f0f5ec]"
            >
              {secondary.label}
            </Button>
          </div>
          {!selfLink && (
            <a
              href={ctaBand.bookCall.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group -my-2 inline-flex min-h-11 items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.12em] text-sage-ink/75 underline decoration-sage-ink/30 underline-offset-4 transition-colors duration-200 hover:text-sage-ink hover:decoration-sage-ink sm:self-end"
            >
              Or {ctaBand.bookCall.label.toLowerCase()}
              <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
