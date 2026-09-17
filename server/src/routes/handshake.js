'use strict';

const express = require('express');
const crypto = require('crypto');
const {
  generateEphemeralKeyPair,
  publicKeyToJwk,
  jwkToPublicKey,
  buildTranscript,
  deriveSessionKey,
} = require('../crypto/x25519');
const { signTranscript } = require('../crypto/rsa');
const sessionStore = require('../store/sessionStore');
const { SERVER_SIGNING_KEY, SESSION_TTL_SECONDS } = require('../config');

const router = express.Router();

// Fase 1 — Handshake (X25519 ephemeral-ephemeral). Session key TIDAK dikirim:
// kedua sisi menghitungnya sendiri dari shared secret. Server hanya mengirim
// public key ephemeral-nya, ditandatangani dengan kunci RSA long-term supaya
// client bisa memverifikasi bahwa balasan ini memang dari server asli.
router.post('/handshake', express.json(), async (req, res) => {
  const { clientPublicKey } = req.body || {};

  let clientPublic;
  try {
    clientPublic = jwkToPublicKey(clientPublicKey);
  } catch (err) {
    return res.status(400).json({ error: 'clientPublicKey (JWK X25519) wajib diisi' });
  }

  // ③ Keypair ephemeral server — BARU untuk setiap handshake. Hanya public
  //    key-nya yang keluar; private key-nya dibuang setelah shared secret
  //    dihitung (lihat di bawah).
  const serverEphemeral = generateEphemeralKeyPair();
  const serverJwk = publicKeyToJwk(serverEphemeral.publicKey);

  const sessionId = crypto.randomUUID();

  // transcript (versi + kedua public key)
  // adalah data yang akan ditandatangani oleh server untuk memastikan
  // bahwa balasan ini memang dari server asli.
  const transcript = buildTranscript(clientPublicKey, serverJwk);

  let sessionKey;
  try {
    // ④ Dihitung dari X25519(serverPriv, clientPub), lalu HKDF.
    sessionKey = deriveSessionKey(
      serverEphemeral.privateKey,
      clientPublic,
      Buffer.from(sessionId),
      transcript,
    );
  } catch (err) {
    return res.status(400).json({ error: 'key_exchange_failed' });
  }

  // Private key ephemeral tidak lagi diperlukan. Lempar referensinya supaya
  // tidak ada salinan yang tersisa di memori proses.
  serverEphemeral.privateKey = null;

  // ⑤ Tanda tangan transcript (versi + kedua public key) dengan kunci RSA
  //    long-term server. Client memverifikasinya dengan public key yang
  //    ditanam saat build.
  const signature = signTranscript(SERVER_SIGNING_KEY, transcript).toString('base64');

  // ⑥ Session key diikat ke satu sessionId, hidup 30 menit (default).
  await sessionStore.set(`sk:${sessionId}`, sessionKey.toString('base64'), SESSION_TTL_SECONDS);

  res.json({
    sessionId,
    expiresIn: SESSION_TTL_SECONDS,
    serverPublicKey: serverJwk,
    signature,
  });
});

module.exports = router;
