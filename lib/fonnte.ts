// ============================================================
// Fonnte WhatsApp API Integration
// ============================================================

interface WhatsAppResponse {
  status: boolean
  message: string
  data?: {
    id: string
  }
}

interface BookingNotificationData {
  nama: string
  noHp: string
  email: string
  kodeBooking: string
  namaPaket: string
  tanggalTour: Date | string
  jumlahOrang: number
  totalHarga: number
}

interface AdminNotificationData {
  kodeBooking: string
  namaPemesan: string
  noHp: string
  email: string
  namaPaket: string
  tanggalTour: Date | string
  jumlahOrang: number
  totalHarga: number
}

// ============================================================
// Send WhatsApp Message via Fonnte API
// ============================================================

/**
 * Format nomor telepon ke format internasional Indonesia
 * 08xx -> 628xx, +62 -> 62
 */
function formatPhoneNumber(phone: string): string {
  // Hapus semua karakter non-angka kecuali +
  let cleaned = phone.replace(/[^0-9+]/g, '')

  // Jika sudah ada +, pastikan formatnya benar
  if (cleaned.startsWith('+')) {
    // +628xx -> 628xx (hapus +)
    cleaned = cleaned.substring(1)
  }

  // Jika dimulai dengan 0, ganti dengan 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1)
  }

  // Pastikan nomor dimulai dengan 62
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned
  }

  return cleaned
}

export async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN

  if (!token) {
    console.warn('FONNTE_TOKEN not configured, skipping WhatsApp notification')
    return false
  }

  // Format nomor telepon
  const cleanPhone = formatPhoneNumber(phone)

  try {
    const response = await fetch('https://api.fonnte.com/api/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: cleanPhone,
        message: message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Fonnte API error:', errorData)
      return false
    }

    const data: WhatsAppResponse = await response.json()
    console.log(`[Fonnte] WhatsApp sent to ${cleanPhone}:`, data.status)
    return data.status
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return false
  }
}

// ============================================================
// Format Functions
// ============================================================

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

// ============================================================
// Notification Templates
// ============================================================

/**
 * Kirim notifikasi booking berhasil ke customer
 */
export async function sendBookingConfirmation(data: BookingNotificationData): Promise<boolean> {
  const message = `Halo ${data.nama}! 🌊

Booking kamu BERHASIL dikonfirmasi!

📦 Paket: ${data.namaPaket}
📅 Tanggal: ${formatDate(data.tanggalTour)}
👥 Peserta: ${data.jumlahOrang} orang
💰 Total: ${formatRupiah(data.totalHarga)}
📋 Kode Booking: ${data.kodeBooking}

✅ Silakan tunjukkan kode booking ini kepada driver saat keberangkatan.

Sampai jumpa di Nusa Penida! 🏖️

- Tim Explore Penida
📞 Hubungi kami: +62 812 3456 7890`

  return sendWhatsApp(data.noHp, message)
}

/**
 * Kirim notifikasi pembayaran pending ke customer
 */
export async function sendPaymentReminder(data: BookingNotificationData): Promise<boolean> {
  const message = `Halo ${data.nama}! ⏰

Reminder: Pembayaran untuk booking kamu belum diterima.

📦 Paket: ${data.namaPaket}
📅 Tanggal: ${formatDate(data.tanggalTour)}
👥 Peserta: ${data.jumlahOrang} orang
💰 Total: ${formatRupiah(data.totalHarga)}
📋 Kode Booking: ${data.kodeBooking}

⚠️ Mohon segera selesaikan pembayaran sebelum batas waktu berakhir.

Sudah bayar? Abaikan pesan ini.

Terima kasih! 🙏

- Tim Explore Penida`

  return sendWhatsApp(data.noHp, message)
}

/**
 * Kirim notifikasi pembayaran expired ke customer
 */
export async function sendPaymentExpired(data: BookingNotificationData): Promise<boolean> {
  const message = `Halo ${data.nama}! 😔

Mohon maaf, masa berlaku pembayaran untuk booking kamu telah berakhir.

📦 Paket: ${data.namaPaket}
📅 Tanggal: ${formatDate(data.tanggalTour)}
📋 Kode Booking: ${data.kodeBooking}

Kamu masih bisa melakukan booking ulang melalui website kami di:
${process.env.NEXT_PUBLIC_APP_URL}/booking

Terima kasih atas minatnya! 🙏

- Tim Explore Penida`

  return sendWhatsApp(data.noHp, message)
}

