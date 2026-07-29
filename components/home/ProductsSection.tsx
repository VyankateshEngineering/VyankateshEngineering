'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MessageSquare, ArrowRight, Loader2, Play, Pause } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import ScrollReveal from '@/components/common/ScrollReveal';
import { LinkButton } from '@/components/ui/Button';
import styles from './ProductsSection.module.css';
import { products as allProductsData } from '@/data/products';

interface Category {
  slug: string;
  name: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  applications: string;
  specs: any;
  category: {
    name: string;
    slug: string;
  };
  images: { url: string }[];
}

export default function ProductsSection() {
  const [activeCat, setActiveCat] = useState('All');
  const products = allProductsData.filter(p => p.isPublished) as Product[];
  const categories = (() => {
    const map = new Map();
    for (const p of products) {
      if (p.category?.slug) {
        map.set(p.category.slug, { name: p.category.name, slug: p.category.slug });
      }
    }
    return Array.from(map.values()) as Category[];
  })();
  const loading = false;
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [lightboxState, setLightboxState] = useState<{ images: string[], index: number } | null>(null);

  const allCategories = ['All', ...categories.map(c => c.name)];

  const filtered = activeCat === 'All' 
    ? products 
    : products.filter(p => p.category?.name === activeCat);



  const toggleExpand = (id: string, type: 'desc' | 'apps') => {
    const key = `${id}-${type}`;
    setExpandedProducts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSpecsList = (specs: any) => {
    if (!specs) return [];
    if (Array.isArray(specs)) return specs;
    if (typeof specs === 'object') {
      return Object.entries(specs).map(([k, v]) => `${k}: ${v}`);
    }
    return [String(specs)];
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <>
      <section className="section" id="products">
      <div className="container">
        <div className={styles.header}>
          <ScrollReveal>
            <SectionTitle
              label="Our Catalog"
              title="Precision Engineered Products"
              subtitle="Browse our comprehensive range of high-performance tooling components."
            />
          </ScrollReveal>
          

        </div>

        {/* Category Filters */}
        <ScrollReveal delay={0.3} className={styles.filterWrap}>
          <div className={styles.filters}>
            {loading ? (
               <div className="flex gap-4 p-2"><Loader2 className="animate-spin text-neutral-400" size={24} /></div>
            ) : (
              allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`${styles.filterBtn} ${activeCat === cat ? styles.filterActive : ''}`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </ScrollReveal>

        {/* Product Slider */}
        <ScrollReveal delay={0.4}>
          <div className={styles.sliderWrap}>
            <div className={styles.slider}>
              {loading ? (
                 <div className={styles.empty}>
                   <Loader2 className="animate-spin text-primary" size={32} />
                 </div>
              ) : (
                filtered.map(product => {
                  const fallbackImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22smallGrid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e2e5ed%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f0f2f7%22%2F%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23smallGrid)%22%2F%3E%3C%2Fsvg%3E';
                  const imageUrl = product.images?.[0]?.url || fallbackImage;
                  const specList = getSpecsList(product.specs);

                  // Truncation & Expansion logic
                  const isDescExpanded = expandedProducts[`${product.id}-desc`] || false;
                  const isAppsExpanded = expandedProducts[`${product.id}-apps`] || false;
                  
                  const descText = stripHtml(product.description);
                  const hasMoreDesc = descText.length > 100;
                  const truncatedDesc = hasMoreDesc ? descText.substring(0, 100) : descText;

                  const appText = product.applications ? stripHtml(product.applications) : '';
                  const hasMoreApp = appText.length > 60;
                  const truncatedApp = hasMoreApp ? appText.substring(0, 60) : appText;

                  const containImageIds = ['core-pin', 'jet-cool-core-pin', 'jet-cool-profile-pin', 'jet-cool-profile-core-pin', 'jet-cooler'];
                  const isContain = containImageIds.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className={styles.card}
                    >
                      <div 
                        className={styles.imageWrap}
                        onClick={() => setLightboxState({ images: product.images.map(img => img.url), index: 0 })}
                        style={{ cursor: 'pointer' }}
                        title="Click to view full image"
                      >
                        <Image src={imageUrl} alt={product.name} fill className={`${styles.image} ${isContain ? styles.imageContain : ''}`} sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className={styles.categoryBadge}>{product.category?.name || 'Uncategorized'}</div>
                      </div>
                      
                      <div className={styles.content}>
                        <h3 className={styles.title}>{product.name}</h3>
                        
                        <p className={styles.desc}>
                          {isDescExpanded ? descText : truncatedDesc}
                          {hasMoreDesc && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleExpand(product.id, 'desc'); }} 
                              className={styles.readMoreBtn}
                              aria-expanded={isDescExpanded}
                            >
                              {isDescExpanded ? ' Read Less' : '... Read More'}
                            </button>
                          )}
                        </p>
                        
                        {specList.length > 0 && (
                          <div className={styles.specs}>
                            <strong className={styles.specTitle}>Key Specs:</strong>
                            <ul className={styles.specList}>
                              {specList.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                        )}

                        {product.applications && (
                          <div className={styles.apps}>
                            <strong className={styles.specTitle}>Applications:</strong>
                            <p className={styles.desc}>
                              {isAppsExpanded ? appText : truncatedApp}
                              {hasMoreApp && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); toggleExpand(product.id, 'apps'); }} 
                                  className={styles.readMoreBtn}
                                  aria-expanded={isAppsExpanded}
                                >
                                  {isAppsExpanded ? ' Read Less' : '... Read More'}
                                </button>
                              )}
                            </p>
                          </div>
                        )}

                        {/* View Full Details Link */}
                        <div className={styles.viewDetails}>
                          <a
                            href={`/products/${product.slug}`}
                            className={styles.viewDetailsLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Full Specifications →
                          </a>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
              {!loading && filtered.length === 0 && (
                <div className={styles.empty}>
                  <p>No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <div className={styles.footer}>
          <LinkButton href="#gallery" size="lg" variant="ghost" icon={<ArrowRight size={18} />} iconPosition="right">
            View Complete Parts Gallery
          </LinkButton>
        </div>
      </div>
    </section>
      
      {lightboxState && lightboxState.images.length > 0 && (
        <div className={styles.lightbox} onClick={() => setLightboxState(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxState(null)}>
            ✕
          </button>
          
          {lightboxState.images.length > 1 && (
            <>
              <button 
                className={`${styles.lightboxNav} ${styles.navPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxState(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                className={`${styles.lightboxNav} ${styles.navNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxState(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div className={styles.lightboxImage} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={lightboxState.images[lightboxState.index]} 
              alt="Enlarged view" 
              fill 
              className={styles.lightboxImg} 
              sizes="90vw"
            />
          </div>
          
          {lightboxState.images.length > 1 && (
            <div className={styles.lightboxCounter}>
              {lightboxState.index + 1} / {lightboxState.images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
