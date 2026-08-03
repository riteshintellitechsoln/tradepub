import { db } from "@/lib/db";
import { CompanyManager } from "@/components/admin/company-manager";

export default async function AdminCompaniesPage() {
  const companies = await db.company.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Publishers</h1>
      <CompanyManager companies={companies} />
    </div>
  );
}
