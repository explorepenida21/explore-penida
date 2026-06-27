# DEPLOY KE VERCEL - LANGKAH LENGKAP

## SEBELUM MULAI
- Akun GitHub
- Akun Vercel
- Database Supabase siap

---

# BAGIAN 1: PUSH KE GITHUB

## 1.1 Buat Repository GitHub
1. Buka https://github.com
2. Klik + → New repository
3. Nama: explore-penida
4. Public → Create

## 1.2 Push Kode Local ke GitHub
Buka Terminal di komputer lokal:

```bash
cd C:\Users\ACER\explore-penida

git init
git add .
git commit -m "Initial commit"

git remote add origin https://github.com/USERNAME/explore-penida.git
git branch -M main
git push -u origin main
```

---

# BAGIAN 2: DEPLOY VERECEL

## 2.1 Buka Vercel
1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New → Project"
4. Pilih repository "explore-penida"
5. Klik "Import"

## 2.2 Konfigurasi Project

### Framework Preset:
```
Next.js
```

### Build Command:
```
npx prisma generate && npm run build
```

### Environment Variables, klik "Env Variables" dan tambah:
```
DATABASE_URL = postgresql://postgres.xxx:password@host.supabase:5432/postgres
NEXTAUTH_SECRET = KzR4v9xLm2QpN8jHsT6wE1yA3bCdF0gH5i
NEXTAUTH_URL = https://explore-penida.vercel.app
NEXT_PUBLIC_APP_URL = https://explore-penida.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = nama-cloud-anda
FONNTE_TOKEN = token-fonnte
ADMIN_WA_NUMBER = 6281234567890
MIDTRANS_CLIENT_KEY = Mid-client-xxx
MIDTRANS_SERVER_KEY = Mid-server-xxx
```

## 2.3 Deploy
1. Klik "Deploy"
2. Tunggu 5-10 menit
3. Kalau berhasil → Buka URL yang diberikan Vercel

---

# BAGIAN 3: SETUP DOMAIN

## 3.1 Buka Settings Project Vercel
1. Settings → Domains
2. Ketik: namadomain.com
3. Klik "Add"
4. Copy DNS records yang ditunjukkan

## 3.2 Setup DNS di Registrar Domain
Tambahkan record sesuai instruksi Vercel

## 3.3 Tunggu propagasi
5 menit - 24 jam

---

# BAGIAN 4: UPDATE DATABASE

## 4.1 Buka Supabase
1. Settings → Database → Connection String
2. Copy URI

## 4.2 Update Environment Variables Vercel
1. Settings → Environment Variables
2. Edit DATABASE_URL → Paste URI Supabase
3. Save

## 4.3 Trigger Redeploy
```bash
git add . && git commit --allow-empty -m "redeploy" && git push
```

---

# SELESAI!
Website online: https://namadomain.com
Admin: https://namadomain.com/admin
