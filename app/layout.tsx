import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { settings } from '@/data/settings';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';

export const metadata: Metadata = {
  title: {
    default: 'Vyankatesh Engineering | Precision Die & Tooling Manufacturer, Chhatrapati Sambhajinagar',
    template: '%s | Vyankatesh Engineering',
  },
  description: settings.globalSeoDesc,
  keywords: [
    'Core Pin Manufacturer India',
    'Die Manufacturer Maharashtra',
    'Precision Tooling Manufacturer',
    'Industrial Inserts Manufacturer',
    'GDC Inserts',
    'LPDC Inserts',
    'Shot Sleeve Manufacturer',
    'Vyankatesh Engineering',
    'Waluj MIDC',
    'Chhatrapati Sambhajinagar',
  ],
  authors: [{ name: settings.companyName }],
  creator: settings.companyName,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Vyankatesh Engineering',
    description: settings.globalSeoDesc,
    siteName: settings.companyName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${settings.companyName} — Precision Industrial Manufacturing`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vyankatesh Engineering',
    description: settings.globalSeoDesc,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION] : [],
    },
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Organization'],
    name: settings.companyName,
    image: `${siteUrl}/logo.png`,
    '@id': `${siteUrl}/#organization`,
    url: siteUrl,
    email: settings.contactEmail,
    description: settings.globalSeoDesc,
    foundingDate: '2004',
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 210,
      height: 210,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C-106, Waluj MIDC',
      addressLocality: 'Chhatrapati Sambhajinagar',
      addressRegion: 'Maharashtra',
      postalCode: '431136',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.837878,
      longitude: 75.246699,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    knowsAbout: [
      'Die Casting Tooling',
      'Core Pins',
      'Jet Cool Pins',
      'Profile Inserts',
      'HPDC Dies',
      'GDC Dies',
      'LPDC Dies',
      'Shot Sleeves',
      'Vacuum Heat Treatment',
      'Precision Grinding',
    ],
    brand: {
      '@type': 'Brand',
      name: 'Vyankatesh Engineering',
    },
    sameAs: [
      settings.socialLinks.linkedin,
      `https://www.google.com/search?kgmid=/g/11z7q83hcg`,
    ].filter(Boolean),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: settings.companyName,
    description: settings.globalSeoDesc,
    publisher: {
      '@id': `${siteUrl}/#organization`
    }
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>

        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
