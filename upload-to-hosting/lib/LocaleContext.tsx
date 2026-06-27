'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Locale = 'id' | 'en'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: 'id',
  setLocale: () => {},
  t: (key) => key,
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    // Check URL for locale
    const path = window.location.pathname
    if (path.startsWith('/en') || path.startsWith('/en/')) {
      setLocaleState('en')
    } else {
      setLocaleState('id')
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    // Update URL
    const path = window.location.pathname
    let newPath = path
    if (newLocale === 'en') {
      newPath = path.replace(/^\/id/, '/en')
      if (!newPath.startsWith('/en')) newPath = '/en' + path
    } else {
      newPath = path.replace(/^\/en/, '/id')
      if (!newPath.startsWith('/id')) newPath = '/id' + path
    }
    window.location.href = newPath
  }

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

const translations: Record<Locale, Record<string, string>> = {
  id: {
    'nav.home': 'Beranda',
    'nav.packages': 'Paket Tour',
    'nav.destinations': 'Destinasi',
    'nav.booking': 'Booking',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontak',
    'hero.badge': 'Pulau Surga di Timur Bali',
    'hero.title': 'Explore Penida',
    'hero.subtitle': 'Jelajahi keindahan alam yang memukau dengan paket tour eksklusif pilihan terbaik kami',
    'hero.cta': 'Lihat Paket Tour',
    'packages.title': 'Paket Tour',
    'packages.subtitle': 'Pilihan paket yang sesuai dengan keinginan Anda',
    'packages.viewAll': 'Lihat Semua',
    'testimonials.title': 'Kata Mereka',
    'testimonials.subtitle': 'Testimoni dari traveler yang sudah merasakan keindahan Nusa Penida',
    'cta.title': 'Siap Menjelajahi Nusa Penida?',
    'cta.subtitle': 'Booking sekarang dan rasakan pengalaman tak terlupakan',
    'cta.button': 'Booking Sekarang',
    'footer.description': 'Tour & travel terpercaya untuk menjelajahi keindahan Nusa Penida',
    'footer.quickLinks': 'Tautan Cepat',
    'footer.contactUs': 'Hubungi Kami',
    'footer.copyright': '© 2024 Explore Penida. Hak cipta dilindungi.',
  },
  en: {
    'nav.home': 'Home',
    'nav.packages': 'Packages',
    'nav.destinations': 'Destinations',
    'nav.booking': 'Booking',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'hero.badge': 'Island Paradise East of Bali',
    'hero.title': 'Explore Penida',
    'hero.subtitle': 'Explore the stunning natural beauty of Nusa Penida with our exclusive tour packages',
    'hero.cta': 'View Tour Packages',
    'packages.title': 'Tour Packages',
    'packages.subtitle': 'Choose the package that suits your preferences',
    'packages.viewAll': 'View All',
    'testimonials.title': 'What They Say',
    'testimonials.subtitle': 'Testimonials from travelers who have experienced Nusa Penida',
    'cta.title': 'Ready to Explore Nusa Penida?',
    'cta.subtitle': 'Book now and experience an unforgettable adventure',
    'cta.button': 'Book Now',
    'footer.description': 'Trusted tour & travel to explore the beauty of Nusa Penida',
    'footer.quickLinks': 'Quick Links',
    'footer.contactUs': 'Contact Us',
    'footer.copyright': '© 2024 Explore Penida. All rights reserved.',
  },
}