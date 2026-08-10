import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Car, Zap, Wrench, Factory, ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import styles from '../(authority)/authority.module.css';

let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

export const metadata: Metadata = {
  title: 'Industries Served | Automotive, Aerospace & Engineering | Vyankatesh Engineering',
  description: 'Vyankatesh Engineering supplies precision die casting tooling to the automotive, electrical, aerospace, and general engineering industries across India.',
  alternates: { canonical: `${baseUrl}/industries` },
  openGraph: {
    title: 'Industries Served | Vyankatesh Engineering',
    description: 'Precision die casting tooling for automotive, electrical, and engineering sectors.',
    url: `${baseUrl}/industries`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering Industries Served' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industries Served | Vyankatesh Engineering',
    description: 'Precision die casting tooling for automotive, electrical, and engineering sectors.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Industries Served', item: `${baseUrl}/industries` },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Industries Served | Vyankatesh Engineering',
  description: 'Industries utilizing our precision die casting tooling components.',
  publisher: { '@id': `${baseUrl}/#organization` },
};

export default function IndustriesPage() {
  return (
    <>
      <StructuredData data={[breadcrumbSchema, webPageSchema]} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Industries Served</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Cross-Sector Expertise</p>
          <h1 className={styles.heroTitle}>Supplying Precision Tooling <span>Across Industries</span></h1>
          <p className={styles.heroSubtitle}>
            For over 20 years, Vyankatesh Engineering has supplied India&apos;s manufacturing sector with dimensionally critical die casting tooling. Our components are found in HPDC dies, GDC dies, LPDC dies, and precision engineering applications across multiple high-demand industries.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>Automotive</span>
            <span className={styles.heroBadge}>Electrical & Electronics</span>
            <span className={styles.heroBadge}>Aerospace</span>
            <span className={styles.heroBadge}>Industrial Machinery</span>
          </div>
        </div>
      </header>

      {/* Industries Grid */}
      <section className={styles.sectionAlt} aria-labelledby="industries-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Sectors We Serve</p>
          <h2 className={styles.sectionHeading} id="industries-heading">Application Areas</h2>
          
          <div className={styles.industryGrid} style={{ marginTop: 'var(--space-10)' }}>
            
            {/* Automotive */}
            <div className={styles.industryCard}>
              <div className={styles.industryCardHeader}>
                <div className={styles.industryCardIcon} aria-hidden="true"><Car size={28} /></div>
                <h3 className={styles.industryCardName}>Automotive & Commercial Vehicles</h3>
              </div>
              <div className={styles.industryCardBody}>
                <p className={styles.industryCardDesc}>
                  The automotive sector demands the highest dimensional consistency and longest tool life from its die casting tooling. We serve automotive component manufacturers producing engine blocks, transmission housings, cylinder heads, chassis brackets, and structural components by HPDC, LPDC, and GDC processes. Our core pins, inserts, and dies are engineered to maintain dimensional accuracy across high-production volumes.
                </p>
                <div className={styles.industryProducts}>
                  <Link href="/products/core-pin" className={styles.industryProductChip}>Core Pins</Link>
                  <Link href="/products/jet-cool-core-pin" className={styles.industryProductChip}>Jet Cool Core Pins</Link>
                  <Link href="/products/hpdc-insert" className={styles.industryProductChip}>HPDC Inserts</Link>
                  <Link href="/products/shot-sleeve" className={styles.industryProductChip}>Shot Sleeves</Link>
                  <Link href="/products/lpdc-die" className={styles.industryProductChip}>LPDC Dies</Link>
                  <Link href="/products/gdc-die" className={styles.industryProductChip}>GDC Dies</Link>
                </div>
              </div>
            </div>

            {/* Electrical */}
            <div className={styles.industryCard}>
              <div className={styles.industryCardHeader}>
                <div className={styles.industryCardIcon} aria-hidden="true"><Zap size={28} /></div>
                <h3 className={styles.industryCardName}>Electrical & Electronics</h3>
              </div>
              <div className={styles.industryCardBody}>
                <p className={styles.industryCardDesc}>
                  Electrical enclosures, switchgear components, motor housings, and connector bodies are produced in large volumes by HPDC and GDC. These applications require precise cavity dimensions, smooth surface finish, and consistent dimensional repeatability. Vyankatesh Engineering&apos;s inserts and pins deliver the dimensional stability required for high-volume electrical component die casting.
                </p>
                <div className={styles.industryProducts}>
                  <Link href="/products/profile-inserts" className={styles.industryProductChip}>Profile Inserts</Link>
                  <Link href="/products/hpdc-insert" className={styles.industryProductChip}>HPDC Inserts</Link>
                  <Link href="/products/core-pin" className={styles.industryProductChip}>Core Pins</Link>
                  <Link href="/products/gdc-die" className={styles.industryProductChip}>GDC Dies</Link>
                </div>
              </div>
            </div>

            {/* Aerospace */}
            <div className={styles.industryCard}>
              <div className={styles.industryCardHeader}>
                <div className={styles.industryCardIcon} aria-hidden="true"><ShieldCheck size={28} /></div>
                <h3 className={styles.industryCardName}>Aerospace & Defence</h3>
              </div>
              <div className={styles.industryCardBody}>
                <p className={styles.industryCardDesc}>
                  Aerospace structural components and precision engineering parts demand the tightest dimensional tolerances and most rigorous material verification. Our vacuum-hardened, CMM-inspected tooling components are suitable for aerospace tooling applications requiring full material traceability and documented quality control.
                </p>
                <div className={styles.industryProducts}>
                  <Link href="/products/profile-inserts" className={styles.industryProductChip}>Profile Inserts</Link>
                  <Link href="/products/sub-insert" className={styles.industryProductChip}>Sub Inserts</Link>
                  <Link href="/products/prototype-insert" className={styles.industryProductChip}>Prototype Inserts</Link>
                  <Link href="/products/hpdc-insert" className={styles.industryProductChip}>HPDC Inserts</Link>
                </div>
              </div>
            </div>

            {/* Industrial Machinery */}
            <div className={styles.industryCard}>
              <div className={styles.industryCardHeader}>
                <div className={styles.industryCardIcon} aria-hidden="true"><Wrench size={28} /></div>
                <h3 className={styles.industryCardName}>Industrial Machinery</h3>
              </div>
              <div className={styles.industryCardBody}>
                <p className={styles.industryCardDesc}>
                  Pumps, compressors, gearboxes, and industrial housings require robust, dimensionally accurate die cast components. Vyankatesh Engineering manufactures the tooling for GDC and HPDC dies used in industrial machinery component production, with an emphasis on long die life and consistent cavity quality across production runs.
                </p>
                <div className={styles.industryProducts}>
                  <Link href="/products/gdc-die" className={styles.industryProductChip}>GDC Dies</Link>
                  <Link href="/products/hpdc-insert" className={styles.industryProductChip}>HPDC Inserts</Link>
                  <Link href="/products/sprue-bush-diffuser" className={styles.industryProductChip}>Sprue Bushes</Link>
                  <Link href="/products/shot-sleeve" className={styles.industryProductChip}>Shot Sleeves</Link>
                </div>
              </div>
            </div>

            {/* Die Casting Foundries */}
            <div className={styles.industryCard}>
              <div className={styles.industryCardHeader}>
                <div className={styles.industryCardIcon} aria-hidden="true"><Factory size={28} /></div>
                <h3 className={styles.industryCardName}>Die Casting Foundries</h3>
              </div>
              <div className={styles.industryCardBody}>
                <p className={styles.industryCardDesc}>
                  We supply directly to die casting foundries and in-house toolrooms that manage their own die maintenance. Whether you need replacement core pins, worn inserts, or emergency shot sleeves, Vyankatesh Engineering provides fast-turnaround precision replacement components manufactured to the same quality standard as original tooling.
                </p>
                <div className={styles.industryProducts}>
                  <Link href="/categories/pins" className={styles.industryProductChip}>All Pins</Link>
                  <Link href="/categories/inserts" className={styles.industryProductChip}>All Inserts</Link>
                  <Link href="/categories/accessories" className={styles.industryProductChip}>Accessories</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Commitment Checklist */}
      <section className={styles.section} aria-labelledby="commitment-heading">
        <div className="container">
          <div className={styles.splitGrid}>
            <div>
              <p className={styles.sectionLabel}>Industry Standard</p>
              <h2 className={styles.sectionHeading} id="commitment-heading">Our Commitment to Your Industry</h2>
              <ul className={styles.checklist} style={{ marginTop: 'var(--space-8)' }}>
                {[
                  'Custom manufactured to your specific drawing',
                  'Full material traceability (DIN 1.2344 / H-13)',
                  '100% pre-dispatch dimensional inspection',
                  'Fast turnaround on urgent replacement components',
                  'Engineering support for complex applications',
                  'Secure packaging for safe transit'
                ].map((item, i) => (
                  <li key={i} className={styles.checkItem}>
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <div className={styles.darkCallout}>
                <div className={styles.darkCalloutIcon} aria-hidden="true"><Layers size={32} /></div>
                <div>
                  <h3 className={styles.darkCalloutTitle}>Any Part. Any Drawing.</h3>
                  <p className={styles.darkCalloutBody} style={{ marginBottom: 'var(--space-4)' }}>
                    We do not rely on standard catalogue sizes. We manufacture entirely to customer drawings, ensuring every component perfectly fits your existing dies and machinery.
                  </p>
                  <LinkButton href="/why-choose-us" variant="outline" className="border-white text-white hover:bg-white/10">
                    Why Choose Vyankatesh
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Serving Your Industry. Made to Your Specification.</h2>
          <p className={styles.ctaBannerDesc}>
            Send us your drawing or specification for a comprehensive quote and lead time estimation.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              Request a Quote
            </LinkButton>
            <LinkButton href="/manufacturing-process" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              View Manufacturing Process <ArrowRight size={18} />
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
