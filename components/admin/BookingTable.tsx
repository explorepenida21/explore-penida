'use client'

interface Booking {
  id: string
  nama: string
  email: string
  telepon: string
  paket: string
  tanggal: string
  jumlahOrang: number
  totalHarga: number
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
}

export default function BookingTable({ bookings, onStatusChange }: { bookings: Booking[]; onStatusChange?: (id: string, status: string) => void }) {
  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Nama</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Paket</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Tanggal</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Jumlah</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Total</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-600'>Aksi</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {bookings.map((booking) => (
              <tr key={booking.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div>
                    <p className='font-medium'>{booking.nama}</p>
                    <p className='text-sm text-gray-500'>{booking.email}</p>
                  </div>
                </td>
                <td className='px-6 py-4'>{booking.paket}</td>
                <td className='px-6 py-4'>{new Date(booking.tanggal).toLocaleDateString('id-ID')}</td>
                <td className='px-6 py-4'>{booking.jumlahOrang} orang</td>
                <td className='px-6 py-4'>Rp {booking.totalHarga.toLocaleString('id-ID')}</td>
                <td className='px-6 py-4'>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <select
                    value={booking.status}
                    onChange={(e) => onStatusChange?.(booking.id, e.target.value)}
                    className='text-sm border rounded-lg px-2 py-1'
                  >
                    <option value='PENDING'>Pending</option>
                    <option value='PAID'>Paid</option>
                    <option value='COMPLETED'>Completed</option>
                    <option value='CANCELLED'>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}