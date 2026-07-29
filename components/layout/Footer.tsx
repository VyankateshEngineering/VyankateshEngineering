import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { settings } from '@/data/settings';
import styles from './Footer.module.css';

// Quick links — absolute paths so they work from any sub-page
const quickLinks = [
  { name: 'Home',             href: '/' },
  { name: 'About Us',         href: '/about' },
  { name: 'Quality Assurance',href: '/quality' },
  { name: 'Manufacturing',    href: '/manufacturing-process' },
  { name: 'Industries Served',href: '/industries' },
  { name: 'Why Choose Us',    href: '/why-choose-us' },
  { name: 'Parts Gallery',    href: '/gallery' },
  { name: 'Catalogue',        href: '/catalogue' },
  { name: 'Contact Us',       href: '/#contact' },
];

// Product links — dedicated product pages
const productLinks = [
  { name: 'Core Pins',              href: '/products/core-pin' },
  { name: 'Jet Cool Core Pins',     href: '/products/jet-cool-core-pin' },
  { name: 'Profile Inserts',        href: '/products/profile-inserts' },
  { name: 'HPDC Dies & Inserts',    href: '/products/hpdc-insert' },
  { name: 'Shot Sleeves',           href: '/products/shot-sleeve' },
  { name: 'Sprue Bush & Diffuser',  href: '/products/sprue-bush-diffuser' },
  { name: 'GDC Dies',               href: '/products/gdc-die' },
  { name: 'HPDC Dies',              href: '/products/hpdc-die' },
  { name: 'LPDC Dies',              href: '/products/lpdc-die' },
  { name: 'Copper Chills',          href: '/products/copper-chills' },
  { name: 'Jet Cooler',             href: '/products/jet-cooler' },
];

// Category browse links
const categoryLinks = [
  { name: 'Pins',                href: '/categories/pins' },
  { name: 'Inserts',             href: '/categories/inserts' },
  { name: 'Dies',                href: '/categories/dies' },
  { name: 'Cooling Systems',     href: '/categories/cooling' },
  { name: 'Casting Accessories', href: '/categories/accessories' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">

      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>Ready to discuss your precision tooling needs?</h2>
              <p className={styles.ctaDesc}>
                Our engineering team is ready to assist with custom specifications. Send your drawing or specification and receive a competitive quote.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/#contact" className="btn btn-white btn-lg">
                Get a Free Quote
              </Link>
              <a href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" download className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Download Catalogue
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.footerMain}>
        <div className="container">
          <div className={styles.footerGrid}>

            {/* Brand Column */}
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <Image src="/logo.png" alt="Vyankatesh Engineering Logo" width={55} height={55} style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                <div className={styles.footerLogoText}>
                  <span className={styles.footerLogoName}>Vyankatesh</span>
                  <span className={styles.footerLogoSub}>Engineering</span>
                </div>
              </Link>
              <p className={styles.footerDesc}>
                Precision manufacturer of die casting tooling — core pins, inserts, dies, shot sleeves, and cooling systems. 20+ years of in-house manufacturing from Waluj MIDC.
              </p>
              <div className={styles.footerContact}>
                <a href={`mailto:${settings.contactEmail}`} className={styles.footerContactItem}>
                  <Mail size={14} />
                  {settings.contactEmail}
                </a>
                <span className={styles.footerContactItem} style={{ whiteSpace: 'pre-line' }}>
                  <MapPin size={14} />
                  <span>
                    {settings.address}
                  </span>
                </span>
              </div>
              {/* Trust badges */}
              <div className={styles.footerCertBadges} style={{ marginTop: 'var(--space-5)' }}>
                <div className={styles.certBadge}>
                  <span className={styles.certBadgeText}>20+</span>
                  <span className={styles.certBadgeSub}>Years Exp.</span>
                </div>
                <div className={styles.certBadge}>
                  <span className={styles.certBadgeText}>MIDC</span>
                  <span className={styles.certBadgeSub}>Registered</span>
                </div>
                <div className={styles.certBadge}>
                  <span className={styles.certBadgeText}>MSME</span>
                  <span className={styles.certBadgeSub}>Registered</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className={styles.footerCol}>
              <h3 className={styles.footerColTitle}>Company</h3>
              <ul className={styles.footerLinks}>
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className={styles.footerCol}>
              <h3 className={styles.footerColTitle}>Products</h3>
              <ul className={styles.footerLinks}>
                {productLinks.map((prod) => (
                  <li key={prod.href}>
                    <Link href={prod.href} className={styles.footerLink}>
                      {prod.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className={styles.footerColTitle} style={{ marginTop: 'var(--space-6)' }}>Categories</h3>
              <ul className={styles.footerLinks}>
                {categoryLinks.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className={styles.footerLink}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries + CTA */}
            <div className={styles.footerCol}>
              <h3 className={styles.footerColTitle}>Industries Served</h3>
              <ul className={styles.footerLinks}>
                {['Automotive & Commercial Vehicles', 'Electrical & Electronics', 'Aerospace & Defence', 'Industrial Machinery', 'Die Casting Foundries'].map((ind) => (
                  <li key={ind}>
                    <span className={styles.footerLinkStatic}>{ind}</span>
                  </li>
                ))}
              </ul>
              <Link href="/industries" className={styles.footerLink} style={{ marginTop: 'var(--space-3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowRight size={12} /> View Industries Page
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.footerBottomInner}>
            <p className={styles.footerCopy}>
              &copy; {year} Vyankatesh Engineering, Waluj MIDC, Chhatrapati Sambhajinagar. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Link href="/about" className={styles.footerLink} style={{ fontSize: 'var(--text-xs)' }}>About</Link>
              <Link href="/quality" className={styles.footerLink} style={{ fontSize: 'var(--text-xs)' }}>Quality</Link>
              <Link href="/catalogue" className={styles.footerLink} style={{ fontSize: 'var(--text-xs)' }}>Catalogue</Link>
              <Link href="/#contact" className={styles.footerLink} style={{ fontSize: 'var(--text-xs)' }}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
