'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'

interface FAQItem {
  id: string
  keyword: string
  jawaban: string
  isActive: boolean
}

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    keyword: 'harga',
    jawaban: 'Harga tour kami mulai dari Rp 550.000/orang untuk Tour Timur atau Barat, dan Rp 650.000/orang untuk Mix Tour. Harga sudah termasuk boat PP, makan siang, mobil, driver, dan tiket destinasi.',
    isActive: true,
  },
  {
    id: '2',
    keyword: 'waktu',
    jawaban: 'Durasi tour adalah 1 hari penuh (full day), mulai dari penjemputan di hotel pukul 07.00 dan selesai sekitar pukul 18.00.',
    isActive: true,
  },
  {
    id: '3',
    keyword: 'booking',
    jawaban: 'Anda bisa booking melalui website kami di halaman /booking, atau langsung hubungi WhatsApp kami di +62 812 3456 7890.',
    isActive: true,
  },
  {
    id: '4',
    keyword: 'pembatalan',
    jawaban: 'Pembatalan dapat dilakukan max 24 jam sebelum tour. Refund akan diproses dalam 3-5 hari kerja.',
    isActive: true,
  },
  {
    id: '5',
    keyword: 'destinasi',
    jawaban: 'Destinasi kami meliputi Kelingking Beach, Angel\'s Billabong, Broken Beach, Diamond Beach, Atuh Beach, Tree House, dan banyak lagi!',
    isActive: true,
  },
]

export default function AdminChatbotPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ keyword: '', jawaban: '' })
  const [newForm, setNewForm] = useState({ keyword: '', jawaban: '' })
  const [showNewForm, setShowNewForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleEdit = (faq: FAQItem) => {
    setEditingId(faq.id)
    setEditForm({ keyword: faq.keyword, jawaban: faq.jawaban })
  }

  const handleSaveEdit = () => {
    setFaqs(prev =>
      prev.map(f =>
        f.id === editingId
          ? { ...f, keyword: editForm.keyword, jawaban: editForm.jawaban }
          : f
      )
    )
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ keyword: '', jawaban: '' })
  }

  const handleToggleActive = (id: string) => {
    setFaqs(prev =>
      prev.map(f =>
        f.id === id ? { ...f, isActive: !f.isActive } : f
      )
    )
  }

  const handleDelete = (id: string) => {
    if (confirm('Hapus FAQ ini?')) {
      setFaqs(prev => prev.filter(f => f.id !== id))
    }
  }

  const handleAddNew = () => {
    if (!newForm.keyword.trim() || !newForm.jawaban.trim()) return

    setSaving(true)
    setTimeout(() => {
      setFaqs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          keyword: newForm.keyword,
          jawaban: newForm.jawaban,
          isActive: true,
        },
      ])
      setNewForm({ keyword: '', jawaban: '' })
      setShowNewForm(false)
      setSaving(false)
    }, 500)
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-navy-600'>Konfigurasi Chatbot AI</h1>
          <p className='text-gray-500'>Kelola FAQ dan response chatbot untuk website</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Tambah FAQ
        </button>
      </div>

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0'>
            <span className='text-xl'>🤖</span>
          </div>
          <div>
            <h3 className='font-semibold text-blue-800 mb-1'>AI Chatbot Configuration</h3>
            <p className='text-sm text-blue-600'>
              Chatbot menggunakan AI (Claude) untuk menjawab pertanyaan pengunjung secara otomatis.
              FAQ di bawah ini digunakan sebagai fallback/knowledge base tambahan.
              Untuk pertanyaan kompleks, chatbot akan mengarahkan ke WhatsApp admin.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Form */}
      {showNewForm && (
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-8 border-2 border-teal-200'>
          <h3 className='font-semibold text-navy-600 mb-4'>Tambah FAQ Baru</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-gray-600 mb-1'>Keyword / Trigger</label>
              <input
                type='text'
                value={newForm.keyword}
                onChange={(e) => setNewForm({ ...newForm, keyword: e.target.value })}
                placeholder='Contoh: harga, booking, waktu'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
              <p className='text-xs text-gray-500 mt-1'>Kata kunci yang akan trigger jawaban ini</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-600 mb-1'>Jawaban</label>
              <input
                type='text'
                value={newForm.jawaban}
                onChange={(e) => setNewForm({ ...newForm, jawaban: e.target.value })}
                placeholder='Jawaban yang akan diberikan'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={handleAddNew}
              disabled={saving || !newForm.keyword.trim() || !newForm.jawaban.trim()}
              className='px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50'
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={() => {
                setShowNewForm(false)
                setNewForm({ keyword: '', jawaban: '' })
              }}
              className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h3 className='text-lg font-bold text-navy-600'>Daftar FAQ ({faqs.length})</h3>
        </div>
        <div className='divide-y divide-gray-100'>
          {faqs.map((faq) => (
            <div key={faq.id} className={`p-6 ${!faq.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
              {editingId === faq.id ? (
                // Edit Mode
                <div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Keyword</label>
                      <input
                        type='text'
                        value={editForm.keyword}
                        onChange={(e) => setEditForm({ ...editForm, keyword: e.target.value })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-600 mb-1'>Jawaban</label>
                      <input
                        type='text'
                        value={editForm.jawaban}
                        onChange={(e) => setEditForm({ ...editForm, jawaban: e.target.value })}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                      />
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={handleSaveEdit}
                      className='px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors'
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='px-2 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium'>
                        {faq.keyword}
                      </span>
                      {!faq.isActive && (
                        <span className='px-2 py-1 bg-gray-200 text-gray-500 rounded-lg text-xs'>
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p className='text-gray-600'>{faq.jawaban}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleToggleActive(faq.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        faq.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={faq.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {faq.isActive ? (
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                      ) : (
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(faq)}
                      className='p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* API Info */}
      <div className='bg-gray-100 rounded-xl p-6 mt-8'>
        <h4 className='font-semibold text-navy-600 mb-2'>Informasi API</h4>
        <div className='text-sm text-gray-600 space-y-1'>
          <p><strong>Endpoint:</strong> POST /api/chat</p>
          <p><strong>Model:</strong> claude-3-5-haiku-20241022</p>
          <p><strong>Temperature:</strong> 0.7 (balanced creativity)</p>
          <p><strong>Max Tokens:</strong> 1024</p>
        </div>
      </div>
    </div>
  )
}