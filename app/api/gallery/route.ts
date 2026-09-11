import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { galleryItems as fallbackGallery } from '@/data/gallery';
import { revalidateTag } from 'next/cache';

export const revalidate = 3600;

function mapDbGallery(db: any) {
  return {
    id: db.id as string,
    url: db.blobUrl as string,
    alt: (db.alt as string | null) ?? db.title ?? '',
    caption: (db.caption as string | null) ?? db.title ?? '',
    category: (db.category as string | null) ?? 'Gallery',
    sortOrder: (db.sortOrder as number) ?? 0,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    let items: any[] = [];
    try {
      // Use prisma with tag 'gallery' — revalidate via revalidateTag('gallery')
      const dbItems = await prisma.galleryImage.findMany({
        where: category
          ? { isPublished: true, category }
          : { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (dbItems && dbItems.length > 0) {
        items = dbItems.map(mapDbGallery);
      } else {
        // fallback to hardcoded if DB empty (for build without DB)
        items = fallbackGallery;
        if (category) {
          items = items.filter((item) => item.category === category);
        }
        items = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (e) {
      console.error('[Gallery] DB fallback', e);
      items = fallbackGallery;
      if (category) {
        items = items.filter((item) => item.category === category);
      }
      items = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
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

export async function POST() {
  try {
    revalidateTag('gallery');
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
