import { NextResponse } from 'next/server';
import { galleryItems } from '@/data/gallery';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    let items = galleryItems;
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    return NextResponse.json(
      { images: items },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Gallery] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
