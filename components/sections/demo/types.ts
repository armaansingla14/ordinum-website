/** Serializable view models passed from the server sections to the client stepper. */

import type { DemoStepId } from "@/lib/content";

export type ExcerptRow = {
  /** Mono key, e.g. "Target" or "11.61 s". */
  readonly k: string;
  readonly v: string;
  /** "violation" renders orange (failures only); "kept"/"removed" mark ddmin outcomes. */
  readonly tone?: "violation" | "kept" | "removed";
};

export type DemoStepView = {
  readonly n: string;
  readonly id: DemoStepId;
  readonly label: string;
  readonly detail: string;
  readonly source: string;
  /** Values read from lib/evidence.ts, shown under the step as the artifact excerpt. */
  readonly excerpt: readonly ExcerptRow[];
  /** Replay outcome squares, for the reproduction step only. */
  readonly replay?: { readonly failures: number; readonly trials: number };
};
