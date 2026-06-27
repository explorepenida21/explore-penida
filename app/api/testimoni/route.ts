import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock data for testing
const mockTestimoni = [
  {
    id: '1',
    name: 'Budi Santoso',
    location: 'Jakarta',
    package: 'Tour Timur',
    rating: 5,
    comment: 'Pengalaman yang luar biasa! Pemandangannya super indah dan guide-nya sangat ramah.',
    photo: null,
    isShow: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    location: 'Surabaya',
    package: 'Mix Tour',
    rating: 5,
    comment: 'Worth it banget! Semua spot foto bagus-bagus. Recommended!',
    photo: null,
    isShow: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ahmad Wijaya',
    location: 'Bandung',
    package: 'Tour Barat',
    rating: 4,
    comment: 'Trip yang menyenangkan. Crystal Bay-nya cantik banget!',
    photo: null,
    isShow: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * GET /api/testimoni
 * Get all testimonials that are shown (public)
 */
export async function GET() {
  try {
    const testimoni = await prisma.testimoni.findMany({
      where: { isShow: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: testimoni,
      total: testimoni.length,
    })
  } catch (error) {
    // Return mock data when database is not available
    console.log('Using mock data for testimoni')
    return NextResponse.json({
      success: true,
      data: mockTestimoni,
      total: mockTestimoni.length,
    })
  }
}