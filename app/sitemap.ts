import { MetadataRoute } from 'next';
import { products } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';

  const publishedProducts = products.filter((product) => product.isPublished);

  // Extract unique categories dynamically
  const categoryMap = new Map();
  publishedProducts.forEach((product) => {
    if (product.category) {
      categoryMap.set(product.category.slug, product.category);
    }
  });
  const categories = Array.from(categoryMap.values());

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
