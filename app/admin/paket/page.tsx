'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'

interface Paket {
  id: string
  slug: string
  nama: string
  tipe: string
  harga: number
  deskripsi: string
  includes: string[]
  destinasi: string[]
  foto: string[]
  isActive: boolean
  createdAt: string
}

interface FormData {
  nama: string
  slug: string
  tipe: string
  harga: string
  deskripsi: string
  includes: string
  destinasi: string
  foto: string[]
  isActive: boolean
}

const initialFormData: FormData = {
  nama: '',
  slug: '',
  tipe: 'timur',
  harga: '',
  deskripsi: '',
  includes: '',
  destinasi: '',
  foto: [],
  isActive: true,
}

export default function AdminPaketPage() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPaket, setEditingPaket] = useState<Paket | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchPakets()
  }, [])

  const fetchPakets = async () => {
    try {
      const res = await fetch('/api/admin/paket')
      const data = await res.json()
      if (data.success) {
        setPakets(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching pakets:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (paket?: Paket) => {
    if (paket) {
      setEditingPaket(paket)
      setFormData({
        nama: paket.nama,
        slug: paket.slug,
        tipe: paket.tipe,
        harga: paket.harga.toString(),
        deskripsi: paket.deskripsi,
        includes: paket.includes.join('\n'),
        destinasi: paket.destinasi.join('\n'),
        foto: paket.foto || [],
        isActive: paket.isActive,
      })
    } else {
      setEditingPaket(null)
      setFormData(initialFormData)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPaket(null)
    setFormData(initialFormData)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      nama: name,
      slug: generateSlug(name),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('upload_preset', 'explore-penida')
        formDataUpload.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '')

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formDataUpload,
          }
        )

        const data = await response.json()
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url)
        } else if (data.error) {
          console.error('Cloudinary error:', data.error)
          alert(`Gagal upload: ${data.error.message}`)
        }
      }

      setFormData(prev => ({
        ...prev,
        foto: [...prev.foto, ...uploadedUrls],
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal upload gambar')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foto: prev.foto.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload: any = {
        nama: formData.nama,
        slug: formData.slug,
        tipe: formData.tipe,
        harga: parseInt(formData.harga),
        deskripsi: formData.deskripsi,
        includes: formData.includes.split('\n').filter(Boolean),
        destinasi: formData.destinasi.split('\n').filter(Boolean),
        foto: formData.foto,
        isActive: formData.isActive,
      }

      const url = editingPaket ? `/api/admin/paket` : '/api/admin/paket'
      const method = editingPaket ? 'PUT' : 'POST'

      if (editingPaket) {
        payload.id = editingPaket.id
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        await fetchPakets()
        closeModal()
      } else {
        alert(data.error || 'Gagal menyimpan paket')
      }
    } catch (error) {
      console.error('Error saving paket:', error)
      alert('Gagal menyimpan paket')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (paket: Paket) => {
    try {
      const res = await fetch('/api/admin/paket', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: paket.id,
          isActive: !paket.isActive,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setPakets(prev =>
          prev.map(p =>
            p.id === paket.id ? { ...p, isActive: !p.isActive } : p
          )
        )
      }
    } catch (error) {
      console.error('Error toggling paket:', error)
    }
  }

  const deletePaket = async (paket: Paket) => {
    if (!confirm(`Hapus paket "${paket.nama}"?`)) return

    try {
      const res = await fetch(`/api/admin/paket?id=${paket.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setPakets(prev => prev.filter(p => p.id !== paket.id))
      } else {
        alert(data.error || 'Gagal menghapus paket')
      }
    } catch (error) {
      console.error('Error deleting paket:', error)
      alert('Gagal menghapus paket')
    }
  }

  const formatRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const getTipeBadge = (tipe: string) => {
    const colors = {
      timur: 'bg-blue-100 text-blue-700',
      barat: 'bg-green-100 text-green-700',
      mix: 'bg-purple-100 text-purple-700',
    }
    return colors[tipe as keyof typeof colors] || 'bg-gray-100 text-gray-700'
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
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-navy-600'>Manajemen Paket Tour</h1>
          <p className='text-gray-500'>Tambah, edit, dan kelola paket tour yang tersedia</p>
        </div>
        <button
          onClick={() => openModal()}
          className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Tambah Paket
        </button>
      </div>

      {/* Paket Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {pakets.map((paket) => (
          <div
            key={paket.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
              !paket.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Image */}
            <div className='relative h-48 bg-gray-200'>
              {paket.foto && paket.foto[0] ? (
                <img
                  src={paket.foto[0]}
                  alt={paket.nama}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <svg className='w-16 h-16' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                </div>
              )}
              {/* Badge */}
              <div className='absolute top-3 left-3'>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipeBadge(paket.tipe)}`}>
                  {paket.tipe === 'timur' ? 'Tour Timur' : paket.tipe === 'barat' ? 'Tour Barat' : 'Mix Tour'}
                </span>
              </div>
              {/* Active Toggle */}
              <div className='absolute top-3 right-3'>
                <button
                  onClick={() => toggleActive(paket)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    paket.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                      paket.isActive ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='p-5'>
              <div className='flex items-start justify-between mb-3'>
                <h3 className='text-lg font-bold text-navy-600'>{paket.nama}</h3>
                <span className='text-lg font-bold text-teal-600'>
                  {formatRupiah(paket.harga)}
                </span>
              </div>
              <p className='text-sm text-gray-500 mb-3 line-clamp-2'>{paket.deskripsi}</p>

              {/* Destinasi */}
              <div className='flex flex-wrap gap-1 mb-4'>
                {paket.destinasi.slice(0, 3).map((dest, i) => (
                  <span key={i} className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded'>
                    {dest}
                  </span>
                ))}
                {paket.destinasi.length > 3 && (
                  <span className='text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded'>
                    +{paket.destinasi.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className='flex gap-2 pt-3 border-t border-gray-100'>
                <button
                  onClick={() => openModal(paket)}
                  className='flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => deletePaket(paket)}
                  className='px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pakets.length === 0 && (
        <div className='text-center py-20'>
          <div className='text-6xl mb-4'>🎫</div>
          <h3 className='text-xl font-semibold text-navy-600 mb-2'>Belum Ada Paket</h3>
          <p className='text-gray-500 mb-6'>Tambah paket tour pertama Anda</p>
          <button
            onClick={() => openModal()}
            className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors'
          >
            Tambah Paket
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-3xl z-10'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-navy-600'>
                  {editingPaket ? 'Edit Paket' : 'Tambah Paket Baru'}
                </h2>
                <button
                  onClick={closeModal}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              {/* Nama & Slug */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-navy-600 mb-1'>
                    Nama Paket <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.nama}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder='Contoh: Tour Timur Nusa Penida'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy-600 mb-1'>
                    Slug <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder='tour-timur'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  />
                </div>
              </div>

              {/* Tipe & Harga */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-navy-600 mb-1'>
                    Tipe <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  >
                    <option value='timur'>Tour Timur</option>
                    <option value='barat'>Tour Barat</option>
                    <option value='mix'>Mix Tour</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-navy-600 mb-1'>
                    Harga per Orang (Rp) <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    placeholder='550000'
                    required
                    min='0'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className='block text-sm font-medium text-navy-600 mb-1'>
                  Deskripsi <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder='Jelaskan tentang paket tour ini...'
                  required
                  rows={3}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
                />
              </div>

              {/* Destinasi */}
              <div>
                <label className='block text-sm font-medium text-navy-600 mb-1'>
                  Destinasi <span className='text-red-500'>*</span> (satu per baris)
                </label>
                <textarea
                  value={formData.destinasi}
                  onChange={(e) => setFormData({ ...formData, destinasi: e.target.value })}
                  placeholder='Diamond Beach&#10;Atuh Beach&#10;Tree House'
                  required
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
                />
              </div>

              {/* Includes */}
              <div>
                <label className='block text-sm font-medium text-navy-600 mb-1'>
                  Yang Termasuk (satu per baris)
                </label>
                <textarea
                  value={formData.includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  placeholder='Tiket Boat PP&#10;Makan Siang&#10;Mobil + Driver'
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
                />
              </div>

              {/* Photos */}
              <div>
                <label className='block text-sm font-medium text-navy-600 mb-1'>
                  Foto
                </label>
                <div className='border-2 border-dashed border-gray-300 rounded-xl p-4 text-center'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className='hidden'
                    id='image-upload'
                  />
                  <label
                    htmlFor='image-upload'
                    className='cursor-pointer flex flex-col items-center'
                  >
                    {uploadingImage ? (
                      <>
                        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3' />
                        <span className='text-gray-500'>Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <svg className='w-12 h-12 text-gray-400 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <span className='text-gray-500'>Klik untuk upload foto</span>
                        <span className='text-xs text-gray-400 mt-1'>PNG, JPG, max 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview Images */}
                {formData.foto.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {formData.foto.map((url, index) => (
                      <div key={index} className='relative w-20 h-20'>
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className='w-full h-full object-cover rounded-lg'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className='text-sm text-gray-600'>
                  {formData.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {/* Submit */}
              <div className='flex gap-3 pt-4 border-t border-gray-100'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  disabled={saving}
                  className='flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {saving ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      {editingPaket ? 'Simpan Perubahan' : 'Tambah Paket'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}