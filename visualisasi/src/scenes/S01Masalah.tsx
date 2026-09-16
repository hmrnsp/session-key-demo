import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Caption } from "../components/ui/Caption";
import { CodePanel } from "../components/ui/CodePanel";
import { Rani } from "../components/characters/Rani";
import { Hacker } from "../components/characters/Hacker";
import { Bank } from "../components/world/Bank";
import { Wire } from "../components/world/Wire";
import { Capsule } from "../components/props/Capsule";
import { at } from "../utils/stage";
import { WIRE_TEXT, COPY } from "../data/flow";

export const S01Masalah: React.FC = () => {
  const frame = useCurrentFrame();

  const travel = interpolate(frame, [30, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const capsuleX = 420 + travel * 1080;

  const readIn = interpolate(frame, [58, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Screen accent={COLORS.hacker} tint={COLORS.wire}>
      <div style={at(90, 64, { width: 1000 })}>
        <SceneTitle
          title={COPY.masalah.title}
          align="left"
          size={60}
          accent={COLORS.hacker}
          highlight="dibaca"
        />
      </div>

      <div style={at(90, 300)}>
        <Rani width={300} expression="tenang" />
      </div>

      <div style={at(1500, 430)}>
        <Bank width={380} />
      </div>

      <div style={at(750, 220)}>
        <Hacker width={420} active tap />
      </div>

      <Wire mode="plain" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(capsuleX, 761)}>
        <Capsule
          width={320}
          readable
          label={WIRE_TEXT.plainLogin}
          fontSize={18}
          color={COLORS.wire}
        />
      </div>

      <div style={at(1160, 74, { opacity: readIn })}>
        <CodePanel
          title="disadap penyerang"
          tone="danger"
          width={440}
          start={58}
          lines={[
            "username : demo",
            "password : password123",
          ]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 330,
          opacity: readIn,
          fontFamily: FONTS.ui,
          fontWeight: 800,
          fontSize: 30,
          color: COLORS.hacker,
        }}
      >
        Penyerang membaca semuanya.
      </div>

      <div style={at(0, 960, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption text={COPY.masalah.subtitle} accent={COLORS.hacker} size={30} start={80} />
      </div>
    </Screen>
  );
};
