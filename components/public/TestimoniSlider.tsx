'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Testimoni {
  id: string
  nama: string
  foto: string | null
  rating: number
  komentar: string
  paketNama: string
}

const mockTestimoni: Testimoni[] = [
  { id: '1', nama: 'Budi Santoso', foto: null, rating: 5, komentar: 'Pengalaman yang luar biasa! Pemandangannya super indah dan guide-nya sangat ramah.', paketNama: 'Tour Timur' },
  { id: '2', nama: 'Siti Rahayu', foto: null, rating: 5, komentar: 'Worth it banget! Semua spot foto bagus-bagus. Crystal Bay-nya cantik banget!', paketNama: 'Mix Tour' },
  { id: '3', nama: 'Ahmad Wijaya', foto: null, rating: 5, komentar: 'Trip yang menyenangkan. Driver berpengalaman dan vehicles nyaman.', paketNama: 'Tour Barat' },
  { id: '4', nama: 'Dewi Lestari', foto: null, rating: 5, komentar: 'Best tour ever! Kelingking Beach memang juara.', paketNama: 'Tour Timur' },
  { id: '5', nama: 'Rudi Hermawan', foto: null, rating: 5, komentar: 'Organisasi tour sangat rapi. Makanan enak dan view spectacular!', paketNama: 'Mix Tour' },
  { id: '6', nama: 'Maya Putri', foto: null, rating: 5, komentar: 'Pantai-pantainya cantik-cantik. Guide helpful banget!', paketNama: 'Tour Barat' },
]

export default function TestimoniSlider() {
  const [testimonis, setTestimonis] = useState<Testimoni[]>([])
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState('id')
  const pathname = usePathname()

  useEffect(() => { setLocale(pathname.startsWith('/en') ? 'en' : 'id') }, [pathname])
  useEffect(() => { fetchTestimonis() }, [])

  const fetchTestimonis = async () => {
    try {
      const res = await fetch('/api/testimoni')
      const data = await res.json()
      if (data.success && data.data?.length > 0) {
        setTestimonis(data.data.map((t: any) => ({
          id: t.id, nama: t.nama || t.name || 'Guest', foto: t.foto || t.photo || null, rating: t.rating || 5, komentar: t.komentar || t.comment || '', paketNama: t.paketNama || t.paket || t.package || ''
        })))
      } else { setTestimonis(mockTestimoni) }
    } catch { setTestimonis(mockTestimoni) }
    finally { setLoading(false) }
  }

  const getInitials = (name: string) => name?.charAt(0).toUpperCase() || 'G'

  if (loading) return <section className="py-20 bg-gray-50"><div className="max-w-7xl mx-auto px-4 flex justify-center"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/></div></section>
  if (!testimonis.length) return null

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"/>{locale === 'id' ? 'Testimoni' : 'Testimonials'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            {locale === 'id' ? 'Kata Mereka yang' : 'What They Say'}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-amber-500">{locale === 'id' ? 'Sudah Berkunjung' : 'Who Visited'}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{locale === 'id' ? 'Ribuan tourists telah merasakan pengalaman tak terlupakan bersama kami' : 'Thousands of tourists have experienced unforgettable adventures with us'}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonis.slice(0, 6).map((t) => (
            <div key={t.id} className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-teal-200 transition-all duration-300">
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <div className="flex gap-1 mb-4 mt-4">
                {Array.from({length: 5}).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < t.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed line-clamp-4 text-base font-medium">&ldquo;{t.komentar}&rdquo;</p>
              <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">{t.foto ? <img src={t.foto} alt={t.nama} className="w-full h-full object-cover rounded-full"/> : getInitials(t.nama)}</div>
                <div><p className="font-bold text-gray-900">{t.nama}</p><p className="text-sm text-teal-600 font-medium">{t.paketNama}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
