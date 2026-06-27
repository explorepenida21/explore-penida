import Midtrans from 'midtrans-client'

// ============================================================
// Midtrans Configuration
// ============================================================
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'

// Initialize Midtrans Snap Client
export const snap = new Midtrans.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
})

// Initialize Midtrans Core API (untuk webhook validation)
export const coreApi = new Midtrans.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
})

// ============================================================
// Type Definitions
// ============================================================
export interface TransactionDetails {
  order_id: string
  gross_amount: number
}

export interface CustomerDetails {
  first_name: string
  last_name?: string
  email: string
  phone: string
}

export interface ItemDetail {
  id: string
  price: number
  quantity: number
  name: string
}

export interface ExpiryConfig {
  start_time?: string
  end_time?: string
}

export interface TransactionParameter {
  transaction_details: TransactionDetails
  customer_details: CustomerDetails
  item_details: ItemDetail[]
  expiry?: ExpiryConfig
  callbacks?: {
    finish?: string
    pending?: string
    error?: string
    close?: string
  }
}

export interface TransactionResult {
  token: string
  redirect_url: string
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Generate unique order ID untuk transaksi
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `EP-${timestamp}-${random}`
}

/**
 * Build parameter transaksi untuk Midtrans Snap
 */
export function buildTransactionParameter({
  orderId,
  grossAmount,
  customerFirstName,
  customerLastName,
  customerEmail,
  customerPhone,
  items,
  finishUrl,
}: {
  orderId: string
  grossAmount: number
  customerFirstName: string
  customerLastName?: string
  customerEmail: string
  customerPhone: string
  items: Array<{ id: string; price: number; quantity: number; name: string }>
  finishUrl?: string
}): TransactionParameter {
  const parameter: TransactionParameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    customer_details: {
      first_name: customerFirstName,
      last_name: customerLastName || '',
      email: customerEmail,
      phone: customerPhone,
    },
    item_details: items,
    // expiry: Midtrans will use default (24 hours)
  }

  if (finishUrl) {
    parameter.callbacks = {
      finish: finishUrl,
    }
  }

  return parameter
}

/**
 * Format date for Midtrans: yyyy-MM-dd hh:mm:ss +0700
 */
