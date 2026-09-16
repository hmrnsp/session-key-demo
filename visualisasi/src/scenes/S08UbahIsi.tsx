import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, LAYOUT } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Caption } from "../components/ui/Caption";
import { CodePanel } from "../components/ui/CodePanel";
import { Hacker } from "../components/characters/Hacker";
import { Capsule } from "../components/props/Capsule";
import { Seal } from "../components/props/Seal";
import { Shield } from "../components/props/Shield";
import { ServerRack } from "../components/props/ServerRack";
import { Phone } from "../components/props/Phone";
import { Wire } from "../components/world/Wire";
import { at } from "../utils/stage";
import { WIRE_TEXT } from "../data/flow";

export const S08UbahIsi: React.FC = () => {
  const frame = useCurrentFrame();

  const travel = interpolate(frame, [40, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const capsuleX = 440 + travel * 950;

  const tampering = frame >= 72 && frame <= 96;
  const cracked = frame >= 78;
  const blocked = frame >= 122;

  const flash = interpolate(frame, [72, 78, 92], [0, 0.24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shieldIn = interpolate(frame, [118, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 13, stiffness: 120 }),
  });

  return (
    <Screen accent={COLORS.hacker} tint={COLORS.bank}>
      <div style={at(90, 56, { width: 900 })}>
        <SceneTitle
          title="Kalau data diubah, segel rusak"
          align="left"
          size={56}
          accent={COLORS.hacker}
          highlight="rusak"
        />
      </div>

      <div style={at(100, 300)}>
        <Phone width={248} screen="login" accent={COLORS.hacker} />
      </div>

      <div style={at(1580, 380)}>
        <ServerRack width={200} active={!blocked} />
      </div>

      <div style={at(760, 361)}>
        <Hacker width={320} active={tampering || cracked} tap />
      </div>

      <div style={at(1000, 84)}>
        <CodePanel
          title="server menolak"
          tone="danger"
          width={520}
          start={142}
          lines={[
            "HTTP/1.1 400 Bad Request",
            '{ "error": "invalid_payload",',
            '  "message": "Verifikasi gagal." }',
          ]}
        />
      </div>

      <div
        style={at(1430, 392, {
          opacity: shieldIn,
          transform: `scale(${interpolate(shieldIn, [0, 1], [0.4, 1])})`,
        })}
      >
        <Shield width={150} state="block" />
      </div>

      <Wire mode="attack" flow="ltr" style={{ top: LAYOUT.wireY - 110 }} />

      <div style={at(capsuleX, 761)}>
        <Capsule
          width={300}
          label={WIRE_TEXT.cipherEnvelope}
          color={COLORS.hacker}
        />
      </div>

      <div style={at(capsuleX + 236, 742)}>
        <Seal width={82} state={cracked ? "cracked" : "intact"} />
      </div>

      <AbsoluteFill
        style={{
          backgroundColor: COLORS.hacker,
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      <div style={at(0, 946, { width: 1920, display: "flex", justifyContent: "center" })}>
        <Caption
          text="Segel (auth tag) tidak cocok — server menolak payload."
          accent={COLORS.hacker}
          size={28}
          start={140}
        />
      </div>
    </Screen>
  );
};
