'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function CTASection() {
  const [locale, setLocale] = useState('id')
  const pathname = usePathname()

  useEffect(() => { setLocale(pathname.startsWith('/en') ? 'en' : 'id') }, [pathname])

  const localePrefix = locale === 'id' ? '/id' : '/en'

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')"}}/>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-teal-800/85 to-slate-900/90"/>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-[100px]"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/20 rounded-full blur-[120px]"/>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full text-sm font-bold mb-8 shadow-lg">🎉 {locale === 'id' ? 'Promo Terbatas!' : 'Limited Offer!'}</div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
          {locale === 'id' ? 'Siap Menjelajahi' : 'Ready to Explore'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-400">Nusa Penida?</span>
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          {locale === 'id' ? 'Jangan lewatkan kesempatan untuk merasakan keindahan alam yang belum terjamah. Booking sekarang dan dapatkan pengalaman tak terlupakan!' : "Don't miss the chance to experience the untouched natural beauty. Book now!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href={`${localePrefix}/booking`} className="px-12 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-teal-500/50 transition-all">🎫 {locale === 'id' ? 'Booking Sekarang' : 'Book Now'}</Link>
          <a href="https://wa.me/628131819818" target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-green-500 text-white font-bold text-lg rounded-full hover:bg-green-600 transition-all flex items-center justify-center gap-3">💬 WhatsApp</a>
         </div>
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-white/90 text-sm font-medium">
          <div className="flex items-center gap-2">🛡️ {locale === 'id' ? 'Asuransi Terinclude' : 'Insurance Included'}</div>
          <div className="flex items-center gap-2">👨‍✈️ {locale === 'id' ? 'Guide Berpengalaman' : 'Experienced Guide'}</div>
          <div className="flex items-center gap-2">💳 {locale === 'id' ? 'Pembayaran Aman' : 'Secure Payment'}</div>
        </div>
      </div>
    </section>
  )
}
