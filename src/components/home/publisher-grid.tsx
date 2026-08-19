// import Link from "next/link";
// import Image from "next/image";
// import { Building2 } from "lucide-react";
// import type { TopPublisher } from "@/actions/companies";

// export function PublisherGrid({ publishers }: { publishers: TopPublisher[] }) {
//   return (
//     <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
//       {publishers.map((publisher) => (
//         <Link
//           key={publisher.id}
//           href={`/search?company=${publisher.id}`}
//           className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.25),0_8px_16px_-4px_rgba(22,35,78,0.15)]"
//         >
//           <div className="relative flex h-12 w-12 items-center justify-center">
//             <div className="absolute inset-0 scale-100 rounded-full bg-primary/0 blur-md transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/30" />
//             <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-background">
//               {publisher.logoUrl ? (
//                 <Image
//                   src={publisher.logoUrl}
//                   alt={publisher.name}
//                   fill
//                   sizes="48px"
//                   className="object-contain p-1"
//                 />
//               ) : (
//                 <Building2 className="h-5 w-5 text-primary" />
//               )}
//             </div>
//           </div>
//           <p className="line-clamp-1 text-xs font-semibold">{publisher.name}</p>
//           <p className="text-[11px] text-muted-foreground">
//             {publisher._count.books} resource{publisher._count.books === 1 ? "" : "s"}
//           </p>
//         </Link>
//       ))}
//     </div>
//   );
// }