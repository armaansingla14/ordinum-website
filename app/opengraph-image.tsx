import { ImageResponse } from "next/og";
import { ORDINUM_MARK_PATH, ORDINUM_MARK_VIEWBOX } from "@/components/brand/OrdinumMark";
import { STATUS_LABELS, hero, platformVision, type Domain } from "@/lib/content";

export const alt = `Ordinum: ${hero.titleLine1} ${hero.titleLine2} ${hero.eyebrow}. ${hero.status}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  bg: "#0b0e10",
  panel: "#0e1315",
  line: "#2a3235",
  line2: "#3a4447",
  text: "#f2f3f0",
  quiet: "#9aaba5",
  subtle: "#7d8c8a",
  steel: "#6f7f86",
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
const FOOTER_RIGHT = hero.meta.join(" · ");

/* Status panel: the real implementation status of each domain (lib/content.ts platformVision). */
const PANEL_TITLE = "PLATFORM STATUS";
const ROWS = (platformVision.domains as readonly Domain[]).map((d) => ({
  id: d.id,
  // An implemented row always carries its scope (simulation only), even without the page's notes.
  label: `${d.name.split(" & ")[0] ?? d.name}${d.scope ? " · Nav2 sim" : ""}`.toUpperCase(),
  implemented: d.status === "implemented",
  status: STATUS_LABELS[d.status].toUpperCase(),
}));
const CORE_LABEL = platformVision.core.name.toUpperCase();
/** Not a bare "Implemented": the core exists at research stage, with parts still planned. */
const CORE_STATUS = "RESEARCH-STAGE";

export default async function OpengraphImage() {
  const displayText = `${hero.titleLine1}${hero.titleLine2}Ordinum`;
  const monoText = [KICKER, FOOTER_LEFT, FOOTER_RIGHT, PANEL_TITLE, CORE_LABEL, CORE_STATUS, ...ROWS.flatMap((r) => [r.label, r.status])].join("");

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
          padding: "60px 72px 52px",
          color: C.text,
          fontFamily: display,
        }}
      >
        {/* Fade the grid toward the bottom-left so the type sits on clean ground. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(to bottom right, rgba(11,14,16,0.35) 0%, rgba(11,14,16,0.7) 45%, rgba(11,14,16,0.94) 100%)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox={ORDINUM_MARK_VIEWBOX}>
            <path fill={C.text} fillRule="evenodd" d={ORDINUM_MARK_PATH} />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.3, color: C.text }}>Ordinum</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 28,
                fontFamily: mono,
                fontSize: 17,
                letterSpacing: 2.2,
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
                fontSize: 74,
                fontWeight: 600,
                lineHeight: 1.06,
                letterSpacing: -4.2,
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ color: C.text }}>{hero.titleLine1}</div>
              <div style={{ color: C.quiet }}>{hero.titleLine2}</div>
            </div>
          </div>

          {/* Status panel: solid lime = implemented, dashed steel = planned. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 318,
              flexShrink: 0,
              border: `1px solid ${C.line2}`,
              backgroundColor: C.panel,
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: 1.3,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "11px 16px",
                borderBottom: `1px solid ${C.line}`,
                color: C.subtle,
              }}
            >
              {PANEL_TITLE}
            </div>
            {ROWS.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    marginRight: 12,
                    backgroundColor: row.implemented ? C.lime : "transparent",
                    border: row.implemented ? `1px solid ${C.lime}` : `1px dashed ${C.steel}`,
                  }}
                />
                <div style={{ display: "flex", flexGrow: 1, color: row.implemented ? C.text : C.quiet }}>{row.label}</div>
                <div style={{ display: "flex", color: row.implemented ? C.lime : C.steel }}>{row.status}</div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: 10,
                padding: "10px 12px",
                border: `1px solid ${C.lime}`,
              }}
            >
              <div style={{ width: 9, height: 9, marginRight: 12, backgroundColor: C.lime }} />
              <div style={{ display: "flex", flexGrow: 1, color: C.text }}>{CORE_LABEL}</div>
              <div style={{ display: "flex", color: C.lime }}>{CORE_STATUS}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${C.line}`,
            paddingTop: 20,
            fontFamily: mono,
            fontSize: 17,
            letterSpacing: 1.6,
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
