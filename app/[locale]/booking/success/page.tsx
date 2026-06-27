'use client'

import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState, useRef } from 'react'

const ChatWidget = dynamic(() => import('@/components/public/ChatWidget'), { ssr: false })
const WhatsAppButton = dynamic(() => import('@/components/public/WhatsAppButton'), { ssr: false })

// ============================================================
// Types
// ============================================================
interface BookingDetail {
  id: string
  kodeBooking: string
  namaPemesan: string
  email: string
  noHp: string
  tanggalTour: string
  jumlahOrang: number
  totalHarga: number
  status: string
  paymentStatus: string
  paket: {
    nama: string
    tipe: string
    harga: number
  }
  createdAt: string
}

// ============================================================
// Confetti Component
// ============================================================
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#22c55e']
    const particles: Particle[] = []
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    class Particle {
      x: number
      y: number
      color: string
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight - canvasHeight
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 8 + 4
        this.speedX = Math.random() * 4 - 2
        this.speedY = Math.random() * 3 + 2
        this.rotation = Math.random() * 360
        this.rotationSpeed = Math.random() * 10 - 5
      }

      update() {
        this.y += this.speedY
        this.x += this.speedX
        this.rotation += this.rotationSpeed
        if (this.y > canvasHeight) {
          this.y = -20
          this.x = Math.random() * canvasWidth
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)
        ctx.fillStyle = this.color
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2)
        ctx.restore()
      }
    }

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle())
    }

    let animationId: number
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ position: 'fixed', top: 0, left: 0 }}
    />
  )
}

// ============================================================
// Animated Checkmark
// ============================================================
function AnimatedCheckmark() {
  return (
    <div className="relative w-28 h-28 mx-auto mb-6">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse" />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray="283"
          strokeDashoffset="283"
          className="animate-circle"
        />
        <path
          d="M30 50 L45 65 L70 35"
          fill="none"
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          strokeDashoffset="60"
          className="animate-check"
        />
      </svg>
      <style>{`
        @keyframes circle-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes check-draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-circle {
          animation: circle-draw 0.6s ease-out forwards;
        }
        .animate-check {
          animation: check-draw 0.4s ease-out 0.5s forwards;
        }
      `}</style>
    </div>
  )
}

