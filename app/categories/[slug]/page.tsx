import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { settings } from '@/data/settings';
import StructuredData from '@/components/common/StructuredData';
import { LinkButton } from '@/components/ui/Button';
import { CategoryFaqAccordion } from './CategoryClient';
import {
  ChevronRight, CheckCircle2, Download, MessageSquare,
  Factory, Layers, ArrowRight, ShieldCheck, Zap, Clock, Settings
} from 'lucide-react';
import styles from './category.module.css';

interface Props { params: { slug: string } }

// ── Category-specific content ─────────────────────────────────────────────
const categoryContent: Record<string, {
  subtitle: string;
  intro: string;
  whatAre: string;
  benefits: { icon: string; title: string; desc: string }[];
  process: { num: number; title: string; desc: string }[];
  selectionGuide: { product: string; bestFor: string; key: string }[];
  industries: string[];
  faqs: { q: string; a: string }[];
}> = {
  pins: {
    subtitle: "Precision-ground, heat-treated core and jet cool pins for HPDC and GDC die casting tooling",
    intro: "Core pins and jet cool pins are the most frequently replaced consumable components in any die casting operation. Their performance directly impacts hole quality, cavity surface integrity, and overall cycle efficiency. Vyankatesh Engineering manufactures the full range of die casting pins — from standard core pins and long jet cool pins to complex profile pins — from certified DIN 1.2344 / AISI H-13 tool steel, processed through our complete managed heat treatment and surface finishing sequence.",
    whatAre: "Die casting pins are precision-machined, heat-treated steel components that form holes, slots, and internal features within the die cavity. Core pins form blind or through holes. Jet cool (JC) pins incorporate an internal bore through which high-pressure water or air is directed to remove heat from hot-spot zones that cannot be cooled by conventional water circuits. Profile pins extend this capability to non-circular cross-sections.",
    benefits: [
      { icon: "shield", title: "Extended Service Life", desc: "Vacuum hardening + nitriding delivers hardness of 44–48 HRC with a wear-resistant nitrided surface layer, significantly outperforming un-treated alternatives." },
      { icon: "zap", title: "Reduced Cycle Times", desc: "Jet cool pins remove heat directly from the pin tip, enabling faster solidification and shorter cooling dwell — directly reducing cycle time and improving productivity." },
      { icon: "check", title: "Dimensional Consistency", desc: "Precision-ground to h6–h8 tolerances with straightness verified to ≤ 0.01mm / 100mm, ensuring consistent hole geometry batch after batch." },
      { icon: "settings", title: "Custom to Drawing", desc: "Any diameter, length, profile, or cooling channel arrangement manufactured from customer drawings, CAD files, or physical samples." },
      { icon: "clock", title: "Fast Turnaround", desc: "Dedicated in-house CNC turning, grinding, and inspection facilities, coupled with certified heat treatment partners, enable competitive lead times without quality compromise." },
      { icon: "factory", title: "Full Dimensional Accuracy", desc: "All pins are manufactured with strict precision, ensuring exact shape, size, and long-lasting quality for critical applications." },
    ],
    process: [
      { num: 1, title: "Raw Material", desc: "Premium DIN 1.2344 / AISI H-13 billet sourced for optimum density, ensuring precision shape and long-lasting quality." },
      { num: 2, title: "CNC Turning", desc: "Rough and semi-finish turning to leave grinding allowance. Deep-hole drilling for jet cool bores" },
      { num: 3, title: "Vacuum Hardening", desc: "Vacuum heat treatment with controlled gas quench for uniform 44–48 HRC hardness" },
      { num: 4, title: "Precision Grinding", desc: "OD grinding and bore grinding to final h6–h8 tolerances and Ra ≤ 0.4μm surface finish" },
      { num: 5, title: "Nitriding", desc: "Gas nitriding creates a hard compound layer (900–1200 HV) without dimensional change" },
      { num: 6, title: "Inspection", desc: "100% measurement of diameter, length, straightness, bore concentricity, and hardness" },
    ],
    selectionGuide: [
      { product: "Core Pin", bestFor: "Standard round-hole formation in HPDC/GDC without hot-spot issues", key: "Material: H-13; Treatment: Nitrided" },
      { product: "Jet Cool Core Pin", bestFor: "Round holes in hot-spot zones — direct jet cooling required", key: "Min bore: 3mm; Min casting dia: 4.5mm" },
      { product: "Jet Cool Profile Pin", bestFor: "Non-round profiles in hot-spot zones requiring cooling", key: "Any cross-section; bore positioned per profile" },
      { product: "Jet Cool Profile Core Pin", bestFor: "Combined profiling and core forming with cooling in one component", key: "Fully custom; complex multi-function pin" },
      { product: "Long Jet Cool Core Pin", bestFor: "Deep cavity/deep boss cooling beyond standard JC pin length range", key: "Length beyond standard; concentricity maintained" },
    ],
    industries: ["Automotive (Engine Blocks, Transmission Cases)", "Motorcycle & Two-Wheeler", "Electrical & Electronics Housings", "Industrial Machinery", "Aerospace Components"],
    faqs: [
      { q: "What is the minimum bore diameter for a jet cool core pin?", a: "Our minimum internal bore diameter is 3mm, enabling jet cool pins from a casting diameter of 4.5mm upward." },
      { q: "Can you manufacture replacement pins to match my existing worn pins?", a: "Yes. We can reverse-engineer replacement pins from worn samples or from the original die drawing. Provide us with a sample or drawing and we will match the specification." },
      { q: "How does nitriding affect the pin diameter?", a: "Gas nitriding is performed after final grinding. Because nitriding is a diffusion process (nitrogen diffuses into the surface rather than depositing material on it), dimensional change is minimal — typically less than 0.01mm. We account for this in the grinding process." },
      { q: "What surface treatment is recommended for high-silicon aluminum alloys?", a: "For high-silicon alloys that cause increased pin erosion and sticking, we recommend nitriding combined with a PVD hard coating (TiN or TiAlN). This provides the best combination of wear resistance and anti-sticking properties." },
    ],
  },

  inserts: {
    subtitle: "Full-process die casting inserts — profile, HPDC, LPDC, sub insert, and prototype — manufactured from raw material to finished, coated component",
    intro: "Die casting inserts are the precision-machined, heat-treated components that form the cavity features in GDC, LPDC, and HPDC dies. They must maintain their dimensional accuracy and structural integrity across tens of thousands of high-temperature, high-pressure casting cycles. Vyankatesh Engineering manufactures the complete range of die casting inserts — fixed, loose-piece, profile, HPDC, sub insert, and prototype — through a strictly managed process from certified raw material to finished, inspected component.",
    whatAre: "Die casting inserts are replaceable components fitted into the die body to form specific cavity features. Fixed inserts form features in the main cavity. Loose-piece (loose) inserts are designed to be removed with the casting and extracted manually, enabling undercut and re-entrant features that cannot be ejected in the die opening direction. HPDC inserts are designed for the extreme thermal and mechanical demands of high-pressure die casting. Profile inserts combine complex cavity geometry with precision ground surfaces.",
    benefits: [
      { icon: "shield", title: "End-to-End Manufacturing", desc: "From certified raw material through in-house machining and grinding, to certified hardening and nitriding. One responsible supplier, complete quality ownership." },
      { icon: "zap", title: "Complex Geometry Capability", desc: "CNC, Wire EDM, Sink EDM, and profile grinding enable any insert geometry — including fine details, sharp internal corners, and complex undercuts." },
      { icon: "check", title: "Consistent Dimensional Quality", desc: "Documented CNC programs + CMM inspection ensures every insert in a batch is within specified tolerance. No dimensional drift between batches." },
      { icon: "settings", title: "Controlled Heat Treatment", desc: "Vacuum hardening eliminates distortion. Multiple tempering cycles optimise hardness/toughness balance for die application." },
      { icon: "clock", title: "Sub Insert to Production", desc: "We offer fast-track sub inserts for design validation, progressing seamlessly to production tooling — same material, same process, same quality." },
      { icon: "factory", title: "Reverse Engineering", desc: "Worn or damaged inserts with no drawing can be reverse-engineered from the physical component using CMM measurement and design intent reconstruction." },
    ],
    process: [
      { num: 1, title: "Raw Material", desc: "Premium AISI H-13 / DIN 1.2344 billet selected to guarantee final precision shape, size, and long-lasting quality." },
      { num: 2, title: "VMC Machining", desc: "Rough and semi-finish machining, drilling, and milling to near-net shape" },
      { num: 3, title: "EDM (Wire & Sink)", desc: "Complex profiles, fine details, and sharp corners by Wire EDM and Sink EDM" },
      { num: 4, title: "Vacuum Hardening", desc: "Vacuum heat treatment with double/triple tempering for distortion-free hardening" },
      { num: 5, title: "Precision Grinding", desc: "Surface, profile, and internal grinding to final tolerances and surface finish" },
      { num: 6, title: "Die Polishing", desc: "High-finish manual and automated polishing to ensure smooth metal flow and easy ejection" },
      { num: 7, title: "Nitriding & Coating", desc: "Gas nitriding for surface hardness; optional PVD hard coating for extreme wear resistance" },
    ],
    selectionGuide: [
      { product: "Profile Insert", bestFor: "Complex cavity geometry, undercut features, loose-piece applications", key: "AISI H-13; complete managed process" },
      { product: "HPDC Insert", bestFor: "Fixed or replaceable cavity inserts in high-pressure die casting dies", key: "H-13; vacuum hardened; CMM inspected" },
      { product: "Sub Insert", bestFor: "Design validation, first article testing, short-run casting", key: "Same material and process as production; fast-track schedule" },
      { product: "Prototype Insert", bestFor: "Design validation, first article testing, short-run casting", key: "Same material and process as production; fast-track schedule" },
    ],
    industries: ["Automotive (HPDC, LPDC, GDC)", "Two-Wheeler & Motorcycle Manufacturing", "Electrical Component Manufacturing", "Aerospace & Defence", "Industrial Equipment"],
    faqs: [
      { q: "What is a loose-piece insert and when do I need one?", a: "A loose-piece (loose) insert is a removable section of the die that forms an undercut or re-entrant feature — a cavity shape that cannot be ejected directly from the die. The loose piece travels with the casting during ejection and is manually removed from the casting before the die closes again." },
      { q: "How do you verify dimensional accuracy on complex inserts?", a: "We use CMM (Coordinate Measuring Machine) measurement for all critical dimensions. For complex profiles, we perform blue-matching on the VMC — applying engineer's blue and checking contact patterns to verify the mating surface geometry." },
      { q: "What is the lead time for a production HPDC insert?", a: "Lead time depends on geometry, size, and our current schedule. For medium-complexity inserts, we typically target 3–5 weeks from confirmed drawing. Complex inserts requiring extensive EDM work may be 6–8 weeks. Discuss your timeline at enquiry stage." },
    ],
  },

  cooling: {
    subtitle: "Jet Coolers and Copper Chills for targeted thermal management in die casting dies",
    intro: "Effective thermal management is one of the most significant factors controlling casting quality, cycle time, and die longevity. Where conventional drilled cooling circuits cannot reach, Vyankatesh Engineering's cooling products — Jet Coolers and Copper Chills — provide targeted, high-efficiency heat extraction exactly where it is needed.",
    whatAre: "Jet Coolers are precision-machined assemblies that connect the cooling water supply to the internal bore of a jet cool core pin, directing high-pressure fluid directly to the extreme tip of the pin. Copper Chills are inserts manufactured from high-conductivity copper alloy and embedded in the die to provide passive thermal sink cooling in thick sections or isolated hot spots that drilled water circuits cannot reach.",
    benefits: [
      { icon: "zap", title: "Targeted Heat Extraction", desc: "Cooling delivered exactly where heat accumulates — at the pin tip or in thick casting sections — rather than relying on general die body temperature." },
      { icon: "shield", title: "Porosity Elimination", desc: "Jet coolers reduce shrinkage porosity in core zones. Copper chills promote directional solidification in thick sections to eliminate internal voids." },
      { icon: "clock", title: "Shorter Cycle Times", desc: "Effective hot-spot cooling enables faster solidification and shorter cooling dwell — reducing cycle time without compromising casting quality." },
      { icon: "check", title: "Die Life Extension", desc: "Reducing peak die temperatures at hot spots significantly extends die life by reducing the severity of thermal fatigue cycling." },
    ],
    process: [
      { num: 1, title: "Identify Hot Spots", desc: "Thermal analysis or process data identifies zones with excessive temperature" },
      { num: 2, title: "Solution Selection", desc: "Jet Cooler for pin hot spots; Copper Chill for thick-section solidification control" },
      { num: 3, title: "Design & Manufacture", desc: "Cooler or chill machined to precise dimensions for the specific application" },
      { num: 4, title: "Installation", desc: "Simple screw-in installation for Jet Coolers; press-fit pockets for Copper Chills" },
      { num: 5, title: "Commissioning", desc: "Flow rate and pressure verified for Jet Coolers; thermal response monitored for Copper Chills" },
    ],
    selectionGuide: [
      { product: "Jet Cooler", bestFor: "Cooling jet cool core pins in hot-spot zones — active cooling with water/air", key: "4 variants; easy screw-in installation" },
      { product: "Copper Chills", bestFor: "Thick-section solidification control where drill cooling is not feasible", key: "Passive; no plumbing; C110 high-conductivity copper" },
    ],
    industries: ["Automotive HPDC", "Gravity Die Casting (GDC)", "Low Pressure Die Casting (LPDC)", "Alloy Wheel Manufacturing"],
    faqs: [
      { q: "How does a jet cooler reduce shrinkage porosity?", a: "Shrinkage porosity in core zones occurs when the pin heats up excessively, slowing solidification at the core tip and creating a hot zone that solidifies last. By directing cooling water directly to the pin tip, the jet cooler accelerates local solidification, eliminating the thermal condition that causes porosity." },
      { q: "Does a copper chill require water connection?", a: "No. Copper chills operate as passive thermal sinks. The high thermal conductivity of copper (approximately 14× higher than H-13 tool steel) rapidly absorbs heat from the casting contact face and distributes it into the surrounding die mass between shots. For very demanding applications, a copper chill can also be drilled for direct water cooling." },
      { q: "Which Jet Cooler variant do I need?", a: "Variant selection depends on your jet cool pin outer diameter and your cooling manifold connection type. Contact us with these details and we will recommend the correct variant." },
    ],
  },

  dies: {
    subtitle: "HPDC, GDC, and LPDC permanent dies engineered for dimensional accuracy, long die life, and consistent casting quality",
    intro: "High-Pressure (HPDC), Gravity (GDC), and Low-Pressure Die Casting (LPDC) dies are permanent metal molds designed for high-volume production of aluminum castings. Vyankatesh Engineering manufactures complete die casting tooling, from engineering consultation through managed thermal processing, precision grinding, blue matching, and pre-delivery inspection.",
    whatAre: "HPDC dies operate under extreme pressure and thermal shock for very rapid, high-volume production. GDC dies rely on gravity to fill the cavity and are used for engine brackets, housings, and structural components requiring good surface finish. LPDC dies use low applied pressure to fill the die from below, promoting directional solidification for high-integrity castings with minimal porosity — ideal for alloy wheels and cylinder heads.",
    benefits: [
      { icon: "shield", title: "Long Die Life", desc: "H-13 tool steel with vacuum hardening and nitriding provides the thermal fatigue resistance and erosion resistance needed for extended die life." },
      { icon: "check", title: "Accurate Castings", desc: "Precision-ground parting lines and cavity dimensions produce castings that require minimal post-machining, reducing total part cost." },
      { icon: "zap", title: "No Flash", desc: "Blue-matched parting faces eliminate or minimize flash formation, reducing casting cleaning and finishing time." },
      { icon: "factory", title: "Engineering Input", desc: "We can contribute to gating, cooling, and thermal management design before manufacture, drawing on our experience with common aluminum alloys and die casting processes." },
    ],
    process: [
      { num: 1, title: "Design Review", desc: "Gate, runner, vent, and cooling circuit design reviewed before manufacture" },
      { num: 2, title: "CNC Machining", desc: "Cavity, core, and structural features rough and semi-finish machined" },
      { num: 3, title: "Vacuum Hardening", desc: "Heat treatment to 44–48 HRC with vacuum process for clean surfaces" },
      { num: 4, title: "Precision Grinding", desc: "Parting faces, cavity surfaces, and register faces ground to final dimensions" },
      { num: 5, title: "Die Polishing", desc: "Cavity surfaces polished to specified surface finish requirements" },
      { num: 6, title: "Blue Matching", desc: "Parting faces blue-matched to verify contact and prevent flash" },
      { num: 7, title: "Assembly & Inspection", desc: "Full die assembly check; cooling circuits pressure tested; dimensional inspection" },
    ],
    selectionGuide: [
      { product: "HPDC Die", bestFor: "High-volume aluminum casting for automotive, aerospace, and industrial sectors", key: "Thermal management; fast cycles; long die life" },
      { product: "GDC Die", bestFor: "Medium-volume aluminum castings where gravity filling is suitable — brackets, covers, housings", key: "Good surface finish; dimensional stability; long life" },
      { product: "LPDC Die", bestFor: "High-integrity castings requiring minimal porosity — alloy wheels, cylinder heads, pressure-tight parts", key: "Directional solidification; pressure-tight castings; X-ray quality" },
    ],
    industries: ["Automotive (Brackets, Housings, Wheels)", "Electrical Equipment & Switchgear", "Pump & Valve Manufacture", "Aerospace Structural Components", "General Engineering Foundry"],
    faqs: [
      { q: "What aluminium alloys are your GDC/LPDC dies suitable for?", a: "Our H-13 tool steel dies are primarily used for aluminum alloys (A356, A380, AlSi7Mg, and similar). With appropriate surface preparation and coatings, they can also be used for zinc-based alloys at lower production volumes." },
      { q: "Can you provide the die coating as well?", a: "We do not apply die coat (mold release) as a manufacturing process, but we can advise on appropriate die coat specifications based on the alloy and casting requirements." },
      { q: "What information do you need to quote a GDC or LPDC die?", a: "At minimum: casting 3D model or 2D drawings, alloy specification, target production volume, and any specific quality requirements (e.g., X-ray class, pressure test requirements). We will review the information and advise on any design for manufacturability improvements before confirming the quote." },
    ],
  },

  accessories: {
    subtitle: "Precision shot sleeves, sprue bushes, side core holders, and die casting accessories engineered for reliable, long-life performance",
    intro: "Die casting accessories — shot sleeves, sprue bushes, diffusers, and side core holders — are critical structural components that directly impact metal delivery quality, die service life, and casting cycle consistency. Vyankatesh Engineering manufactures the full range of die casting accessories from premium AISI H-13 / DIN 1.2344 tool steel, processed through the same rigorous manufacturing sequence as our die and insert products.",
    whatAre: "Shot sleeves are the metal containment cylinder in cold-chamber HPDC machines through which the shot plunger injects molten metal. Sprue bushes form the metal entry point in GDC and LPDC dies, connecting the pouring basin to the runner system. Diffusers are precision-fitted to the sprue bush to distribute incoming metal. Side core holders mount and align side cores (slides) in complex dies with undercut features.",
    benefits: [
      { icon: "shield", title: "H-13 Throughout", desc: "All accessories manufactured from the same certified H-13 / DIN 1.2344 used in our inserts and dies — consistent quality, same material traceability." },
      { icon: "check", title: "Precision Bore Quality", desc: "Shot sleeves honed to Ra ≤ 0.4μm for smooth plunger travel. Sprue bores precision-machined for clean, turbulence-free metal delivery." },
      { icon: "zap", title: "Thermal Balancing", desc: "Cooling configurations (integral, jacket, conformal) available for shot sleeves and sprue bushes to control metal temperature and solidification." },
      { icon: "factory", title: "Blue-Matched Interfaces", desc: "All die-seating faces blue-matched to confirm full contact area — preventing metal flash and leakage at mating joints." },
    ],
    process: [
      { num: 1, title: "Material", desc: "Certified AISI H-13 / DIN 1.2344 billet for all critical accessories" },
      { num: 2, title: "CNC Turning/Machining", desc: "Precision turning of bore, OD, and functional features" },
      { num: 3, title: "Vacuum Hardening", desc: "Full heat treatment to 44–48 HRC" },
      { num: 4, title: "Bore Grinding & Honing", desc: "Final bore finishing to specified tolerance and surface finish" },
      { num: 5, title: "Nitriding", desc: "Surface treatment on metal-contact surfaces for erosion resistance" },
      { num: 6, title: "Inspection", desc: "Bore roundness, straightness, surface finish, and hardness verified" },
    ],
    selectionGuide: [
      { product: "Shot Sleeve", bestFor: "Cold-chamber HPDC metal injection — fully or partially cooled", key: "H7 bore; Ra ≤ 0.4μm; 1 or 2 piece" },
      { product: "Sprue Bush & Diffuser", bestFor: "Metal entry in GDC/LPDC — 3 cooling options", key: "Blue-matched diffuser; H-13; nitrided bore" },
      { product: "Side Core Holder", bestFor: "Slide/side core mounting and alignment in HPDC dies", key: "CNC machined; all faces ground; CMM inspected" },
    ],
    industries: ["Automotive HPDC (Shot Sleeves)", "GDC & LPDC Foundries (Sprue Bushes)", "Die Casting Machine Builders", "Two-Wheeler Manufacturers"],
    faqs: [
      { q: "What is the difference between a fully cooled and partially cooled shot sleeve?", a: "A fully cooled sleeve has a water jacket around the full bore length. A partially cooled sleeve concentrates cooling at the pour hole zone to reduce premature solidification of the metal charge. The right choice depends on alloy type, machine parameters, and cycle time requirements." },
      { q: "How often do shot sleeves typically need replacing?", a: "Service life varies significantly with alloy type, machine parameters, and sleeve maintenance. With H-13 + nitriding and correct operating practice, a well-maintained sleeve can achieve 50,000–150,000 shots. Inspection of bore wear and surface condition should be scheduled periodically." },
      { q: "Can you supply replacement sleeves for imported machines?", a: "Yes. We can manufacture shot sleeves to match the bore diameter, length, and flange specification of any cold-chamber die casting machine. Provide the machine specification or a worn sleeve and we will manufacture the replacement." },
    ],
  },
};

