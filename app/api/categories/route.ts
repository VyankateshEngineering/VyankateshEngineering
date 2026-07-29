import { NextResponse } from 'next/server';
import { products } from '@/data/products';

interface Category {
  name: string;
  slug: string;
}

// Compute categories once at module scope since products data is static
const uniqueCategories: Category[] = (() => {
  const map = new Map<string, Category>();
  for (const p of products) {
    if (p.category?.slug) {
      map.set(p.category.slug, { name: p.category.name, slug: p.category.slug });
    }
  }
  return Array.from(map.values());
})();

export async function GET() {
  try {
    return NextResponse.json(
      { categories: uniqueCategories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (error) {
    console.error('[Categories] Fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