/**
 * Kirim notifikasi reminder H-1 ke customer
 */
export async function sendTourReminder(data: BookingNotificationData): Promise<boolean> {
  const message = `Halo ${data.nama}! 🌴

Reminder: Tour besok sudah dekat! 🎉

📦 Paket: ${data.namaPaket}
📅 Tanggal: ${formatDate(data.tanggalTour)}
👥 Peserta: ${data.jumlahOrang} orang
📋 Kode Booking: ${data.kodeBooking}

📍 Meeting Point:
Pilih tanggal di booking untuk info lokasi penjemputan

💡 Tips:
• Datang 15 menit lebih awal
• Bawa sunscreen & kamera
• Siapkan fisik yang fit! 🏃

Sampai jumpa besok! 🌊

- Tim Explore Penida
📞 +62 812 3456 7890`

  return sendWhatsApp(data.noHp, message)
}

/**
 * Kirim notifikasi ke admin tentang booking baru
 */
export async function sendAdminBookingNotification(data: AdminNotificationData): Promise<boolean> {
  const adminPhone = process.env.ADMIN_WA_NUMBER

  if (!adminPhone) {
    console.warn('ADMIN_WA_NUMBER not configured')
    return false
  }

  const message = `🔔 BOOKING BARU!

📋 Kode: ${data.kodeBooking}
👤 Pemesan: ${data.namaPemesan}
📱 HP: ${data.noHp}
📧 Email: ${data.email}
📦 Paket: ${data.namaPaket}
📅 Tour: ${formatDate(data.tanggalTour)}
👥 Jumlah: ${data.jumlahOrang} orang
💰 Total: ${formatRupiah(data.totalHarga)}

Mohon tindak lanjuti! ⚡

- Auto System`

  return sendWhatsApp(adminPhone, message)
}

/**
 * Kirim notifikasi ke admin tentang pembayaran sukses
 */
export async function sendAdminPaymentNotification(data: AdminNotificationData): Promise<boolean> {
  const adminPhone = process.env.ADMIN_WA_NUMBER

  if (!adminPhone) {
    console.warn('ADMIN_WA_NUMBER not configured')
    return false
  }

  const message = `💰 PEMBAYARAN BERHASIL!

📋 Kode: ${data.kodeBooking}
👤 Pemesan: ${data.namaPemesan}
📱 HP: ${data.noHp}
📦 Paket: ${data.namaPaket}
📅 Tour: ${formatDate(data.tanggalTour)}
👥 Jumlah: ${data.jumlahOrang} orang
✅ Total: ${formatRupiah(data.totalHarga)}

Booking sudah LUNAS! 🎉

- Auto System`

  return sendWhatsApp(adminPhone, message)
}

/**
 * Kirim notifikasi perubahan jadwal ke customer
 */
export async function sendScheduleChangeNotification(
  data: BookingNotificationData,
  alasan: string
): Promise<boolean> {
  const message = `Halo ${data.nama}! 📢

Ada perubahan jadwal untuk booking kamu:

📦 Paket: ${data.namaPaket}
📅 Tanggal Lama: ${formatDate(data.tanggalTour)}
📋 Kode Booking: ${data.kodeBooking}

📝 Alasan: ${alasan}

Mohon hubungi kami untuk konfirmasi jadwal baru.

Terima kasih! 🙏

- Tim Explore Penida
📞 +62 812 3456 7890`

  return sendWhatsApp(data.noHp, message)
}

// ============================================================
// Combined Function - Handle All Booking Notifications
// ============================================================

export async function handleBookingNotifications(
  type: 'new' | 'paid' | 'expired' | 'reminder',
  bookingData: BookingNotificationData
): Promise<void> {
  const adminData: AdminNotificationData = {
    kodeBooking: bookingData.kodeBooking,
    namaPemesan: bookingData.nama,
    noHp: bookingData.noHp,
    email: bookingData.email,
    namaPaket: bookingData.namaPaket,
    tanggalTour: bookingData.tanggalTour,
    jumlahOrang: bookingData.jumlahOrang,
    totalHarga: bookingData.totalHarga,
  }

  switch (type) {
    case 'new':
      await Promise.all([
        sendBookingConfirmation(bookingData),
        sendAdminBookingNotification(adminData),
      ])
      break

    case 'paid':
      await sendAdminPaymentNotification(adminData)
      break

    case 'expired':
      await sendPaymentExpired(bookingData)
      break

    case 'reminder':
      await sendTourReminder(bookingData)
      break
  }
}