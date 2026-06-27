'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedAdminProps {
  children: React.ReactNode
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  // If not authenticated, don't render children (will redirect)
  if (!session) {
    return null
  }

  return <>{children}</>
}