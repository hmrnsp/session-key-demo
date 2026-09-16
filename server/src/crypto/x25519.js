'use strict';

const crypto = require('crypto');

/**
 * X25519 ephemeral-ephemeral (ECDHE).
 *
 * Dua sisi membuat keypair X25519 BARU setiap handshake, bertukar public key,
 * lalu menghitung shared secret masing-masing. Session key TIDAK pernah
 * dikirim lewat kabel — ia diturunkan serentak di dua sisi.
 *
 * Shared secret mentah X25519 tidak seragam, jadi WAJIB dilewatkan HKDF-SHA256
 * sebelum dipakai sebagai kunci AES-256. `info` diisi transcript handshake
 * supaya kunci terikat pada kedua public key (dan `salt` diisi sessionId),
 * sehingga tidak bisa di-replay dengan public key pihak lain.
 */

const PROTOCOL_LABEL = 'session-key-demo/x25519/v1';

// ① Keypair ephemeral — sekali pakai, langsung dibuang setelah handshake.
function generateEphemeralKeyPair() {
  return crypto.generateKeyPairSync('x25519');
}

// Public key dikirim sebagai JWK (hanya berisi kty/crv/x) — JSON-friendly,
// tanpa perlu encoding DER/base64 manual.
function publicKeyToJwk(publicKey) {
  return publicKey.export({ format: 'jwk' });
}

function jwkToPublicKey(jwk) {
  if (!jwk || jwk.kty !== 'OKP' || jwk.crv !== 'X25519' || typeof jwk.x !== 'string') {
    throw new Error('public key X25519 (JWK) tidak valid');
  }
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

// Transcript yang di-commit: versi protokol + kedua public key, urutan tetap
// (client dulu, baru server) supaya bisa direkonstruksi identik di dua sisi.
function buildTranscript(clientJwk, serverJwk) {
  return Buffer.from(`${PROTOCOL_LABEL}\n${clientJwk.x}\n${serverJwk.x}`, 'utf8');
}

// ② shared = X25519(privateKey, peerPublicKey); tolak titik nol (public key
//    tidak valid), lalu HKDF-SHA256 -> 32 byte (AES-256).
function deriveSessionKey(privateKey, peerPublicKey, salt, transcript) {
  const shared = crypto.diffieHellman({ privateKey, publicKey: peerPublicKey });
  if (shared.every((byte) => byte === 0)) {
    throw new Error('shared secret X25519 nol (public key tidak valid)');
  }
  // hkdfSync mengembalikan ArrayBuffer — bungkus jadi Buffer.
  return Buffer.from(crypto.hkdfSync('sha256', shared, salt, transcript, 32));
}

module.exports = {
  PROTOCOL_LABEL,
  generateEphemeralKeyPair,
  publicKeyToJwk,
  jwkToPublicKey,
  buildTranscript,
  deriveSessionKey,
};
