export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  registeredAddress: string;
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
  registeredAddress: "C-252/3, Waluj MIDC,\nChhatrapati Sambhajinagar,\nMaharashtra, India",
  address: "C-106, Waluj MIDC,\nChhatrapati Sambhajinagar,\nMaharashtra, India",
  mapEmbedUrl: "https://maps.google.com/maps?q=19.837878,75.246699&z=15&output=embed",
  globalSeoDesc: "Precision manufacturing of high-quality industrial dies, gravity die casting (GDC) inserts, low pressure die casting (LPDC) inserts, core pins, and critical engineering components. Located in Waluj MIDC, Chhatrapati Sambhajinagar, Maharashtra.",
  socialLinks: {
    linkedin: "https://linkedin.com/company/vyankatesh-engineering",
  }
};

