# ============================================================
# DEPLOYMENT CHECKLIST - Explore Penida
# ============================================================

## 🚀 PERSIAPAN SEBELUM HOSTING

### Keamanan
- [ ] **PENTING:** Hapus/backup file `.env.local` dari komputer lokal
- [ ] Generate NEXTAUTH_SECRET baru: `openssl rand -base64 32`
- [ ] Update semua API keys ke versi production
- [ ] Set MIDTRANS_IS_PRODUCTION=true (setelah testing selesai)
- [ ] Setup SSL certificate di hosting

### Database
- [ ] Buat PostgreSQL database di Rumahweb
- [ ] Buat user database dengan privileges
- [ ] Catat connection string: `postgresql://user:pass@host:5432/dbname`

### Domain
- [ ] Domain sudah pointing ke server
- [ ] DNS propagated (cek dengan `nslookup domain.com`)
- [ ] SSL certificate aktif (Let's Encrypt)

---

## 📦 UPLOAD PROJECT

### Opsi 1: Git Clone
```bash
ssh username@server
cd ~
git clone https://github.com/your-repo/explore-penida.git
cd explore-penida
```

### Opsi 2: File Upload
1. ZIP project di komputer lokal
2. Upload via cPanel → Files → File Manager
3. Extract di `/home/username/explore-penida`

---

## ⚙️ KONFIGURASI DI SERVER

### 1. Setup Environment
```bash
cd explore-penida
cp .env.example .env
nano .env  # Edit dengan credentials Anda
```

### 2. Install Dependencies
```bash
chmod +x scripts/quick-setup.sh
./scripts/quick-setup.sh
```

### 3. Install PM2
```bash
npm install -g pm2
mkdir -p logs
```

---

## 🎯 JALANKAN APLIKASI

### Start dengan PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 status
```

### Cek Logs
```bash
pm2 logs explore-penida
```

### Test Akses
- Frontend: https://explorepenida.com
- Admin: https://explorepenida.com/admin
- API Health: https://explorepenida.com/api/chat (GET)

---

## ✅ TESTING CHECKLIST

### Fungsionalitas
- [ ] Homepage loads dengan hero section
- [ ] Halaman paket tour visible
- [ ] Halaman booking berfungsi
- [ ] Pembayaran Midtrans sandbox berhasil
- [ ] WhatsApp notification terkirim
- [ ] Email confirmation terkirim
- [ ] Admin login berhasil
- [ ] CRUD paket tour berfungsi
- [ ] Dashboard statistics correct

### Keamanan
- [ ] Rate limiting aktif (test dengan rapid requests)
- [ ] Security headers visible (cek di browser DevTools)
- [ ] Admin routes protected (can't access without login)
- [ ] API auth working (can't access admin API tanpa token)

### Performance
- [ ] Page load time < 3 detik
- [ ] Images loading correctly
- [ ] No console errors

---

## 🔄 MUNDURKAN (ROLLBACK)

Jika terjadi error setelah deployment:

```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs explore-penida --err --lines 100

# Restart application
pm2 restart explore-penida

# Check database connection
npx prisma db push

# Full rebuild
npm run rebuild
pm2 restart explore-penida
```

---

## 📞 EMERGENCY CONTACTS

Jika terjadi masalah kritis:

1. **PM2 Process Down:**
   ```bash
   pm2 restart explore-penida
   pm2 logs explore-penida --lines 50
   ```

2. **Database Connection Failed:**
   - Check DATABASE_URL di .env
   - Test connection: `psql -U user -d dbname -h localhost -W`

3. **SSL Certificate Expired:**
   - cPanel → Security → SSL/TLS
   - Install ulang certificate

4. **Domain Not Resolving:**
   - Check DNS di registrar
   - Flush DNS cache: `sudo systemd-resolve --flush-caches`

---

## 📊 MONITORING

### Daily Checks
```bash
# Check app status
pm2 status

# Check resource usage
pm2 monit

# Check error logs
pm2 logs explore-penida --err --lines 20
```

### Weekly Maintenance
```bash
# Clear PM2 logs
pm2 flush

# Check disk space
df -h

# Check memory usage
free -m

# Backup database
pg_dump -U dbuser -d dbname > backup_$(date +%Y%m%d).sql
```

---

## 🎉 GO LIVE!

Setelah semua testing berhasil:

1. **Update Midtrans ke Production Mode:**
   ```bash
   # Edit .env
   MIDTRANS_IS_PRODUCTION="true"
   MIDTRANS_SERVER_KEY="Mid-server-PROD-xxxxx"
   MIDTRANS_CLIENT_KEY="Mid-client-PROD-xxxxx"

   # Restart
   pm2 restart explore-penida
   ```

2. **Update Webhook URL di Midtrans Dashboard:**
   ```
   https://explorepenida.com/api/payment/notification
   ```

3. **Update DNS Records jika perlu:**
   - Ensure A record pointing ke server IP
   - Ensure www CNAME pointing ke domain utama

4. **Submit ke Google Search Console:**
   - https://search.google.com/search-console

5. **Announce Launch!**
   - Social media
   - Email ke subscribers
   - WhatsApp broadcast

---

**Last Updated:** June 2024
**Version:** 1.0.0
