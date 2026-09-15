'use strict';

const crypto = require('crypto');

/**
 * Setara `src/crypto/session.ts` di konsep asli (di sana pakai
 * react-native-quick-crypto; di sini Node `crypto` bawaan — API-nya sengaja
 * dipilih sama persis: randomBytes, publicEncrypt, createCipheriv/decipheriv,
 * getAuthTag/setAuthTag).
 */

// ① Session key lahir di client, bukan di server. 32 byte acak = AES-256.
// Beda tiap pengguna, tiap sesi.
function generateSessionKey() {
  return crypto.randomBytes(32);
}

// ② Bungkus session key dengan RSA public key server (ditanam saat build).
// Setelah baris ini, client sendiri TIDAK bisa membuka bungkusannya lagi —
// hanya private key di server yang bisa.
function wrapSessionKey(serverPublicKeyPem, sessionKey) {
  return crypto.publicEncrypt(
    {
      key: serverPublicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    sessionKey,
  );
}

// Enkripsi payload keluar (dipakai untuk request DAN untuk membaca konsep
// yang sama dipakai server pada response — arahnya simetris).
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

// ③ Dekripsi response — dibuka dengan session key, BUKAN dengan public key.
function open(sessionKey, envelope) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    sessionKey,
    Buffer.from(envelope.iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, 'base64')),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString('utf8'));
}

module.exports = { generateSessionKey, wrapSessionKey, seal, open };
