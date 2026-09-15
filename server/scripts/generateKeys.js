'use strict';

/**
 * Fase 0 — Pembuatan keypair, sekali, sebelum rilis.
 *
 * Dijalankan oleh tim backend, di server (di sini: lokal, untuk demo).
 * Bukan oleh developer mobile/client, dan bukan di laptop siapa pun dalam
 * skenario produksi nyata — di produksi ini berjalan di server/KMS/HSM.
 *
 * Private key dibuat lebih dulu; public key DITURUNKAN darinya (bukan
 * dibuat terpisah) — persis seperti `openssl genpkey` lalu `openssl rsa
 * -pubout` di konsep aslinya, hanya di sini memakai Node crypto langsung
 * supaya tidak butuh binary openssl terpasang di PATH.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEYS_DIR = path.join(__dirname, '..', 'keys');
const PRIVATE_PATH = path.join(KEYS_DIR, 'private.pem');
const PUBLIC_PATH = path.join(KEYS_DIR, 'public.pem');

function main() {
  if (fs.existsSync(PRIVATE_PATH) && fs.existsSync(PUBLIC_PATH)) {
    console.log('Keypair sudah ada, tidak dibuat ulang:');
    console.log('  -', PRIVATE_PATH);
    console.log('  -', PUBLIC_PATH);
    console.log('Hapus manual dulu kalau memang mau generate ulang (ini akan');
    console.log('memutus semua client yang sudah menanam public key lama).');
    return;
  }

  fs.mkdirSync(KEYS_DIR, { recursive: true });

  console.log('Generating RSA-3072 keypair (setara `openssl genpkey ... rsa_keygen_bits:3072`)...');

  // 1 — private key. RAHASIA. Tidak pernah keluar dari server.
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 3072,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  fs.writeFileSync(PRIVATE_PATH, privateKey, { mode: 0o600 });
  // 2 — public key DITURUNKAN dari private key di atas.
  fs.writeFileSync(PUBLIC_PATH, publicKey, { mode: 0o644 });

  console.log('Selesai.');
  console.log('  RAHASIA  ->', PRIVATE_PATH, '(jangan pernah commit / kirim ke mana pun)');
  console.log('  PUBLIK   ->', PUBLIC_PATH, '(serahkan ke tim client, tanam saat build)');
  console.log('');
  console.log('Langkah berikutnya: jalankan `npm run copy-key` di folder client/');
  console.log('(atau salin manual public.pem ke client/keys/server-public.pem).');
}

main();
