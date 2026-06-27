# 🏝️ PANDUAN HOSTING EXPLORE PENIDA DI CPANEL RUMAHWEB
## (LANGKAH LENGKAP & DETAIL)

---

# SEBELUM MULAI

## Yang Harus Disiapkan:

### A. Akun Supabase (Database PostgreSQL)
- [ ] Buka https://supabase.com
- [ ] Login dengan GitHub/Email
- [ ] Buat project baru
- [ ] Buka Settings → Database → Copy Connection URI

### B. Akun Midtrans (Payment Gateway)
- [ ] Buka https://dashboard.midtrans.com
- [ ] Dapatkan Server Key & Client Key

### C. Akun Cloudinary (Upload Gambar)
- [ ] Buka https://cloudinary.com
- [ ] Dapatkan Cloud Name, API Key, API Secret

### D. Akun Fonnte (WhatsApp Notification)
- [ ] Buka https://fonnte.com
- [ ] Dapatkan Token

---

# BAGIAN 1: BUILD APLIKASI DI KOMPUTER LOKAL

## STEP 1.1: Update File .env.local

Buka file `.env.local` di project Anda, PASTIKAN isinya:

```env
# DATABASE - PASTE URI SUPABASE ANDA
DATABASE_URL="postgresql://postgres.xxxxx:ISI_PASSWORD@aws-xx-xxxx.supabase.co:5432/postgres"

# NEXTAUTH - GENERATE SECRET BARU
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://namadomain.com"

# APP URL
NEXT_PUBLIC_APP_URL="https://namadomain.com"

# MIDTRANS - PRODUCTION
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-ISI_KEY_DARI_MIDTRANS"
MIDTRANS_CLIENT_KEY="Mid-client-ISI_KEY_DARI_MIDTRANS"
MIDTRANS_WEBHOOK_URL="https://namadomain.com/api/payment/notification"

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama-cloud-anda"

# FONNTE
FONNTE_TOKEN="token-fonnte-anda"
ADMIN_WA_NUMBER="6281234567890"
```

SAVE file .env.local

---

## STEP 1.2: Generate NEXTAUTH_SECRET

Buka Terminal/CMD di komputer lokal:

```bash
# Generate secret baru
openssl rand -base64 32
```

COPY hasilnya, PASTE ke file .env.local baris NEXTAUTH_SECRET

---

## STEP 1.3: Push Database Schema

Di Terminal lokal:

```bash
npx prisma generate
```

Tunggu sampai selesai

---

## STEP 1.4: Push Tabel ke Supabase

```bash
npx prisma db push
```

Harus keluar pesan:
```
✅ Successfully created database schema.
```

---

## STEP 1.5: Build Aplikasi

```bash
npm run build
```

Tunggu 5-10 menit sampai keluar pesan:
```
✓ Done
```

---

## STEP 1.6: Buat File .env untuk Server

Di File Explorer Windows, buat file baru bernama `.env` (tanpa .txt)

ISI FILE .env DENGAN:

```env
# DATABASE - GANTI DENGAN URI SUPABASE ANDA
DATABASE_URL="postgresql://postgres.xxxxx:ISI_PASSWORD@aws-xx-xxxx.supabase.co:5432/postgres"

# NEXTAUTH - PASTE HASIL GENERATE SEBELUMNYA
NEXTAUTH_SECRET="HASIL_GENERATE_OPENSSL"
NEXTAUTH_URL="https://namadomain.com"

# APP URL
NEXT_PUBLIC_APP_URL="https://namadomain.com"

# MIDTRANS - PRODUCTION MODE
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-ISI_KEY_MIDTRANS"
MIDTRANS_CLIENT_KEY="Mid-client-ISI_KEY_MIDTRANS"
MIDTRANS_WEBHOOK_URL="https://namadomain.com/api/payment/notification"

# CLOUDINARY - GANTI DENGAN DATA ANDA
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama-cloud-anda"

# FONNTE - GANTI DENGAN TOKEN ANDA
FONNTE_TOKEN="token-fonnte-anda"
ADMIN_WA_NUMBER="6281234567890"
```

SAVE file .env ini, SIMPAN di folder yang berbeda dari project (nanti upload terpisah)

---

# BAGIAN 2: UPLOAD FILE KE CPANEL

## STEP 2.1: Login CPanel

1. Buka browser
2. Ketik: https://namadomain.com/cpanel
3. Masukkan Username & Password dari email Rumahweb
4. Klik LOGIN

---

## STEP 2.2: Buat Folder untuk Aplikasi

