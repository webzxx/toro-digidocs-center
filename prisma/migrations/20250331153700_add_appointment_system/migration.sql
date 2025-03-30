-- Create Sequence
CREATE SEQUENCE appointment_number_seq;

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('DOCUMENT_PICKUP', 'SUBPOENA_MEETING');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW');

-- DropIndex
DROP INDEX "Resident_id_email_key";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "referenceNumber" TEXT NOT NULL DEFAULT concat('APPT-', to_char(nextval('appointment_number_seq'::regclass), 'FM00000'::text)),
    "userId" INTEGER NOT NULL,
    "residentId" INTEGER,
    "appointmentType" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "certificateRequestId" INTEGER,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_referenceNumber_key" ON "Appointment"("referenceNumber");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_certificateRequestId_fkey" FOREIGN KEY ("certificateRequestId") REFERENCES "CertificateRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
