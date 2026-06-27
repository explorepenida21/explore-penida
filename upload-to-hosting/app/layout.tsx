import './globals.css'
import FaviconLoader from './FaviconLoader'

export const metadata = {
  title: 'Explore Penida | Tour & Travel Nusa Penida',
  description: 'Jelajahi keindahan Nusa Penida',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        {/* Default favicon fallback */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Dynamic favicon loader */}
        <FaviconLoader />
      </head>
      <body>{children}</body>
    </html>
  )
}
