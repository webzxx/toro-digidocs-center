/*
  Warnings:

  - You are about to drop the column `updateUt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'LGBTQ');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('CATHOLIC', 'IGLESIA_NI_CRISTO', 'AGLIPAY', 'BAPTIST', 'DATING_DAAN', 'ISLAM', 'JEHOVAHS_WITNESSES', 'OTHERS');

-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('SOLO_PARENT', 'PWD', 'SENIOR_CITIZEN', 'INDIGENT_INDIGENOUS_PEOPLE');

-- CreateEnum
CREATE TYPE "ResidencyType" AS ENUM ('HOME_OWNER', 'TENANT', 'HELPER', 'CONSTRUCTION_WORKER');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('BARANGAY_CLEARANCE', 'BARANGAY_ID', 'SOLO_PARENT', 'COHABITATION', 'GOOD_MORAL', 'NO_INCOME', 'FIRST_TIME_JOB_SEEKER', 'RESIDENCY', 'TRANSFER_OF_RESIDENCY', 'LIVING_STILL', 'BIRTH_FACT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updateUt",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Resident" (
    "id" SERIAL NOT NULL,
    "precinctNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "contact" TEXT NOT NULL,
    "religion" "Religion",
    "status" TEXT NOT NULL,
    "sector" "Sector",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "residencyType" "ResidencyType" NOT NULL,
    "yearsInMolinoIV" INTEGER NOT NULL,
    "blockLot" TEXT,
    "phase" TEXT,
    "street" TEXT NOT NULL,
    "subdivision" TEXT NOT NULL,
    "barangay" TEXT NOT NULL DEFAULT 'Molino IV',
    "city" TEXT NOT NULL DEFAULT 'Bacoor',
    "province" TEXT NOT NULL DEFAULT 'Cavite',

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "certificateType" "CertificateType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "additionalInfo" JSONB,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofOfIdentity" (
    "id" SERIAL NOT NULL,
    "residentId" INTEGER NOT NULL,
    "signaturePath" TEXT NOT NULL,
    "idPhoto1Path" TEXT NOT NULL,
    "idPhoto2Path" TEXT NOT NULL,
    "holdingIdPhoto1Path" TEXT NOT NULL,
    "holdingIdPhoto2Path" TEXT NOT NULL,

    CONSTRAINT "ProofOfIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resident_email_key" ON "Resident"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_residentId_key" ON "EmergencyContact"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_residentId_key" ON "Address"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProofOfIdentity_residentId_key" ON "ProofOfIdentity"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_email_key" ON "Certificate"("email");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfIdentity" ADD CONSTRAINT "ProofOfIdentity_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
