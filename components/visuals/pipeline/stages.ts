import { hero, lifecycle, type LifecycleStageId } from "@/lib/content";

/**
 * Stage labels and captions for the hero loop, read from lib/content.ts. The labels are the
 * lifecycle's verbs (Define, Generate, Execute, Observe, Verify, Reproduce, Regress), so the
 * home page uses one vocabulary for the loop.
 */
export type PipelineStage = {
  readonly id: LifecycleStageId;
  readonly label: string;
  readonly caption: string;
};

export const PIPELINE_STAGES: readonly PipelineStage[] = hero.visual.stages.map((s) => ({
  id: s.id,
  label: lifecycle.stages.find((l) => l.id === s.id)?.short ?? s.id,
  caption: s.caption,
}));

/** Short names for the platform-vision domains, keyed by `platformVision.domains[].id`. */
export const DOMAIN_SHORT: Readonly<Record<string, string>> = hero.visual.domainShort;
