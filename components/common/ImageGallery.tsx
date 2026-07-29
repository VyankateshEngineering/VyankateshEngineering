'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageGallery.module.css';

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string | null;
  category?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  categories?: string[];
}

export default function ImageGallery({ images, categories }: ImageGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const triggerRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const visibleImages = filtered.slice(0, visibleCount);

  // Reset count when category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

  const openLightbox = (index: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && e.currentTarget) {
      triggerRef.current = e.currentTarget as HTMLElement;
    } else {
      triggerRef.current = document.activeElement as HTMLElement;
    }
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((i) => (i! - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((i) => (i! + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    if (lightboxIndex !== null && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      
      if (e.key === 'Tab') {
        if (!lightboxRef.current) return;
        const focusableElements = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prev, next]);

  return (
    <div className={styles.wrapper}>
      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {visibleImages.map((img, index) => (
            <motion.div
              key={img.id}
              className={styles.imageCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => openLightbox(index, e)}
              tabIndex={0}
              role="button"
              aria-label={`View ${img.alt || 'image'}`}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index, e)}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  className={styles.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className={styles.imageOverlay}>
                  <ZoomIn size={24} className={styles.zoomIcon} />
                </div>
              </div>
              {img.caption && <p className={styles.caption}>{img.caption}</p>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-10)' }}>
        {visibleCount < filtered.length ? (
          <button 
            onClick={() => setVisibleCount(filtered.length)}
            className="btn btn-outline"
            style={{ minWidth: '200px' }}
          >
            Load All
          </button>
        ) : filtered.length > 12 ? (
          <button 
            onClick={() => {
              setVisibleCount(12);
              const section = document.getElementById('gallery');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn btn-outline"
            style={{ minWidth: '200px' }}
          >
            Show Less
          </button>
        ) : null}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            ref={lightboxRef}
            tabIndex={-1}
          >
            <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">
              <X size={24} />
            </button>
            <button className={`${styles.lightboxNav} ${styles.navPrev}`} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
              <ChevronLeft size={28} />
            </button>
            <motion.div
              className={styles.lightboxImage}
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].alt || ''}
                fill
                className={styles.lightboxImg}
                sizes="90vw"
                priority
              />
              {filtered[lightboxIndex].caption && (
                <div className={styles.lightboxCaption}>{filtered[lightboxIndex].caption}</div>
              )}
            </motion.div>
            <button className={`${styles.lightboxNav} ${styles.navNext}`} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
              <ChevronRight size={28} />
            </button>
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
