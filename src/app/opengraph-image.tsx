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
          background: "#07090c",
          color: "#e8eef4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#93a4b8" }}>
          KONDAX.TECH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600 }}>
            Incubamos con IA.
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.05, color: "#5eead4", fontWeight: 600 }}>
            Ejecutamos con células.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#8b97a8" }}>
          SaaS · Fábrica · Sweat equity
        </div>
      </div>
    ),
    size,
  );
}
