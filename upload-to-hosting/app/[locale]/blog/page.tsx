import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import BlogClient from '@/app/blog/BlogClient'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-teal-600 via-teal-700 to-navy-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-40 right-20 text-8xl opacity-20">🏝️</div>
        <div className="absolute bottom-20 left-20 text-6xl opacity-20">🌊</div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            📝 Blog & Artikel
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Tips & Informasi Wisata
            <span className="block text-teal-300">Nusa Penida</span>
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Temukan panduan lengkap, tips traveling, dan cerita menarik tentang destinasi wisata paling cantik di Bali
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-teal-200 text-sm">Artikel</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-teal-200 text-sm">Pembaca</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">⭐ 4.9</p>
              <p className="text-teal-200 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </section>

      <BlogClient />

      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </div>
  )
}