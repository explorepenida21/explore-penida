'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Paket {
  id: string
  nama: string
  tipe: string
  harga: number
  deskripsi: string
  destinasi: string[]
  foto: string[]
  isActive: boolean
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
  [key: string]: string | undefined
}

export default function BookingFormNew() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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

  const loadMidtrans = () => {
    if (typeof window === 'undefined') return
    const script = document.getElementById('snap-script')
    if (script) return
    const s = document.createElement('script')
    s.id = 'snap-script'
    // Gunakan URL dari environment variable, fallback ke sandbox
    s.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
    s.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    s.onload = () => {
      console.log('[Snap] Midtrans Snap loaded successfully')
    }
    s.onerror = () => {
      console.error('[Snap] Failed to load Midtrans Snap script')
    }
    document.body.appendChild(s)
  }

  const fetchPakets = async () => {
    try {
      const res = await fetch('/api/paket')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setPakets(json.data.filter((p: Paket) => p.isActive !== false))
      } else {
        setPakets([])
      }
    } catch (err) {
      console.error(err)
      setPakets([])
    } finally {
      setLoading(false)
    }
  }

  const selectedPaket = Array.isArray(pakets) ? pakets.find(p => p.id === formData.paketId) : undefined
  const total = selectedPaket ? selectedPaket.harga * formData.jumlahOrang : 0

  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

  const validate = (step: number) => {
    const errs: FormErrors = {}
    if (step === 1) {
      if (!formData.paketId) errs.paketId = 'Pilih paket'
      if (!formData.tanggalTour) errs.tanggalTour = 'Pilih tanggal'
    }
    if (step === 2) {
      if (!formData.namaPemesan.trim()) errs.namaPemesan = 'Nama wajib'
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Email tidak valid'
      if (!formData.noHp.trim()) errs.noHp = 'No. HP wajib'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validate(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, 3))
    }
  }

  const back = () => {
    setCurrentStep(s => Math.max(s - 1, 1))
  }

  const handleWhatsAppPayment = () => {
  if (!validate(2)) return

  const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '628131819818'
  const tanggal = formData.tanggalTour
    ? formData.tanggalTour.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  const message = `🔖 *PESANAN TOUR NUSA PENIDA*
━━━━━━━━━━━━━━━━━━

📦 *Paket:* ${selectedPaket?.nama || '-'}
💰 *Harga/pax:* ${formatRp(selectedPaket?.harga || 0)}
👥 *Jumlah:* ${formData.jumlahOrang} orang
💵 *Total:* ${formatRp(total)}

📅 *Tanggal Tour:* ${tanggal}

👤 *Data Pemesan:*
• Nama: ${formData.namaPemesan}
• Email: ${formData.email}
• WhatsApp: ${formData.noHp}
${formData.catatan ? `📝 *Catatan:* ${formData.catatan}` : ''}

━━━━━━━━━━━━━━━━━━
Mohon infokan langkah pembayaran selanjutnya. Terima kasih! 🙏`

  const encodedMessage = encodeURIComponent(message)
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  window.open(waUrl, '_blank')
}

