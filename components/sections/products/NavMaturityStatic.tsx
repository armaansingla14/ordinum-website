import { MaturityMarker } from "@/components/ui/MaturityMarker";
import { cn } from "@/lib/cn";
import { MATURITY_LABELS, type NavItem } from "@/lib/content";

/** Server twin of the nav's maturity label: marker shape + exact label + scope. */
export function NavMaturityStatic({ item, className }: { item: Pick<NavItem, "maturity" | "maturityNote">; className?: string }) {
  if (!item.maturity) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] leading-[1.4] tracking-[0.11em] uppercase",
        item.maturity === "planned" ? "text-subtle" : "text-lime",
        className,
      )}
    >
      <MaturityMarker maturity={item.maturity} className="size-[8px] shrink-0" />
      <span>
        {MATURITY_LABELS[item.maturity]}
        {item.maturityNote && <span className="text-subtle"> · {item.maturityNote}</span>}
      </span>
    </span>
  );
}
