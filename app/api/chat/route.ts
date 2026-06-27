import { NextRequest, NextResponse } from 'next/server'

// System prompt for Explore Penida chatbot
const SYSTEM_PROMPT = `Kamu adalah asisten wisata Explore Penida yang ramah dan helpful.

Tugasmu:
- Membantu pengunjung website dengan pertanyaan tentang tour dan destinasi di Nusa Penida
- Memberikan informasi akurat tentang paket tour, harga, dan fasilitas
- Membantu persiapan wisata ke Nusa Penida

Data Paket Tour:
1. Tour Timur - Rp 550.000/orang
   Destinasi: Diamond Beach, Atuh Beach, Tree House, Thousand Islands Viewpoint, Suwehan Beach

2. Tour Barat - Rp 550.000/orang
   Destinasi: Kelingking Beach, Angel's Billabong, Broken Beach, Crystal Bay, Palung Cliff

3. Mix Tour - Rp 650.000/orang
   Destinasi: Semua destinasi terbaik (Kelingking, Angel's Billabong, Broken Beach, Diamond Beach, Atuh Beach, Tree House)

Semua Paket Include:
- Tiket boat pulang pergi
- Makan siang tradisional Bali
- Mobil + Driver + Bensin
- Driver merangkap fotografer
- Tiket masuk semua destinasi
- Asuransi tour

Format Jawaban:
- Bahasa Indonesia yang baik dan benar
- Singkat dan jelas (maksimal 2-3 paragraf)
- Gunakan emoji yang relevan untuk mempercantik jawaban
- Friendly tapi profesional

Jika customer:
- Ingin booking: Arahkan ke halaman /booking atau WhatsApp
- Bertanya kompleks: Berikan jawaban dasar dan tawarkan untuk konsultasi via WhatsApp
- Keluhan: Dengarkan dengan empati dan arahkan ke admin via WhatsApp

Nomor WhatsApp Admin: ${process.env.ADMIN_WA_NUMBER || '+62 812 3456 7890'}
Website: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

/**
 * POST /api/chat
 * AI Chat endpoint using OpenRouter
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, history = [] } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        success: false,
        response: 'Maaf, fitur chat AI belum dikonfigurasi. Silakan hubungi kami via WhatsApp untuk konsultasi. 🙏',
        error: 'OPENROUTER_API_KEY not configured',
      }, { status: 500 })
    }

    // Build messages array for OpenRouter
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT }
    ]

    // Add conversation history
    if (history && history.length > 0) {
      history.forEach((msg) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({ role: 'user', content: message })

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Explore Penida',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter API error:', response.status, errorData)

      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses pesan Anda saat ini.'

    return NextResponse.json({
      success: true,
      response: responseText,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific errors
    if (error instanceof Error) {
      console.error('Error message:', error.message)

      if (error.message.includes('429') || error.message.includes('rate_limit') || error.message.includes('quota')) {
        return NextResponse.json({
          success: true,
          response: 'Server sedang sibuk, silakan coba beberapa saat lagi 🙏',
        })
      }

      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json({
          success: false,
          response: 'Maaf, terjadi masalah dengan API key. Pastikan API key OpenRouter Anda valid.',
          error: error.message,
        }, { status: 500 })
      }
    }

    // Return error details
    return NextResponse.json({
      success: false,
      response: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown error'),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'ok',
    message: 'Chat API is running with OpenRouter AI',
  })
}