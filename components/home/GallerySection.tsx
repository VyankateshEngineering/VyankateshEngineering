'use client';

import { useState } from 'react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/common/ScrollReveal';
import ImageGallery, { GalleryImage } from '@/components/common/ImageGallery';
import { LinkButton } from '@/components/ui/Button';
import { ArrowRight, Loader2 } from 'lucide-react';
import styles from './GallerySection.module.css';
import { galleryItems } from '@/data/gallery';

export default function GallerySection() {
  const images = galleryItems as GalleryImage[];
  const categories = Array.from(new Set(images.map((img: GalleryImage) => img.category).filter(Boolean))) as string[];
  const loading = false;

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className={styles.header}>
          <ScrollReveal>
            <SectionTitle
              label="Parts Gallery"
              title="Our Engineering Portfolio"
              subtitle="Explore a selection of our precisely manufactured dies, pins, and custom inserts."
              align="center"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2} className={styles.galleryWrap}>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : images.length > 0 ? (
            <ImageGallery images={images} categories={categories} />
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>No gallery images available at the moment.</p>
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal delay={0.4} className={styles.footer}>
          <LinkButton href="#contact" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
            Request a Quote
          </LinkButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
