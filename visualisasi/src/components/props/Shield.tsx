import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";

type ShieldProps = {
  width?: number;
  state?: "ok" | "block";
  style?: React.CSSProperties;
};

export const Shield: React.FC<ShieldProps> = ({
  width = 190,
  state = "ok",
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width * (230 / 200);
  const ok = state === "ok";
  const base = ok ? COLORS.bank : COLORS.hacker;
  const pulse = 0.75 + Math.abs(Math.sin(frame / 12)) * 0.25;

  return (
    <svg
      viewBox="0 0 200 230"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      {!ok ? (
        <ellipse cx={100} cy={115} rx={104} ry={112} fill={base} opacity={0.16 * pulse} />
      ) : null}
      <path
        d="M100 14 L 184 46 V 122 c0 50 -38 84 -84 100 c-46 -16 -84 -50 -84 -100 V46 z"
        fill={base}
      />
      <path
        d="M100 34 L 166 59 V 122 c0 38 -28 64 -66 78 c-38 -14 -66 -40 -66 -78 V59 z"
        fill="#FFFFFF"
        opacity={0.16}
      />
      {ok ? (
        <path
          d="M64 118 l24 26 l50 -58"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={16}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <g stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round">
          <path d="M68 88 L 132 148" />
          <path d="M132 88 L 68 148" />
        </g>
      )}
    </svg>
  );
};
