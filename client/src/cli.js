'use strict';

const { SessionClient } = require('./apiClient');

function printWire(label, envelope) {
  if (!envelope) {
    console.log(`  ${label}: (tidak ada body)`);
    return;
  }
  console.log(`  ${label}:`);
  console.log(`    iv:   ${envelope.iv}`);
  console.log(`    data: ${envelope.data.slice(0, 48)}${envelope.data.length > 48 ? '…' : ''}`);
  console.log(`    tag:  ${envelope.tag}`);
}

async function main() {
  const client = new SessionClient();

  console.log('=== Fase 0-1: handshake ===');
  const { sessionId, expiresIn } = await client.handshake();
  console.log('sessionId:', sessionId, `(berlaku ${expiresIn}s)`);
  console.log('session key (HANYA di memori, tidak pernah ditulis ke disk):', client.sessionKey.toString('hex'));

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
