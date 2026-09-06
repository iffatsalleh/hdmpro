# Panduan Deployment Cloudways VPS & Cloudflare

Platform HDMPro dioptimumkan untuk dijalankan terus di atas **Cloudways VPS** (Node.js runtime + PostgreSQL) tanpa kebergantungan pada Vercel.

---

## 1. Topologi Infrastruktur

```text
Pengguna (Mobile / Desktop)
          ↓
      Cloudflare
  [SSL / DNS / WAF / CDN Cache]
          ↓
     Cloudways VPS
  [Nginx Reverse Proxy → PM2 Node.js Standalone]
          ↓
     PostgreSQL
  [Pangkalan Data Sumber Mutlak]
```

---

## 2. Langkah-Langkah Deployment

### A. Konfigurasi Fail Standalone
Next.js telah ditetapkan dengan `output: "standalone"` dalam `next.config.ts`.
Semasa proses `npm run build`, Next.js menghasilkan pakej mandiri minimum dalam `.next/standalone`.

### B. Menjalankan Melalui PM2
Fail `ecosystem.config.js` di akar projek dikonfigurasi untuk pengurusan kluster PM2:

```bash
# Mulakan perkhidmatan
pm2 start ecosystem.config.js

# Pastikan PM2 bermula semula automatik sekiranya server reboot
pm2 startup
pm2 save
```

### C. Pembolehubah Persekitaran di Server
Pastikan pembolehubah berikut dikonfigurasikan di dalam fail `.env` pada Cloudways VPS:
* `DATABASE_URL`
* `AUTH_SECRET`
* `NEXT_PUBLIC_APP_URL`
* `OPENAI_API_KEY`
* `STRIPE_SECRET_KEY`
* `STRIPE_WEBHOOK_SECRET`
* `BREVO_API_KEY`

---

## 3. Strategi Sandaran (Backup Strategy)
* Ambil kelebihan sistem sandaran automatik harian di Cloudways untuk pangkalan data PostgreSQL.
* Buat salinan berkala bagi fail `.env` dan aset media yang dimuat naik oleh pengguna.
