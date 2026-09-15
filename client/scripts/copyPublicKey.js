'use strict';

/**
 * Simulasi "public key ditanam saat build". Di dunia nyata, tim backend
 * menyerahkan file `server-public.pem` ke tim mobile lewat kanal terpisah
 * (bukan endpoint API!), dan tim mobile menempelkannya sebagai file/konstanta
 * di source code sebelum build APK/IPA. Script ini hanya menyalin file lokal
 * supaya demo mudah dijalankan di satu mesin yang sama.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'server', 'keys', 'public.pem');
const DEST_DIR = path.join(__dirname, '..', 'keys');
const DEST = path.join(DEST_DIR, 'server-public.pem');

if (!fs.existsSync(SRC)) {
  console.error('Tidak menemukan', SRC);
  console.error('Jalankan dulu `npm run generate-keys` di folder server/.');
  process.exit(1);
}

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST);
console.log('Public key server disalin ke', DEST);
console.log('(Di produksi: file ini ikut di-commit ke repo client/mobile —');
console.log(' public key memang boleh dilihat siapa saja.)');
