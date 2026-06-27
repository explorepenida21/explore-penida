'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PaketCard from './PaketCard'

gsap.registerPlugin(ScrollTrigger)

// Interface untuk data dari API
interface PaketAPI {
  id: string
  name?: string
  nama?: string
  slug: string
  price?: number
  harga?: number
  description?: string
  deskripsi?: string
  highlights?: string
  highlightsArray?: string[]
  includes?: string
  includesArray?: string[]
  image?: string
  foto?: string
  category?: string
  tipe?: string
  duration?: string
}

// Interface untuk component
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

// Helper function untuk parse JSON string menjadi array
function parseJsonArray(value: string | string[] | undefined, fallback: string[] = []): string[] {
  if (!value) return fallback
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : fallback
    } catch {
      return fallback
    }
  }
  return fallback
}

// Helper function untuk map data dari API ke format component
function mapPaketFromAPI(apiData: PaketAPI): Paket {
  return {
    id: apiData.id,
    slug: apiData.slug,
    nama: apiData.nama || apiData.name || 'Paket Tour',
    tipe: apiData.tipe || apiData.category || 'regular',
    harga: apiData.harga || apiData.price || 0,
    deskripsi: apiData.deskripsi || apiData.description || '',
    includes: parseJsonArray(apiData.includesArray || apiData.includes),
    destinasi: parseJsonArray(apiData.highlightsArray || apiData.highlights),
    foto: apiData.foto ? [apiData.foto] : apiData.image ? [apiData.image] : ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'],
  }
}

export default function PaketList() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPakets()
  }, [])

  useEffect(() => {
    if (pakets.length > 0 && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.paket-card-wrapper', {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })
      }, sectionRef)

      return () => ctx.revert()
    }
  }, [pakets])

  const fetchPakets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/paket')
      if (!response.ok) throw new Error('Failed to fetch pakets')
      const data = await response.json()

      // Map data dari API ke format component
      const mappedPakets = Array.isArray(data)
        ? data.map((p: PaketAPI) => mapPaketFromAPI(p))
        : []

      setPakets(mappedPakets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
          <p className='text-gray-500'>Memuat paket tour...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-20'>
        <div className='text-red-500 text-lg mb-4'>⚠️ {error}</div>
        <button
          onClick={fetchPakets}
          className='px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors'
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  if (pakets.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-6xl mb-4'>🏝️</div>
        <p className='text-gray-500 text-lg'>Belum ada paket tour tersedia.</p>
      </div>
    )
  }

  return (
    <div ref={sectionRef} className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {pakets.map((paket) => (
        <div key={paket.id} className='paket-card-wrapper'>
          <PaketCard paket={paket} />
        </div>
      ))}
    </div>
  )
}