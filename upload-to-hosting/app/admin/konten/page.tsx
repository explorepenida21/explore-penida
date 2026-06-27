'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState, useRef } from 'react'

interface Destinasi {
  id: string
  nama: string
  slug: string
  foto: string[]
  isActive: boolean
}

export default function AdminKontenPage() {
  const [destinasis, setDestinasis] = useState<Destinasi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDestinasi, setSelectedDestinasi] = useState<Destinasi | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDestinasiName, setNewDestinasiName] = useState('')
  const [savingDestinasi, setSavingDestinasi] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDestinasis()
  }, [])

  const fetchDestinasis = async () => {
    try {
      const res = await fetch('/api/admin/destinasi')
      const data = await res.json()
      if (data.success) {
        setDestinasis(data.data || [])
        if (data.data?.length > 0 && !selectedDestinasi) {
          setSelectedDestinasi(data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching destinasis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDestinasi = async () => {
    if (!newDestinasiName.trim()) {
      alert('Nama destinasi wajib diisi')
      return
    }

    setSavingDestinasi(true)
    try {
      const res = await fetch('/api/admin/destinasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newDestinasiName.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setDestinasis([...destinasis, data.data])
        setSelectedDestinasi(data.data)
        setShowAddModal(false)
        setNewDestinasiName('')
      } else {
        alert(data.error || 'Gagal menambah destinasi')
      }
    } catch (error) {
      console.error('Error adding destinasi:', error)
      alert('Error')
    } finally {
      setSavingDestinasi(false)
    }
  }

  const handleDeleteDestinasi = async (destinasi: Destinasi) => {
    if (!confirm(`Yakin ingin hapus "${destinasi.nama}" dan semua fotonya?`)) return

    try {
      const res = await fetch(`/api/admin/destinasi/${destinasi.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setDestinasis(destinasis.filter(d => d.id !== destinasi.id))
        if (selectedDestinasi?.id === destinasi.id) {
          setSelectedDestinasi(destinasis.find(d => d.id !== destinasi.id) || null)
        }
      } else {
        alert(data.error || 'Gagal hapus destinasi')
      }
    } catch (error) {
      console.error('Error deleting destinasi:', error)
      alert('Error')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedDestinasi) return

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Create form data for Cloudinary upload
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload?type=image', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        if (result.success && result.url) {
          uploadedUrls.push(result.url)
        }
      }

      if (uploadedUrls.length > 0) {
        // Update database
        const updatedFoto = [...(selectedDestinasi.foto || []), ...uploadedUrls]
        await saveFotoToDb(selectedDestinasi.id, updatedFoto)
      } else {
        alert('Gagal upload foto')
      }

    } catch (error) {
      console.error('Error uploading photos:', error)
      alert('Gagal upload foto')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const saveFotoToDb = async (destinasiId: string, foto: string[]) => {
    try {
      const res = await fetch(`/api/admin/destinasi/${destinasiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foto }),
      })
      const data = await res.json()
      if (data.success) {
        // Update local state
        setDestinasis(prev => prev.map(d => d.id === destinasiId ? { ...d, foto } : d))
        setSelectedDestinasi(prev => prev ? { ...prev, foto } : null)
      } else {
        alert(data.error || 'Gagal simpan foto')
      }
    } catch (error) {
      console.error('Error saving foto:', error)
    }
  }

  const deletePhoto = async (destinasiId: string, index: number) => {
    if (!confirm('Yakin ingin hapus foto ini?')) return

    const destinasi = destinasis.find(d => d.id === destinasiId)
    if (!destinasi) return

    const updatedFoto = destinasi.foto.filter((_, i) => i !== index)
    await saveFotoToDb(destinasiId, updatedFoto)
  }

  const movePhoto = async (destinasiId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    const destinasi = destinasis.find(d => d.id === destinasiId)
    if (!destinasi) return

    const newFoto = [...destinasi.foto]
    const [removed] = newFoto.splice(fromIndex, 1)
    newFoto.splice(toIndex, 0, removed)

    await saveFotoToDb(destinasiId, newFoto)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Galeri & Media</h1>
          <p className='text-gray-500'>Kelola foto destinasi tour</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='px-4 py-2 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Tambah Destinasi
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Destinasi List */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl shadow-sm p-4'>
            <h3 className='font-semibold text-gray-900 mb-4'>Destinasi</h3>
            {destinasis.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <div className='text-4xl mb-2'>🏝️</div>
                <p className='text-sm'>Belum ada destinasi</p>
              </div>
            ) : (
              <div className='space-y-2'>
                {destinasis.map((destinasi) => (
                  <div
                    key={destinasi.id}
                    className={`group relative rounded-xl transition-all ${
                      selectedDestinasi?.id === destinasi.id
                        ? 'bg-teal-50 border border-teal-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedDestinasi(destinasi)}
                      className='w-full text-left p-3 flex items-center gap-3'
                    >
                      <div className='w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0'>
                        {destinasi.foto?.[0] ? (
                          <img src={destinasi.foto[0]} alt={destinasi.nama} className='w-full h-full object-cover' />
                        ) : (
                          <span className='text-2xl'>🏝️</span>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 truncate'>{destinasi.nama}</p>
                        <p className='text-xs text-gray-500'>{destinasi.foto?.length || 0} foto</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteDestinasi(destinasi)}
                      className='absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-opacity'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className='lg:col-span-3'>
          {selectedDestinasi ? (
            <div className='bg-white rounded-2xl shadow-sm'>
              {/* Header */}
              <div className='p-6 border-b flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>{selectedDestinasi.nama}</h2>
                  <p className='text-gray-500 text-sm'>{selectedDestinasi.foto?.length || 0} foto</p>
                </div>
                <div>
                  <input
                    type='file'
                    ref={fileInputRef}
                    accept='image/*'
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className='hidden'
                    id='photo-upload'
                  />
                  <label
                    htmlFor='photo-upload'
                    className={`px-6 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2 transition-colors ${
                      uploading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                        </svg>
                        Tambah Foto
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Tips */}
              <div className='p-4 bg-blue-50 border-b'>
                <div className='flex items-start gap-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <span>💡</span>
                  </div>
                  <div>
                    <p className='font-medium text-blue-800 text-sm'>Tips</p>
                    <p className='text-sm text-blue-600'>
                      Klik tombol ← → untuk mengubah urutan foto. Foto pertama akan menjadi cover utama destinasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              <div className='p-6'>
                {selectedDestinasi.foto && selectedDestinasi.foto.length > 0 ? (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {selectedDestinasi.foto.map((url, index) => (
                      <div
                        key={index}
                        className='relative aspect-square rounded-xl overflow-hidden group bg-gray-100'
                      >
                        <img
                          src={url}
                          alt={`${selectedDestinasi.nama} ${index + 1}`}
                          className='w-full h-full object-cover'
                        />

                        {/* Controls */}
                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                          {/* Move Left */}
                          <button
                            onClick={() => movePhoto(selectedDestinasi.id, index, index - 1)}
                            disabled={index === 0}
                            className='p-2 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deletePhoto(selectedDestinasi.id, index)}
                            className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>

                          {/* Move Right */}
                          <button
                            onClick={() => movePhoto(selectedDestinasi.id, index, index + 1)}
                            disabled={index === selectedDestinasi.foto.length - 1}
                            className='p-2 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </button>
                        </div>

                        {/* Cover Badge */}
                        {index === 0 && (
                          <div className='absolute top-2 left-2 px-2 py-1 bg-teal-500 text-white text-xs font-semibold rounded-lg'>
                            Cover
                          </div>
                        )}

                        {/* Index Badge */}
                        <div className='absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded-lg'>
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-16'>
                    <div className='text-6xl mb-4'>📷</div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Belum Ada Foto</h3>
                    <p className='text-gray-500 mb-6'>Upload foto untuk destinasi ini</p>
                    <label
                      htmlFor='photo-upload'
                      className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl cursor-pointer hover:bg-teal-600 transition-colors inline-flex items-center gap-2'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                      </svg>
                      Upload Foto
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-2xl shadow-sm p-12 text-center'>
              <div className='text-6xl mb-4'>🏝️</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>Pilih Destinasi</h3>
              <p className='text-gray-500'>Pilih destinasi di sebelah kiri untuk mengelola foto</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Destinasi Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Tambah Destinasi</h2>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nama Destinasi</label>
              <input
                type='text'
                value={newDestinasiName}
                onChange={(e) => setNewDestinasiName(e.target.value)}
                placeholder='Contoh: Kelingking Beach'
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              />
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => { setShowAddModal(false); setNewDestinasiName('') }}
                className='flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200'
              >
                Batal
              </button>
              <button
                onClick={handleAddDestinasi}
                disabled={savingDestinasi}
                className='flex-1 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 disabled:opacity-50'
              >
                {savingDestinasi ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
