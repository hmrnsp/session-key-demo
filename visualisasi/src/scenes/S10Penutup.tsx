import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Screen } from "../components/ui/Screen";
import { SceneTitle } from "../components/ui/SceneTitle";
import { LockBox } from "../components/props/LockBox";
import { AesKey } from "../components/props/AesKey";
import { Seal } from "../components/props/Seal";
import { Rani } from "../components/characters/Rani";
import { Bank } from "../components/world/Bank";
import { at } from "../utils/stage";
import { withAlpha } from "../utils/color";
import { COPY } from "../data/flow";

type RecapCardProps = {
  x: number;
  delay: number;
  color: string;
  title: string;
  hint: string;
  children: React.ReactNode;
};

const RecapCard: React.FC<RecapCardProps> = ({
  x,
  delay,
  color,
  title,
  hint,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={at(x, 430, {
        width: 440,
        height: 430,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        border: `3px solid ${withAlpha(color, 0.26)}`,
        boxShadow: "0 30px 60px rgba(20,32,27,0.14)",
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: p,
        translate: `0 ${interpolate(p, [0, 1], [44, 0])}px`,
      })}
    >
      <div
        style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 600,
            fontSize: 36,
            color: COLORS.ink,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 600,
            fontSize: 23,
            color: COLORS.inkSoft,
            marginTop: 8,
          }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
};

export const S10Penutup: React.FC = () => {
  const frame = useCurrentFrame();
  const footer = interpolate(frame, [130, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Screen accent={COLORS.bank} tint={COLORS.nasabah}>
      <div style={at(0, 96, { width: 1920, display: "flex", justifyContent: "center" })}>
        <SceneTitle
          title={COPY.penutup.title}
          accent={COLORS.bank}
          size={66}
          highlight="rahasia"
        />
      </div>

      <div style={at(120, 190, { opacity: 0.9 })}>
        <Rani width={140} expression="senang" holdPhone={false} />
      </div>
      <div style={at(1700, 190, { opacity: 0.9 })}>
        <Bank width={190} lit />
      </div>

      <RecapCard
        x={228}
        delay={20}
        color={COLORS.gold}
        title={COPY.penutup.recap1}
        hint="Kunci rahasia dikirim aman"
      >
        <LockBox width={170} glow />
      </RecapCard>

      <RecapCard
        x={700}
        delay={34}
        color={COLORS.nasabah}
        title={COPY.penutup.recap2}
        hint="Data terenkripsi dua arah"
      >
        <AesKey width={210} glow={1} />
      </RecapCard>

      <RecapCard
        x={1172}
        delay={48}
        color={COLORS.hacker}
        title={COPY.penutup.recap3}
        hint="Perubahan data langsung ditolak"
      >
        <Seal width={130} />
      </RecapCard>

      <div
        style={at(0, 930, {
          width: 1920,
          textAlign: "center",
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: 26,
          color: COLORS.inkSoft,
          opacity: footer,
        })}
      >
        {COPY.penutup.footer}
      </div>
    </Screen>
  );
};
