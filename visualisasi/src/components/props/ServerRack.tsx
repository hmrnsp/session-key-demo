import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";

type ServerRackProps = {
  width?: number;
  label?: string;
  active?: boolean;
  style?: React.CSSProperties;
};

export const ServerRack: React.FC<ServerRackProps> = ({
  width = 240,
  label = "SERVICE API",
  active = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width * (460 / 260);

  const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <svg
      viewBox="0 0 260 460"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={130} cy={452} rx={110} ry={15} fill="rgba(20,32,27,0.2)" />
      <rect x={18} y={10} width={224} height={432} rx={18} fill="#2B3140" />
      <rect x={30} y={22} width={200} height={408} rx={12} fill="#1C2130" />
      <rect x={30} y={22} width={200} height={44} rx={12} fill="#161A26" />
      <text
        x={130}
        y={50}
        textAnchor="middle"
        fill="#8FE3C0"
        fontFamily={FONTS.mono}
        fontSize={20}
        fontWeight={700}
        letterSpacing={1.5}
      >
        {label}
      </text>

      {rows.map((i) => {
        const y = 78 + i * 38;
        const on = (frame + i * 7) % 44 < (active ? 30 : 12);
        return (
          <g key={i}>
            <rect x={44} y={y} width={172} height={30} rx={6} fill="#2E3648" />
            <rect x={52} y={y + 8} width={92} height={4} rx={2} fill="#3C465C" />
            <rect x={52} y={y + 18} width={64} height={4} rx={2} fill="#3C465C" />
            <circle
              cx={190}
              cy={y + 15}
              r={5.5}
              fill={on ? "#4ADE80" : "#2A5F45"}
            />
            <circle
              cx={206}
              cy={y + 15}
              r={5.5}
              fill={(frame + i * 5) % 30 < 15 ? COLORS.gold : "#6B5A22"}
            />
          </g>
        );
      })}
    </svg>
  );
};
