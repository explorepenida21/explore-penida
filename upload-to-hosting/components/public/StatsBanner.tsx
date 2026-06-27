'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StatData {
  value: number
  label: string
  icon: string
  isDecimal?: boolean
}

function Counter({ value, suffix, isInView, isDecimal }: { value: number; suffix: string; isInView: boolean; isDecimal?: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) {
      setCount(value)
      return
    }

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value, isDecimal])

  return <span className="tabular-nums">{isDecimal ? count.toFixed(1) : count}{suffix}</span>
}

export default function StatsBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [stats] = useState<StatData[]>([
    { value: 5000, label: 'Tamu Puas', icon: '👥' },
    { value: 15, label: 'Destinasi Pilihan', icon: '📍' },
    { value: 4.9, label: 'Rating Bintang', icon: '⭐', isDecimal: true },
    { value: 100, label: 'Aman & Nyaman', icon: '🛡️' },
  ])

  useEffect(() => {
    // Immediately set isInView to true so counter starts and content is visible
    setIsInView(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative py-16 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600'
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-15' style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Decorative Circles */}
      <div className='absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2' />
      <div className='absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='group relative bg-white rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100'
            >
              {/* Icon */}
              <div className='w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg'>
                {stat.icon}
              </div>

              {/* Value */}
              <div className='text-3xl lg:text-4xl font-black text-gray-900 mb-1'>
                <Counter
                  value={stat.value}
                  suffix={stat.value === 100 ? '%' : stat.value === 4.9 ? '' : '+'}
                  isInView={isInView}
                  isDecimal={stat.isDecimal}
                />
                {stat.value === 4.9 && <span className="text-2xl">/5</span>}
              </div>

              {/* Label */}
              <div className='text-sm font-semibold text-gray-600'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}