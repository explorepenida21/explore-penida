# Explore Penida - Coding Rules & Best Practices

**⚠️ WAJIB DI IKUTI SEMUA CONTRIBUTOR ⚠️**

---

## 1. TypeScript Strict

### ❌ Dilarang menggunakan `any`

```typescript
// ❌ BAD - Menggunakan any
function fetchData(id: any): any {
  return fetch(`/api/${id}`)
}

// ✅ GOOD - Selalu definisikan type
interface Paket {
  id: string
  nama: string
  harga: number
}

function fetchPaket(id: string): Promise<Paket> {
  return fetch(`/api/paket/${id}`).then(res => res.json())
}
```

### ✅ Definisikan Interface untuk semua struktur data

```typescript
// Interfaces untuk data
interface Paket {
  id: string
  slug: string
  nama: string
  tipe: 'timur' | 'barat' | 'mix'
  harga: number
  deskripsi: string
  includes: string[]
  destinasi: string[]
  foto: string[]
  isActive: boolean
  createdAt: Date
}

interface Booking {
  id: string
  kodeBooking: string
  paketId: string
  namaPemesan: string
  email: string
  noHp: string
  tanggalTour: Date
  jumlahOrang: number
  totalHarga: number
  status: 'pending' | 'paid' | 'confirmed' | 'done' | 'cancelled'
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Props interface untuk komponen
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}
```

### ✅ Gunakan Union Types untuk nilai terbatas

```typescript
// ❌ BAD
const status: string = 'pending'

// ✅ GOOD
type BookingStatus = 'pending' | 'paid' | 'confirmed' | 'done' | 'cancelled'
const status: BookingStatus = 'pending'

type PaketTipe = 'timur' | 'barat' | 'mix'
```

---

## 2. Error Handling

### ✅ Semua API route wajib pakai try/catch

```typescript
// app/api/paket/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pakets = await prisma.paket.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: pakets
    })
  } catch (error) {
    console.error('Error fetching pakets:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pakets'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    if (!body.nama || !body.harga) {
      return NextResponse.json({
        success: false,
        error: 'Nama dan harga wajib diisi'
      }, { status: 400 })
    }

    const paket = await prisma.paket.create({
      data: {
        nama: body.nama,
        slug: body.slug,
        harga: body.harga,
        tipe: body.tipe,
        deskripsi: body.deskripsi,
        includes: body.includes || [],
        destinasi: body.destinasi || [],
        foto: body.foto || [],
        isActive: body.isActive ?? true
      }
    })

    return NextResponse.json({
      success: true,
      data: paket,
      message: 'Paket created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating paket:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create paket'
    }, { status: 500 })
  }
}
```

### ✅ Format Response API yang konsisten

```typescript
// Selalu gunakan format ini:
{
  success: boolean,   // required
  data?: any,          // optional, hasil response
  error?: string,      // optional, pesan error
  message?: string     // optional, pesan sukses
}

// HTTP Status Codes:
// 200 - Success (GET, PUT)
// 201 - Created (POST)
// 400 - Bad Request (validation error)
// 401 - Unauthorized (belum login)
// 403 - Forbidden (tidak punya akses)
// 404 - Not Found
// 500 - Internal Server Error
```

---

## 3. Prisma Query

### ✅ Selalu gunakan singleton dari `lib/prisma.ts`

```typescript
// ❌ BAD - Membuat instance baru di setiap file
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ✅ GOOD - Gunakan singleton yang sudah dibuat
import { prisma } from '@/lib/prisma'

// lib/prisma.ts - sudah dikonfigurasi singleton
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### ✅ Prisma Query Best Practices

```typescript
// Include relations yang diperlukan saja
const booking = await prisma.booking.findUnique({
  where: { id },
  include: {
    paket: {
      select: {
        id: true,
        nama: true,
        slug: true
      }
    }
  }
})

// Gunakan select untuk membatasi fields
const users = await prisma.adminUser.findMany({
  select: {
    id: true,
    email: true,
    nama: true,
    role: true
    // password tidak ikut
  }
})

// Batch operations
const [deleted1, deleted2] = await prisma.$transaction([
  prisma.booking.deleteMany({ where: { paketId } }),
  prisma.paket.delete({ where: { id } })
])
```

---

## 4. Environment Variables

### ❌ Dilarang hardcode credential

```typescript
// ❌ BAD - Hardcoded
const apiKey = 'sk-xxxxxx'
const dbUrl = 'postgresql://user:pass@localhost:5432/db'

