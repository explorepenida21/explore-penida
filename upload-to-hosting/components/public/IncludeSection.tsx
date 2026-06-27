'use client'

import { useState } from 'react'

interface Fasilitas {
  id: string
  emoji: string
  title: string
  deskripsi: string
}

// Default fasilitas
const defaultFasilitas: Fasilitas[] = [
  { id: '1', emoji: '🚤', title: 'Transportasi Boat PP', deskripsi: 'Kapal tradisional menuju Nusa Penida dan kembali ke Sanur' },
  { id: '2', emoji: '🍽️', title: 'Makan Siang', deskripsi: 'Menu tradisional khas Bali dengan pemandangan laut' },
  { id: '3', emoji: '🚗', title: 'Mobil + Driver', deskripsi: 'Kendaraan ber-AC dan driver berpengalaman' },
  { id: '4', emoji: '🎫', title: 'Tiket Destinasi', deskripsi: 'Semua tiket masuk destinasi sudah termasuk' },
  { id: '5', emoji: '📸', title: 'Free Photo', deskripsi: 'Driver兼职 fotografer untuk abadikan momen' },
  { id: '6', emoji: '🛡️', title: 'Asuransi Tour', deskripsi: 'Asuransi kecelakaan selama tour' },
]

export default function IncludeSection() {
  const [fasilitas] = useState<Fasilitas[]>(defaultFasilitas)

  return (
    <section className='py-20 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10' style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Decorative Elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
      <div className='absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Header */}
        <div className='text-center mb-16'>
          <span className='inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-full text-sm font-bold mb-6 shadow-lg'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            ✨ Semua Sudah Termasuk
          </span>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6'>
            Fasilitas <span className='text-amber-400'>Lengkap</span> & Premium
          </h2>
          <p className='text-lg md:text-xl text-white/80 max-w-2xl mx-auto'>
            Fokus menikmati perjalanan, biarkan kami yang mengurus semuanya
          </p>
        </div>

        {/* Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {fasilitas.map((item) => (
            <div
              key={item.id}
              className='group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default'
            >
              {/* Icon */}
              <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
                {item.emoji}
              </div>

              {/* Content */}
              <div>
                <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors'>
                  {item.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {item.deskripsi}
                </p>
              </div>

              {/* Checkmark Badge */}
              <div className='absolute top-4 right-4 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16'>
          <a
            href='#paket-section'
            className='inline-flex items-center gap-3 px-10 py-4 bg-white text-teal-600 rounded-full font-bold text-lg hover:bg-amber-400 hover:text-teal-800 transition-all duration-300 shadow-xl hover:shadow-2xl'
          >
            🎫 Lihat Semua Paket
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}