import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Caption } from "../components/ui/Caption";
import { CodePanel } from "../components/ui/CodePanel";
import { Phone } from "../components/props/Phone";
import { Capsule } from "../components/props/Capsule";
import { ServerRack } from "../components/props/ServerRack";
import { Wire } from "../components/world/Wire";
import { at } from "../utils/stage";
import { COPY, IDENTITY, WIRE_TEXT } from "../data/flow";

export const S06Profil: React.FC = () => {
  const frame = useCurrentFrame();

  const travel = interpolate(frame, [40, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const capsuleX = 1400 - travel * 960;
  const revealed = frame >= 124;

  return (
    <Screen accent={COLORS.bank} tint={COLORS.nasabah}>
      <div style={at(90, 56, { width: 780 })}>
        <SceneTitle
          title={COPY.profil.title}
          align="left"
          size={54}
          accent={COLORS.bank}
          highlight="dua"
        />
      </div>

      <div style={at(100, 300)}>
        <Phone
          width={248}
          screen={revealed ? "profile" : "locked"}
          accent={COLORS.bank}
          glow={revealed}
        />
      </div>

      <div style={at(1600, 380)}>
        <ServerRack width={190} />
      </div>

      <div style={at(900, 108)}>
        <CodePanel
          title="response di kabel"
          tone="neutral"
          width={470}
          start={40}
          lines={[
            '{',
            '  "iv": "Tq81x7…",',
            '  "data": "Zk3pQ9mR…",',
            '  "tag": "0mR7b2Xa…"',
            '}',
          ]}
        />
      </div>

      <div style={at(900, 452)}>
        <CodePanel
          title="terbaca di HP"
          tone="ok"
          width={470}
          start={124}
          lines={[
            "{",
            `  "username": "${IDENTITY.username}",`,
            `  "balance": "${IDENTITY.balance}"`,
            "}",
          ]}
        />
      </div>

      <Wire mode="secure" flow="rtl" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(capsuleX, 761)}>
        <Capsule
          width={300}
          label={WIRE_TEXT.cipherEnvelope}
          color={COLORS.bank}
        />
      </div>

      <div style={at(0, 946, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption text={COPY.profil.subtitle} accent={COLORS.bank} size={28} start={140} />
      </div>
    </Screen>
  );
};
