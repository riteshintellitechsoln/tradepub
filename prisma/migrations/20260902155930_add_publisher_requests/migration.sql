-- CreateEnum
CREATE TYPE "PublisherRequestStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PublisherRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "bookDescription" TEXT,
    "pdfFileKey" TEXT,
    "status" "PublisherRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublisherRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublisherRequest_status_idx" ON "PublisherRequest"("status");

-- CreateIndex
CREATE INDEX "PublisherRequest_createdAt_idx" ON "PublisherRequest"("createdAt");
