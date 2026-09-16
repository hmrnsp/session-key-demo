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

export const S05Login: React.FC = () => {
  const frame = useCurrentFrame();

  const travel = interpolate(frame, [44, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const capsuleX = 440 + travel * 960;

  return (
    <Screen accent={COLORS.nasabah} tint={COLORS.bank}>
      <div style={at(90, 56, { width: 780 })}>
        <SceneTitle
          title={COPY.login.title}
          align="left"
          size={54}
          accent={COLORS.nasabah}
          highlight="tidak"
        />
      </div>

      <div style={at(100, 300)}>
        <Phone width={248} screen="login" accent={COLORS.nasabah} glow />
      </div>

      <div style={at(1600, 380)}>
        <ServerRack width={190} />
      </div>

      <div style={at(900, 108)}>
        <CodePanel
          title={COPY.login.wireLabel}
          tone="neutral"
          width={470}
          start={58}
          lines={[
            '{',
            '  "iv": "9Kq2x7…",',
            '  "data": "xT7f9Kq2b1Ze…",',
            '  "tag": "b1Ze4Qp8Rv0…"',
            '}',
          ]}
        />
      </div>

      <div style={at(900, 452)}>
        <CodePanel
          title={COPY.login.readLabel}
          tone="ok"
          width={470}
          start={128}
          lines={[
            '{',
            `  "username": "${IDENTITY.username}",`,
            `  "password": "${IDENTITY.password}"`,
            '}',
          ]}
        />
      </div>

      <Wire mode="secure" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(capsuleX, 761)}>
        <Capsule
          width={300}
          label={WIRE_TEXT.cipherEnvelope}
          color={COLORS.nasabah}
        />
      </div>

      <div style={at(0, 946, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption text={COPY.login.sent} accent={COLORS.nasabah} size={28} start={150} />
      </div>
    </Screen>
  );
};
