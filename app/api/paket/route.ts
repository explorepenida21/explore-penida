import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pakets = await prisma.paket.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: pakets })
  } catch (error) {
    console.error('Error fetching pakets:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data paket' },
      { status: 500 }
    )
  }
}