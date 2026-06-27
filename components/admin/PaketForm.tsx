'use client'

import { useState } from 'react'

interface PaketFormProps {
  initialData?: {
    id?: string
    nama: string
    slug: string
    deskripsi: string
    harga: number
    durasi: string
    itinerary: string[]
    included: string[]
    excluded: string[]
    gambar?: string
  }
  onSubmit: (data: any) => void
}

export default function PaketForm({ initialData, onSubmit }: PaketFormProps) {
  const [form, setForm] = useState({
    nama: initialData?.nama || '',
    slug: initialData?.slug || '',
    deskripsi: initialData?.deskripsi || '',
    harga: initialData?.harga || 0,
    durasi: initialData?.durasi || '',
    itinerary: initialData?.itinerary?.join('\n') || '',
    included: initialData?.included?.join('\n') || '',
    excluded: initialData?.excluded?.join('\n') || '',
    gambar: initialData?.gambar || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...form,
      itinerary: form.itinerary.split('\n').filter(Boolean),
      included: form.included.split('\n').filter(Boolean),
      excluded: form.excluded.split('\n').filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 bg-white p-6 rounded-xl shadow-sm'>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Nama Paket</label>
          <input
            type='text'
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Slug</label>
          <input
            type='text'
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Harga (Rp)</label>
          <input
            type='number'
            required
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: parseInt(e.target.value) })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Durasi</label>
          <input
            type='text'
            required
            placeholder='contoh: 2 Hari 1 Malam'
            value={form.durasi}
            onChange={(e) => setForm({ ...form, durasi: e.target.value })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>Deskripsi</label>
        <textarea
          rows={4}
          required
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className='w-full px-4 py-3 border rounded-lg'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>Itinerary (satu baris per пункт)</label>
        <textarea
          rows={5}
          value={form.itinerary}
          onChange={(e) => setForm({ ...form, itinerary: e.target.value })}
          className='w-full px-4 py-3 border rounded-lg'
          placeholder='Hari 1: Penjemputan di hotel...'
        />
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Yang Termasuk</label>
          <textarea
            rows={4}
            value={form.included}
            onChange={(e) => setForm({ ...form, included: e.target.value })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Yang Tidak Termasuk</label>
          <textarea
            rows={4}
            value={form.excluded}
            onChange={(e) => setForm({ ...form, excluded: e.target.value })}
            className='w-full px-4 py-3 border rounded-lg'
          />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>URL Gambar</label>
        <input
          type='url'
          value={form.gambar}
          onChange={(e) => setForm({ ...form, gambar: e.target.value })}
          className='w-full px-4 py-3 border rounded-lg'
        />
      </div>
      <button
        type='submit'
        className='w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition'
      >
        {initialData?.id ? 'Update Paket' : 'Simpan Paket'}
      </button>
    </form>
  )
}