// ── Helper: derive category data ─────────────────────────────────────────────
function getCategory(slug: string) {
  const publishedProducts = products.filter(p => p.isPublished);
  const categoryProducts = publishedProducts.filter(p => p.category.slug === slug);
  if (categoryProducts.length === 0) return null;
  return {
    slug,
    name: categoryProducts[0].category.name,
    products: categoryProducts.sort((a, b) => a.sortOrder - b.sortOrder),
    content: categoryContent[slug] || null,
  };
}

export function generateStaticParams() {
  const publishedProducts = products.filter(p => p.isPublished);
  const categorySlugs = new Set(publishedProducts.map(p => p.category.slug));
  return Array.from(categorySlugs).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory(params.slug);
  if (!category) return {};

  const cc = category.content;
  const title = `${category.name} Manufacturer in India | Vyankatesh Engineering`;
  const description = cc
    ? cc.intro.substring(0, 152) + '...'
    : `Browse precision-engineered ${category.name.toLowerCase()} for die casting and industrial manufacturing from Vyankatesh Engineering, Waluj MIDC.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com'}/categories/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const cc = category.content;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyankatesh.com';
  const url = `${baseUrl}/categories/${category.slug}`;

  // Other categories for cross-linking
  const allCategorySlugs = [...new Set(products.filter(p => p.isPublished).map(p => p.category.slug))];
  const otherCategories = allCategorySlugs
    .filter(s => s !== category.slug)
    .map(s => {
      const p = products.find(pr => pr.category.slug === s);
      return p ? { slug: s, name: p.category.name } : null;
    })
    .filter(Boolean) as { slug: string; name: string }[];

  // Structured Data
  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/#products` },
      { '@type': 'ListItem', position: 3, name: category.name, item: url },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — Vyankatesh Engineering`,
    url,
    numberOfItems: category.products.length,
    itemListElement: category.products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        url: `${baseUrl}/products/${p.slug}`,
        image: p.images[0] ? `${baseUrl}${p.images[0].url}` : undefined,
        brand: { '@type': 'Brand', name: settings.companyName },
      }
    })),
  };

  const faqSchema = cc && cc.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cc.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const schemas = [breadcrumbsSchema, itemListSchema, ...(faqSchema ? [faqSchema] : [])];

  const iconMap: Record<string, React.ReactNode> = {
    shield: <ShieldCheck size={24} />,
    zap: <Zap size={24} />,
    check: <CheckCircle2 size={24} />,
    settings: <Settings size={24} />,
    clock: <Clock size={24} />,
    factory: <Factory size={24} />,
  };

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
              <li aria-current="page" style={{ color: 'var(--neutral-900)', fontWeight: 500 }}>{category.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className={styles.catHero}>
        <div className="container">
          <p className={styles.catHeroLabel}>Product Category</p>
          <h1 className={styles.catHeroTitle}>{category.name}</h1>
          {cc && <p className={styles.catHeroSubtitle}>{cc.subtitle}</p>}
          <div className={styles.catHeroStats}>
            <div className={styles.catHeroStat}>
              <div className={styles.catHeroStatNum}>{category.products.length}</div>
              <div className={styles.catHeroStatLabel}>Products</div>
            </div>
            <div className={styles.catHeroStat}>
              <div className={styles.catHeroStatNum}>20+</div>
              <div className={styles.catHeroStatLabel}>Years Experience</div>
            </div>
            <div className={styles.catHeroStat}>
              <div className={styles.catHeroStatNum}>100%</div>
              <div className={styles.catHeroStatLabel}>In-House Manufacturing</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Category Introduction ── */}
      {cc && (
        <section className={styles.section} aria-labelledby="intro-heading">
          <div className="container">
            <p className={styles.sectionLabel}>Overview</p>
            <h2 className={styles.sectionHeading} id="intro-heading">What Are {category.name}?</h2>
            <p className={styles.sectionBody}>{cc.whatAre}</p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--neutral-600)', lineHeight: 1.8, maxWidth: '760px' }}>{cc.intro}</p>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      {cc && cc.benefits.length > 0 && (
        <section className={styles.sectionAlt} aria-labelledby="benefits-heading">
          <div className="container">
            <p className={styles.sectionLabel}>Why Choose Vyankatesh</p>
            <h2 className={styles.sectionHeading} id="benefits-heading">Benefits</h2>
            <div className={styles.benefitsGrid}>
              {cc.benefits.map((b, i) => (
                <div key={i} className={styles.benefitCard}>
                  <div className={styles.benefitIcon} aria-hidden="true">
                    {iconMap[b.icon] || <CheckCircle2 size={24} />}
                  </div>
                  <div className={styles.benefitTitle}>{b.title}</div>
                  <p className={styles.benefitDesc}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Manufacturing Process ── */}
      {cc && cc.process.length > 0 && (
        <section className={styles.section} aria-labelledby="process-heading">
          <div className="container">
            <p className={styles.sectionLabel}>How We Make Them</p>
            <h2 className={styles.sectionHeading} id="process-heading">Manufacturing Process</h2>
            <p className={styles.sectionBody}>
              Every {category.name.toLowerCase().replace(/s$/, '')} at Vyankatesh Engineering goes through a controlled, documented manufacturing sequence from certified raw material to finished, inspected component.
            </p>
            <div className={styles.processSteps}>
              {cc.process.map((step) => (
                <div key={step.num} className={styles.processStep}>
                  <div className={styles.processStepNum}>{step.num}</div>
                  <div className={styles.processStepTitle}>{step.title}</div>
                  <p className={styles.processStepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Products Grid ── */}
      <section className={styles.sectionAlt} aria-labelledby="products-heading">
        <div className="container">
          <p className={styles.sectionLabel}>Our Range</p>
          <h2 className={styles.sectionHeading} id="products-heading">
            {category.name} Products
          </h2>
          <p className={styles.sectionBody}>
            Browse our complete range of {category.name.toLowerCase()}. Each product page contains full technical specifications, material information, applications, and FAQ.
          </p>
          <div className={styles.productGrid}>
            {category.products.map(product => {
              const imgUrl = product.images[0]?.url || '';
              const imgAlt = product.images[0]?.alt || product.name;
              return (
                <Link href={`/products/${product.slug}`} key={product.id} className={styles.productCard}>
                  <div className={styles.productCardImage}>
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt={imgAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className={styles.productCardBody}>
                    <div className={styles.productCardName}>{product.name}</div>
                    <p className={styles.productCardDesc}>{product.description}</p>
                    <span className={styles.productCardLink}>
                      View Specifications <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Selection Guide ── */}
      {cc && cc.selectionGuide.length > 0 && (
        <section className={styles.section} aria-labelledby="selection-heading">
          <div className="container">
            <p className={styles.sectionLabel}>Buying Guide</p>
            <h2 className={styles.sectionHeading} id="selection-heading">Selection Guide</h2>
            <p className={styles.sectionBody}>
              Not sure which product is right for your application? Use this quick reference guide to identify the correct starting point.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.selectionTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Best For</th>
                    <th>Key Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {cc.selectionGuide.map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.product}</strong></td>
                      <td>{row.bestFor}</td>
                      <td>{row.key}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Industries ── */}
      {cc && cc.industries.length > 0 && (
        <section className={styles.sectionAlt} aria-labelledby="industries-heading">
          <div className="container">
            <p className={styles.sectionLabel}>Serving</p>
            <h2 className={styles.sectionHeading} id="industries-heading">Industries Served</h2>
            <div className={styles.industriesGrid}>
              {cc.industries.map(ind => (
                <span key={ind} className={styles.industryChip}>
                  <Factory size={14} aria-hidden="true" />
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {cc && cc.faqs.length > 0 && (
        <section className={styles.section} aria-labelledby="faq-heading">
          <div className="container" style={{ maxWidth: '800px' }}>
            <p className={styles.sectionLabel}>Expert Answers</p>
            <h2 className={styles.sectionHeading} id="faq-heading">Frequently Asked Questions</h2>
            <CategoryFaqAccordion faqs={cc.faqs} />
          </div>
        </section>
      )}

      {/* ── Related Categories ── */}
      {otherCategories.length > 0 && (
        <section className={styles.sectionAlt} aria-labelledby="related-cats-heading">
          <div className="container">
            <p className={styles.sectionLabel}>Browse More</p>
            <h2 className={styles.sectionHeading} id="related-cats-heading">Related Categories</h2>
            <div className={styles.catStrip}>
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
          <h2 className={styles.ctaBannerTitle}>Need Custom {category.name}?</h2>
          <p className={styles.ctaBannerDesc}>
            Share your drawing, specification, or sample and our engineering team will provide a tailored solution with competitive pricing.
          </p>
          <div className={styles.ctaBannerActions}>
            <LinkButton href="/#contact" variant="primary" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              <MessageSquare size={18} />
              Send Enquiry
            </LinkButton>
            <LinkButton href="/Vyankatesh-Engineering-Catalogue-v1.0.pdf" variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Download size={18} />
              Download Catalogue
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
