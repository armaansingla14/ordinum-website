import DemoForm from "@/components/forms/DemoForm";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { contact, site } from "@/lib/content";

/** "TALK TO US / 001" -> ["TALK TO US", "001"] */
function splitKicker(kicker: string): [string, string | undefined] {
  const [label, index] = kicker.split(" / ");
  return [label ?? kicker, index];
}

const TALK_HEADING_ID = "contact-talk-heading";
const INQUIRY_HEADING_ID = "contact-inquiry-heading";

/**
 * The /contact page: one sage band with two clearly separate paths.
 *   01 Talk to us (#talk): book a call on Cal.com or email the founders directly.
 *   02 Send an inquiry (#inquiry): the short form.
 * `asPageHeading` renders the "Talk to the founders." headline as the page's h1.
 * Server component; only the form inside is a client component.
 */
export default function ClosingCTA({ asPageHeading = false }: { asPageHeading?: boolean } = {}) {
  const { talk, inquiry, partnership } = contact;
  const [talkLabel, talkIndex] = splitKicker(talk.kicker);
  const [inquiryLabel, inquiryIndex] = splitKicker(inquiry.kicker);
  const TalkHeading = asPageHeading ? "h1" : "h2";
  const SubHeading = asPageHeading ? "h2" : "h3";

  return (
    <Section id="contact" variant="sage" aria-labelledby={TALK_HEADING_ID} className="overflow-hidden">
      {/* Faint ink grid, fading in toward the form side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_25%,black_85%)]"
      />

      <div className="relative grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Path 01: talk to the founders. */}
        <div id={talk.id} className="scroll-mt-[88px] lg:col-span-5 lg:pr-4">
          <Kicker tone="sage" index={talkIndex}>
            {talkLabel}
          </Kicker>

          <Heading
            as={TalkHeading}
            id={TALK_HEADING_ID}
            size="lg"
            tone="sage"
            className="mt-6 text-[clamp(38px,4.6vw,66px)]/[1.04] md:mt-7"
          >
            {talk.title}
          </Heading>

          <p className="mt-7 max-w-[520px] text-[17px] leading-[1.7] tracking-[-0.012em] text-sage-muted md:text-[18px]">
            {talk.body}
          </p>

          <div className="mt-9 flex max-w-[520px] flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
            <Button
              href={talk.calCta.href}
              variant="dark"
              className="w-full justify-between whitespace-normal text-left sm:w-auto sm:justify-center sm:whitespace-nowrap"
            >
              {talk.calCta.label}
            </Button>
            <a
              href={talk.emailCta.href}
              className="group inline-flex min-h-11 items-center gap-3 break-all font-mono text-[14px] tracking-[0.01em] text-sage-ink underline decoration-sage-ink/30 underline-offset-[6px] transition-colors hover:decoration-sage-ink"
            >
              <span>
                <span className="sr-only">Email </span>
                {site.email}
              </span>
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none">
                →
              </span>
            </a>
          </div>

          {/* What a design partnership means today (an invitation; no terms, pricing or pilots). */}
          <div className="mt-12 max-w-[520px] border-t border-sage-ink/15 pt-6">
            <SubHeading className="label-mono text-sage-accent">{partnership.title}</SubHeading>
            <ul className="mt-4 grid gap-3">
              {partnership.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[1.65] text-sage-muted">
                  <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-sage-ink/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Path 02: send an inquiry. Not wrapped in <Reveal>: visible before hydration / without JS. */}
        <div id={inquiry.id} aria-labelledby={INQUIRY_HEADING_ID} role="region" className="scroll-mt-[88px] lg:col-span-7">
          <div className="mb-8 border-t border-sage-ink/15 pt-6 lg:border-t-0 lg:pt-0">
            <Kicker tone="sage" index={inquiryIndex}>
              {inquiryLabel}
            </Kicker>
            <SubHeading
              id={INQUIRY_HEADING_ID}
              className="mt-4 text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.15] tracking-title text-sage-ink"
            >
              {inquiry.title}
            </SubHeading>
            <p className="mt-3 text-[15px] leading-[1.65] text-sage-muted">{inquiry.body}</p>
          </div>
          <DemoForm />
        </div>
      </div>
    </Section>
  );
}
