/*
  Warnings:

  - You are about to drop the `BahayToroSystemIdSequence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferenceNumberSequence` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED');

-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN     "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "BahayToroSystemIdSequence";

-- DropTable
DROP TABLE "ReferenceNumberSequence";
