'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/booking', label: 'Booking', icon: '📋' },
  { href: '/admin/paket', label: 'Paket Tour', icon: '🎫' },
  { href: '/admin/jadwal', label: 'Jadwal', icon: '📅' },
  { href: '/admin/keuangan', label: 'Keuangan', icon: '💰' },
  { href: '/admin/customer', label: 'Customer', icon: '👥' },
  { href: '/admin/konten', label: 'Konten', icon: '📝' },
  { href: '/admin/chatbot', label: 'Chatbot AI', icon: '🤖' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className='w-64 bg-gray-900 text-white min-h-screen p-4'>
      <div className='mb-8'>
        <h1 className='text-xl font-bold'>Explore Penida</h1>
        <p className='text-sm text-gray-400'>Admin Panel</p>
      </div>
      <nav className='space-y-2'>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-primary-600' : 'hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className='mt-8 pt-8 border-t border-gray-700'>
        <Link
          href='/'
          className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition'
        >
          <span>🏠</span>
          <span>Kembali ke Website</span>
        </Link>
        <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-left'>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}