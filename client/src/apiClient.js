'use strict';

const { SERVER_URL, SERVER_PUBLIC_KEY } = require('./config');
const { generateSessionKey, wrapSessionKey, seal, open } = require('./crypto/session');

/**
 * "Aplikasi" — pemegang state sesi. Session key & sessionId HANYA hidup di
 * memori proses ini (variabel biasa), tidak pernah ditulis ke disk — setara
 * larangan menyimpan ke Realm/AsyncStorage/SharedPreferences di konsep asli.
 */
class SessionClient {
  constructor(baseUrl = SERVER_URL) {
    this.baseUrl = baseUrl;
    this.sessionId = null;
    this.sessionKey = null; // Buffer, di memori saja
    this.expiresAt = 0;
  }

  isSessionFresh() {
    // beri jeda 2 detik supaya tidak mepet kedaluwarsa di tengah request
    return this.sessionKey && Date.now() < this.expiresAt - 2000;
  }

  /**
   * Fase 1 — Handshake. Dipanggil sekali saat start, dan otomatis lagi
   * setiap kali server bilang session_expired (Fase 4 — rotasi).
   *
   * `debug`, kalau diisi objek `{}`, diisi dengan apa yang sungguh dikirim
   * (`sent`, bungkusan RSA) dan diterima (`received`, balasan polos) —
   * dipakai UI demo untuk menampilkan Client vs Server di panel teknis.
   */
  async handshake({ debug } = {}) {
    const sessionKey = generateSessionKey(); // ①, di HP/di client
    const wrappedKey = wrapSessionKey(SERVER_PUBLIC_KEY, sessionKey); // ②

    const sentBody = { wrappedKey: wrappedKey.toString('base64') };
    if (debug) debug.sent = sentBody;

    const res = await fetch(`${this.baseUrl}/api/session/handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sentBody),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Handshake gagal (${res.status}): ${err.error || res.statusText}`);
    }

    const received = await res.json();
    if (debug) debug.received = received;

    const { sessionId, expiresIn } = received;
    this.sessionId = sessionId;
    this.sessionKey = sessionKey;
    this.expiresAt = Date.now() + expiresIn * 1000;

    return { sessionId, expiresIn };
  }

  async ensureSession() {
    if (!this.isSessionFresh()) {
      await this.handshake();
    }
  }

  /**
   * Fase 2 & 3 — request terenkripsi, response didekripsi. Kalau server
   * balas 401 session_expired, handshake ulang lalu ulangi SEKALI secara
   * transparan (Fase 4).
   *
   * `debug`, kalau diisi objek `{}`, akan diisi dengan apa yang sungguh
   * lewat kabel (wire) supaya bisa ditampilkan di UI demo.
   */
  async request(method, path, body, { debug, retry = true } = {}) {
    await this.ensureSession();

    const hasBody = body !== undefined && body !== null;
    const envelope = hasBody ? seal(this.sessionKey, body) : undefined;
    if (debug) debug.sent = envelope || null;

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': this.sessionId,
        ...(this.authToken ? { 'X-Auth-Token': this.authToken } : {}),
      },
      body: envelope ? JSON.stringify(envelope) : undefined,
    });

    const raw = await res.json().catch(() => ({}));

    if (res.status === 401 && raw.error === 'session_expired' && retry) {
      // Fase 4 — rotasi otomatis, transparan bagi pemanggil.
      await this.handshake();
      return this.request(method, path, body, { debug, retry: false });
    }

    if (!res.ok) {
      // Error dari middleware (session_missing/invalid_payload) datang
      // sebagai plaintext karena server tidak (lagi) punya kunci yang valid
      // untuk membungkusnya, atau memang sengaja tidak dibungkus.
      const err = new Error(raw.error || `Request gagal (${res.status})`);
      err.status = res.status;
      err.body = raw;
      throw err;
    }

    if (debug) debug.received = raw;

    const decrypted = open(this.sessionKey, raw);
    if (debug) debug.decrypted = decrypted;
    return decrypted;
  }

  setAuthToken(token) {
    this.authToken = token;
  }
}

module.exports = { SessionClient };
