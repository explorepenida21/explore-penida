'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'

interface Testimoni {
  id: string
  nama: string
  foto: string | null
  rating: number
  komentar: string
  paketNama: string
  isShow: boolean
  createdAt: string
}

interface FormData {
  nama: string
  foto: string
  rating: number
  komentar: string
  paketNama: string
  isShow: boolean
}

export default function AdminTestimoniPage() {
  const [testimonis, setTestimonis] = useState<Testimoni[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({
    nama: '',
    foto: '',
    rating: 5,
    komentar: '',
    paketNama: '',
    isShow: true,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTestimonis()
  }, [])

  const fetchTestimonis = async () => {
    try {
      const res = await fetch('/api/admin/testimoni')
      const data = await res.json()
      if (data.success) {
        setTestimonis(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching testimoni:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (testimoni?: Testimoni) => {
    if (testimoni) {
      setEditingId(testimoni.id)
      setForm({
        nama: testimoni.nama,
        foto: testimoni.foto || '',
        rating: testimoni.rating,
        komentar: testimoni.komentar,
        paketNama: testimoni.paketNama || '',
        isShow: testimoni.isShow,
      })
    } else {
      setEditingId(null)
      setForm({
        nama: '',
        foto: '',
        rating: 5,
        komentar: '',
        paketNama: '',
        isShow: true,
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({
      nama: '',
      foto: '',
      rating: 5,
      komentar: '',
      paketNama: '',
      isShow: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/testimoni'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (data.success) {
        await fetchTestimonis()
        closeModal()
      } else {
        alert(data.error || 'Gagal menyimpan testimoni')
      }
    } catch (error) {
      console.error('Error saving testimoni:', error)
      alert('Gagal menyimpan testimoni')
    } finally {
      setSaving(false)
    }
  }

  const toggleShow = async (testimoni: Testimoni) => {
    try {
      const res = await fetch('/api/admin/testimoni', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: testimoni.id,
          isShow: !testimoni.isShow,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setTestimonis(prev =>
          prev.map(t =>
            t.id === testimoni.id ? { ...t, isShow: !t.isShow } : t
          )
        )
      }
    } catch (error) {
      console.error('Error toggling testimoni:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return

    try {
      const res = await fetch(`/api/admin/testimoni?id=${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setTestimonis(prev => prev.filter(t => t.id !== id))
      } else {
        alert(data.error || 'Gagal menghapus testimoni')
      }
    } catch (error) {
      console.error('Error deleting testimoni:', error)
    }
  }

  const paketOptions = ['Tour Timur', 'Tour Barat', 'Mix Tour', 'General']

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
          <h1 className='text-2xl font-bold text-navy-600'>Testimoni & Review</h1>
          <p className='text-gray-500'>Kelola testimoni customer yang ditampilkan di website</p>
        </div>
        <button
          onClick={() => openModal()}
          className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Tambah Testimoni
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📝</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-navy-600'>{testimonis.length}</p>
              <p className='text-sm text-gray-500'>Total Testimoni</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-green-600'>{testimonis.filter(t => t.isShow).length}</p>
              <p className='text-sm text-gray-500'>Ditampilkan</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>⏸️</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-600'>{testimonis.filter(t => !t.isShow).length}</p>
              <p className='text-sm text-gray-500'>Draft</p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Pemesan</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Rating</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Komentar</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Paket</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                <th className='px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {testimonis.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50 ${!t.isShow ? 'opacity-60' : ''}`}>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden'>
                        {t.foto ? (
                          <img src={t.foto} alt={t.nama} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            {t.nama.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className='font-medium text-navy-600'>{t.nama}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-0.5'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < t.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className='text-sm text-gray-600 max-w-xs truncate'>{t.komentar}</p>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium'>
                      {t.paketNama || 'General'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => toggleShow(t)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.isShow
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {t.isShow ? 'Ditampilkan' : 'Draft'}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => openModal(t)}
                        className='p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonis.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                    Belum ada testimoni
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-navy-600'>
                  {editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}
                </h2>
                <button onClick={closeModal} className='p-2 hover:bg-gray-100 rounded-lg'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nama <span className='text-red-500'>*</span></label>
                <input
                  type='text'
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder='Nama lengkap customer'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Foto URL</label>
                <input
                  type='url'
                  value={form.foto}
                  onChange={(e) => setForm({ ...form, foto: e.target.value })}
                  placeholder='https://...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                />
                {form.foto && (
                  <img src={form.foto} alt='Preview' className='mt-2 w-16 h-16 rounded-full object-cover' />
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Rating <span className='text-red-500'>*</span></label>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type='button'
                      onClick={() => setForm({ ...form, rating: r })}
                      className={`text-3xl ${r <= form.rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Komentar <span className='text-red-500'>*</span></label>
                <textarea
                  value={form.komentar}
                  onChange={(e) => setForm({ ...form, komentar: e.target.value })}
                  placeholder='Isi testimoni customer...'
                  required
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Paket</label>
                <select
                  value={form.paketNama}
                  onChange={(e) => setForm({ ...form, paketNama: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                >
                  <option value=''>Pilih Paket</option>
                  {paketOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setForm({ ...form, isShow: !form.isShow })}
                  className={`w-12 h-6 rounded-full transition-colors ${form.isShow ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${form.isShow ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className='text-sm text-gray-600'>
                  {form.isShow ? 'Ditampilkan di website' : 'Disimpan sebagai draft'}
                </span>
              </div>

              <div className='flex gap-3 pt-4 border-t'>
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
                    'Simpan'
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