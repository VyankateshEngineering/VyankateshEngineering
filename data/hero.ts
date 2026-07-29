export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isVisible: boolean;
  sortOrder: number;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "precision-tooling",
    imageUrl: "/hero/precision-tooling.png", // Automatic folder loading fallback check
    title: "Precision Engineering & Tooling Solutions",
    subtitle: "Manufacturing high quality dies, inserts, core pins and critical engineering components for global industries.",
    ctaText: "View Products",
    ctaLink: "#products",
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "rapid-prototyping",
    imageUrl: "/hero/die-design.png",
    title: "Rapid Prototyping to Mass Production",
    subtitle: "Seamlessly scaling your precision tooling requirements from initial blueprint design to high-volume manufacturing.",
    ctaText: "Request a Consultation",
    ctaLink: "#contact",
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "quality-assurance",
    imageUrl: "/hero/iso-quality.png",
    title: "Uncompromising Quality Assurance",
    subtitle: "State-of-the-art inspection metrology and high-precision CNC machinery ensuring every component meets exacting tolerances.",
    ctaText: "Request a Quote",
    ctaLink: "#contact",
    isVisible: true,
    sortOrder: 3
  }
];
