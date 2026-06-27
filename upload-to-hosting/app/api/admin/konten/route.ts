import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/konten
 * Get all destinasi with photos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get all unique destinations from paket's destinasi array
    const pakets = await prisma.paket.findMany({
      where: { isActive: true },
      select: { destinasi: true },
    })

    // Extract unique destinations
    const allDestinasi = new Set<string>()
    pakets.forEach((p) => {
      p.destinasi.forEach((d) => allDestinasi.add(d))
    })

    // For now, return a simple list - in production you'd have a separate Destinasi model
    const destinasiList = Array.from(allDestinasi).map((nama, index) => ({
      id: `dest-${index}`,
      nama,
      slug: nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      foto: [],
    }))

    return NextResponse.json({
      success: true,
      data: destinasiList,
    })
  } catch (error) {
    console.error('Error fetching konten:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch konten' }, { status: 500 })
  }
}