# ============================================================
# DEPLOYMENT GUIDE - Explore Penida
# Untuk Rumahweb Hosting
# ============================================================

## 📋 Prasyarat

Pastikan akun Rumahweb Anda memiliki:
- [x] Akses SSH aktif
- [x] Node.js terinstall
- [x] PostgreSQL database
- [x] Domain sudah pointing ke server

---

## 🚀 LANGKAH 1: Persiapan di Rumahweb cPanel

### 1.1 Aktifkan SSH Access
1. Login ke cPanel Rumahweb
2. Cari **Advanced** → **Terminal** atau **SSH Access**
3. Aktifkan SSH dan set password
4. Catat hostname SSH (biasanya: `hostname.rumahweb.com`)

### 1.2 Buat PostgreSQL Database
1. Login ke cPanel
2. Cari **Databases** → **PostgreSQL Databases**
3. Buat database baru: `explore_penida`
4. Buat user database dan catat kredensialnya
5. Grant all privileges ke user

### 1.3 Setup Node.js (jika belum ada)
1. Di cPanel, cari **Software** → **Setup Node.js App**
2. Create Application dengan settings:
   - Node.js version: `18.x` atau `20.x` (recommended)
   - Application mode: `Production`
   - Application root: `/home/username/explore-penida`
   - Application URL: `explorepenida.com` atau subdomain
   - Application start file: `ecosystem.config.js`

---

## 🖥️ LANGKAH 2: Setup Project di Lokal

### 2.1 Clone atau Upload Project

**Opsi A: Clone dari Git (Recommended)**
```bash
# SSH ke server
ssh username@hostname.rumahweb.com

# Navigate ke home directory
cd ~

# Clone project (jika ada repo Git)
git clone https://github.com/your-repo/explore-penida.git
cd explore-penida
```

**Opsi B: Upload via File Manager**
1. ZIP project folder di lokal
2. Upload via cPanel → Files → File Manager
3. Extract di desired location
4. Via SSH, navigate ke folder

### 2.2 Setup Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit dengan credentials Anda
nano .env
```

Isi `.env` dengan konfigurasi production:

```env
# Database (dari PostgreSQL yang baru dibuat)
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5432/explore_penida"

# NextAuth - Generate secret baru!
NEXTAUTH_SECRET="generate_dengan_openssl_rand_base64_32"
NEXTAUTH_URL="https://explorepenida.com"

# Midtrans - Ganti dengan credentials production!
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-xxxxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxxxx"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Fonnte WhatsApp
FONNTE_TOKEN="your-fonnte-token"
ADMIN_WA_NUMBER="628xxxxxxxxxx"

# Email SMTP
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="xxxx-xxxx-xxxx-xxxx"  # App Password!
EMAIL_FROM="Explore Penida <noreply@explorepenida.com>"

# OpenRouter AI
OPENROUTER_API_KEY="sk-or-v1-xxxxx"

# App URL
NEXT_PUBLIC_APP_URL="https://explorepenida.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📦 LANGKAH 3: Install Dependencies & Build

### 3.1 Install Dependencies
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build application
npm run build
```

### 3.2 Setup Database
```bash
# Push schema ke database
npx prisma db push

# (Opsional) Seed database dengan data awal
npm run db:seed
```

### 3.3 Buat Admin User
```bash
# Login ke database
psql -U DB_USER -d explore_penida -h localhost

# Insert admin user (password: 'admin123' - GANTI SEKARANG!)
INSERT INTO "AdminUser" (id, email, password, "nama", role, "createdAt")
VALUES (
  'admin1',
  'admin@explorepenida.com',
  '$2a$10$...',  -- bcrypt hash dari password Anda
  'Administrator',
  'admin',
  NOW()
);

# Exit psql
\q
```

**Untuk generate password hash:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(h => console.log(h))"
```

---

## 🎯 LANGKAH 4: Jalankan Application

### 4.1 Install PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Create logs directory
mkdir -p logs
```

### 4.2 Jalankan dengan PM2
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Check status
pm2 status

# View logs
pm2 logs explore-penida
```

### 4.3 Setup Startup Script (Auto-restart saat server reboot)
```bash
# Generate startup command
pm2 startup

# Copy-paste output command yang muncul

# Save current process list
pm2 save
```

---

## 🌐 LANGKAH 5: Setup Domain & SSL

### 5.1 Configure Domain di cPanel
1. cPanel → Domains → Zone Editor atau Aliases
2. Add A record pointing ke IP server Anda
3. Tunggu propagasi (bisa sampai 24 jam)

### 5.2 Setup SSL (Let's Encrypt - sudah include di Rumahweb)
1. cPanel → Security → SSL/TLS
2. Klik "Manage SSL Sites"
3. Install certificate untuk domain Anda
4. Enable HTTPS Force

### 5.3 Setup Reverse Proxy (Optional - untuk port non-80)
Jika aplikasi jalan di port 3000:

**nginx config:**
```nginx
# /etc/nginx/conf.d/explore-penida.conf

server {
    listen 80;
    server_name explorepenida.com www.explorepenida.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Reload nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 LANGKAH 6: Keamanan Tambahan

### 6.1 Firewall Setup
```bash
# Allow SSH (pakai port custom jika ada)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow app port (jika langsung)
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable
```

### 6.2 Setup Fail2Ban (Prevent Brute Force)
```bash
# Install fail2ban
sudo apt install fail2ban

# Configure for SSH
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 6.3 Setup Backup Otomatis
```bash
# Buat script backup
nano ~/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"
DB_NAME="explore_penida"
DB_USER="your_db_user"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /home/username/explore-penida --exclude='node_modules' --exclude='.next'

# Remove backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x ~/backup.sh

# Setup cron (backup setiap hari jam 2 pagi)
crontab -e
# Tambah baris:
# 0 2 * * * /home/username/backup.sh >> /home/username/backup.log 2>&1
```

---

## 🔧 TROUBLESHOOTING

### Error: "Port already in use"
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process
pm2 delete explore-penida
pm2 start ecosystem.config.js
```

### Error: "Database connection failed"
```bash
# Test database connection
psql -U DB_USER -d explore_penida -h localhost -W

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL
```

### Error: "Prisma Client not found"
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Error: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules/.cache
npm install
```

### View PM2 Logs
```bash
pm2 logs explore-penida --lines 100
pm2 logs explore-penida --err --lines 50
```

### Restart Application
```bash
pm2 restart explore-penida
```

### Check Application Status
```bash
pm2 status
pm2 monit
```

---

## 📞 MENDAPATKAN BANTUAN

Jika ada pertanyaan:
1. Documentation Next.js: https://nextjs.org/docs
2. Documentation Prisma: https://prisma.io/docs
3. Rumahweb Support: Hubungi tim support Rumahweb

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] SSH Access aktif
- [ ] PostgreSQL database dibuat
- [ ] Project diupload ke server
- [ ] .env file dikonfigurasi
- [ ] Dependencies terinstall
- [ ] Database migration berhasil
- [ ] Build berhasil
- [ ] PM2 process running
- [ ] Domain pointing ke server
- [ ] SSL certificate aktif
- [ ] Admin user dibuat
- [ ] Login test berhasil
- [ ] Booking flow test berhasil
- [ ] WhatsApp notification test berhasil
- [ ] Backup script setup

---

**© 2024 Explore Penida Deployment Guide**
