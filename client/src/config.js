'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const PUBLIC_KEY_PATH = path.join(__dirname, '..', 'keys', 'server-public.pem');

if (!fs.existsSync(PUBLIC_KEY_PATH)) {
  console.error('');
  console.error('server-public.pem tidak ditemukan:', PUBLIC_KEY_PATH);
  console.error('Jalankan server dulu (`npm run generate-keys` di folder server/),');
  console.error('lalu jalankan `npm run copy-key` di folder client/.');
  console.error('');
  process.exit(1);
}

module.exports = {
  PORT: Number(process.env.PORT || 3000),
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:4000',
  // Ini yang di dunia nyata ditanam sebagai konstanta di source RN saat
  // build — BUKAN diunduh dari endpoint API (lihat catatan keamanan README).
  SERVER_PUBLIC_KEY: fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'),
};
