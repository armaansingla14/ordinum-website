import { ImageResponse } from "next/og";
import { ORDINUM_MARK_PATH, ORDINUM_MARK_VIEWBOX } from "@/components/brand/OrdinumMark";
import { hero } from "@/lib/content";

export const alt = "Ordinum: Break autonomous systems. Before reality does.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  bg: "#0b0e10",
  line: "#2a3235",
  text: "#f2f3f0",
  quiet: "#9aaba5",
  subtle: "#7d8c8a",
  lime: "#c1e29e",
};

type LoadedFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600;
  style: "normal";
};

/**
 * Fetch a TTF subset from Google Fonts at build time. Any network failure
 * resolves to null so the image still renders with the bundled fallback font.
 */
async function loadGoogleFont(
  family: string,
  weight: 400 | 500 | 600,
  text: string,
): Promise<LoadedFont | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    if (!res.ok) return null;
    return { name: family, data: await res.arrayBuffer(), weight, style: "normal" };
  } catch {
    return null;
  }
}

const KICKER = hero.eyebrow.toUpperCase();
const FOOTER_LEFT = "ordinum.org";
const FOOTER_RIGHT = hero.meta[0];

export default async function OpengraphImage() {
  const displayText = `${hero.titleLine1}${hero.titleLine2}Ordinum`;
  const monoText = `${KICKER}${FOOTER_LEFT}${FOOTER_RIGHT}`;

  const fonts = (
    await Promise.all([
      loadGoogleFont("Inter", 600, displayText),
      loadGoogleFont("DM Mono", 400, monoText),
    ])
  ).filter((f): f is LoadedFont => f !== null);

  const hasInter = fonts.some((f) => f.name === "Inter");
  const hasMono = fonts.some((f) => f.name === "DM Mono");
  const display = hasInter ? "Inter" : undefined;
  const mono = hasMono ? "DM Mono" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: C.bg,
          backgroundImage: `linear-gradient(to right, rgba(42,50,53,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,50,53,0.45) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundPosition: "-1px -1px",
          padding: "64px 72px 56px",
          color: C.text,
          fontFamily: display,
        }}
      >
        {/* Fade the grid toward the right so the type sits on clean ground. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(to right, rgba(11,14,16,0) 0%, rgba(11,14,16,0.55) 55%, rgba(11,14,16,0.92) 100%)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="60" height="60" viewBox={ORDINUM_MARK_VIEWBOX}>
            <path fill={C.text} fillRule="evenodd" d={ORDINUM_MARK_PATH} />
          </svg>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: -1.4,
              color: C.text,
            }}
          >
            Ordinum
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 30,
              fontFamily: mono,
              fontSize: 19,
              letterSpacing: 2.6,
              color: C.lime,
            }}
          >
            <div style={{ width: 9, height: 9, backgroundColor: C.lime }} />
            {KICKER}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: -4.6,
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ color: C.text }}>{hero.titleLine1}</div>
            <div style={{ color: C.quiet }}>{hero.titleLine2}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${C.line}`,
            paddingTop: 22,
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: 1.8,
            color: C.subtle,
          }}
        >
          <div style={{ color: C.text }}>{FOOTER_LEFT}</div>
          <div>{FOOTER_RIGHT}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
