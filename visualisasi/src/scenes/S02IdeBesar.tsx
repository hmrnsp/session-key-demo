import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Padlock } from "../components/props/Padlock";
import { AesKey } from "../components/props/AesKey";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

type ConceptCardProps = {
  x: number;
  delay: number;
  direction: number;
  color: string;
  tag: string;
  title: string;
  hint: string;
  children: React.ReactNode;
};

const ConceptCard: React.FC<ConceptCardProps> = ({
  x,
  delay,
  direction,
  color,
  tag,
  title,
  hint,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={at(x, 336, {
        width: 640,
        height: 470,
        borderRadius: 34,
        backgroundColor: "#FFFFFF",
        border: `3px solid ${withAlpha(color, 0.28)}`,
        boxShadow: "0 34px 70px rgba(20,32,27,0.16)",
        padding: 34,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: p,
        translate: `${interpolate(p, [0, 1], [direction * 70, 0])}px 0px`,
      })}
    >
      <div
        style={{
          alignSelf: "flex-start",
          padding: "8px 18px",
          borderRadius: 12,
          backgroundColor: withAlpha(color, 0.14),
          color,
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {tag}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
        }}
      >
        {children}
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 600,
            fontSize: 44,
            color: COLORS.ink,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 600,
            fontSize: 24,
            color: COLORS.inkSoft,
            marginTop: 10,
            maxWidth: 520,
          }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
};

export const S02IdeBesar: React.FC = () => {
  return (
    <Screen accent={COLORS.gold} tint={COLORS.nasabah}>
      <div style={at(0, 90, { width: 1920, display: "flex", justifyContent: "center" })}>
        <SceneTitle
          title={COPY.ideBesar.title}
          accent={COLORS.nasabah}
          size={72}
          highlight="kunci"
        />
      </div>

      <ConceptCard
        x={260}
        delay={18}
        direction={-1}
        color={COLORS.gold}
        tag="RSA public key"
        title={COPY.ideBesar.publicKey}
        hint={COPY.ideBesar.publicKeyHint}
      >
        <Padlock width={190} />
      </ConceptCard>

      <ConceptCard
        x={1020}
        delay={34}
        direction={1}
        color={COLORS.nasabah}
        tag="AES-256-GCM"
        title={COPY.ideBesar.sessionKey}
        hint={COPY.ideBesar.sessionKeyHint}
      >
        <AesKey width={250} glow={1} />
      </ConceptCard>
    </Screen>
  );
};
