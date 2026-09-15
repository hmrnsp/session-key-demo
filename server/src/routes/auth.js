'use strict';

const express = require('express');
const { findByUsername, verifyPassword } = require('../data/users');
const authTokenStore = require('../store/authTokenStore');

const router = express.Router();

// Controller biasa — req.body dan res.json TIDAK tahu bahwa di sekelilingnya
// ada middleware payloadCrypto yang mendekripsi/mengenkripsi. Ini yang
// dimaksud "logika bisnis tidak berubah sama sekali".
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  const user = username ? findByUsername(username) : null;
  if (!user || !verifyPassword(user, password || '')) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  const token = authTokenStore.issue(user.id);
  res.json({ token, user: { id: user.id, username: user.username } });
});

module.exports = router;
