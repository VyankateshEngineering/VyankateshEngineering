'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, Download, MessageSquare, ZoomIn, CheckCircle2, Factory, Tag, Layers } from 'lucide-react';
import { Product } from '@/data/products';
import styles from './product.module.css';

// ---------- Gallery sub-component ----------
export function ProductGallery({ images, productName }: { images: Product['images']; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAllThumbs, setShowAllThumbs] = useState(false);

  const src = images[activeIndex]?.url || '/placeholder.png';
  const altText = images[activeIndex]?.alt || productName;
  const INITIAL_VISIBLE = 8;
  const hasMore = images.length > INITIAL_VISIBLE;
  const visibleThumbs = showAllThumbs ? images : images.slice(0, INITIAL_VISIBLE);

  return (
    <>
      {/* Main image */}
      <div className={styles.galleryMain} onClick={() => setLightbox(activeIndex)}>
        <Image
          src={src}
          alt={altText}
          fill
          priority
          fetchPriority="high"
          decoding="async"
          style={{ objectFit: 'contain', padding: '2rem' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={85}
        />
        <div className={styles.zoomHint}>
          <ZoomIn size={12} /> Click to zoom
        </div>
      </div>

      {/* Thumbnails — first 8 visible, View all reveals remaining (no layout shift, fast lazy-load) */}
      {images.length > 1 && (
        <>
          <div className={styles.galleryThumbs}>
            {visibleThumbs.map((img, i) => {
              // i is original index when showAll is false (0-7) and true (0..n), so active check works directly
              const originalIndex = showAllThumbs ? i : i;
              // When collapsed, i maps 1:1 to originalIndex 0-7, so simple equality holds
              return (
                <button
                  key={`${img.url}-${i}`}
                  className={`${styles.galleryThumb} ${i === activeIndex ? styles.galleryThumbActive : ''}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${productName} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 15vw"
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                    quality={75}
                  />
                </button>
              );
            })}
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAllThumbs(v => !v)}
              aria-expanded={showAllThumbs}
              style={{
                marginTop: 'var(--space-3)',
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--neutral-200)',
                background: showAllThumbs ? 'var(--neutral-900)' : 'var(--neutral-0)',
                color: showAllThumbs ? 'white' : 'var(--neutral-700)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {showAllThumbs ? `Show less` : `View all ${images.length} images`}
            </button>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Close lightbox">✕</button>

          {images.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={e => { e.stopPropagation(); setLightbox(l => l !== null ? (l - 1 + images.length) % images.length : 0); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={e => { e.stopPropagation(); setLightbox(l => l !== null ? (l + 1) % images.length : 0); }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className={styles.lightboxImageWrap} onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightbox]?.url || ''}
              alt={images[lightbox]?.alt || productName}
              fill
              className={styles.lightboxImage}
              sizes="90vw"
            />
          </div>

          {images.length > 1 && (
            <div className={styles.lightboxCounter}>{lightbox + 1} / {images.length}</div>
          )}
        </div>
      )}
    </>
  );
}

// ---------- FAQ accordion sub-component ----------
export function FaqAccordion({ faqs }: { faqs: NonNullable<Product['faqs']> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.faqList} role="list">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={styles.faqItem} role="listitem">
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={20}
                className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className={styles.faqAnswer}>
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
