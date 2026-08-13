import { ImageResponse } from "next/og";

export const alt = "Kondax.tech — factoría de software, IA y venture studio";
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
          <div style={{ fontSize: 56, lineHeight: 1.08, fontWeight: 600 }}>
            Ingeniería para empresas.
          </div>
          <div style={{ fontSize: 56, lineHeight: 1.08, color: "#5eead4", fontWeight: 600 }}>
            Co-inversión para startups.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#8b97a8" }}>
          Factoría · IA · Sweat equity
        </div>
      </div>
    ),
    size,
  );
}
