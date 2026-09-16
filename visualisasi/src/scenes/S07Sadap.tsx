import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Caption } from "../components/ui/Caption";
import { CodePanel } from "../components/ui/CodePanel";
import { Hacker } from "../components/characters/Hacker";
import { Capsule } from "../components/props/Capsule";
import { Wire } from "../components/world/Wire";
import { at } from "../utils/stage";
import { COPY, IDENTITY, WIRE_TEXT } from "../data/flow";

export const S07Sadap: React.FC = () => {
  const frame = useCurrentFrame();

  const travel = interpolate(frame, [44, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const capsuleX = 470 + travel * 900;

  const confused = interpolate(frame, [96, 116], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 12, stiffness: 130 }),
  });

  return (
    <Screen accent={COLORS.hacker} tint={COLORS.wire}>
      <div style={at(90, 56, { width: 900 })}>
        <SceneTitle
          title={COPY.sadap.title}
          align="left"
          size={56}
          accent={COLORS.hacker}
          highlight="acak"
        />
      </div>

      <div style={at(730, 200)}>
        <Hacker width={410} active tap />
      </div>

      <div
        style={at(1136, 300, {
          opacity: confused,
          transform: `scale(${interpolate(confused, [0, 1], [0.4, 1])})`,
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 96,
          color: COLORS.hacker,
        })}
      >
        ???
      </div>

      <div style={at(1330, 108)}>
        <CodePanel
          title={COPY.sadap.onWire}
          tone="danger"
          width={480}
          start={62}
          lines={[
            '{',
            '  "iv": "9Kq2x7…",',
            '  "data": "xT7f9Kq2b1Ze…",',
            '  "tag": "b1Ze4Qp8Rv0…"',
            '}',
          ]}
        />
      </div>

      <div style={at(1330, 470)}>
        <CodePanel
          title={COPY.sadap.readable}
          tone="ok"
          width={480}
          start={132}
          lines={[
            '{',
            `  "username": "${IDENTITY.username}",`,
            `  "balance": "${IDENTITY.balance}"`,
            '}',
          ]}
        />
      </div>

      <Wire mode="attack" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(capsuleX, 761)}>
        <Capsule
          width={300}
          label={WIRE_TEXT.cipherEnvelope}
          color={COLORS.hacker}
        />
      </div>

      <div style={at(0, 946, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption text={COPY.sadap.hackerLine} accent={COLORS.hacker} size={28} start={140} />
      </div>
    </Screen>
  );
};
