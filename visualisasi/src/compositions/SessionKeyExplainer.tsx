import React from "react";
import {
  type CalculateMetadataFunction,
  Composition,
  staticFile,
} from "remotion";
import { Audio as RemotionAudio } from "@remotion/media";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";

import {
  FPS,
  HEIGHT,
  SCENE_FRAMES,
  SCENE_IDS,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
  VOICEOVER_DELAY_FRAMES,
  VOICEOVER_PADDING_FRAMES,
  WIDTH,
  totalFramesFor,
  voiceoverFile,
} from "../theme";

import { S00Intro } from "../scenes/S00Intro";
import { S01Masalah } from "../scenes/S01Masalah";
import { S02IdeBesar } from "../scenes/S02IdeBesar";
import { S03Persiapan } from "../scenes/S03Persiapan";
import { S04Handshake } from "../scenes/S04Handshake";
import { S05Login } from "../scenes/S05Login";
import { S06Profil } from "../scenes/S06Profil";
import { S07Sadap } from "../scenes/S07Sadap";
import { S08UbahIsi } from "../scenes/S08UbahIsi";
import { S09Kedaluwarsa } from "../scenes/S09Kedaluwarsa";
import { S10Penutup } from "../scenes/S10Penutup";

export type ExplainerProps = {
  sceneFrames: number[];
  voiceover: boolean;
};

const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

const DEFAULT_PROPS: ExplainerProps = {
  sceneFrames: [...SCENE_FRAMES],
  voiceover: false,
};

const VoiceoverClip: React.FC<{ index: number; enabled: boolean }> = ({
  index,
  enabled,
}) => {
  if (!enabled) {
    return null;
  }
  return (
    <RemotionAudio
      from={VOICEOVER_DELAY_FRAMES}
      src={staticFile(voiceoverFile(SCENE_IDS[index]))}
    />
  );
};

export const SessionKeyExplainer: React.FC<ExplainerProps> = ({
  sceneFrames,
  voiceover,
}) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sceneFrames[0]} name="Intro">
        <S00Intro />
        <VoiceoverClip index={0} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={sceneFrames[1]} name="Masalah">
        <S01Masalah />
        <VoiceoverClip index={1} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[2]}
        name="IdeBesar"
      >
        <S02IdeBesar />
        <VoiceoverClip index={2} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={timing}
      />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[3]}
        name="Persiapan"
      >
        <S03Persiapan />
        <VoiceoverClip index={3} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={timing}
      />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[4]}
        name="Handshake"
      >
        <S04Handshake />
        <VoiceoverClip index={4} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={sceneFrames[5]} name="Login">
        <S05Login />
        <VoiceoverClip index={5} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-left" })}
        timing={timing}
      />

      <TransitionSeries.Sequence durationInFrames={sceneFrames[6]} name="Profil">
        <S06Profil />
        <VoiceoverClip index={6} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flip({ direction: "from-right" })}
        timing={timing}
      />

      <TransitionSeries.Sequence durationInFrames={sceneFrames[7]} name="Sadap">
        <S07Sadap />
        <VoiceoverClip index={7} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-top" })}
        timing={timing}
      />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[8]}
        name="UbahIsi"
      >
        <S08UbahIsi />
        <VoiceoverClip index={8} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[9]}
        name="Kedaluwarsa"
      >
        <S09Kedaluwarsa />
        <VoiceoverClip index={9} enabled={voiceover} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-right" })}
        timing={timing}
      />

      <TransitionSeries.Sequence
        durationInFrames={sceneFrames[10]}
        name="Penutup"
      >
        <S10Penutup />
        <VoiceoverClip index={10} enabled={voiceover} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const calculateVoiceoverMetadata: CalculateMetadataFunction<
  ExplainerProps
> = async () => {
  try {
    const durations = await Promise.all(
      SCENE_IDS.map((sceneId) =>
        getAudioDurationInSeconds(staticFile(voiceoverFile(sceneId))),
      ),
    );

    const sceneFrames = durations.map((seconds, index) =>
      Math.max(
        SCENE_FRAMES[index],
        Math.ceil(seconds * FPS) + VOICEOVER_PADDING_FRAMES,
      ),
    );

    return {
      durationInFrames: totalFramesFor(sceneFrames),
      props: { sceneFrames, voiceover: true },
    };
  } catch (error) {
    // Audio belum di-generate. Jangan gagalkan Studio/render — kembali ke
    // versi senyap dengan durasi asli.
    console.warn(
      "[voiceover] File audio belum lengkap. Jalankan `npm run voiceover` dulu. " +
        "Untuk sekarang komposisi ini dirender tanpa suara.",
      error,
    );
    return {
      durationInFrames: TOTAL_FRAMES,
      props: DEFAULT_PROPS,
    };
  }
};

export const SessionKeyComposition: React.FC = () => {
  return (
    <>
      <Composition
        id="SessionKeyExplainer"
        component={SessionKeyExplainer}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={DEFAULT_PROPS}
      />
      <Composition
        id="SessionKeyExplainerVO"
        component={SessionKeyExplainer}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ ...DEFAULT_PROPS, voiceover: true }}
        calculateMetadata={calculateVoiceoverMetadata}
      />
    </>
  );
};
