'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'

interface Paket { id: string; nama: string; slug: string }

interface Schedule {
  id: string
  paketId: string
  paket?: { nama: string }
  kapasitas: number
  tersisa: number
  tanggal: string
  isTutup: boolean
}

export default function AdminJadwalPage() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPaket, setSelectedPaket] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ paketId: '', kapasitas: 15, isTutup: false })
  const [selectedDate, setSelectedDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [month, setMonth] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => { fetchPakets() }, [])
  useEffect(() => { fetchSchedules(); setCurrentPage(1) }, [month, selectedPaket])

  const fetchPakets = async () => {
    try {
      const res = await fetch('/api/paket')
      const data = await res.json()
      if (data.success) setPakets(data.data || [])
    } catch (e) { console.error(e) }
  }

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const m = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
      let url = `/api/admin/jadwal?month=${m}`
      if (selectedPaket) url += `&paketId=${selectedPaket}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setSchedules(data.data || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const prevMonth = () => {
    const d = new Date(month)
    d.setMonth(d.getMonth() - 1)
    setMonth(d)
  }

  const nextMonth = () => {
    const d = new Date(month)
    d.setMonth(d.getMonth() + 1)
    setMonth(d)
  }

  const openModal = (tanggal: string, schedule?: Schedule) => {
    setSelectedDate(tanggal)
    if (schedule) {
      setForm({ paketId: schedule.paketId, kapasitas: schedule.kapasitas, isTutup: schedule.isTutup })
    } else {
      setForm({ paketId: selectedPaket, kapasitas: 15, isTutup: false })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.paketId) {
      alert('Pilih paket')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paketId: form.paketId, tanggal: selectedDate, kapasitas: form.kapasitas, isTutup: form.isTutup }),
      })
      const data = await res.json()
      if (data.success) {
        fetchSchedules()
        setShowModal(false)
        alert(data.message)
      } else {
        alert(data.error || 'Gagal menyimpan jadwal')
      }
    } catch {
      alert('Error')
    }
    setSaving(false)
  }

  const toggleTutup = async (schedule: Schedule) => {
    const action = schedule.isTutup ? 'Buka' : 'Tutup'
    if (!confirm(`Yakin ingin ${action} jadwal ini?`)) return

    try {
      const res = await fetch('/api/admin/jadwal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: schedule.id, isTutup: !schedule.isTutup }),
      })
      const data = await res.json()
      if (data.success) {
        fetchSchedules()
      } else {
        alert(data.error || 'Gagal update jadwal')
      }
    } catch {
      alert('Error')
    }
  }

  const handleDelete = async (schedule: Schedule) => {
    if (!confirm('Yakin ingin hapus jadwal ini?')) return
    try {
      const res = await fetch(`/api/admin/jadwal?id=${schedule.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchSchedules()
      } else {
        alert(data.error || 'Gagal hapus jadwal')
      }
    } catch {
      alert('Error')
    }
  }

  const monthName = month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  // Pagination
  const totalPages = Math.ceil(schedules.length / itemsPerPage)
  const paginatedSchedules = schedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, s) => {
    if (!acc[s.tanggal]) acc[s.tanggal] = []
    acc[s.tanggal].push(s)
    return acc
  }, {} as Record<string, Schedule[]>)

  return (
    <div className='p-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Manajemen Jadwal</h1>
          <p className='text-gray-500'>Atur kapasitas dan jadwal tour per paket</p>
        </div>
        <div className='text-sm text-gray-500'>
          {schedules.length} jadwal ditemukan
        </div>
      </div>

      {/* Filter */}
      <div className='bg-white rounded-xl p-4 shadow-sm mb-6'>
        <div className='flex flex-wrap gap-4 items-center'>
          <select
            value={selectedPaket}
            onChange={e => setSelectedPaket(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
          >
            <option value=''>Semua Paket</option>
            {pakets.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
        <div className='flex items-center justify-between p-4 border-b bg-gray-50'>
          <button onClick={prevMonth} className='px-4 py-2 hover:bg-gray-200 rounded-lg font-medium'>←</button>
          <b className='text-lg'>{monthName}</b>
          <button onClick={nextMonth} className='px-4 py-2 hover:bg-gray-200 rounded-lg font-medium'>→</button>
        </div>
        <div className='grid grid-cols-7 border-b'>
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
            <div key={d} className='p-3 text-center text-xs font-semibold text-gray-500 bg-gray-50'>{d}</div>
          ))}
        </div>
        <div className='grid grid-cols-7'>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className='min-h-[90px] bg-gray-50 border-r border-b' />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = new Date(month.getFullYear(), month.getMonth(), i + 1)
            const dateStr = d.toISOString().split('T')[0]
            const daySchedules = schedulesByDate[dateStr] || []
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const isPast = d < today
            return (
              <div
                key={dateStr}
                className={`min-h-[90px] p-2 border-r border-b ${isPast ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className={`text-sm font-medium ${isPast ? 'text-gray-400' : 'text-gray-700'}`}>{i + 1}</div>
                {daySchedules.length > 0 && !isPast && (
                  <div className='mt-1 space-y-1'>
                    {daySchedules.slice(0, 2).map(s => (
                      <button
                        key={s.id}
                        onClick={() => openModal(dateStr, s)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate ${
                          s.isTutup ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {s.paket?.nama?.slice(0, 8) || 'Paket'} {s.isTutup ? '✕' : `${s.tersisa}/${s.kapasitas}`}
                      </button>
                    ))}
                    {daySchedules.length > 2 && (
                      <div className='text-xs text-gray-500 pl-2'>+{daySchedules.length - 2} lagi</div>
                    )}
                  </div>
                )}
                {!isPast && (
                  <button
                    onClick={() => openModal(dateStr)}
                    className='mt-1 w-full text-xs text-teal-600 hover:text-teal-700 font-medium opacity-0 hover:opacity-100 transition-opacity'
                  >
                    + Tambah
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Schedule List */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h3 className='font-bold text-gray-900'>Daftar Jadwal</h3>
          <span className='text-sm text-gray-500'>{schedules.length} jadwal</span>
        </div>

        {loading ? (
          <div className='p-8 text-center'>
            <div className='w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto' />
          </div>
        ) : schedules.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            <div className='text-4xl mb-4'>📅</div>
            <p>Belum ada jadwal untuk bulan ini</p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Tanggal</th>
                    <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Paket</th>
                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase'>Kapasitas</th>
                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase'>Tersisa</th>
                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase'>Status</th>
                    <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase'>Aksi</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {paginatedSchedules.map(s => (
                    <tr key={s.id} className='hover:bg-gray-50'>
                      <td className='px-4 py-3 text-sm text-gray-900'>
                        {new Date(s.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className='px-4 py-3 text-sm font-medium text-gray-900'>{s.paket?.nama || '-'}</td>
                      <td className='px-4 py-3 text-center text-sm text-gray-600'>{s.kapasitas}</td>
                      <td className='px-4 py-3 text-center'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          s.tersisa <= 0 ? 'bg-red-100 text-red-700' :
                          s.tersisa <= 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {s.tersisa}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <button
                          onClick={() => toggleTutup(s)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            s.isTutup ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {s.isTutup ? 'TUTUP' : 'BUKA'}
                        </button>
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <button
                          onClick={() => openModal(s.tanggal, s)}
                          className='px-3 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className='px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded ml-1'
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex items-center justify-between p-4 border-t bg-gray-50'>
                <span className='text-sm text-gray-500'>
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, schedules.length)} dari {schedules.length}
                </span>
                <div className='flex gap-1'>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1.5 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 hover:bg-gray-100'
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((page, idx, arr) => (
                      <div key={page} className='flex'>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className='px-2 text-gray-400'>...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            currentPage === page ? 'bg-teal-500 text-white' : 'bg-white border hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1.5 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 hover:bg-gray-100'
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Atur Jadwal</h2>
            <p className='text-sm text-gray-500 mb-4'>
              Tanggal: {selectedDate}
            </p>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Paket</label>
                <select
                  value={form.paketId}
                  onChange={e => setForm({ ...form, paketId: e.target.value })}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                >
                  <option value=''>Pilih Paket</option>
                  {pakets.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Kapasitas</label>
                <input
                  type='number'
                  value={form.kapasitas}
                  onChange={e => setForm({ ...form, kapasitas: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={50}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                />
              </div>
              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div>
                  <span className='font-medium text-gray-900'>Status Jadwal</span>
                  <p className='text-sm text-gray-500'>{form.isTutup ? 'Jadwal ditutup' : 'Jadwal terbuka'}</p>
                </div>
                <button
                  type='button'
                  onClick={() => setForm({ ...form, isTutup: !form.isTutup })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${form.isTutup ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.isTutup ? 'translate-x-7' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200'
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.paketId}
                  className='flex-1 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 disabled:opacity-50'
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
