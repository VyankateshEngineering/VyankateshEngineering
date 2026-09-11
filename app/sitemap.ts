import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { products as fallbackProducts } from '@/data/products';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
  const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

  let publishedProducts: { slug: string }[] = [];
  let categories: { slug: string }[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, category: { select: { slug: true } } },
    });
    if (dbProducts && dbProducts.length > 0) {
      publishedProducts = dbProducts.map((p) => ({ slug: p.slug }));
      const catMap = new Map<string, { slug: string }>();
      for (const p of dbProducts) {
        if (p.category?.slug) catMap.set(p.category.slug, { slug: p.category.slug });
      }
      // Also include categories that may have no products yet but exist as category records
      try {
        const dbCats = await prisma.category.findMany({ select: { slug: true } });
        for (const c of dbCats) {
          if (!catMap.has(c.slug)) catMap.set(c.slug, { slug: c.slug });
        }
      } catch {}
      categories = Array.from(catMap.values());
    } else {
      throw new Error('Empty DB, fallback');
    }
  } catch (e) {
    console.error('[sitemap] DB fallback', e);
    publishedProducts = fallbackProducts.filter((product) => product.isPublished).map((p) => ({ slug: p.slug }));
    const categoryMap = new Map<string, { slug: string }>();
    fallbackProducts
      .filter((p) => p.isPublished)
      .forEach((product) => {
        if (product.category) {
          categoryMap.set(product.category.slug, { slug: product.category.slug });
        }
      });
    categories = Array.from(categoryMap.values());
  }

  const currentTimestamp = new Date().toISOString();

  // Static authority pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentTimestamp,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quality`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/manufacturing-process`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/why-choose-us`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentTimestamp,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: currentTimestamp,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const productUrls: MetadataRoute.Sitemap = publishedProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: currentTimestamp,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: currentTimestamp,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categoryUrls, ...productUrls];
}
