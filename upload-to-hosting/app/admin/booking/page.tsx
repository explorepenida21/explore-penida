'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'

interface Paket {
  id: string
  nama: string
  slug: string
}

interface Booking {
  id: string
  kodeBooking: string
  namaPemesan: string
  email: string
  noHp: string
  paket: Paket
  tanggalTour: string
  jumlahOrang: number
  totalHarga: number
  status: string
  paymentStatus: string
  snapToken?: string
  catatan: string | null
  createdAt: string
}

interface FilterState {
  status: string
  paymentStatus: string
  paketId: string
  search: string
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filter, setFilter] = useState<FilterState>({
    status: '',
    paymentStatus: '',
    paketId: '',
    search: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'nama' | 'harga'>('terbaru')
  const itemsPerPage = 10

  const fetchData = useCallback(async () => {
    try {
      const [bookingRes, paketRes] = await Promise.all([
        fetch('/api/admin/booking'),
        fetch('/api/paket'),
      ])

      const bookingData = await bookingRes.json()
      const paketData = await paketRes.json()

      if (bookingData.success) {
        setBookings(bookingData.data || [])
      }
      if (paketData.success) {
        setPakets(paketData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const updateBookingStatus = async (id: string, newStatus: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/booking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
        )
        if (selectedBooking?.id === id) {
          setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null)
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(null)
    }
  }

  // Filter & Sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      if (filter.status && booking.status !== filter.status) return false
      if (filter.paymentStatus && booking.paymentStatus !== filter.paymentStatus) return false
      if (filter.paketId && booking.paket?.id !== filter.paketId) return false
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        if (
          !booking.kodeBooking.toLowerCase().includes(searchLower) &&
          !booking.namaPemesan.toLowerCase().includes(searchLower) &&
          !booking.email.toLowerCase().includes(searchLower) &&
          !booking.noHp.includes(filter.search)
        ) {
          return false
        }
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'terlama':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'nama':
          return a.namaPemesan.localeCompare(b.namaPemesan)
        case 'harga':
          return b.totalHarga - a.totalHarga
        case 'terbaru':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Helper function to check if booking is paid
  const isBookingPaid = (booking: Booking) => {
    return booking.paymentStatus === 'paid' || booking.status === 'confirmed' || booking.status === 'done'
  }

  // Stats
  const stats = {
    total: bookings.length,
    menunggu: bookings.filter(b => !isBookingPaid(b) && b.status !== 'cancelled').length,
    lunas: bookings.filter(b => isBookingPaid(b)).length,
    batal: bookings.filter(b => b.status === 'cancelled').length,
  }

  const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))

  // Generate WhatsApp link with pre-filled message
  const generateWhatsAppLink = (booking: Booking) => {
    const phoneNumber = booking.noHp.replace(/[^0-9]/g, '')

    // Check if booking is fully paid - check both paymentStatus and status
    const isPaid = booking.paymentStatus === 'paid' || booking.status === 'confirmed' || booking.status === 'done'
    const statusText = isPaid ? 'LUNAS ✅' : 'MENUNGGU PEMBAYARAN ⏳'

    // Get status description
    let statusDescription = ''
    if (isPaid) {
      statusDescription = '🎉 Booking Anda sudah terkonfirmasi! Sampai jumpa di Nusa Penida!'
    } else if (booking.status === 'cancelled') {
      statusDescription = '❌ Maaf, booking ini telah dibatalkan.'
    } else {
      statusDescription = '⚠️ Mohon segera lakukan pembayaran untuk mengaktifkan booking Anda.\n\nJangan ragu untuk bertanya jika ada yang perlu diklarifikasi. Kami siap membantu! 😊'
    }

    const message = `Halo ${booking.namaPemesan}! 👋

Terima kasih telah booking tour di *Explore Penida*!

📋 *Detail Booking:*
• Kode Booking: ${booking.kodeBooking}
• Paket: ${booking.paket?.nama || '-'}
• Tanggal Tour: ${formatDate(booking.tanggalTour)}
• Jumlah Peserta: ${booking.jumlahOrang} orang
• Total Bayar: ${formatRupiah(booking.totalHarga)}
• Status: *${statusText}*

${statusDescription}

Salam hangat,
Tim Explore Penida 🏝️`

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' || status === 'confirmed' || status === 'done') {
      return <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>Lunas</span>
    }
    if (status === 'cancelled') {
      return <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>Batal</span>
    }
    return <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold'>Menunggu</span>
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
          <h1 className='text-2xl font-bold text-navy-600'>Manajemen Booking</h1>
          <p className='text-gray-500'>Kelola semua booking dan update status pembayaran</p>
        </div>
        <button
          onClick={fetchData}
          className='px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl'>📋</div>
            <div>
              <p className='text-2xl font-bold text-navy-600'>{stats.total}</p>
              <p className='text-sm text-gray-500'>Total Booking</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl'>⏳</div>
            <div>
              <p className='text-2xl font-bold text-yellow-600'>{stats.menunggu}</p>
              <p className='text-sm text-gray-500'>Menunggu</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl'>✅</div>
            <div>
              <p className='text-2xl font-bold text-green-600'>{stats.lunas}</p>
              <p className='text-sm text-gray-500'>Lunas</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl'>❌</div>
            <div>
              <p className='text-2xl font-bold text-red-600'>{stats.batal}</p>
              <p className='text-sm text-gray-500'>Batal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-2xl p-6 shadow-sm mb-6'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[200px]'>
            <input
              type='text'
              placeholder='Cari kode/nama/email/HP...'
              value={filter.search}
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value })
                setCurrentPage(1)
              }}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
            />
          </div>
          <select
            value={filter.paymentStatus}
            onChange={(e) => {
              setFilter({ ...filter, paymentStatus: e.target.value })
              setCurrentPage(1)
            }}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
          >
            <option value=''>Semua Status</option>
            <option value='unpaid'>Menunggu</option>
            <option value='paid'>Lunas</option>
          </select>
          <select
            value={filter.paketId}
            onChange={(e) => {
              setFilter({ ...filter, paketId: e.target.value })
              setCurrentPage(1)
            }}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
          >
            <option value=''>Semua Paket</option>
            {pakets.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
          >
            <option value='terbaru'>Terbaru</option>
            <option value='terlama'>Terlama</option>
            <option value='nama'>Nama A-Z</option>
            <option value='harga'>Harga Tertinggi</option>
          </select>
          <button
            onClick={() => {
              setFilter({ status: '', paymentStatus: '', paketId: '', search: '' })
              setCurrentPage(1)
            }}
            className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200'
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Kode Booking</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Pemesan</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Paket</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Tanggal</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Jumlah</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Total</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className='px-6 py-12 text-center'>
                    <div className='text-5xl mb-4'>📭</div>
                    <p className='text-gray-500'>Tidak ada booking ditemukan</p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowModal(true)
                        }}
                        className='font-mono text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-2 py-1 rounded'
                      >
                        {booking.kodeBooking}
                      </button>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-navy-600'>{booking.namaPemesan}</p>
                      <p className='text-xs text-gray-500'>{booking.email}</p>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {booking.paket?.nama || '-'}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 whitespace-nowrap'>
                      {formatDate(booking.tanggalTour)}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>
                      {booking.jumlahOrang} org
                    </td>
                    <td className='px-6 py-4 font-semibold text-navy-600 whitespace-nowrap'>
                      {formatRupiah(booking.totalHarga)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {getStatusBadge(booking.status, booking.paymentStatus)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          disabled={updating === booking.id}
                          className='px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-medium hover:bg-green-200 disabled:opacity-50'
                        >
                          {updating === booking.id ? '...' : 'Konfirmasi'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowModal(true)
                          }}
                          className='px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-200'
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='px-6 py-4 border-t flex items-center justify-between'>
            <p className='text-sm text-gray-500'>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredBookings.length)} dari {filteredBookings.length}
            </p>
            <div className='flex gap-2'>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className='px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50'
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => (
                  <div key={page} className='flex items-center gap-1'>
                    {idx > 0 && arr[idx - 1] !== page - 1 && <span className='text-gray-400'>...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-teal-500 text-white' : 'bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className='px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50'
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedBooking && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b sticky top-0 bg-white rounded-t-3xl'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-navy-600'>Detail Booking</h2>
                <button onClick={() => setShowModal(false)} className='p-2 hover:bg-gray-100 rounded-lg'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='p-6 space-y-6'>
              {/* Kode Booking */}
              <div className='bg-teal-50 rounded-xl p-4 text-center'>
                <p className='text-sm text-teal-600 mb-1'>Kode Booking</p>
                <p className='text-2xl font-bold text-teal-700'>{selectedBooking.kodeBooking}</p>
              </div>

              {/* Info Pemesan */}
              <div>
                <h3 className='font-semibold text-navy-600 mb-3'>Informasi Pemesan</h3>
                <div className='bg-gray-50 rounded-xl p-4 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Nama</span>
                    <span className='font-medium'>{selectedBooking.namaPemesan}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Email</span>
                    <span className='font-medium'>{selectedBooking.email}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>No. HP</span>
                    <span className='font-medium'>{selectedBooking.noHp}</span>
                  </div>
                </div>
              </div>

              {/* Info Tour */}
              <div>
                <h3 className='font-semibold text-navy-600 mb-3'>Informasi Tour</h3>
                <div className='bg-gray-50 rounded-xl p-4 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Paket</span>
                    <span className='font-medium'>{selectedBooking.paket?.nama}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Tanggal</span>
                    <span className='font-medium'>{formatDate(selectedBooking.tanggalTour)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Jumlah</span>
                    <span className='font-medium'>{selectedBooking.jumlahOrang} orang</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Total Bayar</span>
                    <span className='font-bold text-teal-600'>{formatRupiah(selectedBooking.totalHarga)}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className='font-semibold text-navy-600 mb-3'>Status</h3>
                <div className='flex items-center gap-3'>
                  {getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus)}
                  <span className='text-sm text-gray-500'>
                    {selectedBooking.paymentStatus === 'paid' ? '✓ Terbayar' : '⏳ Menunggu pembayaran'}
                  </span>
                </div>
              </div>

              {/* Catatan */}
              {selectedBooking.catatan && (
                <div>
                  <h3 className='font-semibold text-navy-600 mb-3'>Catatan</h3>
                  <p className='bg-gray-50 rounded-xl p-4 text-sm text-gray-600'>{selectedBooking.catatan}</p>
                </div>
              )}

              {/* Actions */}
              <div className='space-y-3 pt-4 border-t'>
                {/* WhatsApp Button */}
                <a
                  href={generateWhatsAppLink(selectedBooking)}
                  target='_blank'
                  className='flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors'
                >
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/>
                  </svg>
                  Hubungi via WhatsApp
                </a>

                {/* Konfirmasi Bayar Button */}
                {selectedBooking.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'confirmed')
                      setShowModal(false)
                    }}
                    className='w-full px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors'
                  >
                    ✓ Konfirmasi Pembayaran
                  </button>
                )}

                {/* Status Info */}
                <div className='flex items-center justify-center gap-2 text-sm'>
                  {isBookingPaid(selectedBooking) ? (
                    <span className='text-green-600'>✓ Pembayaran sudah terkonfirmasi</span>
                  ) : (
                    <span className='text-yellow-600'>⏳ Menunggu pembayaran</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}