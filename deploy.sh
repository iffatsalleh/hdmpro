#!/bin/bash
echo "=== Memulakan Kemas Kini HDMPro ==="
git config --global --add safe.directory "*"
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/.env 2>/dev/null || true
npx pm2 delete hdmpro 2>/dev/null || true
npx pm2 start ecosystem.config.js
npx pm2 save
echo "=== Kemas Kini Selesai & Aplikasi Live! ==="
