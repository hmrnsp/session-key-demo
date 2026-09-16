# Voice-over dengan ElevenLabs

Narasi Bahasa Indonesia untuk `SessionKeyExplainer`, di-generate per adegan
memakai ElevenLabs Text-to-Speech, lalu dipasang otomatis di Remotion.

## Cara pakai (3 langkah)

1. **Isi kredensial.** Salin `.env.example` menjadi `.env` di folder
   `visualisasi/`, lalu isi:

   ```
   ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxx
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ```

   - API key: https://elevenlabs.io/app/settings/api-keys
   - Voice ID (pilih suara yang fasih Bahasa Indonesia):
     https://elevenlabs.io/app/voice-library → klik voice → salin **Voice ID**.
   - Contoh voice multi-bahasa: `Rachel` = `21m00Tcm4TlvDq8ikWAM`,
     `Adam` = `pNInz6obpgDQGcFmaJgB`.

2. **Generate audio** (menulis ke `public/voiceover/<NamaAdegan>.mp3`):

   ```bash
   npm run voiceover
   ```

   Perintah pendukung:

   ```bash
   npm run voiceover:list          # lihat transkrip + kepadatan kata/detik
   npm run voiceover -- --only=Intro,Login   # generate sebagian saja
   npm run voiceover -- --force    # timpa file yang sudah ada
   npm run voiceover -- --voice=<voiceId>    # ganti voice tanpa mengubah .env
   ```

   File yang sudah ada dilewati, jadi aman dijalankan berulang (hanya yang
   belum ada yang dipanggil ke API).

3. **Lihat di Studio / render.**

   ```bash
   npm run dev        # pilih komposisi "SessionKeyExplainerVO"
   npx remotion render SessionKeyExplainerVO out/video-vo.mp4
   ```

## Cara kerjanya di Remotion

Ada dua komposisi:

| Komposisi | Audio | Durasi |
|---|---|---|
| `SessionKeyExplainer` | tanpa suara | tetap, 2368 frame |
| `SessionKeyExplainerVO` | narasi per adegan | **menyesuaikan panjang audio** |

`SessionKeyExplainerVO` memakai `calculateMetadata`: setiap MP3 diukur dengan
`getAudioDurationInSeconds()`, lalu tiap adegan dibuat **minimal** sepanjang
audio-nya (`max(durasi asli, audio + 12 frame)`) sehingga narasi tidak pernah
terpotong. Audio mulai 5 frame setelah adegan masuk agar tidak menabrak
transisi.

Kalau file audio belum di-generate, komposisi VO **tidak error** — ia mencatat
peringatan dan turun ke versi senyap. Jadi `npm run dev` tetap aman sebelum
Anda mengisi API key.

## Transkrip

Sumber tunggal: [`src/data/voiceover.json`](src/data/voiceover.json) — dipakai
oleh skrip generator. Kata-kata di bawah ini identik dengan file tersebut.

| # | Adegan | Durasi | Narasi |
|---|---|---|---|
| 0 | Intro | 6.2s | Setiap kali Anda membuka aplikasi bank, data Anda menempuh perjalanan yang berbahaya. |
| 1 | Masalah | 8s | Tanpa pelindung, password dan saldo terkirim apa adanya. Penyadap bisa membacanya dengan mudah. |
| 2 | Ide besar | 7s | Solusinya, bungkus semua data dengan kunci sesi. Ada dua kunci yang bekerja bersama. |
| 3 | Persiapan | 8s | Bank membuat sepasang kunci. Anak kuncinya disimpan rahasia dan tidak pernah keluar. Gembok publiknya ditanam di aplikasi Anda. |
| 4 | Handshake | 10s | Aplikasi membuat kunci rahasia baru, lalu menguncinya dengan gembok publik bank. Hanya bank yang bisa membukanya, dan sesi pun resmi dibuka. |
| 5 | Login | 8s | Saat Anda login, password berubah menjadi kode acak. Di kabel tidak ada yang bisa dibaca, di bank datanya terbuka kembali. |
| 6 | Data bank | 7s | Begitu juga saldo Anda. Balasan bank dienkripsi dengan kunci rahasia yang sama, lalu dibuka di HP Anda. |
| 7 | Serangan: sadap | 7s | Penyadap hanya melihat kode acak. Tanpa kunci rahasia, isinya tidak berarti apa-apa. |
| 8 | Serangan: ubah isi | 7s | Kalau penyadap mencoba mengubah data, segel pengaman rusak, dan server langsung menolaknya. |
| 9 | Kunci kedaluwarsa | 7.4s | Ketika kunci lama habis masa berlakunya, aplikasi membuat kunci baru secara otomatis. Anda tidak merasa apa-apa. |
| 10 | Penutup | 8s | Handshake sekali, kunci sesi dua arah, dan segel yang menolak perubahan. Rahasia tetap rahasia, dari HP sampai core banking. |

Kepadatan 1,6–2,5 kata/detik — sengaja sedikit longgar supaya TTS tidak
terdengar terburu-buru.

## Menyesuaikan

- **Ubah kalimat:** edit `src/data/voiceover.json`, lalu
  `npm run voiceover -- --force`. Durasi adegan ikut menyesuaikan otomatis.
- **Ubah tuning suara:** `stability`, `similarity_boost`, `style`,
  `use_speaker_boost` ada di blok `voice.settings` pada file yang sama. Model
  default `eleven_multilingual_v2`; untuk kualitas lebih baru bisa coba
  `eleven_turbo_v2_5` (lebih cepat/hemat).
- **Tambah musik latar:** taruh file di `public/`, lalu tambahkan satu
  `<Audio>` sebagai saudara `<TransitionSeries>` (bukan di dalamnya), misalnya:

  ```tsx
  import { Audio } from "@remotion/media";
  import { staticFile } from "remotion";

  return (
    <>
      <Audio src={staticFile("music/bed.mp3")} volume={0.12} loop />
      <TransitionSeries>{/* ... */}</TransitionSeries>
    </>
  );
  ```

## Catatan

- `.env` dan `public/voiceover/` sudah masuk `.gitignore` (audio besar,
  bisa dibuat ulang kapan saja).
- Biaya: tiap generate memanggil API per adegan. Karena file yang ada
  dilewati, cukup pakai `--force` bila benar-benar ingin regenerate.
