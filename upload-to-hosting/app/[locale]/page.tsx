'use client'

import Navbar from '@/components/public/Navbar'
import HeroParallax from '@/components/public/HeroParallax'
import StatsBanner from '@/components/public/StatsBanner'
import PaketSection from '@/components/public/PaketSection'
import DestinasiHighlight from '@/components/public/DestinasiHighlight'
import IncludeSection from '@/components/public/IncludeSection'
import TestimoniSlider from '@/components/public/TestimoniSlider'
import CTASection from '@/components/public/CTASection'
import Footer from '@/components/public/Footer'
import dynamic from 'next/dynamic'
import '@/app/globals.css'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

export default function HomePage() {
  return (
    <main className='min-h-screen'>
      <Navbar />
      <HeroParallax />
      <StatsBanner />
      <PaketSection />
      <DestinasiHighlight />
      <IncludeSection />
      <TestimoniSlider />
      <CTASection />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  )
}
