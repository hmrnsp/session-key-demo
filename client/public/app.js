'use strict';

const dot = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const statusMeta = document.getElementById('statusMeta');
const log = document.getElementById('log');

// Diagram alur mini per aksi — 🔒 menandai langkah yang datanya terkunci.
const HANDSHAKE_FLOW =
  `<span class="who app">Client</span> <span class="arrow">🔒→</span> <span class="who srv">Server</span>: kirim kunci sesi terbungkus<br>` +
  `<span class="who srv">Server</span> <span class="arrow">→</span> <span class="who app">Client</span>: balas ID sesi`;

const LOGIN_FLOW =
  `<span class="who app">Client</span> <span class="arrow">🔒→</span> <span class="who srv">Server</span>: username &amp; password (terkunci)<br>` +
  `<span class="who srv">Server</span> <span class="arrow">🔒→</span> <span class="who app">Client</span>: token akses (terkunci)`;

const PROFILE_FLOW =
  `<span class="who app">Client</span> <span class="arrow">→</span> <span class="who srv">Server</span>: minta profil (tanpa data rahasia)<br>` +
  `<span class="who srv">Server</span> <span class="arrow">🔒→</span> <span class="who app">Client</span>: data profil (terkunci)`;

// Header kartu "dikirim" — beda mekanisme kripto antara Handshake (RSA,
// sekali) dan Login/Profile (AES, tiap pesan), jadi labelnya sengaja beda.
const SENT_HEADER_AES =
  `<span class="who app">Client</span> <span class="arrow">→</span> <span class="who srv">Server</span> · 🔒 Terenkripsi (tidak terbaca)`;
const SENT_HEADER_RSA =
  `<span class="who app">Client</span> <span class="arrow">→</span> <span class="who srv">Server</span> · 🔒 Kunci sesi dibungkus RSA (tidak terbaca)`;

async function refreshStatus() {
  const res = await fetch('/demo/status');
  const s = await res.json();
  dot.classList.toggle('on', s.hasSession);
  if (s.hasSession) {
    const minutesLeft = Math.max(0, Math.round((s.expiresAt - Date.now()) / 60000));
    statusText.textContent = `Sesi aman aktif, berakhir dalam ±${minutesLeft} menit`;
    statusMeta.textContent = `sessionId ${s.sessionId} • kedaluwarsa ${new Date(s.expiresAt).toLocaleTimeString()}`;
  } else {
    statusText.textContent = 'Belum ada sesi aman — klik "Handshake" untuk mulai';
    statusMeta.textContent = '';
  }
}

// entry(title, { summary, flow, technical, isError }) — satu titik di timeline:
// header (nama aksi + jam, titik status hijau/merah di garis kiri), lalu
// ringkasan bahasa manusia, lalu diagram alur (opsional), lalu detail teknis
// (JSON mentah) disembunyikan di balik <details> supaya tidak jadi fokus utama.
function entry(title, { summary = '', flow = '', technical = '', isError = false } = {}) {
  const el = document.createElement('div');
  el.className = `entry status-${isError ? 'err' : 'ok'}`;
  const time = new Date().toLocaleTimeString();
  el.innerHTML =
    `<div class="entry-head"><span class="tag">${title}</span><span class="time">${time}</span></div>` +
    (summary ? `<p class="summary${isError ? ' err' : ''}">${summary}</p>` : '') +
    (flow ? `<div class="flow">${flow}</div>` : '') +
    (technical ? `<details class="tech-toggle"><summary>Lihat detail teknis</summary>${technical}</details>` : '');
  log.prepend(el);
}

// Kartu perbandingan "terenkripsi" vs "setelah dibuka" — hanya untuk kasus
// sukses, di mana `decrypted` selalu ada. `wire.sent` bisa kosong (mis. GET
// /demo/profile tidak punya body), makanya blok "sent" dirender kondisional.
function technicalCards(wire, decrypted) {
  const sentBlock = wire && wire.sent
    ? `<div class="card wire"><h3>${SENT_HEADER_AES}</h3><pre>${JSON.stringify(wire.sent, null, 2)}</pre></div>`
    : '';
  const receivedBlock = wire && wire.received
    ? `<div class="card wire"><h3><span class="who srv">Server</span> <span class="arrow">→</span> <span class="who app">Client</span> · 🔒 Terenkripsi (tidak terbaca)</h3><pre>${JSON.stringify(wire.received, null, 2)}</pre></div>`
    : '';
  const plainBlock = `<div class="card plain"><h3><span class="who app">Client</span> · 🔓 Setelah dibuka (bisa terbaca)</h3><pre>${JSON.stringify(decrypted, null, 2)}</pre></div>`;
  return `<div class="grid">${sentBlock}${receivedBlock}${plainBlock}</div>`;
}

