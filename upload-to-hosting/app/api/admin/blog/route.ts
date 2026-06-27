import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/blog
 * Get all blog posts (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isPublish = searchParams.get('isPublish')

    const where: any = {}
    if (isPublish !== null) {
      where.isPublish = isPublish === 'true'
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

/**
 * POST /api/admin/blog
 * Create new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { judul, slug, konten, thumbnail, isPublish } = body

    if (!judul || !konten) {
      return NextResponse.json(
        { success: false, error: 'Judul dan konten wajib diisi' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: finalSlug },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        judul,
        slug: finalSlug,
        konten,
        thumbnail: thumbnail || null,
        isPublish: isPublish || false,
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/blog
 * Update blog post
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, judul, slug, konten, thumbnail, isPublish } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID wajib diisi' }, { status: 400 })
    }

    // Check if slug exists (for other posts)
    if (slug) {
      const existing = await prisma.blogPost.findFirst({
        where: { slug, NOT: { id } },
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (judul !== undefined) updateData.judul = judul
    if (slug !== undefined) updateData.slug = slug
    if (konten !== undefined) updateData.konten = konten
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail

    // Handle publish status
    if (isPublish !== undefined) {
      updateData.isPublish = isPublish
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/blog
 * Delete blog post
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

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 })
  }
}