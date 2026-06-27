import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateNotification, mapTransactionStatus } from '@/lib/midtrans'
import {
  sendBookingConfirmation,
  sendPaymentExpired,
  sendAdminBookingNotification,
  sendAdminPaymentNotification,
  sendPaymentReminder,
} from '@/lib/fonnte'
import { sendBookingConfirmationEmail } from '@/lib/email'

/**
 * POST /api/payment/notification
 * Midtrans Webhook Handler
 *
 * Logic:
 * 1. Verifikasi signature Midtrans
 * 2. Update status booking berdasarkan transaction_status
 * 3. Kirim notifikasi WhatsApp via Fonnte
 */

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json()

    // ============================================================
    // 1. Verifikasi Signature Midtrans
    // ============================================================
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = notification

    // Validasi field wajib
    if (!order_id || !status_code || !gross_amount || !signature_key) {
      console.error('Missing required notification fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verifikasi signature
    const isValidSignature = await validateNotification(
      order_id,
      status_code,
      gross_amount.toString(),
      signature_key
    )

    if (!isValidSignature) {
      console.error('Invalid signature for order:', order_id)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 403 }
      )
    }

    console.log(`[Midtrans Webhook] Received notification for order: ${order_id}, status: ${transaction_status}`)

    // ============================================================
    // Ambil data booking dari DB
    // ============================================================
    const booking = await prisma.booking.findUnique({
      where: { kodeBooking: order_id },
      include: { paket: true },
    })

    if (!booking) {
      console.error('Booking not found for order:', order_id)
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // ============================================================
    // 2. Update status berdasarkan transaction_status
    // ============================================================
    const { bookingStatus, paymentStatus } = mapTransactionStatus(transaction_status)

    // Skip jika status sudah final dan sama
    if (['confirmed', 'done', 'cancelled'].includes(booking.status) && booking.status === bookingStatus) {
      console.log(`Order ${order_id} already in final status: ${booking.status}`)
      return NextResponse.json({ success: true, message: 'No update needed' })
    }

    // Update booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: bookingStatus,
        paymentStatus,
        updatedAt: new Date(),
      },
    })

    console.log(`[Midtrans Webhook] Order ${order_id} updated to status: ${bookingStatus}, paymentStatus: ${paymentStatus}`)

    // ============================================================
    // 3. Kirim Notifikasi WhatsApp
    // ============================================================
    const bookingData = {
      nama: booking.namaPemesan,
      noHp: booking.noHp,
      email: booking.email,
      kodeBooking: booking.kodeBooking,
      namaPaket: booking.paket.nama,
      tanggalTour: booking.tanggalTour,
      jumlahOrang: booking.jumlahOrang,
      totalHarga: booking.totalHarga,
    }

    // Transaction berhasil (settlement/capture) - Pembayaran LUNAS
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      await Promise.all([
        // Kirim konfirmasi ke customer via WhatsApp
        sendBookingConfirmation(bookingData),
        // Kirim email konfirmasi ke customer
        sendBookingConfirmationEmail({
          nama: booking.namaPemesan,
          email: booking.email,
          kodeBooking: booking.kodeBooking,
          namaPaket: booking.paket.nama,
          tanggalTour: booking.tanggalTour,
          jumlahOrang: booking.jumlahOrang,
          totalHarga: booking.totalHarga,
          noHp: booking.noHp,
        }),
        // Kirim notifikasi ke admin
        sendAdminPaymentNotification({
          kodeBooking: booking.kodeBooking,
          namaPemesan: booking.namaPemesan,
          noHp: booking.noHp,
          email: booking.email,
          namaPaket: booking.paket.nama,
          tanggalTour: booking.tanggalTour,
          jumlahOrang: booking.jumlahOrang,
          totalHarga: booking.totalHarga,
        }),
      ])

      console.log(`[Webhook] Payment confirmed for ${order_id}, WhatsApp & Email sent`)

    // Transaction expired - Pembayaran kadaluwarsa
    } else if (transaction_status === 'expire') {
      // Rollback kapasitas jadwal
      const tourDate = new Date(booking.tanggalTour)
      tourDate.setHours(0, 0, 0, 0)

      const jadwal = await prisma.jadwalTour.findFirst({
        where: {
          paketId: booking.paketId,
          tanggal: tourDate,
        },
      })

      if (jadwal) {
        await prisma.jadwalTour.update({
          where: { id: jadwal.id },
          data: {
            tersisa: jadwal.tersisa + booking.jumlahOrang,
          },
        })
      }

      // Kirim notifikasi expired ke customer
      await sendPaymentExpired(bookingData)

      console.log(`[Webhook] Payment expired for ${order_id}, notifications sent`)

    // Transaction cancel - Dibatalkan
    } else if (transaction_status === 'cancel') {
      // Rollback kapasitas jadwal
      const tourDate = new Date(booking.tanggalTour)
      tourDate.setHours(0, 0, 0, 0)

      const jadwal = await prisma.jadwalTour.findFirst({
        where: {
          paketId: booking.paketId,
          tanggal: tourDate,
        },
      })

      if (jadwal) {
        await prisma.jadwalTour.update({
          where: { id: jadwal.id },
          data: {
            tersisa: jadwal.tersisa + booking.jumlahOrang,
          },
        })
      }

      console.log(`[Webhook] Payment cancelled for ${order_id}, slots restored`)

    // Transaction deny - Ditolak
    } else if (transaction_status === 'deny') {
      console.log(`[Webhook] Payment denied for ${order_id}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Notification processed successfully',
    })

  } catch (error) {
    console.error('[Midtrans Webhook] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}