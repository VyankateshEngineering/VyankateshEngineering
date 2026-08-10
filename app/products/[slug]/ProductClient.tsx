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

  const src = images[activeIndex]?.url || '/placeholder.png';
  const altText = images[activeIndex]?.alt || productName;

  return (
    <>
      {/* Main image */}
      <div className={styles.galleryMain} onClick={() => setLightbox(activeIndex)}>
        <Image
          src={src}
          alt={altText}
          fill
          priority
          style={{ objectFit: 'contain', padding: '2rem' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className={styles.zoomHint}>
          <ZoomIn size={12} /> Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.galleryThumbs}>
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              className={`${styles.galleryThumb} ${i === activeIndex ? styles.galleryThumbActive : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="15vw"
                loading="lazy"
              />
            </button>
          ))}
        </div>
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
