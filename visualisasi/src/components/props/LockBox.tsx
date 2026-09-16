import React from "react";
import { COLORS } from "../../theme";

type LockBoxProps = {
  width?: number;
  glow?: boolean;
  style?: React.CSSProperties;
};

export const LockBox: React.FC<LockBoxProps> = ({
  width = 210,
  glow = false,
  style,
}) => {
  const height = width * (210 / 220);

  return (
    <svg
      viewBox="0 0 220 210"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={110} cy={196} rx={92} ry={14} fill="rgba(20,32,27,0.16)" />
      <rect x={26} y={64} width={168} height={128} rx={14} fill="#C99A4E" />
      <rect x={26} y={64} width={168} height={26} rx={10} fill="#B08616" />
      <rect x={58} y={64} width={20} height={128} fill="#8A6410" opacity={0.85} />
      <rect x={142} y={64} width={20} height={128} fill="#8A6410" opacity={0.85} />
      <rect x={16} y={44} width={188} height={30} rx={11} fill="#B08616" />
      <rect x={16} y={44} width={188} height={12} rx={6} fill="#D9B45E" />

      <g transform="translate(110 118)">
        {glow ? (
          <circle r={40} fill={COLORS.gold} opacity={0.3} />
        ) : null}
        <path
          d="M-13 0 v-13 a13 13 0 0 1 26 0 V0"
          fill="none"
          stroke="#6B4E08"
          strokeWidth={8}
        />
        <rect x={-22} y={0} width={44} height={38} rx={9} fill="#6B4E08" />
        <rect x={-16} y={6} width={32} height={8} rx={4} fill="#E4B840" opacity={0.7} />
        <circle cx={0} cy={20} r={5} fill="#E4B840" />
      </g>
    </svg>
  );
};
