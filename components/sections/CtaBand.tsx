import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { ctaBand, type Link, type PageKey } from "@/lib/content";

/** Page-specific copy for the band (e.g. `platform.cta` on /products). Unset fields fall back to `ctaBand`. */
export type CtaBandCopy = {
  readonly title: string;
  readonly titleMuted?: string;
  readonly body: string;
  readonly primary: Link;
  readonly secondary?: Link;
};

type CtaBandProps = {
  /**
   * The page this band closes. The secondary "Watch demo" button is dropped where it would
   * repeat the recording the page already shows (home, /demos).
   */
  current?: PageKey | "home";
  /** Optional page-specific copy; the note always comes from `ctaBand`. */
  copy?: CtaBandCopy;
};

/** Pages that already show the flagship recording. */
const SHOWS_DEMO: readonly (PageKey | "home")[] = ["home", "demos"];

/**
 * Slim sage band closing the home page and every inner page except /contact: one primary
 * "Request an evaluation" button and, where useful, the secondary "Watch demo". No other
 * calls to action. All copy from `ctaBand` in lib/content.ts.
 */
export default function CtaBand({ current, copy }: CtaBandProps) {
  const title = copy?.title ?? ctaBand.title;
  const titleMuted = copy ? copy.titleMuted : ctaBand.titleMuted;
  const body = copy?.body ?? ctaBand.body;
  const primary = copy?.primary ?? ctaBand.demo;
  const wanted = copy?.secondary ?? ctaBand.secondary;
  const secondary = current !== undefined && SHOWS_DEMO.includes(current) ? null : wanted;

  return (
    <Section id="get-started" variant="sage" aria-labelledby="get-started-title" className="overflow-hidden py-[56px] md:py-[76px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_35%,black_90%)]"
      />
      <div className="relative flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="max-w-[720px]">
          <Kicker tone="sage" dot>
            {ctaBand.kicker}
          </Kicker>
          <Heading id="get-started-title" tone="sage" muted={titleMuted} className="mt-5">
            {title}
          </Heading>
          <p className="mt-5 max-w-[600px] text-[16px] leading-[1.65] tracking-[-0.012em] text-sage-ink/80 md:text-[17px]">{body}</p>
          <p className="mt-4 flex max-w-[600px] gap-3 text-[14px] leading-[1.65] text-sage-ink/70">
            <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 border border-sage-ink/50" />
            {ctaBand.note}
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-1 gap-3 sm:flex sm:gap-[14px]">
          <Button href={primary.href} variant="dark" icon="→">
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="dark" className="bg-transparent text-sage-ink hover:text-[#f0f5ec]">
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
