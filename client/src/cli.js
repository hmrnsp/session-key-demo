'use strict';

const { SessionClient } = require('./apiClient');

// Bisa mencetak dua bentuk: envelope AES { iv, data, tag } untuk request
// biasa, dan objek handshake (public key / tanda tangan) apa adanya.
function printWire(label, value) {
  if (!value) {
    console.log(`  ${label}: (tidak ada body)`);
    return;
  }
  console.log(`  ${label}:`);
  if (value.iv && value.data && value.tag) {
    console.log(`    iv:   ${value.iv}`);
    console.log(`    data: ${value.data.slice(0, 48)}${value.data.length > 48 ? '…' : ''}`);
    console.log(`    tag:  ${value.tag}`);
    return;
  }
  const json = JSON.stringify(value, null, 2).split('\n').join('\n    ');
  console.log(`    ${json}`);
}

async function main() {
  const client = new SessionClient();

  console.log('=== Fase 0-1: handshake (X25519 ephemeral-ephemeral) ===');
  const hsDebug = {};
  const { sessionId, expiresIn } = await client.handshake({ debug: hsDebug });
  console.log('Yang dikirim (public key sementara — TIDAK ada kunci sesi):');
  printWire('sent', hsDebug.sent);
  console.log('Yang diterima (public key server + tanda tangan):');
  printWire('received', hsDebug.received);
  console.log('sessionId:', sessionId, `(berlaku ${expiresIn}s)`);
  console.log('Session key hasil hitungan X25519 (HANYA di memori, tidak pernah dikirim/ditulis ke disk):', client.sessionKey.toString('hex'));

  console.log('\n=== Fase 2-3: POST /api/auth/login ===');
  const loginDebug = {};
  const loginResult = await client.request('POST', '/api/auth/login', {
    username: 'demo',
    password: 'password123',
  }, { debug: loginDebug });

  console.log('Yang benar-benar lewat kabel (request):');
  printWire('sent', loginDebug.sent);
  console.log('Yang benar-benar lewat kabel (response):');
  printWire('received', loginDebug.received);
  console.log('Setelah didekripsi client:', loginResult);

  client.setAuthToken(loginResult.token);

  console.log('\n=== Fase 2-3: GET /api/profile ===');
  const profileDebug = {};
  const profile = await client.request('GET', '/api/profile', undefined, { debug: profileDebug });
  console.log('Yang benar-benar lewat kabel (response):');
  printWire('received', profileDebug.received);
  console.log('Setelah didekripsi client:', profile);

  console.log('\nSelesai. Coba jalankan lagi setelah SESSION_TTL_SECONDS habis');
  console.log('(set kecil di server/.env) untuk melihat handshake otomatis ulang.');
}

main().catch((err) => {
  console.error('\nGagal:', err.message);
  process.exitCode = 1;
});
