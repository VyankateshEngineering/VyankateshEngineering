'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './AnimatedCounter.module.css';

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface AnimatedCounterProps {
  stats: StatItem[];
  theme?: 'light' | 'dark';
}

function Counter({ value, suffix = '', prefix = '', duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observed.current) {
          observed.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export default function AnimatedCounter({ stats, theme = 'light' }: AnimatedCounterProps) {
  return (
    <div className={`${styles.grid} ${theme === 'dark' ? styles.dark : ''}`}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className={styles.statCard}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className={styles.statValue}>
            <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
          {stat.description && (
            <div className={styles.statDesc}>{stat.description}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
