'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! 👋 Selamat datang di Explore Penida!\n\nAda yang bisa saya bantu tentang tour ke Nusa Penida? Silakan tanyakan tentang paket tour, harga, atau destinasi kami! 🌊🏝️',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      })

      const data = await response.json()

      console.log('Chat response:', data) // Debug log

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
      } else {
        // Show actual error for debugging
        const errorMsg = data.error || data.response || 'Maaf, terjadi kesalahan. Silakan coba lagi.'
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: errorMsg },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = [
    { label: 'Paket Tour', message: 'Apa saja paket tour yang tersedia?' },
    { label: 'Harga', message: 'Berapa harga tour ke Nusa Penida?' },
    { label: 'Booking', message: 'Bagaimana cara booking tour?' },
  ]

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px]'>
          {/* Header */}
          <div className='bg-navy-600 text-white p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center'>
                <span className='text-xl'>🏝️</span>
              </div>
              <div>
                <h3 className='font-bold'>Explore Penida</h3>
                <p className='text-xs text-white/70'>Online • Biasanya balas dalam beberapa menit</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-teal-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className='text-sm whitespace-pre-wrap'>{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className='flex justify-start'>
                <div className='bg-white rounded-2xl rounded-bl-md shadow-sm px-4 py-3'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick replies */}
            {messages.length === 1 && !isTyping && (
              <div className='flex flex-wrap gap-2 pt-2'>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(reply.message)
                      setMessages((prev) => [...prev, { role: 'user', content: reply.message }])
                      setIsTyping(true)
                      fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          message: reply.message,
                          history: [],
                        }),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.success) {
                            setMessages((prev) => [
                              ...prev,
                              { role: 'assistant', content: data.response },
                            ])
                          }
                        })
                        .catch(() => {
                          setMessages((prev) => [
                            ...prev,
                            { role: 'assistant', content: 'Maaf, terjadi kesalahan.' },
                          ])
                        })
                        .finally(() => setIsTyping(false))
                    }}
                    className='px-3 py-1.5 bg-white border border-teal-200 text-teal-700 rounded-full text-sm hover:bg-teal-50 transition-colors'
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-4 border-t border-gray-100 bg-white'>
            <div className='flex gap-2'>
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ketik pesan...'
                disabled={isTyping}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none disabled:bg-gray-100'
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className='w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                </svg>
              </button>
            </div>
            <p className='text-xs text-gray-400 text-center mt-2'>
              Powered by AI •{' '}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/[^0-9]/g, '') || '6281234567890'}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-teal-500 hover:underline'
              >
                Chat langsung via WhatsApp
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50 hover:bg-teal-600 hover:scale-105 ${
          isOpen ? 'rotate-0' : 'shadow-xl'
        }`}
      >
        {isOpen ? (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          <>
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
            {/* Notification dot */}
            {messages.length === 1 && (
              <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse' />
            )}
          </>
        )}
      </button>
    </>
  )
}