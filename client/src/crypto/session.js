'use strict';

const crypto = require('crypto');

/**
 * Sisi client dari X25519 ephemeral-ephemeral (ECDHE).
 *
 * Client membuat keypair X25519 sekali pakai, mengirim public key-nya, lalu
 * menghitung sendiri session key dari shared secret. Private key ephemeral
 * dibuang setelah dipakai — tidak ada yang menyentuh disk.
 *
 * Verifikasi tanda tangan server wajib dilakukan SEBELUM memakai public key
 * server; tanpa itu MITM bisa menukarnya dan seluruh skema runtuh tanpa gejala.
 */

const PROTOCOL_LABEL = 'session-key-demo/x25519/v1';

// ① Keypair ephemeral — sekali pakai per sesi.
function generateEphemeralKeyPair() {
  return crypto.generateKeyPairSync('x25519');
}

function publicKeyToJwk(publicKey) {
  return publicKey.export({ format: 'jwk' });
}

function jwkToPublicKey(jwk) {
  if (!jwk || jwk.kty !== 'OKP' || jwk.crv !== 'X25519' || typeof jwk.x !== 'string') {
    throw new Error('public key X25519 (JWK) tidak valid');
  }
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

function buildTranscript(clientJwk, serverJwk) {
  return Buffer.from(`${PROTOCOL_LABEL}\n${clientJwk.x}\n${serverJwk.x}`, 'utf8');
}

// ② Verify tanda tangan server dengan public key yang ditanam saat build.
function verifyTranscript(serverPublicKeyPem, transcript, signatureBase64) {
  return crypto.verify(
    'sha256',
    transcript,
    {
      key: serverPublicKeyPem,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    },
    Buffer.from(signatureBase64, 'base64'),
  );
}

// ③ shared = X25519(clientPriv, serverPub); tolak titik nol, lalu HKDF-SHA256.
function deriveSessionKey(privateKey, peerPublicKey, salt, transcript) {
  const shared = crypto.diffieHellman({ privateKey, publicKey: peerPublicKey });
  if (shared.every((byte) => byte === 0)) {
    throw new Error('shared secret X25519 nol (public key tidak valid)');
  }
  return Buffer.from(crypto.hkdfSync('sha256', shared, salt, transcript, 32));
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

// ④ Dekripsi response — dibuka dengan session key hasil turunan, BUKAN
//    dengan public key.
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

module.exports = {
  PROTOCOL_LABEL,
  generateEphemeralKeyPair,
  publicKeyToJwk,
  jwkToPublicKey,
  buildTranscript,
  verifyTranscript,
  deriveSessionKey,
  seal,
  open,
};
