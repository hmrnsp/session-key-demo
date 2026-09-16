export const IDENTITY = {
  nasabah: "Rani",
  nasabahRole: "Nasabah",
  bank: "Bank Aman",
  bankRole: "Core Banking",
  hacker: "Penyerang",
  username: "demo",
  password: "password123",
  maskedPassword: "••••••••••••",
  balance: "Rp1.250.000",
  account: "•••• 4821",
  token: "a7f3…9c21",
} as const;

export const WIRE_TEXT = {
  plainLogin: "{ username, password }",
  cipherEnvelope: "{ iv, data, tag }",
  garbled: "xT7f9Kq2b1Zem4Qp8Rv0…",
} as const;

export const COPY = {
  intro: {
    kicker: "KEAMANAN TRANSAKSI",
    title: "Bagaimana data Anda tetap aman saat dikirim ke bank?",
    hint: "Satu perjalanan data. Tiga pihak. Enam puluh detik.",
  },
  masalah: {
    title: "Data di jaringan bisa dibaca siapa saja",
    subtitle: "Tanpa pelindung, password dan saldo terkirim polos di atas kabel.",
  },
  ideBesar: {
    title: "Bungkus semua data dengan kunci sesi",
    publicKey: "Gembok publik",
    publicKeyHint: "Boleh dipegang siapa saja — hanya bisa mengunci",
    sessionKey: "Kunci rahasia",
    sessionKeyHint: "Hanya ada di HP dan di bank",
  },
  persiapan: {
    title: "Hanya bank yang punya anak kunci",
    step1: "Bank membuat sepasang kunci",
    step2: "Gembok publik ditanam di aplikasi",
    privateKey: "Anak kunci (private key)",
    neverLeaves: "Tidak pernah keluar dari bank",
  },
  handshake: {
    title: "Kunci rahasia dikirim dalam kotak terkunci",
    step1: "HP membuat kunci rahasia baru",
    step2: "Dibungkus dengan gembok publik",
    step3: "Bank membuka dengan anak kunci",
    received: "sessionId diterima — sesi resmi terbuka",
  },
  login: {
    title: "Password tidak pernah terlihat di jalan",
    wireLabel: "Yang lewat kabel",
    readLabel: "Yang dibaca bank",
    sent: "Password dikunci jadi kode acak",
  },
  profil: {
    title: "Saldo ikut terlindungi, dua arah",
    subtitle: "Arah balik memakai kunci rahasia yang sama.",
    balanceLabel: "Saldo Anda",
  },
  sadap: {
    title: "Penyadap hanya mendapat kode acak",
    onWire: "Di kabel",
    readable: "Terbaca aplikasi",
    hackerLine: "Tidak ada yang bisa dibaca.",
  },
  ubahIsi: {
    title: "Kalau data diubah, segel rusak — ditolak",
    tagLabel: "Segel (auth tag)",
    tampered: "Segel tidak cocok",
    rejected: "Ditolak: invalid_payload",
  },
  kedaluwarsa: {
    title: "Kunci lama habis, HP ganti kunci otomatis",
    expired: "401 session_expired",
    rehandshake: "Handshake ulang",
    silent: "Nasabah tidak merasa apa-apa",
  },
  penutup: {
    title: "Rahasia tetap rahasia, dari HP sampai core banking",
    recap1: "Handshake sekali",
    recap2: "Kunci sesi dua arah",
    recap3: "Segel menolak perubahan",
    footer: "Session Key Demo — RSA-OAEP + AES-256-GCM",
  },
} as const;
