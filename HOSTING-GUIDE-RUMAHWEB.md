# 🏝️ Panduan Hosting Lengkap - Explore Penida di Rumahweb

## 📋 Daftar Periksa Keamanan

### ✅ Fitur Keamanan yang Sudah Diimplementasi:

| Fitur | Status | Keterangan |
|-------|--------|-------------|
| Rate Limiting | ✅ | Mencegah brute force attack |
| Security Headers | ✅ | X-Frame-Options, CSP, dll |
| HTTPS Redirect | ✅ | Otomatis redirect HTTP ke HTTPS |
| Input Sanitization | ✅ | Semua input divalidasi |
| SQL Injection Protection | ✅ | Prisma ORM |
| XSS Protection | ✅ | CSP headers |
| CSRF Protection | ✅ | Via NextAuth |
| File Upload Validation | ✅ | Format & size limit |
| Admin Route Protection | ✅ | Session-based auth |

### ⚠️ Checklist Sebelum Hosting:

```bash
# 1. Generate NEXTAUTH_SECRET baru
openssl rand -base64 32

# 2. Generate DATABASE_URL dengan credentials Rumahweb
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# 3. Pastikan semua environment variable sudah benar
```

---

## 🖥️ Langkah 1: Persiapan di Rumahweb

### A. Aktifkan PostgreSQL
1. Login ke cPanel Rumahweb
2. Buka **PostgreSQL Databases**
3. Buat database baru: `explore_penida`
4. Buat user dengan password kuat
5. Assign user ke database

### B. Catat Credentials
```
Host: localhost (atau sesuai info Rumahweb)
Port: 5432 (default PostgreSQL)
Database: explore_penida
Username: cpXXXXX_username
Password: ●●●●●●●●●●●●
```

---

## 🔧 Langkah 2: Konfigurasi Environment

### A. Buat file `.env.production`

```bash
# ============================================================
# DATABASE
# ============================================================
DATABASE_URL="postgresql://CPANEL_USER:DB_PASSWORD@localhost:5432/explore_penida"
```

### B. Generate Secret Baru

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### C. Update semua environment variable

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="HASIL_GENERATE_OPENSSL"
NEXTAUTH_URL="https://DOMAIN-ANDA.com"

# Midtrans (Production)
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-REAL_KEY"
MIDTRANS_CLIENT_KEY="Mid-client-REAL_KEY"

# Cloudinary
CLOUDINARY_CLOUD_NAME="NAMA_CLOUD_ANDA"
CLOUDINARY_API_KEY="API_KEY_ANDA"
CLOUDINARY_API_SECRET="API_SECRET_ANDA"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="NAMA_CLOUD_ANDA"

# Fonnte
FONNTE_TOKEN="TOKEN_FONNTE_ANDA"
ADMIN_WA_NUMBER="6281234567890"

# App URL
NEXT_PUBLIC_APP_URL="https://DOMAIN-ANDA.com"
MIDTRANS_WEBHOOK_URL="https://DOMAIN-ANDA.com/api/payment/notification"

# Email (Production SMTP)
EMAIL_HOST="smtp.hostinger.com"  # atau SMTP provider lain
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="email@domain.com"
EMAIL_PASS="SMTP_PASSWORD"
EMAIL_FROM="Explore Penida <noreply@domain.com>"
```

---

## 🚀 Langkah 3: Build Application

### A. Install Dependencies
```bash
npm install
```

### B. Generate Prisma Client
```bash
npx prisma generate
```

### C. Push Schema ke Database
```bash
npx prisma db push
```

### D. Build Production Build
```bash
npm run build
```

---

## 🌐 Langkah 4: Deploy ke Rumahweb

### Opsi 1: Node.js Application Manager (Recommended)

#### A. Buka Terminal SSH
```bash
ssh CPANEL_USER@CPANEL_HOST
```

#### B. Buat Application
1. Buka **Setup Node.js App** di cPanel
2. Konfigurasi:
   - Node.js version: **20.x** atau **18.x**
   - Application root: `/home/CPANEL_USER/explore-penida`
   - Application startup file: `server.js`
   - Passenger log file: `logs/error.log`

#### C. Upload Files
```bash
# Via SSH atau File Manager
# Upload semua file EXCEPT node_modules ke /home/CPANEL_USER/explore-penida/

cd /home/CPANEL_USER/explore-penida
npm install --production
npm run build
```

#### D. Setup .env
```bash
# Buat file .env di root aplikasi
nano .env
# Paste semua environment variable
# Save dengan Ctrl+X, Y, Enter
```

#### E. Start Application
```bash
# Kill existing processes
pkill -f "next"

