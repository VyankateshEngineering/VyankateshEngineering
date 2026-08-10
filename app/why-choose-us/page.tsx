import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, FileCode, CheckSquare, Factory, ThermometerSnowflake, Wrench, ShieldCheck, Download, MessageSquare, ArrowRight } from 'lucide-react';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import styles from '../(authority)/authority.module.css';

let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
const baseUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);

export const metadata: Metadata = {
  title: 'Why Choose Vyankatesh Engineering | Precision Tooling Manufacturer India',
  description: 'Specialist manufacturer of die casting tooling. We offer custom manufacturing, 100% inspection, vacuum hardening, and full traceability.',
  alternates: { canonical: `${baseUrl}/why-choose-us` },
  openGraph: {
    title: 'Why Choose Vyankatesh Engineering',
    description: 'We are a specialist manufacturer of die casting tooling, offering unmatched precision and strictly managed capability.',
    url: `${baseUrl}/why-choose-us`,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Why Choose Vyankatesh Engineering' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Choose Vyankatesh Engineering',
    description: 'We are a specialist manufacturer of die casting tooling, offering unmatched precision and strictly managed capability.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Why Choose Us', item: `${baseUrl}/why-choose-us` },
  ],
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Why Choose Us | Vyankatesh Engineering',
  description: 'Reasons to choose our precision die casting tooling.',
  publisher: { '@id': `${baseUrl}/#organization` },
};

