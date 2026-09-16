import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../theme";
import { Backdrop } from "../world/Backdrop";

type ScreenProps = {
  accent?: string;
  tint?: string;
  children: React.ReactNode;
};

export const Screen: React.FC<ScreenProps> = ({
  accent = COLORS.nasabah,
  tint = COLORS.bank,
  children,
}) => {
  return (
    <AbsoluteFill>
      <Backdrop accent={accent} tint={tint} />
      {children}
    </AbsoluteFill>
  );
};
