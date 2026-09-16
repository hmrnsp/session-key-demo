import React from "react";
import { COLORS } from "../../theme";

type PadlockProps = {
  width?: number;
  open?: boolean;
  color?: string;
  style?: React.CSSProperties;
};

export const Padlock: React.FC<PadlockProps> = ({
  width = 180,
  open = false,
  color = COLORS.gold,
  style,
}) => {
  const height = width * (230 / 200);

  return (
    <svg
      viewBox="0 0 200 230"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <g
        transform={open ? "translate(-16 -30) rotate(-24 60 104)" : undefined}
        style={{ transformOrigin: "60px 104px" }}
      >
        <path
          d="M64 110 V 70 a36 36 0 0 1 72 0 V 110"
          fill="none"
          stroke="#B08616"
          strokeWidth={19}
          strokeLinecap="round"
        />
        <path
          d="M64 110 V 70 a36 36 0 0 1 72 0 V 110"
          fill="none"
          stroke="#E4B840"
          strokeWidth={9}
          strokeLinecap="round"
        />
      </g>

      <rect x={28} y={104} width={144} height={116} rx={22} fill="#B08616" />
      <rect x={28} y={104} width={144} height={116} rx={22} fill={color} />
      <rect
        x={40}
        y={116}
        width={120}
        height={16}
        rx={8}
        fill="#FFFFFF"
        opacity={0.32}
      />
      <circle cx={100} cy={150} r={17} fill="#3B2E08" opacity={0.85} />
      <rect x={93} y={158} width={14} height={34} rx={6} fill="#3B2E08" opacity={0.85} />
    </svg>
  );
};
