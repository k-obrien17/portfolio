import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Keith O'Brien - B2B Tech Ghostwriter";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "80px",
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#f97316",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#f97316",
              letterSpacing: "-0.02em",
            }}
          >
            Keith O&apos;Brien
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: 600,
              color: "#171717",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            B2B Tech Ghostwriter
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "#6b7280",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            Helping executives build authority through compelling content
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            marginTop: "60px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "48px", fontWeight: 600, color: "#171717" }}>
              576+
            </div>
            <div style={{ fontSize: "18px", color: "#6b7280" }}>
              Published pieces
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "48px", fontWeight: 600, color: "#171717" }}>
              70+
            </div>
            <div style={{ fontSize: "18px", color: "#6b7280" }}>
              Clients served
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