// Untuk kasus gagal: `wire.received`/`decrypted` tidak pernah terisi (proses
// berhenti sebelum sampai situ), jadi dirender terpisah dari technicalCards()
// supaya tidak muncul teks "undefined" di layar. `sentHeader` dioper beda
// untuk Handshake (RSA) vs Login/Profile (AES) — lihat pemanggilnya.
function errorTechnical(body, sentHeader = SENT_HEADER_AES) {
  const sentBlock = body.wire && body.wire.sent
    ? `<div class="card wire"><h3>${sentHeader}</h3><pre>${JSON.stringify(body.wire.sent, null, 2)}</pre></div>`
    : '';
  const errorBlock = `<div class="card"><h3>⚠️ Respons error</h3><pre>${JSON.stringify({ error: body.error }, null, 2)}</pre></div>`;
  return `<div class="grid">${sentBlock}${errorBlock}</div>`;
}

// Handshake TIDAK memakai AES (session key-nya belum ada) — yang dikirim
// dibungkus RSA-OAEP, dan balasannya sengaja polos (sessionId bukan
// rahasia). Kartu ini dipisah dari technicalCards() supaya labelnya jujur,
// bukan "terenkripsi/dekripsi" seperti Login/Profile.
function handshakeTechnicalCards(wire, sessionKeyPreview) {
  const sentBlock = wire && wire.sent
    ? `<div class="card wire"><h3>${SENT_HEADER_RSA}</h3><pre>${JSON.stringify(wire.sent, null, 2)}</pre></div>`
    : '';
  const receivedBlock = wire && wire.received
    ? `<div class="card plain"><h3><span class="who srv">Server</span> <span class="arrow">→</span> <span class="who app">Client</span> · ✅ Balasan (memang tidak dienkripsi)</h3><pre>${JSON.stringify(wire.received, null, 2)}</pre></div>`
    : '';
  const keyBlock = sessionKeyPreview
    ? `<div class="card local"><h3><span class="who app">Client</span> · 🔑 Kunci sesi asli (hanya di memori, tak pernah dikirim utuh)</h3><pre>${sessionKeyPreview}</pre></div>`
    : '';
  return `<div class="grid">${sentBlock}${receivedBlock}${keyBlock}</div>`;
}

async function call(url, opts) {
  const res = await fetch(url, opts);
  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}

document.getElementById('btnHandshake').addEventListener('click', async () => {
  const { ok, body } = await call('/demo/handshake', { method: 'POST' });
  if (!ok) {
    entry('Handshake', {
      summary: `❌ Handshake gagal: ${body.error}`,
      isError: true,
      technical: errorTechnical(body, SENT_HEADER_RSA),
    });
  } else {
    const minutes = Math.round(body.expiresIn / 60);
    entry('Handshake', {
      summary: `🔑 Kunci sesi baru berhasil dibuat, berlaku ±${minutes} menit.`,
      flow: HANDSHAKE_FLOW,
      technical: handshakeTechnicalCards(body.wire, body.sessionKeyPreview),
    });
  }
  refreshStatus();
});

document.getElementById('btnLogin').addEventListener('click', async () => {
  const { ok, body } = await call('/demo/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'demo', password: 'password123' }),
  });
  if (!ok) {
    entry('Login', {
      summary: `❌ Login gagal: ${body.error}`,
      isError: true,
      flow: LOGIN_FLOW,
      technical: errorTechnical(body),
    });
  } else {
    entry('Login', {
      summary: '🔓 Berhasil login. Server mengirim token akses yang tersimpan otomatis untuk request berikutnya.',
      flow: LOGIN_FLOW,
      technical: technicalCards(body.wire, body.decrypted),
    });
  }
  refreshStatus();
});

document.getElementById('btnProfile').addEventListener('click', async () => {
  const { ok, body } = await call('/demo/profile');
  if (!ok) {
    entry('Get Profile', {
      summary: `❌ Ambil profil gagal: ${body.error}`,
      isError: true,
      flow: PROFILE_FLOW,
      technical: errorTechnical(body),
    });
  } else {
    entry('Get Profile', {
      summary: '🔓 Berhasil mengambil data profil dari server.',
      flow: PROFILE_FLOW,
      technical: technicalCards(body.wire, body.decrypted),
    });
  }
  refreshStatus();
});

refreshStatus();
