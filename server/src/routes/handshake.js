'use strict';

const express = require('express');
const crypto = require('crypto');
const { unwrapSessionKey } = require('../crypto/rsa');
const sessionStore = require('../store/sessionStore');
const { SERVER_PRIVATE_KEY, SESSION_TTL_SECONDS } = require('../config');

const router = express.Router();

// Fase 1 — Handshake. Endpoint ini SATU-SATUNYA tempat RSA dipakai.
// Body TIDAK dienkripsi AES di sini (belum ada session key untuk itu) —
// yang dikirim hanya bungkusan RSA-nya (wrappedKey).
router.post('/handshake', express.json(), async (req, res) => {
  const { wrappedKey } = req.body || {};

  if (!wrappedKey || typeof wrappedKey !== 'string') {
    return res.status(400).json({ error: 'wrappedKey (base64) wajib diisi' });
  }

  let sessionKey;
  try {
    // ③ Hanya private key di server yang bisa membuka bungkusan ini.
    sessionKey = unwrapSessionKey(SERVER_PRIVATE_KEY, wrappedKey);
  } catch (err) {
    // wrappedKey rusak, atau dibungkus dengan public key yang salah/berbeda.
    return res.status(400).json({ error: 'wrappedKey tidak valid' });
  }

  if (sessionKey.length !== 32) {
    return res.status(400).json({ error: 'session key harus 32 byte (AES-256)' });
  }

  // ④ Session key diikat ke satu sessionId, hidup 30 menit (default).
  const sessionId = crypto.randomUUID();
  await sessionStore.set(`sk:${sessionId}`, sessionKey.toString('base64'), SESSION_TTL_SECONDS);

  res.json({ sessionId, expiresIn: SESSION_TTL_SECONDS });
});

module.exports = router;
