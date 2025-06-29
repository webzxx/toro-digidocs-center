/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Resident_userId_key" ON "Resident"("userId");
