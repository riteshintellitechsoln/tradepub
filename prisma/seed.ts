import { PrismaClient, BookFormat, BookStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

// Seed scripts use their own PrismaClient instance (not the app singleton in
// src/lib/db.ts) since this runs standalone via `tsx`, outside the Next.js
// process, and should exit cleanly when done.
const prisma = new PrismaClient();

// ----------------------------------------------------------------------------
// 1. CATEGORIES — the exact 21 categories from the spec, in the given order.
// ----------------------------------------------------------------------------
const CATEGORIES = [
  "Information Technology",
  "Data Infrastructure",
  "Data Tools",
  "Desktops",
  "Laptops",
  "Enterprise Applications",
  "Networking",
  "Cloud",
  "Servers",
  "Security",
  "Software Development",
  "Storage",
  "Career",
  "Finance",
  "Healthcare",
  "Marketing",
  "Management",
  "Manufacturing",
  "Operations",
  "Sales",
  "HR",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ----------------------------------------------------------------------------
// 2. PUBLISHERS — sample vendor companies whose ebooks the platform hosts.
//    (Distinct from Leads' employers — see schema comments.)
// ----------------------------------------------------------------------------
const COMPANIES = [
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Cisco", domain: "cisco.com" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Amazon Web Services", domain: "aws.amazon.com" },
  { name: "Dell Technologies", domain: "dell.com" },
];

// ----------------------------------------------------------------------------
// 3. SAMPLE BOOKS — enough to populate Home/Category pages during development.
//    Cover images point at placeholder art; pdfFileKey points at a placeholder
//    R2 key — both get replaced with real uploads once Module 16 (Admin Panel)
//    ships the upload UI.
// ----------------------------------------------------------------------------
const SAMPLE_BOOKS: {
  title: string;
  description: string;
  companyName: string;
  categoryNames: string[];
  format: BookFormat;
  pages: number;
  isFeatured?: boolean;
  isTrending?: boolean;
}[] = [
  
  {
    title: "The Complete Guide to Zero Trust Security",
    description:
      "A practical framework for implementing zero trust architecture across hybrid and multi-cloud environments, with checklists for security teams at every maturity stage.",
    companyName: "Cisco",
    categoryNames: ["Security", "Networking"],
    format: BookFormat.EBOOK,
    pages: 42,
    isFeatured: true,
  },
  {
    title: "Modernizing Legacy Infrastructure with Hybrid Cloud",
    description:
      "How enterprise IT teams are migrating decades-old workloads to hybrid cloud without downtime, with real cost-benchmarking data from 200 migrations.",
    companyName: "IBM",
    categoryNames: ["Cloud", "Data Infrastructure"],
    format: BookFormat.WHITEPAPER,
    pages: 28,
    isTrending: true,
  },
  {
    title: "2026 State of Enterprise Data Tools",
    description:
      "An annual survey of 1,500 data engineers on the tools reshaping the modern data stack, from ingestion to warehousing to BI.",
    companyName: "Microsoft",
    categoryNames: ["Data Tools", "Data Infrastructure"],
    format: BookFormat.REPORT,
    pages: 56,
    isFeatured: true,
  },
  {
    title: "CRM Buyer's Guide for Growing Sales Teams",
    description:
      "What to evaluate before switching CRMs — integration depth, automation ceilings, and total cost of ownership across the leading platforms.",
    companyName: "Salesforce",
    categoryNames: ["Sales", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 34,
  },
  {
    title: "Serverless Architecture Patterns for Startups",
    description:
      "Battle-tested patterns for scaling serverless applications from first users to millions of requests per day, with cost-optimization case studies.",
    companyName: "Amazon Web Services",
    categoryNames: ["Cloud", "Software Development"],
    format: BookFormat.EBOOK,
    pages: 61,
    isTrending: true,
  },
  {
    title: "The IT Leader's Guide to Server Consolidation",
    description:
      "A cost-benefit playbook for consolidating on-premises server fleets ahead of a datacenter refresh cycle.",
    companyName: "Dell Technologies",
    categoryNames: ["Servers", "Storage"],
    format: BookFormat.WHITEPAPER,
    pages: 24,
  },
  {
    title: "Building a Career in Cybersecurity: 2026 Edition",
    description:
      "Certification paths, salary benchmarks, and hiring-manager interviews on what actually gets security candidates hired today.",
    companyName: "Cisco",
    categoryNames: ["Career", "Security"],
    format: BookFormat.REPORT,
    pages: 38,
  },
  {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
   {
    title: "Financial Planning Software: A CFO's Evaluation Framework",
    description:
      "How finance leaders are shortlisting FP&A platforms, with a weighted scorecard you can adapt for your own RFP.",
    companyName: "Microsoft",
    categoryNames: ["Finance", "Enterprise Applications"],
    format: BookFormat.GUIDE,
    pages: 30,
  },
  
  {
  title: "AI Transformation Strategy for Enterprises",
  description:
    "A complete guide for organizations adopting artificial intelligence, automation, and machine learning solutions.",
  companyName: "Microsoft",
  categoryNames: ["Software Development", "Data Tools"],
  format: BookFormat.EBOOK,
  pages: 72,
  isFeatured: true,
},

{
  title: "Cloud Migration Roadmap 2026",
  description:
    "Step-by-step cloud migration planning guide covering strategy, security, cost optimization, and implementation.",
  companyName: "Amazon Web Services",
  categoryNames: ["Cloud", "Data Infrastructure"],
  format: BookFormat.WHITEPAPER,
  pages: 55,
  isFeatured: true,
  isTrending: true,
},

{
  title: "Enterprise Network Security Handbook",
  description:
    "Learn modern network security practices including firewalls, zero trust, monitoring, and threat protection.",
  companyName: "Cisco",
  categoryNames: ["Security", "Networking"],
  format: BookFormat.GUIDE,
  pages: 80,
  isFeatured: true,
},

{
  title: "Data Analytics Modern Platform Guide",
  description:
    "Explore modern data analytics platforms, data pipelines, dashboards, and business intelligence solutions.",
  companyName: "IBM",
  categoryNames: ["Data Tools", "Data Infrastructure"],
  format: BookFormat.REPORT,
  pages: 64,
  isTrending: true,
},

{
  title: "Enterprise Application Modernization",
  description:
    "Strategies for upgrading legacy enterprise applications with modern architecture and cloud technologies.",
  companyName: "IBM",
  categoryNames: ["Enterprise Applications", "Cloud"],
  format: BookFormat.WHITEPAPER,
  pages: 48,
},

{
  title: "DevOps Automation Complete Guide",
  description:
    "A practical guide to CI/CD pipelines, automation tools, containers, and modern software delivery.",
  companyName: "Microsoft",
  categoryNames: ["Software Development", "Information Technology"],
  format: BookFormat.EBOOK,
  pages: 90,
  isFeatured: true,
},

{
  title: "Storage Infrastructure Planning Guide",
  description:
    "Learn enterprise storage solutions, backup strategies, and scalable infrastructure planning.",
  companyName: "Dell Technologies",
  categoryNames: ["Storage", "Servers"],
  format: BookFormat.GUIDE,
  pages: 45,
},

{
  title: "Cybersecurity Career Roadmap",
  description:
    "Complete career roadmap covering certifications, skills, and opportunities in cybersecurity.",
  companyName: "Cisco",
  categoryNames: ["Career", "Security"],
  format: BookFormat.REPORT,
  pages: 60,
  isTrending: true,
},

{
  title: "Financial Technology Trends 2026",
  description:
    "Explore fintech innovation, digital banking, automation, and financial technology trends.",
  companyName: "Salesforce",
  categoryNames: ["Finance", "Enterprise Applications"],
  format: BookFormat.REPORT,
  pages: 50,
},

{
  title: "Healthcare Technology Innovation Report",
  description:
    "Insights into healthcare IT systems, digital transformation, and technology adoption.",
  companyName: "Microsoft",
  categoryNames: ["Healthcare", "Information Technology"],
  format: BookFormat.WHITEPAPER,
  pages: 58,
},

{
  title: "Marketing Automation Strategy Guide",
  description:
    "Learn how businesses use automation platforms to improve marketing performance and customer engagement.",
  companyName: "Salesforce",
  categoryNames: ["Marketing", "Enterprise Applications"],
  format: BookFormat.GUIDE,
  pages: 44,
},

{
  title: "Leadership and Management Excellence",
  description:
    "A practical leadership guide for managers building high-performing teams.",
  companyName: "IBM",
  categoryNames: ["Management", "Career"],
  format: BookFormat.EBOOK,
  pages: 70,
},

{
  title: "Manufacturing Digital Transformation",
  description:
    "How smart factories use IoT, automation, and analytics to improve production.",
  companyName: "Dell Technologies",
  categoryNames: ["Manufacturing", "Information Technology"],
  format: BookFormat.WHITEPAPER,
  pages: 52,
},

{
  title: "Business Operations Optimization Guide",
  description:
    "Improve operational efficiency using technology, automation, and analytics.",
  companyName: "Microsoft",
  categoryNames: ["Operations", "Management"],
  format: BookFormat.GUIDE,
  pages: 46,
},

{
  title: "Modern Sales Enablement Handbook",
  description:
    "Strategies and tools for improving sales productivity and customer relationships.",
  companyName: "Salesforce",
  categoryNames: ["Sales", "Marketing"],
  format: BookFormat.EBOOK,
  pages: 62,
},

];

async function main() {
  console.log("Seeding categories...");
  const categoryRecords: Record<string, string> = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const name = CATEGORIES[i]!;
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: slugify(name),
        order: i,
        isActive: true,
      },
    });
    categoryRecords[name] = category.id;
  }
  console.log(`  -> ${CATEGORIES.length} categories ready`);

  // Categories and the admin account are real, needed data in every
  // environment. The sample publishers/books below are DEMO content —
  // useful for local dev so the site isn't empty, but wrong to seed into a
  // real production database. Module 20's deploy runbook sets
  // SEED_SAMPLE_DATA=false for the production seed run.
  const shouldSeedSampleData = process.env.SEED_SAMPLE_DATA !== "false";

  if (shouldSeedSampleData) {
    console.log("Seeding publisher companies...");
    const companyRecords: Record<string, string> = {};
    for (const company of COMPANIES) {
      const record = await prisma.company.upsert({
        where: { slug: slugify(company.name) },
        update: {},
        create: {
          name: company.name,
          slug: slugify(company.name),
          domain: company.domain,
          website: `https://${company.domain}`,
        },
      });
      companyRecords[company.name] = record.id;
    }
    console.log(`  -> ${COMPANIES.length} companies ready`);

    console.log("Seeding sample books...");
    for (const book of SAMPLE_BOOKS) {
      const slug = slugify(book.title);
      const existing = await prisma.book.findUnique({ where: { slug } });
      if (existing) continue;

      const created = await prisma.book.create({
        data: {
          title: book.title,
          slug,
          description: book.description,
          shortDescription: book.description.slice(0, 120) + "...",
          coverImageUrl: `https://placehold.co/400x520/1e293b/ffffff?text=${encodeURIComponent(
            book.title.split(" ").slice(0, 3).join(" "),
          )}`,
          pdfFileKey: `placeholders/${slug}.pdf`,
          pages: book.pages,
          format: book.format,
          status: BookStatus.PUBLISHED,
          isFeatured: book.isFeatured ?? false,
          isTrending: book.isTrending ?? false,
          publishedAt: new Date(),
          companyId: companyRecords[book.companyName]!,
        },
      });

      for (const categoryName of book.categoryNames) {
        const categoryId = categoryRecords[categoryName];
        if (!categoryId) continue;
        await prisma.bookCategory.create({
          data: { bookId: created.id, categoryId },
        });
      }
    }
    console.log(`  -> ${SAMPLE_BOOKS.length} books ready`);
  } else {
    console.log("Skipping sample companies/books (SEED_SAMPLE_DATA=false).");
  }

  console.log("Seeding default Super Admin...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@tradehub.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe@123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`  -> Admin ready: ${adminEmail}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(
      `  -> Using default password "${adminPassword}" — set SEED_ADMIN_PASSWORD in .env and re-seed before deploying.`,
    );
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
