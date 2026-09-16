# Session Key Demo — X25519 (ECDHE) Handshake + AES-256-GCM Payload Encryption

Implementasi konsep **"Alur Kunci Sesi"**: dua aplikasi Node.js/Express terpisah
(`server/` dan `client/`) yang mendemonstrasikan skema enkripsi payload
end-to-end di atas TLS — **X25519 ephemeral-ephemeral (ECDHE)** untuk handshake
sekali, lalu AES-256-GCM simetris dua arah selama sesi berlangsung. Session key
tidak pernah dikirim lewat kabel; kedua sisi menghitungnya sendiri.

```
session-key-demo/
├── server/     ← "backend" — punya private key, endpoint /api/session/handshake,
│                 middleware payloadCrypto, dan API bisnis contoh (login/profile)
└── client/     ← "aplikasi" — punya public key (ditanam), membuat session key,
                  handshake, lalu request/response terenkripsi. Ada UI browser
                  dan CLI untuk demo.
```

## Konsep singkat

| Kunci | Dibuat di | Umur | Fungsi |
|---|---|---|---|
| RSA private key | Server (sekali, sebelum rilis) | Bertahun-tahun | Menandatangani transcript handshake |
| RSA public key | Diturunkan dari private key | Sama dengan private key | Ditanam di client, memverifikasi tanda tangan server |
| X25519 ephemeral | Masing-masing sisi, tiap handshake | Sekali pakai | Menghitung shared secret ECDHE |
| AES-256 session key | Diturunkan dari shared secret (dua sisi) | 30 menit (default) | Enkripsi/dekripsi dua arah, disimpan di memori saja |

Alurnya:

0. **Sekali di server**: generate keypair RSA-3072. Private key tidak pernah
   keluar dari server. Public key diserahkan ke client (`server-public.pem`)
   dan ditanam saat build.
1. **Handshake** (sekali per sesi, X25519 ephemeral-ephemeral): client membuat
   keypair X25519 sekali pakai dan mengirim public key-nya ke
   `POST /api/session/handshake`. Server membuat keypair X25519-nya sendiri,
   menghitung `shared = X25519(priv, clientPub)`, menurunkan session key dengan
   `HKDF-SHA256`, lalu membalas public key-nya + tanda tangan RSA-PSS atas
   transcript. Client memverifikasi tanda tangan itu dengan public key yang
   ditanam, lalu menghitung session key yang sama dari sisinya. Session key
   **tidak pernah dikirim lewat kabel**.
2. **Request**: client mengenkripsi body dengan AES-256-GCM (IV acak 12 byte
   tiap pesan), kirim `{ iv, data, tag }` + header `X-Session-Id`. Middleware
   server mendekripsinya sebelum masuk ke controller — controller menerima
   `req.body` biasa, tidak tahu-menahu soal kripto.
3. **Response**: middleware server membungkus `res.json(...)` dengan session
   key **yang sama**, IV baru. Client membukanya dengan session key yang sama
   — bukan dengan public key.
4. **Kedaluwarsa**: kalau session key habis, server balas
   `401 { error: "session_expired" }`. Client otomatis handshake ulang dan
   mengulang request — transparan bagi pemanggil.

Lihat komentar kode di `server/src/middleware/payloadCrypto.js` dan
`client/src/crypto/session.js` untuk detail implementasi tiap langkah.

## Menjalankan

### 1. Server

```bash
cd server
npm install
npm run generate-keys   # bikin server/keys/private.pem + public.pem (sekali saja)
npm start                # http://localhost:4000
```

### 2. Client

Client butuh salinan `server-public.pem` (dalam dunia nyata ini ditanam ke
source code saat build, bukan diunduh saat runtime — lihat catatan keamanan
di bawah).

```bash
cd client
npm install
npm run copy-key         # menyalin server/keys/public.pem -> client/keys/server-public.pem
npm start                 # http://localhost:3000 (UI demo) + CLI: npm run cli
```

Buka `http://localhost:3000` di browser: ada tombol **Handshake**, **Login**,
dan **Get Profile** yang menampilkan persis apa yang lewat kabel (ciphertext)
di sebelah hasil dekripsinya — supaya perbedaan "yang disadap" vs "yang dibaca
aplikasi" kelihatan jelas.

Atau jalankan versi terminal murni:

```bash
cd client
npm run cli
```

### Mencoba rotasi otomatis

Set TTL pendek supaya kedaluwarsa lebih cepat terlihat:

```bash
# server/.env
SESSION_TTL_SECONDS=20
```

Restart server, lakukan login, tunggu 20 detik, lalu klik **Get Profile**
lagi — client akan menerima `401 session_expired`, otomatis handshake ulang,
dan mengulang request tanpa pengguna melihat apa pun.

## Catatan keamanan (sesuai checklist konsep)

- Public key **wajib** ditanam saat build (`client/keys/server-public.pem`),
  bukan diunduh dari endpoint API — kalau diunduh, penyerang man-in-the-middle
  bisa menukarnya dan seluruh skema runtuh tanpa gejala. Di skema X25519 ini
  public key tersebut dipakai untuk **memverifikasi tanda tangan** server, dan
  client menolak handshake kalau tanda tangannya tidak valid.
- Shared secret mentah X25519 **wajib** dilewatkan `HKDF-SHA256` sebelum jadi
  kunci AES-256 (output X25519 tidak seragam). `info` HKDF diisi transcript
  handshake (versi protokol + kedua public key) supaya kunci terikat ke kedua
  belah pihak dan tidak bisa di-replay.
- Keypair X25519 bersifat **ephemeral**: dibuat baru tiap handshake dan
  private key-nya dibuang setelah shared secret dihitung, sehingga private key
  RSA long-term yang bocor di masa depan tidak bisa membuka sesi lama
  (forward secrecy). Private key RSA hanya menandatangani, bukan membentuk
  kunci.
- Session key **hanya** hidup di memori proses (di client dan di server),
  tidak pernah ditulis ke disk/file/`localStorage` sederajat, dan tidak pernah
  dikirim lewat kabel.
- IV AES-GCM harus selalu 12 byte acak baru per pesan — lihat komentar
  `WAJIB baru tiap pesan` di kode.
- `decipher.final()` selalu dipanggil (Node melakukan ini secara implisit
  lewat `createDecipheriv(...).final()`), supaya auth tag benar-benar
  diverifikasi dan payload yang diubah di jalan ditolak.
- Password login di server di-hash (`bcryptjs` di demo ini — di produksi
  gunakan **Argon2id**), terlepas total dari layer enkripsi payload ini; dua
  hal berbeda yang sengaja dipisahkan.
- Session store di demo ini pakai in-memory `Map` (server single-instance).
  Untuk multi-instance/production, ganti `server/src/store/sessionStore.js`
  dengan Redis (`ioredis`) — key `sk:<sessionId>`, `EX <ttl detik>`. Interface
  store sudah dibuat cocok 1:1 dengan `redis.get/set/del`, lihat komentar di
  file tersebut.
- Lapisan ini dipasang **di atas** TLS 1.2+ dan certificate pinning, bukan
  menggantikannya.
- Upgrade lanjutan yang disebut di konsep asli sudah diterapkan di sini:
  handshake RSA-OAEP diganti **ECDH X25519 ephemeral-ephemeral** yang
  diautentikasi tanda tangan RSA, sehingga session key tidak pernah dikirim
  dan sesi lama tetap aman walau private key long-term bocor. Struktur kode
  lain (middleware, store, controller) tidak berubah.
