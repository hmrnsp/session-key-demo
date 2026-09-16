'use strict';

const crypto = require('crypto');

/**
 * Tanda tangan transcript handshake dengan private key RSA server (long-term,
 * yang public key-nya sudah ditanam di client). Fungsinya BUKAN membentuk
 * kunci — kunci dibentuk oleh X25519 — melainkan mengautentikasi public key
 * ephemeral server supaya MITM tidak bisa menukarnya.
 *
 * Dipakai RSA-PSS/SHA-256 (padding tanda tangan modern), bukan enkripsi.
 */
const SIGN_ALGO = 'sha256';

function signOptions(key) {
  return {
    key,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  };
}

function signTranscript(privateKeyPem, transcript) {
  return crypto.sign(SIGN_ALGO, transcript, signOptions(privateKeyPem));
}

function verifyTranscript(publicKeyPem, transcript, signature) {
  return crypto.verify(SIGN_ALGO, transcript, signOptions(publicKeyPem), signature);
}

module.exports = { signTranscript, verifyTranscript };
