import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Section from "@/components/ui/Section";
import { ctaBand } from "@/lib/content";

/** Slim sage band closing every page except /contact: headline + demo + call. */
export default function CtaBand() {
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
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Heading id="get-started-title" tone="sage" muted={ctaBand.titleMuted} className="max-w-[720px]">
          {ctaBand.title}
        </Heading>
        <div className="grid grid-cols-1 gap-3 sm:flex sm:shrink-0 sm:gap-[14px]">
          <Button href={ctaBand.demo.href} variant="dark" icon="→">
            {ctaBand.demo.label}
          </Button>
          <Button href={ctaBand.bookCall.href} variant="dark" className="bg-transparent text-sage-ink hover:text-[#f0f5ec]">
            {ctaBand.bookCall.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
