'use strict';

const bcrypt = require('bcryptjs');

/**
 * Dummy user store untuk demo. Password di-hash terlepas total dari layer
 * enkripsi payload (payloadCrypto) — dua hal berbeda yang sengaja dipisah:
 * payloadCrypto melindungi data DI JALAN (transport), hashing melindungi
 * password DI PENYIMPANAN (at rest). Di produksi pakai Argon2id, bukan
 * bcrypt — bcrypt dipakai di sini semata supaya demo bisa `npm install`
 * tanpa toolchain native.
 */
const users = [
  {
    id: 'u_1',
    username: 'demo',
    passwordHash: bcrypt.hashSync('password123', 10),
    balance: 1250000,
  },
];

function findByUsername(username) {
  return users.find((u) => u.username === username) || null;
}

function findById(id) {
  return users.find((u) => u.id === id) || null;
}

function verifyPassword(user, plainPassword) {
  return bcrypt.compareSync(plainPassword, user.passwordHash);
}

module.exports = { findByUsername, findById, verifyPassword };
