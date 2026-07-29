'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkButton } from '@/components/ui/Button';
import { ArrowRight, MessageSquare, ChevronDown, Loader2, FileDown } from 'lucide-react';
import styles from './Hero.module.css';

interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  isVisible: boolean;
}

const FALLBACK_SLIDE = {
  id: 'fallback',
  imageUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%221920%22%20height%3D%221080%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2240%22%20height%3D%2240%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2040%200%20L%200%200%200%2040%22%20fill%3D%22none%22%20stroke%3D%22%232a3241%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%20%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23111827%22%2F%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E',
  title: 'Precision Engineering & Tooling Solutions',
  subtitle: 'Manufacturing high quality dies, inserts, core pins and critical engineering components for global industries.',
  ctaText: 'View Products',
  ctaLink: '/parts-gallery',
  isVisible: true
};

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch('/api/slides');
        if (res.ok) {
          const data = await res.json();
          const visibleSlides = data.slides.filter((s: Slide) => s.isVisible);
          setSlides(visibleSlides.length > 0 ? visibleSlides : [FALLBACK_SLIDE]);
        } else {
          setSlides([FALLBACK_SLIDE]);
        }
      } catch (error) {
        console.error("Failed to fetch slides", error);
        setSlides([FALLBACK_SLIDE]);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section id="hero" className={styles.hero} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--neutral-900)' }}>
        <Loader2 className="animate-spin text-primary" size={48} />
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section id="hero" className={styles.hero} aria-label="Hero Section">
      {/* ── Background Image Slider ── */}
      <div className={styles.sliderContainer}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className={styles.imageWrapper}
          >
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              priority
              quality={95}
              className={styles.image}
              sizes="100vw"
            />
            {/* Dark overlay for text readability */}
            <div className={styles.overlay} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Content ── */}
      <div className={`container ${styles.contentContainer}`}>
        <div className={styles.content}>
          <motion.div
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className={styles.badge}>Vyankatesh Engineering</span>
            <h1 className="display-lg">
              {currentSlide.title}
            </h1>
          </motion.div>

          <motion.p
            key={`sub-${currentSlide.id}`}
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {currentSlide.subtitle}
          </motion.p>

          <motion.div
            key={`action-${currentSlide.id}`}
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <LinkButton href={currentSlide.ctaLink?.replace('/parts-gallery', '#gallery') || '#gallery'} size="xl" icon={<ArrowRight size={18} />} iconPosition="right">
              {currentSlide.ctaText || 'View Products'}
            </LinkButton>
            <LinkButton href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" variant="outline" size="xl" icon={<FileDown size={18} />} className={styles.outlineWhite}>
              Download Catalogue
            </LinkButton>
          </motion.div>
        </div>
      </div>

      {/* ── Decorative HUD Elements (Blueprint Feel) ── */}
      <div className={styles.hudTopLeft}>
        <div className={styles.hudCrosshair} />
        <span>COORD-X: 142.11</span>
        <span>COORD-Y: 89.04</span>
      </div>
      <div className={styles.hudTopRight}>
        <span>TOL: ±0.005mm</span>
        <span>SYS: ONLINE</span>
        <div className={styles.hudCrosshair} />
      </div>
      <div className={styles.hudBottomLeft}>
        <div className={styles.hudCrosshair} />
        <span>V-ENG // ACTIVE</span>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className={styles.scrollText}>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className={styles.scrollIcon} />
        </motion.div>
      </motion.div>

      {/* ── Slider Progress Indicators ── */}
      {slides.length > 1 && (
        <div className={styles.progressContainer}>
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {currentIndex === idx && (
                <motion.div
                  className={styles.dotFill}
                  layoutId="hero-dot"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
