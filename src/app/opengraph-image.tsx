import { ImageResponse } from "next/og";

export const alt = "Kondax.tech — flujo, automatización e IA. Socio técnico para fundadores.";
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
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#6b6b6b" }}>KONDAX.TECH</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 600 }}>
            Flujo, automatización e IA para empresas.
          </div>
          <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 600, color: "#5c5c5c" }}>
            Socio técnico con equity para fundadores.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#6b6b6b" }}>Mapear · Automatizar · Inteligencia · Célula</div>
      </div>
    ),
    size,
  );
}
