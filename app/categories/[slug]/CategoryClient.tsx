'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './category.module.css';

interface Faq { q: string; a: string; }

export function CategoryFaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={styles.faqList}>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => setOpen(isOpen ? null : i)}
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
              <div className={styles.faqAnswer}>{faq.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
