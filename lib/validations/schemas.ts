import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  productRef: z.string().optional(),
  captchaToken: z.string().min(1, "Captcha token is required"),
});

export const productSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  applications: z.string().optional(),
  specs: z.record(z.string(), z.string()).optional(), // Simple JSON object validation
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export const gallerySchema = z.object({
  cloudinaryId: z.string(),
  url: z.string().url(),
  category: z.string().optional(),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const slideSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  cloudinaryId: z.string(),
  imageUrl: z.string().url(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const customerLogoSchema = z.object({
  name: z.string().min(1),
  cloudinaryId: z.string(),
  logoUrl: z.string().url(),
  website: z.string().url().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const seoMetadataSchema = z.object({
  pagePath: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
});

export const siteSettingsSchema = z.object({
  companyName: z.string().min(1),
  contactEmail: z.string().email().optional(),
  address: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  globalSeoDesc: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
});

