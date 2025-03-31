/*
  Warnings:

  - Added the required column `preferredDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredTimeSlot` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('MORNING', 'AFTERNOON');

-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'REQUESTED';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "preferredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "preferredTimeSlot" "TimeSlot" NOT NULL,
ALTER COLUMN "scheduledDateTime" DROP NOT NULL;
