'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError('Email atau password salah')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-600 to-navy-800 p-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>
            <span className='text-teal-400'>Explore</span>Penida
          </h1>
          <p className='text-white/70'>Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-3xl shadow-2xl p-8'>
          <div className='text-center mb-6'>
            <div className='w-16 h-16 bg-navy-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-navy-600'>Login Admin</h2>
            <p className='text-gray-500 text-sm mt-1'>Masuk untuk mengakses panel admin</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2'>
              <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-navy-600 mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@explorepenida.com'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-navy-600 mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Masukkan password'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors'
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                  </svg>
                  Masuk...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <a href='/' className='text-sm text-teal-500 hover:text-teal-600 flex items-center justify-center gap-1'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
              Kembali ke Website
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className='text-center text-white/50 text-sm mt-6'>
          © {new Date().getFullYear()} Explore Penida. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen flex items-center justify-center bg-navy-600'>
        <div className='w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin' />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}