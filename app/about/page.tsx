import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import {
  ChevronRight,
  Clock,
  Factory,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Download,
  MessageSquare,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import styles from '../(authority)/authority.module.css';

let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
const pageUrl = `${baseUrl}/about`;

export const metadata: Metadata = {
  title: 'About Us | 20+ Years Precision Die Casting Tooling | Vyankatesh Engineering',
  description:
    'Vyankatesh Engineering — precision die casting tooling manufacturer in Waluj MIDC, Chhatrapati Sambhajinagar. 20+ years of experience in core pins, inserts, GDC/LPDC dies, heat treatment and nitriding. MSME & MIDC registered.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'About Vyankatesh Engineering | Precision Die Casting Tooling Manufacturer',
    description:
      'Learn how Vyankatesh Engineering built 20+ years of expertise in precision die casting tooling — core pins, inserts, dies, heat treatment, nitriding and 100% pre-dispatch inspection at our Waluj MIDC facility.',
    url: pageUrl,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering — About Us' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Vyankatesh Engineering | Precision Die Casting Tooling Manufacturer',
    description:
      'Learn how Vyankatesh Engineering built 20+ years of expertise in precision die casting tooling — core pins, inserts, dies, heat treatment, nitriding and 100% pre-dispatch inspection at our Waluj MIDC facility.',
    images: ['/og-image.jpg'],
  },
};

// ── Structured Data ──────────────────────────────────────────────────────────

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: pageUrl },
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vyankatesh Engineering',
  url: baseUrl,
  '@id': `${baseUrl}/#organization`,
  description:
    'Precision manufacturer of die casting tooling components — core pins, profile inserts, HPDC inserts, shot sleeves, sprue bushes, GDC dies, LPDC dies, and copper chills. Located in Waluj MIDC, Chhatrapati Sambhajinagar, Maharashtra.',
  foundingLocation: {
    '@type': 'Place',
    name: 'Waluj MIDC, Chhatrapati Sambhajinagar, Maharashtra, India',
  },
  email: 'sales.vyankateshengg@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C-252/3, Waluj MIDC',
    addressLocality: 'Chhatrapati Sambhajinagar',
    addressRegion: 'Maharashtra',
    postalCode: '431136',
    addressCountry: 'IN',
  },
  areaServed: 'IN',
  knowsAbout: [
    'Die Casting Tooling',
    'Core Pin Manufacturing',
    'Vacuum Heat Treatment',
    'Gas Nitriding',
    'PVD Coating',
    'Precision CNC Machining',
    'VMC Machining',
    'Wire EDM',
    'Sink EDM',
    'Blue Matching',
    'GDC Dies',
    'LPDC Dies',
    'HPDC Inserts',
    'Shot Sleeves',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'MSME Registered' },
    { '@type': 'EducationalOccupationalCredential', name: 'MIDC Registered' },
  ],
  sameAs: ['https://linkedin.com/company/vyankatesh-engineering'],
};

// ── Page Data ────────────────────────────────────────────────────────────────

const WHY_US_CARDS = [
  {
    icon: <Clock size={26} strokeWidth={1.75} />,
    title: '20+ Years Experience',
    body: 'Two decades of focused manufacturing in die casting tooling. Our depth of experience in H-13 tool steel machining and profile grinding is reflected in every component we ship.',
  },
  {
    icon: <Factory size={26} strokeWidth={1.75} />,
    title: 'Managed End-to-End Solutions',
    body: 'From certified raw billet through CNC machining, grinding, and final inspection in-house, seamlessly integrated with certified partners for vacuum hardening and nitriding.',
  },
  {
    icon: <Cpu size={26} strokeWidth={1.75} />,
    title: 'Precision VMC & CNC Machining',
    body: 'Advanced Vertical Machining Centres and CNC turning backed by Wire EDM, Sink EDM, and precision surface and profile grinding — enabling tight tolerances on complex geometries.',
  },
  {
    icon: <ShieldCheck size={26} strokeWidth={1.75} />,
    title: '100% Pre-Dispatch Inspection',
    body: 'Every component is individually inspected and documented before it leaves our facility. Dimensional records, hardness data, and visual inspection results are maintained for full traceability.',
  },
];

