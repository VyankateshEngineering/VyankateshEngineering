import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { products as fallbackProducts } from '@/data/products';
import { revalidateTag } from 'next/cache';

export const revalidate = 3600;

function mapDbProduct(db: any) {
  return {
    id: db.id as string,
    slug: db.slug as string,
    name: db.name as string,
    category: {
      name: db.category?.name ?? 'Uncategorized',
      slug: db.category?.slug ?? 'uncategorized',
    },
    description: (db.description as string) ?? '',
    overview: (db.overview as string | null) ?? undefined,
    applications: (db.applications as string | null) ?? '',
    applicationsList: (db.applicationsList as string[]) ?? [],
    specs: (db.specs as Record<string, string>) ?? {},
    features: (db.features as string[]) ?? [],
    keyAdvantages: (db.keyAdvantages as string[]) ?? [],
    industries: (db.industries as string[]) ?? [],
    material: (db.material as string | null) ?? undefined,
    tolerance: (db.tolerance as string | null) ?? undefined,
    surfaceFinish: (db.surfaceFinish as string | null) ?? undefined,
    customization: (db.customization as string | null) ?? undefined,
    availableSizes: (db.availableSizes as string | null) ?? undefined,
    qualityNote: (db.qualityNote as string | null) ?? undefined,
    faqs:
      (db.faqs as any[])?.map((f: any) => ({
        q: f.question as string,
        a: f.answer as string,
      })) ?? [],
    images:
      (db.images as any[])?.map((img: any) => ({
        url: img.blobUrl as string,
        alt: (img.alt as string | null) ?? (db.name as string),
      })) ?? [],
    isPublished: (db.isPublished as boolean) ?? true,
    sortOrder: (db.sortOrder as number) ?? 0,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    let products: any[] = [];
    try {
      // Use prisma with targeted cache tag 'products' — revalidate via revalidateTag('products') on mutations
      const dbProducts = await prisma.product.findMany({
        where: category
          ? { isPublished: true, category: { slug: category } }
          : { isPublished: true },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          faqs: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      });
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map(mapDbProduct);
      } else {
        // fallback to hardcoded if DB empty (for build without DB)
        const fb = fallbackProducts.filter((p) => p.isPublished);
        products = category ? fb.filter((p) => p.category?.slug === category) : fb;
      }
    } catch (e) {
      console.error('[Products] DB fallback', e);
      const fb = fallbackProducts.filter((p) => p.isPublished);
      products = category ? fb.filter((p) => p.category?.slug === category) : fb;
    }

    return NextResponse.json(
      { products },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Products] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Example targeted revalidation endpoint could call revalidateTag('products')
export async function POST() {
  try {
    revalidateTag('products');
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
