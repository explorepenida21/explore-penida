# 🏝️ PANDUAN HOSTING COMPLETE - EXPLORE PENIDA

## PRASYARAT

- [x] Akun Supabase (PostgreSQL) ✅
- [x] Akun CPanel Rumahweb
- [x] Domain terpasang di CPanel

---

## BAGIAN 1: SUPABASE (DATABASE)

### 1.1 Login Supabase
```
https://supabase.com
```
Login dengan GitHub/Email

### 1.2 Copy Connection String
1. Settings → Database
2. Connection String → URI → Copy

Contoh:
```
postgresql://postgres.xxxxx:password@aws-xx-xxxx.supabase.co:5432/postgres
```

---

## BAGIAN 2: BUILD DI LOCAL

### 2.1 Update .env.local
Buka file `.env.local` di project:

```env
# Database Supabase (PASTE connection string dari Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-xx-xxxx.supabase.co:5432/postgres"

# NextAuth (GENERATE SECRET BARU)
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://namadomain.com"

# App URL
NEXT_PUBLIC_APP_URL="https://namadomain.com"

# Midtrans (Production Mode)
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-KEY-DARI-MIDTRANS"
MIDTRANS_CLIENT_KEY="Mid-client-KEY-DARI-MIDTRANS"
MIDTRANS_WEBHOOK_URL="https://namadomain.com/api/payment/notification"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama-cloud-anda"

# Fonnte WhatsApp
FONNTE_TOKEN="TOKEN-FONNTE-ANDA"
ADMIN_WA_NUMBER="6281234567890"
```

### 2.2 Generate Secret Baru
Buka Terminal di komputer lokal:

```bash
# Windows (PowerShell)
openssl rand -base64 32

# Atau CMD
node -e "console.log(require('crypto').randomBytes(32).toString('base64')"
```

Copy hasilnya ke `NEXTAUTH_SECRET`

### 2.3 Push Database Schema
```bash
npx prisma db push
```

### 2.4 Build Aplikasi
```bash
npm run build
```

Tunggu selesai (5-10 menit)

---

## BAGIAN 3: PERSIAPAN UPLOAD

### 3.1 Buat Folder Deploy
Di komputer lokal:

1. Buat folder baru: `explore-penida-deploy`
2. Copy folder & file ini:
   - `app/`
   - `components/`
   - `lib/`
   - `messages/`
   - `prisma/`
   - `public/`
   - `node_modules/@prisma/` (hanya folder ini dari node_modules)
3. Copy file konfigurasi:
   - `next.config.js`
   - `i18n.ts`
   - `routing.ts`
   - `middleware.ts`
   - `package.json`
   - `package-lock.json`
   - `tailwind.config.ts`
   - `tsconfig.json`
   - `.env` (BUAT FILE .env DENGAN ISI YANG SAMA DENGAN .env.local)

### 3.2 Catat Isi .env untuk Server
Siapkan notepad dengan semua config:
```env
DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-xx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="HASIL_GENERATE_DARI_OPENSSL"
NEXTAUTH_URL="https://namadomain.com"
NEXT_PUBLIC_APP_URL="https://namadomain.com"
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-xxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxx"
MIDTRANS_WEBHOOK_URL="https://namadomain.com/api/payment/notification"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama-cloud"
FONNTE_TOKEN="token-fonnte"
ADMIN_WA_NUMBER="6281234567890"
```

---

## BAGIAN 4: UPLOAD KE CPANEL

### 4.1 Login CPanel
```
https://namadomain.com/cpanel
```

### 4.2 Upload File
1. **File Manager** → Home
2. Buat folder: `explore-penida`
3. Upload semua file dari folder deploy

### 4.3 Buat File .env
1. Klik **+ File**
2. Nama: `.env`
3. Paste isi config dari notepad
4. Save

---

## BAGIAN 5: INSTALL NODE.JS DI SERVER

### 5.1 Buka Terminal CPanel
**Advanced** → **Terminal**

### 5.2 Install Node.js (jika belum ada)
```bash
# Cek versi Node.js
node -v

# Kalau belum ada, install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18

# Verifikasi
node -v
npm -v
```

---

## BAGIAN 6: JALANKAN APLIKASI

### 6.1 Masuk Folder
```bash
cd explore-penida
ls -la
```

