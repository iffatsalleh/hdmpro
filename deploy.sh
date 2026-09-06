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
npx pm2 restart all
echo "=== Kemas Kini Selesai & Aplikasi Live! ==="
