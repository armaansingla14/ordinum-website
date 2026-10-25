import { demoPage } from "@/lib/content";

/* -------------------------------------------------------------------------- */
/* SLOT: future recorded walkthrough video + hosted original reports.          */
/*                                                                            */
/* NOT RENDERED. No video exists, and publishing the original HTML reports     */
/* needs separate founder authorization. This component returns null unless   */
/* lib/content.ts gains a `demoPage.media` object with `enabled: true` AND real */
/* hosted sources. Requested shape (all off by default):                       */
/*                                                                            */
/*   media: {                                                                 */
/*     enabled: false,                                                        */
/*     video: null as null | { src: string; captionsSrc: string; poster?: string; title: string },
/*     reports: null as null | readonly { label: string; href: string }[],     */
/*   }                                                                        */
/*                                                                            */
/* The caption track should be generated from demoPage.captionScript (also not */
/* rendered). Never point `src` at a file that does not exist, and keep the    */
/* "See Ordinum in action" wording until a real video is published.            */
/* -------------------------------------------------------------------------- */

type DemoMedia = {
  enabled: boolean;
  video: null | { src: string; captionsSrc: string; poster?: string; title: string };
  reports: null | readonly { label: string; href: string }[];
};

/** Read defensively so this compiles before and after `demoPage.media` exists. */
const media = (demoPage as { media?: DemoMedia }).media;

export default function RecordedMediaSlot() {
  if (!media?.enabled) return null;
  const { video, reports } = media;
  if (!video && !reports?.length) return null;

  return (
    <div className="mt-10 grid gap-6">
      {video && (
        <figure className="border border-line-2 bg-window">
          <video controls preload="none" playsInline poster={video.poster} className="block aspect-video w-full" aria-label={video.title}>
            <source src={video.src} />
            <track kind="captions" src={video.captionsSrc} srcLang="en" label="English" default />
          </video>
          <figcaption className="px-4 py-3 font-mono text-[10.5px] tracking-[0.06em] text-[#8a9894]">{video.title}</figcaption>
        </figure>
      )}
      {reports && reports.length > 0 && (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {reports.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-lime uppercase underline decoration-lime/40 underline-offset-4 hover:decoration-lime"
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
