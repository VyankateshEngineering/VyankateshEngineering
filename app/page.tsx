import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import CompanySection from '@/components/home/CompanySection';
import FacilitiesSection from '@/components/home/FacilitiesSection';
import CapabilitiesSection from '@/components/home/CapabilitiesSection';
import ProductsSection from '@/components/home/ProductsSection';
import GallerySection from '@/components/home/GallerySection';
import CustomersSection from '@/components/home/CustomersSection';
import ContactSection from '@/components/home/ContactSection';

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

export const metadata: Metadata = {
  title: 'Vyankatesh Engineering | Precision Die Casting Tooling | Waluj MIDC',
  description:
    'Precision die casting tooling manufacturer in Waluj MIDC — core pins, jet cool pins, profile inserts, HPDC/LPDC/GDC dies, shot sleeves. 20+ years, 100% inspected, custom to drawing.',
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'Vyankatesh Engineering | Precision Die Casting Tooling Manufacturer',
    description:
      '20+ years in Waluj MIDC — precision core pins, jet cool pins, inserts, dies & shot sleeves. Vacuum hardened, nitrided, PVD coated, 100% inspected. Custom to drawing.',
    url: baseUrl,
    type: 'website',
    locale: 'en_IN',
    siteName: 'Vyankatesh Engineering',
    images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Vyankatesh Engineering — Precision Die Casting Tooling, Waluj MIDC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vyankatesh Engineering | Precision Die Casting Tooling',
    description: 'Core pins, jet cool pins, profile inserts, HPDC/LPDC/GDC dies, shot sleeves — 100% inspected, custom to drawing. Waluj MIDC, 20+ years.',
    images: [`${baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <CompanySection />
      <FacilitiesSection />
      <CapabilitiesSection />
      <ProductsSection />
      <GallerySection />
      <CustomersSection />
      <ContactSection />
    </>
  );
}
