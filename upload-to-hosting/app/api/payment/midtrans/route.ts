import { NextResponse } from 'next/server'
import midtransClient from 'midtrans-client'

export async function POST(request: Request) {
  try {
    const { bookingId, amount, customerDetails } = await request.json()

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })

    const parameter = {
      transaction_details: {
        order_id: `booking-${bookingId}-${Date.now()}`,
        gross_amount: amount,
      },
      customer_details: customerDetails,
      credit_card: {
        secure: true,
      },
      // ============================================================
      // Konfigurasi Payment Methods - Wajib untuk QRIS & VA
      // ============================================================
      enabled_payments: [
        'gopay',           // GoPay
        'qris',            // QRIS (semua e-wallet)
        'bank_transfer',   // Transfer Bank
        'bca_va',          // BCA Virtual Account
        'bni_va',          // BNI Virtual Account
        'bri_va',          // BRI Virtual Account
        'permata_va',      // Permata Virtual Account
        'echannel',        // Mandiri Bill Payment
        'cstore',          // Indomaret, Alfamart
        'credit_card',     // Kartu Kredit
      ],
      expiry: {
        start_time: new Date().toISOString(),
        duration: 24,
        unit: 'hours',
      },
    }

    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    })
  } catch (error) {
    console.error('Midtrans error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}