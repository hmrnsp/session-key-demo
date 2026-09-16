import React from "react";
import { COLORS } from "../../theme";

type SealProps = {
  width?: number;
  state?: "intact" | "cracked";
  style?: React.CSSProperties;
};

export const Seal: React.FC<SealProps> = ({
  width = 110,
  state = "intact",
  style,
}) => {
  const height = width;
  const cracked = state === "cracked";
  const petals = Array.from({ length: 12 });

  return (
    <svg
      viewBox="0 0 120 120"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      {petals.map((_, i) => {
        const a = (i / petals.length) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={60 + Math.cos(a) * 44}
            cy={60 + Math.sin(a) * 44}
            r={11}
            fill={COLORS.gold}
          />
        );
      })}
      <circle cx={60} cy={60} r={50} fill={COLORS.gold} />
      <circle
        cx={60}
        cy={60}
        r={40}
        fill="none"
        stroke="#B08616"
        strokeWidth={3}
      />
      <rect x={52} y={58} width={16} height={20} rx={4} fill="#6B4E08" />
      <path
        d="M55 58 v-6 a5 5 0 0 1 10 0 v6"
        fill="none"
        stroke="#6B4E08"
        strokeWidth={4}
      />

      {cracked ? (
        <>
          <path
            d="M60 8 L 50 42 L 64 54 L 48 74 L 60 96 L 54 112"
            fill="none"
            stroke={COLORS.bg}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <polygon
            points="96,30 118,22 112,44"
            fill={COLORS.gold}
            transform="rotate(18 105 32)"
          />
          <polygon points="16,86 2,104 26,104" fill={COLORS.gold} />
        </>
      ) : null}
    </svg>
  );
};
