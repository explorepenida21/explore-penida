import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/paket
 * Get all pakets (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const pakets = await prisma.paket.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: pakets,
      total: pakets.length,
    })
  } catch (error) {
    console.error('Error fetching pakets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pakets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/paket
 * Create new paket
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      nama,
      slug,
      tipe,
      harga,
      deskripsi,
      includes,
      destinasi,
      foto,
      isActive,
    } = body

    // Validate required fields
    if (!nama || !slug || !tipe || !harga || !deskripsi) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPaket = await prisma.paket.findUnique({
      where: { slug },
    })

    if (existingPaket) {
      return NextResponse.json(
        { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' },
        { status: 400 }
      )
    }

    const paket = await prisma.paket.create({
      data: {
        nama,
        slug,
        tipe,
        harga: parseInt(harga),
        deskripsi,
        includes: includes || [],
        destinasi: destinasi || [],
        foto: foto || [],
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json({
      success: true,
      data: paket,
      message: 'Paket created successfully',
    })
  } catch (error) {
    console.error('Error creating paket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create paket' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/paket
 * Update paket
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      nama,
      slug,
      tipe,
      harga,
      deskripsi,
      includes,
      destinasi,
      foto,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Paket ID required' },
        { status: 400 }
      )
    }

    // Check if slug already exists (for other paket)
    if (slug) {
      const existingPaket = await prisma.paket.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existingPaket) {
        return NextResponse.json(
          { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' },
          { status: 400 }
        )
      }
    }

    const paket = await prisma.paket.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(slug && { slug }),
        ...(tipe && { tipe }),
        ...(harga && { harga: parseInt(harga) }),
        ...(deskripsi && { deskripsi }),
        ...(includes && { includes }),
        ...(destinasi && { destinasi }),
        ...(foto && { foto }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      data: paket,
      message: 'Paket updated successfully',
    })
  } catch (error) {
    console.error('Error updating paket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update paket' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/paket
 * Delete a paket
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Paket ID required' },
        { status: 400 }
      )
    }

    // Check if paket has bookings
    const bookings = await prisma.booking.findFirst({
      where: { paketId: id },
    })

    if (bookings) {
      return NextResponse.json(
        { success: false, error: 'Tidak dapat menghapus paket yang sudah memiliki booking. Nonaktifkan saja.' },
        { status: 400 }
      )
    }

    await prisma.paket.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Paket deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting paket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete paket' },
      { status: 500 }
    )
  }
}