export default function WhyChooseUsPage() {
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
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Why Choose Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>The Vyankatesh Difference</p>
          <h1 className={styles.heroTitle}>Your Tooling Partner for <span>Precision Performance</span></h1>
          <p className={styles.heroSubtitle}>
            We are not a general machine shop. We are a specialist manufacturer of die casting tooling. Our entire facility, equipment, and inspection processes are optimised specifically for core pins, inserts, and dies. This specialisation is why our products consistently outperform generic alternatives.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>Specialist Manufacturer</span>
            <span className={styles.heroBadge}>100% Inspection</span>
            <span className={styles.heroBadge}>No Standard Sizes</span>
            <span className={styles.heroBadge}>Custom To Drawing</span>
          </div>
        </div>
      </header>

      {/* Comparison Table */}
      <section className={styles.section} aria-labelledby="compare-heading">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <p className={styles.sectionLabel}>Industry Comparison</p>
          <h2 className={styles.sectionHeading} id="compare-heading">How We Compare</h2>
          
          <div style={{ overflowX: 'auto', marginTop: 'var(--space-8)' }}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Feature</th>
                  <th style={{ width: '37.5%' }}>Vyankatesh Engineering</th>
                  <th style={{ width: '37.5%' }}>Generic Supplier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Material Specification</td>
                  <td className={styles.positive}>Certified DIN 1.2344 / AISI H-13 (mill cert available)</td>
                  <td className={styles.negative}>Often unspecified or lower grade</td>
                </tr>
                <tr>
                  <td>Heat Treatment</td>
                  <td className={styles.positive}>Vacuum hardening with controlled gas quench, parameters recorded</td>
                  <td className={styles.negative}>Open furnace, parameters often not recorded</td>
                </tr>
                <tr>
                  <td>Hardness Verification</td>
                  <td className={styles.positive}>100% Rockwell hardness tested per batch (44-48 HRC)</td>
                  <td className={styles.negative}>Typically not performed or only spot checked</td>
                </tr>
                <tr>
                  <td>Dimensional Inspection</td>
                  <td className={styles.positive}>100% CMM/gauge inspection on every single component, recorded</td>
                  <td className={styles.negative}>Sampling or visual inspection only</td>
                </tr>
                <tr>
                  <td>Surface Treatment</td>
                  <td className={styles.positive}>Gas nitriding (depth verified) / PVD coating</td>
                  <td className={styles.negative}>Nitriding often not offered or uncontrolled</td>
                </tr>
                <tr>
                  <td>Traceability</td>
                  <td className={styles.positive}>Full batch and material traceability, laser engraved</td>
                  <td className={styles.negative}>Typically none</td>
                </tr>
                <tr>
                  <td>Customisation</td>
                  <td className={styles.positive}>Fully custom to drawing — any dimension</td>
                  <td className={styles.negative}>Limited to standard catalogue sizes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Our Approach Cards */}
      <section className={styles.sectionAlt} aria-labelledby="approach-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Process</p>
          <h2 className={styles.sectionHeading} id="approach-heading">The Vyankatesh Approach</h2>
          
          <div className={styles.cardsGrid} style={{ marginTop: 'var(--space-10)' }}>
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><FileCode size={28} /></div>
              <h3 className={styles.cardTitle}>Custom to Your Drawing</h3>
              <p className={styles.cardBody}>Every component is manufactured to the customer&apos;s specific drawing, CAD file, or physical sample. We do not impose standard sizes or configurations.</p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Factory size={28} /></div>
              <h3 className={styles.cardTitle}>In-House Material Procurement</h3>
              <p className={styles.cardBody}>We source premium DIN 1.2344 / H-13 billet. All raw materials are selected to guarantee precision shape, size, and long-lasting quality for critical applications.</p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><ThermometerSnowflake size={28} /></div>
              <h3 className={styles.cardTitle}>Certified Heat Treatment</h3>
              <p className={styles.cardBody}>Partnered with certified vacuum hardening experts. All processes are fully documented, with gas quench and double/triple tempering.</p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><CheckSquare size={28} /></div>
              <h3 className={styles.cardTitle}>100% Dimensional Inspection</h3>
              <p className={styles.cardBody}>Not sampling inspection — every single component is individually measured and recorded against the drawing tolerance.</p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><Wrench size={28} /></div>
              <h3 className={styles.cardTitle}>Engineering Consultation</h3>
              <p className={styles.cardBody}>For complex applications (deep hole boring, multi-function pins, loose-piece inserts), we provide design review input before manufacture.</p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon} aria-hidden="true"><ShieldCheck size={28} /></div>
              <h3 className={styles.cardTitle}>Fast Replacements</h3>
              <p className={styles.cardBody}>Dedicated in-house machining capacity means we can prioritise urgent replacement components to minimise your machine downtime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className={styles.section} aria-labelledby="steps-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Working With Us</p>
          <h2 className={styles.sectionHeading} id="steps-heading">How to Order</h2>
          <p className={styles.sectionBody} style={{ marginBottom: 'var(--space-10)' }}>
            We make ordering custom precision tooling straightforward. Since we manufacture entirely to drawing, the process begins with your specification.
          </p>
          
          <div className={styles.processGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {[
              { title: '1. Enquiry', desc: 'Send drawing, sample, or specification by email.' },
              { title: '2. Review', desc: 'Engineering review for feasibility and material selection.' },
              { title: '3. Quote', desc: 'Competitive pricing with confirmed lead time.' },
              { title: '4. Manufacture', desc: 'Precision in-house machining and certified thermal processing.' },
              { title: '5. Inspection', desc: '100% pre-dispatch dimensional and quality inspection.' },
              { title: '6. Dispatch', desc: 'Secure packaging with full dispatch records.' }
            ].map((step, i) => (
              <div key={i} className={styles.processStep}>
                <div className={styles.processNum}>{i + 1}</div>
                <h3 className={styles.processStepTitle} style={{ fontSize: '15px' }}>{step.title}</h3>
                <p className={styles.processStepDesc} style={{ fontSize: '13px', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Ready to Work with a Specialist?</h2>
          <p className={styles.ctaBannerDesc}>
            Send us your drawing or specification for a comprehensive quote and lead time estimation.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              <MessageSquare size={18} /> Contact Sales
            </LinkButton>
            <a href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" download className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Download Catalogue
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
