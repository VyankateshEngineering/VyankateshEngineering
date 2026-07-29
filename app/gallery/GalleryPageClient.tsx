'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '@/data/gallery';

interface Props {
  items: GalleryItem[];
  categories: string[];
}

export default function GalleryPageClient({ items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setLightbox(l => l !== null ? (l - 1 + filtered.length) % filtered.length : 0); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setLightbox(l => l !== null ? (l + 1) % filtered.length : 0); };

  return (
    <>
      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-8)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: 'var(--space-2) var(--space-5)',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === cat ? '2px solid var(--primary-500)' : '1px solid var(--neutral-200)',
              background: activeCategory === cat ? 'var(--primary-500)' : 'var(--neutral-0)',
              color: activeCategory === cat ? 'white' : 'var(--neutral-700)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {cat} {cat === 'All' ? `(${items.length})` : `(${items.filter(i => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {filtered.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
            aria-label={`View ${item.alt} in full size`}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              cursor: 'zoom-in',
              background: 'var(--neutral-100)',
              border: '1px solid var(--neutral-200)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              padding: 'var(--space-4)',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
              className="gallery-overlay"
            >
              <span style={{ color: 'white', fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1.3 }}>{item.caption}</span>
              <ZoomIn size={20} color="white" />
            </div>
            {/* Category badge */}
            <span style={{
              position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)',
              background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.9)',
              fontSize: 'var(--text-xs)', fontWeight: 600,
              padding: '2px 10px', borderRadius: 'var(--radius-full)',
            }}>
              {item.category}
            </span>
          </div>
        ))}
      </div>

      <style>{`.gallery-overlay { opacity: 0; } [role="button"]:hover .gallery-overlay, [role="button"]:focus .gallery-overlay { opacity: 1; }`}</style>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing: ${filtered[lightbox]?.alt}`}
        >
          <button
            onClick={closeLightbox}
            aria-label="Close"
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', width: 44, height: 44, borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
          {filtered.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={next} aria-label="Next" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div
            style={{ position: 'relative', width: '90vw', height: '80vh', maxWidth: 1200 }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox]?.url || ''}
              alt={filtered[lightbox]?.alt || ''}
              fill
              style={{ objectFit: 'contain' }}
              sizes="90vw"
              priority
            />
          </div>
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.1)', color: 'white',
            padding: '6px 18px', borderRadius: 999, fontSize: 14,
            textAlign: 'center',
          }}>
            {filtered[lightbox]?.caption} &nbsp;·&nbsp; {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
