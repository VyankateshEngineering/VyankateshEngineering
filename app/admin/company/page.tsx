import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Company | Admin | Vyankatesh Engineering",
  robots: { index: false, follow: false },
};

export default function AdminCompanyRedirect() {
  redirect("/admin/company-profile");
}
