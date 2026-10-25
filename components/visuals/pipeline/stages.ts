import { hero, type WorkflowStageId } from "@/lib/content";

/**
 * Stage labels and captions for the hero loop, read from lib/content.ts (WORKFLOW_STAGES):
 * Connect, Stress-test, Verify, Reproduce & prevent. The hero visual is the home page's only
 * statement of the four stages. The seven-stage lifecycle lives on /technology only.
 */
export type PipelineStage = {
  readonly id: WorkflowStageId;
  readonly label: string;
  readonly caption: string;
};

export const PIPELINE_STAGES: readonly PipelineStage[] = hero.visual.stages;
