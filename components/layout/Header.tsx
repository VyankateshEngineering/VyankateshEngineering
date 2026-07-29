'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, FileDown, ChevronDown } from 'lucide-react';
import { settings } from '@/data/settings';
import styles from './Header.module.css';

const NAV_LINKS = [
  { id: 'nav-home',         label: 'Home',             href: '/#hero' },
  { id: 'nav-facilities',   label: 'Facilities',       href: '/#facilities' },
  { id: 'nav-capabilities', label: 'Capabilities',     href: '/#capabilities' },
  { id: 'nav-products',     label: 'Products',         href: '/#products' },
  { id: 'nav-gallery',      label: 'Parts Gallery',    href: '/#gallery' },
  { id: 'nav-customers',    label: 'Valued Customers', href: '/#customers' },
  { id: 'nav-contact',      label: 'Contact',          href: '/#contact' },
];

const COMPANY_LINKS = [
  { id: 'co-about',   label: 'About Us',          href: '/about' },
  { id: 'co-quality', label: 'Quality',            href: '/quality' },
  { id: 'co-mfg',     label: 'Manufacturing',      href: '/manufacturing-process' },
  { id: 'co-ind',     label: 'Industries',         href: '/industries' },
  { id: 'co-wcu',     label: 'Why Choose Us',      href: '/why-choose-us' },
];

