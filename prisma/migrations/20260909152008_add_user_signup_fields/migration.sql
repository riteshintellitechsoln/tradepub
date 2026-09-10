/*
  Warnings:

  - You are about to drop the column `firstName` on the `PublisherRequest` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `PublisherRequest` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetTokenExpiresAt` on the `PublisherRequest` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetTokenHash` on the `PublisherRequest` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `PublisherRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PublisherRequest" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "passwordResetTokenExpiresAt",
DROP COLUMN "passwordResetTokenHash",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetTokenHash" TEXT,
ADD COLUMN     "phone" TEXT;
