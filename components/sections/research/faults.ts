import type { EvidenceFault } from "@/lib/evidence";

type LooseFault = Omit<EvidenceFault, "params"> & {
  readonly params: Readonly<Record<string, number | string | undefined>>;
};

/**
 * The fault arrays in lib/evidence.ts are inferred as a union whose missing params are typed
 * `?: undefined`, which does not narrow to EvidenceFault. Drop undefined keys (none exist at runtime).
 */
export function asFaults(faults: readonly LooseFault[]): readonly EvidenceFault[] {
  return faults.map((f) => ({
    ...f,
    params: Object.fromEntries(
      Object.entries(f.params).filter((e): e is [string, number | string] => e[1] !== undefined),
    ),
  }));
}
