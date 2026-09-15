'use strict';

const crypto = require('crypto');

/**
 * Layer auth aplikasi (siapa yang login), TERPISAH dari session key
 * transport (payloadCrypto). Sengaja dipisah supaya jelas: session key
 * mengamankan SALURANNYA, token ini mengamankan IDENTITASNYA — persis
 * seperti TLS + JWT di aplikasi nyata, hanya di sini disederhanakan jadi
 * token acak in-memory.
 */
const tokens = new Map(); // token -> userId

function issue(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  tokens.set(token, userId);
  return token;
}

function resolve(token) {
  return tokens.get(token) || null;
}

module.exports = { issue, resolve };