function formatDateForMidtrans(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Timezone offset for WIB (UTC+7)
  const tzOffset = '+0700'

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${tzOffset}`
}

/**
 * Calculate total amount dari item details
 */
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// ============================================================
// Core Transaction Functions
// ============================================================

/**
 * Create Snap Transaction
 * Menghasilkan snapToken untuk ditampilkan di frontend
 */
export async function createSnapTransaction(parameter: TransactionParameter): Promise<TransactionResult> {
  try {
    console.log('[Midtrans] Creating transaction with params:', JSON.stringify(parameter, null, 2))
    console.log('[Midtrans] isProduction:', process.env.MIDTRANS_IS_PRODUCTION)
    console.log('[Midtrans] ServerKey exists:', !!process.env.MIDTRANS_SERVER_KEY)
    console.log('[Midtrans] ClientKey exists:', !!process.env.MIDTRANS_CLIENT_KEY)

    const transaction = await snap.createTransaction(parameter)
    console.log('[Midtrans] Transaction created successfully:', transaction.token.substring(0, 20) + '...')

    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    }
  } catch (error: any) {
    console.error('[Midtrans] CreateTransaction error:', error)
    console.error('[Midtrans] Error message:', error?.message)
    console.error('[Midtrans] Error response:', error?.response?.body)
    throw new Error(`Gagal membuat transaksi Midtrans: ${error?.message || error}`)
  }
}

/**
 * Validate Midtrans Notification Signature
 */
export async function validateNotification(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): Promise<boolean> {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const rawSignature = orderId + statusCode + grossAmount + serverKey

    // Import crypto untuk hash
    const encoder = new TextEncoder()
    const data = encoder.encode(rawSignature)
    const hashBuffer = await crypto.subtle.digest('SHA-512', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return signatureKey === expectedSignature
  } catch (error) {
    console.error('Signature validation error:', error)
    return false
  }
}

/**
 * Get transaction status dari Midtrans
 */
export async function getTransactionStatus(orderId: string) {
  try {
    const status = await coreApi.transaction.status(orderId)
    return status
  } catch (error) {
    console.error('Get transaction status error:', error)
    throw new Error('Gagal mengambil status transaksi')
  }
}

/**
 * Map Midtrans transaction status ke status booking
 */
export function mapTransactionStatus(transactionStatus: string): {
  bookingStatus: string
  paymentStatus: string
} {
  const statusMap: Record<string, { bookingStatus: string; paymentStatus: string }> = {
    'capture': { bookingStatus: 'paid', paymentStatus: 'paid' },
    'settlement': { bookingStatus: 'paid', paymentStatus: 'paid' },
    'pending': { bookingStatus: 'pending', paymentStatus: 'unpaid' },
    'deny': { bookingStatus: 'cancelled', paymentStatus: 'unpaid' },
    'expire': { bookingStatus: 'cancelled', paymentStatus: 'unpaid' },
    'cancel': { bookingStatus: 'cancelled', paymentStatus: 'unpaid' },
    'refund': { bookingStatus: 'cancelled', paymentStatus: 'refunded' },
  }

  return statusMap[transactionStatus] || { bookingStatus: 'pending', paymentStatus: 'unpaid' }
}

// ============================================================
// Convenience Functions untuk Booking
// ============================================================

/**
 * Create transaction untuk booking tour
 */
export async function createBookingTransaction({
  kodeBooking,
  paketNama,
  paketId,
  hargaPaket,
  jumlahOrang,
  customerNama,
  customerEmail,
  customerPhone,
}: {
  kodeBooking: string
  paketNama: string
  paketId: string
  hargaPaket: number
  jumlahOrang: number
  customerNama: string
  customerEmail: string
  customerPhone: string
}): Promise<{ snapToken: string; redirectUrl: string; orderId: string; totalHarga: number }> {
  const totalHarga = hargaPaket * jumlahOrang
  const namaParts = customerNama.split(' ')
  const firstName = namaParts[0]
  const lastName = namaParts.slice(1).join(' ') || ''

  const parameter = buildTransactionParameter({
    orderId: kodeBooking,
    grossAmount: totalHarga,
    customerFirstName: firstName,
    customerLastName: lastName,
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    items: [
      {
        id: paketId,
        price: hargaPaket,
        quantity: jumlahOrang,
        name: paketNama,
      },
    ],
    finishUrl: `${process.env.NEXT_PUBLIC_APP_URL}/id/booking/success?orderId=${kodeBooking}&order_id=${kodeBooking}`,
  })

  // ============================================================
  // Konfigurasi Payment Methods - Wajib untuk QRIS & VA
  // ============================================================
  // Aktifkan metode pembayaran yang diinginkan
  ;(parameter as any).enabled_payments = [
    'gopay',           // GoPay
    'qris',            // QRIS ( semua e-wallet: OVO, DANA, ShopeePay, dll)
    'bank_transfer',   // Transfer Bank
    'bca_va',          // BCA Virtual Account
    'bni_va',          // BNI Virtual Account
    'bri_va',          // BRI Virtual Account
    'permata_va',      // Permata Virtual Account
    'echannel',        // Mandiri Bill Payment
    'cstore',          // Indomaret, Alfamart
    'credit_card',     // Kartu Kredit
  ]

  // Konfigurasi spesifik untuk QRIS
  ;(parameter as any).credit_card = {
    secure: true,
  }

  // Hapus expiry - biarkan Midtrans pakai default
  delete (parameter as any).expiry

  const transaction = await createSnapTransaction(parameter)

  return {
    snapToken: transaction.token,
    redirectUrl: transaction.redirect_url,
    orderId: kodeBooking,
    totalHarga,
  }
}