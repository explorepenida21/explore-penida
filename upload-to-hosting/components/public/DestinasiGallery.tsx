'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Destinasi {
  id: string
  nama: string
  slug: string
  foto: string[]
  isActive: boolean
}

export default function DestinasiGallery() {
  const [destinasis, setDestinasis] = useState<Destinasi[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDestinasi, setSelectedDestinasi] = useState<Destinasi | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0)

  useEffect(() => {
    fetchDestinasis()
  }, [])

  const fetchDestinasis = async () => {
    try {
      const res = await fetch('/api/destinasi')
      const data = await res.json()
      if (data.success) {
        setDestinasis(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching destinasis:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className='py-16 px-4'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto' />
        </div>
      </section>
    )
  }

  if (destinasis.length === 0) {
    return (
      <section className='py-16 px-4'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='text-6xl mb-4'>🏝️</div>
          <h2 className='text-2xl font-bold text-gray-600 mb-2'>Galeri Masih Kosong</h2>
          <p className='text-gray-500'>Destinasi akan segera ditambahkan</p>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Galeri Destinasi</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Jelajahi keindahan destinasi menakjubkan di Nusa Penida
          </p>
        </div>

        {/* Destinations Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {destinasis.map((destinasi) => (
            <div
              key={destinasi.id}
              className='relative h-80 rounded-2xl overflow-hidden cursor-pointer group'
              onClick={() => {
                setSelectedDestinasi(destinasi)
                setSelectedPhoto(0)
              }}
            >
              {/* Cover Image */}
              {destinasi.foto && destinasi.foto.length > 0 ? (
                <Image
                  src={destinasi.foto[0]}
                  alt={destinasi.nama}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500'
                />
              ) : (
                <div className='absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center'>
                  <span className='text-6xl'>🏝️</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

              {/* Content */}
              <div className='absolute bottom-0 left-0 right-0 p-6'>
                <h3 className='text-xl font-bold text-white mb-2'>{destinasi.nama}</h3>
                <div className='flex items-center gap-2'>
                  <span className='px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full'>
                    {destinasi.foto?.length || 0} foto
                  </span>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                <div className='w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274-4.057-2.5-7-3-10-4.971 2.943-5.762 7-9.542 7z' />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {selectedDestinasi && selectedDestinasi.foto && selectedDestinasi.foto.length > 0 && (
        <div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedDestinasi(null)}
        >
          <div className='absolute inset-0' onClick={() => setSelectedDestinasi(null)} />

          {/* Close Button */}
          <button
            onClick={() => setSelectedDestinasi(null)}
            className='absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
          >
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Modal Content */}
          <div className='relative z-10 max-w-5xl w-full' onClick={(e) => e.stopPropagation()}>
            {/* Title */}
            <h3 className='text-2xl font-bold text-white text-center mb-6'>{selectedDestinasi.nama}</h3>

            {/* Main Photo */}
            <div className='relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4'>
              <Image
                src={selectedDestinasi.foto[selectedPhoto]}
                alt={`${selectedDestinasi.nama} ${selectedPhoto + 1}`}
                fill
                className='object-contain'
              />
            </div>

            {/* Navigation Arrows */}
            {selectedDestinasi.foto.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedPhoto((prev) => prev === 0 ? selectedDestinasi.foto.length - 1 : prev - 1)}
                  className='absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
                >
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedPhoto((prev) => prev === selectedDestinasi.foto.length - 1 ? 0 : prev + 1)}
                  className='absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
                >
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {selectedDestinasi.foto.length > 1 && (
              <div className='flex justify-center gap-2 overflow-x-auto pb-4'>
                {selectedDestinasi.foto.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      selectedPhoto === index ? 'ring-2 ring-teal-500 opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Photo Counter */}
            <p className='text-center text-white/60 text-sm mt-2'>
              {selectedPhoto + 1} / {selectedDestinasi.foto.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
