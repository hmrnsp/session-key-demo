'use strict';

const crypto = require('crypto');

/**
 * Enkripsi simetris dua arah yang dipakai sepanjang sesi, setelah handshake
 * selesai. Sama persis dipakai untuk request (client->server) maupun
 * response (server->client) — hanya arah datanya yang beda, kuncinya sama.
 */

function seal(sessionKey, payload) {
  const iv = crypto.randomBytes(12); // WAJIB baru untuk setiap pesan
  const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  return {
    iv: iv.toString('base64'),
    data: ciphertext.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
  };
}

function open(sessionKey, envelope) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    sessionKey,
    Buffer.from(envelope.iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  // decipher.final() dipanggil di sini secara eksplisit — kalau ciphertext
  // atau tag diubah di jalan, baris ini melempar error dan request ditolak.
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, 'base64')),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString('utf8'));
}

module.exports = { seal, open };
