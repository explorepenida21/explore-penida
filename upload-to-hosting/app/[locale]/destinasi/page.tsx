import Navbar from '@/components/public/Navbar'
import DestinasiGallery from '@/components/public/DestinasiGallery'
import CTASection from '@/components/public/CTASection'
import Footer from '@/components/public/Footer'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

export default function DestinasiPage() {
  return (
    <main className='min-h-screen'>
      <Navbar />
      <section className='pt-32 pb-16 bg-gradient-to-br from-teal-600 to-teal-800 text-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Destinasi Wisata</h1>
          <p className='text-xl text-teal-100'>Jelajahi keindahan alam Nusa Penida</p>
        </div>
      </section>
      <DestinasiGallery />
      <CTASection />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  )
}
