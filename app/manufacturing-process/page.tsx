import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Wrench, Settings, Zap, ArrowRight, Layers, CheckCircle2, Factory } from 'lucide-react';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import styles from '../(authority)/authority.module.css';

let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

export const metadata: Metadata = {
  title: 'Manufacturing Process | Waluj MIDC | Vyankatesh Engineering',
  description: 'Learn about our end-to-end in-house manufacturing process — CNC turning, VMC machining, EDM, vacuum hardening, precision grinding, and nitriding at Waluj MIDC.',
  alternates: { canonical: `${baseUrl}/manufacturing-process` },
  openGraph: {
    title: 'Manufacturing Process | Vyankatesh Engineering',
    description: 'Explore our complete in-house manufacturing capabilities for precision die casting tooling.',
    url: `${baseUrl}/manufacturing-process`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering Manufacturing Process' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing Process | Vyankatesh Engineering',
    description: 'Explore our complete in-house manufacturing capabilities for precision die casting tooling.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Manufacturing Process', item: `${baseUrl}/manufacturing-process` },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Manufacturing Process | Vyankatesh Engineering',
  description: 'Our end-to-end in-house manufacturing process for precision die casting tooling.',
  publisher: { '@id': `${baseUrl}/#organization` },
};

export default function ManufacturingProcessPage() {
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
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Manufacturing Process</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Precision Machining</p>
          <h1 className={styles.heroTitle}>From Raw Steel to <span>Precision Tool</span></h1>
          <p className={styles.heroSubtitle}>
            Our entire manufacturing operation is designed around one principle: uncompromising quality control. By maintaining precision CNC machining, EDM, and grinding under one roof at Waluj MIDC, while partnering with certified experts for thermal processing, we guarantee dimensional accuracy and traceability at every production stage.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>In-House Machining</span>
            <span className={styles.heroBadge}>CNC & VMC</span>
            <span className={styles.heroBadge}>Certified Heat Treatment</span>
            <span className={styles.heroBadge}>Wire & Sink EDM</span>
          </div>
        </div>
      </header>

      {/* Philosophy */}
      <section className={styles.sectionAlt} aria-labelledby="philosophy-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Philosophy</p>
          <h2 className={styles.sectionHeading} id="philosophy-heading">The Value of Vertical Integration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
                When critical manufacturing steps are not strictly managed, quality control is compromised. That is why Vyankatesh Engineering has invested heavily in maintaining an advanced in-house machining and grinding facility, supported by certified external partners for thermal processing. When a component enters our facility as certified DIN 1.2344 / H-13 steel billet, we manage its entire lifecycle—from precision machining through certified external thermal processing to final inspection. This single-source responsibility is how we eliminate dimensional drift and maintain our zero-compromise quality standard.
              </p>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--neutral-100)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Image 
                src="/gallery/gdc-die-block.png"
                alt="Vertical Integration in Manufacturing"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className={styles.section} aria-labelledby="capabilities-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Equipment & Methods</p>
          <h2 className={styles.sectionHeading} id="capabilities-heading">Our Manufacturing Capabilities</h2>
          <div className={styles.cardsGrid} style={{ marginTop: 'var(--space-8)' }}>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Settings size={28} /></div>
              <h3 className={styles.cardTitle}>CNC Turning & Milling</h3>
              <p className={styles.cardBody}>Precision CNC machining for round and prismatic components, roughing and semi-finishing to tight pre-grind tolerances.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Factory size={28} /></div>
              <h3 className={styles.cardTitle}>Vertical Machining Center (VMC)</h3>
              <p className={styles.cardBody}>Multi-axis VMC machining handles complex die components, cavity features, and side core holders with exceptional repeatability.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Zap size={28} /></div>
              <h3 className={styles.cardTitle}>Wire EDM & Sink EDM</h3>
              <p className={styles.cardBody}>Precision Electrical Discharge Machining for complex profile inserts, deep blind cavities, and sharp internal corners that cannot be milled.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Layers size={28} /></div>
              <h3 className={styles.cardTitle}>Gun Drilling</h3>
              <p className={styles.cardBody}>Specialist gun drilling equipment ensures internal cooling bores (like those in jet cool core pins) remain perfectly concentric to the outer diameter.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Wrench size={28} /></div>
              <h3 className={styles.cardTitle}>Precision Grinding</h3>
              <p className={styles.cardBody}>Cylindrical, surface, and profile grinding. We achieve h6–h8 tolerances and Ra ≤ 0.4μm surface finish required for die casting components.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Settings size={28} /></div>
              <h3 className={styles.cardTitle}>Bore Honing</h3>
              <p className={styles.cardBody}>Fine bore finishing specifically designed for shot sleeves and sprue bushes, ensuring smooth plunger travel and laminar metal flow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Heat Treatment Process */}
      <section className={styles.sectionAlt} aria-labelledby="heat-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Thermal Processing</p>
          <h2 className={styles.sectionHeading} id="heat-heading">Heat Treatment Process</h2>
          <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-10)' }}>
            Die casting tooling is subjected to extreme thermal fatigue. The correct heat treatment cycle is critical to balancing hardness (for wear resistance) and toughness (to prevent cracking). Our certified external thermal processing partners provide full documentation for every batch, which we rigorously verify.
          </p>
          
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.processNum}>1</div>
              <h3 className={styles.processStepTitle}>Pre-Heat Check</h3>
              <p className={styles.processStepDesc}>Dimensions recorded before heat treatment to accurately track and manage any distortion.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNum}>2</div>
              <h3 className={styles.processStepTitle}>Vacuum Hardening</h3>
              <p className={styles.processStepDesc}>Performed by certified external partners, nitrogen/argon gas quench in a vacuum furnace provides clean, distortion-controlled hardening to 44–48 HRC.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNum}>3</div>
              <h3 className={styles.processStepTitle}>Tempering</h3>
              <p className={styles.processStepDesc}>Double or triple tempering cycles relieve residual stresses and achieve the optimum hardness/toughness balance.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNum}>4</div>
              <h3 className={styles.processStepTitle}>Straightness Check</h3>
              <p className={styles.processStepDesc}>Pins and rods are checked for straightness. Any minor distortion is corrected prior to final grinding.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.processNum}>5</div>
              <h3 className={styles.processStepTitle}>Hardness Verification</h3>
              <p className={styles.processStepDesc}>Rockwell C scale hardness tested on every batch. Results are recorded against the material and batch number.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Surface Treatment & Blue Matching */}
      <section className={styles.section} aria-labelledby="finishing-heading">
        <div className="container">
          <div className={styles.splitGrid}>
            <div>
              <p className={styles.sectionLabel}>Finishing & Fitting</p>
              <h2 className={styles.sectionHeading} id="finishing-heading">Surface Treatment & Assembly</h2>
              <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-6)' }}>
                After final grinding, die casting components require specific surface treatments to resist erosion, soldering, and thermal checking.
              </p>
              
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Gas Nitriding & PVD Coating</h3>
              <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-6)' }}>
                We utilise gas nitriding to diffuse nitrogen into the steel surface, creating a hard compound layer (900–1200 HV) with a deep diffusion zone. This is applied after final grinding to maintain dimensional accuracy (typical case depth 0.1–0.15mm). For extreme wear or high-silicon aluminium applications, we also provide PVD hard coatings (TiN, TiAlN).
              </p>

              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Precision Blue Matching</h3>
              <p className={styles.sectionBody}>
                For sprue bushes, die inserts, and complete dies, we perform precision blue matching. Engineer&apos;s blue marking compound is applied to the mating faces to verify contact patterns. This ensures complete seating and flash-free parting lines.
              </p>
            </div>
            
            <div className={styles.darkCallout}>
              <div className={styles.darkCalloutIcon} aria-hidden="true"><CheckCircle2 size={32} /></div>
              <div>
                <h3 className={styles.darkCalloutTitle}>Complete Traceability</h3>
                <p className={styles.darkCalloutBody} style={{ marginBottom: 'var(--space-4)' }}>
                  Because we control the entire manufacturing process, we offer full traceability. Part numbers, specifications, and heat treatment batch numbers are permanently laser engraved on non-functional surfaces of the component.
                </p>
                <LinkButton href="/quality" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Our Quality Process
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className={styles.sectionAlt} aria-labelledby="explore-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Explore More</p>
          <h2 className={styles.sectionHeading} id="explore-heading">Related Information</h2>
          <div className={styles.linkStrip}>
            {[
              { name: 'About Us', href: '/about' },
              { name: 'Quality Assurance', href: '/quality' },
              { name: 'Core Pins', href: '/categories/pins' },
              { name: 'Die Inserts', href: '/categories/inserts' },
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
          <h2 className={styles.ctaBannerTitle}>Discuss Your Manufacturing Requirements</h2>
          <p className={styles.ctaBannerDesc}>
            Require custom die casting tooling? Our engineering team is ready to review your drawing or specification.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              Contact Engineering
            </LinkButton>
            <LinkButton href="/why-choose-us" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Why Choose Us <ArrowRight size={18} />
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
