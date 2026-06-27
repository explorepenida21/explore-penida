import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Upload file to Cloudinary
 */
export async function uploadImage(
  file: string,
  options?: {
    folder?: string
    publicId?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
  }
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  console.log('[Cloudinary] Upload starting...')
  console.log('[Cloudinary] Cloud Name:', cloudName)

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(`Missing Cloudinary credentials. Cloud: ${!!cloudName}, Key: ${!!apiKey}, Secret: ${!!apiSecret}`)
  }

  const folder = options?.folder || 'explore-penida'
  const resourceType = options?.resourceType || 'auto'

  try {
    // Use signed upload with SDK
    const result = await cloudinary.uploader.upload(file, {
      folder,
      public_id: options?.publicId,
      resource_type: resourceType,
    })

    console.log('[Cloudinary] Upload success:', result.secure_url)
    return result.secure_url
  } catch (error: any) {
    console.error('[Cloudinary] Upload error:', error)
    console.error('[Cloudinary] Error details:', JSON.stringify(error, null, 2))

    // If it's a signature error, try unsigned upload
    if (error?.error?.message?.includes('signature')) {
      console.log('[Cloudinary] Signature error, trying unsigned upload...')
      return await unsignedUpload(file, cloudName, apiKey, folder, resourceType)
    }

    throw error
  }
}

/**
 * Fallback unsigned upload
 */
async function unsignedUpload(
  file: string,
  cloudName: string,
  apiKey: string,
  folder: string,
  resourceType: string
): Promise<string> {
  const timestamp = Math.round(Date.now() / 1000)

  // Build FormData for unsigned upload
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  // Use 'ml_default' preset - Cloudinary's default unsigned preset
  formData.append('upload_preset', 'ml_default')

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
  console.log('[Cloudinary] Trying unsigned upload to:', url)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok) {
    console.error('[Cloudinary] Unsigned upload failed:', result)
    throw new Error(result.error?.message || 'Upload failed')
  }

  console.log('[Cloudinary] Unsigned upload success:', result.secure_url)
  return result.secure_url
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error)
    return false
  }
}
