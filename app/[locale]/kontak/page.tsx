import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

export default function KontakPage() {
  return (
    <main className='min-h-screen'>
      <Navbar />
      <section className='pt-32 pb-16 bg-gradient-to-br from-teal-600 to-teal-800 text-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Hubungi Kami</h1>
          <p className='text-xl text-teal-100'>Kami siap membantu Anda</p>
        </div>
      </section>
      <div className='max-w-4xl mx-auto px-4 py-16'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold text-navy-600 mb-6'>Informasi Kontak</h2>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <span className='text-2xl'>📍</span>
                  <div>
                    <p className='font-semibold'>Alamat</p>
                    <p className='text-gray-600'>Nusa Penida, Klungkung, Bali</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-2xl'>📱</span>
                  <div>
                    <p className='font-semibold'>WhatsApp</p>
                    <a href='https://wa.me/628131819818' className='text-teal-500 hover:text-teal-600'>+62 813-1819-818</a>
                   </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-2xl'>📧</span>
                  <div>
                    <p className='font-semibold'>Email</p>
                    <a href='mailto:info@explorepenida.com' className='text-teal-500 hover:text-teal-600'>info@explorepenida.com</a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-navy-600 mb-6'>Kirim Pesan</h2>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Nama</label>
                  <input type='text' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent' placeholder='Nama lengkap' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                  <input type='email' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent' placeholder='email@example.com' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Pesan</label>
                  <textarea rows={4} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent' placeholder='Tulis pesan Anda...' />
                </div>
                <button type='submit' className='w-full py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors'>
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  )
}
