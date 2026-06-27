'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import SafeHtml from '@/components/public/SafeHtml'

interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  thumbnail: string | null
  excerpt: string
  createdAt: string
}

interface RelatedPost {
  id: string
  judul: string
  slug: string
  thumbnail: string | null
  createdAt: string
}

interface BlogPostClientProps {
  slug: string
}

// Social Media Share URLs
const socialShare = {
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${title}\n\nBaca selengkapnya: ${url}`)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  telegram: (url: string, title: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  instagram: (url: string) =>
    `https://instagram.com/share?url=${encodeURIComponent(url)}`,
  email: (url: string, title: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Baca selengkapnya: ${url}`)}`,
  copy: () => null,
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readTime, setReadTime] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const postUrl = `${baseUrl}${pathname}`

  useEffect(() => {
    fetchPost()
    // Close share menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/blog/${slug}`)
      const data = await res.json()

      if (data.success) {
        setPost(data.data)
        setRelatedPosts(data.relatedPosts || [])

        // Calculate reading time (200 words per minute)
        const wordsPerMinute = 200
        const textLength = (data.data.konten || '').replace(/<[^>]*>/g, '').split(/\s+/).length
        setReadTime(Math.ceil(textLength / wordsPerMinute))
      } else {
        setError('Artikel tidak ditemukan')
      }
    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Gagal memuat artikel')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socialButtons = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500 hover:bg-green-600', url: socialShare.whatsapp(postUrl, post?.judul || '') },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700', url: socialShare.facebook(postUrl) },
    { name: 'Twitter', icon: '🐦', color: 'bg-sky-500 hover:bg-sky-600', url: socialShare.twitter(postUrl, post?.judul || '') },
    { name: 'Telegram', icon: '✈️', color: 'bg-sky-400 hover:bg-sky-500', url: socialShare.telegram(postUrl, post?.judul || '') },
    { name: 'Email', icon: '📧', color: 'bg-gray-500 hover:bg-gray-600', url: socialShare.email(postUrl, post?.judul || '') },
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-white/20 rounded mb-4"></div>
        <div className="h-12 w-full max-w-2xl bg-white/20 rounded mb-6"></div>
        <div className="h-4 w-32 bg-white/10 rounded"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-white mb-4">{error || 'Artikel tidak ditemukan'}</h2>
        <Link href="/blog" className="text-teal-300 hover:text-teal-200 transition-colors">
          ← Kembali ke Blog
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(post.createdAt)}
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readTime} menit membaca
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
        {post.judul}
      </h1>

      {/* Share Button (Desktop) */}
      <div className="hidden md:flex items-center gap-3 mb-8">
        <span className="text-teal-200 text-sm font-medium">Bagikan:</span>
        <div className="flex items-center gap-2">
          {socialButtons.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-110`}
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-110 ${
              copied ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title="Salin Link"
          >
            {copied ? '✅' : '🔗'}
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative mb-10 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.thumbnail}
              alt={post.judul}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <SafeHtml
            html={post.konten || ''}
            className="text-gray-800 bg-white rounded-2xl p-8 shadow-lg"
          />
        </div>

        {/* Share Section - Mobile */}
        <div className="md:hidden mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-700 font-semibold mb-4">Bagikan Artikel</p>
            <div className="flex flex-wrap gap-2">
              {socialButtons.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 ${social.color} text-white rounded-full text-sm font-medium flex items-center gap-2 transition-all`}
                >
                  <span>{social.icon}</span>
                  {social.name}
                </a>
              ))}
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                  copied ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {copied ? '✅' : '🔗'} {copied ? 'Tersalin!' : 'Salin Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Author Box */}
        <div className="mt-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              🏝️
            </div>
            <div>
              <p className="font-bold text-lg">Explore Penida</p>
              <p className="text-teal-100 text-sm">Tour & Travel Nusa Penida</p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Artikel Terkait</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  {related.thumbnail && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={related.thumbnail}
                        alt={related.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">{formatDate(related.createdAt)}</p>
                    <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {related.judul}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </article>

      {/* Floating Share Button (Mobile) */}
      <div className="md:hidden fixed bottom-24 right-4 z-40" ref={shareMenuRef}>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-600 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {showShareMenu && (
          <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl p-4 w-48 animate-fade-in">
            <p className="text-gray-700 font-semibold mb-3">Bagikan ke:</p>
            <div className="space-y-2">
              {socialButtons.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">{social.icon}</span>
                  <span className="text-gray-700">{social.name}</span>
                </a>
              ))}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">{copied ? '✅' : '🔗'}</span>
                <span className="text-gray-700">{copied ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}