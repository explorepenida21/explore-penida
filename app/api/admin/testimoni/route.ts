import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/testimoni
 * Get all testimonials (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isShow = searchParams.get('isShow')

    const where: any = {}
    if (isShow !== null) {
      where.isShow = isShow === 'true'
    }

    const testimoni = await prisma.testimoni.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: testimoni,
      total: testimoni.length,
    })
  } catch (error) {
    console.error('Error fetching testimoni:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch testimoni' }, { status: 500 })
  }
}

/**
 * POST /api/admin/testimoni
 * Create new testimonial
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nama, foto, rating, komentar, paketNama, isShow } = body

    if (!nama || !komentar || !rating) {
      return NextResponse.json(
        { success: false, error: 'Nama, rating, dan komentar wajib diisi' },
        { status: 400 }
      )
    }

    const testimoni = await prisma.testimoni.create({
      data: {
        nama,
        foto: foto || null,
        rating: parseInt(rating),
        komentar,
        paketNama: paketNama || '',
        isShow: isShow !== undefined ? isShow : true,
      },
    })

    return NextResponse.json({
      success: true,
      data: testimoni,
      message: 'Testimoni created successfully',
    })
  } catch (error) {
    console.error('Error creating testimoni:', error)
    return NextResponse.json({ success: false, error: 'Failed to create testimoni' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/testimoni
 * Update testimonial
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, nama, foto, rating, komentar, paketNama, isShow } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID wajib diisi' }, { status: 400 })
    }

    const testimoni = await prisma.testimoni.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(foto !== undefined && { foto }),
        ...(rating && { rating: parseInt(rating) }),
        ...(komentar && { komentar }),
        ...(paketNama !== undefined && { paketNama }),
        ...(isShow !== undefined && { isShow }),
      },
    })

    return NextResponse.json({
      success: true,
      data: testimoni,
      message: 'Testimoni updated successfully',
    })
  } catch (error) {
    console.error('Error updating testimoni:', error)
    return NextResponse.json({ success: false, error: 'Failed to update testimoni' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/testimoni
 * Delete testimonial
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID wajib diisi' }, { status: 400 })
    }

    await prisma.testimoni.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Testimoni deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting testimoni:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete testimoni' }, { status: 500 })
  }
}