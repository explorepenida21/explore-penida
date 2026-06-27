'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const newLocale = locale === 'id' ? 'en' : 'id'

    let newPath: string
    if (pathname) {
      newPath = pathname.replace(/\/(id|en)/, `/${newLocale}`)
    } else {
      newPath = `/${newLocale}`
    }

    router.push(newPath)
  }

  return (
    <button
      onClick={toggleLocale}
      className='fixed top-4 right-4 z-[100] px-4 py-2 bg-primary/90 backdrop-blur-md border border-teal-500/30 rounded-full text-sm font-semibold text-white hover:bg-teal-500 transition-all duration-300 shadow-lg'
      aria-label='Switch Language'
    >
      {locale === 'id' ? 'EN' : 'ID'}
    </button>
  )
}