// ✅ GOOD - Selalu dari process.env
const apiKey = process.env.ANTHROPIC_API_KEY
const dbUrl = process.env.DATABASE_URL
```

### ✅ Definisikan type untuk environment variables

```typescript
// lib/env.ts
interface EnvConfig {
  DATABASE_URL: string
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string
  MIDTRANS_SERVER_KEY: string
  MIDTRANS_CLIENT_KEY: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  FONNTE_TOKEN: string
  ANTHROPIC_API_KEY: string
}

export const env: EnvConfig = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY!,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  FONNTE_TOKEN: process.env.FONNTE_TOKEN!,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
}
```

### ✅ Contoh penggunaan di komponen

```typescript
// ❌ BAD
const clientKey = 'SB-Mid-client-xxxxxx'

// ✅ GOOD
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

// ✅ GOOD - dengan fallback
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
```

---

## 5. API Protection

### ✅ Semua route `/api/admin/*` wajib cek session

```typescript
// middleware.ts - sudah dikonfigurasi
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Protected routes
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/admin/login'
    }
  }
)
```

### ✅ Cek session di setiap API route admin

```typescript
// app/api/admin/booking/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      include: { paket: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
```

### ✅ Verifikasi role jika diperlukan

```typescript
// Untuk route yang butuh role tertentu
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // Cek role
  if ((session.user as any).role !== 'admin' && (session.user as any).role !== 'superadmin') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  // Lanjutkan...
}
```

---

## 6. Loading & Error State

### ✅ Tampilkan loading skeleton saat fetch data

```typescript
// components/public/PaketList.tsx
'use client'

import { useState, useEffect } from 'react'

interface Paket {
  id: string
  nama: string
  harga: number
}

export default function PaketList() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPakets()
  }, [])

  const fetchPakets = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/paket')
      const data = await res.json()

      if (data.success) {
        setPakets(data.data)
      } else {
        setError(data.error || 'Gagal mengambil data')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state - tampilkan skeleton
  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-80 rounded-2xl" />
        ))}
      </div>
    )
  }

  // Error state - tampilkan pesan error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchPakets} className="btn-primary">
          Coba Lagi
        </button>
      </div>
    )
  }

  // Data kosong
  if (pakets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Belum ada paket tour</p>
      </div>
    )
  }

  // Success - render data
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {pakets.map((paket) => (
        <PaketCard key={paket.id} paket={paket} />
      ))}
    </div>
  )
}
```

### ✅ Loading spinner component

```typescript
// components/public/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-accent border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}
```

---

## 7. Mobile-First Responsive

### ✅ Layout harus responsive, test di 375px dan 1440px

```typescript
// ❌ BAD - Tidak responsive
<div className="w-64">...</div>  // Fixed width

// ✅ GOOD - Responsive dengan Tailwind
<div className="w-full md:w-64 lg:w-80">...</div>

// ✅ GOOD - Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// ✅ GOOD - Flex responsive
<div className="flex flex-col md:flex-row gap-4">
  <Sidebar className="w-full md:w-64" />
  <Content className="flex-1" />
</div>
```

### ✅ Breakpoints untuk referensi

```typescript
// Mobile first approach:
// - Default (mobile): < 640px
// - sm: 640px+
// - md: 768px+
// - lg: 1024px+
// - xl: 1280px+
// - 2xl: 1536px+

// Contoh penggunaan
const Card = () => (
  <div className="
    p-4                    // Mobile
    md:p-6                 // Tablet+
    lg:p-8                 // Desktop+
  ">
    <h2 className="
      text-lg              // Mobile
      md:text-xl            // Tablet+
      lg:text-2xl           // Desktop+
    ">
      Title
    </h2>
  </div>
)
```

### ✅ Container max-width

```typescript
// Selalu bungkus konten dengan container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## 8. Komponen Kecil (Max 200 Baris)

### ❌ Jangan buat komponen besar

```typescript
// ❌ BAD - Komponen 500+ baris
export default function Dashboard() {
  // 500 baris kode...
}

// ✅ GOOD - Pecah jadi komponen kecil
// Dashboard/index.tsx
import DashboardHeader from './DashboardHeader'
import DashboardStats from './DashboardStats'
import RecentBookings from './RecentBookings'
import QuickActions from './QuickActions'

export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />
      <RecentBookings />
      <QuickActions />
    </div>
  )
}
```

### ✅ Guideline untuk memecah komponen

| Komponen | Max Baris | Kapan Pecah |
|----------|-----------|--------------|
| Simple Button | 20 | Jika ada variant logic |
| Card | 50 | Jika ada banyak state |
| Form | 100 | Jika ada banyak field |
| Page Section | 150 | Jika kompleks |
| Full Page | 200 | Split menjadi sub-components |

### ✅ Pattern untuk komponen besar

```typescript
// Pecah berdasarkan feature/section
components/
├── dashboard/
│   ├── index.tsx           // Main container
│   ├── DashboardHeader.tsx  // ~50 lines
│   ├── StatsCard.tsx        // ~40 lines
│   ├── BookingTable.tsx     // ~80 lines
│   └── QuickActions.tsx     // ~30 lines
```

---

## 9. Naming Convention

### ✅ File Components: PascalCase

```typescript
// Components: PascalCase
components/
├── Button.tsx              // ✅
├── PaketCard.tsx           // ✅
├── BookingForm.tsx          // ✅
├── StatsBanner.tsx          // ✅
├── LoadingSpinner.tsx       // ✅

// ❌ BAD
components/
├── button.tsx              // ❌ lowercase
├── paketCard.tsx           // ❌ camelCase
```

### ✅ File Utility/Hook: camelCase

```typescript
// Utils & Hooks: camelCase
lib/
├── prisma.ts               // ✅ singleton
├── auth.ts                 // ✅
├── cloudinary.ts           // ✅
├── midtrans.ts             // ✅
├── fonnte.ts               // ✅

hooks/
├── useBooking.ts          // ✅
├── useAuth.ts             // ✅
├── useToast.ts            // ✅

utils/
├── formatCurrency.ts      // ✅
├── formatDate.ts          // ✅
├── validation.ts          // ✅
```

### ✅ API Route: kebab-case

```typescript
// Routes: kebab-case
app/
├── api/
│   ├── paket/
│   │   └── route.ts       // /api/paket
│   ├── booking/
│   │   └── route.ts       // /api/booking
│   ├── admin/
│   │   ├── paket/
│   │   │   └── route.ts   // /api/admin/paket
│   │   └── booking/
│   │       └── route.ts   // /api/admin/booking
│   └── payment/
│       └── midtrans/
│           └── route.ts   // /api/payment/midtrans
```

### ✅ Variables & Functions: camelCase

```typescript
// Variables: camelCase
const userName = 'John'
const isLoading = false
const totalHarga = 550000

// Functions: camelCase
function fetchPaket() { }
function handleSubmit() { }
function calculateTotal() { }

// Private/Internal: bisa pakai underscore prefix
function _helperFunction() { }
```

### ✅ Type/Interface: PascalCase

```typescript
// Types & Interfaces: PascalCase
interface UserData { }
type BookingStatus = 'pending' | 'paid'
type PaketTipe = 'timur' | 'barat' | 'mix'
type ApiResponse<T> = { success: boolean; data?: T }

// Enum style (jika diperlukan)
const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
} as const
```

### ✅ CSS Classes: kebab-case / Tailwind classes

```tsx
// Tailwind classes - sudah kebab-case secara natural
<div className="flex items-center justify-between p-4 bg-white rounded-xl">
  <h2 className="text-lg font-bold text-navy-600">Title</h2>
</div>

// Custom CSS classes (jika diperlukan): kebab-case
<div className="custom-card">
  <div className="custom-card-header"></div>
</div>
```

---

## 📋 Checklist Sebelum Commit

- [ ] Tidak ada `any` - semua type sudah definisi
- [ ] Semua API route pakai try/catch
- [ ] Format response `{ success, data?, error? }`
- [ ] Paket menggunakan singleton dari `lib/prisma.ts`
- [ ] Tidak ada credential hardcode
- [ ] Semua route admin cek session
- [ ] Loading & error state sudah ada
- [ ] Layout responsive (test 375px & 1440px)
- [ ] Komponen max 200 baris
- [ ] Naming convention sesuai rules

---

## 🚨 Lint Rules (ESLint)

```json
// .eslintrc.json - rules yang harus aktif
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

*Version: 1.0 | Last Updated: June 2026*
*Maintainer: All Contributors*