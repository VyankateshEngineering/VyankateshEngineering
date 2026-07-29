import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ClipboardList,
  Microscope,
  Gauge,
  Hammer,
  FileCheck2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import styles from '../(authority)/authority.module.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com';
const pageUrl = `${baseUrl}/quality`;

export const metadata: Metadata = {
  title: 'Quality Assurance | 100% Inspection | Vyankatesh Engineering',
  description:
    'Quality at Vyankatesh Engineering is built into every manufacturing stage — not just final inspection. Every component undergoes raw material verification, in-process dimensional control, heat treatment validation, post-grind inspection, surface treatment verification, and 100% pre-dispatch check.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Quality Assurance | 100% Inspection Process | Vyankatesh Engineering',
    description:
      'Our 6-stage quality process covers raw material certification, CNC in-process gauging, Rockwell hardness testing, CMM dimensional inspection, and 100% pre-dispatch verification on every die casting tooling component.',
    url: pageUrl,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vyankatesh Engineering — Quality Assurance' }],
  },
};

// ── Structured Data ──────────────────────────────────────────────────────────

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Quality Assurance', item: pageUrl },
  ],
};

const qualityPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': pageUrl,
  name: 'Quality Assurance | Vyankatesh Engineering',
  description:
    'Documentation of the 6-stage quality inspection and verification process applied to every precision die casting tooling component manufactured by Vyankatesh Engineering.',
  url: pageUrl,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Quality Assurance', item: pageUrl },
    ],
  },
  about: {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Vyankatesh Engineering',
  },
};

// ── Page Data ────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    num: 1,
    title: 'Raw Material Verification',
    desc: 'All stock begins with certified DIN 1.2344 / AISI H-13 hot-work tool steel billet from approved mills. Each incoming batch is verified against the material test certificate (mill cert) for chemical composition and mechanical properties before it enters production.',
  },
  {
    num: 2,
    title: 'In-Process Dimensional Control',
    desc: 'CNC turning and milling programs are verified before each batch run. During machining, in-process gauging confirms that critical dimensions are tracking to drawing tolerance, allowing correction before the component reaches final size.',
  },
  {
    num: 3,
    title: 'Heat Treatment Verification',
    desc: 'Every batch returned from our certified vacuum hardening partners is accompanied by a documented cycle record — temperature profile, soak time, and gas quench parameters. We then rigorously verify the Rockwell hardness on every batch to confirm the specified 44–48 HRC range has been achieved.',
  },
  {
    num: 4,
    title: 'Post-Grind Dimensional Inspection',
    desc: 'After precision grinding — the final sizing operation — every component is dimensionally inspected to drawing tolerance using CMM or precision gauges as appropriate to the geometry. Surface finish is verified against the specified Ra value.',
  },
  {
    num: 5,
    title: 'Surface Treatment Verification',
    desc: 'After gas nitriding, case depth and surface hardness are verified on each batch using microhardness testing and, where specified, taper-section metallographic checks. For components with PVD hard coating, adhesion is verified before dispatch.',
  },
  {
    num: 6,
    title: 'Final Pre-Dispatch Inspection',
    desc: '100% of components are re-checked dimensionally before packing. Hardness is spot-verified. Each component undergoes visual inspection for surface condition and marking. A dispatch record is generated with dimensional and hardness data, providing full traceability with the shipment.',
  },
];

const INSPECTION_METHODS = [
  {
    icon: <Gauge size={26} strokeWidth={1.75} />,
    title: 'Precision Blue Matching on VMC',
    body: 'Prussian blue (engineer\'s blue) is applied to mating surfaces — parting faces, insert seats, and die register surfaces — and the components are brought together on the VMC. The contact pattern reveals high spots, gaps, and angular errors in the mating geometry that dimensional measurement alone cannot detect. This technique is used on all GDC and LPDC die parting faces and on critical insert mating faces to eliminate flash and ensure complete contact over the specified area.',
  },
  {
    icon: <Microscope size={26} strokeWidth={1.75} />,
    title: 'CMM & Precision Gauge Measurement',
    body: 'Critical dimensional characteristics — cavity profiles, bore diameters, mating face geometry, positional tolerances — are verified using Coordinate Measuring Machine (CMM) measurement or calibrated precision gauges (plug gauges, ring gauges, precision bore gauges) depending on the feature type and tolerance requirement. CMM is used for complex geometries and true position verifications. Precision gauges are used for high-volume pin diameter and bore checks where speed and reliability of measurement are both required.',
  },
  {
    icon: <Hammer size={26} strokeWidth={1.75} />,
    title: 'Rockwell Hardness Testing',
    body: 'Hardness testing using the Rockwell C scale (HRC) is performed on every heat treatment batch — not on a sample basis. After parts return from our certified vacuum hardening and tempering partners, a test piece from each batch is Rockwell-tested to verify that the specified hardness (typically 44–48 HRC for H-13 die steel) has been achieved uniformly. Where Rockwell B scale is more appropriate for the material condition, it is applied accordingly. Results are recorded and retained with the batch documentation.',
  },
];

