'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface Paket {
  id: string
  slug: string
  nama: string
  tipe: string
  harga: number
  deskripsi: string
  includes: string[]
  destinasi: string[]
  foto: string[]
  isActive: boolean
}

// Mock data
const mockPakets: Paket[] = [
  {
    id: '1',
    slug: 'tour-timur',
    nama: 'Adventure East Nusa Penida',
    tipe: 'timur',
    harga: 850000,
    deskripsi: 'Jelajahi keindahan pantai timur Nusa Penida dengan Diamond Beach, Atuh Beach, dan Thousand Islands.',
    includes: ['Transportasi Boat PP', 'Makan Siang', 'Mobil + Driver', 'Tiket Destinasi', 'Free Photo', 'Asuransi Tour'],
    destinasi: ['Diamond Beach', 'Atuh Beach', 'Tree House', ' Thousand Islands'],
    foto: ['https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80'],
    isActive: true,
  },
  {
    id: '2',
    slug: 'tour-barat',
    nama: 'West Coast Discovery',
    tipe: 'barat',
    harga: 750000,
    deskripsi: 'Nikmati keindahan pantai barat dengan Kelingking, Angel\'s Billabong, dan Crystal Bay.',
    includes: ['Transportasi Boat PP', 'Makan Siang', 'Mobil + Driver', 'Tiket Destinasi', 'Free Photo', 'Asuransi Tour'],
    destinasi: ['Kelingking Beach', "Angel's Billabong", 'Broken Beach', 'Crystal Bay'],
    foto: ['https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80'],
    isActive: true,
  },
  {
    id: '3',
    slug: 'tour-mix',
    nama: 'Full Island Adventure',
    tipe: 'mix',
    harga: 1200000,
    deskripsi: 'Eksplor seluruh keindahan Nusa Penida dalam satu hari dengan pilihan destinasi terbaik.',
    includes: ['Transportasi Boat PP', 'Makan Siang + Malam', 'Mobil + Driver', 'Tiket Semua Destinasi', 'Free Photo + Video', 'Asuransi Tour'],
    destinasi: ['Kelingking', 'Diamond Beach', 'Broken Beach', 'Angel\'s Billabong', 'Atuh Beach', 'Crystal Bay'],
    foto: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'],
    isActive: true,
  },
]

export default function PaketSection() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useState('id')
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/en')) {
      setLocale('en')
    } else {
      setLocale('id')
    }
  }, [pathname])

  useEffect(() => {
    fetchPakets()
  }, [])

  const fetchPakets = async () => {
    try {
      const res = await fetch('/api/paket')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        const activePakets = data.data.filter((p: Paket) => p.isActive)
        setPakets(activePakets)
      } else {
        setPakets(mockPakets)
      }
    } catch (error) {
      console.error('Error fetching pakets:', error)
      setPakets(mockPakets)
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTipeLabel = (tipe: string) => {
    const labels: Record<string, { id: string; en: string }> = {
      timur: { id: '🏝️ Tour Timur', en: '🏝️ East Tour' },
      barat: { id: '🌅 Tour Barat', en: '🌅 West Tour' },
      mix: { id: '🎯 Tour Mix', en: '🎯 Mixed Tour' },
    }
    return labels[tipe]?.[locale as 'id' | 'en'] || tipe
  }

  const getTipeColor = (tipe: string) => {
    const colors: Record<string, { badge: string; button: string; border: string }> = {
      timur: { badge: 'bg-teal-500 text-white', button: 'bg-teal-500 hover:bg-teal-600', border: 'border-teal-200' },
      barat: { badge: 'bg-amber-500 text-white', button: 'bg-amber-500 hover:bg-amber-600', border: 'border-amber-200' },
      mix: { badge: 'bg-purple-500 text-white', button: 'bg-purple-500 hover:bg-purple-600', border: 'border-purple-200' },
    }
    return colors[tipe] || colors.timur
  }

  const localePrefix = locale === 'id' ? '/id' : '/en'

  if (loading) {
    return (
      <section id='paket-section' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-center h-96'>
            <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='paket-section' className='py-20 bg-gradient-to-b from-gray-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <span className='inline-flex items-center gap-2 px-5 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold mb-4'>
            <span className='w-2.5 h-2.5 bg-teal-500 rounded-full' />
            {locale === 'id' ? 'Paket Tour Kami' : 'Our Tour Packages'}
          </span>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4'>
            {locale === 'id' ? 'Paket Tour' : 'Tour Packages'}
            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500'>
              Nusa Penida
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {locale === 'id'
              ? 'Pilih paket terbaik untuk petualangan Anda di pulau surga'
              : 'Choose the best package for your adventure on the paradise island'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {pakets.map((paket) => {
            const colors = getTipeColor(paket.tipe)

            return (
              <div
                key={paket.id}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${colors.border} hover:-translate-y-2`}
              >
                {/* Image */}
                <div className='relative h-56 overflow-hidden'>
                  {paket.foto && paket.foto[0] ? (
                    <img
                      src={paket.foto[0]}
                      alt={paket.nama}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                  ) : (
                    <div className='w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center'>
                      <span className='text-7xl'>🏝️</span>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                  {/* Badge */}
                  <div className={`absolute top-4 left-4 px-4 py-2 ${colors.badge} text-sm font-bold rounded-xl shadow-lg`}>
                    {getTipeLabel(paket.tipe)}
                  </div>

                  {/* Price Tag */}
                  <div className='absolute bottom-4 right-4'>
                    <div className='bg-white rounded-xl px-4 py-3 shadow-xl'>
                      <p className='text-xs text-gray-500 font-medium'>{locale === 'id' ? 'Mulai dari' : 'From'}</p>
                      <p className='text-xl font-black text-gray-900'>{formatRupiah(paket.harga)}</p>
                      <p className='text-xs text-gray-400'>/orang</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors'>
                    {paket.nama}
                  </h3>
                  <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                    {paket.deskripsi}
                  </p>

                  {/* Destinations */}
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {paket.destinasi.slice(0, 3).map((dest, idx) => (
                      <span key={idx} className='px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg'>
                        📍 {dest}
                      </span>
                    ))}
                    {paket.destinasi.length > 3 && (
                      <span className='px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg'>
                        +{paket.destinasi.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Includes */}
                  <div className='space-y-2 mb-6 p-4 bg-gray-50 rounded-xl'>
                    {paket.includes.slice(0, 4).map((inc, idx) => (
                      <div key={idx} className='flex items-center gap-2 text-sm text-gray-700'>
                        <svg className='w-4 h-4 text-teal-500 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                        <span className='truncate'>{inc}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`${localePrefix}/booking?paket=${paket.slug}`}
                    className={`w-full py-3 ${colors.button} text-white rounded-xl font-bold text-center block transition-all shadow-md hover:shadow-lg`}
                  >
                    🎫 {locale === 'id' ? 'Pesan Sekarang' : 'Book Now'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Link */}
        <div className='text-center mt-16'>
          <Link
            href={`${localePrefix}/paket`}
            className='inline-flex items-center gap-3 px-10 py-4 border-2 border-teal-500 text-teal-600 rounded-full font-bold text-lg hover:bg-teal-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg'
          >
            {locale === 'id' ? 'Lihat Semua Paket' : 'View All Packages'}
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}