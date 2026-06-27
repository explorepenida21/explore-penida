import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

/**
 * POST /api/upload
 * Upload file (image/video) to Cloudinary
 *
 * Body: FormData with 'file' field
 * Query: ?type=image|video (default: image)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Get file type from query or detect from file
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'image'

    console.log('[Upload API] Received file:', file.name, 'Type:', file.type, 'Size:', file.size)
    console.log('[Upload API] Upload type:', type)

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']

    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid video format. Allowed: MP4, WebM, OGG' },
        { status: 400 }
      )
    }

    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP, SVG' },
        { status: 400 }
      )
    }

    // Max file size: 10MB for images, 50MB for videos
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size: ${type === 'video' ? '50MB' : '10MB'}` },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    console.log('[Upload API] Converting to base64, length:', base64.length)

    // Determine folder and resource type based on type
    const folder = type === 'video' ? 'explore-penida/videos' : 'explore-penida/images'
    const resourceType = type === 'video' ? 'video' : 'image'

    console.log('[Upload API] Uploading to Cloudinary with resourceType:', resourceType)

    // Upload to Cloudinary
    const url = await uploadImage(dataUri, {
      folder,
      resourceType
    })

    console.log('[Upload API] Success! URL:', url)

    return NextResponse.json({
      success: true,
      url,
      filename: file.name,
      type,
    })

  } catch (error: any) {
    console.error('[Upload API] Error:', error)
    console.error('[Upload API] Error message:', error?.message)
    console.error('[Upload API] Error details:', error?.response || error?.stack)

    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
