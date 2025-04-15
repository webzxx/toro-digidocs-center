-- DropIndex
DROP INDEX "Payment_certificateRequestId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
