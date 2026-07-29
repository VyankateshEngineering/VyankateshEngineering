import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/catalogue-print/'], // Block crawlers from backend/auth/print routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
