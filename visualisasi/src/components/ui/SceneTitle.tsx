import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";

type WordsProps = {
  text: string;
  start: number;
  color?: string;
  highlight?: string;
  highlightColor?: string;
};

const Words: React.FC<WordsProps> = ({
  text,
  start,
  color = COLORS.ink,
  highlight,
  highlightColor,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => {
        const d = start + i * 3.5;
        const progress = interpolate(frame, [d, d + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const isHighlight =
          highlight !== undefined &&
          word.toLowerCase().replace(/[^a-z0-9]/g, "") ===
            highlight.toLowerCase().replace(/[^a-z0-9]/g, "");
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: progress,
              translate: `0 ${interpolate(progress, [0, 1], [40, 0])}px`,
              filter: `blur(${interpolate(progress, [0, 1], [14, 0])}px)`,
              color: isHighlight ? highlightColor ?? color : color,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
};

type SceneTitleProps = {
  title: string;
  kicker?: string;
  accent?: string;
  align?: "center" | "left";
  start?: number;
  size?: number;
  highlight?: string;
  style?: React.CSSProperties;
};

export const SceneTitle: React.FC<SceneTitleProps> = ({
  title,
  kicker,
  accent = COLORS.nasabah,
  align = "center",
  start = 0,
  size = 76,
  highlight,
  style,
}) => {
  const frame = useCurrentFrame();
  const kickerProgress = interpolate(frame, [start, start + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        gap: 16,
        ...style,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 5,
            color: accent,
            opacity: kickerProgress,
            translate: `0 ${interpolate(kickerProgress, [0, 1], [16, 0])}px`,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: -0.5,
          maxWidth: 1500,
        }}
      >
        <Words
          text={title}
          start={start + (kicker ? 6 : 0)}
          highlight={highlight}
          highlightColor={accent}
        />
      </div>
    </div>
  );
};
