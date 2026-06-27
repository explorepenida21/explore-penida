import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================================
// Paket Data
// ============================================================
const pakets = [
  {
    slug: 'tour-timur',
    nama: 'Tour Timur Nusa Penida',
    tipe: 'timur',
    harga: 550000,
    deskripsi: 'Jelajahi keindahan sisi timur Nusa Penida dengan 5 destinasi terbaik.',
    includes: ['Tiket Boat PP', 'Makan Siang Tradisional', 'Mobil + Driver + Bensin', 'Driver merangkap Fotografer', 'Tiket Masuk Semua Destinasi'],
    destinasi: ['Diamond Beach', 'Atuh Beach', 'Tree House', 'Thousand Islands Viewpoint', 'Suwehan Beach'],
    foto: [],
    isActive: true,
  },
  {
    slug: 'tour-barat',
    nama: 'Tour Barat Nusa Penida',
    tipe: 'barat',
    harga: 550000,
    deskripsi: 'Nikmati pesona sisi barat Nusa Penida dengan spot foto ikonik dunia.',
    includes: ['Tiket Boat PP', 'Makan Siang Tradisional', 'Mobil + Driver + Bensin', 'Driver merangkap Fotografer', 'Tiket Masuk Semua Destinasi'],
    destinasi: ['Kelingking Beach', "Angel's Billabong", 'Broken Beach', 'Crystal Bay', 'Palung Cliff'],
    foto: [],
    isActive: true,
  },
  {
    slug: 'mix-tour',
    nama: 'Mix Tour Barat & Timur',
    tipe: 'mix',
    harga: 650000,
    deskripsi: 'Paket terlengkap! Gabungan destinasi terbaik barat dan timur Nusa Penida.',
    includes: ['Tiket Boat PP', 'Makan Siang Tradisional', 'Mobil + Driver + Bensin', 'Driver merangkap Fotografer', 'Tiket Masuk Semua Destinasi'],
    destinasi: ['Kelingking Beach', "Angel's Billabong", 'Broken Beach', 'Diamond Beach', 'Atuh Beach', 'Tree House'],
    foto: [],
    isActive: true,
  },
]

// ============================================================
// Seed Function
// ============================================================
async function main() {
  console.log('🌱 Starting seed...')

  // ============================================================
  // 1. Seed Admin User
  // ============================================================
  console.log('\n👤 Creating admin user...')

  // Generate bcrypt hash for password: "admin123"
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@explorepenida.com' },
    update: {},
    create: {
      email: 'admin@explorepenida.com',
      password: hashedPassword,
      nama: 'Administrator',
      role: 'admin',
    },
  })

  console.log(`✅ Admin user created: ${adminUser.email}`)
  console.log(`   Password: admin123`)

  // ============================================================
  // 2. Seed Pakets
  // ============================================================
  console.log('\n🎫 Creating pakets...')

  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.paket.deleteMany()

  for (const paket of pakets) {
    const created = await prisma.paket.create({
      data: paket,
    })
    console.log(`✅ Created paket: ${created.nama} (${created.slug})`)
  }

  // ============================================================
  // 3. Seed Testimonials
  // ============================================================
  console.log('\n⭐ Creating testimonials...')

  const testimonials = [
    {
      nama: 'Sarah Wijaya',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      komentar: 'Pengalaman yang luar biasa! Guide sangat ramah dan helpful. Pemandangannya super indah!',
      paketNama: 'Tour Timur',
      isShow: true,
    },
    {
      nama: 'Budi Santoso',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      komentar: 'Kelingking Beach-nya amazing! Wajib banget dikunjungi kalau ke Bali.',
      paketNama: 'Tour Barat',
      isShow: true,
    },
    {
      nama: 'Anita Putri',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5,
      komentar: 'Best decision banget pilih paket Mix Tour! Semua destinasi terbaik bisa dikunjungi.',
      paketNama: 'Mix Tour',
      isShow: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimoni.create({
      data: testimonial,
    })
  }

  console.log('✅ Created 3 testimonials')

  // ============================================================
  // 4. Seed Chat FAQ
  // ============================================================
  console.log('\n🤖 Creating chat FAQs...')

  const faqs = [
    {
      keyword: 'harga',
      jawaban: 'Harga tour kami mulai dari Rp 550.000/orang untuk Tour Timur atau Barat, dan Rp 650.000/orang untuk Mix Tour. Harga sudah termasuk boat PP, makan siang, mobil, driver, dan tiket destinasi.',
      isActive: true,
    },
    {
      keyword: 'waktu',
      jawaban: 'Durasi tour adalah 1 hari penuh (full day), mulai dari penjemputan di hotel pukul 07.00 dan selesai sekitar pukul 18.00.',
      isActive: true,
    },
    {
      keyword: 'booking',
      jawaban: 'Anda bisa booking melalui website kami di halaman /booking, atau langsung hubungi WhatsApp kami di +62 812 3456 7890.',
      isActive: true,
    },
    {
      keyword: 'cancel',
      jawaban: 'Pembatalan dapat dilakukan max 24 jam sebelum tour. Refund akan diproses sesuai kebijakan refund kami.',
      isActive: true,
    },
  ]

  for (const faq of faqs) {
    await prisma.chatFAQ.create({
      data: faq,
    })
  }

  console.log('✅ Created 4 chat FAQs')

  // ============================================================
  // Summary
  // ============================================================
  console.log('\n═══════════════════════════════════════════')
  console.log('✨ Seed completed successfully!')
  console.log('═══════════════════════════════════════════')
  console.log('\n📋 Admin Login:')
  console.log('   Email: admin@explorepenida.com')
  console.log('   Password: admin123')
  console.log('\n🌐 URL Login Admin:')
  console.log('   http://localhost:3000/admin/login')
  console.log('═══════════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })