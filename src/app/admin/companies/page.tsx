import { db } from "@/lib/db";
import { CompanyManager } from "@/components/admin/company-manager";
import { ExportExcelButton } from "@/components/admin/export-excel-button";

export default async function AdminCompaniesPage() {
  const companies = await db.company.findMany({ orderBy: { name: "asc" } });

  const exportData = companies.map((c) => ({
    Name: c.name,
    Slug: c.slug,
    Domain: c.domain ?? "",
    Website: c.website ?? "",
    About: c.about ?? "",
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Publishers</h1>
        <ExportExcelButton data={exportData} filename="publishers-export" sheetName="Publishers" />
      </div>
      <CompanyManager companies={companies} />
    </div>
  );
}