### 6.2 Install Dependencies
```bash
npm install --production
```

### 6.3 Generate Prisma
```bash
npx prisma generate
```

### 6.4 Install PM2
```bash
npm install -g pm2
```

### 6.5 Jalankan Aplikasi
```bash
# Hapus proses lama jika ada
pm2 delete explore-penida 2>/dev/null

# Jalankan dengan port 3001 (karena port 3000 sering dipakai CPanel)
PORT=3001 pm2 start npm --name "explore-penida" -- start

# Cek status
pm2 status
```

Kalau **online** = BERHASIL! 🎉

---

## BAGIAN 7: SETUP DOMAIN

### 7.1 Setup Reverse Proxy (Apache)
1. CPanel → **Apache Optimizer** atau edit **.htaccess**

Tambahkan di `.htaccess` di folder public_html:
```apache
RewriteEngine On
RewriteRule ^$ http://localhost:3001 [P,L]
RewriteCond %{REQUEST_URI} !^/api
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

### 7.2 Atau Gunakan Node.js App Manager
1. CPanel → **Setup Node.js App**
2. Create Application
   - Node.js version: 18.x
   - Application root: /home/USERNAME/explore-penida
   - App startup file: npm
   - Arguments: start
   - Environment: NODE_ENV=production
   - Port: 3001

### 7.3 DNS Settings
CPanel → **Zone Editor** atau **DNS**:
```
A     @     IP-SERVER-ANDA
A     www   IP-SERVER-ANDA
```

---

## BAGIAN 8: SSL CERTIFICATE

### 8.1 AutoSSL
CPanel → **SSL/TLS** → **Manage SSL Sites**
- Klik **Run AutoSSL** untuk domain Anda

### 8.2 Atau Manual
1. **SSL Certificates** → **Generate**
2. Pilih domain
3. AutoSSL akan otomatis install

---

## BAGIAN 9: KONFIGURASI WEBHOOK MIDTRANS

### 9.1 Login Midtrans Dashboard
```
https://dashboard.midtrans.com
```

### 9.2 Settings → Payment Notification
```
URL: https://namadomain.com/api/payment/notification
```

### 9.3 Snap Configuration
```
Finish URL: https://namadomain.com/id/booking/success
Unfinish URL: https://namadomain.com/id/booking
Error URL: https://namadomain.com/id/booking
```

---

## BAGIAN 10: TEST SEMUA FITUR

### 10.1 Homepage
```
https://namadomain.com
```

### 10.2 Admin Panel
```
https://namadomain.com/admin/login
```
Login dengan akun admin yang dibuat saat setup

### 10.3 Test Booking
1. Pilih paket tour
2. Isi form booking
3. Bayar dengan Midtrans
4. Cek admin panel → Booking masuk

### 10.4 Test WhatsApp Notification
Cek WhatsApp admin → Dapat pesan booking baru

---

## TROUBLESHOOTING

### Error: Port Already in Use
```bash
pm2 delete explore-penida
pkill -9 node
PORT=3002 pm2 start npm --name "explore-penida" -- start
```

### Error: Database Connection Failed
```bash
# Cek .env
cat .env | grep DATABASE

# Test koneksi
npx prisma db push
```

### Error: Module Not Found
```bash
npm install
npm run build
pm2 restart explore-penida
```

### Error: Port 80/443
Shared hosting tidak bisa akses port 80/443 langsung. Gunakan reverse proxy atau Node.js App Manager.

---

## BACKUP

### Database Supabase
1. Buka Supabase Dashboard
2. SQL Editor → New Query
3. Backup otomatis oleh Supabase

### File Aplikasi
```bash
cd ~/explore-penida
tar -czvf backup-$(date +%Y%m%d).tar.gz .
```

---

## UPDATE APLIKASI

### Local Update
1. Update kode di komputer lokal
2. Build ulang: `npm run build`
3. Upload folder `.next` & file yang berubah
4. Di server: `pm2 restart explore-penida`

---

## CONTACT INFO

- **Supabase**: https://supabase.com/support
- **Rumahweb**: https://rumahweb.co.id
- **Midtrans**: https://midtrans.com/support

---

**SELAMAT! Website Explore Penida Anda sudah online! 🏝️🎉**
