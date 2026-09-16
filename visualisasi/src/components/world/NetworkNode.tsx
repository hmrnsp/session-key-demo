import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";

type NetworkNodeProps = {
  width?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  width = 130,
  color = COLORS.bank,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width;
  const ping = (frame % 60) / 60;

  return (
    <svg
      viewBox="0 0 140 140"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <circle
        cx={70}
        cy={70}
        r={40 + ping * 26}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.35 * (1 - ping)}
      />
      <path
        d="M56 34 v-16 M84 34 v-16"
        stroke="#6E8299"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx={56} cy={16} r={6} fill={COLORS.hacker} />
      <circle cx={84} cy={16} r={6} fill={COLORS.gold} />
      <rect x={40} y={34} width={60} height={76} rx={13} fill="#2F4050" />
      <rect x={40} y={34} width={60} height={20} rx={10} fill="#24313D" />
      <circle cx={56} cy={70} r={5} fill="#4ADE80" />
      <circle cx={72} cy={70} r={5} fill={COLORS.gold} />
      <circle cx={88} cy={70} r={5} fill="#6E8299" />
      <rect x={50} y={86} width={40} height={5} rx={2.5} fill="#54687E" />
      <rect x={50} y={97} width={26} height={5} rx={2.5} fill="#54687E" />
    </svg>
  );
};
