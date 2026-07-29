import { MetadataRoute } from 'next';
import { settings } from '@/data/settings';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: settings.companyName,
    short_name: 'Vyankatesh',
    description: settings.globalSeoDesc,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a365d',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
