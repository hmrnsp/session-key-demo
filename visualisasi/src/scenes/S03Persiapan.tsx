import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Bank } from "../components/world/Bank";
import { Vault } from "../components/props/Vault";
import { Padlock } from "../components/props/Padlock";
import { Phone } from "../components/props/Phone";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

const StepPill: React.FC<{
  index: string;
  text: string;
  color: string;
  delay: number;
}> = ({ index, text, color, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 16], [0, 1], {
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
        padding: "16px 26px",
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        border: `3px solid ${withAlpha(color, 0.3)}`,
        boxShadow: "0 16px 34px rgba(20,32,27,0.12)",
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [26, 0])}px`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.ui,
          fontWeight: 800,
          fontSize: 24,
        }}
      >
        {index}
      </div>
      <div
        style={{
          fontFamily: FONTS.ui,
          fontWeight: 700,
          fontSize: 27,
          color: COLORS.ink,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const S03Persiapan: React.FC = () => {
  const frame = useCurrentFrame();

  const flyP = interpolate(frame, [58, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.2, 0.4, 1),
  });
  const flyX = 470 + flyP * 1090;
  const flyY = 470 - flyP * 150;
  const spin = flyP * 360;

  const attached = interpolate(frame, [104, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Screen accent={COLORS.bank} tint={COLORS.gold}>
      <div style={at(90, 60, { width: 1100 })}>
        <SceneTitle
          title={COPY.persiapan.title}
          align="left"
          size={58}
          accent={COLORS.bank}
          highlight="bank"
        />
      </div>

      <div style={at(170, 320)}>
        <Bank width={560} />
      </div>

      <div style={at(388, 656)}>
        <Vault width={124} />
      </div>

      <div
        style={at(120, 846, {
          width: 720,
          padding: "16px 22px",
          borderRadius: 18,
          backgroundColor: withAlpha(COLORS.bank, 0.1),
          border: `2px solid ${withAlpha(COLORS.bank, 0.3)}`,
        })}
      >
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.bank,
          }}
        >
          {COPY.persiapan.privateKey}
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.inkSoft,
            marginTop: 4,
          }}
        >
          {COPY.persiapan.neverLeaves}
        </div>
      </div>

      <div style={at(1380, 300)}>
        <Phone width={270} screen="home" accent={COLORS.nasabah} />
      </div>

      <div
        style={at(1608, 336, {
          opacity: attached,
          transform: `scale(${interpolate(attached, [0, 1], [0.4, 1])})`,
        })}
      >
        <Padlock width={92} />
      </div>

      <div
        style={at(flyX, flyY, {
          transform: `rotate(${spin}deg)`,
          opacity: interpolate(flyP, [0, 0.02, 0.96, 1], [1, 1, 1, 0]),
        })}
      >
        <Padlock width={110} />
      </div>

      <div
        style={at(0, 940, {
          width: 1920,
          display: "flex",
          justifyContent: "center",
          gap: 30,
        })}
      >
        <StepPill
          index="1"
          text={COPY.persiapan.step1}
          color={COLORS.bank}
          delay={14}
        />
        <StepPill
          index="2"
          text={COPY.persiapan.step2}
          color={COLORS.nasabah}
          delay={30}
        />
      </div>
    </Screen>
  );
};