// ============================================================
// Receipt Card Component
// ============================================================
function ReceiptCard({ booking }: { booking: BookingDetail }) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || downloading) return

    setDownloading(true)
    try {
      const element = receiptRef.current

      // Dynamic import html2pdf to avoid SSR issues
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule

      const options = {
        margin: 10,
        filename: `Struk-Booking-${booking.kodeBooking}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a5' as const,
          orientation: 'portrait' as const
        }
      }

      await (html2pdf as any)().set(options).from(element).save()
      console.log('PDF downloaded successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Gagal mengunduh PDF. Silakan coba lagi.')
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.kodeBooking)
    alert('Kode booking berhasil disalin!')
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg mx-auto" id="receipt-card" ref={receiptRef}>
      {/* Header */}
      <div className="receipt-header bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-5 text-white text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
        <p className="text-teal-100 text-sm mt-1">Struk booking sudah dikirim ke WhatsApp & Email</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Kode Booking */}
        <div className="booking-code bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Kode Booking</p>
          <p className="text-2xl font-black text-amber-600 tracking-widest">{booking.kodeBooking}</p>
          <button
            onClick={handleCopyCode}
            className="no-print mt-2 text-xs text-amber-500 hover:text-amber-700 underline"
          >
            📋 Salin kode
          </button>
        </div>

        {/* Detail */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Paket Tour</span>
            <span className="font-semibold text-gray-900 text-right">{booking.paket?.nama || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Tanggal Tour</span>
            <span className="font-semibold text-gray-900">{booking.tanggalTour ? formatDate(booking.tanggalTour) : '-'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Jumlah Peserta</span>
            <span className="font-semibold text-gray-900">{booking.jumlahOrang} orang</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Nama Pemesan</span>
            <span className="font-semibold text-gray-900">{booking.namaPemesan}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="font-semibold text-gray-900 text-sm">{booking.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500 text-sm">No. WhatsApp</span>
            <span className="font-semibold text-gray-900">{booking.noHp}</span>
          </div>
        </div>

        {/* Total */}
        <div className="total-price bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Total Pembayaran</span>
            <span className="text-2xl font-black text-teal-600">{formatRp(booking.totalHarga)}</span>
          </div>
          <p className="text-xs text-teal-500 mt-1 text-right">✓ Sudah lunas</p>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="no-print w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {downloading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengunduh...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Struk
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-xs text-gray-400">
          Dibuat: {new Date(booking.createdAt).toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  )
}

// ============================================================
// WhatsApp Preview Component
// ============================================================
function WhatsAppPreview({ booking }: { booking: BookingDetail }) {
  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const message = `Halo ${booking.namaPemesan}! 🌊

Booking kamu BERHASIL dikonfirmasi! 🎉

📦 Paket: ${booking.paket?.nama || '-'}
📅 Tanggal: ${booking.tanggalTour ? formatDate(booking.tanggalTour) : '-'}
👥 Peserta: ${booking.jumlahOrang} orang
💰 Total: ${formatRp(booking.totalHarga)}
📋 Kode Booking: ${booking.kodeBooking}

✅ Silakan tunjukkan kode booking ini kepada driver saat keberangkatan.

Sampai jumpa di Nusa Penida! 🏖️

- Tim Explore Penida
📞 Hubungi kami: +62 812 3456 7890`

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-3 text-white flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="font-semibold text-sm">Pesan WhatsApp yang akan dikirim</span>
      </div>
      <div className="p-4">
        <div className="bg-[#dcf8c6] rounded-2xl rounded-bl-md p-4 text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
          {message}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          ✓ Pesan ini akan otomatis dikirim ke WhatsApp Anda setelah pembayaran terkonfirmasi
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Email Preview Component
// ============================================================
function EmailPreview({ booking }: { booking: BookingDetail }) {
  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-white flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold text-sm">Email Konfirmasi yang akan dikirim</span>
      </div>
      <div className="p-4">
        {/* Email Header Mock */}
        <div className="border-b border-gray-200 pb-3 mb-3">
          <p className="text-xs text-gray-400">Kepada:</p>
          <p className="font-semibold text-sm text-gray-800">{booking.email}</p>
          <p className="text-xs text-gray-400 mt-1">Subjek: 🎉 Booking Tour Nusa Penida Berhasil - {booking.kodeBooking}</p>
        </div>

        {/* Email Body Mock */}
        <div className="space-y-3 text-sm text-gray-700">
          <p>Halo <strong>{booking.namaPemesan}</strong>! 👋</p>
          <p>Terima kasih telah memesan tour di <strong>Explore Penida</strong>! 🎉</p>
          <p>Pembayaran Anda telah kami terima dan booking Anda sudah <span className="text-green-600 font-semibold">BERHASIL</span>.</p>

          <div className="bg-blue-50 rounded-xl p-3 space-y-1 text-xs">
            <p><strong>📋 Kode Booking:</strong> <span className="font-mono text-blue-600">{booking.kodeBooking}</span></p>
            <p><strong>📦 Paket:</strong> {booking.paket?.nama || '-'}</p>
            <p><strong>📅 Tanggal:</strong> {booking.tanggalTour ? formatDate(booking.tanggalTour) : '-'}</p>
            <p><strong>👥 Peserta:</strong> {booking.jumlahOrang} orang</p>
            <p><strong>💰 Total:</strong> <span className="text-green-600 font-semibold">{formatRp(booking.totalHarga)}</span></p>
          </div>

          <p>Struk booking terlampir di email ini. Silakan tunjukkan saat hari H.</p>
          <p>Sampai jumpa di Nusa Penida! 🏝️🌊</p>
          <p className="text-gray-500 text-xs">- Tim Explore Penida<br/>📞 +62 812 3456 7890</p>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          ✓ Email konfirmasi akan dikirim ke {booking.email}
        </p>
      </div>
    </div>
  )
}

// ============================================================
// Loading State
// ============================================================
function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-gray-500">Memuat struk booking...</p>
      </div>
    </div>
  )
}

// ============================================================
// Success Content
// ============================================================
function BookingSuccessContent() {
  const { useSearchParams } = require('next/navigation')
  const searchParams = useSearchParams()

  // Support both orderId and order_id parameters (Midtrans may use either)
  const orderId = searchParams.get('orderId') || searchParams.get('order_id')
  const status = searchParams.get('status')
  const transactionStatus = searchParams.get('transaction_status')

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('Kode booking tidak ditemukan. Pastikan Anda menyelesaikan pembayaran terlebih dahulu.')
      setLoading(false)
      return
    }

    console.log('[Success Page] Fetching booking with orderId:', orderId)

    fetch(`/api/booking?orderId=${encodeURIComponent(orderId)}`)
      .then(async (res) => {
        const data = await res.json()
        console.log('[Success Page] API Response:', data)

        if (data.success && data.data) {
          setBooking(data.data)
        } else {
          // Check for specific error types
          if (data.error?.includes('tidak ditemukan') || data.error?.includes('not found')) {
            setError(`Booking dengan kode "${orderId}" tidak ditemukan. Silakan hubungi admin jika Anda sudah melakukan pembayaran.`)
          } else {
            setError(data.error || 'Booking tidak ditemukan')
          }
        }
      })
      .catch((err) => {
        console.error('[Success Page] Fetch error:', err)
        setError('Gagal memuat data booking. Silakan refresh halaman atau hubungi admin.')
      })
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <LoadingFallback />

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-2">{error || 'Terjadi kesalahan'}</p>

          {/* Show transaction status if available */}
          {transactionStatus && (
            <p className="text-sm text-gray-500 mb-4">
              Status transaksi: <span className="font-semibold">{transactionStatus}</span>
            </p>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Kode booking: <code className="bg-gray-100 px-2 py-1 rounded">{orderId || 'N/A'}</code>
            </p>
            <a href="/id/booking" className="inline-block px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600">
              Kembali ke Booking
            </a>
            <p className="text-xs text-gray-400">
              Jika masalah terus berlanjut, silakan hubungi admin dengan menyertakan kode booking di atas.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isSuccess = status === 'success' || transactionStatus === 'settlement' || transactionStatus === 'capture'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Success Banner */}
      {isSuccess && <Confetti />}

      {/* Main Message */}
      <div className="text-center">
        {isSuccess ? (
          <>
            <AnimatedCheckmark />
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Pembayaran Berhasil! 🎉
            </h1>
            <p className="text-gray-500 text-lg">
              Terima kasih, {booking.namaPemesan}! Booking Anda sudah terkonfirmasi.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Menunggu Pembayaran ⏳
            </h1>
            <p className="text-gray-500 text-lg">
              Selesaikan pembayaran untuk mengaktifkan booking Anda.
            </p>
          </>
        )}
      </div>

      {/* Receipt Card */}
      <ReceiptCard booking={booking} />

      {/* Notification Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 text-center">📬 Notifikasi yang Akan Dikirim</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <WhatsAppPreview booking={booking} />
          <EmailPreview booking={booking} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <a
          href="/id/booking"
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-center transition-colors"
        >
          Booking Lagi
        </a>
        <a
          href={`https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20bertanya%20tentang%20booking%20${booking.kodeBooking}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-center transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <section className="pt-28 pb-8 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 text-white relative overflow-hidden no-print">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Booking Confirmed
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Booking Tour Nusa Penida</h1>
          <p className="text-teal-100 text-lg">Struk & kode booking akan dikirim via WhatsApp & Email</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full">
            <path d="M0 80H1440V40C1200 80 720 0 480 40C240 80 0 40 0 40V80Z" fill="white" />
          </svg>
        </div>
      </section>
      <Suspense fallback={<LoadingFallback />}>
        <BookingSuccessContent />
      </Suspense>
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  )
}
