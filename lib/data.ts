import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import { products as fallbackProducts, type Product as FallbackProduct } from '@/data/products';
import { galleryItems as fallbackGallery, type GalleryItem as FallbackGalleryItem } from '@/data/gallery';

// Re-export normalized types
export type AppProduct = FallbackProduct;
export type AppGalleryItem = FallbackGalleryItem;

// ── Mappers ────────────────────────────────────────────────────────────────
function mapDbProductToAppProduct(db: any): FallbackProduct {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    category: {
      name: db.category?.name ?? 'Uncategorized',
      slug: db.category?.slug ?? 'uncategorized',
    },
    description: db.description ?? '',
    overview: db.overview ?? undefined,
    applications: db.applications ?? '',
    applicationsList: (db.applicationsList as string[]) ?? [],
    specs: (db.specs as Record<string, string>) ?? {},
    features: (db.features as string[]) ?? [],
    keyAdvantages: (db.keyAdvantages as string[]) ?? [],
    industries: (db.industries as string[]) ?? [],
    material: db.material ?? undefined,
    tolerance: db.tolerance ?? undefined,
    surfaceFinish: db.surfaceFinish ?? undefined,
    customization: db.customization ?? undefined,
    availableSizes: db.availableSizes ?? undefined,
    qualityNote: db.qualityNote ?? undefined,
    faqs:
      (db.faqs as any[])?.map((f: any) => ({
        q: f.question,
        a: f.answer,
      })) ?? [],
    images:
      (db.images as any[])?.map((img: any) => ({
        url: img.blobUrl as string,
        alt: (img.alt as string | null) ?? db.name,
      })) ?? [],
    isPublished: db.isPublished ?? true,
    sortOrder: db.sortOrder ?? 0,
  };
}

function mapDbGalleryToAppGallery(db: any): FallbackGalleryItem {
  return {
    id: db.id as string,
    url: db.blobUrl as string,
    alt: (db.alt as string | null) ?? db.title ?? '',
    caption: (db.caption as string | null) ?? db.title ?? '',
    category: (db.category as string | null) ?? 'Gallery',
    sortOrder: (db.sortOrder as number) ?? 0,
  };
}

