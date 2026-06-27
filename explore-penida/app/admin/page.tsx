'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Stats {
  totalBooking: number
  todayBooking: number
  monthBooking: number
  pendingBooking: number
  paidBooking: number
  totalRevenue: number
  monthRevenue: number
  totalPaket: number
}

interface Booking {
  id: string
  kodeBooking: string
  namaPemesan: string
  email: string
  noHp: string
  paket: { nama: string }
  tanggalTour: string
  jumlahOrang: number
  totalHarga: number
  status: string
  paymentStatus: string
  createdAt: string
}

interface ChartData {
  date: string
  dateLabel: string
  count: number
  revenue: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({
    totalBooking: 0,
    todayBooking: 0,
    monthBooking: 0,
    pendingBooking: 0,
    paidBooking: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    totalPaket: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingRes = await fetch('/api/admin/booking')
      const bookingData = await bookingRes.json()

      if (bookingData.success) {
        const bookings = bookingData.data || []

        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

        const todayBookings = bookings.filter((b: Booking) =>
          new Date(b.createdAt) >= today
        )
        const monthBookings = bookings.filter((b: Booking) =>
          new Date(b.createdAt) >= monthStart
        )
        const paidBookings = bookings.filter((b: Booking) =>
          b.paymentStatus === 'paid' || b.status === 'confirmed'
        )
        const paidMonthBookings = paidBookings.filter((b: Booking) =>
          new Date(b.createdAt) >= monthStart
        )

        setStats({
          totalBooking: bookings.length,
          todayBooking: todayBookings.length,
          monthBooking: monthBookings.length,
          pendingBooking: bookings.filter((b: Booking) => b.status === 'pending').length,
          paidBooking: paidBookings.length,
          totalRevenue: paidBookings.reduce((sum: number, b: Booking) => sum + b.totalHarga, 0),
          monthRevenue: paidMonthBookings.reduce((sum: number, b: Booking) => sum + b.totalHarga, 0),
          totalPaket: 3,
        })

        // Recent 10 bookings
        setRecentBookings(bookings.slice(0, 10))

        // Chart data - last 7 days
        const last7Days: ChartData[] = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)

          const nextDate = new Date(date)
          nextDate.setDate(nextDate.getDate() + 1)

          const dayBookings = bookings.filter((b: Booking) => {
            const bookingDate = new Date(b.createdAt)
            return bookingDate >= date && bookingDate < nextDate
          })

          last7Days.push({
            date: date.toISOString().split('T')[0],
            dateLabel: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
            count: dayBookings.length,
            revenue: dayBookings
              .filter((b: Booking) => b.paymentStatus === 'paid')
              .reduce((sum: number, b: Booking) => sum + b.totalHarga, 0),
          })
        }
        setChartData(last7Days)
      }

      // Fetch pakets
      const paketRes = await fetch('/api/paket')
      const paketData = await paketRes.json()

