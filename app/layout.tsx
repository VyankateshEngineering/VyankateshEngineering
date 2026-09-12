import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a365d',
};
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { settings } from '@/data/settings';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

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

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const siteUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

export const metadata: Metadata = {
  title: {
    default: 'Vyankatesh Engineering | Precision Die & Tooling Manufacturer, Chhatrapati Sambhajinagar',
    template: '%s | Vyankatesh Engineering',
  },
  description: settings.globalSeoDesc,
  applicationName: settings.companyName,
  referrer: 'origin-when-cross-origin',
  category: 'manufacturing',
  classification: 'Precision Die Casting Tooling Manufacturer',
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
    'Jet Cool Pin Manufacturer',
    'HPDC Die Manufacturer',
    'PVD Coated Inserts India',
  ],
  authors: [{ name: settings.companyName, url: siteUrl }],
  creator: settings.companyName,
  publisher: settings.companyName,
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  manifest: `${siteUrl}/manifest.webmanifest`,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Vyankatesh Engineering | Precision Die Casting Tooling Manufacturer',
    description: settings.globalSeoDesc,
    siteName: settings.companyName,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${settings.companyName} — Precision Industrial Manufacturing`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vyankatesh Engineering | Precision Die Casting Tooling Manufacturer',
    description: settings.globalSeoDesc,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@VyankateshEngg',
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
  appleWebApp: { capable: true, title: settings.companyName, statusBarStyle: 'default' },
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
    inLanguage: 'en-IN',
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/#product-categories`,
    name: 'Vyankatesh Engineering Product Categories',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Pins', url: `${siteUrl}/categories/pins` },
      { '@type': 'ListItem', position: 2, name: 'Inserts', url: `${siteUrl}/categories/inserts` },
      { '@type': 'ListItem', position: 3, name: 'Dies', url: `${siteUrl}/categories/dies` },
      { '@type': 'ListItem', position: 4, name: 'Cooling Systems', url: `${siteUrl}/categories/cooling` },
      { '@type': 'ListItem', position: 5, name: 'Casting Accessories', url: `${siteUrl}/categories/accessories` },
    ],
  }
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Hide public Header/Footer on /admin (admin has its own shell) — uses x-pathname from middleware
  let isAdmin = false;
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const p = h.get('x-pathname') || h.get('x-invoke-path') || '';
    isAdmin = p.startsWith('/admin');
  } catch {}
  // Fallback: also check if children contains admin (for static generation where headers not available, admin layout will still render inside but we hide outer chrome via CSS)
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {isAdmin ? (
          <>{children}</>
        ) : (
          <>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </>
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'yh8165u5ic') && (
          <Script
            id="ms-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'yh8165u5ic'}");`,
            }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