const handleSubmit = async () => {
  if (!validate(2)) return
  setSubmitting(true)
  try {
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paketId: formData.paketId,
        tanggalTour: formData.tanggalTour ? formData.tanggalTour.toISOString() : null,
        jumlahOrang: formData.jumlahOrang,
        namaPemesan: formData.namaPemesan,
        email: formData.email,
        noHp: formData.noHp,
        catatan: formData.catatan,
      }),
    })
    const json = await res.json()
    console.log('[Booking] Response:', json)

    // Redirect to WhatsApp
    handleWhatsAppPayment()
  } catch (e) {
    console.error('[Booking] Error:', e)
    alert('Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    setSubmitting(false)
  }
}


      // Check if redirectUrl exists
      if (json.redirectUrl) {
        console.log('[Booking] Redirecting to Midtrans...')
        // Redirect ke halaman Midtrans
        window.location.href = json.redirectUrl
      } else if (json.success && json.kodeBooking) {
        // Non-Midtrans flow (booking berhasil tanpa payment gateway)
        // Use both orderId and order_id for compatibility
        window.location.href = `/id/booking/success?orderId=${json.kodeBooking}&order_id=${json.kodeBooking}&status=success`
      } else {
        // Error
        alert(json.error || 'Booking berhasil! Tim kami akan menghubungi Anda.')
      }
    } catch (e) {
      console.error('[Booking] Error:', e)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`ml-3 font-semibold ${currentStep >= step ? 'text-gray-900' : 'text-gray-400'}`}>
                  {['Paket', 'Data', 'Konfirmasi'][i]}
                </span>
                {i < 2 && (
                  <div className={`w-12 h-1 mx-4 rounded ${currentStep > step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Pilih Paket Tour</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {pakets.map(paket => (
                  <label key={paket.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="paket"
                      value={paket.id}
                      checked={formData.paketId === paket.id}
                      onChange={e => {
                        setFormData(f => ({ ...f, paketId: e.target.value }))
                        setErrors({})
                      }}
                      className="peer hidden"
                    />
                    <div className={`p-4 rounded-2xl border-2 transition-all ${formData.paketId === paket.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paketId === paket.id ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                          {formData.paketId === paket.id && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{paket.nama}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{paket.deskripsi}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {paket.destinasi.slice(0, 3).map((d, i) => (
                              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">📍 {d}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-teal-600">{formatRp(paket.harga)}</p>
                          <p className="text-xs text-gray-400">/org</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paketId && <p className="text-red-500 text-sm">{errors.paketId}</p>}

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Tour</label>
                  <DatePicker
                    selected={formData.tanggalTour}
                    onChange={(date: Date | null) => {
                      setFormData(f => ({ ...f, tanggalTour: date }))
                      setErrors(e => ({ ...e, tanggalTour: undefined }))
                    }}
                    minDate={new Date()}
                    dateFormat="dd MMM yyyy"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 ${errors.tanggalTour ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.tanggalTour && <p className="text-red-500 text-sm mt-1">{errors.tanggalTour}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Orang</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, jumlahOrang: Math.max(1, f.jumlahOrang - 1) }))}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl"
                    >−</button>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={formData.jumlahOrang}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 1
                        setFormData(f => ({ ...f, jumlahOrang: Math.min(15, Math.max(1, val)) }))
                      }}
                      className="w-20 text-center py-3 border border-gray-300 rounded-xl font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, jumlahOrang: Math.min(15, f.jumlahOrang + 1) }))}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl"
                    >+</button>
                    <span className="text-gray-500 text-sm ml-2">orang</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Data Diri</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.namaPemesan}
                  onChange={e => {
                    setFormData(f => ({ ...f, namaPemesan: e.target.value }))
                    setErrors(e => ({ ...e, namaPemesan: undefined }))
                  }}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 ${errors.namaPemesan ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.namaPemesan && <p className="text-red-500 text-sm mt-1">{errors.namaPemesan}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData(f => ({ ...f, email: e.target.value }))
                      setErrors(e => ({ ...e, email: undefined }))
                    }}
                    placeholder="email@contoh.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">No. HP / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.noHp}
                    onChange={e => {
                      setFormData(f => ({ ...f, noHp: e.target.value }))
                      setErrors(e => ({ ...e, noHp: undefined }))
                    }}
                    placeholder="08xxxxxxxxxx"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 ${errors.noHp ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.noHp && <p className="text-red-500 text-sm mt-1">{errors.noHp}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (opsional)</label>
                <textarea
                  value={formData.catatan}
                  onChange={e => setFormData(f => ({ ...f, catatan: e.target.value }))}
                  rows={3}
                  placeholder="Alergi, permintaan khusus, dll"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Konfirmasi Booking</h2>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Paket</span>
                  <span className="font-semibold">{selectedPaket ? selectedPaket.nama : '-'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-semibold">
                    {formData.tanggalTour ? formData.tanggalTour.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Jumlah</span>
                  <span className="font-semibold">{formData.jumlahOrang} orang</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-semibold">{formData.namaPemesan}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">WhatsApp</span>
                  <span className="font-semibold">{formData.noHp}</span>
                </div>
              </div>
              {formData.catatan && (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <span className="font-semibold">Catatan:</span> {formData.catatan}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={back}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
              >
                ← Kembali
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg"
              >
                Lanjut →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Memproses...' : '🎫 Bayar Sekarang'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="sticky top-32 bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan</h3>

          {selectedPaket ? (
            <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-4">
                {selectedPaket.foto && selectedPaket.foto[0] ? (
                  <img src={selectedPaket.foto[0]} alt={selectedPaket.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-teal-400 to-teal-600 text-white">🏝️</div>
                )}
              </div>
              <h4 className="font-bold text-gray-900">{selectedPaket.nama}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{selectedPaket.deskripsi}</p>

              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Harga/pax</span>
                  <span>{formatRp(selectedPaket.harga)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah</span>
                  <span>×{formData.jumlahOrang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span>{formData.tanggalTour ? formData.tanggalTour.toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-teal-500 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-teal-600">{formatRp(total)}</span>
                </div>
                <p className="text-xs text-gray-400 text-right">Termasuk pajak</p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p>Pilih paket untuk melihat ringkasan</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-lg">🛡️</span>
              <span>Asuransi perjalanan termasuk</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">⚡</span>
              <span>Konfirmasi 1x24 jam</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🔄</span>
              <span>Reschedule gratis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
