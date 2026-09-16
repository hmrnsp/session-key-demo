import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../../theme";

type WireProps = {
  mode?: "idle" | "plain" | "secure" | "attack";
  flow?: "ltr" | "rtl" | "none";
  style?: React.CSSProperties;
};

const MODE_COLOR: Record<NonNullable<WireProps["mode"]>, string> = {
  idle: "#CFC8B6",
  plain: COLORS.wire,
  secure: COLORS.bank,
  attack: COLORS.hacker,
};

export const Wire: React.FC<WireProps> = ({
  mode = "idle",
  flow = "ltr",
  style,
}) => {
  const frame = useCurrentFrame();
  const color = MODE_COLOR[mode];
  const offset =
    flow === "ltr" ? -(frame * 2.2) : flow === "rtl" ? frame * 2.2 : 0;
  const left = LAYOUT.wireLeft;
  const right = LAYOUT.wireRight;

  return (
    <svg
      viewBox="0 0 1920 220"
      width={1920}
      height={220}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}
    >
      <rect x={left} y={94} width={right - left} height={42} rx={21} fill="#000000" opacity={0.08} />
      <rect
        x={left}
        y={88}
        width={right - left}
        height={42}
        rx={21}
        fill="#E7E2D4"
        stroke="#DAD4C4"
        strokeWidth={3}
      />
      <rect x={left + 14} y={101} width={right - left - 28} height={16} rx={8} fill="#FFFFFF" />
      <line
        x1={left + 26}
        y1={109}
        x2={right - 26}
        y2={109}
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="26 32"
        strokeDashoffset={offset}
      />

      <rect x={left - 76} y={72} width={80} height={76} rx={14} fill="#FBFCFB" stroke="#DAD4C4" strokeWidth={3} />
      <circle cx={left - 36} cy={110} r={15} fill={color} />
      <rect x={right - 4} y={72} width={80} height={76} rx={14} fill="#FBFCFB" stroke="#DAD4C4" strokeWidth={3} />
      <circle cx={right + 36} cy={110} r={15} fill={color} />
    </svg>
  );
};
