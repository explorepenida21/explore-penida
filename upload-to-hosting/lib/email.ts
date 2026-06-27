// ============================================================
// Email Sending Library using Nodemailer
// ============================================================

import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface BookingEmailData {
  nama: string
  email: string
  kodeBooking: string
  namaPaket: string
  tanggalTour: Date | string
  jumlahOrang: number
  totalHarga: number
  noHp: string
}

// ============================================================
// Create Transporter
// ============================================================
function createTransporter(): nodemailer.Transporter | null {
  const host = process.env.EMAIL_HOST
  const port = parseInt(process.env.EMAIL_PORT || '587')
  const secure = process.env.EMAIL_SECURE === 'true'
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!host || !user || !pass) {
    console.warn('Email configuration not found in environment variables')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

// ============================================================
// Format Helpers
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

// ============================================================
// HTML Email Template - Booking Confirmation
// ============================================================
function createBookingConfirmationHTML(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Berhasil - Explore Penida</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdfa;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header Card -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center; color: white;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 800;">Pembayaran Berhasil!</h1>
      <p style="margin: 0; opacity: 0.9; font-size: 16px;">Booking tour Anda sudah terkonfirmasi</p>
    </div>

    <!-- Content Card -->
    <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">

      <!-- Greeting -->
      <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151;">
        Halo <strong style="color: #0f766e;">${data.nama}</strong>! 👋
</p>
      <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
        Terima kasih telah memesan tour di <strong>Explore Penida</strong>. Pembayaran Anda telah kami terima dan booking sudah<span style="color: #059669; font-weight: 600;">BERHASIL</span> terkonfirmasi.
</p>

      <!-- Booking Code -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #b45309; font-weight: 600;">Kode Booking</p>
        <p style="margin: 0; font-size: 28px; font-weight: 800; color: #b45309; letter-spacing: 3px;">${data.kodeBooking}</p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #92400e;">Silakan tunjukkan kode ini saat keberangkatan</p>
      </div>

      <!-- Booking Details -->
      <div style="background: #f0fdfa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0d9488; font-weight: 600;">Detail Booking</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 40%;">Paket Tour</td>
            <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600;">${data.namaPaket}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #d1fae5;">Tanggal Tour</td>
            <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; border-top: 1px solid #d1fae5;">${formatDate(data.tanggalTour)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #d1fae5;">Jumlah Peserta</td>
            <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; border-top: 1px solid #d1fae5;">${data.jumlahOrang} orang</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #d1fae5;">Nama Pemesan</td>
            <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; border-top: 1px solid #d1fae5;">${data.nama}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #d1fae5;">WhatsApp</td>
            <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600; border-top: 1px solid #d1fae5;">${data.noHp}</td>
          </tr>
        </table>
      </div>

      <!-- Total Payment -->
      <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8);">Total Pembayaran</p>
        <p style="margin: 0; font-size: 32px; font-weight: 800; color: white;">${formatRupiah(data.totalHarga)}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.8);">✓ Pembayaran Lunas</p>
      </div>

      <!-- Info Box -->
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.6;">
 💡 <strong>Tips untuk tour:</strong> Datang 15 menit lebih awal, bawa sunscreen, dan siapkan kamera untuk spot-spot terbaik! 📸
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://explorepenida.com'}/id/booking"
           style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">
 Booking Lagi →
        </a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
          Sampai jumpa di Nusa Penida! 🏝️🌊
        </p>
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          Tim Explore Penida<br/>
          📞 +62 812 3456 7890<br/>
          📧 info@explorepenida.com
        </p>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 11px;">
      <p style="margin: 0;">Email ini dikirim secara otomatis oleh sistem Explore Penida</p>
      <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Explore Penida. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
}

