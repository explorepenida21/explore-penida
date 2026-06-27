# Panduan Setup Explore Penida App

## Daftar Isi
1. [Konfigurasi Midtrans](#konfigurasi-midtrans)
2. [Konfigurasi Email SMTP](#konfigurasi-email-smtp)
3. [Konfigurasi WhatsApp (Fonnte)](#konfigurasi-whatsapp-fonnte)
4. [Konfigurasi Midtrans Dashboard](#konfigurasi-midtrans-dashboard)

---

## Konfigurasi Midtrans

### 1. Dapatkan Credential Midtrans

1. Daftar di https://dashboard.midtrans.com
2. Pilih environment: **Sandbox** (untuk development) atau **Production**
3. Di halaman Settings > Access Keys, salin:
   - **Server Key** (untuk backend)
   - **Client Key** (untuk frontend)

### 2. Update .env.local

```env
# Untuk Sandbox (Development)
MIDTRANS_SERVER_KEY="Mid-server-xxxxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxxxx"
MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-xxxxx"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.sandbox.midtrans.com/snap/snap.js"

# Untuk Production
MIDTRANS_SERVER_KEY="Mid-server-xxxxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxxxx"
MIDTRANS_IS_PRODUCTION="true"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-xxxxx"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.midtrans.com/snap/snap.js"
```

### 3. Konfigurasi Payment Methods

Payment methods yang sudah diaktifkan di kode:
- **QRIS** (OVO, DANA, ShopeePay, GoPay, dll)
- **Virtual Account**: BCA, BNI, BRI, Permata, Mandiri
- **Convenience Store**: Indomaret, Alfamart
- **Kartu Kredit**

---

## Konfigurasi Email SMTP

### Opsi 1: Gmail SMTP (Free, limit 500/day)

1. Aktifkan **2-Factor Authentication** di akun Google
2. Buka https://myaccount.google.com/apppasswords
3. Buat App Password baru (pilih "Mail" dan device "Other")
4. Salin password 16 karakter yang diberikan

Update .env.local:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="emailkamu@gmail.com"
EMAIL_PASS="abcd efgh ijkl mnop"  # App Password dari Google
EMAIL_FROM="Explore Penida <noreply@explorepenida.com>"
```

### Opsi 2: Resend (Recommended - Free 100/day)

1. Daftar di https://resend.com
2. Buat API Key baru
3. Verifikasi domain Anda (atau gunakan domain default)

Update .env.local:
```env
EMAIL_HOST="smtp.resend.com"
EMAIL_PORT=587
EMAIL_SECURE="false"
EMAIL_USER="resend"
EMAIL_PASS="re_xxxxx_your_api_key"
EMAIL_FROM="Explore Penida <noreply@explorepenida.com>"
```

### Testing Email

Setelah konfigurasi, test dengan membuat booking dan selesaikan pembayaran.
Email konfirmasi harus berisi:
- Kode booking
- Detail paket tour
- Tanggal tour
- Total harga
- Kode booking yang jelas

---

## Konfigurasi WhatsApp (Fonnte)

### 1. Daftar Fonnte

1. Daftar di https://fonnte.com
2. Top up saldo (mulai dari Rp 10.000)
3. Dapatkan API Token dari dashboard

### 2. Update .env.local

```env
FONNTE_TOKEN="UCZhixxx_your_token_here"
ADMIN_WA_NUMBER="6281234567890"  # Format: 62 + nomor HP tanpa 0
```

### 3. Format Nomor HP

Sistem sudah otomatis memformat nomor HP:
- `081234567890` → `6281234567890`
- `+6281234567890` → `6281234567890`
- `6281234567890` → `6281234567890`

### Testing WhatsApp

Setelah konfigurasi, buat booking dan selesaikan pembayaran.
Pesan WhatsApp harus masuk berisi:
- Kode booking
- Detail paket tour
- Tanggal tour
- Total harga

---

## Konfigurasi Midtrans Dashboard

### 1. Set Payment Methods

1. Login ke https://dashboard.midtrans.com
2. Menu: **Settings > Payment Configuration**
3. Aktifkan metode pembayaran yang diinginkan:
   - [x] QRIS
   - [x] GoPay
   - [x] Bank Transfer (BCA, BNI, BRI, Permata, Mandiri)
   - [x] Convenience Store (Indomaret, Alfamart)
   - [x] Credit Card

### 2. Set Webhook URL

1. Menu: **Settings > Webhook**
2. Isi URL: `https://your-domain.com/api/payment/notification`
3. Untuk local development, gunakan ngrok:
   ```bash
   npx ngrok http 3001
   # Gunakan URL dari ngrok untuk webhook
   ```

### 3. Set Redirect URL (opsional)

1. Menu: **Settings > Snap Preferences**
2. Set redirect URLs:
   - Finish URL: `https://your-domain.com/booking/success`

---

## Troubleshooting

### QRIS/Gopay Tidak Muncul di Midtrans Popup

1. Pastikan `enabled_payments` sudah benar di kode
2. Cek apakah payment method tersebut aktif di dashboard Midtrans
3. Untuk QRIS, pastikan minimum amount tidak lebih besar dari transaksi

### Email Tidak Terkirim

1. Cek apakah credential SMTP sudah benar
2. Cek logs di server untuk error message
3. Untuk Gmail, pastikan App Password sudah benar (bukan password biasa)
4. Cek folder spam

### WhatsApp Tidak Masuk

1. Cek apakah FONNTE_TOKEN sudah benar
2. Cek apakah saldo Fonnte mencukupi
3. Cek format nomor HP (harus 62xxxxxxxxxx)
4. Cek logs di server untuk response dari Fonnte

### Struk Terpotong Saat Cetak

1. Tekan Ctrl+Shift+P (Print Preview)
2. Pastikan printer设置为 "Fit to Page" atau "Shrink to Fit"
3. CSS print sudah dioptimasi untuk struk A4

---

## Checklist Sebelum Launch

- [ ] Konfigurasi email SMTP dengan benar
- [ ] Konfigurasi Fonnte WhatsApp
- [ ] Midtrans diset ke Production mode
- [ ] Webhook URL diset dengan benar di dashboard Midtrans
- [ ] Payment methods diaktifkan di dashboard Midtrans
- [ ] Test pembayaran dengan QRIS
- [ ] Test pembayaran dengan Virtual Account
- [ ] Test email konfirmasi masuk
- [ ] Test WhatsApp notifikasi masuk
- [ ] Test cetak struk