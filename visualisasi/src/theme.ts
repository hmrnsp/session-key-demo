import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const fraunces = loadFraunces("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const jakarta = loadJakarta("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  display: fraunces.fontFamily,
  ui: jakarta.fontFamily,
  mono: mono.fontFamily,
} as const;

export const COLORS = {
  bg: "#F7F4EC",
  bgSoft: "#EFE8D8",
  paper: "#FFFFFF",
  ink: "#14201B",
  inkSoft: "#4A564F",
  inkFaint: "#8B948D",
  nasabah: "#1E5EFF",
  nasabahDark: "#123FA8",
  nasabahSoft: "#DCE6FF",
  bank: "#0E7C57",
  bankDark: "#08513A",
  bankSoft: "#D6EEE5",
  hacker: "#D7263D",
  hackerDark: "#8E1727",
  hackerSoft: "#FBDDE1",
  wire: "#8A8577",
  wireLight: "#DAD4C4",
  wireDark: "#5F5B50",
  gold: "#D9A521",
  goldSoft: "#F6E7BE",
  skin: "#F0C39B",
  skinDark: "#D8A276",
  hair: "#2E2119",
  navy: "#243B6B",
  shoe: "#2A2F45",
} as const;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const TRANSITION_FRAMES = 14;

export const SCENES = [
  { id: "Intro", seconds: 6.2 },
  { id: "Masalah", seconds: 8 },
  { id: "IdeBesar", seconds: 7 },
  { id: "Persiapan", seconds: 8 },
  { id: "Handshake", seconds: 10 },
  { id: "Login", seconds: 8 },
  { id: "Profil", seconds: 7 },
  { id: "Sadap", seconds: 7 },
  { id: "UbahIsi", seconds: 7 },
  { id: "Kedaluwarsa", seconds: 7.4 },
  { id: "Penutup", seconds: 8 },
] as const;

export const SCENE_FRAMES = SCENES.map((scene) =>
  Math.round(scene.seconds * FPS),
);

export const SCENE_IDS = SCENES.map((scene) => scene.id);

export const VOICEOVER_DIR = "voiceover";

export const VOICEOVER_DELAY_FRAMES = 5;

export const VOICEOVER_PADDING_FRAMES = 12;

export const voiceoverFile = (sceneId: string): string =>
  `${VOICEOVER_DIR}/${sceneId}.mp3`;

export const totalFramesFor = (sceneFrames: readonly number[]): number =>
  sceneFrames.reduce((total, frames) => total + frames, 0) -
  TRANSITION_FRAMES * (sceneFrames.length - 1);

export const TOTAL_FRAMES = totalFramesFor(SCENE_FRAMES);

export const LAYOUT = {
  raniLeft: 120,
  raniTop: 250,
  bankRight: 120,
  bankTop: 210,
  wireY: 812,
  wireLeft: 430,
  wireRight: 1490,
} as const;

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