      if (paketData.success) {
        setStats(prev => ({ ...prev, totalPaket: paketData.data?.length || 0 }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}jt`
    }
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'paid' || status === 'confirmed') {
      return <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>Lunas</span>
    }
    if (status === 'cancelled') {
      return <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'>Batal</span>
    }
    return <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'>Menunggu</span>
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
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-navy-600'>Dashboard</h1>
        <p className='text-gray-500'>
          Selamat datang, {session?.user?.name || 'Admin'}! Berikut ringkasan aktivitas Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Today's Booking */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border-l-4 border-teal-500'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📅</span>
            </div>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Hari ini</span>
          </div>
          <h3 className='text-3xl font-bold text-navy-600'>{stats.todayBooking}</h3>
          <p className='text-gray-500 text-sm'>Booking Hari Ini</p>
        </div>

        {/* Month's Booking */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📋</span>
            </div>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Bulan ini</span>
          </div>
          <h3 className='text-3xl font-bold text-navy-600'>{stats.monthBooking}</h3>
          <p className='text-gray-500 text-sm'>Booking Bulan Ini</p>
        </div>

        {/* Pending */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>⏳</span>
            </div>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Pending</span>
          </div>
          <h3 className='text-3xl font-bold text-yellow-600'>{stats.pendingBooking}</h3>
          <p className='text-gray-500 text-sm'>Menunggu Pembayaran</p>
        </div>

        {/* Month Revenue */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>Bulan ini</span>
          </div>
          <h3 className='text-2xl font-bold text-green-600'>{formatRupiah(stats.monthRevenue)}</h3>
          <p className='text-gray-500 text-sm'>Pendapatan Bulan Ini</p>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Total Revenue */}
        <div className='bg-gradient-to-br from-navy-600 to-navy-700 rounded-2xl p-6 text-white'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>💎</span>
            </div>
            <span className='text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full'>All Time</span>
          </div>
          <h3 className='text-2xl font-bold'>{formatRupiah(stats.totalRevenue)}</h3>
          <p className='text-white/80 text-sm'>Total Pendapatan</p>
        </div>

        {/* Total Booking */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>🎫</span>
            </div>
          </div>
          <h3 className='text-3xl font-bold text-navy-600'>{stats.totalBooking}</h3>
          <p className='text-gray-500 text-sm'>Total Semua Booking</p>
        </div>

        {/* Total Paket */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>🏝️</span>
            </div>
          </div>
          <h3 className='text-3xl font-bold text-navy-600'>{stats.totalPaket}</h3>
          <p className='text-gray-500 text-sm'>Paket Tour Aktif</p>
        </div>
      </div>

      {/* Chart & Recent Bookings */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        {/* Chart */}
        <div className='lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm'>
          <h3 className='text-lg font-bold text-navy-600 mb-4'>Booking 7 Hari Terakhir</h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  dataKey='dateLabel'
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'count' ? `${value} booking` : formatRupiah(value as number),
                    name === 'count' ? 'Booking' : 'Revenue'
                  ]}
                />
                <Bar dataKey='count' fill='#1ABC9C' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm'>
          <h3 className='text-lg font-bold text-navy-600 mb-4'>Statistik Cepat</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                  <span>✅</span>
                </div>
                <span className='font-medium text-navy-600'>Booking Lunas</span>
              </div>
              <span className='text-xl font-bold text-green-600'>{stats.paidBooking}</span>
            </div>
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <span>⏳</span>
                </div>
                <span className='font-medium text-navy-600'>Menunggu Pembayaran</span>
              </div>
              <span className='text-xl font-bold text-yellow-600'>{stats.pendingBooking}</span>
            </div>
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
                  <span>📅</span>
                </div>
                <span className='font-medium text-navy-600'>Rata-rata Booking/Hari</span>
              </div>
              <span className='text-xl font-bold text-teal-600'>
                {(stats.monthBooking / 30).toFixed(1)}
              </span>
            </div>
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <span>💵</span>
                </div>
                <span className='font-medium text-navy-600'>Avg. Transaction</span>
              </div>
              <span className='text-xl font-bold text-blue-600'>
                {stats.paidBooking > 0 ? formatRupiah(stats.totalRevenue / stats.paidBooking) : 'Rp 0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className='bg-white rounded-2xl shadow-sm'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-navy-600'>Booking Terbaru</h2>
            <a href='/admin/booking' className='text-sm text-teal-500 hover:text-teal-600 font-medium flex items-center gap-1'>
              Lihat Semua
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </a>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='text-5xl mb-4'>📭</div>
            <p className='text-gray-500'>Belum ada booking masuk</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Kode</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Pemesan</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Paket</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Tanggal Tour</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Jumlah</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Total</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='font-mono text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded'>
                        {booking.kodeBooking}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div>
                        <p className='font-medium text-navy-600'>{booking.namaPemesan}</p>
                        <p className='text-xs text-gray-500'>{booking.noHp}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-gray-600 text-sm'>
                      {booking.paket?.nama || '-'}
                    </td>
                    <td className='px-6 py-4 text-gray-600 text-sm whitespace-nowrap'>
                      {formatDate(booking.tanggalTour)}
                    </td>
                    <td className='px-6 py-4 text-gray-600 text-sm'>
                      {booking.jumlahOrang} org
                    </td>
                    <td className='px-6 py-4 font-semibold text-navy-600 whitespace-nowrap'>
                      {formatRupiah(booking.totalHarga)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {getStatusBadge(booking.status, booking.paymentStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
        <a
          href='/admin/booking'
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group'
        >
          <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
            <span className='text-2xl'>📋</span>
          </div>
          <div>
            <h3 className='font-semibold text-navy-600'>Kelola Booking</h3>
            <p className='text-sm text-gray-500'>Lihat & update status booking</p>
          </div>
        </a>

        <a
          href='/admin/paket'
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group'
        >
          <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors'>
            <span className='text-2xl'>🎫</span>
          </div>
          <div>
            <h3 className='font-semibold text-navy-600'>Kelola Paket</h3>
            <p className='text-sm text-gray-500'>Edit paket tour yang tersedia</p>
          </div>
        </a>

        <a
          href='/'
          target='_blank'
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group'
        >
          <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors'>
            <span className='text-2xl'>🌐</span>
          </div>
          <div>
            <h3 className='font-semibold text-navy-600'>Lihat Website</h3>
            <p className='text-sm text-gray-500'>Buka halaman depan</p>
          </div>
        </a>
      </div>
    </div>
  )
}