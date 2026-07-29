'use client';

import { motion } from 'framer-motion';
import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  titleColor?: 'dark' | 'white';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function SectionTitle({
  label,
  title,
  subtitle,
  align = 'left',
  titleColor = 'dark',
}: SectionTitleProps) {
  return (
    <motion.div
      className={`${styles.wrapper} ${align === 'center' ? styles.center : ''}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {label && (
        <motion.span className={styles.label} variants={itemVariants}>
          {label}
        </motion.span>
      )}
      <motion.h2
        className={`${styles.title} ${titleColor === 'white' ? styles.titleWhite : ''}`}
        variants={itemVariants}
      >
        {title}
      </motion.h2>
      {align === 'center' ? (
        <motion.div className={styles.dividerCenter} variants={itemVariants} />
      ) : (
        <motion.div className={styles.divider} variants={itemVariants} />
      )}
      {subtitle && (
        <motion.p
          className={`${styles.subtitle} ${titleColor === 'white' ? styles.subtitleWhite : ''}`}
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
