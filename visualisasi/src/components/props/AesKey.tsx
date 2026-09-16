import React from "react";
import { COLORS } from "../../theme";

type AesKeyProps = {
  width?: number;
  color?: string;
  glow?: number;
  style?: React.CSSProperties;
};

export const AesKey: React.FC<AesKeyProps> = ({
  width = 250,
  color = COLORS.nasabah,
  glow = 0,
  style,
}) => {
  const height = width * (150 / 260);

  return (
    <svg
      viewBox="0 0 260 150"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      {glow > 0 ? (
        <ellipse
          cx={130}
          cy={75}
          rx={122}
          ry={58}
          fill={color}
          opacity={0.18 * glow}
        />
      ) : null}
      <circle
        cx={50}
        cy={75}
        r={32}
        fill="none"
        stroke="#0F2E86"
        strokeWidth={20}
      />
      <circle
        cx={50}
        cy={75}
        r={32}
        fill="none"
        stroke={color}
        strokeWidth={14}
      />
      <rect x={76} y={67} width={156} height={16} rx={7} fill="#0F2E86" />
      <rect x={76} y={67} width={156} height={16} rx={7} fill={color} />
      <rect x={168} y={80} width={16} height={30} rx={6} fill="#0F2E86" />
      <rect x={168} y={80} width={16} height={30} rx={6} fill={color} />
      <rect x={198} y={80} width={16} height={42} rx={6} fill="#0F2E86" />
      <rect x={198} y={80} width={16} height={42} rx={6} fill={color} />
      <circle cx={50} cy={75} r={11} fill={COLORS.bg} />
    </svg>
  );
};
