'use client'

import { useMemo } from 'react'

// Simple but effective HTML sanitizer using regex
function sanitizeHtml(html: string): string {
  if (!html) return ''

  let clean = html

  // Step 1: If the content starts with <html> or <!DOCTYPE, extract body content
  if (clean.includes('<html') || clean.includes('<!DOCTYPE')) {
    // Extract content between <body> and </body>
    const bodyMatch = clean.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    if (bodyMatch) {
      clean = bodyMatch[1]
    } else {
      // Remove <html> tags
      clean = clean.replace(/<\/?html[^>]*>/gi, '')
      // Remove <head> section
      clean = clean.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      // Remove doctype
      clean = clean.replace(/<!DOCTYPE[^>]*>/gi, '')
    }
  }

  // Step 2: Remove dangerous elements
  clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  clean = clean.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
  clean = clean.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
  clean = clean.replace(/<embed[^>]*>/gi, '')
  clean = clean.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')

  // Step 3: Remove event handlers (onclick, onload, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Step 4: Remove HTML comments
  clean = clean.replace(/<!--[\s\S]*?-->/g, '')

  // Step 5: Strip any remaining html/body tags that might have slipped through
  clean = clean.replace(/<\/?html[^>]*>/gi, '')
  clean = clean.replace(/<\/?body[^>]*>/gi, '')
  clean = clean.replace(/<\/?head[^>]*>/gi, '')

  return clean.trim()
}

interface SafeHtmlProps {
  html: string
  className?: string
}

export default function SafeHtml({ html, className = '' }: SafeHtmlProps) {
  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html])

  // Only render if we have valid content
  if (!sanitizedHtml) {
    return <div className={className} />
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}