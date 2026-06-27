import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/destinasi/[id]
// Update destinasi (add/remove photos, update info)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { foto, nama, isActive } = body

    const updateData: any = {}

    if (foto !== undefined) {
      updateData.foto = foto
    }
    if (nama !== undefined) {
      updateData.nama = nama.trim()
      updateData.slug = nama.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    const destinasi = await prisma.destinasi.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: destinasi })
  } catch (error: any) {
    console.error('Error updating destinasi:', error)
    return NextResponse.json({ success: false, error: 'Gagal update destinasi' }, { status: 500 })
  }
}

// DELETE /api/admin/destinasi/[id]
// Delete destinasi
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.destinasi.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Destinasi dihapus' })
  } catch (error: any) {
    console.error('Error deleting destinasi:', error)
    return NextResponse.json({ success: false, error: 'Gagal hapus destinasi' }, { status: 500 })
  }
}
