import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock data for testing when database is not available
const mockPosts = [
  {
    id: '1',
    judul: '10 Tips Traveling ke Nusa Penida untuk Pemula',
    slug: 'tips-traveling-nusa-penida-untuk-pemula',
    excerpt: 'Persiapan penting sebelum berkunjung ke Nusa Penida. Dari transportasi, akomodasi, hingga spots foto terbaik yang harus dikunjungi.',
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    createdAt: '2024-06-01T10:00:00.000Z',
  },
  {
    id: '2',
    judul: 'Best Time untuk Kunjungi Kelingking Beach',
    slug: 'best-time-kunjungi-kelingking-beach',
    excerpt: 'Kapan waktu terbaik untuk menikmati pemandangan spektakuler di Kelingking Beach? Berikut panduan lengkapnya untuk merencanakan trip Anda.',
    thumbnail: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80',
    createdAt: '2024-05-28T08:30:00.000Z',
  },
  {
    id: '3',
    judul: 'Perbandingan Tour Timur vs Tour Barat Nusa Penida',
    slug: 'perbandingan-tour-timur-vs-tour-barat-nusa-penida',
    excerpt: 'Memilih antara tour timur atau barat? Berikut perbandingan lengkap untuk membantu Anda decide destinasi mana yang lebih cocok.',
    thumbnail: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80',
    createdAt: '2024-05-20T14:00:00.000Z',
  },
  {
    id: '4',
    judul: 'Snorkeling di Crystal Bay: Panduan Lengkap',
    slug: 'snorkeling-di-crystal-bay-panduan-lengkap',
    excerpt: 'Crystal Bay bukan hanya cantik untuk dilihat, tapi juga surga bagi para snorkeler. Berikut pengalaman dan tips snorkeling di sini.',
    thumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    createdAt: '2024-05-15T09:00:00.000Z',
  },
  {
    id: '5',
    judul: 'Budget Trip Nusa Penida: 2 Hari 1 Malam Under 500rb',
    slug: 'budget-trip-nusa-penida-under-500rb',
    excerpt: 'Travel hemat ke Nusa Penida? Dengan planning yang tepat, Anda bisa explore keindahan pulau ini dengan budget terbatas.',
    thumbnail: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
    createdAt: '2024-05-10T11:30:00.000Z',
  },
  {
    id: '6',
    judul: 'Diamond Beach: Pantai Tersembunyi yang Memukau',
    slug: 'diamond-beach-pantai-tersembunyi',
    excerpt: 'Dulu sulit dijangkau, kini Diamond Beach jadi salah satu spots paling fotogenic di Nusa Penida. Berikut sejarah dan keindahannya.',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    createdAt: '2024-05-05T16:00:00.000Z',
  },
]

/**
 * GET /api/blog
 * Get all published blog posts (public)
 */
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        isPublish: true,
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        konten: true,
        thumbnail: true,
        isPublish: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Add excerpt
    const postsWithExcerpt = posts.map(post => ({
      ...post,
      excerpt: post.konten.substring(0, 200) + (post.konten.length > 200 ? '...' : ''),
    }))

    return NextResponse.json({
      success: true,
      data: postsWithExcerpt,
      total: posts.length,
    })
  } catch (error) {
    // Return mock data when database is not available
    console.log('Using mock data for blog posts')
    return NextResponse.json({
      success: true,
      data: mockPosts,
      total: mockPosts.length,
    })
  }
}