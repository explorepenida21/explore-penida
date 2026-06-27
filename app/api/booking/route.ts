import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderId, createBookingTransaction } from '@/lib/midtrans'

/**
 * POST /api/booking
 * Create new booking with Midtrans payment
 *
 * Body: { paketId, tanggalTour, jumlahOrang, namaPemesan, email, noHp, catatan }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paketId, tanggalTour, jumlahOrang, namaPemesan, email, noHp, catatan } = body

    // ============================================================
    // 1. Validasi Input
    // ============================================================
    const errors: string[] = []

    if (!paketId) errors.push('paketId wajib diisi')
    if (!tanggalTour) errors.push('tanggalTour wajib diisi')
    if (!jumlahOrang || parseInt(jumlahOrang) < 1) errors.push('jumlahOrang minimal 1')
    if (parseInt(jumlahOrang) > 15) errors.push('Maksimal 15 orang per booking')
    if (!namaPemesan?.trim()) errors.push('namaPemesan wajib diisi')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('email tidak valid')
    }
    if (!noHp?.trim()) errors.push('noHp wajib diisi')

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      )
    }

    // ============================================================
    // 2. Ambil Data Paket dari DB
    // ============================================================
    const paket = await prisma.paket.findUnique({
      where: { id: paketId },
    })

    if (!paket) {
      return NextResponse.json(
        { success: false, error: 'Paket tidak ditemukan' },
        { status: 404 }
      )
    }

    // ============================================================
    // 3. Cek Kapasitas Jadwal
    // ============================================================
    const tourDate = new Date(tanggalTour)
    tourDate.setHours(0, 0, 0, 0)

    const jadwal = await prisma.jadwalTour.findFirst({
      where: {
        paketId,
        tanggal: tourDate,
      },
    })

    if (jadwal) {
      // Jika tanggal ditutup
      if (jadwal.isTutup) {
        return NextResponse.json(
          { success: false, error: 'Maaf, tanggal ini sudah ditutup. Silakan pilih tanggal lain.' },
          { status: 400 }
        )
      }

      // Jika kapasitas tidak mencukupi
      if (jadwal.tersisa < parseInt(jumlahOrang)) {
        return NextResponse.json(
          { success: false, error: `Maaf, kapasitas tidak mencukupi. Tersisa hanya ${jadwal.tersisa} slot.` },
          { status: 400 }
        )
      }
    }

    // ============================================================
    // 4. Hitung totalHarga = jumlahOrang × paket.harga
    // ============================================================
    const jumlah = parseInt(jumlahOrang)
    const totalHarga = paket.harga * jumlah

    // Generate kode booking unik
    const kodeBooking = generateOrderId()

    // ============================================================
    // 5. Buat record Booking di DB (status: pending)
    // ============================================================
    const booking = await prisma.booking.create({
      data: {
        kodeBooking,
        paketId,
        namaPemesan: namaPemesan.trim(),
        email: email.trim().toLowerCase(),
        noHp: noHp.trim(),
        tanggalTour: tourDate,
        jumlahOrang: jumlah,
        totalHarga,
        status: 'pending',
        paymentStatus: 'unpaid',
        catatan: catatan?.trim() || null,
      },
    })

    // ============================================================
    // 6. Update kapasitas jadwal (kurangi tersisa)
    // ============================================================
    if (jadwal) {
      await prisma.jadwalTour.update({
        where: { id: jadwal.id },
        data: {
          tersisa: jadwal.tersisa - jumlah,
        },
      })
    }

    // ============================================================
    // 7. Buat Midtrans Transaction → dapatkan snapToken
    // ============================================================
    try {
      const { snapToken, redirectUrl, orderId, totalHarga: midtransAmount } = await createBookingTransaction({
        kodeBooking,
        paketNama: paket.nama,
        paketId: paket.id,
        hargaPaket: paket.harga,
        jumlahOrang: jumlah,
        customerNama: namaPemesan,
        customerEmail: email,
        customerPhone: noHp,
      })

      // Update booking dengan snapToken & midtransOrderId
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          snapToken,
          midtransOrderId: orderId,
        },
      })

      // ============================================================
      // 8. Return { snapToken, redirectUrl, orderId, kodeBooking }
      // ============================================================
      return NextResponse.json({
        success: true,
        snapToken,
        redirectUrl,
        orderId: kodeBooking,
        kodeBooking,
        totalHarga: midtransAmount,
        paketNama: paket.nama,
        message: 'Booking berhasil dibuat. Silakan selesaikan pembayaran.',
      })

    } catch (midtransError) {
      // Jika Midtrans gagal, rollback kapasitas & hapus booking
      if (jadwal) {
        await prisma.jadwalTour.update({
          where: { id: jadwal.id },
          data: {
            tersisa: jadwal.tersisa + jumlah,
          },
        })
      }

      await prisma.booking.delete({
        where: { id: booking.id },
      })

      console.error('Midtrans error:', midtransError)
      return NextResponse.json(
        { success: false, error: 'Gagal membuat transaksi pembayaran. Silakan coba lagi.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/booking?orderId=xxx
 * Get booking details by order ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID diperlukan' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { kodeBooking: orderId },
      include: { paket: true },
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        kodeBooking: booking.kodeBooking,
        namaPemesan: booking.namaPemesan,
        email: booking.email,
        noHp: booking.noHp,
        tanggalTour: booking.tanggalTour,
        jumlahOrang: booking.jumlahOrang,
        totalHarga: booking.totalHarga,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paket: booking.paket,
        createdAt: booking.createdAt,
      },
    })
  } catch (error) {
    console.error('Fetch booking error:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data booking' },
      { status: 500 }
    )
  }
}