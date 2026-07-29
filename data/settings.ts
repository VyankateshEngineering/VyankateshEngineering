export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  address: string;
  mapEmbedUrl: string;
  globalSeoDesc: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const settings: SiteSettings = {
  companyName: "Vyankatesh Engineering",
  contactEmail: "sales.vyankateshengg@gmail.com",
  address: "C-sector Near more Chowk, Waluj Midc -431136\nChhatrapati Sambhajinagar, India",
  mapEmbedUrl: "https://maps.google.com/maps?q=19.837878,75.246699&z=15&output=embed",
  globalSeoDesc: "Precision manufacturing of high-quality industrial dies, gravity die casting (GDC) inserts, low pressure die casting (LPDC) inserts, core pins, and critical engineering components. Located in Waluj MIDC, Chhatrapati Sambhajinagar, Maharashtra.",
  socialLinks: {
    linkedin: "https://linkedin.com/company/vyankatesh-engineering",
  }
};

