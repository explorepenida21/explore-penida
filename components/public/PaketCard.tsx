'use client'

import Link from 'next/link'
import Image from 'next/image'

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
}

interface PaketCardProps {
  paket: Paket
}

export default function PaketCard({ paket }: PaketCardProps) {
  // Safety defaults
  const safePaket = {
    ...paket,
    nama: paket.nama || 'Paket Tour',
    tipe: paket.tipe || 'regular',
    harga: paket.harga || 0,
    deskripsi: paket.deskripsi || '',
    includes: Array.isArray(paket.includes) ? paket.includes : [],
    destinasi: Array.isArray(paket.destinasi) ? paket.destinasi : [],
    foto: Array.isArray(paket.foto) && paket.foto.length > 0 ? paket.foto : ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'],
  }

  const isMix = safePaket.tipe === 'mix'
  const badge = isMix ? { text: 'TERLARIS', color: 'bg-gold-400 text-navy-600' } : null
  const imageUrl = safePaket.foto[0]

  return (
    <div className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
      {/* Image */}
      <div className='relative h-64 overflow-hidden'>
        <Image
          src={imageUrl}
          alt={safePaket.nama}
          fill
          className='object-cover group-hover:scale-110 transition-transform duration-700'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-navy-600/80 via-transparent to-transparent' />

        {/* Badge */}
        {badge && (
          <div className='absolute top-4 right-4'>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${badge.color} shadow-lg`}>
              ⭐ {badge.text}
            </span>
          </div>
        )}

        {/* Destinasi count */}
        <div className='absolute bottom-4 left-4'>
          <span className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium'>
            📍 {safePaket.destinasi.length} Destinasi
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <h3 className='text-2xl font-bold text-navy-600 mb-2'>{safePaket.nama}</h3>
        <p className='text-gray-600 mb-4 line-clamp-2'>{safePaket.deskripsi}</p>

        {/* Destinasi List */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {safePaket.destinasi.slice(0, 3).map((dest, i) => (
            <span key={i} className='text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded-full font-medium'>
              {dest}
            </span>
          ))}
          {safePaket.destinasi.length > 3 && (
            <span className='text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full'>
              +{safePaket.destinasi.length - 3} more
            </span>
          )}
        </div>

        {/* Includes */}
        <div className='space-y-2 mb-6 border-t border-gray-100 pt-4'>
          {safePaket.includes.slice(0, 4).map((item, i) => (
            <div key={i} className='flex items-center gap-2 text-sm text-gray-600'>
              <svg className='w-4 h-4 text-teal-500 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
              {item}
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
          <div>
            <span className='text-sm text-gray-500'>Mulai dari</span>
            <div className='text-3xl font-bold text-navy-600'>
              Rp {safePaket.harga.toLocaleString('id-ID')}
              <span className='text-sm font-normal text-gray-500'>/org</span>
            </div>
          </div>
          <Link
            href={`/booking?paket=${safePaket.slug}`}
            className='px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30'
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}