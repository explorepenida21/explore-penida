import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/destinasi
// Get all active destinations with photos (public)
export async function GET() {
  try {
    const destinasis = await prisma.destinasi.findMany({
      where: { isActive: true },
      orderBy: { nama: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: destinasis,
    })
  } catch (error) {
    console.error('Error fetching destinasis:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data destinasi' },
      { status: 500 }
    )
  }
}
