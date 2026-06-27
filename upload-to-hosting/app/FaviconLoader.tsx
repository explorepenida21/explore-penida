'use client'

import { useEffect, useState } from 'react'

export default function FaviconLoader() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.faviconUrl) {
          setFaviconUrl(data.data.faviconUrl)
          // Update the favicon in the head
          let link = document.querySelector("link[rel='icon']") as HTMLLinkElement
          if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
          }
          link.href = data.data.faviconUrl
          link.type = 'image/x-icon'

          // Also update apple-touch-icon
          let appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
          if (!appleIcon) {
            appleIcon = document.createElement('link')
            appleIcon.rel = 'apple-touch-icon'
            document.head.appendChild(appleIcon)
          }
          appleIcon.href = data.data.faviconUrl
        }
      })
      .catch(err => console.error('Error fetching favicon:', err))
  }, [])

  return null
}
