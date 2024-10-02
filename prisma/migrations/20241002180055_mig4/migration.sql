/*
  Warnings:

  - A unique constraint covering the columns `[referenceNumber]` on the table `CertificateRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[molinoSystemId]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN     "referenceNumber" TEXT NOT NULL DEFAULT concat('JPC-', to_char(nextval('reference_number_seq'), 'FM00000'));

-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "molinoSystemId" TEXT NOT NULL DEFAULT concat('MOLINO-IV-', to_char(nextval('molino_system_id_seq'), 'FM00000'));

-- CreateTable
CREATE TABLE "MolinoSystemIdSequence" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MolinoSystemIdSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceNumberSequence" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ReferenceNumberSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequest_referenceNumber_key" ON "CertificateRequest"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_molinoSystemId_key" ON "Resident"("molinoSystemId");
