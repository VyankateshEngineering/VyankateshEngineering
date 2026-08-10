import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { settings } from '@/data/settings';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import { ProductGallery, FaqAccordion } from './ProductClient';
import {
  ChevronRight, CheckCircle2, Download, MessageSquare,
  Tag, Layers, Factory, ShieldCheck, ArrowRight, Wrench
} from 'lucide-react';
import styles from './product.module.css';

interface Props {
  params: { slug: string };
}

function getProduct(slug: string) {
  return products.find(p => p.slug === slug && p.isPublished);
}

export function generateStaticParams() {
  return products.filter(p => p.isPublished).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return {};

  const title = `${product.name} Manufacturer & Supplier in India | Vyankatesh Engineering`;
  const rawDesc = (product.overview || product.description).replace(/<[^>]*>?/gm, '');
  const description = rawDesc.length > 155 ? rawDesc.substring(0, 152) + '...' : rawDesc;
  let rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
  const safeUrl = rawUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  const url = `${safeUrl}/products/${product.slug}`;
  const imageUrl = product.images?.[0]?.url || '/og-image.jpg';

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} manufacturer`,
      `${product.name} supplier India`,
      `${product.category.name} manufacturer`,
      ...(product.industries || []),
      'die casting tooling',
      'Vyankatesh Engineering',
      'Waluj MIDC',
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.images?.[0]?.alt || product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  let rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vyankateshengg.com';
  const baseUrl = rawBaseUrl.includes('vyankateshengg.com') ? 'https://www.vyankateshengg.com' : (rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`);
  const url = `${baseUrl}/products/${product.slug}`;

  // Related products: same category, different product, max 3
  const relatedProducts = products
    .filter(p => p.category.slug === product.category.slug && p.id !== product.id && p.isPublished)
    .slice(0, 3);

  // Other categories for cross-linking
  const allCategorySlugs = [...new Set(products.filter(p => p.isPublished).map(p => p.category.slug))];
  const otherCategories = allCategorySlugs
    .filter(s => s !== product.category.slug)
    .slice(0, 4)
    .map(s => {
      const p = products.find(pr => pr.category.slug === s);
      return p ? { slug: s, name: p.category.name } : null;
    })
    .filter(Boolean) as { slug: string; name: string }[];

  const specEntries = Object.entries(product.specs || {});

  // ── Structured Data ──
  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/#products` },
      { '@type': 'ListItem', position: 3, name: product.category.name, item: `${baseUrl}/categories/${product.category.slug}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: url },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => `${baseUrl}${img.url}`),
    description: (product.overview || product.description).replace(/<[^>]*>?/gm, ''),
    brand: { '@type': 'Brand', name: settings.companyName },
    manufacturer: { '@type': 'Organization', name: settings.companyName, url: baseUrl },
    url,
    ...(product.material && { material: product.material }),
  };

  const faqSchema = product.faqs && product.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  const schemas = [breadcrumbsSchema, productSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      <StructuredData data={schemas} />

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li><Link href="/">Home</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li><Link href="/#products">Products</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li><Link href={`/categories/${product.category.slug}`}>{product.category.name}</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <article>
        {/* ── Main Product Section ── */}
        <section className="bg-white">
          <div className="container">
            <div className={styles.productGrid}>

              {/* Left: Gallery */}
              <div>
                <ProductGallery images={product.images} productName={product.name} />
              </div>

              {/* Right: Detail Panel */}
              <div className={styles.detailPanel}>
                <span className={styles.categoryBadge}>
                  <Tag size={12} />
                  {product.category.name}
                </span>
                <h1 className={styles.productTitle}>{product.name}</h1>

                <p className={styles.overview}>
                  {product.overview || product.description}
                </p>

                {/* Primary CTAs */}
                <div className={styles.ctaGroup}>
                  <LinkButton href="/#contact" variant="primary" size="lg" icon={<MessageSquare size={18} />} iconPosition="left">
                    Request a Quote
                  </LinkButton>
                  <LinkButton href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" variant="outline" size="lg" icon={<Download size={18} />} iconPosition="left">
                    Download Catalogue
                  </LinkButton>
                </div>

                {/* Technical Specs */}
                {specEntries.length > 0 && (
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableTitle}>Technical Specifications</div>
                    {specEntries.map(([key, value]) => (
                      <div key={key} className={styles.specRow}>
                        <div className={styles.specKey}>{key}</div>
                        <div className={styles.specVal}>{String(value)}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Industries */}
                {product.industries && product.industries.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--neutral-500)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Industries Served</p>
                    <div className={styles.industriesGrid}>
                      {product.industries.map(ind => (
                        <span key={ind} className={styles.industryChip}>
                          <Factory size={12} aria-hidden="true" />
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Features ── */}
        {product.features && product.features.length > 0 && (
          <section className={styles.sectionBlockAlt} aria-labelledby="features-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Engineering Detail</p>
              <h2 className={styles.sectionHeading} id="features-heading">Key Features</h2>
              <div className={styles.featuresGrid}>
                {product.features.map((feature, i) => (
                  <div key={i} className={styles.featureCard}>
                    <div className={styles.featureIcon} aria-hidden="true">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className={styles.featureText}>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Material, Tolerance, Finish, Customization ── */}
        {(product.material || product.tolerance || product.surfaceFinish || product.customization) && (
          <section className={styles.sectionBlock} aria-labelledby="material-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Manufacturing Detail</p>
              <h2 className={styles.sectionHeading} id="material-heading">Material, Finish & Customization</h2>
              <div className={styles.infoCards}>
                {product.material && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardLabel}>Material</div>
                    <div className={styles.infoCardValue}>{product.material}</div>
                  </div>
                )}
                {product.tolerance && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardLabel}>Dimensional Tolerance</div>
                    <div className={styles.infoCardValue}>{product.tolerance}</div>
                  </div>
                )}
                {product.surfaceFinish && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardLabel}>Surface Finish</div>
                    <div className={styles.infoCardValue}>{product.surfaceFinish}</div>
                  </div>
                )}
                {product.customization && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardLabel}>Customization Available</div>
                    <div className={styles.infoCardValue}>{product.customization}</div>
                  </div>
                )}
                {product.availableSizes && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardLabel}>Available Sizes</div>
                    <div className={styles.infoCardValue}>{product.availableSizes}</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Applications ── */}
        {product.applicationsList && product.applicationsList.length > 0 && (
          <section className={styles.sectionBlockAlt} aria-labelledby="applications-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Use Cases</p>
              <h2 className={styles.sectionHeading} id="applications-heading">Applications</h2>
              <ul className={styles.applicationsList}>
                {product.applicationsList.map((app, i) => (
                  <li key={i} className={styles.applicationItem}>
                    <span className={styles.applicationDot} aria-hidden="true" />
                    <span className={styles.applicationText}>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Key Advantages ── */}
        {product.keyAdvantages && product.keyAdvantages.length > 0 && (
          <section className={styles.sectionBlock} aria-labelledby="advantages-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Why Choose Vyankatesh</p>
              <h2 className={styles.sectionHeading} id="advantages-heading">Key Advantages</h2>
              <div className={styles.featuresGrid}>
                {product.keyAdvantages.map((adv, i) => (
                  <div key={i} className={styles.featureCard}>
                    <div className={styles.featureIcon} aria-hidden="true">
                      <Wrench size={20} />
                    </div>
                    <p className={styles.featureText}>{adv}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Quality Assurance ── */}
        {product.qualityNote && (
          <section className={styles.sectionBlockAlt} aria-labelledby="quality-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Quality Standard</p>
              <h2 className={styles.sectionHeading} id="quality-heading">Quality Assurance</h2>
              <div className={styles.qaCallout}>
                <div className={styles.qaIcon} aria-hidden="true">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <div className={styles.qaTitle}>100% Inspection Before Dispatch</div>
                  <p className={styles.qaText}>{product.qualityNote}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        {product.faqs && product.faqs.length > 0 && (
          <section className={styles.sectionBlock} aria-labelledby="faq-heading">
            <div className="container" style={{ maxWidth: '800px' }}>
              <p className={styles.sectionLabel}>Expert Answers</p>
              <h2 className={styles.sectionHeading} id="faq-heading">Frequently Asked Questions</h2>
              <FaqAccordion faqs={product.faqs} />
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className={styles.sectionBlockAlt} aria-labelledby="related-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Explore More</p>
              <h2 className={styles.sectionHeading} id="related-heading">Related Products</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map(rp => (
                  <Link href={`/products/${rp.slug}`} key={rp.id} className={styles.relatedCard} style={{ textDecoration: 'none' }}>
                    <div className={styles.relatedImage}>
                      <Image
                        src={rp.images[0]?.url || '/placeholder.png'}
                        alt={rp.images[0]?.alt || rp.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.relatedContent}>
                      <span className={styles.relatedCat}>{rp.category.name}</span>
                      <div className={styles.relatedName}>{rp.name}</div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-600)', fontWeight: 600, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Specifications <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Categories ── */}
        {otherCategories.length > 0 && (
          <section className={styles.sectionBlock} aria-labelledby="cat-heading">
            <div className="container">
              <p className={styles.sectionLabel}>Browse by Category</p>
              <h2 className={styles.sectionHeading} id="cat-heading">Related Categories</h2>
              <div className={styles.catStrip}>
                <Link href={`/categories/${product.category.slug}`} className={styles.catChip}>
                  <Layers size={14} />
                  All {product.category.name}
                </Link>
                {otherCategories.map(cat => (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`} className={styles.catChip}>
                    <Layers size={14} />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Banner ── */}
        <div className={styles.ctaBanner}>
          <div className="container">
            <h2 className={styles.ctaBannerTitle}>Need Custom {product.name}?</h2>
            <p className={styles.ctaBannerDesc}>
              Share your drawing, sample, or specification and our engineering team will provide a tailored solution with competitive pricing and reliable delivery.
            </p>
            <div className={styles.ctaBannerActions}>
              <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
                Send Enquiry
              </LinkButton>
              <LinkButton href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Download Catalogue
              </LinkButton>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