const CAPABILITIES = [
  'Precision CNC turning & milling (multi-axis)',
  'Vertical Machining Centre (VMC) operations',
  'Wire EDM & Sink EDM for complex profiles',
  'Precision surface grinding & honing',
  'Profile grinding for complex insert geometry',
  'Blue matching on VMC — parting face verification',
  '100% CMM & precision gauge dimensional inspection',
  'Rockwell hardness testing on every heat treatment batch',
  'Laser engraving for part marking & traceability',
];

const PRODUCTS = [
  { name: 'Core Pin', slug: 'core-pin' },
  { name: 'Jet Cool Core Pin', slug: 'jet-cool-core-pin' },
  { name: 'Profile Inserts', slug: 'profile-inserts' },
  { name: 'HPDC Insert', slug: 'hpdc-insert' },
  { name: 'Shot Sleeve', slug: 'shot-sleeve' },
  { name: 'Sprue Bush & Diffuser', slug: 'sprue-bush-diffuser' },
  { name: 'GDC Die', slug: 'gdc-die' },
  { name: 'LPDC Die', slug: 'lpdc-die' },
  { name: 'Copper Chills', slug: 'copper-chills' },
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <StructuredData data={[breadcrumbSchema, organizationSchema]} />

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>About Vyankatesh Engineering</p>
          <h1 className={styles.heroTitle}>
            Precision Manufacturing.<br />
            <span>Engineered to Last.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Over 20 years of focused expertise in precision die casting tooling — core pins, inserts,
            dies, shot sleeves, and accessories — manufactured with precision at our Waluj MIDC
            facility in Chhatrapati Sambhajinagar, Maharashtra.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}><MapPin size={14} aria-hidden="true" /> Waluj MIDC, Maharashtra</span>
            <span className={styles.heroBadge}><ShieldCheck size={14} aria-hidden="true" /> MSME Registered</span>
            <span className={styles.heroBadge}><Factory size={14} aria-hidden="true" /> MIDC Registered</span>
            <span className={styles.heroBadge}><Clock size={14} aria-hidden="true" /> 20+ Years Experience</span>
          </div>
        </div>
      </header>

      {/* ── Company Story ── */}
      <section className={styles.section} aria-labelledby="story-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Story</p>
          <h2 className={styles.sectionHeading} id="story-heading">
            Built in Die Casting Country
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
                Vyankatesh Engineering was established in Waluj MIDC, Chhatrapati Sambhajinagar — one of
                Maharashtra&apos;s most concentrated industrial corridors for die casting and precision
                engineering. From the start, our focus was singular: manufacture the high-wear tooling
                components that the die casting industry consumes repeatedly and demands to the highest
                dimensional standards. Core pins, cavity inserts, dies, and shot sleeves are not commodity
                items — each must be made right, to tolerance, every batch. That conviction has driven how
                we built our capability over more than two decades.
              </p>
              <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
                We invested progressively in CNC turning and milling, VMC machining, Wire and Sink EDM,
                and precision surface and profile grinding. By keeping machining in-house and partnering
                with certified experts for vacuum hardening and gas nitriding, we ensure total quality control. 
                Today our product range covers the complete die casting tooling set: pins, inserts, dies (GDC and
                LPDC), shot sleeves, sprue bushes, and copper chills — all processed through a
                rigorous sequence and shipped with 100% dimensional inspection records.
              </p>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--neutral-100)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Image 
                src="/gallery/critical-inserts-set.png"
                alt="Precision Die Casting Tooling Components"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Vyankatesh ── */}
      <section className={styles.sectionAlt} aria-labelledby="why-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Why Choose Us</p>
          <h2 className={styles.sectionHeading} id="why-heading">
            What Sets Vyankatesh Apart
          </h2>
          <div className={styles.cardsGrid}>
            {WHY_US_CARDS.map((card) => (
              <div key={card.title} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {card.icon}
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBody}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="container">
        <div className={styles.statsBar} role="list" aria-label="Key company figures">
          <div className={styles.statItem} role="listitem">
            <span className={styles.statNumber}>20+</span>
            <span className={styles.statLabel}>Years of Manufacturing Experience</span>
          </div>
          <div className={styles.statItem} role="listitem">
            <span className={styles.statNumber}>15+</span>
            <span className={styles.statLabel}>Precision Products in Range</span>
          </div>
          <div className={styles.statItem} role="listitem">
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Quality Inspected</span>
          </div>
          <div className={styles.statItem} role="listitem">
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Industries Served</span>
          </div>
        </div>
      </div>

      {/* ── Our Capabilities ── */}
      <section className={styles.section} aria-labelledby="capabilities-heading">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'var(--space-16)', alignItems: 'start' }}>
            <div>
              <p className={styles.sectionLabel}>What We Do</p>
              <h2 className={styles.sectionHeading} id="capabilities-heading">
                Our Manufacturing Capabilities
              </h2>
              <p className={styles.sectionBody}>
                Our facility combines precision metal cutting, thermal processing, surface engineering,
                and dimensional metrology under one roof — the complete process chain required to
                manufacture die casting tooling to the tolerances the industry demands.
              </p>
              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link href="/manufacturing-process" className={styles.linkChip}>
                  Full Manufacturing Process <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <ul className={styles.checklist} aria-label="Manufacturing capabilities">
              {CAPABILITIES.map((cap) => (
                <li key={cap} className={styles.checkItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} aria-hidden="true" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Manufacturing Location ── */}
      <section className={styles.sectionAlt} aria-labelledby="location-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Facility</p>
          <h2 className={styles.sectionHeading} id="location-heading">
            Waluj MIDC Manufacturing Facility
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-12)', alignItems: 'start' }}>
            <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
              Our manufacturing plant is located in Waluj MIDC — the designated industrial zone of
              Chhatrapati Sambhajinagar (formerly Aurangabad), Maharashtra. The facility houses our
              CNC machining centres and VMC machines for precision metal cutting, an in-house tool
              room for tooling maintenance and prototyping, precision grinding equipment for final
              dimensional work, laser engraving capability for part identification and marking, and
              our quality inspection area with CMM, precision gauges, and hardness testing. The
              Waluj MIDC location gives us ready access to established logistics networks and
              positions us close to the major die casting clusters of the Maharashtra automotive
              corridor.
            </p>
            <div>
              <div className={styles.darkCallout}>
                <div className={styles.darkCalloutIcon} aria-hidden="true">
                  <Factory size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <div className={styles.darkCalloutTitle}>In-House Capabilities</div>
                  <ul className={styles.darkCalloutList}>
                    <li>CNC Machining Centres</li>
                    <li>VMC Machining &amp; EDM</li>
                    <li>Dedicated Tool Room</li>
                    <li>Precision Grinding</li>
                    <li>Laser Engraving</li>
                    <li>CMM &amp; Gauge Inspection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Range ── */}
      <section className={styles.section} aria-labelledby="products-heading">
        <div className="container">
          <p className={styles.sectionLabel}>What We Manufacture</p>
          <h2 className={styles.sectionHeading} id="products-heading">Our Product Range</h2>
          <p className={styles.sectionBody}>
            We manufacture the complete set of precision components required for die casting tooling —
            from consumable core pins through cavity inserts, complete GDC and LPDC dies, shot sleeves,
            and thermal management accessories.
          </p>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={styles.linkChip}
              >
                {product.name} <ChevronRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal Links ── */}
      <section className={styles.sectionAlt} aria-labelledby="explore-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Explore Further</p>
          <h2 className={styles.sectionHeading} id="explore-heading">Learn More About Our Process</h2>
          <div className={styles.linkStrip}>
            <Link href="/quality" className={styles.linkChip}>
              <ShieldCheck size={14} aria-hidden="true" /> Quality Assurance
            </Link>
            <Link href="/manufacturing-process" className={styles.linkChip}>
              <Cpu size={14} aria-hidden="true" /> Manufacturing Process
            </Link>
            <Link href="/industries" className={styles.linkChip}>
              <Factory size={14} aria-hidden="true" /> Industries We Serve
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Discuss Your Tooling Requirements</h2>
          <p className={styles.ctaBannerDesc}>
            Whether you need a single replacement core pin or a complete die casting tooling set,
            share your drawing or specification and we will respond with a detailed, honest assessment.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton
              href="/#contact"
              variant="white"
              size="lg"
              icon={<MessageSquare size={18} />}
              iconPosition="left"
            >
              Get in Touch
            </LinkButton>
            <LinkButton
              href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf"
              variant="outline"
              size="lg"
              icon={<Download size={18} />}
              iconPosition="left"
              className="border-white text-white"
            >
              Download Catalogue
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
