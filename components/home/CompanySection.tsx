'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import ScrollReveal, { StaggerReveal, StaggerChild } from '@/components/common/ScrollReveal';
import { LinkButton } from '@/components/ui/Button';
import styles from './CompanySection.module.css';

const STATS = [
  { value: 20, suffix: '+', label: 'Years Experience', description: 'In precision tooling & dies' },
  { value: 50, suffix: 'k+', label: 'Components', description: 'Manufactured successfully' },
  { value: 20, suffix: '+', label: 'Customers Served', description: 'Across global industries' },
  { value: 100, suffix: '%', label: 'In-House Capacity', description: 'End-to-end manufacturing' },
];

const VALUE_PROPS = [
  'Decreased breakdown time via premium materials, controlled heat treatment & nitriding.',
  'Lower maintenance costs through engineered high erosion resistance.',
  "Increased casting repeatability via precise dimensional accuracy of core pins & DIE's.",
  'Exceptional value for money without compromising on premium industrial quality.',
];

export default function CompanySection() {
  return (
    <section className="section" id="company">
      <div className="container">
        <div className={styles.grid}>
          {/* ── Left Content ── */}
          <div className={styles.content}>
            <ScrollReveal direction="right">
              <SectionTitle
                label="About Our Company"
                title="Engineering Excellence & Precision Manufacturing"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2} direction="right">
              <div className={styles.textContent}>
                <p className="body-lg">
                  <strong>Vyankatesh Engineering</strong> specializes in the manufacturing of high-tolerance industrial tooling, dies, and critical engineering components. Built on decades of metallurgical and machining expertise, we deliver uncompromising precision for the most demanding global sectors.
                </p>
                <p>
                  Our manufacturing infrastructure is designed for absolute dimensional accuracy and scalability. From complex automotive core pins to heavy-duty gravity die casting inserts, we maintain exact specifications down to the micron.
                </p>
                <p>
                  Quality assurance is integrated at every stage of production. We enforce rigorous metrology protocols—including precision blue matching on VMCs and comprehensive 100% manual inspection—ensuring all components meet exact heat treatment, nitriding, and surface coating certifications.
                </p>
              </div>
            </ScrollReveal>

            <StaggerReveal stagger={0.15} delay={0.3} className={styles.expertiseList}>
              {VALUE_PROPS.map((item, i) => (
                <StaggerChild key={i}>
                  <div className={styles.expertiseItem}>
                    <CheckCircle2 size={20} className="text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                </StaggerChild>
              ))}
            </StaggerReveal>

            <ScrollReveal delay={0.5} direction="right">
              <LinkButton href="#contact" icon={<ArrowRight size={18} />} iconPosition="right" className={styles.cta}>
                Get in Touch
              </LinkButton>
            </ScrollReveal>
          </div>

          {/* ── Right Images ── */}
          <div className={styles.imageGallery}>
            <ScrollReveal delay={0.2} direction="left" className={styles.mainImageWrap}>
              <Image
                src="/company/main.png"
                alt="Precision Engineering Facility"
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.4} direction="up" className={styles.subImageWrap}>
              <div className={styles.subImageInner}>
                <Image
                  src="/company/sub.png"
                  alt="Tooling Components"
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.expNumber}>20+</span>
                <span className={styles.expText}>Years of<br/>Excellence</span>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Stats Counter ── */}
        <div className={styles.statsWrapper}>
          <AnimatedCounter stats={STATS} />
        </div>
      </div>
    </section>
  );
}
