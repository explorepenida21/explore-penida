'use client'

import { Suspense, lazy, ComponentType } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy load heavy components
const ChatWidget = lazy(() => import('./ChatWidget'))
const WhatsAppButton = lazy(() => import('./WhatsAppButton'))

interface LazyLoadProps {
  component: 'chat' | 'whatsapp'
  fallback?: React.ReactNode
}

export default function LazyLoad({ component, fallback }: LazyLoadProps) {
  const Component = component === 'chat' ? ChatWidget : WhatsAppButton

  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component />
    </Suspense>
  )
}

// Re-export for direct use
export { ChatWidget, WhatsAppButton }