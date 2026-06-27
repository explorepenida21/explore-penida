import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth/options'

const prisma = new PrismaClient()

// GET - Get website settings
export async function GET() {
  try {
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: 'default' }
    })

    if (!settings) {
      // Create default settings if not exists
      const defaultSettings = await prisma.websiteSettings.create({
        data: { id: 'default' }
      })
      return NextResponse.json({ success: true, data: defaultSettings })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update website settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroImage,
      heroVideoUrl,
      stat1Value,
      stat1Label,
      stat1Icon,
      stat2Value,
      stat2Label,
      stat2Icon,
      stat3Value,
      stat3Label,
      stat3Icon,
      stat4Value,
      stat4Label,
      stat4Icon,
      whatsapp,
      email,
      alamat,
      instagram,
      facebook,
      tiktok,
      footerDescription,
      footerCopyright,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoUrl,
      faviconUrl,
      // API Keys
      midtransServerKey,
      midtransClientKey,
      midtransIsProduction,
      fonnteToken,
      adminWaNumber,
      cloudinaryCloudName,
      cloudinaryApiKey,
      cloudinaryApiSecret,
      openRouterApiKey,
    } = body

    const settings = await prisma.websiteSettings.upsert({
      where: { id: 'default' },
      update: {
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImage,
        heroVideoUrl,
        stat1Value,
        stat1Label,
        stat1Icon,
        stat2Value,
        stat2Label,
        stat2Icon,
        stat3Value,
        stat3Label,
        stat3Icon,
        stat4Value,
        stat4Label,
        stat4Icon,
        whatsapp,
        email,
        alamat,
        instagram,
        facebook,
        tiktok,
        footerDescription,
        footerCopyright,
        metaTitle,
        metaDescription,
        metaKeywords,
        logoUrl,
        faviconUrl,
        // API Keys
        midtransServerKey,
        midtransClientKey,
        midtransIsProduction,
        fonnteToken,
        adminWaNumber,
        cloudinaryCloudName,
        cloudinaryApiKey,
        cloudinaryApiSecret,
        openRouterApiKey,
      },
      create: {
        id: 'default',
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImage,
        heroVideoUrl,
        stat1Value,
        stat1Label,
        stat1Icon,
        stat2Value,
        stat2Label,
        stat2Icon,
        stat3Value,
        stat3Label,
        stat3Icon,
        stat4Value,
        stat4Label,
        stat4Icon,
        whatsapp,
        email,
        alamat,
        instagram,
        facebook,
        tiktok,
        footerDescription,
        footerCopyright,
        metaTitle,
        metaDescription,
        metaKeywords,
        logoUrl,
        faviconUrl,
        // API Keys
        midtransServerKey,
        midtransClientKey,
        midtransIsProduction,
        fonnteToken,
        adminWaNumber,
        cloudinaryCloudName,
        cloudinaryApiKey,
        cloudinaryApiSecret,
        openRouterApiKey,
      },
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
