'use client';

import { useRef } from 'react';
import Image from 'next/image';
import styles from './LogoSlider.module.css';

interface Logo {
  name: string;
  url: string;
  width?: number;
  height?: number;
}

interface LogoSliderProps {
  logos: Logo[];
  speed?: 'slow' | 'normal' | 'fast';
}

export default function LogoSlider({ logos, speed = 'normal' }: LogoSliderProps) {
  // Duplicate logos array for seamless infinite loop
  const doubled = [...logos, ...logos];

  const speedMap = { slow: '45s', normal: '30s', fast: '18s' };

  return (
    <div className={styles.wrapper} aria-label="Our valued customers">
      <div className={styles.track} style={{ animationDuration: speedMap[speed] }}>
        {doubled.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className={styles.logoItem} title={logo.name}>
            <Image
              src={logo.url}
              alt={logo.name}
              width={logo.width || 140}
              height={logo.height || 56}
              className={styles.logo}
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              loading="lazy"
              sizes="140px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
