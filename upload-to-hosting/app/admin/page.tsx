'use client'
export const dynamic = 'force-dynamic'


import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Stats {
  totalBooking: number
  pendingBooking: number
  paidBooking: number
  totalRevenue: number
  totalPaket: number
}

interface RecentBooking {
  id: string
  kodeBooking: string
  namaPemesan: string
  paket: { nama: string }
  tanggalTour: string
  totalHarga: number
  status: string
  paymentStatus: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({
    totalBooking: 0,
    pendingBooking: 0,
    paidBooking: 0,
    totalRevenue: 0,
    totalPaket: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
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

        // Helper function to check if booking is paid
        const isBookingPaid = (b: any) => {
          return b.paymentStatus === 'paid' || b.status === 'confirmed' || b.status === 'done'
        }

        setStats({
          totalBooking: bookings.length,
          pendingBooking: bookings.filter((b: any) => !isBookingPaid(b) && b.status !== 'cancelled').length,
          paidBooking: bookings.filter((b: any) => isBookingPaid(b)).length,
          totalRevenue: bookings
            .filter((b: any) => isBookingPaid(b))
            .reduce((sum: number, b: any) => sum + b.totalHarga, 0),
          totalPaket: 3, // Static for now
        })

        setRecentBookings(bookings.slice(0, 5))
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
    if (paymentStatus === 'paid' || status === 'confirmed' || status === 'done') {
      return <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>Lunas</span>
    }
    if (status === 'cancelled') {
      return <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'>Batal</span>
    }
    return <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'>Menunggu</span>
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-navy-600'>
          Dashboard
        </h1>
        <p className='text-gray-500'>
          Selamat datang, {session?.user?.name || 'Admin'}! Berikut ringkasan aktivitas Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Total Booking */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📋</span>
            </div>
            <span className='text-xs text-gray-500'>Total</span>
          </div>
          <h3 className='text-3xl font-bold text-navy-600'>{stats.totalBooking}</h3>
          <p className='text-gray-500 text-sm'>Total Booking</p>
        </div>

        {/* Pending */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>⏳</span>
            </div>
            <span className='text-xs text-gray-500'>Menunggu</span>
          </div>
          <h3 className='text-3xl font-bold text-yellow-600'>{stats.pendingBooking}</h3>
          <p className='text-gray-500 text-sm'>Booking Pending</p>
        </div>

        {/* Paid */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
            <span className='text-xs text-gray-500'>Lunas</span>
          </div>
          <h3 className='text-3xl font-bold text-green-600'>{stats.paidBooking}</h3>
          <p className='text-gray-500 text-sm'>Booking Lunas</p>
        </div>

        {/* Revenue */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>💰</span>
            </div>
            <span className='text-xs text-gray-500'>Total</span>
          </div>
          <h3 className='text-2xl font-bold text-teal-600'>{formatRupiah(stats.totalRevenue)}</h3>
          <p className='text-gray-500 text-sm'>Total Pendapatan</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className='bg-white rounded-2xl shadow-sm'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-navy-600'>Booking Terbaru</h2>
            <a href='/admin/booking' className='text-sm text-teal-500 hover:text-teal-600 font-medium'>
              Lihat Semua →
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
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Kode</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Pemesan</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Paket</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Tanggal</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Total</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <span className='font-mono text-sm font-medium text-teal-600'>
                        {booking.kodeBooking}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div>
                        <p className='font-medium text-navy-600'>{booking.namaPemesan}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>
                      {booking.paket?.nama || '-'}
                    </td>
                    <td className='px-6 py-4 text-gray-600'>
                      {formatDate(booking.tanggalTour)}
                    </td>
                    <td className='px-6 py-4 font-semibold text-navy-600'>
                      {formatRupiah(booking.totalHarga)}
                    </td>
                    <td className='px-6 py-4'>
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
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📋</span>
            </div>
            <div>
              <h3 className='font-semibold text-navy-600'>Kelola Booking</h3>
              <p className='text-sm text-gray-500'>Lihat & update status booking</p>
            </div>
          </div>
        </a>

        <a
          href='/admin/paket'
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>🎫</span>
            </div>
            <div>
              <h3 className='font-semibold text-navy-600'>Kelola Paket</h3>
              <p className='text-sm text-gray-500'>Edit paket tour yang tersedia</p>
            </div>
          </div>
        </a>

        <a
          href='/'
          target='_blank'
          className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>🌐</span>
            </div>
            <div>
              <h3 className='font-semibold text-navy-600'>Lihat Website</h3>
              <p className='text-sm text-gray-500'>Buka halaman depan</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}