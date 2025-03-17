import { ImageResponse } from "@vercel/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexWrap: "nowrap",
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 900,
            color: "black",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
          }}
        >
          <b>
            <span>Quick</span>
            <span
              style={{
                color: "#3B82F6",
              }}
            >
              Share
            </span>
          </b>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
