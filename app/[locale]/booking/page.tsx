import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import dynamic from 'next/dynamic'
import BookingFormNew from '@/components/public/BookingFormNew'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

export default function BookingPage() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative pt-32 pb-16 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 text-white overflow-hidden'>
        <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl' />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center'>
            <span className='inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6'>
              <span className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
              Booking Online
            </span>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black mb-4'>
              Pesan Tour Impianmu
            </h1>
            <p className='text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10'>
              Isi formulir dan tim kami akan menghubungi Anda via WhatsApp
            </p>

            <div className='flex flex-wrap justify-center gap-6'>
              <span className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium'>🛡️ Asuransi Terinclude</span>
              <span className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium'>💳 Pembayaran Aman</span>
              <span className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium'>⚡ Konfirmasi Cepat</span>
            </div>
          </div>
        </div>

        <div className='absolute bottom-0 left-0 right-0'>
          <svg viewBox='0 0 1440 80' className='w-full'>
            <path d='M0 80H1440V40C1200 80 720 0 480 40C240 80 0 40 0 40V80Z' fill='white' />
          </svg>
        </div>
      </section>

      {/* Booking Form */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <BookingFormNew />
        </div>
      </section>

      {/* FAQ */}
      <section className='py-16 bg-gradient-to-b from-white to-slate-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>Pertanyaan Umum</h2>
          <div className='space-y-4'>
            {[
              { q: 'Sistem pembayaran?', a: 'Transfer bank, e-wallet, atau kartu kredit via Midtrans.' },
              { q: 'Termasuk asuransi?', a: 'Ya, semua paket sudah termasuk asuransi perjalanan.' },
              { q: 'Cuaca buruk?', a: 'Kami berikan opsi reschedule atau refund penuh.' },
              { q: 'Lama konfirmasi?', a: 'Tim kami menghubungi dalam 1x24 jam.' },
            ].map((faq, i) => (
              <details key={i} className='bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow'>
                <summary className='flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-gray-900'>
                  {faq.q}
                  <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </summary>
                <p className='px-6 pb-6 text-gray-600'>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  )
}
