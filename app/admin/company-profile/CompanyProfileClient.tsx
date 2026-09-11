"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertCompanyProfile } from "./actions";

type InitialData = {
  id: string;
  name: string;
  description: string;
  foundedYear: number | null;
  address: Record<string, unknown> | null;
  geo: Record<string, unknown> | null;
  contact: Record<string, unknown> | null;
  capabilities: string[];
  processes: { title: string; desc?: string; description?: string }[] | null;
  industries: string[];
};

export default function CompanyProfileClient({ initialData, isNew }: { initialData: InitialData; isNew: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [foundedYear, setFoundedYear] = useState(initialData.foundedYear?.toString() ?? "");
  const [addressJson, setAddressJson] = useState(JSON.stringify(initialData.address ?? { street: "C-252/3, Waluj MIDC", locality: "Chhatrapati Sambhajinagar", region: "Maharashtra", postalCode: "431136", country: "IN" }, null, 2));
  const [geoJson, setGeoJson] = useState(JSON.stringify(initialData.geo ?? { lat: 19.837878, lng: 75.246699 }, null, 2));
  const [contactJson, setContactJson] = useState(JSON.stringify(initialData.contact ?? { email: "sales.vyankateshengg@gmail.com", phone: "", mapEmbedUrl: "https://maps.google.com/maps?q=19.837878,75.246699&z=15&output=embed" }, null, 2));
  const [capabilities, setCapabilities] = useState<string[]>(initialData.capabilities.length ? initialData.capabilities : ["Precision CNC turning & milling"]);
  const [capInput, setCapInput] = useState("");
  const [processesJson, setProcessesJson] = useState(JSON.stringify(initialData.processes ?? [{ title: "CNC Machining", desc: "VMC + Turning" }], null, 2));
  const [industries, setIndustries] = useState<string[]>(initialData.industries);
  const [indInput, setIndInput] = useState("");

  const addCap = () => {
    const t = capInput.trim();
    if (!t) return;
    setCapabilities((v) => [...v, t]);
    setCapInput("");
  };
  const removeCap = (idx: number) => setCapabilities((v) => v.filter((_, i) => i !== idx));

  const addInd = () => {
    const t = indInput.trim();
    if (!t) return;
    setIndustries((v) => [...v, t]);
    setIndInput("");
  };
  const removeInd = (idx: number) => setIndustries((v) => v.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validate JSON fields client-side before sending
    let address: unknown = null;
    let geo: unknown = null;
    let contact: unknown = null;
    let processes: unknown = null;
    try {
      address = addressJson.trim() ? JSON.parse(addressJson) : null;
    } catch {
      setError("Address must be valid JSON: { street, locality, region, postalCode, country }");
      setSaving(false);
      return;
    }
    try {
      geo = geoJson.trim() ? JSON.parse(geoJson) : null;
    } catch {
      setError("Geo must be valid JSON: { lat, lng }");
      setSaving(false);
      return;
    }
    try {
      contact = contactJson.trim() ? JSON.parse(contactJson) : null;
    } catch {
      setError("Contact must be valid JSON: { email, phone, mapEmbedUrl }");
      setSaving(false);
      return;
    }
    try {
      processes = processesJson.trim() ? JSON.parse(processesJson) : null;
    } catch {
      setError("Processes must be valid JSON: [{title, desc}]");
      setSaving(false);
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      foundedYear: foundedYear.trim() ? parseInt(foundedYear, 10) : null,
      address,
      geo,
      contact,
      capabilities,
      processes,
      industries,
    };

    // Use FormData for server action to demonstrate JSON parsing + zod validation server-side
    const fd = new FormData();
    fd.set("name", String(payload.name));
    fd.set("description", String(payload.description));
    fd.set("foundedYear", payload.foundedYear != null ? String(payload.foundedYear) : "");
    fd.set("address", JSON.stringify(payload.address));
    fd.set("geo", JSON.stringify(payload.geo));
    fd.set("contact", JSON.stringify(payload.contact));
    fd.set("capabilities", JSON.stringify(payload.capabilities));
    fd.set("processes", JSON.stringify(payload.processes));
    fd.set("industries", JSON.stringify(payload.industries));

    try {
      const res = await upsertCompanyProfile(fd);
      if ((res as { success: boolean }).success) {
        setSuccess(`Saved — revalidateTag('company') + revalidatePath('/company-profile', '/', '/about', '/sitemap.xml')`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">{success}</div>}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Vyankatesh Engineering" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Company description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
            <input type="number" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="2003" min={1800} max={2100} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Json</label>
            <textarea value={addressJson} onChange={(e) => setAddressJson(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" placeholder='{"street": "...", "locality": "...", "region": "...", "postalCode": "...", "country": "IN"}' />
            <p className="mt-1 text-xs text-gray-500">{`{ street, locality, region, postalCode, country }`}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geo Json</label>
            <textarea value={geoJson} onChange={(e) => setGeoJson(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" placeholder='{"lat": 19.837878, "lng": 75.246699}' />
            <p className="mt-1 text-xs text-gray-500">{`{ lat, lng }`}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Json</label>
            <textarea value={contactJson} onChange={(e) => setContactJson(e.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" placeholder='{"email": "...", "phone": "...", "mapEmbedUrl": "..."}' />
            <p className="mt-1 text-xs text-gray-500">{`{ email, phone, mapEmbedUrl }`}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capabilities String[]</label>
          <div className="flex gap-2">
            <input value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCap(); } }} placeholder="Add capability and press Enter" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <button type="button" onClick={addCap} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {capabilities.map((c, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-900">
                {c}
                <button type="button" onClick={() => removeCap(idx)} className="ml-1 rounded-full hover:bg-blue-100 px-1">×</button>
              </span>
            ))}
            {capabilities.length === 0 && <span className="text-xs text-gray-400">No capabilities yet</span>}
          </div>
          <p className="mt-1 text-xs text-gray-500">String[] — e.g. CNC Machining, Wire EDM, etc. Sent as JSON array stringified in FormData, validated via zod.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Processes Json</label>
          <textarea value={processesJson} onChange={(e) => setProcessesJson(e.target.value)} rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono" placeholder='[{"title": "CNC Machining", "desc": "VMC + Turning"}, {"title": "Heat Treatment", "desc": "Vacuum hardening"}]' />
          <p className="mt-1 text-xs text-gray-500">{`Json [{title, desc}]`}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industries String[]</label>
          <div className="flex gap-2">
            <input value={indInput} onChange={(e) => setIndInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInd(); } }} placeholder="Add industry and press Enter (e.g. Automotive)" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <button type="button" onClick={addInd} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {industries.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-900">
                {tag}
                <button type="button" onClick={() => removeInd(idx)} className="ml-1 rounded-full hover:bg-amber-100 px-1">×</button>
              </span>
            ))}
            {industries.length === 0 && <span className="text-xs text-gray-400">No industries yet</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#1a365d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#122a4a] disabled:opacity-50">
          {saving ? "Saving..." : isNew ? "Create Company Profile" : "Save Company Profile"}
        </button>
        <span className="ml-auto text-xs text-gray-500">Server action <code>upsertCompanyProfile</code> — zod validated, revalidateTag(&apos;company&apos;) + /company-profile, /, /about, /sitemap.xml</span>
      </div>
    </form>
  );
}
