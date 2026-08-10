import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Download, FileText, Package, Wrench, Factory, ArrowRight, MessageSquare } from 'lucide-react';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import styles from '../(authority)/authority.module.css';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com').replace(/^https?:\/\/vyankateshengg\.com/, 'https://www.vyankateshengg.com');

export const metadata: Metadata = {
  title: 'Digital Catalogue | Die Casting Tooling | Vyankatesh Engineering',
  description: 'Download the Vyankatesh Engineering product catalogue. Comprehensive die casting tooling catalogue covering core pins, jet cool pins, inserts, dies, shot sleeves, and accessories.',
  alternates: { canonical: `${baseUrl}/catalogue` },
  openGraph: {
    title: 'Product Catalogue | Vyankatesh Engineering',
    description: 'Download our comprehensive die casting tooling catalogue — core pins, inserts, dies, shot sleeves, and accessories.',
    url: `${baseUrl}/catalogue`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering Product Catalogue' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Catalogue | Vyankatesh Engineering',
    description: 'Download our comprehensive die casting tooling catalogue — core pins, inserts, dies, shot sleeves, and accessories.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${baseUrl}/catalogue` },
  ],
};

const catalogueSchema = {
  '@context': 'https://schema.org',
  '@type': 'DigitalDocument',
  name: 'Vyankatesh Engineering Product Catalogue',
  description: 'Comprehensive product catalogue covering die casting tooling — core pins, jet cool pins, profile inserts, HPDC inserts, dies, shot sleeves, and accessories.',
  encodingFormat: 'application/pdf',
  url: `${baseUrl}/Vyankatesh-Engineering-Catalogue-v1.0.pdf`,
  author: { '@type': 'Organization', name: 'Vyankatesh Engineering' },
};

const productCategories = [
  {
    icon: <Package size={24} />,
    name: 'Pins',
    href: '/categories/pins',
    products: [
      { name: 'Core Pin', href: '/products/core-pin' },
      { name: 'Jet Cool Core Pin', href: '/products/jet-cool-core-pin' },
      { name: 'Jet Cool Profile Pin', href: '/products/jet-cool-profile-pin' },
      { name: 'Jet Cool Profile Core Pin', href: '/products/jet-cool-profile-core-pin' },
      { name: 'Long Jet Cool Core Pin', href: '/products/long-jet-cool-core-pin' },
    ],
  },
  {
    icon: <Wrench size={24} />,
    name: 'Inserts',
    href: '/categories/inserts',
    products: [
      { name: 'Profile Inserts', href: '/products/profile-inserts' },
      { name: 'HPDC Die / Insert', href: '/products/hpdc-insert' },
      { name: 'Sub Insert', href: '/products/sub-insert' },
      { name: 'Prototype Insert', href: '/products/prototype-insert' },
    ],
  },
  {
    icon: <Factory size={24} />,
    name: 'Dies',
    href: '/categories/dies',
    products: [
      { name: 'HPDC Die', href: '/products/hpdc-die' },
      { name: 'GDC Die', href: '/products/gdc-die' },
      { name: 'LPDC Die', href: '/products/lpdc-die' },
    ],
  },
  {
    icon: <FileText size={24} />,
    name: 'Cooling Systems',
    href: '/categories/cooling',
    products: [
      { name: 'Jet Cooler', href: '/products/jet-cooler' },
      { name: 'Copper Chills', href: '/products/copper-chills' },
    ],
  },
  {
    icon: <Package size={24} />,
    name: 'Casting Accessories',
    href: '/categories/accessories',
    products: [
      { name: 'Shot Sleeve', href: '/products/shot-sleeve' },
      { name: 'Sprue Bush & Diffuser', href: '/products/sprue-bush-diffuser' },
      { name: 'Side Core Holder', href: '/products/side-core-holder' },
    ],
  },
];