1. Di CPanel, cari **Files** → **File Manager**
2. Klik **Home** di sidebar kiri
3. Klik **+ Folder** di toolbar atas
4. Nama folder: `explore-penida`
5. Klik **Create New Folder**

---

## STEP 2.3: Upload File Aplikasi

1. Klik folder `explore-penida`
2. Klik **Upload** di toolbar atas
3. Browser file picker terbuka
4. Upload folder `app`, `components`, `lib`, `messages`, `prisma`, `public`
5. Upload juga folder `node_modules/@prisma` (hanya folder ini dari node_modules)
6. Upload file konfigurasi:
   - `next.config.js`
   - `i18n.ts`
   - `routing.ts`
   - `middleware.ts`
   - `package.json`
   - `package-lock.json`
   - `tailwind.config.ts`
   - `tsconfig.json`

Tunggu upload selesai (bisa 10-20 menit tergantung koneksi)

---

## STEP 2.4: Upload File .env

1. Setelah upload selesai, di folder `explore-penida`
2. Klik **+ File** di toolbar atas
3. Nama file: `.env`
4. Paste isi file .env yang dibuat di STEP 1.6
5. Klik **Create New File**
6. Klik **Save Changes**

---

# BAGIAN 3: SETUP NODE.JS APP DI CPANEL

## STEP 3.1: Buka Setup Node.js App

1. Di sidebar CPanel, cari **Software**
2. Klik **Setup Node.js App**
3. Halaman Node.js App Manager terbuka

---

## STEP 3.2: Buat Application Baru

1. Klik tombol **CREATE APPLICATION**
2. Formulir terbuka

---

## STEP 3.3: Isi Formulir CREATE APPLICATION

### Node.js version:
```
Pilih: 18.x (atau 20.x)
```

### Application root:
```
/home/USERNAME/explore-penida
```
(GANTI USERNAME dengan username CPanel Anda, contoh: /home/peng4368/explore-penida)

### Application startup file:
```
npm
```

### Application arguments:
```
start
```

### Environment variables: (kosongkan saja)

### Log file:
```
logs/error.log
```

### Klik tombol: **CREATE**

---

## STEP 3.4: Tunggu Proses Setup

Akan keluar pesan:
```
Creating application...
```

Tunggu sampai selesai (1-2 menit)

---

# BAGIAN 4: KONFIGURASI LEBIH LANJUT

## STEP 4.1: Edit Application

1. Di halaman Node.js App Manager
2. Akan muncul aplikasi baru Anda
3. Klik tombol **EDIT** di sebelah nama aplikasi

---

## STEP 4.2: Edit Konfigurasi

Pastikan semua field terisi dengan benar:

### Node.js version:
```
18.x
```

### Application root:
```
/home/USERNAME/explore-penida
```

### Application startup file:
```
npm
```

### Application arguments:
```
start
```

### Environment variables:
```
NODE_ENV=production
```

### Klik tombol: **UPDATE**

---

## STEP 4.3: Cek Status

Setelah update, cek kolom **Status** harus **running** (berwarna hijau)

Kalau **stopped**, klik tombol **START**

---

# BAGIAN 5: TERMINAL - GENERATE & BUILD

## STEP 5.1: Buka Terminal

1. Di sidebar CPanel
2. Cari **Advanced**
3. Klik **Terminal**
4. Klik **I Understand and Proceed**

---

## STEP 5.2: Masuk ke Folder Aplikasi

```bash
cd explore-penida
```

Tekan ENTER

---

## STEP 5.3: Generate Prisma Client

```bash
npx prisma generate
```

Tunggu sampai selesai

---

## STEP 5.4: Install Dependencies

```bash
npm install --production
```

Tunggu sampai selesai (bisa 5-10 menit)

---

## STEP 5.5: Generate Secret untuk NEXTAUTH

```bash
openssl rand -base64 32
```

COPY hasilnya (整个人 string base64)

---

## STEP 5.6: Edit File .env

```bash
nano .env
```

1. Cari baris `NEXTAUTH_SECRET=`
2. PASTE hasil generate tadi
3. SAVE: Tekan `Ctrl + X`
4. Tekan `Y`
5. Tekan `ENTER`

---

## STEP 5.7: Test Jalan Tidaknya

```bash
npm start
```

Tunggu 1 menit, lalu buka browser baru:

```
http://namadomain.com:3000
```

Kalau keluar website = BERHASIL! Tekan `Ctrl + C` untuk stop sementara

---

## STEP 5.8: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

---

## STEP 5.9: Jalankan dengan PM2

```bash
pm2 start npm --name "explore-penida" -- start
```

---

## STEP 5.10: Cek Status PM2

