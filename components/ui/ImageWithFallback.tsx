'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import styles from './ImageWithFallback.module.css';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  aspectRatio?: string; // e.g. "16/9", "4/3", "1/1"
  className?: string;
}

const DEFAULT_FALLBACK = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%234a4a4a%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';

export default function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt = 'Industrial engineering component',
  aspectRatio = '16/9',
  className = '',
  fill = true,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when source changes
    setImgSrc(src);
    setLoading(true);
    setIsError(false);
  }, [src]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#161616',
        aspectRatio: fill ? undefined : aspectRatio,
        height: fill ? '100%' : 'auto',
      }}
      className={className}
    >
      {/* Sleek CSS shimmer loader */}
      {loading && (
        <div className={styles.shimmer} />
      )}

      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill={fill}
        style={{
          objectFit: 'cover',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          ...props.style,
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setIsError(true);
          setImgSrc(fallbackSrc);
          setLoading(false);
        }}
        sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        loading={props.priority ? undefined : (props.loading || 'lazy')}
      />
    </div>
  );
}
