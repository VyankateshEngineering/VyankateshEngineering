'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/common/ScrollReveal';
import styles from './CapabilitiesSection.module.css';

export default function CapabilitiesSection() {
  return (
    <section className="section" id="capabilities" style={{ backgroundColor: 'var(--neutral-50)' }}>
      <div className="container">
        <div className={styles.header}>
          <ScrollReveal>
            <SectionTitle
              label="Our Capabilities"
              title="Manufacturing Capabilities"
              subtitle="Specialized precision engineering services for complex industrial requirements."
              align="center"
            />
          </ScrollReveal>
        </div>

        <div className={styles.grid}>
          {/* Card 1: VMC Manufacturing */}
          <ScrollReveal delay={0.2} direction="up">
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>VMC Manufacturing</h3>
              
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>All types aluminium proto.</span>
                </li>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>All type aluminium die casting insert.</span>
                </li>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>All type profile core pin.</span>
                </li>
              </ul>

              <div className={styles.imagesGrid}>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/gallery/Gdc Die Block.png" 
                    alt="GDC Die Block" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/gallery/Gdc Die.png" 
                    alt="GDC Die" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/gallery/Curve insert outside.png" 
                    alt="Curve Insert" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Core Pin and Cavity MFG */}
          <ScrollReveal delay={0.4} direction="up">
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Die Casting Core Pin & Cavity MFG</h3>
              
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>All types core pin&apos;s with PVD coating.</span>
                </li>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>All type sleeve.</span>
                </li>
                <li className={styles.listItem}>
                  <CheckCircle2 size={18} className={styles.icon} />
                  <span>Sprue bush.</span>
                </li>
              </ul>

              <div className={styles.imagesGrid}>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/products/Core pin set.png" 
                    alt="Core Pin Set" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/products/Shot sleeve.png" 
                    alt="Shot Sleeve" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.imageWrap}>
                  <Image 
                    src="/products/Sprue Bush.png" 
                    alt="Sprue Bush" 
                    fill 
                    className={styles.image} 
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Full Scans / Brochures */}
        <ScrollReveal delay={0.6} direction="up">
          <div className={styles.scansGrid}>
            <div className={styles.scanWrap}>
              <Image 
                src="/catalogue/scan-1.png" 
                alt="VMC Manufacturing Brochure Scan" 
                fill 
                className={styles.scanImage} 
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className={styles.scanWrap}>
              <Image 
                src="/catalogue/scan-2.png" 
                alt="Die Casting Core Pin Brochure Scan" 
                fill 
                className={styles.scanImage} 
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
