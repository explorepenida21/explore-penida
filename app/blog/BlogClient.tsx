'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogPost {
  id: string
  judul: string
  slug: string
  excerpt: string
  thumbnail: string | null
  createdAt: string
}

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  // Calculate reading time
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(textLength / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className={`relative ${index === 0 ? 'h-72' : 'h-52'} overflow-hidden`}>
                  {post.thumbnail ? (
                    <>
                      <img
                        src={post.thumbnail}
                        alt={post.judul}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                      <span className="text-6xl">🏝️</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-teal-600 shadow-lg">
                      Blog
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {getReadTime(post.excerpt)} min
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className={`font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2 ${
                    index === 0 ? 'text-2xl' : 'text-lg'
                  }`}>
                    {post.judul}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt.replace(/<[^>]*>/g, '')}
                  </p>

                  {/* Read More Button */}
                  <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Baca Selengkapnya</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">📝</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Belum Ada Artikel</h3>
          <p className="text-gray-500 text-lg mb-8">Artikel blog akan segera hadir</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-full font-semibold">
            <span>Stay Tuned!</span>
            <span>🚀</span>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      {posts.length > 0 && (
        <div className="mt-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Jangan Lewatkan Artikel Terbaru!</h3>
          <p className="text-teal-100 mb-6 max-w-lg mx-auto">
            Subscribe untuk mendapatkan update artikel terbaru tentang wisata Nusa Penida langsung ke email kamu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email kamu"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-navy-600 hover:bg-navy-700 rounded-full font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      )}
    </div>
  )
}