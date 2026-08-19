// import { db } from "@/lib/db";

// export async function getTopPublishers(limit = 8) {
//   return db.company.findMany({
//     where: { books: { some: { status: "PUBLISHED" } } },
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       logoUrl: true,
//       _count: { select: { books: { where: { status: "PUBLISHED" } } } },
//     },
//     orderBy: { books: { _count: "desc" } },
//     take: limit,
//   });
// }

// export type TopPublisher = Awaited<ReturnType<typeof getTopPublishers>>[number];