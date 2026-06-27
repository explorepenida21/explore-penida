import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// ============================================================
// NextAuth Configuration
// ============================================================
export const authOptions: NextAuthOptions = {
  // Session strategy
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // JWT Configuration
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // Custom pages
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  // Providers
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@explorepenida.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Masukkan password',
        },
      },
      async authorize(credentials) {
        // Validate credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi')
        }

        try {
          // Find admin user by email
          const admin = await prisma.adminUser.findUnique({
            where: { email: credentials.email.toLowerCase() },
          })

          if (!admin) {
            throw new Error('Email atau password salah')
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isValidPassword) {
            throw new Error('Email atau password salah')
          }

          // Return user object
          return {
            id: admin.id,
            email: admin.email,
            name: admin.nama,
            role: admin.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    // Add user info to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role
      }
      return token
    },

    // Add user info to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
}