// What We Inspect
const INSPECT_CORE_PINS = [
  'Outer diameter — full length, including any stepped sections',
  'Overall length and shoulder / flange dimensions',
  'Straightness — verified to ≤ 0.01 mm per 100 mm',
  'Internal bore concentricity (jet cool pins)',
  'Rockwell hardness — every heat treatment batch',
  'Surface finish — Ra verified to specification',
];

const INSPECT_INSERTS = [
  'Profile accuracy — all cavity surfaces to drawing',
  'Mating faces — flatness and fit by blue matching',
  'Cavity dimensions — depth, width, corner radii',
  'Positional accuracy — locating features and dowel holes',
  'Rockwell hardness — every batch',
  'Surface finish on cavity and parting faces',
];

const INSPECT_DIES = [
  'Parting line flatness — blue matched across full contact area',
  'Cavity dimensions — all features per die drawing',
  'Runner and gate geometry',
  'Cooling circuit continuity and pressure integrity',
  'Ejector pin hole dimensions and fit',
  'Overall die register dimensions and guide pillar fit',
];

const INSPECT_SHOT_SLEEVES = [
  'Bore diameter — full length, at multiple planes',
  'Bore roundness and cylindricity',
  'Bore straightness',
  'Internal surface finish — Ra ≤ 0.4 μm',
  'Rockwell hardness — bore and OD surfaces',
  'Pour hole geometry and external seating dimensions',
];

// ── Page Component ───────────────────────────────────────────────────────────

