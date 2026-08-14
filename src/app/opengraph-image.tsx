import { ImageResponse } from "next/og";

export const alt = "kondax.tech — lab personal cooperativo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fcfcfc",
          color: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 3,
            color: "#5c5c5c",
          }}
        >
          KONDAX.TECH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 500 }}>
            Lo que construyo, a la vista.
          </div>
          <div style={{ fontSize: 28, color: "#5c5c5c" }}>Lab personal cooperativo.</div>
        </div>
        <div style={{ fontSize: 22, color: "#5c5c5c" }}>Agustín Saez C. · Santiago</div>
      </div>
    ),
    size,
  );
}
