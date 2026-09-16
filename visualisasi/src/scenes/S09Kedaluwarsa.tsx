import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Caption } from "../components/ui/Caption";
import { Timer } from "../components/props/Timer";
import { Phone } from "../components/props/Phone";
import { ServerRack } from "../components/props/ServerRack";
import { LockBox } from "../components/props/LockBox";
import { Wire } from "../components/world/Wire";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

export const S09Kedaluwarsa: React.FC = () => {
  const frame = useCurrentFrame();

  const drained = interpolate(frame, [20, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const refilled = interpolate(frame, [178, 202], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = frame < 140 ? drained : refilled;

  const badgeIn = interpolate(frame, [100, 116, 140, 156], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const travel = interpolate(frame, [132, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const boxX = 600 + travel * 820;

  const screen = frame < 100 ? "profile" : frame < 190 ? "locked" : "profile";

  return (
    <Screen accent={COLORS.hacker} tint={COLORS.bank}>
      <div style={at(90, 54, { width: 1180 })}>
        <SceneTitle
          title={COPY.kedaluwarsa.title}
          align="left"
          size={54}
          accent={COLORS.hacker}
          highlight="otomatis"
        />
      </div>

      <div style={at(140, 316)}>
        <Timer width={210} progress={progress} color={COLORS.bank} />
      </div>

      <div style={at(470, 330)}>
        <Phone width={220} screen={screen} accent={COLORS.nasabah} glow={frame >= 190} />
      </div>

      <div style={at(1580, 330)}>
        <ServerRack width={210} />
      </div>

      <div
        style={at(820, 286, {
          opacity: badgeIn,
          translate: `0 ${interpolate(badgeIn, [0, 1], [18, 0])}px`,
          padding: "18px 28px",
          borderRadius: 20,
          backgroundColor: "#FFFFFF",
          border: `3px solid ${withAlpha(COLORS.hacker, 0.4)}`,
          boxShadow: "0 20px 40px rgba(20,32,27,0.16)",
        })}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: 30,
            color: COLORS.hacker,
          }}
        >
          {COPY.kedaluwarsa.expired}
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 700,
            fontSize: 24,
            color: COLORS.inkSoft,
            marginTop: 6,
          }}
        >
          {COPY.kedaluwarsa.rehandshake}
        </div>
      </div>

      <Wire mode="secure" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(boxX, 738)}>
        <LockBox width={130} glow />
      </div>

      <div style={at(0, 946, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption
          text={COPY.kedaluwarsa.silent}
          accent={COLORS.bank}
          size={28}
          start={192}
        />
      </div>
    </Screen>
  );
};
