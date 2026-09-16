import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import type { CharacterProps } from "./types";

type TellerProps = CharacterProps & {
  expression?: "tenang" | "senang";
};

export const Teller: React.FC<TellerProps> = ({
  width = 360,
  expression = "senang",
  dim = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width / 0.62;
  const breathe = Math.sin(frame / 30) * 2.5;
  const blink = frame % 126 < 5;

  return (
    <svg
      viewBox="0 0 360 580"
      width={width}
      height={height}
      style={{ overflow: "visible", opacity: dim ? 0.3 : 1, ...style }}
    >
      <ellipse cx={180} cy={550} rx={96} ry={16} fill="rgba(20,32,27,0.13)" />
      <g transform={`translate(0 ${breathe})`}>
        <rect x={132} y={392} width={42} height={126} rx={19} fill="#2B3145" />
        <rect x={188} y={392} width={42} height={126} rx={19} fill="#2B3145" />
        <rect x={122} y={510} width={78} height={30} rx={15} fill={COLORS.shoe} />
        <rect x={184} y={510} width={78} height={30} rx={15} fill={COLORS.shoe} />

        <path
          d="M180 226 c -40 0 -66 15 -74 42 c -6 20 -10 92 -12 124 c -1 14 8 24 22 24 h128 c14 0 23 -10 22 -24 c -2 -32 -6 -104 -12 -124 c -8 -27 -34 -42 -74 -42 z"
          fill={COLORS.bank}
        />
        <path
          d="M180 226 c 16 0 30 2 42 7 l -42 50 l -42 -50 c 12 -5 26 -7 42 -7 z"
          fill="#F3F6F4"
        />
        <path
          d="M160 236 l20 26 l-20 26 l-16 -6 l12 -20 l-12 -20 z"
          fill={COLORS.bankDark}
        />
        <path
          d="M200 236 l-20 26 l20 26 l16 -6 l-12 -20 l12 -20 z"
          fill={COLORS.bankDark}
        />
        <path d="M180 262 l9 12 l-9 30 l-9 -30 z" fill={COLORS.gold} />

        <rect x={166} y={188} width={28} height={44} rx={12} fill={COLORS.skinDark} />

        <path
          d="M130 252 L 116 362"
          stroke={COLORS.bank}
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={116} cy={372} r={15} fill={COLORS.skin} />

        <path
          d="M230 252 L 254 330"
          stroke={COLORS.bank}
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M254 330 L 236 356"
          stroke={COLORS.skin}
          strokeWidth={24}
          strokeLinecap="round"
          fill="none"
        />

        <ellipse cx={180} cy={158} rx={52} ry={58} fill={COLORS.skin} />
        <path
          d="M180 96 c -32 0 -54 18 -56 48 c 6 -10 16 -18 30 -22 c 12 -3 40 -4 56 4 c 12 6 20 12 26 18 c -2 -30 -24 -48 -56 -48 z"
          fill="#2E2119"
        />
        <ellipse cx={128} cy={160} rx={8} ry={12} fill={COLORS.skinDark} />
        <ellipse cx={232} cy={160} rx={8} ry={12} fill={COLORS.skinDark} />
        {blink ? (
          <>
            <path d="M148 156 q10 8 20 0" fill="none" stroke={COLORS.ink} strokeWidth={3.4} strokeLinecap="round" />
            <path d="M192 156 q10 8 20 0" fill="none" stroke={COLORS.ink} strokeWidth={3.4} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={158} cy={155} rx={7} ry={9} fill={COLORS.ink} />
            <ellipse cx={202} cy={155} rx={7} ry={9} fill={COLORS.ink} />
            <circle cx={160.4} cy={151.8} r={2.5} fill="#FFFFFF" opacity={0.9} />
            <circle cx={204.4} cy={151.8} r={2.5} fill="#FFFFFF" opacity={0.9} />
          </>
        )}
        <path d="M146 134 q14 -6 28 -1" fill="none" stroke="#2E2119" strokeWidth={4.2} strokeLinecap="round" />
        <path d="M186 133 q14 -5 28 1" fill="none" stroke="#2E2119" strokeWidth={4.2} strokeLinecap="round" />
        <path d="M180 164 q6 8 -2 12" fill="none" stroke={COLORS.skinDark} strokeWidth={3.2} strokeLinecap="round" />
        <path
          d={expression === "senang" ? "M160 194 q20 18 40 0" : "M162 194 q18 10 36 0"}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={4.4}
          strokeLinecap="round"
        />

        <rect x={120} y={300} width={26} height={18} rx={4} fill="#F3F6F4" />
        <rect x={124} y={304} width={18} height={3} rx={1.5} fill={COLORS.bank} />
        <rect x={124} y={310} width={12} height={3} rx={1.5} fill={COLORS.gold} />

        <rect x={222} y={346} width={44} height={58} rx={7} fill="#39424F" />
        <rect x={227} y={351} width={34} height={48} rx={4} fill="#EAF1FF" />
        <rect x={232} y={357} width={24} height={5} rx={2.5} fill={COLORS.bank} opacity={0.6} />
        <rect x={232} y={367} width={24} height={5} rx={2.5} fill={COLORS.bank} opacity={0.4} />
        <rect x={232} y={377} width={14} height={5} rx={2.5} fill={COLORS.bank} opacity={0.4} />
      </g>
    </svg>
  );
};