```bash
pm2 status
```

Harus keluar:
```
explore-penida  ● online
```

---

# BAGIAN 6: SETUP DOMAIN & SSL

## STEP 6.1: Setup Domain

### A. DNS Settings
1. Di sidebar CPanel
2. Cari **Domains** → **Zone Editor**
3. Klik **+ Add Record**

Tambahkan:
```
Type: A
Name: @ atau namadomain.com
TTL: 14400
Type A Record: ISI_IP_SERVER_ANDA
```

Tambahkan juga:
```
Type: A
Name: www
TTL: 14400
Type A Record: ISI_IP_SERVER_ANDA
```

### B. Restart Node.js App
1. Kembali ke **Setup Node.js App**
2. Klik **RESTART** pada aplikasi Anda

---

## STEP 6.2: Setup SSL Certificate

### A. AutoSSL
1. Di sidebar CPanel
2. Cari **SSL/TLS**
3. Klik **Manage SSL Sites**
4. Klik **Run AutoSSL** untuk domain Anda

### B. Atau Manual
1. **SSL/TLS** → **Generate, view, upload, or delete SSL certificates**
2. Pilih domain
3. Klik **Generate**

---

## STEP 6.3: Setup Reverse Proxy (Jika Perlu)

1. Buat file `.htaccess` di folder public_html:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api
RewriteCond %{REQUEST_URI} !^/_next
RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

# BAGIAN 7: KONFIGURASI MIDTRANS WEBHOOK

## STEP 7.1: Login Midtrans Dashboard

Buka browser, ketik:
```
https://dashboard.midtrans.com
```

Login dengan akun Anda

---

## STEP 7.2: Setup Payment Notification

1. Klik **Settings** di menu atas
2. Klik **Payment Notification**
3. Di kolom **URL**, ketik:
```
https://namadomain.com/api/payment/notification
```
4. Klik **Save**

---

## STEP 7.3: Setup Snap Configuration

1. Klik **Snap Configuration**
2. Isi:
   - Finish URL: https://namadomain.com/id/booking/success
   - Unfinish URL: https://namadomain.com/id/booking
   - Error URL: https://namadomain.com/id/booking
3. Klik **Save**

---

# BAGIAN 8: TEST SEMUA FITUR

## STEP 8.1: Test Homepage

Buka browser:
```
https://namadomain.com
```

Harus keluar halaman depan Explore Penida

---

## STEP 8.2: Test Halaman Paket Tour

Klik menu Paket Tour
Harus keluar daftar paket

---

## STEP 8.3: Test Halaman Admin

Buka:
```
https://namadomain.com/admin/login
```

Login dengan akun admin

---

## STEP 8.4: Test Booking Flow

1. Pilih paket tour
2. Klik Booking
3. Isi form
4. Pilih metode pembayaran Midtrans
5. Bayar dengan test account Midtrans
6. Cek admin panel → Booking masuk
7. Cek WhatsApp → Notification masuk

---

# TROUBLESHOOTING

## Error: Permission Denied

```bash
chmod 755 .next
chmod 755 node_modules
```

## Error: Port Already in Use

```bash
pm2 delete explore-penida
pkill node
PORT=3002 pm2 start npm --name "explore-penida" -- start
```

## Error: Database Connection Failed

```bash
# Cek apakah .env sudah benar
cat .env | grep DATABASE

# Test koneksi
npx prisma db push
```

## Error: Module Not Found

```bash
npm install --production
npm run build
pm2 restart explore-penida
```

## Error: SSL Certificate

1. Pastikan DNS sudah propagasi penuh
2. Tunggu 24-48 jam setelah setup DNS
3. Jalankan AutoSSL lagi

---

# COMMAND CEPAT

```bash
# Masuk folder
cd explore-penida

# Cek file
ls -la

# Restart aplikasi
pm2 restart explore-penida

# Lihat log error
pm2 logs explore-penida --lines 50

# Stop aplikasi
pm2 delete explore-penida

# Lihat resource usage
pm2 monit
```

---

# SELESAI!

Website Explore Penida Anda sudah online! 🎉🏝️

Dashboard Admin: https://namadomain.com/admin
Website Public: https://namadomain.com

---

# INFO PENTING

## Database Supabase
- Free tier: 500MB storage
- Auto backup oleh Supabase
- Buka: https://supabase.com

## Backup Manual
```bash
pg_dump "POSTGRES_URL" > backup.sql
```

## Update Aplikasi
1. Update kode di lokal
2. Build ulang: npm run build
3. Upload folder .next & file yang berubah
4. Di server: pm2 restart explore-penida
