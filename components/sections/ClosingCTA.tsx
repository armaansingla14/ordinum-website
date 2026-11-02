import DemoForm from "@/components/forms/DemoForm";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { contact, site } from "@/lib/content";

/** "EVALUATIONS / 001" -> ["EVALUATIONS", "001"] */
function splitKicker(kicker: string): [string, string | undefined] {
  const [label, index] = kicker.split(" / ");
  return [label ?? kicker, index];
}

const TALK_HEADING_ID = "contact-talk-heading";
const INQUIRY_HEADING_ID = "contact-inquiry-heading";

/**
 * The /contact page: "Request an evaluation". Left (#talk, kept for old links): how an evaluation
 * starts, in three plain steps, how Ordinum is delivered, and two small inline options (email, or
 * pick a time on Cal.com; the only place the Cal.com link appears). Right (#inquiry): the form.
 * `asPageHeading` renders the heading as the page's h1. Server component; only the form is client.
 */
export default function ClosingCTA({ asPageHeading = false }: { asPageHeading?: boolean } = {}) {
  const { talk, inquiry } = contact;
  const [talkLabel, talkIndex] = splitKicker(talk.kicker);
  const [inquiryLabel, inquiryIndex] = splitKicker(inquiry.kicker);
  const TalkHeading = asPageHeading ? "h1" : "h2";
  const SubHeading = asPageHeading ? "h2" : "h3";

  return (
    <Section id="contact" variant="sage" aria-labelledby={TALK_HEADING_ID} className="overflow-hidden py-[56px] md:py-[88px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_25%,black_85%)]"
      />

      <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div id={talk.id} className="scroll-mt-[88px] lg:col-span-5 lg:pr-4">
          <Kicker tone="sage" index={talkIndex}>
            {talkLabel}
          </Kicker>
          <TalkHeading
            id={TALK_HEADING_ID}
            className="mt-5 text-[clamp(36px,4.4vw,58px)]/[1.04] font-semibold tracking-display text-balance text-sage-ink"
          >
            {talk.title}
          </TalkHeading>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.65] tracking-[-0.012em] text-sage-muted md:text-[18px]">{talk.body}</p>

          <ol className="mt-8 max-w-[520px] border-t border-sage-ink/15">
            {talk.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-2 border-b border-sage-ink/15 py-4">
                <span aria-hidden="true" className="pt-[3px] font-mono text-[11px] tracking-[0.08em] text-sage-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[16px] leading-[1.4] font-semibold tracking-[-0.02em] text-sage-ink">{step.title}</span>
                  <span className="mt-1 block text-[14.5px] leading-[1.6] text-sage-muted">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-[520px] border-l border-sage-ink/30 pl-4 text-[14.5px] leading-[1.65] text-sage-ink/80">{talk.delivery}</p>
          <p className="mt-3 max-w-[520px] text-[13.5px] leading-[1.6] text-sage-muted">{talk.note}</p>

          <ul className="mt-6 flex max-w-[520px] flex-col gap-1 text-[14px] leading-[1.5] text-sage-muted">
            <li>
              <a
                href={talk.emailCta.href}
                className="inline-flex min-h-11 items-center gap-2 break-all text-sage-ink underline decoration-sage-ink/30 underline-offset-4 transition-colors hover:decoration-sage-ink"
              >
                <span className="sr-only">Email </span>
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={talk.calCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sage-ink underline decoration-sage-ink/30 underline-offset-4 transition-colors hover:decoration-sage-ink"
              >
                {talk.calCta.label}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        {/* The form. Not wrapped in <Reveal>: visible before hydration / without JS. */}
        <div id={inquiry.id} aria-labelledby={INQUIRY_HEADING_ID} role="region" className="scroll-mt-[88px] lg:col-span-7">
          <div className="mb-6 border-t border-sage-ink/15 pt-6 lg:border-t-0 lg:pt-0">
            <Kicker tone="sage" index={inquiryIndex}>
              {inquiryLabel}
            </Kicker>
            <SubHeading id={INQUIRY_HEADING_ID} className="mt-4 text-[clamp(24px,2.4vw,30px)] leading-[1.15] font-semibold tracking-title text-sage-ink">
              {inquiry.title}
            </SubHeading>
            <p className="mt-2 text-[15px] leading-[1.65] text-sage-muted">{inquiry.body}</p>
          </div>
          <DemoForm />
        </div>
      </div>
    </Section>
  );
}
