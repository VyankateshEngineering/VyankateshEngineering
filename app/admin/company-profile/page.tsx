import { prisma } from "@/lib/db";
import CompanyProfileClient from "./CompanyProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Company Profile | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default async function AdminCompanyProfilePage() {
  const profile = await prisma.companyProfile.findFirst({ orderBy: { createdAt: "asc" } });

  // Provide fallback default if no profile exists yet
  const initialData = profile
    ? {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        foundedYear: profile.foundedYear ?? null,
        address: profile.address as Record<string, unknown> | null,
        geo: profile.geo as Record<string, unknown> | null,
        contact: profile.contact as Record<string, unknown> | null,
        capabilities: profile.capabilities ?? [],
        processes: profile.processes as unknown as { title: string; desc?: string; description?: string }[] | null,
        industries: profile.industries ?? [],
      }
    : {
        id: "",
        name: "Vyankatesh Engineering",
        description: "Precision manufacturer of die casting tooling components — core pins, profile inserts, HPDC inserts, shot sleeves, sprue bushes, GDC dies, LPDC dies, and copper chills. Located in Waluj MIDC, Chhatrapati Sambhajinagar, Maharashtra.",
        foundedYear: 2003,
        address: { street: "C-252/3, Waluj MIDC", locality: "Chhatrapati Sambhajinagar", region: "Maharashtra", postalCode: "431136", country: "IN" },
        geo: { lat: 19.837878, lng: 75.246699 },
        contact: { email: "sales.vyankateshengg@gmail.com", phone: "", mapEmbedUrl: "https://maps.google.com/maps?q=19.837878,75.246699&z=15&output=embed" },
        capabilities: ["Precision CNC turning & milling", "VMC Machining", "Wire EDM & Sink EDM"],
        processes: [{ title: "CNC Machining", desc: "VMC + Turning" }],
        industries: ["Automotive", "General Engineering"],
      };

  const isNew = !profile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Company Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Single <code>CompanyProfile</code> edit — fields: name, description, foundedYear, address Json <code>{`{ street, locality, region, postalCode, country }`}</code>, geo Json <code>{`{ lat, lng }`}</code>, contact Json <code>{`{ email, phone, mapEmbedUrl }`}</code>, capabilities String[], processes Json <code>{`[{title, desc}]`}</code>, industries String[]. Uses server actions + <code>revalidateTag(&apos;company&apos;)</code> + <code>revalidatePath(&apos;/company-profile&apos;, &apos;/&apos;, &apos;/about&apos;)</code>.
          {isNew && <span className="ml-2 inline-flex rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">No profile yet — will create on save</span>}
        </p>
      </div>

      <CompanyProfileClient initialData={initialData} isNew={isNew} />
    </div>
  );
}
