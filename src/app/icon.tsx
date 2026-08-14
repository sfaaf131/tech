import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fcfcfc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111111",
          fontSize: 18,
          fontWeight: 600,
          border: "1px solid #111111",
        }}
      >
        k
      </div>
    ),
    size,
  );
}
