"use client";

import { FLAGSHIP_VIDEO_ID } from "./FlagshipVideo";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * "0:46" button under a strip step: jumps the flagship recording to that moment and plays it.
 * Playback starts only on this click (never automatically). Without JavaScript it is inert text.
 */
export default function SeekButton({ at, label }: { at: number; label: string }) {
  function seek() {
    const video = document.getElementById(FLAGSHIP_VIDEO_ID) as HTMLVideoElement | null;
    if (!video) return;
    const go = () => {
      video.currentTime = at;
      void video.play().catch(() => undefined);
    };
    if (video.readyState >= 1) go();
    else {
      video.addEventListener("loadedmetadata", go, { once: true });
      video.preload = "metadata";
      video.load();
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }
  return (
    <button
      type="button"
      onClick={seek}
      className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-muted underline decoration-line-2 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
    >
      <span aria-hidden="true">▸</span>
      {mmss(at)}
      <span className="sr-only"> in the recording: {label}</span>
    </button>
  );
}
