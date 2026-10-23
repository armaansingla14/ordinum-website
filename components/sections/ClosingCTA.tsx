import DemoForm from "@/components/forms/DemoForm";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Kicker from "@/components/ui/Kicker";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { cta, site } from "@/lib/content";

/** "WORK WITH US / 001" -> ["WORK WITH US", "001"] */
function splitKicker(kicker: string): [string, string | undefined] {
  const [label, index] = kicker.split(" / ");
  return [label ?? kicker, index];
}

const HEADING_ID = "contact-heading";

/** Row labels for the three ways in (UI chrome; the button text comes from content.ts). */
const ROUTES = [
  { key: "partnership", label: "Design partnership", variant: "solid" },
  { key: "talk", label: "Talk live", variant: "outline" },
  { key: "demo", label: "Current demo", variant: "outline" },
] as const;

/**
 * The /contact page: one sage band with the ways to reach the team on the left and
 * the contact form on the right. `asPageHeading` renders the headline as the page's h1.
 */
export default function ClosingCTA({ asPageHeading = false }: { asPageHeading?: boolean } = {}) {
  const [kickerLabel, kickerIndex] = splitKicker(cta.kicker);
  const emailPrefix = cta.emailFallback.replace(site.email, "").trim();
  const SubHeading = asPageHeading ? "h2" : "h3";

  return (
    <Section id="contact" variant="sage" aria-labelledby={HEADING_ID} className="overflow-hidden">
      {/* Faint ink grid, fading in toward the form side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(11_23_20/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(11_23_20/0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,transparent_25%,black_85%)]"
      />

      <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:pr-4">
          <Kicker tone="sage" index={kickerIndex}>
            {kickerLabel}
          </Kicker>

          <Heading
            as={asPageHeading ? "h1" : "h2"}
            id={HEADING_ID}
            size="lg"
            tone="sage"
            muted={cta.titleLine2}
            className="mt-6 text-[clamp(38px,4.6vw,66px)]/[1.04] md:mt-7"
          >
            {cta.title}
          </Heading>

          <p className="mt-7 max-w-[520px] text-[17px] leading-[1.7] tracking-[-0.012em] text-sage-muted md:text-[18px]">
            {cta.body}
          </p>

          {/* Research-stage disclosure next to the primary CTA: no product for sale, no deployment implied. */}
          <p className="mt-6 flex max-w-[520px] gap-3 text-[15px] leading-[1.65] text-sage-ink">
            <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 border border-sage-accent" />
            {cta.stage}
          </p>

          {/* What a design partnership means today (facts only; no terms or pricing). */}
          <div className="mt-8 max-w-[520px] border-t border-sage-ink/15 pt-6">
            <SubHeading className="label-mono text-sage-accent">{cta.partnership.title}</SubHeading>
            <ul className="mt-4 grid gap-3">
              {cta.partnership.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[1.65] text-sage-muted">
                  <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-sage-ink/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-12 border-t border-sage-ink/15 md:mt-14">
            {ROUTES.map((route, i) => {
              const link = cta.ctas[route.key];
              return (
                <li
                  key={route.key}
                  className="flex flex-col gap-4 border-b border-sage-ink/15 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="label-mono text-sage-accent">
                    <span aria-hidden="true" className="mr-3 text-sage-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {route.label}
                  </p>
                  <Button
                    href={link.href}
                    variant="dark"
                    size="sm"
                    icon={route.key === "talk" ? undefined : route.key === "partnership" ? "↓" : "→"}
                    className={cn(
                      // Wraps at 320px instead of overflowing; one line from sm up.
                      "w-full justify-between whitespace-normal text-left sm:w-auto sm:justify-center sm:whitespace-nowrap",
                      route.variant === "outline" && "bg-transparent text-sage-ink hover:text-[#f0f5ec]",
                    )}
                  >
                    {link.label}
                  </Button>
                </li>
              );
            })}
            <li className="flex flex-col gap-3 border-b border-sage-ink/15 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="label-mono text-sage-accent">
                <span aria-hidden="true" className="mr-3 text-sage-muted">
                  {String(ROUTES.length + 1).padStart(2, "0")}
                </span>
                {emailPrefix || "Email"}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="group -my-3 inline-flex min-h-11 items-center gap-3 font-mono text-[14px] tracking-[0.01em] text-sage-ink underline decoration-sage-ink/30 underline-offset-[6px] transition-colors hover:decoration-sage-ink"
              >
                {site.email}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </li>
          </ul>

        </div>

        {/* Not wrapped in <Reveal>: the form must be visible before hydration / without JS. */}
        <div className="lg:col-span-7">
          <DemoForm />
        </div>
      </div>
    </Section>
  );
}
