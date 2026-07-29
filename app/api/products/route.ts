import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export const dynamic = 'force-dynamic';

// Pre-filter published products at module scope
const publishedProducts = products.filter((p) => p.isPublished);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    const filtered = category
      ? publishedProducts.filter((p) => p.category?.slug === category)
      : publishedProducts;

    return NextResponse.json(
      { products: filtered },
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
