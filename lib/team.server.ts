import "server-only";

/**
 * PENDING FOUNDER CONFIRMATION. Do not render until Armaan approves Aarav's profile.
 *
 * Server-only on purpose: lib/content.ts is imported by client components, so anything in it
 * ships in the public JavaScript bundle. Keeping the unapproved profile here means it can
 * only be read by server components (the /about team section) and never reaches the browser
 * while `pendingConfirmation` is true.
 *
 * Drafted profile details are kept OUT of this public repository until the founder approves
 * them; add the approved fields here (keyed by founder name) and set pendingConfirmation to
 * false in lib/content.ts. No achievements, jobs, responsibilities or credentials may be added.
 */
export const pendingProfiles = {} as const satisfies Readonly<
  Record<string, { education: string; summary: string; linkedin: string }>
>;
