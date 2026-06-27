import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

// GET /api/admin/destinasi
// Get all destinasi with photos
export async function GET() {
  try {
    const destinasis = await prisma.destinasi.findMany({
      orderBy: { nama: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: destinasis,
    })
  } catch (error) {
    console.error('Error fetching destinasis:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data destinasi' }, { status: 500 })
  }
}

// POST /api/admin/destinasi
// Create new destinasi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nama } = body

    if (!nama || !nama.trim()) {
      return NextResponse.json({ success: false, error: 'Nama destinasi wajib diisi' }, { status: 400 })
    }

    const trimmedNama = nama.trim()
    const slug = trimmedNama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if already exists
    const existing = await prisma.destinasi.findFirst({
      where: {
        OR: [
          { nama: trimmedNama },
          { slug: slug }
        ]
      },
    })

    if (existing) {
      return NextResponse.json({ success: false, error: 'Destinasi sudah ada' }, { status: 400 })
    }

    const destinasi = await prisma.destinasi.create({
      data: {
        nama: trimmedNama,
        slug,
        foto: [],
      },
    })

    return NextResponse.json({ success: true, data: destinasi })
  } catch (error) {
    console.error('Error creating destinasi:', error)
    return NextResponse.json({ success: false, error: 'Gagal membuat destinasi' }, { status: 500 })
  }
}
