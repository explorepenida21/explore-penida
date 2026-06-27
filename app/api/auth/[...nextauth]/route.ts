import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/options'

// ============================================================
// NextAuth Route Handler
// ============================================================
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }