'use client';

import Image from 'next/image';
import { ArrowRight, Wrench, Microscope, Factory, Cog } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal, { StaggerReveal, StaggerChild } from '@/components/common/ScrollReveal';
import { LinkButton } from '@/components/ui/Button';
import styles from './FacilitiesSection.module.css';

const FACILITIES = [
  {
    title: 'CNC Machining Centers',
    desc: 'High-precision multi-axis CNC machines for complex geometries and tight tolerances.',
    icon: <Cog size={32} strokeWidth={1.5} />,
    image: '/facilities/cnc-machining.png'
  },
  {
    title: 'VMC Machining',
    desc: 'Advanced Vertical Machining and Electrical Discharge Machining for die sinking.',
    icon: <Factory size={32} strokeWidth={1.5} />,
    image: '/facilities/vmc-machining.jpg'
  },
  {
    title: 'Laser Engraving',
    desc: 'Precision laser engraving for part specification and brand name marking.',
    icon: <Microscope size={32} strokeWidth={1.5} />,
    image: '/facilities/laser-engraving-new.jpg'
  },
  {
    title: 'Dedicated Tool Room',
    desc: 'Fully equipped in-house tool room for rapid prototyping and maintenance.',
    icon: <Wrench size={32} strokeWidth={1.5} />,
    image: '/facilities/tool-room-new.jpg'
  }
];


export default function FacilitiesSection() {
  return (
    <section className={`section ${styles.section}`} id="facilities">
      <div className="container">
        <div className={styles.header}>
          <ScrollReveal>
            <SectionTitle
              label="Infrastructure"
              title="State-of-the-Art Manufacturing Facilities"
              subtitle="A robust, fully integrated manufacturing setup equipped with advanced VMC, CNC, and precision inspection tools to reliably handle complex tooling requirements."
            />
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <LinkButton href="#contact" variant="outline" icon={<ArrowRight size={18} />} iconPosition="right" className={styles.headerBtn}>
              Inquire About Equipment
            </LinkButton>
          </ScrollReveal>
        </div>

        <StaggerReveal stagger={0.1} className={styles.grid}>
          {FACILITIES.map((fac, i) => (
            <StaggerChild key={i}>
              <div className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image src={fac.image} alt={fac.title} fill className={styles.image} />
                  <div className={styles.overlay} />
                  <div className={styles.iconWrap}>{fac.icon}</div>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{fac.title}</h3>
                  <p className={styles.desc}>{fac.desc}</p>
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
