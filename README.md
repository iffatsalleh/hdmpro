# HDMPro — Hardcore Diet Mastery Pro

**HDMPro** bukan sekadar penjejak kalori biasa. Ia adalah platform penjejakan kemajuan diet berkuasa **AI Coach** yang direka khas mengikut metodologi **Hardcore Diet Mastery (HDM)**.

Pengguna boleh berinteraksi menggunakan bahasa harian santai (natural language), dan AI Coach akan mengesan niat (*intent*), menyemak konteks data pengguna, merujuk pangkalan ilmu RAG HDM, serta merekod maklumat makanan dan bacaan berat secara selamat ke dalam pangkalan data.

---

## 🛠️ Tech Stack & Seni Bina

* **Frontend & Backend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
* **Database & ORM**: PostgreSQL (Cloudways VPS) menggunakan **Prisma ORM**.
* **AI & RAG**: OpenAI API (`gpt-4o-mini`) dengan *Structured Tool Calling* + pangkalan pengetahuan RAG HDM dengan *auto-chunking*.
* **Autentikasi**: Auth.js / NextAuth v5 berasaskan JWT dan kredensial/email.
* **Pembayaran & Langganan**: Stripe Checkout & Webhooks untuk pengesahan automatik (*entitlements*).
* **Emel Transaksional**: Brevo API v3.
* **Analitik**: Google Analytics 4 & Microsoft Clarity (dengan perlindungan data kesihatan privasi).
* **PWA**: Web App Manifest & Service Worker untuk sokongan aplikasi mudah alih.
* **Hosting**: Dioptimumkan untuk **Cloudways VPS** (Node.js/PM2) di belakang **Cloudflare**.

---

## 📱 Struktur Navigasi Mudah Alih (Member Area)

1. **Dashboard** (`/dashboard`) — Ringkasan harian, baki sasaran kg, graf kemajuan, status kalori & protein, dan butang tindakan pantas.
2. **Coach** (`/coach`) — Sembang pintar AI Coach dengan keupayaan *tool calling* (rekod makanan, rekod berat, semak status).
3. **Progress** (`/progress`) — Graf trend berat badan 30 hari, purata mingguan, dan jumlah kg yang telah turun.
4. **Modul** (`/modul`) — Pusat pembelajaran modul HDM dengan penjejakan pelajaran siap (+25 XP).
5. **Rank** (`/rank`) — Sistem gamifikasi lejar transaksi XP, lencana pangkat (*Recruit* hingga *Master*), dan *leaderboard* komuniti.
6. **Langganan** (`/subscription`) — Pilihan keahlian bulanan dan tahunan dikuasakan oleh Stripe.
7. **Admin Knowledge** (`/admin/knowledge`) — Pengurusan pangkalan pengetahuan RAG untuk pentadbir.

---

## 🚀 Panduan Pembangunan Tempatan (Local Development)

### 1. Klon & Pasang Dependensi
```bash
git clone <repo-url>
cd "CODEX - hdm app"
npm install
```

### 2. Konfigurasi Pembolehubah Persekitaran (`.env`)
Salin `.env.example` ke `.env` dan kemas kini kunci rahsia:
```bash
cp .env.example .env
```

Nilai pembolehubah teras:
* `DATABASE_URL`: Sambungan PostgreSQL (contoh: `postgresql://user:password@localhost:5432/hdmpro?schema=public`)
* `AUTH_SECRET`: Kunci rahsia sesi NextAuth (boleh dijana via `openssl rand -hex 32`)
* `OPENAI_API_KEY`: Kunci API OpenAI untuk AI Coach & RAG
* `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`: Kunci pembayaran Stripe
* `BREVO_API_KEY`: Kunci API Brevo untuk emel transaksional

### 3. Migrasi & Seed Pangkalan Data
```bash
# Jana Prisma Client
npx prisma generate

# Tolak skema ke pangkalan data
npx prisma db push

# Masukkan data demo awal (pengguna, admin, modul)
npx tsx prisma/seed.ts
```

### 4. Jalankan Pelayan Pembangunan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada pelayar anda.

---

## ☁️ Panduan Deployment di Cloudways VPS

Aplikasi ini dibina dengan konfigurasi `output: "standalone"` dalam `next.config.ts`, menjadikannya amat ringan dan pantas untuk dijalankan di atas Cloudways VPS.

### 1. Persediaan di Cloudways Server
* Pasang **Node.js** (v20+ atau v22+) dan **PM2** pada server:
  ```bash
  npm install -g pm2
  ```
* Sediakan database PostgreSQL di Cloudways.

### 2. Build & Jalankan Aplikasi
```bash
# Bina projek
npm run build

# Salin fail statik ke folder standalone (jika belum automatik)
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Jalankan proses menggunakan PM2
pm2 start ecosystem.config.js
pm2 save
```

### 3. Konfigurasi Cloudflare
* Hala rekod DNS domain anda ke alamat IP Cloudways VPS.
* Dayakan mod SSL: **Full (Strict)**.
* Dayakan caching untuk aset statik (`/_next/static/*`).

---

## 🛡️ Keselamatan & Perlindungan Data
* **AI Tool Isolation**: AI tidak mempunyai akses kepada sebarang pertanyaan SQL bebas. Semua operasi data dihadkan melalui fungsi pelayan terkawal (*server-side functions*) yang mengesahkan identiti pengguna (`userId`).
* **Prompt Injection Defense**: Dokumen RAG dirawat sebagai bahan rujukan dan tidak boleh mengubah arahan teras sistem.
* **Privasi Kesihatan**: Data berat badan dan kalori peribadi ditapis daripada dihantar ke Google Analytics / Clarity.

---

## 📄 Dokumentasi Lanjutan
* [Seni Bina Sistem](docs/architecture.md)
* [Panduan Deployment Cloudways](docs/deployment-cloudways.md)
* [Spesifikasi AI Coach & RAG](docs/ai-coach.md)
