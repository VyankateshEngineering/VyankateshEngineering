import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Download, MessageSquare, Layers, ArrowRight } from 'lucide-react';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import GalleryPageClient from './GalleryPageClient';
import { galleryItems } from '@/data/gallery';
import styles from '../(authority)/authority.module.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com';

export const metadata: Metadata = {
  title: 'Parts Gallery | Precision Die Casting Tooling | Vyankatesh Engineering',
  description: 'Browse our portfolio of precision-manufactured die casting tooling — core pins, jet cool pins, profile inserts, HPDC inserts, GDC dies, shot sleeves, and more. Manufactured at Waluj MIDC by Vyankatesh Engineering.',
  alternates: { canonical: `${baseUrl}/gallery` },
  openGraph: {
    title: 'Parts Gallery | Vyankatesh Engineering',
    description: 'Explore our precision die casting tooling portfolio — core pins, inserts, dies, and accessories manufactured at Waluj MIDC.',
    url: `${baseUrl}/gallery`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering Parts Gallery' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${baseUrl}/gallery` },
  ],
};

const imageObjectSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Vyankatesh Engineering — Precision Tooling Portfolio',
  description: 'Gallery of precision-manufactured die casting tooling components including core pins, inserts, dies, and accessories.',
  url: `${baseUrl}/gallery`,
};

export default function GalleryPage() {
  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(galleryItems.map(g => g.category))).sort()];
  const sortedItems = [...galleryItems].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <StructuredData data={[breadcrumbSchema, imageObjectSchema]} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Parts Gallery</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Manufacturing Portfolio</p>
          <h1 className={styles.heroTitle}>
            Precision <span>Tooling</span> Gallery
          </h1>
          <p className={styles.heroSubtitle}>
            Every component shown here is strictly managed by our Waluj MIDC facility — from certified raw material through in-house CNC machining and precision grinding, to certified vacuum hardening and nitriding. Browse our portfolio of core pins, jet cool pins, profile inserts, HPDC inserts, GDC and LPDC dies, shot sleeves, and accessories.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>40+ Gallery Items</span>
            <span className={styles.heroBadge}>15+ Product Types</span>
            <span className={styles.heroBadge}>100% Quality Verified</span>
            <span className={styles.heroBadge}>Waluj MIDC</span>
          </div>
        </div>
      </header>

      {/* Gallery — client component for filtering + lightbox */}
      <section style={{ background: 'var(--neutral-50)', padding: 'var(--space-16) 0' }} aria-labelledby="gallery-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Portfolio</p>
          <h2 className={styles.sectionHeading} id="gallery-heading">Our Work</h2>
          <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-10)' }}>
            Explore our range of precision-manufactured die casting tooling components. Use the category filters to browse by product type. Click any image to view it in full detail.
          </p>
          <GalleryPageClient items={sortedItems} categories={categories} />
        </div>
      </section>

      {/* Why Our Quality section */}
      <section className={styles.section} aria-labelledby="quality-heading">
        <div className="container">
          <div className={styles.splitGrid}>
            <div>
              <p className={styles.sectionLabel}>Quality Standard</p>
              <h2 className={styles.sectionHeading} id="quality-heading">Every Component Is 100% Inspected</h2>
              <p className={styles.sectionBody}>
                Every component in this gallery passed through our complete quality process before dispatch — from raw material certification to final dimensional inspection. We do not use sampling inspection. Every single component is individually measured, hardness-tested, and visually inspected before it leaves our facility.
              </p>
              <ul className={styles.checklist} style={{ marginTop: 'var(--space-8)' }}>
                {[
                  'Certified DIN 1.2344 / AISI H-13 raw material with mill certificates',
                  'In-process CNC dimensional control at each machining stage',
                  'Vacuum hardening with recorded cycle parameters and Rockwell hardness verification',
                  'Post-grind CMM or precision gauge inspection to drawing tolerance',
                  'Gas nitriding with case depth verification',
                  'Pre-dispatch 100% dimensional re-check and visual inspection',
                ].map((item, i) => (
                  <li key={i} className={styles.checkItem}>
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <LinkButton href="/quality" variant="outline" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                  Our Quality Process
                </LinkButton>
              </div>
            </div>
            <div>
              <div className={styles.darkCallout}>
                <div className={styles.darkCalloutIcon} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className={styles.darkCalloutTitle}>20+ Years of Manufacturing Experience</div>
                  <p className={styles.darkCalloutBody}>
                    Vyankatesh Engineering has been manufacturing precision die casting tooling for over two decades from our Waluj MIDC facility. The components you see in this gallery represent the accumulated expertise of 20+ years in precision CNC machining, grinding, and die casting tooling.
                  </p>
                  <ul className={styles.darkCalloutList}>
                    <li>MSME Registered manufacturer</li>
                    <li>MIDC Registered facility, Waluj MIDC</li>
                    <li>End-to-end quality management from raw material to finished product</li>
                    <li>Custom manufactured to your drawing, sample, or specification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className={styles.sectionAlt} aria-labelledby="browse-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Browse Our Range</p>
          <h2 className={styles.sectionHeading} id="browse-heading">Product Categories</h2>
          <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-8)' }}>
            Visit our product category pages for full technical specifications, material details, applications, and FAQs.
          </p>
          <div className={styles.linkStrip}>
            {[
              { name: 'Pins', href: '/categories/pins' },
              { name: 'Inserts', href: '/categories/inserts' },
              { name: 'Dies', href: '/categories/dies' },
              { name: 'Cooling Systems', href: '/categories/cooling' },
              { name: 'Casting Accessories', href: '/categories/accessories' },
              { name: 'About Us', href: '/about' },
              { name: 'Quality Assurance', href: '/quality' },
            ].map(l => (
              <Link key={l.href} href={l.href} className={styles.linkChip}>
                <Layers size={14} /> {l.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Ready to Order or Get a Quote?</h2>
          <p className={styles.ctaBannerDesc}>
            Send us your drawing, sample, or specification. Our engineering team will provide a competitive quote with confirmed lead time.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              <MessageSquare size={18} /> Request a Quote
            </LinkButton>
            <LinkButton href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" variant="outline" size="lg" className="border-white text-white">
              <Download size={18} /> Download Catalogue
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
