"use strict";

const express = require("express");
const cors = require("cors");
const config = require("./config");

const handshakeRoute = require("./routes/handshake");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const payloadCrypto = require("./middleware/payloadCrypto");

const app = express();
// app.use(cors({ origin: config.CLIENT_ORIGIN }));

// Public, tidak dienkripsi: health check dan handshake itu sendiri
// (handshake tidak bisa dienkripsi AES karena session key-nya belum ada).
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/session", handshakeRoute);

// Semua route "bisnis" di bawah ini lewat payloadCrypto dulu:
// body request didekripsi sebelum masuk controller, dan res.json(...)
// otomatis dienkripsi lagi sebelum benar-benar dikirim.
//
// Logger ini SENGAJA dipasang SEBELUM payloadCrypto — supaya mencetak body
// PERSIS seperti yang diterima dari kabel, sebelum sempat didekripsi.
// Buka terminal server ini saat login dari UI client untuk membuktikan
// bahwa yang sampai ke sini memang { iv, data, tag } acak, bukan
// { username, password } polos.
app.use(
  "/api",
  express.json({ limit: "1mb" }),
  (req, res, next) => {
    if (req.method !== "GET" && req.method !== "DELETE") {
      console.log(
        `[wire-in] ${req.method} ${req.originalUrl} body mentah dari kabel:`,
        req.body,
      );
    }
    next();
  },
  payloadCrypto,
);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

app.use((req, res) => res.status(404).json({ error: "not_found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(config.PORT, () => {
  console.log(`[server] listening on http://localhost:${config.PORT}`);
  console.log(`[server] session TTL: ${config.SESSION_TTL_SECONDS}s`);
});
