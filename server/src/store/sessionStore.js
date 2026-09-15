'use strict';

/**
 * Store session key, keyed `sk:<sessionId>`, dengan TTL — persis skema yang
 * dipakai di konsep asli (`redis.set('sk:<id>', key, 'EX', 1800)`).
 *
 * Implementasi di sini pakai in-memory Map supaya demo bisa jalan tanpa
 * infrastruktur tambahan. Untuk produksi / multi-instance, ganti isi file
 * ini dengan client Redis (mis. `ioredis`) — interface yang dipakai
 * middleware (`get`, `set`, `del`) sengaja dibuat sama dengan API Redis:
 *
 *   const Redis = require('ioredis');
 *   const redis = new Redis(process.env.REDIS_URL);
 *   module.exports = {
 *     async get(key) { return redis.get(key); },
 *     async set(key, value, ttlSeconds) { return redis.set(key, value, 'EX', ttlSeconds); },
 *     async del(key) { return redis.del(key); },
 *   };
 *
 * Tidak ada logika lain di luar file ini yang perlu berubah.
 */

const store = new Map(); // key -> { value, expiresAt, timer }

function set(key, value, ttlSeconds) {
  const existing = store.get(key);
  if (existing && existing.timer) clearTimeout(existing.timer);

  const timer = setTimeout(() => store.delete(key), ttlSeconds * 1000);
  if (typeof timer.unref === 'function') timer.unref();

  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
    timer,
  });
  return Promise.resolve('OK');
}

function get(key) {
  const entry = store.get(key);
  if (!entry) return Promise.resolve(null);
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return Promise.resolve(null);
  }
  return Promise.resolve(entry.value);
}

function del(key) {
  const entry = store.get(key);
  if (entry && entry.timer) clearTimeout(entry.timer);
  store.delete(key);
  return Promise.resolve(1);
}

module.exports = { get, set, del };
