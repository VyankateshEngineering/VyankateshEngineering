"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidateTag, revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateCompanyPaths() {
  revalidateTag("company");
  try {
    revalidatePath("/company-profile");
    revalidatePath("/about");
    revalidatePath("/");
    revalidatePath("/admin/company-profile");
    revalidatePath("/admin/company");
    revalidatePath("/sitemap.xml");
  } catch {}
}

// ── zod schemas ───────────────────────────────────────────────────────────

const addressSchema = z
  .object({
    street: z.string().optional(),
    locality: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  })
  .passthrough()
  .optional()
  .nullable();

const geoSchema = z
  .object({
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
  })
  .passthrough()
  .optional()
  .nullable();

const contactSchema = z
  .object({
    email: z.string().email().optional().or(z.string().max(200).optional()),
    phone: z.string().optional(),
    mapEmbedUrl: z.string().url().optional().or(z.string().max(500).optional()),
  })
  .passthrough()
  .optional()
  .nullable();

const processItemSchema = z.object({
  title: z.string().min(1),
  desc: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

const companyProfileSchema = z.object({
  name: z.string().min(2, "Name required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(10000),
  foundedYear: z.coerce.number().int().min(1800).max(2100).optional().nullable(),
  address: addressSchema,
  geo: geoSchema,
  contact: contactSchema,
  capabilities: z.array(z.string()).optional().default([]),
  processes: z.array(processItemSchema).optional().nullable(),
  industries: z.array(z.string()).optional().default([]),
});

type CompanyProfileInput = z.infer<typeof companyProfileSchema>;

function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function extractCompanyInput(input: FormData | Record<string, unknown>): CompanyProfileInput {
  const parseArrayFromJsonOrLines = (raw: unknown): string[] => {
    if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string") as string[];
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return [];
      try {
        const p = JSON.parse(trimmed);
        if (Array.isArray(p)) return p.filter((x) => typeof x === "string") as string[];
      } catch {}
      return trimmed
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const parseProcesses = (raw: unknown): z.infer<typeof processItemSchema>[] | null => {
    if (!raw) return null;
    if (Array.isArray(raw)) return raw as z.infer<typeof processItemSchema>[];
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      try {
        const p = JSON.parse(trimmed);
        if (Array.isArray(p)) return p;
      } catch {}
      // fallback: lines "title: desc"
      const items: z.infer<typeof processItemSchema>[] = [];
      trimmed.split("\n").forEach((line) => {
        const idx = line.indexOf(":");
        if (idx > 0) {
          const title = line.slice(0, idx).trim();
          const desc = line.slice(idx + 1).trim();
          if (title) items.push({ title, desc });
        } else if (line.trim()) {
          items.push({ title: line.trim(), desc: "" });
        }
      });
      return items.length ? items : null;
    }
    if (typeof raw === "object") return [raw as z.infer<typeof processItemSchema>];
    return null;
  };

  if (typeof FormData !== "undefined" && input instanceof FormData) {
    const fd = input as FormData;
    const get = (k: string) => {
      const v = fd.get(k);
      return v === null ? undefined : String(v);
    };

    const name = get("name")?.trim() ?? "";
    const description = get("description")?.trim() ?? "";
    const foundedYearRaw = get("foundedYear");
    let foundedYear: number | null = null;
    if (foundedYearRaw && foundedYearRaw.trim() !== "") {
      const n = parseInt(foundedYearRaw, 10);
      if (Number.isFinite(n)) foundedYear = n;
    }

    const addressRaw = get("address");
    const geoRaw = get("geo");
    const contactRaw = get("contact");
    const capabilitiesRaw = get("capabilities");
    const processesRaw = get("processes");
    const industriesRaw = get("industries");

    return {
      name,
      description,
      foundedYear,
      address: addressRaw ? parseJsonField<Record<string, unknown> | null>(addressRaw, null) as z.infer<typeof addressSchema> : null,
      geo: geoRaw ? parseJsonField<Record<string, unknown> | null>(geoRaw, null) as z.infer<typeof geoSchema> : null,
      contact: contactRaw ? parseJsonField<Record<string, unknown> | null>(contactRaw, null) as z.infer<typeof contactSchema> : null,
      capabilities: parseArrayFromJsonOrLines(capabilitiesRaw),
      processes: parseProcesses(processesRaw),
      industries: parseArrayFromJsonOrLines(industriesRaw),
    };
  }

  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    return {
      name: String(obj.name ?? "").trim(),
      description: String(obj.description ?? "").trim(),
      foundedYear: obj.foundedYear != null && String(obj.foundedYear).trim() !== "" ? parseInt(String(obj.foundedYear), 10) : null,
      address: (obj.address as z.infer<typeof addressSchema>) ?? null,
      geo: (obj.geo as z.infer<typeof geoSchema>) ?? null,
      contact: (obj.contact as z.infer<typeof contactSchema>) ?? null,
      capabilities: parseArrayFromJsonOrLines(obj.capabilities),
      processes: parseProcesses(obj.processes),
      industries: parseArrayFromJsonOrLines(obj.industries),
    };
  }

  throw new Error("Invalid input");
}

// ── actions ───────────────────────────────────────────────────────────────

export async function getCompanyProfile() {
  await requireAdmin();
  const profile = await prisma.companyProfile.findFirst({ orderBy: { createdAt: "asc" } });
  return profile;
}

export async function upsertCompanyProfile(input: FormData | Record<string, unknown>) {
  await requireAdmin();
  const parsed = extractCompanyInput(input);
  const data = companyProfileSchema.parse(parsed);

  const existing = await prisma.companyProfile.findFirst();

  // Normalize geo: prefer lat/lng, but accept latitude/longitude
  let geoToStore: Record<string, unknown> | null | undefined = data.geo as unknown as Record<string, unknown> | null;
  if (geoToStore && typeof geoToStore === "object") {
    const g = geoToStore as Record<string, unknown>;
    if (g.latitude != null && g.lat == null) g.lat = g.latitude;
    if (g.longitude != null && g.lng == null) g.lng = g.longitude;
  }

  const payload = {
    name: data.name,
    description: data.description,
    foundedYear: data.foundedYear ?? null,
    address: (data.address ?? undefined) as never,
    geo: (geoToStore ?? undefined) as never,
    contact: (data.contact ?? undefined) as never,
    capabilities: data.capabilities ?? [],
    processes: (data.processes ?? undefined) as never,
    industries: data.industries ?? [],
  };

  let result;
  if (existing) {
    result = await prisma.companyProfile.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    result = await prisma.companyProfile.create({
      data: payload,
    });
  }

  revalidateCompanyPaths();
  return { success: true as const, profile: result };
}

// Alias for single CompanyProfile edit – matches spec naming
export async function updateCompanyProfile(input: FormData | Record<string, unknown>) {
  return upsertCompanyProfile(input);
}

export async function deleteCompanyProfile() {
  await requireAdmin();
  const existing = await prisma.companyProfile.findFirst();
  if (!existing) throw new Error("Company profile not found");
  await prisma.companyProfile.delete({ where: { id: existing.id } });
  revalidateCompanyPaths();
  return { success: true as const };
}
