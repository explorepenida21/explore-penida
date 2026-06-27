'use client'

import { useState, useRef } from 'react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  type?: 'image' | 'video'
  accept?: string
  maxSizeMB?: number
  label?: string
  placeholder?: string
}

export default function ImageUploader({
  value,
  onChange,
  type = 'image',
  accept,
  maxSizeMB = 10,
  label,
  placeholder = 'Klik atau drag file ke sini untuk upload'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = accept || (type === 'video'
    ? 'video/mp4,video/webm,video/ogg'
    : 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon')

  const maxSize = maxSizeMB * 1024 * 1024

  const handleFile = async (file: File) => {
    setError(null)

    // Allowed image types including ICO for favicon
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']

    // Validate file type
    if (type === 'video') {
      if (!['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
        setError('Format video tidak valid. Gunakan MP4, WebM, atau OGG')
        return
      }
    } else {
      if (!allowedImageTypes.includes(file.type)) {
        setError('Format gambar tidak valid. Gunakan JPEG, PNG, GIF, WebP, SVG, atau ICO')
        return
      }
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File terlalu besar. Maksimal ${maxSizeMB}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/upload?type=${type}`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onChange(data.url)
      } else {
        setError(data.error || 'Upload gagal')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Terjadi kesalahan saat upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Preview or Dropzone */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          {type === 'video' ? (
            <video
              src={value}
              controls
              className="w-full h-48 object-cover bg-gray-100"
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover bg-gray-100"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Hapus"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Mengupload...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                {type === 'video' ? (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">
                Maksimal {maxSizeMB}MB • {type === 'video' ? 'MP4, WebM, OGG' : 'JPEG, PNG, GIF, WebP'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* URL Input (Alternative) */}
      {value && (
        <div className="mt-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Atau paste URL langsung..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  )
}
