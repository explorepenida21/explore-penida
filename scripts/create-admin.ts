// ============================================================
// Create Admin User Script
// Usage: npx tsx scripts/create-admin.ts
// ============================================================

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2] || 'admin@explorepenida.com'
  const password = process.argv[3] || 'admin123'
  const nama = process.argv[4] || 'Administrator'

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`)
      console.log('Use reset-admin.ts to reset password or delete and recreate')

      // Update password
      await prisma.adminUser.update({
        where: { email },
        data: { password: hashedPassword },
      })
      console.log('✅ Password updated successfully')

      return
    }

    // Create admin
    const admin = await prisma.adminUser.create({
      data: {
        id: `admin_${Date.now()}`,
        email: email.toLowerCase(),
        password: hashedPassword,
        nama,
        role: 'admin',
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('')
    console.log('Login credentials:')
    console.log(`  Email:    ${admin.email}`)
    console.log(`  Password: ${password}`)
    console.log('')
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!')
    console.log('')
    console.log('Login URL: https://your-domain.com/admin/login')
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
