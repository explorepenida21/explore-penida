# DOMAIN & SSL DI VERCEL - LANGKAH LENGKAP

## APA ITU DOMAIN?
Domain adalah alamat website Anda, contoh: explorepenida.com
Tanpa domain, website hanya bisa diakses via URL Vercel.

---

# BAGIAN 1: BELI DOMAIN (JIKA BELUM PUNYA)

Beli di:
- Namecheap.com
- Niagahoster.co.id  
- Cloudflare.com

---

# BAGIAN 2: DAPATKAN DNS RECORDS DARI VERCEL

1. Buka https://vercel.com/dashboard
2. Klik project Anda
3. Settings → Domains
4. Ketik domain Anda, Klik Add
5. CATAT IP Address dan CNAME yang ditunjukkan

---

# BAGIAN 3: SETUP DNS DI REGISTRAR DOMAIN

## A. Namecheap:
1. Login namecheap.com
2. Domain List → Manage → Advanced DNS
3. ADD NEW RECORD:
   
   A Record:
   - Type: A
   - Host: @
   - Value: ISI_IP_DARI_VERCEL
   - TTL: Automatic
   
   CNAME Record:
   - Type: CNAME
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic

## B. Niagahoster:
1. Login clientarea.niagahoster.co.id
2. Produk Saya → Kelola DNS
3. Tambah Record:

   A Record:
   - Type: A
   - Name: @ atau explorepenida.com
   - Value: ISI_IP_DARI_VERCEL
   - TTL: 14400
   
   CNAME:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
   - TTL: 14400

## C. Cloudflare:
1. Login dash.cloudflare.com
2. Pilih domain
3. DNS → Add record

   A Record:
   - Type: A
   - Name: @ atau explorepenida.com
   - IPv4: ISI_IP_DARI_VERCEL
   - Proxy: DNS Only
   
   CNAME:
   - Type: CNAME
   - Name: www
   - Target: cname.vercel-dns.com
   - Proxy: DNS Only

---

# BAGIAN 4: VERIFIKASI DI VERCEL

1. Kembali ke Vercel → Settings → Domains
2. Cek status: harus VERIFIED (biasanya 5-30 menit)

---

# BAGIAN 5: TEST WEBSITE

Buka browser:
```
https://namadomain.com
```

Harus keluar website dengan HTTPS (gembok hijau).

---

# TROUBLESHOOTING

| Error | Solusi |
|-------|---------|
| Domain tidak verify | Tunggu 48 jam maks |
| SSL error | Tunggu 15 menit setelah verified |
| WWW tidak redirect | Enable di Vercel Domains Settings |

---

SELESAI! Website online di https://namadomain.com
