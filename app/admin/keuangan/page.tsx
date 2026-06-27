'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState, useMemo } from 'react'

interface Paket {
  id: string
  nama: string
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
  createdAt: string
}

interface MonthlyStats {
  month: string
  monthName: string
  year: number
  totalBooking: number
  totalPaid: number
  totalPending: number
  revenue: number
  paidRevenue: number
}

interface FilterState {
  month: string
  year: string
  status: string
  paketId: string
}

const ITEMS_PER_PAGE = 12

export default function AdminKeuanganPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<FilterState>({
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString(),
    status: '',
    paketId: '',
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  // Helper function to check if booking is paid
  const isBookingPaid = (booking: Booking) => {
    return booking.paymentStatus === 'paid' || booking.status === 'confirmed' || booking.status === 'done'
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/booking')
      const data = await res.json()
      if (data.success) {
        setBookings(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate monthly stats
  const monthlyStats = useMemo((): MonthlyStats[] => {
    const stats: Record<string, MonthlyStats> = {}

    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('id-ID', { month: 'long' })
      const year = date.getFullYear()
      const paid = isBookingPaid(booking)

      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: monthKey,
          monthName,
          year,
          totalBooking: 0,
          totalPaid: 0,
          totalPending: 0,
          revenue: 0,
          paidRevenue: 0,
        }
      }

      stats[monthKey].totalBooking++
      stats[monthKey].revenue += booking.totalHarga

      if (paid) {
        stats[monthKey].totalPaid++
        stats[monthKey].paidRevenue += booking.totalHarga
      } else if (booking.status !== 'cancelled') {
        stats[monthKey].totalPending++
      }
    })

    return Object.values(stats).sort((a, b) => b.month.localeCompare(a.month))
  }, [bookings])

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const date = new Date(booking.createdAt)

      // Filter by month
      if (filter.month && date.getMonth().toString() !== filter.month) return false

      // Filter by year
      if (filter.year && date.getFullYear().toString() !== filter.year) return false

      // Filter by status
      if (filter.status === 'paid' && !isBookingPaid(booking)) return false
      if (filter.status === 'pending' && (isBookingPaid(booking) || booking.status === 'cancelled')) return false

      // Filter by paket
      if (filter.paketId && booking.paket?.id !== filter.paketId) return false

      return true
    })
  }, [bookings, filter])

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [filter])

  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    return filteredBookings.reduce(
      (acc, booking) => {
        acc.totalBooking++
        acc.revenue += booking.totalHarga
        if (isBookingPaid(booking)) {
          acc.totalPaid++
          acc.paidRevenue += booking.totalHarga
        }
        return acc
      },
      { totalBooking: 0, totalPaid: 0, revenue: 0, paidRevenue: 0 }
    )
  }, [filteredBookings])

  // Current month stats
  const currentMonthStats = useMemo(() => {
    const now = new Date()
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return monthlyStats.find((s) => s.month === currentMonthKey) || {
      month: currentMonthKey,
      monthName: now.toLocaleDateString('id-ID', { month: 'long' }),
      year: now.getFullYear(),
      totalBooking: 0,
      totalPaid: 0,
      totalPending: 0,
      revenue: 0,
      paidRevenue: 0,
    }
  }, [monthlyStats])

  const formatRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      'Kode Booking',
      'Nama Pemesan',
      'Email',
      'No. HP',
      'Paket',
      'Tanggal Tour',
      'Jumlah Orang',
      'Total Harga',
      'Status Pembayaran',
      'Status Booking',
      'Tanggal Booking',
    ]

    const rows = filteredBookings.map((booking) => [
      booking.kodeBooking,
      booking.namaPemesan,
      booking.email,
      booking.noHp,
      booking.paket?.nama || '-',
      formatDate(booking.tanggalTour),
      booking.jumlahOrang.toString(),
      booking.totalHarga.toString(),
      isBookingPaid(booking) ? 'Lunas' : 'Belum Bayar',
      booking.status,
      formatDateTime(booking.createdAt),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `laporan-keuangan-${filter.year}-${filter.month || 'all'}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get unique pakets for filter
  const uniquePakets = useMemo(() => {
    const pakets = new Map<string, Paket>()
    bookings.forEach((b) => {
      if (b.paket) {
        pakets.set(b.paket.id, b.paket)
      }
    })
    return Array.from(pakets.values())
  }, [bookings])

  // Years for filter
  const years = useMemo(() => {
    const yearSet = new Set<number>()
    bookings.forEach((b) => {
      yearSet.add(new Date(b.createdAt).getFullYear())
    })
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [bookings])

  // Months
  const months = [
    { value: '', label: 'Semua Bulan' },
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' },
  ]

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
          <h1 className='text-2xl font-bold text-navy-600'>Laporan Keuangan</h1>
          <p className='text-gray-500'>Pantau pendapatan dan transaksi booking</p>
        </div>
        <button
          onClick={exportCSV}
          className='px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats Cards - Horizontal Layout */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6'>
        {/* Total Booking */}
        <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-xs'>Total Booking</p>
              <p className='text-2xl font-bold text-navy-600'>{currentMonthStats.totalBooking}</p>
            </div>
            <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl'>📋</div>
          </div>
        </div>

        {/* Booking Lunas */}
        <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-xs'>Lunas</p>
              <p className='text-2xl font-bold text-green-600'>{currentMonthStats.totalPaid}</p>
            </div>
            <div className='w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl'>✅</div>
          </div>
        </div>

        {/* Pending */}
        <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-yellow-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-xs'>Pending</p>
              <p className='text-2xl font-bold text-yellow-600'>{currentMonthStats.totalPending}</p>
            </div>
            <div className='w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl'>⏳</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-purple-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-xs'>Total Revenue</p>
              <p className='text-lg font-bold text-purple-600'>{formatRupiah(currentMonthStats.revenue)}</p>
            </div>
            <div className='w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl'>💰</div>
          </div>
        </div>

        {/* Paid Revenue */}
        <div className='bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-teal-100 text-xs'>Paid Revenue</p>
              <p className='text-lg font-bold text-white'>{formatRupiah(currentMonthStats.paidRevenue)}</p>
            </div>
            <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl'>💵</div>
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className='bg-white rounded-2xl shadow-sm mb-6'>
        <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
          <h3 className='text-lg font-bold text-navy-600'>Rekapitulasi per Bulan</h3>
          <span className='text-sm text-gray-500'>{currentMonthStats.monthName} {currentMonthStats.year}</span>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Bulan</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase'>Total Booking</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase'>Lunas</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase'>Pending</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase'>Total Revenue</th>
                <th className='px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase'>Paid Revenue</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {monthlyStats.map((stat) => (
                <tr key={stat.month} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <span className='font-medium text-navy-600'>
                      {stat.monthName} {stat.year}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right text-gray-600'>{stat.totalBooking}</td>
                  <td className='px-6 py-4 text-right'>
                    <span className='text-green-600 font-medium'>{stat.totalPaid}</span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <span className='text-yellow-600 font-medium'>{stat.totalPending}</span>
                  </td>
                  <td className='px-6 py-4 text-right text-gray-600'>
                    {formatRupiah(stat.revenue)}
                  </td>
                  <td className='px-6 py-4 text-right font-semibold text-teal-600'>
                    {formatRupiah(stat.paidRevenue)}
                  </td>
                </tr>
              ))}
              {monthlyStats.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className='bg-gray-50'>
              <tr>
                <td className='px-6 py-4 font-bold text-navy-600'>TOTAL</td>
                <td className='px-6 py-4 text-right font-bold text-navy-600'>
                  {monthlyStats.reduce((sum, s) => sum + s.totalBooking, 0)}
                </td>
                <td className='px-6 py-4 text-right font-bold text-green-600'>
                  {monthlyStats.reduce((sum, s) => sum + s.totalPaid, 0)}
                </td>
                <td className='px-6 py-4 text-right font-bold text-yellow-600'>
                  {monthlyStats.reduce((sum, s) => sum + s.totalPending, 0)}
                </td>
                <td className='px-6 py-4 text-right font-bold text-navy-600'>
                  {formatRupiah(monthlyStats.reduce((sum, s) => sum + s.revenue, 0))}
                </td>
                <td className='px-6 py-4 text-right font-bold text-teal-600'>
                  {formatRupiah(monthlyStats.reduce((sum, s) => sum + s.paidRevenue, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Filter & Transaction List */}
      <div className='bg-white rounded-2xl shadow-sm'>
        <div className='p-4 border-b border-gray-100'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h3 className='text-lg font-bold text-navy-600'>Daftar Transaksi</h3>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Quick Stats */}
              <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'>
                Total: {filteredTotals.totalBooking}
              </span>
              <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                Lunas: {filteredTotals.totalPaid}
              </span>
              <span className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium'>
                Revenue: {formatRupiah(filteredTotals.paidRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='p-4 bg-gray-50 border-b border-gray-100'>
          <div className='flex flex-wrap items-center gap-3'>
            <select
              value={filter.year}
              onChange={(e) => setFilter({ ...filter, year: e.target.value })}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={filter.month}
              onChange={(e) => setFilter({ ...filter, month: e.target.value })}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Semua Status</option>
              <option value='paid'>Lunas</option>
              <option value='pending'>Pending</option>
            </select>
            <select
              value={filter.paketId}
              onChange={(e) => setFilter({ ...filter, paketId: e.target.value })}
              className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Semua Paket</option>
              {uniquePakets.map((paket) => (
                <option key={paket.id} value={paket.id}>{paket.nama}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction Cards - Compact Grid */}
        <div className='p-4'>
          {filteredBookings.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-4xl mb-4'>📭</div>
              <p className='text-gray-500'>Tidak ada transaksi ditemukan</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
              {paginatedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-xl border ${
                    isBookingPaid(booking)
                      ? 'bg-green-50 border-green-200'
                      : booking.status === 'cancelled'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-mono text-sm font-bold text-teal-600'>
                      {booking.kodeBooking}
                    </span>
                    {isBookingPaid(booking) ? (
                      <span className='px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium'>Lunas</span>
                    ) : booking.status === 'cancelled' ? (
                      <span className='px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium'>Batal</span>
                    ) : (
                      <span className='px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium'>Pending</span>
                    )}
                  </div>

                  {/* Info Grid */}
                  <div className='grid grid-cols-2 gap-x-4 gap-y-1 text-xs'>
                    <div>
                      <span className='text-gray-400'>Nama</span>
                      <p className='font-medium text-navy-600 truncate'>{booking.namaPemesan}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Paket</span>
                      <p className='font-medium text-navy-600 truncate'>{booking.paket?.nama || '-'}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Tanggal</span>
                      <p className='font-medium text-navy-600'>{formatDate(booking.tanggalTour)}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Jumlah</span>
                      <p className='font-medium text-navy-600'>{booking.jumlahOrang} org</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-200'>
                    <span className='text-xs text-gray-400'>{formatDate(booking.createdAt)}</span>
                    <span className={`font-bold ${
                      isBookingPaid(booking) ? 'text-green-600' : 'text-navy-600'
                    }`}>
                      {formatRupiah(booking.totalHarga)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50'>
            <span className='text-sm text-gray-500'>
              Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} dari {filteredBookings.length}
            </span>
            <div className='flex items-center gap-1'>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className='px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-50'
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, idx, arr) => (
                  <div key={page} className='flex items-center'>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className='px-1.5 text-gray-400'>...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-teal-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className='px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-50'
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}