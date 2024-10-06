/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,email]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Resident_email_key";

-- AlterTable
ALTER TABLE "CertificateRequest" ALTER COLUMN "referenceNumber" SET DEFAULT concat('VVFJ-', to_char(nextval('reference_number_seq'), 'FM00000'));

-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "bahayToroSystemId" SET DEFAULT concat('BAHAY-TORO-', to_char(nextval('bahay_toro_system_id_seq'), 'FM00000'));

-- DropTable
DROP TABLE "Certificate";

-- CreateIndex
CREATE UNIQUE INDEX "Resident_id_email_key" ON "Resident"("id", "email");
