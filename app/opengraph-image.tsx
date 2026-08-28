import { ImageResponse } from "next/og";

export const alt = "hifi — Internet rumah tanpa drama";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#E6007E 0%,#FF6A3D 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -120, right: -80, width: 360, height: 360, borderRadius: 360, background: "rgba(255,255,255,0.10)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -140, left: -110, width: 420, height: 420, borderRadius: 420, background: "rgba(255,255,255,0.08)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 30 }}>
          <div style={{ fontSize: 100, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>hifi</div>
          <div style={{ display: "flex", alignItems: "flex-end", marginLeft: 18, marginBottom: 16 }}>
            <div style={{ width: 16, height: 34, borderRadius: 8, background: "#FFC24B", marginRight: 8 }} />
            <div style={{ width: 16, height: 58, borderRadius: 8, background: "#FFFFFF", marginRight: 8 }} />
            <div style={{ width: 16, height: 80, borderRadius: 8, background: "#FFC24B" }} />
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 920 }}>
          Internet ngebut buat seisi rumah
        </div>

        <div style={{ display: "flex", fontSize: 36, marginTop: 30, opacity: 0.95 }}>
          Fiber &amp; 5G · Pasang gratis · 25+ kota
        </div>

        <div style={{ display: "flex", marginTop: 50 }}>
          <div style={{ display: "flex", background: "#ffffff", color: "#E6007E", fontSize: 32, fontWeight: 700, padding: "16px 34px", borderRadius: 999 }}>
            internetbandung.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
