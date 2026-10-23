import DemoForm from "@/components/forms/DemoForm";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { cta, site } from "@/lib/content";

/** "WORK WITH US / 010" -> ["WORK WITH US", "010"] */
function splitKicker(kicker: string): [string, string | undefined] {
  const [label, index] = kicker.split(" / ");
  return [label ?? kicker, index];
}

const HEADING_ID = "contact-heading";

export default function ClosingCTA() {
  const [kickerLabel, kickerIndex] = splitKicker(cta.kicker);
  const emailPrefix = cta.emailFallback.replace(site.email, "").trim();

  return (
    <Section id="contact" variant="sage" aria-labelledby={HEADING_ID} className="overflow-hidden">
      {/* Faint ink grid, fading in toward the form side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_25%,black_85%)]"
      />

      <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 lg:pr-6">
          <Kicker tone="sage" index={kickerIndex}>
            {kickerLabel}
          </Kicker>

          <Heading
            id={HEADING_ID}
            size="lg"
            tone="sage"
            muted={cta.titleLine2}
            className="mt-6 text-[clamp(42px,5.2vw,74px)]/[1.03] md:mt-7"
          >
            {cta.title}
          </Heading>

          <p className="mt-7 max-w-[540px] text-[17px] leading-[1.7] tracking-[-0.012em] text-sage-muted md:text-[18px]">
            {cta.body}
          </p>

          <dl className="mt-12 border-t border-sage-ink/15 md:mt-14">
            <div className="flex flex-col gap-4 border-b border-sage-ink/15 py-6 sm:flex-row sm:items-center sm:justify-between">
              <dt className="label-mono text-sage-accent">
                <span aria-hidden="true" className="mr-3 text-sage-muted">
                  01
                </span>
                Talk live
              </dt>
              <dd>
                <Button href={cta.bookCall.href} variant="dark" className="w-full sm:w-auto">
                  {cta.bookCall.label}
                </Button>
              </dd>
            </div>
            <div className="flex flex-col gap-3 border-b border-sage-ink/15 py-6 sm:flex-row sm:items-center sm:justify-between">
              <dt className="label-mono text-sage-accent">
                <span aria-hidden="true" className="mr-3 text-sage-muted">
                  02
                </span>
                {emailPrefix || "Email"}
              </dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="group -my-3 inline-flex min-h-11 items-center gap-3 font-mono text-[14px] tracking-[0.01em] text-sage-ink underline decoration-sage-ink/30 underline-offset-[6px] transition-colors hover:decoration-sage-ink"
                >
                  {site.email}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Not wrapped in <Reveal>: the form must be visible before hydration / without JS. */}
        <div className="lg:col-span-6">
          <DemoForm />
        </div>
      </div>
    </Section>
  );
}
