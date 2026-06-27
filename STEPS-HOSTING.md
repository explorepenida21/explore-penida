# 🚀 LANGKAH-LANGKAH HOSTING EXPLORE PENIDA DI RUMAHWEB

================================================================================
BAGIAN 1: PERSIAPAN DI RUMAHWEB CPANEL
================================================================================

STEP 1.1: LOGIN CPANEL
--------------------------------------------------------------------------------
1. Buka email dari Rumahweb untuk info login CPANEL
2. Login ke https://nama-domain-anda.com/cpanel atau https://rumahweb.co.id/cpanel
3. Login dengan username & password dari email

STEP 1.2: BUAT DATABASE POSTGRESQL
--------------------------------------------------------------------------------
1. Di CPANEL, cari "PostgreSQL Databases" atau "Databases"
2. Scroll ke "Current Databases" → Buat Database baru:
   - Nama Database: explore_penida
   - Klik "Create Database"

3. Scroll ke "Current Users" → Buat User baru:
   - Username: cpXXXXX_epadmin (ganti X dengan nomor Anda)
   - Password: Buat password kuat 16 karakter (simpan di notepad!)
   - Klik "Create User"

4. Assign User ke Database:
   - Scroll ke "Add User to Database"
   - Pilih user dan database
   - Centang ALL privileges
   - Klik "Add"

📝 CATAT & SIMPAN di NOTEPAD:
   - Database: explore_penida
   - Username: cpXXXXX_epadmin
   - Password: ●●●●●●●●●●●●●●
   - Host: localhost (biasanya)

STEP 1.3: CATAT INFO HOSTING
--------------------------------------------------------------------------------
Dari email konfirmasi hosting atau CPANEL, catat:
- Domain utama Anda: contoh.com
- Username CPANEL: cpXXXXX
- Server Hostname: bisa dilihat di CPANEL atau email
- IP Server: lihat di CPANEL → Server Information

================================================================================
BAGIAN 2: KONFIGURASI ENVIRONMENT VARIABLES
================================================================================

STEP 2.1: BUKA FILE .env.local SAAT INI
--------------------------------------------------------------------------------
Buka file .env.local di project Anda, kita akan update sebelum hosting

STEP 2.2: UPDATE .env.local
--------------------------------------------------------------------------------

# 1. DATABASE - Ganti dengan info dari Step 1.2:
DATABASE_URL="postgresql://cpXXXXX_cpXXXXx_epadmin:ISI_PASSWORD_ANDA@localhost/explore_penida"

# 2. NEXTAUTH URL - Ganti dengan domain Anda:
NEXTAUTH_URL="https://nama-domain-anda.com"
NEXT_PUBLIC_APP_URL="https://nama-domain-anda.com"

# 3. MIDTRANS - Jika production mode:
MIDTRANS_IS_PRODUCTION="true"
# Dapatkan server key dari https://dashboard.midtrans.com > Settings > Access Key

# 4. WEBHOOK MIDTRANS - Ganti domain Anda:
MIDTRANS_WEBHOOK_URL="https://nama-domain-anda.com/api/payment/notification"

# 5. CLOUDINARY - Pastikan sudah benar:
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="nama_cloud_anda"  # Tanpa .com
CLOUDINARY_API_SECRET="secret_cloudinary_anda"

# 6. FONNTE:
FONNTE_TOKEN="token_fonnte_anda"
ADMIN_WA_NUMBER="6281234567890"

# 7. EMAIL - Konfigurasi SMTP production:
EMAIL_HOST="smtp.domain-anda.com"  # Atau hosting SMTP provider
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="email@domain-anda.com"
EMAIL_PASS="password_smtp"
EMAIL_FROM="Explore Penida <noreply@domain-anda.com>"

# 8. PUBLIC URL:
NEXT_PUBLIC_APP_URL="https://nama-domain-anda.com"

================================================================================
BAGIAN 3: BUILD APLIKASI (LOCAL/PERSIAPAN)
================================================================================

STEP 3.1: INSTALL DEPENDENCIES
--------------------------------------------------------------------------------
Di terminal project Anda (buka cmd/terminal di folder project):

npm install

