import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get website settings (public)
export async function GET() {
  try {
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: 'default' }
    })

    if (!settings) {
      // Return default values if no settings exist
      return NextResponse.json({
        success: true,
        data: {
          heroBadge: 'Pulau Surga di Timur Bali',
          heroTitle: 'Explore Penida',
          heroSubtitle: 'Jelajahi keindahan alam yang memukau dengan paket tour eksklusif pilihan terbaik kami',
          heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85',
          heroVideoUrl: 'https://res.cloudinary.com/dqkicbuer/video/upload/v1782916096/02177847932790700000000000000000000ffffc0a884a929e2c6_1_ekl6oc.mp4',
          logoUrl: null,
          faviconUrl: null,
          whatsapp: '628131819818',
          email: 'info@explorepenida.com',
          instagram: null,
          facebook: null,
          tiktok: null,
          footerDescription: 'Tour & travel terpercaya untuk menjelajahi keindahan Nusa Penida',
          footerCopyright: '© 2024 Explore Penida. Hak cipta dilindungi.',
        }
      })
    }

    // Return settings directly (not nested in 'settings' property)
    return NextResponse.json({
      success: true,
      data: {
        heroBadge: settings.heroBadge,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroImage: settings.heroImage,
        heroVideoUrl: settings.heroVideoUrl,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        whatsapp: settings.whatsapp,
        email: settings.email,
        instagram: settings.instagram,
        facebook: settings.facebook,
        tiktok: settings.tiktok,
        footerDescription: settings.footerDescription,
        footerCopyright: settings.footerCopyright,
        stat1Value: settings.stat1Value,
        stat1Label: settings.stat1Label,
        stat1Icon: settings.stat1Icon,
        stat2Value: settings.stat2Value,
        stat2Label: settings.stat2Label,
        stat2Icon: settings.stat2Icon,
        stat3Value: settings.stat3Value,
        stat3Label: settings.stat3Label,
        stat3Icon: settings.stat3Icon,
        stat4Value: settings.stat4Value,
        stat4Label: settings.stat4Label,
        stat4Icon: settings.stat4Icon,
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
