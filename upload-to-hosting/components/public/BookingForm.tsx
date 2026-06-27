'use client'

import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Paket {
  id: string
  slug: string
  nama: string
  tipe: string
  harga: number
  deskripsi: string
}

interface FormData {
  paketId: string
  tanggalTour: Date | null
  jumlahOrang: number
  namaPemesan: string
  email: string
  noHp: string
  catatan: string
}

interface FormErrors {
  paketId?: string
  tanggalTour?: string
  jumlahOrang?: string
  namaPemesan?: string
  email?: string
  noHp?: string
}

export default function BookingForm() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    paketId: '',
    tanggalTour: null,
    jumlahOrang: 1,
    namaPemesan: '',
    email: '',
    noHp: '',
    catatan: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [totalHarga, setTotalHarga] = useState(0)
  const snapLoaded = useRef(false)

  // Fetch pakets on mount
  useEffect(() => {
    fetchPakets()
  }, [])

  // Load Midtrans Snap JS
  useEffect(() => {
    const script = document.createElement('script')
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    script.onload = () => {
      snapLoaded.current = true
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Calculate total harga
  useEffect(() => {
    if (!Array.isArray(pakets)) return
    const selectedPaket = Array.isArray(pakets) ? pakets.find((p) => p.id === formData.paketId) : undefined
    if (selectedPaket && formData.jumlahOrang > 0) {
      setTotalHarga(selectedPaket.harga * formData.jumlahOrang)
    } else {
      setTotalHarga(0)
    }
  }, [formData.paketId, formData.jumlahOrang, pakets])

  const fetchPakets = async () => {
    try {
      const response = await fetch('/api/paket')
      if (!response.ok) throw new Error('Failed to fetch pakets')
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setPakets(result.data)
      } else {
        setPakets([])
      }
    } catch (error) {
      console.error('Error fetching pakets:', error)
      setPakets([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.paketId) {
      newErrors.paketId = 'Pilih paket tour terlebih dahulu'
    }
    if (!formData.tanggalTour) {
      newErrors.tanggalTour = 'Pilih tanggal tour'
    } else if (formData.tanggalTour < new Date()) {
      newErrors.tanggalTour = 'Tanggal tour tidak boleh di masa lalu'
    }
    if (!formData.jumlahOrang || formData.jumlahOrang < 1) {
      newErrors.jumlahOrang = 'Jumlah orang minimal 1'
    } else if (formData.jumlahOrang > 15) {
      newErrors.jumlahOrang = 'Maksimal 15 orang per booking'
    }
    if (!formData.namaPemesan.trim()) {
      newErrors.namaPemesan = 'Nama lengkap wajib diisi'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!formData.noHp.trim()) {
      newErrors.noHp = 'Nomor HP wajib diisi'
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.noHp.replace(/\s/g, ''))) {
      newErrors.noHp = 'Format nomor HP tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!snapLoaded.current) {
      alert('Midtrans sedang dimuat. Silakan coba beberapa saat lagi.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paketId: formData.paketId,
          tanggalTour: formData.tanggalTour?.toISOString(),
          jumlahOrang: formData.jumlahOrang,
          namaPemesan: formData.namaPemesan,
          email: formData.email,
          noHp: formData.noHp,
          catatan: formData.catatan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat booking')
      }

      // Open Midtrans Snap payment
      if (window.snap && data.snapToken) {
        // Use kodeBooking (the actual booking code) or fallback to orderId
        const bookingCode = data.kodeBooking || data.orderId
        window.snap.pay(data.snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result)
            // Redirect to localized success page with both orderId and order_id for compatibility
            window.location.href = `/id/booking/success?orderId=${bookingCode}&order_id=${bookingCode}&status=success`
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result)
            window.location.href = `/id/booking/success?orderId=${bookingCode}&order_id=${bookingCode}&status=pending`
          },
          onError: (result: any) => {
            console.log('Payment error:', result)
            alert('Pembayaran gagal. Silakan coba lagi.')
          },
          onClose: () => {
            console.log('Customer closed the popup without finishing payment')
            // Redirect to pending page if customer closes popup
            window.location.href = `/id/booking/success?orderId=${bookingCode}&order_id=${bookingCode}&status=pending`
          },
        })
      } else if (data.redirectUrl) {
        // Fallback: redirect mode (if snap popup fails)
        const bookingCode = data.kodeBooking || data.orderId
        window.location.href = data.redirectUrl
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPaket = Array.isArray(pakets) ? pakets.find((p) => p.id === formData.paketId) : undefined

  // Helper function to safely format currency
  const formatCurrency = (value: number | undefined | null): string => {
    if (value == null || isNaN(value)) return '0'
    return value.toLocaleString('id-ID')
  }

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto px-4 py-12'>
        <div className='flex justify-center py-12'>
          <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Paket Pilihan */}
      <div>
        <label className='block text-sm font-semibold text-navy-600 mb-2'>
          Pilih Paket Tour <span className='text-red-500'>*</span>
        </label>
        <select
          value={formData.paketId}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, paketId: e.target.value }))
            setErrors((prev) => ({ ...prev, paketId: undefined }))
          }}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
            errors.paketId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value=''>-- Pilih Paket Tour --</option>
          {Array.isArray(pakets) && pakets.map((paket) => (
            <option key={paket.id} value={paket.id}>
              {paket.nama} - Rp {formatCurrency(paket.harga)}/org
            </option>
          ))}
        </select>
        {errors.paketId && <p className='text-red-500 text-sm mt-1'>{errors.paketId}</p>}
      </div>

      {/* Tanggal Tour & Jumlah Orang */}
      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-semibold text-navy-600 mb-2'>
            Tanggal Tour <span className='text-red-500'>*</span>
          </label>
          <DatePicker
            selected={formData.tanggalTour}
            onChange={(date: Date | null) => {
              setFormData((prev) => ({ ...prev, tanggalTour: date }))
              setErrors((prev) => ({ ...prev, tanggalTour: undefined }))
            }}
            minDate={new Date()}
            dateFormat='dd MMMM yyyy'
            placeholderText='Pilih tanggal'
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
              errors.tanggalTour ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.tanggalTour && <p className='text-red-500 text-sm mt-1'>{errors.tanggalTour}</p>}
        </div>

        <div>
          <label className='block text-sm font-semibold text-navy-600 mb-2'>
            Jumlah Orang <span className='text-red-500'>*</span>
          </label>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setFormData({ ...formData, jumlahOrang: Math.max(1, formData.jumlahOrang - 1) })}
              className='w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold flex items-center justify-center transition-colors'
            >
              -
            </button>
            <input
              type='number'
              min='1'
              max='15'
              value={formData.jumlahOrang}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, jumlahOrang: parseInt(e.target.value) || 1 }))
                setErrors((prev) => ({ ...prev, jumlahOrang: undefined }))
              }}
              className={`w-20 text-center px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.jumlahOrang ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type='button'
              onClick={() => setFormData({ ...formData, jumlahOrang: Math.min(15, formData.jumlahOrang + 1) })}
              className='w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold flex items-center justify-center transition-colors'
            >
              +
            </button>
          </div>
          {errors.jumlahOrang && <p className='text-red-500 text-sm mt-1'>{errors.jumlahOrang}</p>}
        </div>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className='block text-sm font-semibold text-navy-600 mb-2'>
          Nama Lengkap <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          value={formData.namaPemesan}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, namaPemesan: e.target.value }))
            setErrors((prev) => ({ ...prev, namaPemesan: undefined }))
          }}
          placeholder='Masukkan nama lengkap'
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
            errors.namaPemesan ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.namaPemesan && <p className='text-red-500 text-sm mt-1'>{errors.namaPemesan}</p>}
      </div>

      {/* Email & No HP */}
      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-semibold text-navy-600 mb-2'>
            Email <span className='text-red-500'>*</span>
          </label>
          <input
            type='email'
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }))
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            placeholder='email@contoh.com'
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
        </div>

        <div>
          <label className='block text-sm font-semibold text-navy-600 mb-2'>
            Nomor HP / WhatsApp <span className='text-red-500'>*</span>
          </label>
          <input
            type='tel'
            value={formData.noHp}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, noHp: e.target.value }))
              setErrors((prev) => ({ ...prev, noHp: undefined }))
            }}
            placeholder='08xxxxxxxxx'
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
              errors.noHp ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.noHp && <p className='text-red-500 text-sm mt-1'>{errors.noHp}</p>}
        </div>
      </div>

      {/* Catatan */}
      <div>
        <label className='block text-sm font-semibold text-navy-600 mb-2'>
          Catatan (Opsional)
        </label>
        <textarea
          value={formData.catatan}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          rows={3}
          placeholder='Permintaan khusus, alergi makanan, dll.'
          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none'
        />
      </div>

      {/* Total Harga */}
      {selectedPaket && totalHarga > 0 && (
        <div className='bg-teal-50 border border-teal-200 rounded-2xl p-6'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-gray-600'>
              {selectedPaket.nama} × {formData.jumlahOrang} org
            </span>
            <span className='text-gray-600'>
              Rp {formatCurrency(selectedPaket.harga)} × {formData.jumlahOrang}
            </span>
          </div>
          <div className='flex justify-between items-center pt-4 border-t border-teal-200'>
            <span className='text-xl font-bold text-navy-600'>Total Pembayaran</span>
            <span className='text-2xl font-bold text-teal-600'>
              Rp {formatCurrency(totalHarga)}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={submitting || !snapLoaded.current}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          submitting || !snapLoaded.current
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-500 hover:bg-teal-600 shadow-lg hover:shadow-xl'
        } text-white`}
      >
        {submitting ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
            </svg>
            Memproses...
          </span>
        ) : !snapLoaded.current ? (
          'Memuat Payment Gateway...'
        ) : (
          'Bayar Sekarang'
        )}
      </button>

      {/* Info */}
      <p className='text-center text-sm text-gray-500'>
        🔒 Pembayaran aman via Midtrans. Data Anda akan dienkripsi.
      </p>
    </form>
  )
}