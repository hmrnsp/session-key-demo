import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import type { CharacterProps, Expression } from "./types";

type FaceProps = {
  expression: Expression;
  blink: boolean;
};

const Mouth: React.FC<FaceProps> = ({ expression, blink }) => {
  const line = COLORS.ink;
  if (expression === "senang") {
    return (
      <path
        d="M154 188 q26 26 52 0"
        fill="none"
        stroke={line}
        strokeWidth={5}
        strokeLinecap="round"
      />
    );
  }
  if (expression === "kaget") {
    return <ellipse cx={180} cy={198} rx={10} ry={13} fill="#8E3A2E" />;
  }
  if (expression === "panik") {
    return <ellipse cx={180} cy={198} rx={9} ry={12} fill="#8E3A2E" />;
  }
  if (expression === "bingung") {
    return (
      <path
        d="M163 196 q17 -5 34 1"
        fill="none"
        stroke={line}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d={blink ? "M164 194 q16 6 32 0" : "M162 192 q18 12 36 0"}
      fill="none"
      stroke={line}
      strokeWidth={4.5}
      strokeLinecap="round"
    />
  );
};

const Brows: React.FC<{ expression: Expression }> = ({ expression }) => {
  const stroke = COLORS.hair;
  if (expression === "kaget" || expression === "panik") {
    return (
      <>
        <path
          d="M142 124 q14 -8 28 0"
          fill="none"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        <path
          d="M190 124 q14 -8 28 0"
          fill="none"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
      </>
    );
  }
  if (expression === "bingung") {
    return (
      <>
        <path
          d="M142 130 q14 -7 28 -1"
          fill="none"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        <path
          d="M190 122 q14 -9 28 -3"
          fill="none"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
      </>
    );
  }
  return (
    <>
      <path
        d="M142 129 q14 -7 28 -1"
        fill="none"
        stroke={stroke}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        d="M190 128 q14 -6 28 1"
        fill="none"
        stroke={stroke}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </>
  );
};

const Eyes: React.FC<FaceProps> = ({ expression, blink }) => {
  if (blink) {
    return (
      <>
        <path
          d="M146 153 q10 8 20 0"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={3.6}
          strokeLinecap="round"
        />
        <path
          d="M194 153 q10 8 20 0"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={3.6}
          strokeLinecap="round"
        />
      </>
    );
  }
  const ry = expression === "kaget" || expression === "panik" ? 12 : 9.5;
  return (
    <>
      <ellipse cx={156} cy={152} rx={7.6} ry={ry} fill={COLORS.ink} />
      <ellipse cx={204} cy={152} rx={7.6} ry={ry} fill={COLORS.ink} />
      <circle cx={158.6} cy={148.6} r={2.7} fill="#FFFFFF" opacity={0.9} />
      <circle cx={206.6} cy={148.6} r={2.7} fill="#FFFFFF" opacity={0.9} />
    </>
  );
};

type RaniProps = CharacterProps & {
  expression?: Expression;
  holdPhone?: boolean;
};

export const Rani: React.FC<RaniProps> = ({
  width = 360,
  expression = "tenang",
  holdPhone = true,
  dim = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width / 0.6;
  const breathe = Math.sin(frame / 26) * 3;
  const blinkPhase = frame % 108;
  const blink = blinkPhase < 5;
  const panicShake =
    expression === "panik" ? Math.sin(frame * 1.9) * 3.2 : 0;

  return (
    <svg
      viewBox="0 0 360 600"
      width={width}
      height={height}
      style={{
        overflow: "visible",
        opacity: dim ? 0.32 : 1,
        ...style,
      }}
    >
      <ellipse
        cx={180}
        cy={568}
        rx={100}
        ry={17}
        fill="rgba(20,32,27,0.13)"
      />

      <g transform={`translate(${panicShake} ${breathe})`}>
        <rect x={128} y={400} width={44} height={132} rx={20} fill={COLORS.navy} />
        <rect x={188} y={400} width={44} height={132} rx={20} fill={COLORS.navy} />
        <rect x={118} y={522} width={82} height={32} rx={16} fill={COLORS.shoe} />
        <rect x={180} y={522} width={82} height={32} rx={16} fill={COLORS.shoe} />

        <path
          d="M180 232 c -38 0 -64 14 -72 40 c -6 20 -10 96 -12 130 c -1 14 8 24 22 24 h124 c14 0 23 -10 22 -24 c -2 -34 -6 -110 -12 -130 c -8 -26 -34 -40 -72 -40 z"
          fill={COLORS.nasabah}
        />
        <path
          d="M180 232 c -38 0 -64 14 -72 40 c 22 -14 44 -20 72 -20 c 28 0 50 6 72 20 c -8 -26 -34 -40 -72 -40 z"
          fill={COLORS.nasabahDark}
          opacity={0.35}
        />

        <rect x={164} y={192} width={32} height={48} rx={13} fill={COLORS.skinDark} />

        <path
          d="M126 258 L 112 356"
          stroke={COLORS.nasabah}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={112} cy={366} r={16} fill={COLORS.skin} />

        <path
          d="M234 258 L 274 336"
          stroke={COLORS.nasabah}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M274 336 L 262 306"
          stroke={COLORS.skin}
          strokeWidth={26}
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M180 74 c -52 0 -80 36 -80 84 c 0 26 -4 60 -8 92 c 10 4 22 4 26 -8 c 6 -30 8 -50 8 -50 c 4 40 12 70 30 88 c 22 -6 42 -6 64 0 c 18 -18 26 -48 30 -88 c 0 0 2 20 8 50 c 4 12 16 12 26 8 c -4 -32 -8 -66 -8 -92 c 0 -48 -28 -84 -80 -84 z"
          fill={COLORS.hair}
        />
        <ellipse cx={122} cy={158} rx={9} ry={13} fill={COLORS.skinDark} />
        <ellipse cx={238} cy={158} rx={9} ry={13} fill={COLORS.skinDark} />
        <ellipse cx={180} cy={156} rx={56} ry={62} fill={COLORS.skin} />
        <path
          d="M180 92 c -34 0 -58 20 -60 52 c 14 -22 34 -34 60 -34 c 26 0 46 12 60 34 c -2 -32 -26 -52 -60 -52 z"
          fill={COLORS.hair}
        />
        <ellipse cx={146} cy={176} rx={11} ry={7} fill="#F2A08A" opacity={0.4} />
        <ellipse cx={214} cy={176} rx={11} ry={7} fill="#F2A08A" opacity={0.4} />
        <Brows expression={expression} />
        <Eyes expression={expression} blink={blink} />
        <path
          d="M180 162 q7 8 -2 12"
          fill="none"
          stroke={COLORS.skinDark}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
        <Mouth expression={expression} blink={blink} />
        {expression === "panik" ? (
          <path
            d="M244 130 q10 12 4 22 q-10 2 -12 -8 q-2 -9 8 -14 z"
            fill="#8FD3F4"
            opacity={0.9}
          />
        ) : null}

        {holdPhone ? (
          <>
            <circle cx={260} cy={300} r={17} fill={COLORS.skin} />
            <rect x={238} y={190} width={58} height={106} rx={13} fill="#1B2430" />
            <rect x={243} y={195} width={48} height={96} rx={9} fill="#EAF1FF" />
            <rect x={249} y={203} width={36} height={7} rx={3.5} fill={COLORS.nasabah} opacity={0.5} />
            <rect x={249} y={216} width={36} height={7} rx={3.5} fill={COLORS.nasabah} opacity={0.3} />
            <rect x={249} y={229} width={20} height={7} rx={3.5} fill={COLORS.nasabah} opacity={0.3} />
            <rect x={249} y={266} width={36} height={12} rx={6} fill={COLORS.nasabah} />
            <circle cx={267} cy={187} r={2.5} fill="#39424F" />
          </>
        ) : null}
      </g>
    </svg>
  );
};
