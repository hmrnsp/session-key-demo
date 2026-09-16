import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Bank } from "../components/world/Bank";
import { Wire } from "../components/world/Wire";
import { Vault } from "../components/props/Vault";
import { Padlock } from "../components/props/Padlock";
import { AesKey } from "../components/props/AesKey";
import { LockBox } from "../components/props/LockBox";
import { Phone } from "../components/props/Phone";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

const STEP_TIMES = [
  { text: COPY.handshake.step1, from: 8, to: 66, color: COLORS.nasabah },
  { text: COPY.handshake.step2, from: 66, to: 128, color: COLORS.gold },
  { text: COPY.handshake.step3, from: 128, to: 196, color: COLORS.bank },
  { text: COPY.handshake.received, from: 196, to: 320, color: COLORS.bank },
];

const StepTicker: React.FC = () => {
  const frame = useCurrentFrame();
  const active = STEP_TIMES.find((s) => frame >= s.from && frame < s.to);
  if (!active) {
    return null;
  }
  const local = frame - active.from;
  const p = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 30px",
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        border: `3px solid ${withAlpha(active.color, 0.35)}`,
        boxShadow: "0 18px 36px rgba(20,32,27,0.14)",
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [22, 0])}px`,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: active.color,
        }}
      />
      <span
        style={{
          fontFamily: FONTS.ui,
          fontWeight: 700,
          fontSize: 28,
          color: COLORS.ink,
        }}
      >
        {active.text}
      </span>
    </div>
  );
};

export const S04Handshake: React.FC = () => {
  const frame = useCurrentFrame();

  const keyP = interpolate(frame, [16, 34, 46, 54], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boxIn = interpolate(frame, [46, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 14, stiffness: 120 }),
  });
  const travel = interpolate(frame, [64, 172], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const boxX = 270 + travel * 1150;
  const opened = frame >= 176;

  return (
    <Screen accent={COLORS.nasabah} tint={COLORS.bank}>
      <div style={at(90, 54, { width: 1120 })}>
        <SceneTitle
          title={COPY.handshake.title}
          align="left"
          size={56}
          accent={COLORS.nasabah}
          highlight="kunci"
        />
      </div>

      <div style={at(110, 246)}>
        <Phone width={248} screen="home" accent={COLORS.nasabah} glow />
      </div>

      <div
        style={at(96, 640, {
          opacity: keyP,
          transform: `scale(${interpolate(keyP, [0, 1], [0.5, 1])})`,
        })}
      >
        <AesKey width={210} glow={1} />
      </div>

      <div style={at(1420, 314)}>
        <Bank width={420} lit={opened} />
      </div>

      <div
        style={at(1566, 552, {
          transform: opened ? "scale(1.05)" : "scale(1)",
        })}
      >
        <Vault width={112} open={opened} />
      </div>

      <Wire mode="secure" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div
        style={at(boxX, 731, {
          opacity: boxIn,
          transform: `scale(${interpolate(boxIn, [0, 1], [0.4, 1])})`,
        })}
      >
        <LockBox width={150} glow />
      </div>

      <div
        style={at(244, 632, {
          opacity: keyP,
          transform: "scale(0.78)",
        })}
      >
        <Padlock width={108} />
      </div>

      <div style={at(0, 936, { width: 1920, display: "flex", justifyContent: "center" })}>
        <StepTicker />
      </div>
    </Screen>
  );
};
