import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  pathnames: {
    '/': '/',
    '/paket': {
      id: '/paket',
      en: '/packages',
    },
    '/destinasi': {
      id: '/destinasi',
      en: '/destinations',
    },
    '/booking': {
      id: '/booking',
      en: '/booking',
    },
    '/blog': {
      id: '/blog',
      en: '/blog',
    },
    '/testimoni': {
      id: '/testimoni',
      en: '/testimonials',
    },
    '/kontak': {
      id: '/kontak',
      en: '/contact',
    },
  },
})

export type Locale = (typeof routing.locales)[number]