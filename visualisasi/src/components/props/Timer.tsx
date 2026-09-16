import React from "react";
import { COLORS } from "../../theme";

type TimerProps = {
  width?: number;
  progress?: number;
  color?: string;
  style?: React.CSSProperties;
};

const R = 76;
const CIRC = 2 * Math.PI * R;

export const Timer: React.FC<TimerProps> = ({
  width = 190,
  progress = 1,
  color = COLORS.bank,
  style,
}) => {
  const height = width;
  const clamped = Math.max(0, Math.min(1, progress));
  const angle = clamped * 360;

  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <circle cx={100} cy={100} r={R} fill="#FBFCFB" />
      <circle
        cx={100}
        cy={100}
        r={R}
        fill="none"
        stroke="#E2DCCB"
        strokeWidth={20}
      />
      <circle
        cx={100}
        cy={100}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={20}
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC * (1 - clamped)}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={100 + Math.cos(a) * 58}
            cy={100 + Math.sin(a) * 58}
            r={3}
            fill="#B9B29D"
          />
        );
      })}
      <rect x={97} y={72} width={6} height={30} rx={3} fill={COLORS.ink} opacity={0.5} />
      <g transform={`rotate(${angle} 100 100)`}>
        <rect x={98} y={54} width={4} height={48} rx={2} fill={COLORS.ink} />
      </g>
      <circle cx={100} cy={100} r={7} fill={COLORS.ink} />
      <circle cx={100} cy={100} r={3} fill={COLORS.gold} />
    </svg>
  );
};
