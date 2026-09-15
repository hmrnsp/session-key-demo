'use strict';

const crypto = require('crypto');

/**
 * Fase 1 ③ — hanya private key di server yang bisa membuka bungkusan ini.
 * Tidak ada salinan private key di aplikasi client mana pun.
 */
function unwrapSessionKey(privateKeyPem, wrappedKeyBase64) {
  return crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(wrappedKeyBase64, 'base64'),
  );
}

module.exports = { unwrapSessionKey };
