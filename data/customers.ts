export interface Customer {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  isVisible: boolean;
  sortOrder: number;
}

export const customers: Customer[] = [
  {
    id: "cie-automotive",
    name: "CIE Automotive",
    logoUrl: "/customers/CIE%20Automotive%20logo.png",
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "endurance",
    name: "Endurance",
    logoUrl: "/customers/Endurance.png",
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "honda",
    name: "Honda",
    logoUrl: "/customers/Honda-motorcycle-logo.png",
    isVisible: true,
    sortOrder: 3
  },
  {
    id: "omr-bagla",
    name: "OMR Bagla",
    logoUrl: "/customers/OMR%20Bagla%20logo.png",
    isVisible: true,
    sortOrder: 4
  },
  {
    id: "rico",
    name: "Rico",
    logoUrl: "/customers/Rico.jpg",
    isVisible: true,
    sortOrder: 5
  },
  {
    id: "tvs",
    name: "TVS",
    logoUrl: "/customers/Tvs.jpg",
    isVisible: true,
    sortOrder: 6
  },
  {
    id: "dhoot-transmission",
    name: "Dhoot Transmission",
    logoUrl: "/customers/dhoot-transmission-logo.png",
    isVisible: true,
    sortOrder: 7
  },
  {
    id: "hero",
    name: "Hero MotoCorp",
    logoUrl: "/customers/hero-company-logo-design-template-d8e9143b1d27d179e29d33113f670703_screen.jpg",
    isVisible: true,
    sortOrder: 8
  },
  {
    id: "som-autotech",
    name: "SOM Autotech",
    logoUrl: "/customers/som-logo.png",
    isVisible: true,
    sortOrder: 9
  },
  {
    id: "varroc",
    name: "Varroc Group",
    logoUrl: "/customers/varroc-logo.jpg",
    isVisible: true,
    sortOrder: 10
  }
];
