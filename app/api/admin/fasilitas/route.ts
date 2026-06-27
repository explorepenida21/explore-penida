import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth/options'

const prisma = new PrismaClient()

// GET - Get all fasilitas
export async function GET() {
  try {
    const fasilitas = await prisma.fasilitas.findMany({
      where: { isActive: true },
      orderBy: { urutan: 'asc' },
    })

    return NextResponse.json({ success: true, data: fasilitas })
  } catch (error) {
    console.error('Error fetching fasilitas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fasilitas' },
      { status: 500 }
    )
  }
}

// POST - Create new fasilitas
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { emoji, title, deskripsi, urutan } = body

    const fasilitas = await prisma.fasilitas.create({
      data: {
        emoji,
        title,
        deskripsi,
        urutan: urutan || 0,
      },
    })

    return NextResponse.json({ success: true, data: fasilitas })
  } catch (error) {
    console.error('Error creating fasilitas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create fasilitas' },
      { status: 500 }
    )
  }
}

// PUT - Update fasilitas
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, emoji, title, deskripsi, urutan, isActive } = body

    const fasilitas = await prisma.fasilitas.update({
      where: { id },
      data: {
        emoji,
        title,
        deskripsi,
        urutan,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: fasilitas })
  } catch (error) {
    console.error('Error updating fasilitas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update fasilitas' },
      { status: 500 }
    )
  }
}

// DELETE - Delete fasilitas
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    await prisma.fasilitas.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fasilitas:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete fasilitas' },
      { status: 500 }
    )
  }
}
