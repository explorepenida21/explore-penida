'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

interface WebsiteSettings {
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroVideoUrl: string
  stat1Value: number
  stat1Label: string
  stat1Icon: string
  stat2Value: number
  stat2Label: string
  stat2Icon: string
  stat3Value: number
  stat3Label: string
  stat3Icon: string
  stat4Value: number
  stat4Label: string
  stat4Icon: string
  whatsapp: string
  email: string
  alamat: string
  instagram: string
  facebook: string
  tiktok: string
  footerDescription: string
  footerCopyright: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  logoUrl: string
  faviconUrl: string
  // API Keys
  midtransServerKey: string
  midtransClientKey: string
  midtransIsProduction: boolean
  fonnteToken: string
  adminWaNumber: string
  cloudinaryCloudName: string
  cloudinaryApiKey: string
  cloudinaryApiSecret: string
  openRouterApiKey: string
}

interface Fasilitas {
  id: string
  emoji: string
  title: string
  deskripsi: string
  urutan: number
  isActive: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState<WebsiteSettings>({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    heroVideoUrl: '',
    stat1Value: 0,
    stat1Label: '',
    stat1Icon: '',
    stat2Value: 0,
    stat2Label: '',
    stat2Icon: '',
    stat3Value: 0,
    stat3Label: '',
    stat3Icon: '',
    stat4Value: 0,
    stat4Label: '',
    stat4Icon: '',
    whatsapp: '',
    email: '',
    alamat: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    footerDescription: '',
    footerCopyright: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    logoUrl: '',
    faviconUrl: '',
    // API Keys
    midtransServerKey: '',
    midtransClientKey: '',
    midtransIsProduction: false,
    fonnteToken: '',
    adminWaNumber: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    openRouterApiKey: '',
  })

  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({})

  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([])
  const [newFasilitas, setNewFasilitas] = useState({ emoji: '', title: '', deskripsi: '' })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [settingsRes, fasilitasRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/fasilitas'),
      ])
      const settingsData = await settingsRes.json()
      const fasilitasData = await fasilitasRes.json()

      if (settingsData.success) {
        setSettings(settingsData.data)
      }
      if (fasilitasData.success) {
        setFasilitas(fasilitasData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const addFasilitas = async () => {
    if (!newFasilitas.emoji || !newFasilitas.title) return
    try {
      const res = await fetch('/api/admin/fasilitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFasilitas, urutan: fasilitas.length }),
      })
      const data = await res.json()
      if (data.success) {
        setFasilitas([...fasilitas, data.data])
        setNewFasilitas({ emoji: '', title: '', deskripsi: '' })
      }
    } catch (error) {
      console.error('Error adding fasilitas:', error)
    }
  }

  const deleteFasilitas = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/fasilitas?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setFasilitas(fasilitas.filter(f => f.id !== id))
      }
    } catch (error) {
      console.error('Error deleting fasilitas:', error)
    }
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: '🎯' },
    { id: 'branding', label: 'Logo & Favicon', icon: '🎨' },
    { id: 'stats', label: 'Statistik', icon: '📊' },
    { id: 'fasilitas', label: 'Fasilitas', icon: '✨' },
    { id: 'contact', label: 'Kontak & Social', icon: '📱' },
    { id: 'footer', label: 'Footer & Meta', icon: '🔗' },
    { id: 'apikeys', label: 'API Keys', icon: '🔑' },
  ]

  const toggleShowApiKey = (key: string) => {
    setShowApiKey(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-navy-600'>Pengaturan Website</h1>
        <p className='text-gray-500'>Kelola semua konten website Anda</p>
      </div>

      {saved && (
        <div className='mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-xl flex items-center gap-3'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          Pengaturan berhasil disimpan!
        </div>
      )}

      <div className='flex gap-8'>
        <div className='w-64 flex-shrink-0'>
          <div className='bg-white rounded-2xl shadow-sm p-4 sticky top-8'>
            <nav className='space-y-2'>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className='font-medium'>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className='flex-1 bg-white rounded-2xl shadow-sm p-8'>
          {activeTab === 'hero' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600'>Hero Section</h2>
                <p className='text-gray-500 text-sm'>Pengaturan tampilan hero di halaman utama</p>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Badge Text</label>
                  <input
                    type='text'
                    value={settings.heroBadge}
                    onChange={e => setSettings({ ...settings, heroBadge: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    placeholder='Contoh: Pulau Surga di Timur Bali'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Judul Utama</label>
                  <input
                    type='text'
                    value={settings.heroTitle}
                    onChange={e => setSettings({ ...settings, heroTitle: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    placeholder='Contoh: Explore Penida'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Subtitle</label>
                <textarea
                  value={settings.heroSubtitle}
                  onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  rows={3}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  placeholder='Deskripsi singkat tentang tour...'
                />
              </div>

              <ImageUploader
                type="image"
                value={settings.heroImage}
                onChange={(url) => setSettings({ ...settings, heroImage: url })}
                label="Gambar Hero"
                placeholder="Klik atau drag gambar hero ke sini"
                maxSizeMB={5}
              />

              <ImageUploader
                type="video"
                value={settings.heroVideoUrl || ''}
                onChange={(url) => setSettings({ ...settings, heroVideoUrl: url })}
                label="Video Background (Opsional)"
                placeholder="Klik atau drag file video ke sini"
                maxSizeMB={30}
              />
            </div>
          )}

          {activeTab === 'branding' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>Logo & Favicon</h2>
                <p className='text-gray-500 text-sm mb-6'>Pengaturan branding website</p>
              </div>

              <ImageUploader
                type="image"
                value={settings.logoUrl || ''}
                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                label="Logo Website"
                placeholder="Klik atau drag logo ke sini (PNG dengan transparan disarankan)"
                maxSizeMB={2}
              />

              <div className="border-t pt-6">
                <ImageUploader
                  type="image"
                  value={settings.faviconUrl || ''}
                  onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                  label="Favicon Website"
                  placeholder="Klik atau drag favicon ke sini (ICO, PNG, atau SVG)"
                  maxSizeMB={1}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Disarankan: ICO 32x32 atau PNG 512x512 untuk hasil terbaik
                </p>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>Statistik</h2>
                <p className='text-gray-500 text-sm mb-6'>Angka statistik yang ditampilkan di banner</p>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-gray-50 rounded-2xl p-6 space-y-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl'>{settings.stat1Icon || '👥'}</span>
                    <span className='font-semibold text-gray-700'>Statistik 1</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Nilai</label>
                      <input
                        type='number'
                        value={settings.stat1Value}
                        onChange={e => setSettings({ ...settings, stat1Value: parseInt(e.target.value) || 0 })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Label</label>
                      <input
                        type='text'
                        value={settings.stat1Label}
                        onChange={e => setSettings({ ...settings, stat1Label: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Icon (Emoji)</label>
                      <input
                        type='text'
                        value={settings.stat1Icon}
                        onChange={e => setSettings({ ...settings, stat1Icon: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                        placeholder='👥'
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 space-y-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl'>{settings.stat2Icon || '📍'}</span>
                    <span className='font-semibold text-gray-700'>Statistik 2</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Nilai</label>
                      <input
                        type='number'
                        value={settings.stat2Value}
                        onChange={e => setSettings({ ...settings, stat2Value: parseInt(e.target.value) || 0 })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Label</label>
                      <input
                        type='text'
                        value={settings.stat2Label}
                        onChange={e => setSettings({ ...settings, stat2Label: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Icon (Emoji)</label>
                      <input
                        type='text'
                        value={settings.stat2Icon}
                        onChange={e => setSettings({ ...settings, stat2Icon: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                        placeholder='📍'
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 space-y-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl'>{settings.stat3Icon || '⭐'}</span>
                    <span className='font-semibold text-gray-700'>Statistik 3</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Nilai (Decimal)</label>
                      <input
                        type='number'
                        step='0.1'
                        value={settings.stat3Value}
                        onChange={e => setSettings({ ...settings, stat3Value: parseFloat(e.target.value) || 0 })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Label</label>
                      <input
                        type='text'
                        value={settings.stat3Label}
                        onChange={e => setSettings({ ...settings, stat3Label: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Icon (Emoji)</label>
                      <input
                        type='text'
                        value={settings.stat3Icon}
                        onChange={e => setSettings({ ...settings, stat3Icon: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                        placeholder='⭐'
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 space-y-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl'>{settings.stat4Icon || '🛡️'}</span>
                    <span className='font-semibold text-gray-700'>Statistik 4</span>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Nilai</label>
                      <input
                        type='number'
                        value={settings.stat4Value}
                        onChange={e => setSettings({ ...settings, stat4Value: parseInt(e.target.value) || 0 })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Label</label>
                      <input
                        type='text'
                        value={settings.stat4Label}
                        onChange={e => setSettings({ ...settings, stat4Label: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-medium text-gray-500 mb-1'>Icon (Emoji)</label>
                      <input
                        type='text'
                        value={settings.stat4Icon}
                        onChange={e => setSettings({ ...settings, stat4Icon: e.target.value })}
                        className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                        placeholder='🛡️'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fasilitas' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>Fasilitas</h2>
                <p className='text-gray-500 text-sm mb-6'>Kelola daftar fasilitas yang ditampilkan</p>
              </div>

              <div className='bg-gray-50 rounded-2xl p-6'>
                <h3 className='font-semibold text-gray-700 mb-4'>Tambah Fasilitas Baru</h3>
                <div className='grid grid-cols-4 gap-4'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Emoji</label>
                    <input
                      type='text'
                      value={newFasilitas.emoji}
                      onChange={e => setNewFasilitas({ ...newFasilitas, emoji: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      placeholder='🚤'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Judul</label>
                    <input
                      type='text'
                      value={newFasilitas.title}
                      onChange={e => setNewFasilitas({ ...newFasilitas, title: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      placeholder='Transportasi Boat'
                    />
                  </div>
                  <div className='col-span-2'>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Deskripsi</label>
                    <input
                      type='text'
                      value={newFasilitas.deskripsi}
                      onChange={e => setNewFasilitas({ ...newFasilitas, deskripsi: e.target.value })}
                      className='w-full px-3 py-2 border border-gray-200 rounded-lg'
                      placeholder='Deskripsi fasilitas...'
                    />
                  </div>
                </div>
                <button
                  onClick={addFasilitas}
                  className='mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors'
                >
                  + Tambah
                </button>
              </div>

              <div className='space-y-3'>
                {fasilitas.map((f, index) => (
                  <div key={f.id} className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                    <span className='text-2xl'>{f.emoji}</span>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-800'>{f.title}</p>
                      <p className='text-sm text-gray-500'>{f.deskripsi}</p>
                    </div>
                    <span className='text-xs text-gray-400'>#{index + 1}</span>
                    <button
                      onClick={() => deleteFasilitas(f.id)}
                      className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                ))}
                {fasilitas.length === 0 && (
                  <div className='text-center py-12 text-gray-500'>
                    <p>Belum ada fasilitas. Tambahkan yang pertama!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>Kontak & Social Media</h2>
                <p className='text-gray-500 text-sm mb-6'>Informasi kontak yang ditampilkan di website</p>
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>WhatsApp</label>
                  <input
                    type='text'
                    value={settings.whatsapp}
                    onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                    placeholder='6281234567890'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                  <input
                    type='email'
                    value={settings.email}
                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                    placeholder='info@explorepenida.com'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Alamat</label>
                <textarea
                  value={settings.alamat}
                  onChange={e => setSettings({ ...settings, alamat: e.target.value })}
                  rows={2}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                  placeholder='Nusa Penida, Klungkung, Bali'
                />
              </div>

              <div className='border-t pt-6'>
                <h3 className='font-semibold text-gray-700 mb-4'>Social Media</h3>
                <div className='grid grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Instagram</label>
                    <input
                      type='text'
                      value={settings.instagram || ''}
                      onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='@username'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Facebook</label>
                    <input
                      type='text'
                      value={settings.facebook || ''}
                      onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='Page URL'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>TikTok</label>
                    <input
                      type='text'
                      value={settings.tiktok || ''}
                      onChange={e => setSettings({ ...settings, tiktok: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='@username'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>Footer & SEO</h2>
                <p className='text-gray-500 text-sm mb-6'>Pengaturan footer dan meta tags</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Deskripsi Footer</label>
                <textarea
                  value={settings.footerDescription}
                  onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                  rows={2}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                  placeholder='Tour & travel terpercaya...'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Copyright Text</label>
                <input
                  type='text'
                  value={settings.footerCopyright}
                  onChange={e => setSettings({ ...settings, footerCopyright: e.target.value })}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                  placeholder='© 2024 Explore Penida...'
                />
              </div>

              <div className='border-t pt-6'>
                <h3 className='font-semibold text-gray-700 mb-4'>SEO / Meta Tags</h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Meta Title</label>
                    <input
                      type='text'
                      value={settings.metaTitle}
                      onChange={e => setSettings({ ...settings, metaTitle: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='Explore Penida | Tour & Travel...'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Meta Description</label>
                    <textarea
                      value={settings.metaDescription}
                      onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                      rows={2}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='Jelajahi keindahan Nusa Penida...'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Meta Keywords</label>
                    <input
                      type='text'
                      value={settings.metaKeywords}
                      onChange={e => setSettings({ ...settings, metaKeywords: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500'
                      placeholder='nusa penida, tour, travel, bali...'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-bold text-navy-600 mb-1'>API Keys</h2>
                <p className='text-gray-500 text-sm mb-6'>Konfigurasi API keys untuk payment, upload, dan AI chatbot</p>
              </div>

              {/* Midtrans */}
              <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6'>
                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  💳 Midtrans Payment
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Client Key</label>
                    <div className='relative'>
                      <input
                        type={showApiKey['midtransClientKey'] ? 'text' : 'password'}
                        value={settings.midtransClientKey || ''}
                        onChange={e => setSettings({ ...settings, midtransClientKey: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 pr-20'
                        placeholder='Mid-client-xxxxx'
                      />
                      <button
                        type='button'
                        onClick={() => toggleShowApiKey('midtransClientKey')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showApiKey['midtransClientKey'] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Server Key</label>
                    <div className='relative'>
                      <input
                        type={showApiKey['midtransServerKey'] ? 'text' : 'password'}
                        value={settings.midtransServerKey || ''}
                        onChange={e => setSettings({ ...settings, midtransServerKey: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 pr-20'
                        placeholder='Mid-server-xxxxx'
                      />
                      <button
                        type='button'
                        onClick={() => toggleShowApiKey('midtransServerKey')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showApiKey['midtransServerKey'] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='midtransProduction'
                      checked={settings.midtransIsProduction || false}
                      onChange={e => setSettings({ ...settings, midtransIsProduction: e.target.checked })}
                      className='w-5 h-5 text-purple-600 rounded'
                    />
                    <label htmlFor='midtransProduction' className='text-sm text-gray-700'>
                      Mode Production (非 Sandbox)
                    </label>
                  </div>
                </div>
              </div>

              {/* Fonnte WhatsApp */}
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6'>
                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  💬 Fonnte WhatsApp
                </h3>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Token</label>
                    <div className='relative'>
                      <input
                        type={showApiKey['fonnteToken'] ? 'text' : 'password'}
                        value={settings.fonnteToken || ''}
                        onChange={e => setSettings({ ...settings, fonnteToken: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 pr-20'
                        placeholder='Token dari Fonnte'
                      />
                      <button
                        type='button'
                        onClick={() => toggleShowApiKey('fonnteToken')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showApiKey['fonnteToken'] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>No. WhatsApp Admin</label>
                    <input
                      type='text'
                      value={settings.adminWaNumber || ''}
                      onChange={e => setSettings({ ...settings, adminWaNumber: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500'
                      placeholder='6281234567890'
                    />
                  </div>
                </div>
              </div>

              {/* Cloudinary */}
              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6'>
                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  ☁️ Cloudinary (Upload Gambar)
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Cloud Name</label>
                    <input
                      type='text'
                      value={settings.cloudinaryCloudName || ''}
                      onChange={e => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500'
                      placeholder='dqkicbuer'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>API Key</label>
                    <div className='relative'>
                      <input
                        type={showApiKey['cloudinaryApiKey'] ? 'text' : 'password'}
                        value={settings.cloudinaryApiKey || ''}
                        onChange={e => setSettings({ ...settings, cloudinaryApiKey: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 pr-20'
                        placeholder='API Key'
                      />
                      <button
                        type='button'
                        onClick={() => toggleShowApiKey('cloudinaryApiKey')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showApiKey['cloudinaryApiKey'] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>API Secret</label>
                    <div className='relative'>
                      <input
                        type={showApiKey['cloudinaryApiSecret'] ? 'text' : 'password'}
                        value={settings.cloudinaryApiSecret || ''}
                        onChange={e => setSettings({ ...settings, cloudinaryApiSecret: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 pr-20'
                        placeholder='API Secret'
                      />
                      <button
                        type='button'
                        onClick={() => toggleShowApiKey('cloudinaryApiSecret')}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showApiKey['cloudinaryApiSecret'] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OpenRouter AI */}
              <div className='bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6'>
                <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                  🤖 OpenRouter AI (Chatbot)
                </h3>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>API Key</label>
                  <div className='relative'>
                    <input
                      type={showApiKey['openRouterApiKey'] ? 'text' : 'password'}
                      value={settings.openRouterApiKey || ''}
                      onChange={e => setSettings({ ...settings, openRouterApiKey: e.target.value })}
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 pr-20'
                      placeholder='sk-or-v1-xxxxx'
                    />
                    <button
                      type='button'
                      onClick={() => toggleShowApiKey('openRouterApiKey')}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                      {showApiKey['openRouterApiKey'] ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
                <p className='text-sm text-yellow-800'>
                  ⚠️ <strong>Catatan:</strong> API Keys disimpan di database. Untuk production, disarankan juga untuk mengisi di file <code className='bg-yellow-100 px-1 rounded'>.env</code> untuk keamanan tambahan.
                </p>
              </div>
            </div>
          )}

          <div className='mt-8 pt-6 border-t flex justify-end'>
            <button
              onClick={saveSettings}
              disabled={saving}
              className='px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center gap-2'
            >
              {saving ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
