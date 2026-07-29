import { NextResponse } from 'next/server';
import { settings } from '@/data/settings';

/** Whitelist of settings safe to expose to the client */
const publicSettings = {
  companyName: settings.companyName,
  contactEmail: settings.contactEmail,
  address: settings.address,
  registeredAddress: settings.registeredAddress,
  mapEmbedUrl: settings.mapEmbedUrl,
  socialLinks: settings.socialLinks,
};

export async function GET() {
  try {
    return NextResponse.json(
      { settings: publicSettings },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Settings] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