STEP 3.2: GENERATE PRISMA CLIENT
--------------------------------------------------------------------------------
npx prisma generate

STEP 3.3: PUSH DATABASE SCHEMA
--------------------------------------------------------------------------------
Ini akan membuat tabel-tabel di PostgreSQL Rumahweb Anda:
npx prisma db push

STEP 3.4: BUILD APLIKASI
--------------------------------------------------------------------------------
npm run build

================================================================================
BAGIAN 4: UPLOAD FILE KE RUMAHWEB
================================================================================

STEP 4.1: SIAPKAN FILE UNTUK UPLOAD
--------------------------------------------------------------------------------

1. Buat folder baru di komputer Anda: explore-penida-deploy

2. Copy file berikut ke folder tersebut:
   - Semua file KECUALI folder berikut:
   - HAPUS folder: node_modules, .next, .git
   - HAPUS file: .env, .env.local (akan dibuat di server)

3. File yang HARUS ADA:
   - package.json, package-lock.json
   - semua folder: app/, components/, lib/, public/, prisma/, messages/
   - semua file: next.config.js, tsconfig.json, .eslintrc.json
   - Buat file .env.production dengan isi sama .env.local tapi dengan domain production

STEP 4.2: UPLOAD FILE
--------------------------------------------------------------------------------

OPSI A - FileZilla (GUI):
1. Download FileZilla: https://filezilla-project.org
2. Connect dengan FTP credentials dari email Rumahweb
3. Upload folder explore-penida-deploy ke /home/cpXXXXX/

OPSI B - CPanel File Manager:
1. Di CPanel → File Manager
2. Buka folder /home/cpXXXXX/
3. Upload semua file satu per satu atau ZIP + Extract

OPSI C - SSH (Terminal):
1. Di CPanel → Terminal
2. Atau connect via SSH:
   ssh cpXXXXX@nama-domain.com
3. Upload file dengan SCP atau SFTP

================================================================================
BAGIAN 5: SETUP DI SERVER (TERMINAL/SSH)
================================================================================

STEP 5.1: BUKA TERMINAL SSH
--------------------------------------------------------------------------------
1. Di CPanel → Advanced → Terminal
2. Atau pakai PuTTY/Windows Terminal dengan:
   ssh cpXXXXX@nama-domain-anda.com

STEP 5.2: INSTALL NODE.JS (JIKA BELUM ADA)
--------------------------------------------------------------------------------
# Cek versi Node.js:
node --version

# Jika belum ada atau versi < 16, install:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

STEP 5.3: NAVIGASI KE FOLDER APLIKASI
--------------------------------------------------------------------------------
cd /home/cpXXXXX/explore-penida-deploy

# Atau wherever Anda upload file-nya
ls -la  # Lihat isi folder

STEP 5.4: INSTALL DEPENDENCIES
--------------------------------------------------------------------------------
npm install
# Tunggu selesai (bisa 5-10 menit)

STEP 5.5: GENERATE PRISMA & BUILD
--------------------------------------------------------------------------------
npx prisma generate
npm run build

STEP 5.6: BUAT FILE .env DI SERVER
--------------------------------------------------------------------------------
nano .env
# Paste semua environment variable (sesuaikan dengan production)
# Save: Ctrl+X → Y → Enter

STEP 5.7: START APLIKASI
--------------------------------------------------------------------------------
#试试 dulu dengan npm start
npm start

# Jika berhasil, aplikasi jalan di port 3000
# Tekan Ctrl+C untuk stop dulu

STEP 5.8: SETUP PM2 (PROCESS MANAGER)
--------------------------------------------------------------------------------
# Install PM2 globally
npm install -g pm2

# Start dengan PM2
pm2 start npm --name "explore-penida" -- start

# Check status
pm2 status

# Lihat logs
pm2 logs explore-penida

# Setup auto-start saat server reboot
pm2 startup

# Simpan proses PM2
pm2 save

STEP 5.9: APLIKASI SUDAH JALAN?
--------------------------------------------------------------------------------
# Cek apakah port 3000 aktif
lsof -i :3000

# Atau test langsung
curl localhost:3000

================================================================================
BAGIAN 6: KONFIGURASI DOMAIN & SSL
================================================================================