export default function CataloguePage() {
  return (
    <>
      <StructuredData data={[breadcrumbSchema, catalogueSchema]} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Product Catalogue</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Digital Catalogue</p>
          <h1 className={styles.heroTitle}>
            Vyankatesh Engineering<br /><span>Product Catalogue</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Our complete product catalogue covers the full range of precision-manufactured die casting tooling — core pins, jet cool pins, profile inserts, HPDC inserts, GDC and LPDC dies, shot sleeves, sprue bushes, and cooling systems. Download the PDF for offline reference or browse individual product pages for complete technical specifications.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
            <a
              href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf"
              download
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={20} />
              Download Catalogue (PDF)
            </a>
            <LinkButton href="/#contact" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <MessageSquare size={18} /> Request a Quote
            </LinkButton>
          </div>
        </div>
      </header>

      {/* Catalogue Overview */}
      <section className={styles.section} aria-labelledby="overview-heading">
        <div className="container">
          <div className={styles.splitGrid}>
            <div>
              <p className={styles.sectionLabel}>What&apos;s Inside</p>
              <h2 className={styles.sectionHeading} id="overview-heading">Comprehensive Tooling Catalogue</h2>
              <p className={styles.sectionBody}>
                The Vyankatesh Engineering catalogue is a technical reference document for die casting engineers, tooling designers, and purchasing managers. It covers our complete range of precision-manufactured die casting tooling components with key specifications, material information, available sizes, and surface treatment options.
              </p>
              <ul className={styles.checklist} style={{ marginTop: 'var(--space-8)' }}>
                {[
                  'Complete product range — all 15 product types',
                  'Key technical specifications per product',
                  'Material information (DIN 1.2344 / AISI H-13)',
                  'Heat treatment and surface treatment options',
                  'Available sizes and customisation information',
                  'Contact information and enquiry guidance',
                ].map((item, i) => (
                  <li key={i} className={styles.checkItem}>
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* Download card */}
              <div style={{
                background: 'linear-gradient(135deg, var(--neutral-900), var(--neutral-800))',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-10)',
                textAlign: 'center',
                border: '1px solid rgba(245,138,0,0.2)',
              }}>
                <div style={{
                  width: 80, height: 80,
                  background: 'rgba(245,138,0,0.15)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-6)',
                  color: 'var(--primary-400)',
                }}>
                  <FileText size={40} />
                </div>
                <h3 style={{ color: 'white', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                  Download PDF Catalogue
                </h3>
                <p style={{ color: 'var(--neutral-400)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                  Get the full Vyankatesh Engineering product catalogue as a PDF for offline reference. Updated product range with specifications and contact details.
                </p>
                <a
                  href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf"
                  download
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'var(--primary-500)', color: 'white',
                    padding: '14px 28px', borderRadius: 'var(--radius-lg)',
                    fontWeight: 700, fontSize: 'var(--text-base)',
                    textDecoration: 'none', transition: 'background 0.2s',
                    width: '100%', justifyContent: 'center',
                  }}
                >
                  <Download size={20} />
                  Download PDF
                </a>
                <p style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-4)' }}>
                  Free download. No registration required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Index */}
      <section className={styles.sectionAlt} aria-labelledby="index-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Product Index</p>
          <h2 className={styles.sectionHeading} id="index-heading">Browse Online — Full Technical Detail</h2>
          <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-10)' }}>
            Our online product pages contain more technical detail than the printed catalogue — including full specifications, materials, tolerances, surface finish, applications, industries, quality assurance, FAQ, and image gallery. Browse any product for complete information.
          </p>
          <div className={styles.cardsGrid}>
            {productCategories.map(cat => (
              <div key={cat.name} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">{cat.icon}</div>
                <h3 className={styles.cardTitle}>
                  <Link href={cat.href} style={{ textDecoration: 'none', color: 'inherit' }}>{cat.name}</Link>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {cat.products.map(p => (
                    <li key={p.href}>
                      <Link href={p.href} style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', transition: 'color 0.2s' }}>
                        <ArrowRight size={12} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={cat.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: 'var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--primary-600)', textDecoration: 'none' }}>
                  Browse {cat.name} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Enquiry */}
      <section className={styles.section} aria-labelledby="custom-heading">
        <div className="container" style={{ maxWidth: 760 }}>
          <p className={styles.sectionLabel}>Custom Requirements</p>
          <h2 className={styles.sectionHeading} id="custom-heading">Don&apos;t See What You Need?</h2>
          <p className={styles.sectionBody}>
            All products listed in our catalogue are manufactured to customer drawings. If you have a specific requirement not covered in the catalogue — a custom profile, unusual size range, or combination of features — please contact us with your drawing or specification. We manufacture custom components from sample or drawing for both prototype and production requirements.
          </p>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <LinkButton href="/#contact" variant="primary" size="lg" icon={<MessageSquare size={18} />} iconPosition="left">
              Send Enquiry
            </LinkButton>
            <LinkButton href="/why-choose-us" variant="outline" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Why Choose Us
            </LinkButton>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Ready to Place an Order?</h2>
          <p className={styles.ctaBannerDesc}>
            Share your drawing, sample, or specification. Our team will provide a competitive quote with a confirmed delivery schedule.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              <MessageSquare size={18} /> Get a Quote
            </LinkButton>
            <a href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" download className="btn btn-outline btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              <Download size={18} /> Download Catalogue
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
