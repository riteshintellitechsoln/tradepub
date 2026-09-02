"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportExcelButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  sheetName?: string;
}

export function ExportExcelButton<T extends Record<string, unknown>>({
  data,
  filename,
  sheetName = "Sheet1",
}: ExportExcelButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    if (data.length === 0) return;
    setIsExporting(true);

    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "TradeHub";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(sheetName);

      // const headers = Object.keys(data[0]);
      // worksheet.columns = headers.map((header) => ({
      //   header,
      //   key: header,
      //   width: Math.max(header.length + 6, 16),
      // }));

 if (data.length === 0) {
  return;
}

const firstRow = data[0];

if (!firstRow) {
  return;
}

const headers = Object.keys(firstRow);

worksheet.columns = headers.map((header) => ({
  header,
  key: header,
  width: Math.max(header.length + 6, 16),
}));

      data.forEach((row) => worksheet.addRow(row));

      const headerRow = worksheet.getRow(1);
      headerRow.height = 24;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF16234E" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FF0F1B3D" } },
        };
      });

      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        row.height = 20;
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          };
          cell.alignment = { vertical: "middle" };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF1F5F9" },
            };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `${filename}-${dateStamp}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return (
   <Button
  type="button"
  variant="outline"
  onClick={handleExport}
  disabled={data.length === 0 || isExporting}
  className="
    group relative overflow-hidden
    h-10 px-5
    rounded-lg
    border border-primary/30
    bg-background
    font-semibold
    shadow-[0_4px_0_0_hsl(var(--primary)/0.2),0_6px_15px_-5px_hsl(var(--primary)/0.4)]
    transition-all duration-300

    hover:-translate-y-1
    hover:border-primary
    hover:bg-primary
    hover:text-primary-foreground
    hover:shadow-[0_6px_0_0_hsl(var(--primary)/0.35),0_14px_28px_-8px_hsl(var(--primary)/0.5)]

    active:translate-y-[2px]
    active:shadow-[0_2px_0_0_hsl(var(--primary)/0.25)]

    disabled:pointer-events-none
    disabled:opacity-50
  "
>
  {/* Shine effect */}
  <span
    className="
      absolute inset-0
      -translate-x-full
      bg-gradient-to-r
      from-transparent
      via-white/20
      to-transparent
      transition-transform duration-700
      group-hover:translate-x-full
    "
  />

  {/* Button content */}
  <span className="relative z-10 flex items-center">
    {isExporting ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Download
        className="
          h-4 w-4
          transition-all duration-300
          group-hover:scale-110
          group-hover:-translate-y-0.5
        "
      />
    )}

    <span className="ml-2">
      {isExporting ? "Exporting..." : "Export to Excel"}
    </span>
  </span>
</Button>
  );
}