export default function Header() {
  const pathname  = usePathname();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [companyOpen, setCompanyOpen]   = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const companyRef = useRef<HTMLLIElement>(null);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close drawer on route change ── */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* ── body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ── active section observer ── */
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentActive = 'hero';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // If the top of the section is at or above the header height (with a 250px buffer)
        if (rect.top <= 250) {
          currentActive = section.id;
        }
      });
      
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    // Call once initially to set the correct state if the user loads the page already scrolled down
    handleScrollSpy();
    
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  /* ── focus management ── */
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setMobileOpen(true);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  useEffect(() => {
    if (mobileOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mobileOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
      }
      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  /* ── Close company dropdown on outside click ── */
  useEffect(() => {
    if (!companyOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setCompanyOpen(false); };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [companyOpen]);

  const isActive = (href: string) => {
    // Hash-based link (home page sections): match against activeSection
    if (href.startsWith('/#')) {
      return pathname === '/' && activeSection === href.replace('/#', '');
    }
    // Path-based link (authority sub-pages): match pathname prefix
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isCompanyActive = COMPANY_LINKS.some(l => pathname === l.href || pathname.startsWith(l.href + '/'));

  return (
    <>

      {/* ────── Main sticky header ────── */}
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : styles.transparent}`}
        role="banner"
      >
        <div className={styles.inner}>

          {/* Logo */}
          <Link href="/#hero" className={styles.logo} aria-label="Vyankatesh Engineering — Home">
            <Image src="/logo.png" alt="Vyankatesh Engineering Logo" width={55} height={55} style={{ height: '48px', width: 'auto', objectFit: 'contain' }} priority />
            <div className={styles.logoWords}>
              <span className={styles.logoName}>Vyankatesh</span>
              <span className={styles.logoSub}>Engineering</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className={styles.desktopNav}>
            <ul className={styles.navList} role="list">
              {/* Home link */}
              {NAV_LINKS.slice(0, 1).map(({ id, label, href }) => {
                const active = isActive(href);
                return (
                  <li key={id}>
                    <Link href={href} className={`${styles.navLink} ${active ? styles.navActive : ''}`}>
                      {label}
                      {active && (
                        <motion.span
                          className={styles.navIndicator}
                          layoutId="nav-indicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}

              {/* Company dropdown */}
              <li
                ref={companyRef}
                style={{ position: 'relative' }}
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                <button
                  className={`${styles.navLink} ${isCompanyActive ? styles.navActive : ''}`}
                  aria-haspopup="true"
                  aria-expanded={companyOpen}
                  onClick={() => setCompanyOpen(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Company
                  <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: companyOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true" />
                  {isCompanyActive && (
                    <motion.span
                      className={styles.navIndicator}
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <AnimatePresence>
                  {companyOpen && (
                    <motion.ul
                      role="menu"
                      aria-label="Company pages"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                        background: 'var(--neutral-0)',
                        border: '1px solid var(--neutral-200)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        listStyle: 'none',
                        padding: '6px',
                        minWidth: '200px',
                        zIndex: 100,
                      }}
                    >
                      {COMPANY_LINKS.map(({ id, label, href }) => (
                        <li key={id} role="none">
                          <Link
                            href={href}
                            role="menuitem"
                            onClick={() => setCompanyOpen(false)}
                            style={{
                              display: 'block',
                              padding: '9px 14px',
                              fontSize: '14px',
                              fontWeight: pathname === href ? 600 : 500,
                              color: pathname === href ? 'var(--primary-600)' : 'var(--neutral-700)',
                              textDecoration: 'none',
                              borderRadius: 'var(--radius-md)',
                              background: pathname === href ? 'var(--primary-50)' : 'transparent',
                              transition: 'background 150ms, color 150ms',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--primary-50)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary-600)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = pathname === href ? 'var(--primary-50)' : 'transparent'; (e.currentTarget as HTMLElement).style.color = pathname === href ? 'var(--primary-600)' : 'var(--neutral-700)'; }}
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {/* Remaining nav links */}
              {NAV_LINKS.slice(1).map(({ id, label, href }) => {
                const active = isActive(href);
                return (
                  <li key={id}>
                    <Link href={href} className={`${styles.navLink} ${active ? styles.navActive : ''}`}>
                      {label}
                      {active && (
                        <motion.span
                          className={styles.navIndicator}
                          layoutId="nav-indicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className={styles.navActions}>
            <a href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" download className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileDown size={16} />
              Catalogue
            </a>
            <Link href="/#contact" className="btn btn-primary btn-sm" id="nav-cta">
              Get a Quote
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={(e) => mobileOpen ? closeDrawer() : openDrawer(e)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X size={21} strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span key="open"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu size={21} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>
      </header>

      {/* ────── Mobile drawer ────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Scrim */}
            <motion.div
              className={styles.scrim}
              aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
            />

            {/* Drawer panel */}
            <motion.nav
              ref={drawerRef as any}
              tabIndex={-1}
              id="mobile-menu"
              className={styles.drawer}
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
            >
              {/* Drawer header */}
              <div className={styles.drawerHead}>
                <Link href="/#hero" className={styles.logo} onClick={closeDrawer}>
                  <Image src="/logo.png" alt="Vyankatesh Engineering Logo" width={45} height={45} style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                  <div className={styles.logoWords}>
                    <span className={styles.logoName} style={{ fontSize: '15px' }}>Vyankatesh</span>
                    <span className={styles.logoSub} style={{ fontSize: '8px' }}>Engineering</span>
                  </div>
                </Link>
                <button className={styles.hamburger} onClick={closeDrawer} aria-label="Close menu">
                  <X size={21} strokeWidth={2} />
                </button>
              </div>

              {/* Links */}
              <ul className={styles.drawerLinks} role="list">
                {/* Home */}
                {NAV_LINKS.slice(0, 1).map(({ id, label, href }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.li key={id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.28 }}
                    >
                      <Link
                        href={href}
                        className={`${styles.drawerLink} ${active ? styles.drawerActive : ''}`}
                        onClick={closeDrawer}
                      >
                        {active && <span className={styles.drawerDot} aria-hidden="true" />}
                        {label}
                      </Link>
                    </motion.li>
                  );
                })}

                {/* Company expandable group */}
                <motion.li
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.09, duration: 0.28 }}
                >
                  <button
                    className={styles.drawerLink}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      justifyContent: 'space-between',
                      fontWeight: isCompanyActive ? 600 : 500,
                      color: isCompanyActive ? 'var(--primary-600)' : 'var(--neutral-700)',
                    }}
                    aria-expanded={mobileCompanyOpen}
                    onClick={() => setMobileCompanyOpen(v => !v)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isCompanyActive && <span className={styles.drawerDot} aria-hidden="true" />}
                      Company
                    </span>
                    <ChevronDown
                      size={16}
                      style={{ transition: 'transform 200ms', transform: mobileCompanyOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence>
                    {mobileCompanyOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden', listStyle: 'none', padding: 0 }}
                      >
                        {COMPANY_LINKS.map(({ id, label, href }) => (
                          <li key={id}>
                            <Link
                              href={href}
                              className={`${styles.drawerLink} ${pathname === href ? styles.drawerActive : ''}`}
                              onClick={closeDrawer}
                              style={{ paddingLeft: 'calc(var(--space-6) + 20px)', fontSize: '14px' }}
                            >
                              {pathname === href && <span className={styles.drawerDot} aria-hidden="true" />}
                              {label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>

                {/* Remaining nav links */}
                {NAV_LINKS.slice(1).map(({ id, label, href }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.li key={id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.13 + i * 0.04, duration: 0.28 }}
                    >
                      <Link
                        href={href}
                        className={`${styles.drawerLink} ${active ? styles.drawerActive : ''}`}
                        onClick={closeDrawer}
                      >
                        {active && <span className={styles.drawerDot} aria-hidden="true" />}
                        {label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Drawer footer */}
              <div className={styles.drawerFoot}>
                <a href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" download className="btn btn-secondary w-full mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FileDown size={18} />
                    Download Catalogue
                </a>
                <Link href="/#contact" className="btn btn-primary w-full" onClick={closeDrawer}>
                  Get a Quote
                </Link>
                <a href={`mailto:${settings.contactEmail}`} className={styles.drawerPhone}>
                  <Mail size={14} />
                  {settings.contactEmail}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
