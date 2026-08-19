// import Link from "next/link";
// import type { BookFormat } from "@prisma/client";
// import { getFormatIcon } from "@/lib/format-icons";
// import { BOOK_FORMAT_OPTIONS } from "@/lib/constants";

// export function FormatScroller({
//   counts,
// }: {
//   counts: { format: BookFormat; count: number }[];
// }) {
//   return (
//     <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
//       {counts.map(({ format, count }) => {
//         const option = BOOK_FORMAT_OPTIONS.find((opt) => opt.value === format);
//         const Icon = getFormatIcon(format);
//         const label = option?.label ?? format;

//         return (
//           <Link
//             key={format}
//             href={`/search?format=${format}`}
//             className="group flex w-40 shrink-0 flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.25),0_8px_16px_-4px_rgba(22,35,78,0.15)] sm:w-auto"
//           >
//             <div className="relative flex h-10 w-10 items-center justify-center">
//               <div className="absolute inset-0 scale-100 rounded-full bg-primary/0 blur-md transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/30" />
//               <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
//                 <Icon className="h-5 w-5" />
//               </div>
//             </div>
//             <div className="relative mt-4">
//               <p className="font-display text-sm font-semibold leading-snug">{label}</p>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 {count} resource{count === 1 ? "" : "s"}
//               </p>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }