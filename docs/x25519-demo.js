'use strict';

/**
 * ============================================================================
 * DEMO HANDSHAKE SEDERHANA: X25519 + tanda tangan RSA
 * ============================================================================
 *
 * Menjelaskan:
 *   1. Kenapa client perlu MENANAM kunci publik server (trust anchor).
 *   2. Apa persisnya yang dikirim client ke server, dan sebaliknya.
 *   3. Bagaimana kedua sisi menghasilkan KUNCI SESI yang sama.
 *
 * Jalankan:
 *   node docs/x25519-demo.js
 */

const crypto = require('crypto');

function line() {
  console.log('-'.repeat(64));
}
function show(obj) {
  console.log(JSON.stringify(obj, null, 2).split('\n').map((l) => '   ' + l).join('\n'));
}
function fingerprint(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 32);
}

// ===========================================================================
// 0. PERSIAPAN (sekali, sebelum aplikasi dirilis)
// ===========================================================================
line();
console.log('0. PERSIAPAN: server punya kunci RSA jangka panjang');
line();

const serverRsa = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // kode asli 3072; 2048 cukup & lebih cepat untuk demo
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// PENTING:
//  - private key HANYA di server, tidak pernah keluar.
//  - public key DISERAHKAN ke tim client dan DITANAM di aplikasi saat build
//    (hardcode), BUKAN diunduh saat runtime.
const SERVER_PRIVATE_KEY = serverRsa.privateKey; // rahasia server
const SERVER_PUBLIC_KEY = serverRsa.publicKey; // "ditanam" di client

console.log('   a) SERVER membuat keypair RSA:');
console.log('      - private key : disimpan di server, tidak pernah keluar');
console.log('      - public key  : diserahkan ke tim client');
console.log('');
console.log('   b) CLIENT menanam public key server saat build (hardcode),');
console.log('      bukan diunduh dari internet. Ini berfungsi sebagai "contoh stempel asli".');
console.log('      Isi kunci yang ditanam (PEM, dipotong):');
SERVER_PUBLIC_KEY.split('\n').slice(0, 2).forEach((l) => console.log('        ' + l));
console.log('        ... (dipotong)');
console.log('      SHA-256 fingerprint: ' + fingerprint(SERVER_PUBLIC_KEY));
console.log('');
console.log('   c) Kegunaannya nanti (langkah 5): memverifikasi TANDA TANGAN server,');
console.log('      supaya client yakin balasan benar dari server asli, bukan penyadap.');

// ===========================================================================
// 1. CLIENT membuat keypair X25519 sekali pakai
// ===========================================================================
line();
console.log('1. CLIENT membuat keypair X25519 sekali pakai');
line();

const client = crypto.generateKeyPairSync('x25519');
const clientPublicJwk = client.publicKey.export({ format: 'jwk' }); // -> JSON

console.log('   client privat : <rahasia, tetap di memori client>');
console.log('   client publik : ' + JSON.stringify(clientPublicJwk));

// ===========================================================================
// 2. YANG DIKIRIM CLIENT
// ===========================================================================
line();
console.log('2. YANG DIKIRIM CLIENT   (CLIENT -> SERVER)');
line();

const clientMessage = { clientPublicKey: clientPublicJwk };
show(clientMessage);
console.log('   Isinya cuma kunci PUBLIK, jadi aman walau disadap di jalan.');

// ===========================================================================
// 3. SERVER memproses dan menyiapkan balasan
// ===========================================================================
line();
console.log('3. SERVER memproses dan membuat balasan');
line();

const clientPub = crypto.createPublicKey({ key: clientPublicJwk, format: 'jwk' });
const server = crypto.generateKeyPairSync('x25519');
const serverPublicJwk = server.publicKey.export({ format: 'jwk' });
const sessionId = crypto.randomUUID();

// Transcript = data yang ditandatangani. Urutannya tetap, jadi kedua sisi
// bisa menyusunnya sama persis.
const transcript = Buffer.from(
  'handshake-v1\n' + clientPublicJwk.x + '\n' + serverPublicJwk.x,
  'utf8',
);

// Rahasia bersama (sekarang belum dilewatkan HKDF supaya sederhana).
const serverShared = crypto.diffieHellman({
  privateKey: server.privateKey,
  publicKey: clientPub,
});

// Tanda tangan transcript dengan kunci RSA privat server.
const signature = crypto.sign('sha256', transcript, {
  key: SERVER_PRIVATE_KEY,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
});

console.log('   - server membuat keypair X25519 miliknya sendiri');
console.log('   - sessionId     = ' + sessionId);
console.log('   - transcript    = "handshake-v1\\n<client.x>\\n<server.x>"');
console.log('   - shared secret = ' + serverShared.toString('hex'));
console.log('   - signature     = <RSA atas transcript, ' + signature.length + ' byte>');

// ===========================================================================
// 4. YANG DIKIRIM SERVER
// ===========================================================================
line();
console.log('4. YANG DIKIRIM SERVER   (SERVER -> CLIENT)');
line();

const serverMessage = {
  sessionId,
  serverPublicKey: serverPublicJwk,
  signature: signature.toString('base64'),
};
show(serverMessage);
console.log('   Perhatikan: KUNCI SESI TIDAK ADA di sini — hanya kunci publik + tanda tangan.');

// ===========================================================================
// 5. CLIENT memverifikasi dengan kunci yang ditanam, lalu menghitung kunci sesi
// ===========================================================================
line();
console.log('5. CLIENT memverifikasi memakai KUNCI YANG DITANAM');
line();

const clientTranscript = Buffer.from(
  'handshake-v1\n' + clientPublicJwk.x + '\n' + serverMessage.serverPublicKey.x,
  'utf8',
);

const valid = crypto.verify(
  'sha256',
  clientTranscript,
  {
    key: SERVER_PUBLIC_KEY, // <-- kunci publik yang ditanam di aplikasi
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  },
  Buffer.from(serverMessage.signature, 'base64'),
);

console.log('   - client menyusun transcript yang sama');
console.log('   - verify(transcript, signature, SERVER_PUBLIC_KEY) = ' + valid);
if (!valid) {
  throw new Error('Tanda tangan server tidak valid — handshake dibatalkan (kemungkinan MITM).');
}
console.log('     -> cocok: balasan benar dari server asli.');

const serverPub = crypto.createPublicKey({ key: serverMessage.serverPublicKey, format: 'jwk' });
const clientShared = crypto.diffieHellman({
  privateKey: client.privateKey,
  publicKey: serverPub,
});

console.log('   - client menghitung shared secret = ' + clientShared.toString('hex'));

// ===========================================================================
// 6. HASIL
// ===========================================================================
line();
console.log('6. HASIL');
line();

console.log('   client shared : ' + clientShared.toString('hex'));
console.log('   server shared : ' + serverShared.toString('hex'));
console.log('   sama?         : ' + clientShared.equals(serverShared));
console.log('');
console.log('   Ringkasan:');
console.log('   - Kunci sesi dihitung di dua sisi, TIDAK pernah dikirim.');
console.log('   - Kunci publik server yang ditanam dipakai untuk memverifikasi');
console.log('     tanda tangan, memastikan balasan dari server asli (bukan MITM).');
console.log('   - Di proyek asli, hasil X25519 dilewatkan HKDF lebih dulu:');
console.log("       sessionKey = hkdf(shared, salt=sessionId, info=transcript)");
