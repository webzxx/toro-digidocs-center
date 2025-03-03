-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'LGBTQ');

-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOW', 'LEGALLY_SEPARATED', 'LIVING_IN', 'SEPARATED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('CATHOLIC', 'IGLESIA_NI_CRISTO', 'AGLIPAY', 'BAPTIST', 'DATING_DAAN', 'ISLAM', 'JEHOVAHS_WITNESSES', 'OTHERS');

-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('SOLO_PARENT', 'PWD', 'SENIOR_CITIZEN', 'INDIGENT_INDIGENOUS_PEOPLE');

-- CreateEnum
CREATE TYPE "ResidencyType" AS ENUM ('HOME_OWNER', 'TENANT', 'HELPER', 'CONSTRUCTION_WORKER');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('BARANGAY_CLEARANCE', 'BARANGAY_ID', 'SOLO_PARENT', 'COHABITATION', 'GOOD_MORAL', 'NO_INCOME', 'FIRST_TIME_JOB_SEEKER', 'RESIDENCY', 'TRANSFER_OF_RESIDENCY', 'LIVING_STILL', 'BIRTH_FACT');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" SERIAL NOT NULL,
    "bahayToroSystemId" TEXT NOT NULL DEFAULT concat('BAHAY-TORO-', to_char(nextval('bahay_toro_system_id_seq'::regclass), 'FM00000'::text)),
    "precinctNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "contact" TEXT NOT NULL,
    "religion" "Religion",
    "status" "CivilStatus" NOT NULL,
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
    "yearsInBahayToro" INTEGER,
    "blockLot" TEXT,
    "phase" TEXT,
    "street" TEXT,
    "subdivision" TEXT NOT NULL,
    "barangay" TEXT NOT NULL DEFAULT 'Bahay Toro',
    "city" TEXT NOT NULL DEFAULT 'Quezon City',
    "province" TEXT NOT NULL DEFAULT 'Metro Manila',

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" SERIAL NOT NULL,
    "referenceNumber" TEXT NOT NULL DEFAULT concat('VVFJ-', to_char(nextval('reference_number_seq'::regclass), 'FM00000'::text)),
    "residentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "certificateType" "CertificateType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "additionalInfo" JSONB,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_bahayToroSystemId_key" ON "Resident"("bahayToroSystemId");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_id_email_key" ON "Resident"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_residentId_key" ON "EmergencyContact"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_residentId_key" ON "Address"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequest_referenceNumber_key" ON "CertificateRequest"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProofOfIdentity_residentId_key" ON "ProofOfIdentity"("residentId");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfIdentity" ADD CONSTRAINT "ProofOfIdentity_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
