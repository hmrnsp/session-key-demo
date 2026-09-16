import type React from "react";

export const at = (
  left: number,
  top: number,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  position: "absolute",
  left,
  top,
  ...extra,
});

export const centerX = (width: number): React.CSSProperties => ({
  position: "absolute",
  left: 960 - width / 2,
  top: 0,
});
