-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CertificateStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "CertificateStatus" ADD VALUE 'AWAITING_PAYMENT';
ALTER TYPE "CertificateStatus" ADD VALUE 'READY_FOR_PICKUP';
ALTER TYPE "CertificateStatus" ADD VALUE 'CANCELLED';
