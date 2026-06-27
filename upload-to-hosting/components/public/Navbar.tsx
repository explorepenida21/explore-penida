'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [locale, setLocale] = useState('id')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Detect locale from URL
    if (pathname.startsWith('/en')) {
      setLocale('en')
    } else {
      setLocale('id')
    }
  }, [pathname])

  useEffect(() => {
    // Fetch logo from settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.logoUrl) {
          setLogoUrl(data.data.logoUrl)
        }
      })
      .catch(err => console.error('Error fetching logo:', err))
  }, [])

  const switchLocale = () => {
    const newLocale = locale === 'id' ? 'en' : 'id'
    const newPath = pathname.replace(/^\/(id|en)/, `/${newLocale}`)
    router.push(newPath)
  }

  const isId = locale === 'id'

  // Get locale prefix for links
  const localePrefix = isId ? '/id' : '/en'

  const navLinks = [
    { href: `${localePrefix}`, label: isId ? 'Beranda' : 'Home' },
    { href: `${localePrefix}/paket`, label: isId ? 'Paket Tour' : 'Packages' },
    { href: `${localePrefix}/destinasi`, label: isId ? 'Destinasi' : 'Destinations' },
    { href: `${localePrefix}/blog`, label: 'Blog' },
    { href: `${localePrefix}/kontak`, label: isId ? 'Kontak' : 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href={localePrefix} className='flex items-center gap-2'>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className={`h-10 w-auto transition-all ${isScrolled ? 'brightness-90' : 'brightness-110'}`}
              />
            ) : (
              <span className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                <span className='text-teal-500'>Explore</span>Penida
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center gap-8'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-all hover:text-teal-500 relative group ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full ${isScrolled ? 'bg-teal-500' : 'bg-white'}`} />
              </Link>
            ))}

            {/* Locale Switcher */}
            <button
              onClick={switchLocale}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                isScrolled
                  ? 'border-teal-500 text-teal-600 hover:bg-teal-50'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              {isId ? '🌍 EN' : '🌏 ID'}
            </button>

            {/* Booking Button */}
            <Link
              href={`${localePrefix}/booking`}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                isScrolled
                  ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-xl'
                  : 'bg-white text-primary hover:bg-teal-500 hover:text-white shadow-lg'
              }`}
            >
              Booking
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {isMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${
            isScrolled ? 'border-gray-200' : 'border-white/20'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:bg-gray-50' : 'text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={switchLocale}
              className={`block w-full text-left py-3 px-4 font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isId ? '🌍 English' : '🌏 Indonesia'}
            </button>
            <Link
              href={`${localePrefix}/booking`}
              onClick={() => setIsMenuOpen(false)}
              className='block mx-4 mt-4 py-3 bg-teal-500 text-white text-center font-semibold rounded-full'
            >
              Booking Sekarang
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
