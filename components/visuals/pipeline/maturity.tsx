import { MaturityMarker } from "@/components/ui/MaturityMarker";
import { cn } from "@/lib/cn";
import type { Maturity } from "@/lib/content";

/** The site-wide maturity marker (components/ui/MaturityMarker.tsx) at the compact 7px hero size. */
export function MaturityMark({ maturity, className }: { maturity: Maturity; className?: string }) {
  return <MaturityMarker maturity={maturity} className={cn("size-[7px]", className)} />;
}
