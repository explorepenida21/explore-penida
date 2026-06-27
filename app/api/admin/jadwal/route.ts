import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/jadwal
 * Get all schedules
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paketId = searchParams.get('paketId')
    const month = searchParams.get('month') // Format: YYYY-MM
    const year = searchParams.get('year')

    const where: any = {}

    if (paketId) {
      where.paketId = paketId
    }

    if (month) {
      const [year, monthNum] = month.split('-').map(Number)
      const startDate = new Date(year, monthNum - 1, 1)
      const endDate = new Date(year, monthNum, 0)
      where.tanggal = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (year) {
      const startDate = new Date(parseInt(year), 0, 1)
      const endDate = new Date(parseInt(year), 11, 31)
      where.tanggal = {
        gte: startDate,
        lte: endDate,
      }
    }

    const schedules = await prisma.jadwalTour.findMany({
      where,
      include: {
        paket: {
          select: {
            id: true,
            nama: true,
            slug: true,
          },
        },
      },
      orderBy: {
        tanggal: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: schedules,
      total: schedules.length,
    })
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

/**
 * POST /api/admin/jadwal
 * Create or update schedule
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { paketId, tanggal, kapasitas, isTutup } = body

    if (!paketId || !tanggal) {
      return NextResponse.json({ success: false, error: 'paketId dan tanggal wajib diisi' }, { status: 400 })
    }

    // Parse date and normalize to start of day
    const scheduleDate = new Date(tanggal)
    scheduleDate.setHours(0, 0, 0, 0)

    // Check if schedule exists
    const existing = await prisma.jadwalTour.findFirst({
      where: {
        paketId,
        tanggal: scheduleDate,
      },
    })

    if (existing) {
      // Update existing
      const updated = await prisma.jadwalTour.update({
        where: { id: existing.id },
        data: {
          kapasitas: kapasitas !== undefined ? parseInt(kapasitas) : existing.kapasitas,
          tersisa: kapasitas !== undefined ? parseInt(kapasitas) : existing.kapasitas,
          isTutup: isTutup !== undefined ? isTutup : existing.isTutup,
        },
        include: {
          paket: {
            select: { id: true, nama: true, slug: true },
          },
        },
      })

      return NextResponse.json({ success: true, data: updated, message: 'Jadwal diupdate' })
    } else {
      // Create new
      const newSchedule = await prisma.jadwalTour.create({
        data: {
          paketId,
          tanggal: scheduleDate,
          kapasitas: parseInt(kapasitas) || 15,
          tersisa: parseInt(kapasitas) || 15,
          isTutup: isTutup || false,
        },
        include: {
          paket: {
            select: { id: true, nama: true, slug: true },
          },
        },
      })

      return NextResponse.json({ success: true, data: newSchedule, message: 'Jadwal dibuat' })
    }
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json({ success: false, error: 'Failed to create schedule' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/jadwal
 * Update schedule
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, kapasitas, tersisa, isTutup } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID jadwal wajib diisi' }, { status: 400 })
    }

    const updated = await prisma.jadwalTour.update({
      where: { id },
      data: {
        ...(kapasitas !== undefined && { kapasitas: parseInt(kapasitas) }),
        ...(tersisa !== undefined && { tersisa: parseInt(tersisa) }),
        ...(isTutup !== undefined && { isTutup }),
      },
      include: {
        paket: {
          select: { id: true, nama: true, slug: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated, message: 'Jadwal diupdate' })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json({ success: false, error: 'Failed to update schedule' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/jadwal
 * Delete schedule
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
      return NextResponse.json({ success: false, error: 'ID jadwal wajib diisi' }, { status: 400 })
    }

    await prisma.jadwalTour.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Jadwal dihapus' })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete schedule' }, { status: 500 })
  }
}