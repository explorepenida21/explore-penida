# 🚀 Quick Reference - Coding Rules

## 1. TypeScript - No `any` ❌

```typescript
// ✅ Selalu definisikan type
interface User { id: string; name: string }
const user: User = { id: '1', name: 'John' }
```

## 2. API Response Format ✅

```typescript
return NextResponse.json({
  success: true,  // required
  data?: any,     // optional
  error?: string  // optional
}, { status: 200 })
```

## 3. Prisma Singleton ✅

```typescript
import { prisma } from '@/lib/prisma'
// ❌ Jangan buat new PrismaClient()
```

## 4. Env Variables ✅

```typescript
// ❌ Hardcode
const key = 'abc123'

// ✅ Selalu dari process.env
const key = process.env.SOME_KEY!
```

## 5. Admin API Protection ✅

```typescript
const session = await getServerSession(authOptions)
if (!session?.user) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
}
```

## 6. Loading & Error States ✅

```typescript
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

if (loading) return <Skeleton />
if (error) return <ErrorMessage error={error} onRetry={refetch} />
```

## 7. File Naming 📁

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `PaketCard.tsx` |
| Utility | camelCase | `formatCurrency.ts` |
| API Route | kebab-case | `/api/admin/booking/route.ts` |
| Hook | camelCase | `useAuth.ts` |

## 8. Component Size 📏

**Max 200 lines per file**

```typescript
// Pecah komponen besar
// Dashboard/index.tsx
<DashboardHeader />
<DashboardStats />
<RecentBookings />
```

## 9. Try/Catch Wajib 🛡️

```typescript
export async function GET() {
  try {
    const data = await prisma.paket.findMany()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
```

## 10. Mobile-First 📱

```typescript
// Mobile first, then breakpoints
<div className="w-full md:w-64 lg:w-80">
```

---

## ❌ Common Mistakes

```typescript
// ❌ Menggunakan any
function getData(id: any) { ... }

// ❌ Prisma instance baru
const prisma = new PrismaClient()

// ❌ Hardcode credential
const apiKey = 'sk-xxx'

// ❌ Response tanpa success flag
return NextResponse.json({ data })

// ❌ tidak ada error handling
const data = await fetch('/api')
```

## ✅ Correct Patterns

```typescript
// ✅ Type yang jelas
interface Paket { id: string; nama: string }

// ✅ Singleton dari lib
import { prisma } from '@/lib/prisma'

// ✅ Env dari process.env
const key = process.env.KEY!

// ✅ Format response
return NextResponse.json({ success: true, data })

// ✅ Try/catch
try { ... } catch { return NextResponse.json({ success: false, error }) }
```

---

**Referensi lengkap:** `CODING-RULES.md`