export default function QualityPage() {
  return (
    <>
      <StructuredData data={[breadcrumbSchema, qualityPageSchema]} />

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>Quality Assurance</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>Quality Assurance</p>
          <h1 className={styles.heroTitle}>
            Quality Is Not An Option.<br />
            <span>It Is Our Process.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Every precision die casting tooling component manufactured by Vyankatesh Engineering passes
            through a documented 6-stage inspection sequence — from raw material certification to
            100% pre-dispatch dimensional re-check. Not a sample. Every single component.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}><ShieldCheck size={14} aria-hidden="true" /> 100% Pre-Dispatch Inspection</span>
            <span className={styles.heroBadge}><ClipboardList size={14} aria-hidden="true" /> Full Dimensional Records</span>
            <span className={styles.heroBadge}><Gauge size={14} aria-hidden="true" /> Rockwell Hardness — Every Batch</span>
            <span className={styles.heroBadge}><FileCheck2 size={14} aria-hidden="true" /> Material Traceability</span>
          </div>
        </div>
      </header>

      {/* ── Quality Philosophy ── */}
      <section className={styles.section} aria-labelledby="philosophy-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Approach</p>
          <h2 className={styles.sectionHeading} id="philosophy-heading">
            Quality Built Into the Process, Not Added At the End
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
                In precision die casting tooling, a component that leaves the factory out of tolerance is
                a component that causes problems in the field — flash, misfire, premature failure, or a
                die that cannot close cleanly. Fixing quality failures after the fact is expensive and
                damages the production schedules of customers who rely on our components. That is why our
                quality assurance approach integrates inspection at every stage of manufacturing, not just
                at the end.
              </p>
              <p className={styles.sectionBody} style={{ maxWidth: 'none' }}>
                From the point at which raw material enters our facility through to the moment a component
                is packed for dispatch, there are defined verification gates where dimensions, hardness,
                surface condition, and material identity are checked and recorded. 100% of components are
                individually inspected — not sampled. Dimensional records, hardness data, and material
                certificates are retained for every order, providing full traceability from finished
                component back to certified raw material.
              </p>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--neutral-100)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Image 
                src="/gallery/side-core-holder.jpeg"
                alt="Precision Inspection and Quality Assurance"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Inspection Process Steps ── */}
      <section className={styles.sectionAlt} aria-labelledby="process-heading">
        <div className="container">
          <p className={styles.sectionLabel}>How We Inspect</p>
          <h2 className={styles.sectionHeading} id="process-heading">
            Our 6-Stage Quality Process
          </h2>
          <p className={styles.sectionBody}>
            Every component at Vyankatesh Engineering passes through these six verification stages.
            Each stage is documented and the records are maintained with the order.
          </p>
          <div className={styles.processGrid} style={{ marginTop: 'var(--space-12)' }} role="list">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className={styles.processStep} role="listitem">
                <div className={styles.processNum} aria-label={`Step ${step.num}`}>
                  {step.num}
                </div>
                <div className={styles.processStepTitle}>{step.title}</div>
                <p className={styles.processStepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inspection Methods ── */}
      <section className={styles.section} aria-labelledby="methods-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Inspection Techniques</p>
          <h2 className={styles.sectionHeading} id="methods-heading">
            How We Measure and Verify
          </h2>
          <div className={styles.cardsGrid}>
            {INSPECTION_METHODS.map((method) => (
              <div key={method.title} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {method.icon}
                </div>
                <h3 className={styles.cardTitle}>{method.title}</h3>
                <p className={styles.cardBody}>{method.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Inspect ── */}
      <section className={styles.sectionAlt} aria-labelledby="what-inspect-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Inspection Scope</p>
          <h2 className={styles.sectionHeading} id="what-inspect-heading">
            What We Inspect — By Product Type
          </h2>
          <p className={styles.sectionBody}>
            Inspection criteria are defined per product type based on the functional requirements
            of the component in a die casting application. Below is a summary of the key characteristics
            verified on each major product group.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-8)',
              marginTop: 'var(--space-10)',
            }}
          >
            {/* Core Pins */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--neutral-900)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--primary-500)' }}>
                Core Pins &amp; Jet Cool Pins
              </h3>
              <ul className={styles.checklist} aria-label="Core pin inspection criteria">
                {INSPECT_CORE_PINS.map((item) => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inserts */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--neutral-900)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--primary-500)' }}>
                Profile &amp; HPDC Inserts
              </h3>
              <ul className={styles.checklist} aria-label="Insert inspection criteria">
                {INSPECT_INSERTS.map((item) => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dies */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--neutral-900)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--primary-500)' }}>
                GDC &amp; LPDC Dies
              </h3>
              <ul className={styles.checklist} aria-label="Die inspection criteria">
                {INSPECT_DIES.map((item) => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shot Sleeves */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--neutral-900)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--primary-500)' }}>
                Shot Sleeves
              </h3>
              <ul className={styles.checklist} aria-label="Shot sleeve inspection criteria">
                {INSPECT_SHOT_SLEEVES.map((item) => (
                  <li key={item} className={styles.checkItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark Callout: Traceability ── */}
      <section className={styles.section} aria-labelledby="traceability-heading">
        <div className="container">
          <div className={styles.darkCallout}>
            <div className={styles.darkCalloutIcon} aria-hidden="true">
              <FileCheck2 size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className={styles.darkCalloutTitle} id="traceability-heading">
                Every Component Ships With Full Dimensional Records
              </h2>
              <p className={styles.darkCalloutBody}>
                When you receive a component from Vyankatesh Engineering, it comes with a dispatch
                record that documents the dimensional and hardness data from final inspection. This
                is not a system certificate — it is actual measured data on the specific component in
                the box. We retain copies of these records and can reproduce them on request. For
                customers with incoming inspection requirements or quality system obligations, this
                documentation eliminates re-measurement overhead and provides a traceable basis for
                any field issue investigation.
              </p>
              <ul className={styles.darkCalloutList}>
                <li>Dimensional measurement results — key characteristics per drawing</li>
                <li>Rockwell hardness result — furnace batch reference</li>
                <li>Precision shape and size verification</li>
                <li>Dispatch date and order reference — full audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internal Links ── */}
      <section className={styles.sectionAlt} aria-labelledby="explore-quality-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Related Pages</p>
          <h2 className={styles.sectionHeading} id="explore-quality-heading">
            Explore Our Products &amp; Process
          </h2>
          <div className={styles.linkStrip}>
            <Link href="/about" className={styles.linkChip}>
              <ShieldCheck size={14} aria-hidden="true" /> About Vyankatesh Engineering
            </Link>
            <Link href="/manufacturing-process" className={styles.linkChip}>
              <ArrowRight size={14} aria-hidden="true" /> Manufacturing Process
            </Link>
            <Link href="/categories/pins" className={styles.linkChip}>
              <ArrowRight size={14} aria-hidden="true" /> Core Pins &amp; Jet Cool Pins
            </Link>
            <Link href="/categories/inserts" className={styles.linkChip}>
              <ArrowRight size={14} aria-hidden="true" /> Profile &amp; HPDC Inserts
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaBannerTitle}>Request a Quote with Guaranteed Quality</h2>
          <p className={styles.ctaBannerDesc}>
            Every component we manufacture is backed by a documented inspection record. Share your
            drawing or specification and we will confirm compliance with your quality requirements
            before production begins.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton
              href="/#contact"
              variant="white"
              size="lg"
              icon={<MessageSquare size={18} />}
              iconPosition="left"
            >
              Request a Quote
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