STEP 6.1: DNS SETTINGS
--------------------------------------------------------------------------------
Di CPanel → Domains → Zone Editor atau DNS Management:

Tambahkan record:
A     @     IP_SERVER_ANDA
A     www    IP_SERVER_ANDA
CNAME api    nama-domain.com

CATAT: IP Server bisa dilihat di CPanel → Server Information

STEP 6.2: TUNGGU PROPAGASI DNS
--------------------------------------------------------------------------------
Biasanya 5 menit - 24 jam (rata-rata 1-2 jam)

Test dengan:
ping nama-domain-anda.com
nslookup nama-domain-anda.com

STEP 6.3: AKTIFKAN SSL (HTTPS)
--------------------------------------------------------------------------------
Di CPanel → Security → SSL/TLS → Manage SSL Sites
Atau AutoSSL biasanya otomatis aktif

Jika belum:
- Klik "Install SSL Certificate"
- Pilih domain
- Klik "Run AutoSSL"

STEP 6.4: TEST HTTPS
--------------------------------------------------------------------------------
Buka browser:
https://nama-domain-anda.com

================================================================================
BAGIAN 7: KONFIGURASI WEBHOOK MIDTRANS
================================================================================

STEP 7.1: LOGIN MIDTRANS DASHBOARD
--------------------------------------------------------------------------------
1. Buka https://dashboard.midtrans.com
2. Login dengan akun Anda

STEP 7.2: SETUP NOTIFICATION URL
--------------------------------------------------------------------------------
1. Menu → Settings → Payment Notification
2. Isi URL:
   https://nama-domain-anda.com/api/payment/notification
3. Klik Save

STEP 7.3: SETUP SNAP REDIRECT URL (JIKA PERLU)
--------------------------------------------------------------------------------
1. Menu → Settings → S redsnapross_configrossross_configrossrossross_config
2. Set Finish URL: https://nama-domain-anda.com/id/booking/success
3. Set Unfinish URL: https://nama-domain-anda.com/id/booking
4. Set Error URL: https://nama-domain-anda.com/id/booking

================================================================================
BAGIAN 8: VERIFIKASI & TEST
================================================================================

STEP 8.1: TEST HOMEPAGE
--------------------------------------------------------------------------------
Buka browser:
https://nama-domain-anda.com

STEP 8.2: TEST ADMIN LOGIN
--------------------------------------------------------------------------------
https://nama-domain-anda.com/admin/login

STEP 8.3: TEST BOOKING FLOW
--------------------------------------------------------------------------------
1. Pilih paket tour
2. Isi form booking
3. Bayar dengan Midtrans
4. Check admin panel → booking muncul

STEP 8.4: TEST WHATSAPP NOTIFICATION
--------------------------------------------------------------------------------
Cek WhatsApp admin, seharusnya ada notifikasi booking baru

================================================================================
BAGIAN 9: TROUBLESHOOTING
================================================================================

MASALAH: Cannot connect to database
SOLUSI:
- Cek DATABASE_URL di .env
- Test PostgreSQL connection:
  psql -h localhost -U cpXXXXX_epadmin -d explore_penida -c "SELECT 1"

MASALAH: Application error / 500
SOLUSI:
- Cek logs: pm2 logs explore-penida
- Pastikan sudah npm run build
- Restart: pm2 restart explore-penida

MASALAH: Port 3000 tidak bisa diakses
SOLUSI:
- Pastikan aplikasi running: pm2 status
- Cek firewall: iptables -L -n | grep 3000
- Jika blocked, open port atau gunakan reverse proxy (nginx)

MASALAH: DNS/SSL belum berfungsi
SOLUSI:
- Tunggu propagasi (1-24 jam)
- Cek DNS settings di CPanel
- Renew SSL: Home → SSL/TLS → Manage SSL Sites → AutoSSL

================================================================================
STEP SELESAI - SELAMAT APLIKASI ANDA BERJALAN!
================================================================================

Dashboard Admin: https://nama-domain-anda.com/admin
Website Public: https://nama-domain-anda.com

Backup rutin: pm2 save && pg_dump > backup.sql

================================================================================
