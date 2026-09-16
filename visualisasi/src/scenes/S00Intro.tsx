import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { Rani } from "../components/characters/Rani";
import { Hacker } from "../components/characters/Hacker";
import { Bank } from "../components/world/Bank";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

const RoleLabel: React.FC<{ text: string; color: string; delay: number }> = ({
  text,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        padding: "12px 26px",
        borderRadius: 16,
        backgroundColor: withAlpha(color, 0.12),
        border: `2px solid ${withAlpha(color, 0.35)}`,
        color,
        fontFamily: FONTS.ui,
        fontWeight: 800,
        fontSize: 26,
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [20, 0])}px`,
      }}
    >
      {text}
    </div>
  );
};

export const S00Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const characterIn = (delay: number) =>
    interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const hintOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Screen accent={COLORS.nasabah} tint={COLORS.bank}>
      <div
        style={at(0, 78, {
          width: 1920,
          display: "flex",
          justifyContent: "center",
        })}
      >
        <SceneTitle
          kicker={COPY.intro.kicker}
          title={COPY.intro.title}
          accent={COLORS.nasabah}
          size={74}
          highlight="aman"
        />
      </div>

      <div
        style={at(375, 470, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: characterIn(12),
          translate: `0 ${interpolate(characterIn(12), [0, 1], [40, 0])}px`,
        })}
      >
        <Rani width={210} expression="tenang" />
        <RoleLabel text="Nasabah" color={COLORS.nasabah} delay={34} />
      </div>

      <div
        style={at(790, 470, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: characterIn(20),
          translate: `0 ${interpolate(characterIn(20), [0, 1], [40, 0])}px`,
        })}
      >
        <Bank width={340} />
        <RoleLabel text="Core Banking" color={COLORS.bank} delay={42} />
      </div>

      <div
        style={at(1325, 470, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: characterIn(28),
          translate: `0 ${interpolate(characterIn(28), [0, 1], [40, 0])}px`,
        })}
      >
        <Hacker width={230} />
        <RoleLabel text="Penyerang" color={COLORS.hacker} delay={50} />
      </div>

      <div
        style={at(0, 950, {
          width: 1920,
          textAlign: "center",
          fontFamily: FONTS.ui,
          fontWeight: 600,
          fontSize: 30,
          color: COLORS.inkSoft,
          opacity: hintOpacity,
        })}
      >
        {COPY.intro.hint}
      </div>
    </Screen>
  );
};
