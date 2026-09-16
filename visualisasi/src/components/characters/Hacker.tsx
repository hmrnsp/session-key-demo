import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import type { CharacterProps } from "./types";

type HackerProps = CharacterProps & {
  active?: boolean;
  tap?: boolean;
};

export const Hacker: React.FC<HackerProps> = ({
  width = 420,
  active = false,
  tap = false,
  dim = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width / 0.7;
  const pulse = active ? 0.55 + Math.abs(Math.sin(frame / 9)) * 0.45 : 0.5;
  const scroll = (frame * 1.4) % 30;
  const scan = active ? 356 + ((frame * 2.2) % 92) : -100;

  return (
    <svg
      viewBox="0 0 420 600"
      width={width}
      height={height}
      style={{ overflow: "visible", opacity: dim ? 0.3 : 1, ...style }}
    >
      <defs>
        <clipPath id="hackerScreenClip">
          <rect x={142} y={350} width={148} height={96} rx={5} />
        </clipPath>
      </defs>

      <ellipse cx={210} cy={470} rx={150} ry={20} fill="rgba(20,32,27,0.12)" />

      <path
        d="M152 424 L 280 486"
        stroke="#262733"
        strokeWidth={40}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M268 424 L 140 486"
        stroke="#1E1F29"
        strokeWidth={40}
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx={128} cy={492} rx={20} ry={14} fill="#2E2F3B" />
      <ellipse cx={292} cy={492} rx={20} ry={14} fill="#2E2F3B" />

      <path
        d="M210 248 c -50 0 -82 24 -86 64 l -8 104 c -1 16 12 28 28 28 h132 c16 0 29 -12 28 -28 l -8 -104 c -4 -40 -36 -64 -86 -64 z"
        fill="#2E2F3B"
      />
      <path
        d="M210 248 c -50 0 -82 24 -86 64 c 24 -26 52 -38 86 -38 c 34 0 62 12 86 38 c -4 -40 -36 -64 -86 -64 z"
        fill="#3A3C4A"
        opacity={0.7}
      />
      <path
        d="M210 126 c -52 0 -84 30 -88 76 c -2 20 8 34 22 40 c -4 -34 24 -58 66 -58 c42 0 70 24 66 58 c14 -6 24 -20 22 -40 c -4 -46 -36 -76 -88 -76 z"
        fill="#23242E"
      />

      <path
        d="M150 300 L 150 440"
        stroke="#2E2F3B"
        strokeWidth={32}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M270 300 L 270 440"
        stroke="#2E2F3B"
        strokeWidth={32}
        strokeLinecap="round"
        fill="none"
      />

      <ellipse cx={210} cy={202} rx={44} ry={50} fill="#14151C" />
      <path
        d="M166 200 h88 v16 c0 21 -19 34 -44 34 c-25 0 -44 -13 -44 -34 z"
        fill="#34363F"
      />
      <g opacity={0.35}>
        <circle cx={210} cy={228} r={3} fill="#14151C" />
        <circle cx={200} cy={238} r={3} fill="#14151C" />
        <circle cx={220} cy={238} r={3} fill="#14151C" />
      </g>

      <ellipse cx={193} cy={188} rx={22} ry={16} fill={COLORS.hacker} opacity={0.16} />
      <ellipse cx={227} cy={188} rx={22} ry={16} fill={COLORS.hacker} opacity={0.16} />
      <ellipse cx={193} cy={188} rx={9} ry={10} fill={COLORS.hacker} opacity={pulse} />
      <ellipse cx={227} cy={188} rx={9} ry={10} fill={COLORS.hacker} opacity={pulse} />

      <path
        d="M126 452 h168 l26 32 h-220 z"
        fill="#3A3C4A"
      />
      <path d="M136 458 h148 l18 22 h-184 z" fill="#4A4D5E" />
      <rect x={162} y={348} width={96} height={104} rx={6} fill="#2A2B36" />
      <rect x={142} y={350} width={148} height={96} rx={5} fill="#0E1016" />

      <g clipPath="url(#hackerScreenClip)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const y = 356 + i * 13 - scroll + 30;
          if (y < 346 || y > 450) {
            return null;
          }
          const w = 74 + ((i * 37) % 52);
          return (
            <rect
              key={i}
              x={150}
              y={y}
              width={w}
              height={5}
              rx={2.5}
              fill={i % 3 === 0 ? COLORS.hacker : i % 3 === 1 ? "#6C7A8C" : "#B7C2D0"}
              opacity={0.85}
            />
          );
        })}
        {active ? (
          <rect x={142} y={scan} width={148} height={3} fill={COLORS.hacker} opacity={0.5} />
        ) : null}
      </g>

      <circle cx={152} cy={460} r={16} fill={COLORS.skin} />
      <circle cx={268} cy={460} r={16} fill={COLORS.skin} />

      <ellipse cx={210} cy={300} rx={20} ry={16} fill={COLORS.hacker} opacity={active ? 0.5 : 0.18} />

      {tap ? (
        <>
          <path
            d="M206 490 C 206 528, 198 548, 198 566"
            stroke={COLORS.hacker}
            strokeWidth={5}
            fill="none"
          />
          <path
            d="M186 566 L 210 590 L 234 566"
            fill="none"
            stroke={COLORS.hacker}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={210} cy={592} r={7} fill={COLORS.hacker} />
        </>
      ) : null}
    </svg>
  );
};
