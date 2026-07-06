'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Footer() {
  const [locale, setLocale] = useState('id')
  const pathname = usePathname()

  useEffect(() => { setLocale(pathname.startsWith('/en') ? 'en' : 'id') }, [pathname])

  const localePrefix = locale === 'id' ? '/id' : '/en'

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href={localePrefix} className="inline-block mb-6">
              <h3 className="text-3xl font-black text-white"><span className="text-teal-400">Explore</span>Penida</h3>
            </Link>
            <p className="text-gray-400 mb-8">Tour & travel terpercaya untuk menjelajahi keindahan Nusa Penida</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/explorepenida" className="w-12 h-12 bg-gray-800 hover:bg-pink-500 rounded-xl flex items-center justify-center transition-all">📷</a>
              <a href="https://wa.me/628131819818" className="w-12 h-12 bg-gray-800 hover:bg-green-500 rounded-xl flex items-center justify-center transition-all">💬</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li><Link href={localePrefix} className="text-gray-400 hover:text-teal-400 transition-colors font-medium">Beranda</Link></li>
              <li><Link href={localePrefix + '/paket'} className="text-gray-400 hover:text-teal-400 transition-colors font-medium">Paket Tour</Link></li>
              <li><Link href={localePrefix + '/destinasi'} className="text-gray-400 hover:text-teal-400 transition-colors font-medium">Destinasi</Link></li>
              <li><Link href={localePrefix + '/kontak'} className="text-gray-400 hover:text-teal-400 transition-colors font-medium">Hubungi Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Jenis Tour</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 font-medium">🏝️ Tour Timur</li>
              <li className="text-gray-400 font-medium">🌅 Tour Barat</li>
              <li className="text-gray-400 font-medium">🎯 Tour Mix</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Hubungi Kami</h4>
            <div className="space-y-4">
              <p className="text-gray-400 font-medium">💬 +62 813-1819-818</p>
              <p className="text-gray-400 font-medium">📧 explorepenida.id@gmail.com</p>
              <p className="text-gray-400 font-medium">📍 Nusa Penida, Klungkung, Bali</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">© 2024 Explore Penida. Hak cipta dilindungi.</p>
          <div className="flex gap-6 text-sm">
            <Link href={localePrefix + '/syarat-ketentuan'} className="text-gray-500 hover:text-teal-400 transition-colors font-medium">Syarat & Ketentuan</Link>
            <Link href={localePrefix + '/privasi'} className="text-gray-500 hover:text-teal-400 transition-colors font-medium">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
