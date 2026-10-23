import Link from "next/link";
import Container from "@/components/ui/Container";
import { pages, pageOrder, type PageKey } from "@/lib/content";

/** Hairline row linking to the next inner page in reading order. Renders nothing on the last page. */
export default function NextPage({ current }: { current: PageKey }) {
  const order = pageOrder as readonly PageKey[];
  const position = order.indexOf(current);
  const nextKey = position >= 0 ? order[position + 1] : undefined;
  if (!nextKey) return null;
  const next = pages[nextKey];

  return (
    <nav aria-label="Next page" className="border-t border-line">
      <Container>
        <Link
          href={next.href}
          className="group flex items-center justify-between gap-6 py-9 md:py-12"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-subtle">
            <span className="text-lime">Next / {String(position + 2).padStart(2, "0")}</span>
          </span>
          <span className="flex items-center gap-4 text-[clamp(28px,3.2vw,44px)] font-semibold leading-none tracking-display text-text transition-colors duration-200 group-hover:text-lime">
            {next.label}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </Link>
      </Container>
    </nav>
  );
}
