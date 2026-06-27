# 🚀 PANDUAN HOSTING EXPLORE PENIDA - CPANEL NODE.JS APP

## BAGIAN 1: PERSIAPAN

### 1.1 Yang Sudah Harus Ada
- [x] Akun Supabase (Database PostgreSQL)
- [x] Aplikasi sudah di-build (`npm run build`)
- [x] File di-upload ke CPanel

---

## BAGIAN 2: CEK NODE.JS DI CPANEL

### 2.1 Login CPanel
```
https://namadomain.com/cpanel
```

### 2.2 Cari "Setup Node.js App"
Di sidebar CPanel, cari:
- **Software** → **Setup Node.js App**

---

## BAGIAN 3: BUAT APPLICATION

### 3.1 Klik "CREATE APPLICATION"

### 3.2 Isi Formulir:

```
Node.js version: 18.x (atau 20.x)

Application root: 
/home/peng4368/explore-penida

Application startup file: 
npm

Application arguments: 
start

Environment variables: 
NODE_ENV=production

Passenger log file: 
/home/peng4368/explore-penida/logs/error.log
```

### 3.3 Klik "CREATE"

---

## BAGIAN 4: KONFIGURASI ENVIRONMENT

### 4.1 Buka File Manager
CPanel → Files → File Manager → Buka folder `explore-penida`

### 4.2 Buat File .env
1. Klik **+File** di toolbar
2. Nama: `.env`
3. Paste isi berikut (SESUAIKAN data Anda):

```env
# DATABASE - GANTI DENGAN URI SUPABASE ANDA
DATABASE_URL="postgresql://postgres.xxx:ISI_PASSWORD@aws-xx-xxxx.supabase.co:5432/postgres"

# NEXTAUTH - GENERATE SECRET BARU
NEXTAUTH_SECRET="HASIL_GENERATE_OPENSSL"
NEXTAUTH_URL="https://namadomain.com"

# APP URL
NEXT_PUBLIC_APP_URL="https://namadomain.com"

# MIDTRANS - PRODUCTION
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-ISI_DARI_MIDTRANS"
MIDTRANS_CLIENT_KEY="Mid-client-ISI_DARI_MIDTRANS"
MIDTRANS_WEBHOOK_URL="https://namadomain.com/api/payment/notification"

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama-cloud-anda"

# FONNTE WHATSAPP
FONNTE_TOKEN="token-fonnte"
ADMIN_WA_NUMBER="6281234567890"
```

4. Klik **Save Changes**

### 4.3 Generate NEXTAUTH_SECRET
Buka **Terminal** di CPanel:
```bash
openssl rand -base64 32
```
Copy hasilnya, edit file `.env`

---

## BAGIAN 5: TERMINAL - INSTALL & JALANKAN

### 5.1 Buka Terminal
CPanel → **Advanced** → **Terminal**

### 5.2 Masuk Folder
```bash
cd explore-penida
ls -la
```

### 5.3 Generate Prisma
```bash
npx prisma generate
```

### 5.4 Test Jalan
```bash
npm start
```

Buka browser: `http://namadomain.com:3000`

Kalau keluar website = BERHASIL!

---

## BAGIAN 6: SETUP NODE.JS APP (LANCAR)

### 6.1 Buka Setup Node.js App Lagi

### 6.2 Edit Application
Klik **EDIT** pada aplikasi yang sudah dibuat

### 6.3 Pastikan Konfigurasi:
```
Node.js version: 18.x
Application root: /home/peng4368/explore-penida
Application startup file: npm
Application arguments: start
Mode: Production
```

### 6.4 Klik "UPDATE"

### 6.5 Jalankan
Klik **START**

---

## BAGIAN 7: VERIFIKASI

### 7.1 Cek Status
Di "Setup Node.js App", status harus: **running**

### 7.2 Buka Website
```
http://namadomain.com:3000
```

### 7.3 Test Halaman
- Homepage
- Halaman booking
- Admin login

---

## BAGIAN 8: SETUP DOMAIN & SSL

### 8.1 Setup Node.js App Port
Di "Setup Node.js App":
1. Edit aplikasi
2. Port: 3000 (default)
3. Application URL: namadomain.com

### 8.2 DNS Settings
CPanel → Zone Editor → Manage DNS

Tambahkan:
```
A     @     IP-SERVER-ANDA
A     www   IP-SERVER-ANDA
```

### 8.3 SSL Certificate
CPanel → SSL/TLS → Manage SSL Sites
- Klik **Run AutoSSL** untuk domain Anda

---

## BAGIAN 9: KONFIGURASI MIDTRANS

### 9.1 Login Midtrans
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

## TROUBLESHOOTING

### Error: Permission Denied
```bash
chmod 755 .next
chmod 755 node_modules
```

### Error: Port Already in Use
Hapus aplikasi lama di "Setup Node.js App", buat baru.

### Error: Database Connection
Cek `.env` → DATABASE_URL benar tidak.

### Error: Module Not Found
```bash
npm install
npm run build
```

### Aplikasi Tidak Bisa Dibuka
Cek status di "Setup Node.js App" → harus **running**

---

## COMMAND PENTING

```bash
# Masuk folder
cd explore-penida

# Cek file
ls -la

# Generate Prisma
npx prisma generate

# Install ulang
npm install

# Build ulang
npm run build

# Lihat log error
cat logs/error.log
```

---

## CHECKLIST FINAL

- [ ] Node.js App running
- [ ] Website bisa dibuka
- [ ] Database terhubung
- [ ] Domain pointing ke server
- [ ] SSL aktif
- [ ] Midtrans webhook configured
- [ ] Test booking flow
- [ ] Test WhatsApp notification
