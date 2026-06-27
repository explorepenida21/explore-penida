'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface Settings {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroVideoUrl: string | null
}

export default function HeroParallax() {
  const [locale, setLocale] = useState('id')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const pathname = usePathname()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setLocale(pathname.startsWith('/en') ? 'en' : 'id')
  }, [pathname])

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data)
        }
      })
      .catch(err => console.error('Error fetching hero settings:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Try to play video when it loads
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      })
    }
  }, [videoLoaded])

  const localePrefix = locale === 'id' ? '/id' : '/en'

  const badge = settings?.heroBadge || 'Pulau Surga di Timur Bali'
  const title = settings?.heroTitle || 'Explore Penida'
  const subtitle = settings?.heroSubtitle || 'Jelajahi keindahan alam yang memukau dengan paket tour eksklusif pilihan terbaik kami'
  const backgroundImage = settings?.heroImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85'
  const videoUrl = settings?.heroVideoUrl

  return (
    <section className="relative h-screen min-h-[650px] overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 w-full h-full">
        {/* Video Background - Lower opacity to blend with image */}
        {videoUrl && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-0'}`}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
          />
        )}

        {/* Image Background - Only show when video is not loaded */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${videoUrl && videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />

        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Animated Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-72 h-72 rounded-full bg-teal-500/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[25%] left-[3%] w-80 h-80 rounded-full bg-amber-500/15 blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[40%] w-48 h-48 rounded-full bg-cyan-400/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full text-sm font-bold shadow-2xl transform hover:scale-105 transition-transform">
            🏝️ {badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white mb-8 max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-lg">
            {title.includes(' ') ? title.split(' ')[0] : title}
          </span>
          <span className="block text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
            {title.includes(' ') ? title.split(' ').slice(1).join(' ') : ''}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mb-12 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <a
            href={`${localePrefix}/paket`}
            className="px-10 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
            🎫 {locale === 'id' ? 'Lihat Paket Tour' : 'View Tour Packages'}
          </a>
          <a
            href={`${localePrefix}/destinasi`}
            className="px-10 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white rounded-full font-bold text-lg hover:bg-white hover:text-teal-600 transition-all shadow-xl flex items-center gap-2"
          >
            🗺️ {locale === 'id' ? 'Eksplor Destinasi' : 'Explore Destinations'}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-3 text-white">
          <span className="text-xs font-bold tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-8 h-12 border-2 border-white/80 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-scroll-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path d="M0 120L1440 120L1440 60C1440 60 1080 120 720 120C360 120 0 60 0 60V120Z" fill="white" />
        </svg>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-scroll-bounce {
          animation: scroll-bounce 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
