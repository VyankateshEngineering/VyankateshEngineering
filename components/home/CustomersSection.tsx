'use client';

import { useState, useEffect } from 'react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/common/ScrollReveal';
import LogoSlider from '@/components/common/LogoSlider';
import { Loader2 } from 'lucide-react';
import styles from './CustomersSection.module.css';

interface CustomerLogo {
  id: string;
  name: string;
  logoUrl: string;
  isVisible: boolean;
}

export default function CustomersSection() {
  const [logos, setLogos] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          const visibleLogos = data.customers
            .filter((c: CustomerLogo) => c.isVisible)
            .map((c: CustomerLogo) => ({ name: c.name, url: c.logoUrl }));
          setLogos(visibleLogos);
        }
      } catch (error) {
        console.error('Failed to fetch customers', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  // Remove the early return so the section id remains available for navbar scrolling
  // if (!loading && logos.length === 0) {
  //   return null; 
  // }
  return (
    <section className={`section ${styles.section}`} id="customers">
      <div className="container">
        <ScrollReveal>
          <SectionTitle
            label="Valued Customers"
            title="Trusted By Industry Leaders"
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2} className={styles.sliderWrap}>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : logos.length > 0 ? (
            <LogoSlider logos={logos} speed="normal" />
          ) : (
            <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-300 rounded-lg">
              Customer logos coming soon. Add logo files to the <code>public/customers/</code> folder.
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
