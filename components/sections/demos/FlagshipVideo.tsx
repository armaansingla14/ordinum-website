import { flagshipVideo as v } from "@/lib/content";

/**
 * The flagship recorded run. Duration and evidence classification are shown before playback;
 * the video never autoplays, loads nothing until played (preload="none"), and ships captions
 * plus a plain-text transcript.
 */
export default function FlagshipVideo({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        <span className="text-lime">● {v.label}</span>
        <span className="text-subtle">{v.duration}</span>
      </div>
      <p className="mb-3 border border-orange/60 bg-orange/[0.07] px-3 py-2 font-mono text-[11px] leading-[1.55] tracking-[0.03em] text-orange">
        {v.classification}
      </p>
      <video
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
      <figcaption className="mt-3 text-[13px] leading-[1.6] text-subtle">
        Recorded {v.recordedOn} at product commit {v.commit}. Captions included.{" "}
        <a href={v.transcript} className="text-muted underline decoration-line-2 underline-offset-4 hover:text-lime">
          Read the transcript
        </a>
        .
      </figcaption>
    </figure>
  );
}
