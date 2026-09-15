'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');

const PRIVATE_KEY_PATH = path.join(__dirname, '..', 'keys', 'private.pem');

if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.error('');
  console.error('Private key tidak ditemukan:', PRIVATE_KEY_PATH);
  console.error('Jalankan dulu: npm run generate-keys');
  console.error('');
  process.exit(1);
}

module.exports = {
  PORT: Number(process.env.PORT || 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  SESSION_TTL_SECONDS: Number(process.env.SESSION_TTL_SECONDS || 1800),
  SERVER_PRIVATE_KEY: fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'),
};
