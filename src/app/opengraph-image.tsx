import { ImageResponse } from "next/og";

export const alt = "Kondax.tech — incubamos con IA, ejecutamos con células";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#07080a",
          color: "#f3efe6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#c9a36a" }}>
          KONDAX.TECH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600 }}>
            Incubamos con IA.
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.05, color: "#d4ff3f", fontWeight: 600 }}>
            Ejecutamos con células.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#9b968b" }}>
          SaaS · Fábrica · Sweat equity
        </div>
      </div>
    ),
    size,
  );
}
