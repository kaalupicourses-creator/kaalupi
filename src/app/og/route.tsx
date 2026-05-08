import { ImageResponse } from "next/og";

export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FEFBF5",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "linear-gradient(90deg, #2D5016, #7AB648, #F5A62A)",
          }}
        />

        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#2D5016",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Kaalupi
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "#F5A62A",
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          AI-First Career Platform Indonesia
        </p>
        <p
          style={{
            fontSize: 18,
            color: "#444444",
            marginTop: 8,
            textAlign: "center",
            maxWidth: "70%",
          }}
        >
          Dari Nol ke AI Specialist — Course IT dengan integrasi AI Tools
        </p>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 16,
            fontSize: 14,
            color: "#7AB648",
            fontWeight: 600,
          }}
        >
          <span>#AI</span>
          <span>#Programming</span>
          <span>#CyberSecurity</span>
          <span>#Network</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
