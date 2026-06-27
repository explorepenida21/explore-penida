import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock posts data (same as in route.ts)
const mockPosts: Record<string, any> = {
  'tips-traveling-nusa-penida-untuk-pemula': {
    id: '1',
    judul: '10 Tips Traveling ke Nusa Penida untuk Pemula',
    slug: 'tips-traveling-nusa-penida-untuk-pemula',
    konten: `Nusa Penida adalah salah satu destinasi wisata paling populer di Bali, Indonesia. Pulau ini terkenal dengan pantai-pantai eksotisnya, tebing-tebing yang spektakuler, dan pemandangan underwater yang memukau.

Bagi Anda yang pertama kali berkunjung ke Nusa Penida, berikut adalah 10 tips penting yang perlu diperhatikan:

1. **Pilih Waktu yang Tepat**
Waktu terbaik untuk visitar Nusa Penida adalah saat musim kemarau, yaitu antara April hingga Oktober. Cuaca cerah akan membuat perjalanan Anda lebih menyenangkan.

2. **Siapkan Transportasi yang Tepat**
Untuk berkeliling pulau, Anda perlu menyewa skuter atau mobil. Jalan di Nusa Penida cukup menantang dengan banyak tanjakan dan tikungan tajam.

3. **Bawa Sunscreen dan Topi**
Paparan matahari di pulau sangat kuat. Lindungi kulit Anda dengan sunscreen SPF 50+ dan gunakan topi saat berkeliling.

4. **Gunakan Sepatu Trekking**
Banyak destinasi memerlukan trekking untuk mencapainya. Sepatu trekking akan membantu Anda berjalan dengan nyaman di medan yang tidak rata.

5. **Bawa Cukup Air Minum**
Terutama saat cuaca panas, pastikan Anda selalu memiliki persediaan air minum yang cukup.

6. **Datang Lebih Awal**
Banyak destinasi populer seperti Kelingking Beach akan sangat ramai setelah jam 10 pagi. Datang lebih awal untuk menikmati pemandangan tanpa keramaian.

7. **Hormati Lokal**
Jaga perilaku Anda dan hormati budaya lokal. Mintalah izin sebelum memotret warga setempat.

8. **Bawa Uang Tunai**
Tidak semua tempat menerima pembayaran non-tunai. Pastikan Anda membawa cukup uang tunai.

9. **Perhatikan Kesehatan**
Gunakan obat anti mabuk jika Anda mudah mabuk perjalanan. Perjalanan boat ke Nusa Penida bisa cukup berombak.

10. **Booking Akomodasi Lebih Awal**
特别是 untuk musim liburan, hotel dan homestay di Nusa Penida bisa cepat penuh. Booking jauh-jauh hari adalah ide yang bagus.

Dengan mempersiapkan diri dengan baik, trip Anda ke Nusa Penida akan menjadi pengalaman yang tak terlupakan!`,
    excerpt: 'Persiapan penting sebelum berkunjung ke Nusa Penida. Dari transportasi, akomodasi, hingga spots foto terbaik yang harus dikunjungi.',
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    createdAt: '2024-06-01T10:00:00.000Z',
    kategori: 'Tips',
  },
  'best-time-kunjungi-kelingking-beach': {
    id: '2',
    judul: 'Best Time untuk Kunjungi Kelingking Beach',
    slug: 'best-time-kunjungi-kelingking-beach',
    konten: `Kelingking Beach adalah salah satu pantai paling ikonik di Nusa Penida. Dengan formasi tebing yang menyerupai T-Rex, tempat ini menjadi spot foto paling terkenal di Bali.

Namun, untuk mendapatkan pengalaman terbaik, timing adalah segalanya. Berikut panduan waktu terbaik untuk mengunjungi Kelingking Beach:

**Pagi Hari (06:00 - 09:00)**
Ini adalah waktu paling ideal. Anda bisa menikmati sunrise dari atas tebing dan turun ke pantai sebelum panasnya matahari. Sinar matahari pagi menciptakan warna biru yang sangat indah di laut.

**Sore Hari (15:00 - 17:00)**
Jika Anda tidak bisa datang pagi, sore hari juga options yang bagus. Terutama sekitar jam 4 sore, cahaya matahari mulai turun dan menciptakan golden hour yang sempurna untuk foto.

**Yang Harus Dihindari:**
- Jam 10 pagi hingga 2 siang: Matahari sangat terik dan beach akan sangat ramai
- Weekend dan hari libur: Tempat ini sangat padat pengunjung
- Hari hujan: Trekking turun bisa sangat licin dan berbahaya

**Tips Tambahan:**
1. Bawa air minum yang cukup
2. Gunakan sunscreen SPF tinggi
3. Gunakan sepatu yang kuat untuk trekking
4. Jangan lewatkan kesempatan untuk turun ke beach - pemandangannya spektakuler!

Kelingking Beach adalah destinasi wajib saat berkunjung ke Nusa Penida. Dengan timing yang tepat, Anda akan mendapatkan pengalaman yang tak terlupakan.`,
    excerpt: 'Kapan waktu terbaik untuk menikmati pemandangan spektakuler di Kelingking Beach? Berikut panduan lengkapnya untuk merencanakan trip Anda.',
    thumbnail: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80',
    createdAt: '2024-05-28T08:30:00.000Z',
    kategori: 'Destinasi',
  },
  'perbandingan-tour-timur-vs-tour-barat-nusa-penida': {
    id: '3',
    judul: 'Perbandingan Tour Timur vs Tour Barat Nusa Penida',
    slug: 'perbandingan-tour-timur-vs-tour-barat-nusa-penida',
    konten: `Nusa Penida memiliki dua rute tour utama: Tour Timur dan Tour Barat. Masing-masing menawarkan pengalaman unik yang berbeda. Mari kita bandingkan keduanya:

**Tour Barat**
Destinasi utama:
- Kelingking Beach
- Angel's Billabong
- Broken Beach
- Crystal Bay

Keunggulan:
- Spot foto paling ikonik (Kelingking)
- Lebih populer dan banyak informasi online
- Cocok untuk pertama kali berkunjung
- Banyak pilihan tour dan guide

Kelemahan:
- Lebih ramai pengunjung
- Perlu waktu lebih lama untuk mencapai beberapa spots
- Trekking cukup fisik di beberapa lokasi

**Tour Timur**
Destinasi utama:
- Diamond Beach
- Atuh Beach
- Tree House (Rumah Pohon)
- Telaga Waspada

Keunggulan:
- Pemandangan yang lebih dramatis
- Lebih tenang dan kurang ramai
- Spot foto yang tidak kalah Instagram-worthy
- Pengalaman yang lebih autentik

Kelemahan:
- Akses ke beberapa tempat lebih sulit
- Fasilitas lebih terbatas
- Butuh kendaraan yang lebih kuat (medan lebih berat)

**Mix Tour**
Jika waktu dan budget memungkinkan, Mix Tour adalah pilihan terbaik karena menggabungkan yang terbaik dari kedua sisi pulau.

**Mana yang Harus Dipilih?**
- First timer: Tour Barat
- Untuk ketenangan: Tour Timur
- Unlimited time: Mix Tour
- Photography enthusiasts: Keduanya!`,
    excerpt: 'Memilih antara tour timur atau barat? Berikut perbandingan lengkap untuk membantu Anda decide destinasi mana yang lebih cocok.',
    thumbnail: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80',
    createdAt: '2024-05-20T14:00:00.000Z',
    kategori: 'Guide',
  },
  'snorkeling-di-crystal-bay-panduan-lengkap': {
    id: '4',
    judul: 'Snorkeling di Crystal Bay: Panduan Lengkap',
    slug: 'snorkeling-di-crystal-bay-panduan-lengkap',
    konten: `Crystal Bay adalah surga bagi para penyelam dan snorkeler. Dengan air yang sangat jernih dan ekosistem laut yang kaya, tempat ini wajib dikunjungi.

**Kenapa Crystal Bay?**

1. **Air Sangat Jernih**
Terlihat hingga kedalaman 15-20 meter. Warna biru yang beautiful akan membuat Anda terpesona.

2. **Ragam Biota Laut**
Anda bisa melihat berbagai jenis ikan tropis, kura-kura laut, dan bahkan sometimes pari manta!

3. **Arus yang Relatif Tenang**
Cocok untuk beginner snorkelers. Arus di sini tidak terlalu kuat dibandingkan spots lain.

**Tips Snorkeling:**

1. **Waktu Terbaik**
Pagi hari, sekitar jam 7-9 pagi adalah waktu terbaik. Air masih tenang dan visibility maximal.

2. **Bawa Snorkel Gear Sendiri**
 Meskipun bisa disewa di tempat, membawa equipment sendiri lebih hygiene dan nyaman.

3. **Jangan Sentuh Terumbu Karang**
 Ini sangat penting untuk menjaga ekosistem laut. Cukup lihat dan nikmati saja.

4. **Perhatikan Arus**
 Meskipun relatif tenang, tetap waspada terhadap arus yang bisa berubah.

5. **Jangan Makan Sebelum Snorkeling**
 Ini untuk menghindari mabuk laut dan uncomfortable feeling.

**Yang Perlu Dibawa:**
- Sunscreen waterproof
- Towel
- Dry bag untuk electronics
- Underwater camera (opsional tapi recommended)

Crystal Bay akan给您留下深刻的印象！`,
    excerpt: 'Crystal Bay bukan hanya cantik untuk dilihat, tapi juga surga bagi para snorkeler. Berikut pengalaman dan tips snorkeling di sini.',
    thumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    createdAt: '2024-05-15T09:00:00.000Z',
    kategori: 'Activity',
  },
  'budget-trip-nusa-penida-under-500rb': {
    id: '5',
    judul: 'Budget Trip Nusa Penida: 2 Hari 1 Malam Under 500rb',
    slug: 'budget-trip-nusa-penida-under-500rb',
    konten: `Travel dengan budget limited bukan berarti tidak bisa menikmati Nusa Penida! Dengan planning yang tepat, Anda bisa menjelajahi pulau surga ini dengan budget di bawah 500rb.

**Rincian Budget:**

**Transportasi:**
- Boat Sanur-Nusa Penida: Rp 80.000 - 100.000 (one way)
- Sewa skuter: Rp 70.000 - 100.000 per hari
- Total transportasi: Rp 250.000 - 300.000

**Akomodasi:**
- Hostel/dorm: Rp 50.000 - 100.000 per malam
- Atau camping di beach (gratis jika punya equipment)

**Makan:**
- Warung lokal: Rp 15.000 - 30.000 per meal
- Budget makan: Rp 75.000 - 120.000 per hari

**Tiket Destinasi:**
- Kebanyakan spots gratis
- Beberapa spots private butuh tiket Rp 5.000 - 10.000

**Tips Hemat:**

1. **Pergi Weekday**
Harga lebih murah dan tempat lebih sepi.

2. **Sewa Skuter**
Lebih murah daripada sewa mobil + driver.

3. **Makan di Warung Lokal**
Makanan enak dengan harga bersahabat.

4. **Bawa Snacks**
Untuk cemilan selama touring.

5. **Bawa Botol Minum Isi Ulang**
Hemat uang dan ramah lingkungan.

6. **Camping Instead of Hotel**
Pengalaman unik yang gratis!

**Itinerary 2 Hari 1 Malam:**

Day 1: Kelingking Beach → Angel's Billabong → Broken Beach → Crystal Bay
Day 2: Diamond Beach → Atuh Beach → Tree House → Telaga Waspada

Dengan budget 500rb, Anda bisa merasakan magic Nusa Penida tanpa membuat dompet menangis!`,
    excerpt: 'Travel hemat ke Nusa Penida? Dengan planning yang tepat, Anda bisa explore keindahan pulau ini dengan budget terbatas.',
    thumbnail: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
    createdAt: '2024-05-10T11:30:00.000Z',
    kategori: 'Budget',
  },
  'diamond-beach-pantai-tersembunyi': {
    id: '6',
    judul: 'Diamond Beach: Pantai Tersembunyi yang Memukau',
    slug: 'diamond-beach-pantai-tersembunyi',
    konten: `Diamond Beach adalah salah satu hidden gems di Nusa Penida yang kini menjadi salah satu destinasi paling fotogenic di Bali.

**Sejarah Singkat**

Beberapa tahun lalu, Diamond Beach hampir tidak dikenal. Aksesnya sangat sulit dengan tebing yang curam dan berbahaya. Namun kini, dengan pembangunan tangga kayu yang indah, siapa saja bisa menikmati keindahan pantai ini.

**Yang Membuat Diamond Beach Istimewa:**

1. **Tangga Kayu Ikonik**
Tangga kayu yang dibangun khusus untuk mengakses pantai ini menjadi spot foto yang sangat populer. Frame sempurna untuk foto Instagram Anda!

2. **Pantai dengan Pasir Putih**
Tidak seperti banyak pantai di Nusa Penida yang berbatu, Diamond Beach memiliki pasir putih yang lembut dan bersih.

3. **Tebing Berbentuk Berlian**
Dari atas, formasi tebing terlihat seperti bentuk berlian, memberikan pemandangan yang sangat unik.

4. **Air laut yang Jernih**
Air yang sangat jernih memungkinkan Anda melihat下面的珊瑚和鱼类。

**Tips Mengunjungi:**

- Datang pagi hari untuk menghindari antrian foto
- Gunakan sunscreen karena tidak ada banyak tempat teduh
- Bawa air minum yang cukup
- Jangan lewatkan kesempatan turun ke pantai
- Waktu terbaik: sunrise atau sunset

Diamond Beach adalah bukti bahwa Nusa Penida penuh dengan keajaiban alam yang menunggu untuk ditemukan. Jangan lewatkan destinasi ini dalam trip Anda!`,
    excerpt: 'Dulu sulit dijangkau, kini Diamond Beach jadi salah satu spots paling fotogenic di Nusa Penida. Berikut sejarah dan keindahannya.',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    createdAt: '2024-05-05T16:00:00.000Z',
    kategori: 'Destinasi',
  },
}

