import { flagshipVideo as v } from "@/lib/content";

/** DOM id of the flagship <video>, so the step strip can seek it. One recording per page. */
export const FLAGSHIP_VIDEO_ID = "flagship-video";

/**
 * The flagship recorded run. The duration is shown before playback; the video never autoplays,
 * loads nothing until played (preload="none"), and ships captions plus a plain-text transcript.
 * The planted-defect label is shown once, beside the result (components/visuals/BeforeAfter.tsx),
 * so it is not repeated here.
 */
export default function FlagshipVideo({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        <span className="text-lime">● {v.label}</span>
        <span className="text-subtle">{v.duration}</span>
      </div>
      <video
        id={FLAGSHIP_VIDEO_ID}
        controls
        preload="none"
        playsInline
        poster={v.poster}
        className="block aspect-video w-full border border-line-2 bg-window"
        aria-label={`${v.title}: recorded run, ${v.duration}`}
      >
        <source src={v.webm} type="video/webm" />
        <source src={v.mp4} type="video/mp4" />
        <track kind="captions" src={v.captions} srcLang="en" label="English" default />
      </video>
      <figcaption className="mt-2.5 text-[13px] leading-[1.6] text-subtle">
        Recorded {v.recordedOn} at product commit {v.commit}. Captions included.{" "}
        <a href={v.transcript} className="text-muted underline decoration-line-2 underline-offset-4 hover:text-lime">
          Read the transcript
        </a>
        .
      </figcaption>
    </figure>
  );
}
