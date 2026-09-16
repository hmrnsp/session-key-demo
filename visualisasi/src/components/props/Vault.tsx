import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";

type VaultProps = {
  width?: number;
  open?: boolean;
  style?: React.CSSProperties;
};

export const Vault: React.FC<VaultProps> = ({
  width = 240,
  open = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width;
  const shimmer = 0.6 + Math.abs(Math.sin(frame / 14)) * 0.4;

  return (
    <svg
      viewBox="0 0 240 240"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <circle cx={120} cy={120} r={114} fill={COLORS.gold} />
      <circle cx={120} cy={120} r={100} fill="#22303B" />

      {open ? (
        <>
          <circle cx={120} cy={120} r={88} fill="#0B1A14" />
          <circle
            cx={112}
            cy={120}
            r={44}
            fill={COLORS.gold}
            opacity={shimmer * 0.28}
          />
          <g transform="translate(112 120) rotate(-40)">
            <circle
              cx={-22}
              cy={0}
              r={15}
              fill="none"
              stroke={COLORS.gold}
              strokeWidth={9}
            />
            <rect x={-22} y={-6} width={58} height={12} rx={4} fill={COLORS.gold} />
            <rect x={10} y={4} width={9} height={14} rx={3} fill={COLORS.gold} />
            <rect x={26} y={4} width={9} height={18} rx={3} fill={COLORS.gold} />
          </g>
        </>
      ) : null}

      <g
        transform={open ? "translate(74 -14) rotate(-16 120 120)" : undefined}
      >
        <circle cx={120} cy={120} r={88} fill="#4A5D72" />
        <circle
          cx={120}
          cy={120}
          r={88}
          fill="none"
          stroke="#6E8299"
          strokeWidth={4}
        />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={120 + Math.cos(a) * 70}
              cy={120 + Math.sin(a) * 70}
              r={7}
              fill="#33424F"
            />
          );
        })}
        <circle
          cx={120}
          cy={120}
          r={38}
          fill="#3B4C5C"
          stroke="#6E8299"
          strokeWidth={3}
        />
        <g transform={`rotate(${open ? 40 : 0} 120 120)`}>
          <rect x={118} y={70} width={4} height={100} rx={2} fill="#8AA0B8" />
          <rect x={70} y={118} width={100} height={4} rx={2} fill="#8AA0B8" />
        </g>
        <circle cx={120} cy={120} r={13} fill="#8AA0B8" />
        <circle cx={120} cy={120} r={6} fill="#26313D" />
      </g>
    </svg>
  );
};
