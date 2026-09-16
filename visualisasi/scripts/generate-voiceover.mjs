// Generate voice-over per adegan memakai ElevenLabs TTS.
//
// Pemakaian:
//   1. Buat file .env di folder visualisasi (lihat .env.example) berisi:
//        ELEVENLABS_API_KEY=sk_...
//        ELEVENLABS_VOICE_ID=xxxxxxxxxxxxxxxx
//   2. Jalankan:  npm run voiceover
//   3. Hasil MP3 ditulis ke public/voiceover/<Id>.mp3
//
// Opsi:
//   --voice=<voiceId>   override voice id
//   --only=Intro,Login  hanya generate adegan tertentu
//   --list              tampilkan daftar adegan + perkiraan durasi, tanpa memanggil API
//   --force             timpa file yang sudah ada

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const parseEnv = (file) => {
  if (!existsSync(file)) {
    return {};
  }
  const out = {};
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
};

const env = {
  ...parseEnv(join(ROOT, ".env")),
  ...process.env,
};

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const has = (name) => args.includes(`--${name}`);

const config = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "voiceover.json"), "utf8"),
);

const only = flag("only")
  ? new Set(flag("only").split(",").map((s) => s.trim()))
  : null;

const lines = config.lines.filter((l) => !only || only.has(l.id));

if (has("list")) {
  console.log("Adegan yang akan dinarasikan:\n");
  for (const l of config.lines) {
    const words = l.text.split(/\s+/).length;
    const wps = (words / l.seconds).toFixed(2);
    console.log(
      `${l.id.padEnd(12)} ${String(l.seconds).padStart(5)}s  ${String(
        words,
      ).padStart(3)} kata  (${wps} kata/detik)  "${l.text.slice(0, 48)}…"`,
    );
  }
  process.exit(0);
}

const apiKey = env.ELEVENLABS_API_KEY;
const voiceId = flag("voice") || env.ELEVENLABS_VOICE_ID;

if (!apiKey) {
  console.error("");
  console.error("ELEVENLABS_API_KEY belum diisi.");
  console.error("Salin .env.example menjadi .env lalu isi API key Anda.");
  console.error("");
  process.exit(1);
}

if (!voiceId) {
  console.error("");
  console.error("ELEVENLABS_VOICE_ID belum diisi.");
  console.error(
    "Lihat daftar voice di https://elevenlabs.io/app/voice-library lalu salin Voice ID.",
  );
  console.error("");
  process.exit(1);
}

const outDir = join(ROOT, "public", "voiceover");
mkdirSync(outDir, { recursive: true });

const generate = async (line) => {
  const target = join(outDir, `${line.id}.mp3`);
  if (existsSync(target) && !has("force")) {
    console.log(`= ${line.id}.mp3 sudah ada, dilewati (pakai --force untuk menimpa)`);
    return;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
    voiceId,
  )}?output_format=${config.voice.outputFormat}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: line.text,
      model_id: config.voice.modelId,
      voice_settings: config.voice.settings,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `ElevenLabs gagal untuk ${line.id} (${response.status}): ${detail.slice(
        0,
        300,
      )}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(target, buffer);
  console.log(
    `+ ${line.id}.mp3  ${(buffer.length / 1024).toFixed(1)} KB  "${line.text.slice(
      0,
      44,
    )}…"`,
  );
};

console.log(`Voice ID : ${voiceId}`);
console.log(`Model    : ${config.voice.modelId}`);
console.log(`Tujuan   : public/voiceover/\n`);

for (const line of lines) {
  await generate(line);
}

console.log("\nSelesai. Buka Remotion Studio lalu pilih komposisi");
console.log('"SessionKeyExplainerVO" untuk mendengar hasilnya.');