// ── Products ───────────────────────────────────────────────────────────────
export const getProducts = unstable_cache(
  async (): Promise<AppProduct[]> => {
    try {
      const dbProducts = await prisma.product.findMany({
        where: { isPublished: true },
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          faqs: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      });
      if (!dbProducts || dbProducts.length === 0) {
        return fallbackProducts.filter((p) => p.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return dbProducts.map(mapDbProductToAppProduct);
    } catch (e) {
      console.error('[getProducts] DB error, falling back to hardcoded', e);
      return fallbackProducts.filter((p) => p.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },
  ['products-all'],
  { tags: ['products'], revalidate: 3600 },
);

export async function getProductBySlug(slug: string): Promise<AppProduct | null> {
  return unstable_cache(
    async (): Promise<AppProduct | null> => {
      try {
        const p = await prisma.product.findUnique({
          where: { slug },
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            faqs: { orderBy: { sortOrder: 'asc' } },
          },
        });
        if (!p || !p.isPublished) {
          return fallbackProducts.find((fp) => fp.slug === slug && fp.isPublished) ?? null;
        }
        return mapDbProductToAppProduct(p);
      } catch (e) {
        console.error(`[getProductBySlug] ${slug} DB error fallback`, e);
        return fallbackProducts.find((fp) => fp.slug === slug && fp.isPublished) ?? null;
      }
    },
    [`product-${slug}`],
    { tags: ['products'], revalidate: 3600 },
  )();
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<AppProduct[]> {
  return unstable_cache(
    async (): Promise<AppProduct[]> => {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { isPublished: true, category: { slug: categorySlug } },
          include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            faqs: { orderBy: { sortOrder: 'asc' } },
          },
          orderBy: { sortOrder: 'asc' },
        });
        if (!dbProducts || dbProducts.length === 0) {
          return fallbackProducts
            .filter((p) => p.isPublished && p.category.slug === categorySlug)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return dbProducts.map(mapDbProductToAppProduct);
      } catch (e) {
        console.error(`[getProductsByCategorySlug] ${categorySlug} fallback`, e);
        return fallbackProducts
          .filter((p) => p.isPublished && p.category.slug === categorySlug)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      }
    },
    [`products-category-${categorySlug}`],
    { tags: ['products'], revalidate: 3600 },
  )();
}

// ── Categories ─────────────────────────────────────────────────────────────
export const getCategories = unstable_cache(
  async (): Promise<{ name: string; slug: string; description?: string | null; sortOrder: number }[]> => {
    try {
      const cats = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
      if (cats && cats.length > 0) {
        return cats.map((c) => ({
          name: c.name,
          slug: c.slug,
          description: c.description ?? null,
          sortOrder: c.sortOrder ?? 0,
        }));
      }
      // fallback derive from products
      const map = new Map<string, { name: string; slug: string; description?: string | null; sortOrder: number }>();
      for (const p of fallbackProducts.filter((p) => p.isPublished)) {
        if (!map.has(p.category.slug)) {
          map.set(p.category.slug, {
            name: p.category.name,
            slug: p.category.slug,
            description: null,
            sortOrder: map.size,
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (e) {
      console.error('[getCategories] DB fallback', e);
      const map = new Map<string, { name: string; slug: string; description?: string | null; sortOrder: number }>();
      for (const p of fallbackProducts.filter((p) => p.isPublished)) {
        if (!map.has(p.category.slug)) {
          map.set(p.category.slug, {
            name: p.category.name,
            slug: p.category.slug,
            description: null,
            sortOrder: map.size,
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },
  ['categories-all'],
  { tags: ['products'], revalidate: 3600 },
);

// ── Gallery ────────────────────────────────────────────────────────────────
export const getGalleryImages = unstable_cache(
  async (): Promise<AppGalleryItem[]> => {
    try {
      const imgs = await prisma.galleryImage.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (!imgs || imgs.length === 0) {
        return [...fallbackGallery].sort((a, b) => a.sortOrder - b.sortOrder);
      }
      return imgs.map(mapDbGalleryToAppGallery).sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (e) {
      console.error('[getGalleryImages] DB fallback', e);
      return [...fallbackGallery].sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },
  ['gallery-all'],
  { tags: ['gallery'], revalidate: 3600 },
);

export async function getGalleryImagesByCategory(category: string): Promise<AppGalleryItem[]> {
  return unstable_cache(
    async (): Promise<AppGalleryItem[]> => {
      try {
        const imgs = await prisma.galleryImage.findMany({
          where: { isPublished: true, category },
          orderBy: { sortOrder: 'asc' },
        });
        if (!imgs || imgs.length === 0) {
          return fallbackGallery.filter((g) => g.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return imgs.map(mapDbGalleryToAppGallery);
      } catch (e) {
        console.error(`[getGalleryImagesByCategory] ${category} fallback`, e);
        return fallbackGallery.filter((g) => g.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
      }
    },
    [`gallery-category-${category}`],
    { tags: ['gallery'], revalidate: 3600 },
  )();
}

// ── Knowledge / Company (for completeness) ─────────────────────────────────
export const getKnowledgeArticles = unstable_cache(
  async () => {
    try {
      const arts = await prisma.knowledgeArticle.findMany({
        where: { isPublished: true },
        include: { faqs: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { updatedAt: 'desc' },
      });
      return arts;
    } catch (e) {
      console.error('[getKnowledgeArticles] DB fallback', e);
      return [];
    }
  },
  ['knowledge-all'],
  { tags: ['knowledge'], revalidate: 3600 },
);

export const getCompanyProfile = unstable_cache(
  async () => {
    try {
      const profile = await prisma.companyProfile.findFirst({ orderBy: { createdAt: 'desc' } });
      return profile ?? null;
    } catch (e) {
      console.error('[getCompanyProfile] DB fallback', e);
      return null;
    }
  },
  ['company-profile'],
  { tags: ['company'], revalidate: 3600 },
);

// helpers for reuse in routes/pages that need raw DB shape
export { mapDbProductToAppProduct, mapDbGalleryToAppGallery };
