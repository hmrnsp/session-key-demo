'use strict';

const express = require('express');
const authTokenStore = require('../store/authTokenStore');
const { findById } = require('../data/users');

const router = express.Router();

// Controller biasa lagi — tidak ada satu baris pun kripto di sini.
router.get('/', (req, res) => {
  const authHeader = req.header('X-Auth-Token');
  const userId = authHeader ? authTokenStore.resolve(authHeader) : null;
  const user = userId ? findById(userId) : null;

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Data "sensitif" (saldo, PII) — ini persis yang di konsep asli disebut
  // temuan 1.11: kalau dikirim plaintext, siapa pun yang menyadap koneksi
  // bisa membacanya. Di sini res.json otomatis terenkripsi AES-256-GCM oleh
  // middleware payloadCrypto sebelum benar-benar dikirim ke client.
  res.json({
    id: user.id,
    username: user.username,
    balance: user.balance,
  });
});

module.exports = router;
