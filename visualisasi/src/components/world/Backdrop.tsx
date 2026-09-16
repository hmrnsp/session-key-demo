import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import { withAlpha } from "../../utils/color";

type BackdropProps = {
  accent?: string;
  tint?: string;
};

export const Backdrop: React.FC<BackdropProps> = ({
  accent = COLORS.nasabah,
  tint = COLORS.bank,
}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 120) * 46;
  const dy = Math.cos(frame / 150) * 34;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1150px 820px at ${18 + dx / 2}% ${
            16 + dy / 2
          }%, ${withAlpha(accent, 0.17)} 0%, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(1050px 780px at ${84 - dx / 2}% ${
            32 - dy / 2
          }%, ${withAlpha(tint, 0.15)} 0%, transparent 64%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,32,27,0.11) 1.5px, transparent 1.5px)",
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1500px 950px at 50% 48%, transparent 52%, rgba(20,32,27,0.11) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
