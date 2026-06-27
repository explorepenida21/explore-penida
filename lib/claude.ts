import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface ChatContext {
  tentangNusaPenida: string
  paketTour: string[]
  hargaPaket: Record<string, number>
  kontak: {
    whatsapp: string
    email: string
  }
}

// Context information about Explore Penida
const context: ChatContext = {
  tentangNusaPenida: `Nusa Penida adalah pulau kecil di tenggara Bali yang terkenal dengan pantai-pantai indah seperti Kelingking Beach, Angel's Billabong, Broken Beach, dan Diamond Beach. Pulau ini menawarkan pemandangan alam yang spektakuler dengan tebing-tebing kapur yang dramatis.`,
  paketTour: ['Nusa Penida West Tour', 'Nusa Penida East Tour', 'Nusa Penida Full Day', 'Nusa Penida Adventure'],
  hargaPaket: {
    'Nusa Penida West Tour': 550000,
    'Nusa Penida East Tour': 550000,
    'Nusa Penida Full Day': 850000,
    'Nusa Penida Adventure': 1200000,
  },
  kontak: {
    whatsapp: process.env.NEXT_PUBLIC_WA_NUMBER || '+6281234567890',
    email: 'info@explorepenida.com',
  },
}

const SYSTEM_PROMPT = `Anda adalah asisten virtual untuk Explore Penida, layanan tour dan travel di Nusa Penida, Bali.

Informasi tentang kami:
- ${context.tentangNusaPenida}

Paket Tour yang tersedia:
${context.paketTour.map((p, i) => `- ${p}: Rp ${context.hargaPaket[p].toLocaleString('id-ID')}/orang`).join('\n')}

Kontak kami:
- WhatsApp: ${context.kontak.whatsapp}
- Email: ${context.kontak.email}

Tugas Anda:
1. Membantu customer dengan pertanyaan tentang tour dan destinasi di Nusa Penida
2. Memberikan informasi tentang paket tour yang tersedia
3. Membantu proses booking tour
4. Menjawab pertanyaan umum tentang Nusa Penida

Selalu ramah, profesional, dan informatif dalam memberikan jawaban.`

export const claudeAI = {
  async chat(userMessage: string): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      })

      return response.content[0].type === 'text' ? response.content[0].text : 'Maaf, saya tidak dapat memproses pesan Anda.'
    } catch (error) {
      console.error('Claude AI error:', error)
      return 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.'
    }
  },
}