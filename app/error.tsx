'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';
import styles from './not-found.module.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <span className={styles.code}>500</span>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.description}>
          An unexpected error occurred. Our team has been notified. Please try
          again or return to the home page.
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
