/*
  Warnings:

  - Changed the type of `status` on the `Resident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOW', 'LEGALLY_SEPARATED', 'LIVING_IN', 'SEPARATED', 'DIVORCED');

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "status",
ADD COLUMN     "status" "CivilStatus" NOT NULL;