# Start
npm start
```

### Opsi 2: PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start app dengan PM2
pm2 start npm --name "explore-penida" -- start

# Monitor
pm2 monit

# Logs
pm2 logs explore-penida
```

---

## 🔒 Langkah 5: Konfigurasi Domain

### A. DNS Settings
```
Type    Name    Value
A       @       IP_SERVER_RUMAHWEB
A       www     IP_SERVER_RUMAHWEB
CNAME   api     DOMAIN-ANDA.com
```

### B. SSL Certificate
1. AutoSSL di cPanel biasanya otomatis
2. Atau manual via **SSL/TLS** → **Let's Encrypt**

### C. Force HTTPS
```bash
# Tambahkan ke .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📧 Langkah 6: Konfigurasi Webhooks

### Midtrans Webhook
1. Login ke https://dashboard.midtrans.com
2. Settings → Payment Notification
3. URL: `https://DOMAIN-ANDA.com/api/payment/notification`

### Fonnte Webhook (jika ada)
1. Panel Fonnte → Webhook URL
2. URL: `https://DOMAIN-ANDA.com/api/fonnte/webhook`

---

## 🧪 Langkah 7: Testing

### Test Checklist

```bash
# 1. Homepage loads
curl -I https://DOMAIN-ANDA.com

# 2. API works
curl https://DOMAIN-ANDA.com/api/paket

# 3. Admin login
# Buka browser → https://DOMAIN-ANDA.com/admin/login

# 4. Test booking flow
# Pilih paket → Checkout → Midtrans → Bayar → Konfirmasi

# 5. Check logs
pm2 logs explore-penida
tail -f /home/CPANEL_USER/explore-penida/logs/error.log
```

### Test Midtrans Payment
1. Buat test booking
2. Pilih metode Bayar
3. Selesaikan pembayaran
4. Check webhook received
5. Verify booking status updated

---

## 🔄 Pemeliharaan

### Backup Database
```bash
# Manual via SSH
pg_dump -h localhost -U cpuser explore_penida > backup_$(date +%Y%m%d).sql

# Schedule cron job mingguan
0 2 * * 0 pg_dump -h localhost -U USER -d DATABASE > ~/backups/db_$(date +\%Y\%m\%d).sql 2>&1
```

### Update Aplikasi
```bash
cd /home/CPANEL_USER/explore-penida
git pull origin main
npm install
npm run build
pm2 restart explore-penida
```

### Monitor
```bash
pm2 monit
pm2 status
pm2 logs explore-penida --lines 100
```

---

## 🆘 Troubleshooting

### Error: Connection Refused
```bash
# Check PM2 status
pm2 status

# Restart if stopped
pm2 restart explore-penida
```

### Error: Database Connection Failed
```bash
# Test PostgreSQL connection
psql -h localhost -U USER -d DATABASE -c "SELECT 1"

# Check .env DATABASE_URL
cat .env | grep DATABASE
```

### Error: 500 on API routes
```bash
# Check error logs
pm2 logs explore-penida --err
tail -100 logs/error.log
```

### Error: SSL Certificate Expired
```bash
# Renew via cPanel AutoSSL
# Atau manual dengan Certbot
certbot renew --nginx
```

---

## 📞 Kontak Support

- **Rumahweb**: support@rumahweb.co.id
- **Midtrans**: docs.midtrans.com
- **Cloudinary**: support@cloudinary.com
- **Next.js**: nextjs.org/docs

---

## ✅ Checklist Deployment

- [ ] Environment variables dikonfigurasi
- [ ] Database schema sudah di-push
- [ ] SSL certificate aktif
- [ ] Domain pointing ke server
- [ ] Midtrans webhook URL dikonfigurasi
- [ ] Test booking flow berfungsi
- [ ] WhatsApp notification berfungsi
- [ ] Email notification berfungsi
- [ ] Backup strategy berjalan
- [ ] Monitoring aktif

---

**Good luck! 🚀**

## 📁 File Penting untuk Disimpan

SIMPAN DI TEMPAT AMAN (GITIGNORE JANGAN DI COMMIT):
```bash
.env
.env.local
node_modules/
.next/
.env.production
```

BACKUP SECARA BERKALA:
```bash
# Database
pg_dump -h localhost -U USER -d DATABASE > backup_$(date +%Y%m%d).sql

# Files config
cp .env ~/backups/.env.backup
```
