import { ImageResponse } from "next/og";

export const alt = "kondax.tech — taller de Agustín Saez C. en Santiago";
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
        <div style={{ fontSize: 22, letterSpacing: 3, color: "#525252" }}>kondax.tech</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 58, lineHeight: 1.08, fontWeight: 500 }}>
            Taller público. Puerta abierta.
          </div>
          <div style={{ fontSize: 28, color: "#525252" }}>Agustín Saez C. · Santiago</div>
        </div>
        <div style={{ fontSize: 22, color: "#525252" }}>Experimentos, notas, cooperar.</div>
      </div>
    ),
    size,
  );
}
