/* eslint-disable @next/next/no-img-element */
import { settings } from '@/data/settings';
import { products } from '@/data/products';
import styles from './page.module.css';

export const metadata = {
  title: 'Catalogue Print View',
  robots: 'noindex, nofollow',
};

// Group products by category
const groupedProducts = products.reduce((acc, product) => {
  if (product.isPublished) {
    const cat = product.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
  }
  return acc;
}, {} as Record<string, typeof products>);

export default function CataloguePrintPage() {
  // Pre-calculate product pages to support pagination
  const productPages: { category: string; chunk: typeof products; isContinuation: boolean }[] = [];
  Object.entries(groupedProducts).forEach(([category, items]) => {
    for (let i = 0; i < items.length; i += 2) {
      productPages.push({
        category,
        chunk: items.slice(i, i + 2),
        isContinuation: i > 0
      });
    }
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          header, footer, nav, #nav-cta, .skip-link { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      <div className={styles.catalogue}>
        {/* 1. Cover Page */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.coverPage}>
            <div className={styles.coverHeader}>
              <img src="/logo.png" alt={settings.companyName} className={styles.coverLogo} style={{ maxHeight: '120px', objectFit: 'contain' }} />
              <div style={{ color: '#000000', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '1rem', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
                {settings.companyName}
              </div>
            </div>
            
            <div className={styles.coverCenter}>
              <h1 className={styles.coverTitle}>Product<br/><span>Catalogue</span></h1>
              <p className={styles.coverSubtitle}>Precision Die & Tooling Manufacturer</p>
            </div>
            
            <div className={styles.coverFooter}>
              <span>{settings.companyName}</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* 2. Table of Contents */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>Table of Contents</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ paddingLeft: '35mm', display: 'flex', gap: '15mm' }}>
            <div style={{ flex: 1 }}>
              <h2 className={styles.sectionTitle}>Contents</h2>
              <div className={styles.tocList}>
                <div className={styles.tocItem}>
                  <span>Company Profile</span>
                  <span>03</span>
                </div>
                <div className={styles.tocItem}>
                  <span>Facilities & Quality</span>
                  <span>04</span>
                </div>
                <div className={styles.tocItem}>
                  <span>VMC Manufacturing</span>
                  <span>05</span>
                </div>
                <div className={styles.tocItem}>
                  <span>Core Pin & Cavity MFG</span>
                  <span>06</span>
                </div>
                {Object.keys(groupedProducts).map((cat) => {
                  const firstPageIdx = productPages.findIndex(p => p.category === cat);
                  return (
                    <div className={styles.tocItem} key={cat}>
                      <span>{cat}</span>
                      <span>{String(7 + firstPageIdx).padStart(2, '0')}</span>
                    </div>
                  );
                })}
                <div className={styles.tocItem}>
                  <span>Contact Us</span>
                  <span>{String(7 + productPages.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
            
            <div style={{ flex: '0 0 60mm', display: 'flex', flexDirection: 'column', gap: '10mm', paddingTop: '15mm' }}>
              <img src="/hero/precision-tooling.png" alt="Precision Tooling" style={{ width: '100%', height: '80mm', objectFit: 'cover', borderRadius: '4px' }} />
              <img src="/hero/iso-quality.png" alt="CNC Machining" style={{ width: '100%', height: '80mm', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>02</span>
          </div>
        </div>

        {/* 3. Company Profile */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>Company Profile</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ paddingLeft: '35mm' }}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--neutral-700)' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Established in 2004, Vyankatesh Engineering has grown to become a leading manufacturer of precision tools, dies, and casting accessories. Based in Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, we specialize in high-quality core pins, inserts, and die blocks for the die-casting industry.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Our commitment to quality, continual innovation, and rigorous manufacturing standards has earned us the trust of major automotive and industrial clients across India. With a state-of-the-art facility spanning over 7,500 sq ft, we handle precision in-house machining and partner with certified experts for thermal processing.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '2rem' }}>
               <img src="/company/main.png" alt="Company" style={{ width: '100%', height: '80mm', objectFit: 'cover', borderRadius: '4px' }} />
               <img src="/company/sub.png" alt="Facility" style={{ width: '100%', height: '80mm', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>03</span>
          </div>
        </div>

        {/* 4. Facilities */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>Facilities</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ paddingLeft: '35mm' }}>
            <h2 className={styles.sectionTitle}>Infrastructure & Quality</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8mm' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--neutral-900)', textTransform: 'uppercase' }}>Machining</h3>
                <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem', marginBottom: '1.5rem', color: 'var(--neutral-700)' }}>
                  <li style={{ listStyleType: 'square' }}>VMC (Vertical Machining Centers)</li>
                  <li style={{ listStyleType: 'square' }}>CNC Turning Centers</li>
                  <li style={{ listStyleType: 'square' }}>EDM & Wire Cut</li>
                  <li style={{ listStyleType: 'square' }}>Surface Grinding</li>
                </ul>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--neutral-900)', textTransform: 'uppercase' }}>Quality Control</h3>
                <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem', color: 'var(--neutral-700)' }}>
                  <li style={{ listStyleType: 'square' }}>CMM (Coordinate Measuring Machine)</li>
                  <li style={{ listStyleType: 'square' }}>Profile Projector</li>
                  <li style={{ listStyleType: 'square' }}>Hardness Testers</li>
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8mm' }}>
                 <img src="/facilities/VMC-maching.jfif" alt="VMC" style={{ width: '100%', height: '70mm', objectFit: 'cover', borderRadius: '4px' }} />
                 <img src="/facilities/quality-control.png" alt="Quality Control" style={{ width: '100%', height: '70mm', objectFit: 'cover', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>04</span>
          </div>
        </div>

        {/* 5. VMC Manufacturing Scan */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>VMC Manufacturing</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ padding: 0, paddingLeft: '15mm', height: '240mm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/catalogue/scan-1.png" alt="VMC Manufacturing" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>05</span>
          </div>
        </div>

        {/* 6. Die Casting Core Pin Scan */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
          <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>Core Pin & Cavity MFG</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ padding: 0, paddingLeft: '15mm', height: '240mm', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/catalogue/scan-2.png" alt="Die Casting Core Pin" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>06</span>
          </div>
        </div>

        {/* 7+. Products */}
        {productPages.map((page, pageIdx) => (
          <div className={styles.page} key={`${page.category}-${pageIdx}`}>
            <div className={styles.accentBar}></div>
            <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
              <span className={styles.headerTitle}>{page.category} {page.isContinuation ? '(Cont.)' : ''}</span>
              <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
            </div>
            <div className={styles.pageContent} style={{ paddingLeft: '35mm' }}>
              {!page.isContinuation && (
                <h2 className={styles.sectionTitle}>{page.category} Range</h2>
              )}
              
              <div className={styles.productGrid} style={{ marginTop: page.isContinuation ? '0' : '10mm' }}>
                {page.chunk.map((product) => (
                  <div className={styles.productCard} key={product.id}>
                    <div className={styles.productImageWrap}>
                      {product.images[0] && (
                        <img src={product.images[0].url} alt={product.name} />
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productCategory}>{product.category.name}</div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDesc}>{product.description}</p>
                      
                      <table className={styles.specsTable}>
                        <tbody>
                          {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                            <tr key={key}>
                              <th>{key}</th>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
              <span>{settings.companyName}</span>
              <span>{String(7 + pageIdx).padStart(2, '0')}</span>
            </div>
          </div>
        ))}

        {/* Final. Contact Page */}
        <div className={styles.page}>
          <div className={styles.accentBar}></div>
           <div className={styles.pageHeader} style={{ paddingLeft: '35mm' }}>
            <span className={styles.headerTitle}>Contact Us</span>
            <img src="/logo.png" alt="Logo" className={styles.headerLogo} />
          </div>
          <div className={styles.pageContent} style={{ paddingLeft: '35mm' }}>
            <h2 className={styles.sectionTitle}>Get In Touch</h2>
            
            <div className={styles.contactGrid}>
              <div className={styles.contactBlock}>
                <h3>Work Address</h3>
                <p>C-106, Waluj MIDC,<br/>Chhatrapati Sambhajinagar,<br/>Maharashtra, India</p>
              </div>
              
              <div className={styles.contactBlock}>
                <h3>Registered Address</h3>
                <p>C-252/3, Waluj MIDC,<br/>Chhatrapati<br/>Sambhajinagar,<br/>Maharashtra, India</p>
              </div>

              <div className={styles.contactBlock}>
                <h3>Email</h3>
                <p>{settings.contactEmail}</p>
              </div>
              
              <div className={styles.contactBlock}>
                <h3>Business Hours</h3>
                <p>Monday - Saturday:<br/>9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>

            <div style={{ marginTop: '30mm', textAlign: 'center', padding: '10mm', backgroundColor: 'var(--neutral-50)' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '250px', height: 'auto', margin: '0 auto 1.5rem auto' }} />
              <p style={{ fontSize: '1.1rem', color: 'var(--neutral-600)', letterSpacing: '0.5px' }}>Thank you for reviewing our catalogue.</p>
            </div>
          </div>
          <div className={styles.pageFooter} style={{ paddingLeft: '35mm' }}>
            <span>{settings.companyName}</span>
            <span>{String(7 + productPages.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
