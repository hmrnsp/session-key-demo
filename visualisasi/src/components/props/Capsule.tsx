import React from "react";
import { COLORS, FONTS } from "../../theme";

type CapsuleProps = {
  width?: number;
  label?: string;
  readable?: boolean;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
};

export const Capsule: React.FC<CapsuleProps> = ({
  width = 340,
  label = "{ iv, data, tag }",
  readable = false,
  color = COLORS.nasabah,
  fontSize = 20,
  style,
}) => {
  const height = width * (140 / 400);
  const body = readable ? "#FFFFFF" : "#171F2C";
  const text = readable ? COLORS.ink : "#DCE6FF";
  const accent = readable ? COLORS.bank : color;

  return (
    <svg
      viewBox="0 0 400 140"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <rect x={0} y={24} width={400} height={92} rx={46} fill="#000000" opacity={0.14} />
      <rect x={0} y={18} width={400} height={92} rx={46} fill={body} />
      <rect
        x={0}
        y={18}
        width={400}
        height={92}
        rx={46}
        fill="none"
        stroke={accent}
        strokeWidth={3}
      />
      <circle cx={46} cy={64} r={21} fill={accent} opacity={0.2} />
      <rect x={39} y={60} width={14} height={13} rx={3} fill={accent} />
      <path
        d="M42 60 v-4 a4 4 0 0 1 8 0 v4"
        fill="none"
        stroke={accent}
        strokeWidth={3}
      />
      <text
        x={82}
        y={72}
        fill={text}
        fontFamily={FONTS.mono}
        fontSize={fontSize}
        fontWeight={700}
      >
        {label}
      </text>
      <circle cx={372} cy={64} r={12} fill={COLORS.gold} opacity={readable ? 0 : 1} />
      <rect
        x={367}
        y={60}
        width={10}
        height={9}
        rx={2}
        fill="#6B4E08"
        opacity={readable ? 0 : 1}
      />
    </svg>
  );
};
