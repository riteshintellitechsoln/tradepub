// Plain responsive grid wrapper — reused for every book listing in the app
// (Home's three sections, Category pages in Module 10, Search in Module 11).
export function BookGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {children}
    </div>
  );
}
