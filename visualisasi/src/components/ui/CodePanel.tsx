import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";
import { withAlpha } from "../../utils/color";

type Tone = "neutral" | "ok" | "danger";

const TONE: Record<Tone, { accent: string; text: string }> = {
  neutral: { accent: "#6E8299", text: "#C7D3E2" },
  ok: { accent: "#34C08A", text: "#CBECDD" },
  danger: { accent: COLORS.hacker, text: "#F3C6CC" },
};

type CodePanelProps = {
  title: string;
  lines: string[];
  tone?: Tone;
  width?: number;
  start?: number;
  style?: React.CSSProperties;
};

export const CodePanel: React.FC<CodePanelProps> = ({
  title,
  lines,
  tone = "neutral",
  width = 560,
  start = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const colors = TONE[tone];
  const enter = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#12161E",
        border: `3px solid ${withAlpha(colors.accent, 0.55)}`,
        boxShadow: "0 24px 50px rgba(20,32,27,0.28)",
        opacity: enter,
        translate: `0 ${interpolate(enter, [0, 1], [30, 0])}px`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          backgroundColor: "#1B2130",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: COLORS.hacker,
            }}
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: COLORS.gold,
            }}
          />
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#34C08A",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 700,
            color: "#93A3B8",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ padding: "18px 22px 22px" }}>
        {lines.map((line, i) => {
          const lineStart = start + 10 + i * 5;
          const p = interpolate(frame, [lineStart, lineStart + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.mono,
                fontSize: 23,
                lineHeight: 1.55,
                whiteSpace: "pre",
                color: colors.text,
                opacity: p,
                translate: `0 ${interpolate(p, [0, 1], [10, 0])}px`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 23,
            lineHeight: 1.55,
            color: colors.accent,
            opacity: cursorOn ? 1 : 0,
          }}
        >
          ▊
        </div>
      </div>
    </div>
  );
};
