import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: 'light' | 'dark';
}

export default function Breadcrumb({ items, theme = 'dark' }: BreadcrumbProps) {
  const allItems = [{ name: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`${styles.nav} ${theme === 'light' ? styles.light : styles.dark}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className={styles.list}>
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <li key={item.name} className={styles.item}>
              {i === 0 ? (
                item.href ? (
                  <Link href={item.href} className={styles.link} aria-label="Home">
                    <Home size={13} />
                  </Link>
                ) : (
                  <Home size={13} className={styles.current} />
                )
              ) : item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>{item.name}</Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && <ChevronRight size={13} className={styles.separator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
