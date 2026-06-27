import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import Link from 'next/link'
import ChatWidget from '@/components/public/ChatWidget'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import BlogPostClient from './BlogPostClient'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-teal-600 via-teal-700 to-navy-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-teal-300 hover:text-teal-200 mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Blog
          </Link>

          <BlogPostClient slug={slug} />
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </div>
  )
}