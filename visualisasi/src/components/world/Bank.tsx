import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";

type BankProps = {
  width?: number;
  lit?: boolean;
  style?: React.CSSProperties;
  label?: string;
};

export const Bank: React.FC<BankProps> = ({
  width = 640,
  lit = false,
  label = "BANK AMAN",
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width * (560 / 640);
  const glow = lit ? 0.55 + Math.abs(Math.sin(frame / 16)) * 0.45 : 0.35;

  const columns = [126, 226, 396, 496];

  return (
    <svg
      viewBox="0 0 640 560"
      width={width}
      height={height}
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={320} cy={540} rx={288} ry={22} fill="rgba(20,32,27,0.13)" />

      <polygon points="70,232 320,92 570,232" fill={COLORS.bank} />
      <polygon
        points="104,224 320,114 536,224"
        fill={COLORS.bankDark}
        opacity={0.35}
      />
      <circle cx={320} cy={196} r={20} fill={COLORS.goldSoft} opacity={0.9} />
      <rect x={314} y={186} width={12} height={20} rx={3} fill={COLORS.gold} />

      <rect x={90} y={232} width={460} height={274} fill="#FBFCFB" />
      <rect x={90} y={232} width={460} height={50} fill={COLORS.bank} />
      <text
        x={320}
        y={267}
        textAnchor="middle"
        fill="#EAF4EF"
        fontFamily={FONTS.ui}
        fontSize={30}
        fontWeight={800}
        letterSpacing={3}
      >
        {label}
      </text>

      {columns.map((x) => (
        <g key={x}>
          <rect x={x - 6} y={294} width={56} height={13} rx={4} fill="#D3E0D8" />
          <rect
            x={x}
            y={306}
            width={44}
            height={180}
            rx={3}
            fill="#E4EDE7"
            stroke="#CBD9D1"
            strokeWidth={2}
          />
          <rect
            x={x}
            y={314}
            width={8}
            height={164}
            fill="#F3F8F5"
            opacity={0.9}
          />
          <rect x={x - 6} y={482} width={56} height={13} rx={4} fill="#D3E0D8" />
        </g>
      ))}

      <rect x={282} y={390} width={76} height={106} rx={8} fill="#123B2C" />
      <rect
        x={288}
        y={396}
        width={64}
        height={94}
        rx={5}
        fill={COLORS.bank}
        opacity={glow * 0.55}
      />
      <path
        d="M320 400 v86 M288 443 h64"
        stroke="#0A2A1F"
        strokeWidth={3}
        opacity={0.5}
      />
      <circle cx={320} cy={443} r={7} fill={COLORS.gold} />

      <rect x={90} y={504} width={460} height={16} fill="#DCE7E0" />
      <rect x={66} y={520} width={508} height={16} fill="#CBD9D1" />
    </svg>
  );
};
