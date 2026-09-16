import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";
import { withAlpha } from "../../utils/color";

type CaptionProps = {
  text: string;
  start?: number;
  accent?: string;
  mono?: boolean;
  size?: number;
  style?: React.CSSProperties;
};

export const Caption: React.FC<CaptionProps> = ({
  text,
  start = 0,
  accent = COLORS.ink,
  mono = false,
  size = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 26px",
        borderRadius: 18,
        backgroundColor: withAlpha(accent, 0.1),
        border: `2px solid ${withAlpha(accent, 0.28)}`,
        color: accent,
        fontFamily: mono ? FONTS.mono : FONTS.ui,
        fontWeight: mono ? 700 : 700,
        fontSize: size,
        opacity: progress,
        translate: `0 ${interpolate(progress, [0, 1], [26, 0])}px`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
