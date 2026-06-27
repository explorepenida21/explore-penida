'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'

interface BlogPost {
  id: string
  judul: string
  slug: string
  konten: string
  thumbnail: string | null
  isPublish: boolean
  publishedAt: string | null
  createdAt: string
}

interface FormData {
  judul: string
  slug: string
  konten: string
  thumbnail: string
  isPublish: boolean
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<FormData>({
    judul: '',
    slug: '',
    konten: '',
    thumbnail: '',
    isPublish: false,
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<any>(null)
  const [quillLoaded, setQuillLoaded] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (showModal && editorRef.current && !quillLoaded) {
      loadQuillEditor()
    }
  }, [showModal])

  const loadQuillEditor = () => {
    // Load Quill CSS
    const linkCSS = document.createElement('link')
    linkCSS.rel = 'stylesheet'
    linkCSS.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css'
    document.head.appendChild(linkCSS)

    // Load Quill JS
    const script = document.createElement('script')
    script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js'
    script.onload = () => {
      const Quill = (window as any).Quill
      if (Quill && editorRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: 'Tulis artikel di sini...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ]
          }
        })

        // Set initial content if editing
        if (form.konten) {
          quillRef.current.root.innerHTML = form.konten
        }

        setQuillLoaded(true)
      }
    }
    document.body.appendChild(script)
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog')
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setForm({
        judul: post.judul,
        slug: post.slug,
        konten: post.konten,
        thumbnail: post.thumbnail || '',
        isPublish: post.isPublish,
      })
    } else {
      setEditingPost(null)
      setForm({
        judul: '',
        slug: '',
        konten: '',
        thumbnail: '',
        isPublish: false,
      })
    }
    setQuillLoaded(false)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPost(null)
    setForm({
      judul: '',
      slug: '',
      konten: '',
      thumbnail: '',
      isPublish: false,
    })
    setQuillLoaded(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('upload_preset', 'explore-penida')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload,
        }
      )

      const data = await response.json()
      if (data.secure_url) {
        setForm(prev => ({ ...prev, thumbnail: data.secure_url }))
      } else if (data.error) {
        console.error('Cloudinary error:', data.error)
        alert(`Gagal upload: ${data.error.message}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal upload gambar')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeThumbnail = () => {
    setForm(prev => ({ ...prev, thumbnail: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Get content from Quill editor
      const konten = quillRef.current ? quillRef.current.root.innerHTML : form.konten

      const url = '/api/admin/blog'
      const method = editingPost ? 'PUT' : 'POST'
      const body = editingPost
        ? { ...form, konten, id: editingPost.id }
        : { ...form, konten, slug: form.slug || generateSlug(form.judul) }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (data.success) {
        await fetchPosts()
        closeModal()
      } else {
        alert(data.error || 'Gagal menyimpan artikel')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          isPublish: !post.isPublish,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setPosts(prev =>
          prev.map(p =>
            p.id === post.id ? { ...p, isPublish: !p.isPublish } : p
          )
        )
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Hapus artikel "${post.judul}"?`)) return

    try {
      const res = await fetch(`/api/admin/blog?id=${post.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== post.id))
      } else {
        alert(data.error || 'Gagal menghapus artikel')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='p-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-navy-600'>Blog & Artikel</h1>
          <p className='text-gray-500'>Kelola artikel dan konten blog website</p>
        </div>
        <button
          onClick={() => openModal()}
          className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Tambah Artikel
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📝</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-navy-600'>{posts.length}</p>
              <p className='text-sm text-gray-500'>Total Artikel</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-green-600'>{posts.filter(p => p.isPublish).length}</p>
              <p className='text-sm text-gray-500'>Published</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
              <span className='text-2xl'>📋</span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-600'>{posts.filter(p => !p.isPublish).length}</p>
              <p className='text-sm text-gray-500'>Draft</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Artikel</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Slug</th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase'>Tanggal</th>
                <th className='px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase'>Status</th>
                <th className='px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {posts.map((post) => (
                <tr key={post.id} className={`hover:bg-gray-50 ${!post.isPublish ? 'opacity-70' : ''}`}>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0'>
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.judul} className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>📝</div>
                        )}
                      </div>
                      <div>
                        <p className='font-medium text-navy-600'>{post.judul}</p>
                        <p className='text-xs text-gray-500 line-clamp-1 max-w-xs'>{(post.konten || '').replace(/<[^>]*>/g, '').substring(0, 80)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <code className='text-sm text-teal-600'>/blog/{post.slug}</code>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                    {formatDate(post.createdAt)}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <button
                      onClick={() => togglePublish(post)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.isPublish
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.isPublish ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-center gap-2'>
                      {post.isPublish && (
                        <a
                          href={`/blog/${post.slug}`}
                          target='_blank'
                          className='p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 6v6m0-6l-8 8' />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => openModal(post)}
                        className='p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors'
                      >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center text-gray-500'>
                    Belum ada artikel
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white p-6 border-b z-10'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-navy-600'>
                  {editingPost ? 'Edit Artikel' : 'Artikel Baru'}
                </h2>
                <button onClick={closeModal} className='p-2 hover:bg-gray-100 rounded-lg'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Judul <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={form.judul}
                  onChange={(e) => setForm({
                    ...form,
                    judul: e.target.value,
                    slug: generateSlug(e.target.value),
                  })}
                  placeholder='Judul artikel...'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Slug</label>
                <input
                  type='text'
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder='auto-generate-from-judul'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                />
                <p className='text-xs text-gray-500 mt-1'>URL: /blog/{form.slug || 'auto-generate'}</p>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Thumbnail
                </label>
                <div className='border-2 border-dashed border-gray-300 rounded-xl p-4 text-center'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className='hidden'
                    id='thumbnail-upload'
                  />
                  <label
                    htmlFor='thumbnail-upload'
                    className='cursor-pointer flex flex-col items-center'
                  >
                    {uploadingImage ? (
                      <>
                        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3' />
                        <span className='text-gray-500'>Mengupload...</span>
                      </>
                    ) : form.thumbnail ? (
                      <div className='relative'>
                        <img src={form.thumbnail} alt='Thumbnail' className='max-h-40 rounded-lg mx-auto' />
                        <button
                          type='button'
                          onClick={removeThumbnail}
                          className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs'
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className='w-12 h-12 text-gray-400 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <span className='text-gray-500'>Klik untuk upload thumbnail</span>
                        <span className='text-xs text-gray-400 mt-1'>PNG, JPG, max 5MB</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Konten with Quill Editor */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Konten <span className='text-red-500'>*</span>
                </label>
                <div className='border border-gray-300 rounded-lg overflow-hidden'>
                  <div ref={editorRef} className='min-h-[300px]' />
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setForm({ ...form, isPublish: !form.isPublish })}
                  className={`w-12 h-6 rounded-full transition-colors ${form.isPublish ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${form.isPublish ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className='text-sm text-gray-600'>
                  {form.isPublish ? 'Published (tersedia publik)' : 'Draft (tersimpan tapi tidak tampil)'}
                </span>
              </div>

              <div className='flex gap-3 pt-4 border-t'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  disabled={saving}
                  className='flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {saving ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}