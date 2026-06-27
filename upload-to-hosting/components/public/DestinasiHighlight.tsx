'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Destinasi {
  id: string
  nama: string
  slug: string
  foto: string[]
}

const defaultDestinasi: Destinasi[] = [
  { id: '1', nama: 'Kelingking Beach', slug: 'kelingking', foto: ['https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80'] },
  { id: '2', nama: "Angel's Billabong", slug: 'billabong', foto: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'] },
  { id: '3', nama: 'Diamond Beach', slug: 'diamond', foto: ['https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80'] },
  { id: '4', nama: 'Broken Beach', slug: 'broken', foto: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'] },
  { id: '5', nama: 'Atuh Beach', slug: 'atuh', foto: ['https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80'] },
  { id: '6', nama: 'Crystal Bay', slug: 'crystal', foto: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80'] },
]

export default function DestinasiHighlight() {
  const [destinasis] = useState<Destinasi[]>(defaultDestinasi)
  const [locale, setLocale] = useState('id')
  const pathname = usePathname()

  useEffect(() => { setLocale(pathname.startsWith('/en') ? 'en' : 'id') }, [pathname])

  const localePrefix = locale === 'id' ? '/id' : '/en'

  return (
    <section id="destinasi" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"/>{locale === 'id' ? 'Destinasi Populer' : 'Popular Destinations'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            {locale === 'id' ? 'Tempat Terindah di' : 'Most Beautiful Places in'}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-amber-500">Nusa Penida</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{locale === 'id' ? 'Abadikan momen terbaik Anda di pantai-pantai eksotis dan spot foto Instagram-worthy' : 'Capture your best moments at exotic beaches'}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinasis.slice(0, 6).map((dest, index) => (
            <div key={dest.id} className={`group relative h-80 rounded-3xl overflow-hidden cursor-pointer ${index === 0 ? 'md:col-span-2' : ''} ${index === 3 ? 'lg:col-span-2' : ''}`}>
              <div className="absolute inset-0 w-full h-full"><img src={dest.foto?.[0]} alt={dest.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"/>
              <div className="absolute inset-0 bg-teal-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="mb-3"><span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow">⭐ 4.9</span></div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">{dest.nama}</h3>
                <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>Nusa Penida</span>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <a href={`${localePrefix}/destinasi`} className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300">🗺️ {locale === 'id' ? 'Lihat Semua Destinasi' : 'View All Destinations'}</a>
        </div>
      </div>
    </section>
  )
}