// Get all slugs for reference
const allSlugs = Object.keys(mockPosts)

/**
 * GET /api/blog/[slug]
 * Get single blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      // Check if slug exists in mock data
      const mockPost = mockPosts[slug]
      if (mockPost) {
        // Get related posts (other mock posts)
        const relatedPosts = allSlugs
          .filter(s => s !== slug)
          .slice(0, 3)
          .map(s => ({
            id: mockPosts[s].id,
            judul: mockPosts[s].judul,
            slug: mockPosts[s].slug,
            thumbnail: mockPosts[s].thumbnail,
            createdAt: mockPosts[s].createdAt,
          }))

        return NextResponse.json({
          success: true,
          data: {
            ...mockPost,
            excerpt: mockPost.konten.substring(0, 200) + (mockPost.konten.length > 200 ? '...' : ''),
          },
          relatedPosts,
        })
      }

      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get related posts (same category or latest posts)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        isPublish: true,
        NOT: { id: post.id },
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        thumbnail: true,
        createdAt: true,
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        excerpt: post.konten.substring(0, 200) + (post.konten.length > 200 ? '...' : ''),
      },
      relatedPosts,
    })
  } catch (error) {
    // Fallback to mock data if database fails
    const slug = new URL(request.url).pathname.split('/').pop() || ''
    const mockPost = mockPosts[slug]

    if (mockPost) {
      const relatedPosts = allSlugs
        .filter(s => s !== slug)
        .slice(0, 3)
        .map(s => ({
          id: mockPosts[s].id,
          judul: mockPosts[s].judul,
          slug: mockPosts[s].slug,
          thumbnail: mockPosts[s].thumbnail,
          createdAt: mockPosts[s].createdAt,
        }))

      return NextResponse.json({
        success: true,
        data: {
          ...mockPost,
          excerpt: mockPost.konten.substring(0, 200) + (mockPost.konten.length > 200 ? '...' : ''),
        },
        relatedPosts,
      })
    }

    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}