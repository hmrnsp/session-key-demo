'use strict';

const { seal, open } = require('../crypto/aesGcm');
const sessionStore = require('../store/sessionStore');

/**
 * Middleware terpasang di semua route "bisnis" (login, profile, dst).
 * Controller di belakangnya tidak berubah sama sekali — ia menerima
 * `req.body` sebagai objek biasa, dan memanggil `res.json(...)` seperti
 * biasa. Semua kripto hidup di sini, satu tempat.
 *
 * Fase 2 (request masuk):
 *   - ambil sessionKey dari store lewat header X-Session-Id
 *   - kalau body berbentuk envelope { iv, data, tag }, dekripsi jadi
 *     req.body biasa (verifikasi tag terjadi implisit lewat decipher.final())
 *
 * Fase 3 (response keluar):
 *   - timpa res.json supaya setiap panggilan res.json(payload) dibungkus
 *     dulu dengan session key YANG SAMA sebelum benar-benar dikirim
 */
async function payloadCrypto(req, res, next) {
  const sessionId = req.header('X-Session-Id');

  if (!sessionId) {
    return res.status(401).json({ error: 'session_missing', message: 'Header X-Session-Id wajib diisi. Lakukan handshake dulu.' });
  }

  const sessionKeyBase64 = await sessionStore.get(`sk:${sessionId}`);
  if (!sessionKeyBase64) {
    // Session sudah kedaluwarsa (atau tidak pernah ada). Balasan ini SENGAJA
    // tidak dienkripsi — server tidak lagi punya kunci untuk membungkusnya,
    // dan client memang butuh membaca status ini tanpa dekripsi supaya bisa
    // memicu handshake ulang secara otomatis (Fase 4).
    return res.status(401).json({ error: 'session_expired', message: 'Session key kedaluwarsa, lakukan handshake ulang.' });
  }

  const sessionKey = Buffer.from(sessionKeyBase64, 'base64');
  req.sessionId = sessionId;
  req.sessionKey = sessionKey;

  // ② Dekripsi body request, kalau ada.
  const body = req.body;
  const looksEncrypted = body && typeof body === 'object' &&
    typeof body.iv === 'string' && typeof body.data === 'string' && typeof body.tag === 'string';

  if (looksEncrypted) {
    try {
      req.body = open(sessionKey, body);
    } catch (err) {
      // Auth tag gagal diverifikasi -> ciphertext/tag berubah di jalan,
      // atau session key sudah tidak sinkron. Tolak, jangan ditebak-tebak.
      return res.status(400).json({ error: 'invalid_payload', message: 'Dekripsi/verifikasi gagal.' });
    }
  } else if (req.method !== 'GET' && req.method !== 'DELETE' && body && Object.keys(body).length > 0) {
    return res.status(400).json({ error: 'invalid_payload', message: 'Body request harus berupa envelope { iv, data, tag }.' });
  }

  // ① & ② Bungkus setiap res.json(...) dengan session key yang sama.
  const originalJson = res.json.bind(res);
  res.json = (payload) => originalJson(seal(sessionKey, payload));

  next();
}

module.exports = payloadCrypto;