// ============================================================
// Plain Text Email Template
// ============================================================
function createBookingConfirmationText(data: BookingEmailData): string {
  return `
BOOKING TOUR NUSA PENIDA - BERHASIL!

Halo ${data.nama}!

Pembayaran Anda telah kami terima. Booking Anda sudah terkonfirmasi.

==============================================
KODE BOOKING: ${data.kodeBooking}
==============================================

Detail Booking:
- Paket Tour : ${data.namaPaket}
- Tanggal    : ${formatDate(data.tanggalTour)}
- Peserta    : ${data.jumlahOrang} orang
- Total      : ${formatRupiah(data.totalHarga)}
- Status     : LUNAS ✓

==============================================

💡 Tips: Datang 15 menit lebih awal dan bawa sunscreen!

Sampai jumpa di Nusa Penida! 🏝️🌊

---
Tim Explore Penida
📞 +62 812 3456 7890
📧 info@explorepenida.com
`
}

// ============================================================
// Send Booking Confirmation Email
// ============================================================
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn('Email transporter not configured, skipping email')
    return false
  }

  try {
    await transporter.sendMail({
      from: `"Explore Penida" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `🎉 Booking Berhasil! - ${data.kodeBooking}`,
      text: createBookingConfirmationText(data),
      html: createBookingConfirmationHTML(data),
    })

    console.log(`[Email] Booking confirmation sent to ${data.email} for ${data.kodeBooking}`)
    return true
  } catch (error) {
    console.error('[Email] Failed to send booking confirmation:', error)
    return false
  }
}

// ============================================================
// Send Payment Reminder Email
// ============================================================
export async function sendPaymentReminderEmail(data: BookingEmailData): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn('Email transporter not configured, skipping email')
    return false
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reminder Pembayaran</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #fef3c7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f59e0b; border-radius: 16px 16px 0 0; padding: 32px; text-align: center; color: white;">
      <div style="font-size: 48px;">⏰</div>
      <h1 style="margin: 16px 0 0 0; font-size: 24px;">Reminder Pembayaran</h1>
    </div>
    <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px;">
      <p style="font-size: 16px; color: #374151;">
        Halo<strong>${data.nama}</strong>! 👋
</p>
      <p style="font-size: 14px; color: #6b7280;">
        Ini adalah reminder untuk pembayaran booking Anda. Silakan selesaikan pembayaran sebelum batas waktu berakhir.
      </p>
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #92400e;">KODE BOOKING</p>
        <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; color: #b45309;">${data.kodeBooking}</p>
      </div>
      <p style="font-size: 14px; color: #6b7280;">
        Total: <strong>${formatRupiah(data.totalHarga)}</strong>
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 24px;">
        - Tim Explore Penida
</p>
    </div>
  </div>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: `"Explore Penida" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `⏰ Reminder: Selesaikan Pembayaran - ${data.kodeBooking}`,
      html,
 })
    return true
  } catch (error) {
    console.error('[Email] Failed to send payment reminder:', error)
    return false
  }
}

// ============================================================
// Send Payment Expired Email
// ============================================================
export async function sendPaymentExpiredEmail(data: BookingEmailData): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn('Email transporter not configured, skipping email')
    return false
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pembayaran Kadaluwarsa</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background-color: #fee2e2;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #ef4444; border-radius: 16px 16px 0 0; padding: 32px; text-align: center; color: white;">
      <div style="font-size: 48px;">😔</div>
      <h1 style="margin: 16px 0 0 0; font-size: 24px;">Pembayaran Kadaluwarsa</h1>
    </div>
    <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px;">
      <p style="font-size: 16px; color: #374151;">
        Halo <strong>${data.nama}</strong>,
</p>
      <p style="font-size: 14px; color: #6b7280;">
        Mohon maaf, masa berlaku pembayaran untuk booking Anda telah berakhir. Anda masih bisa melakukan booking ulang melalui website kami.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://explorepenida.com'}/id/booking"
           style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600;">
          Booking Ulang →
</a>
      </div>
      <p style="font-size: 12px; color: #9ca3af;">
        - Tim Explore Penida
      </p>
    </div>
  </div>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: `"Explore Penida" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `😔 Pembayaran Kadaluwarsa - ${data.kodeBooking}`,
      html,
    })
    return true
  } catch (error) {
    console.error('[Email] Failed to send expired email:', error)
    return false
  }
}
