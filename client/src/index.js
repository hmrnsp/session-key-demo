'use strict';

const path = require('path');
const express = require('express');
const config = require('./config');
const { SessionClient } = require('./apiClient');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Satu SessionClient dipakai untuk seluruh demo browser — merepresentasikan
// "aplikasi" (satu instance app di satu HP). Session key hidup di memori
// proses Node ini, sama seperti di memori HP pada konsep asli.
const client = new SessionClient();

app.get('/demo/status', (req, res) => {
  res.json({
    hasSession: client.isSessionFresh(),
    sessionId: client.sessionId,
    expiresAt: client.expiresAt || null,
    serverUrl: config.SERVER_URL,
  });
});

app.post('/demo/handshake', async (req, res) => {
  const debug = {};
  try {
    const result = await client.handshake({ debug });
    res.json({
      ok: true,
      ...result,
      wire: debug,
      sessionKeyPreview: client.sessionKey.toString('hex').slice(0, 16) + '…',
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, wire: debug });
  }
});

app.post('/demo/login', async (req, res) => {
  const debug = {};
  try {
    const { username = 'demo', password = 'password123' } = req.body || {};
    const decrypted = await client.request('POST', '/api/auth/login', { username, password }, { debug });
    client.setAuthToken(decrypted.token);
    res.json({ ok: true, wire: debug, decrypted });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message, wire: debug });
  }
});

app.get('/demo/profile', async (req, res) => {
  const debug = {};
  try {
    const decrypted = await client.request('GET', '/api/profile', undefined, { debug });
    res.json({ ok: true, wire: debug, decrypted });
  } catch (err) {
    res.status(err.status || 500).json({ ok: false, error: err.message, wire: debug });
  }
});

app.listen(config.PORT, () => {
  console.log(`[client] UI demo di http://localhost:${config.PORT}`);
  console.log(`[client] server tujuan: ${config.SERVER_URL}`);
});
