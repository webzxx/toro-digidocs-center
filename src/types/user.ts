import { Prisma } from "@prisma/client";

// #region Appointment dashboard
// Define Prisma type for appointments with relations for user dashboard
export const userAppointmentWithRelations = Prisma.validator<Prisma.AppointmentDefaultArgs>()({
  include: {
    resident: true,
  },
});

export type UserAppointment = Prisma.AppointmentGetPayload<typeof userAppointmentWithRelations>;

// Define Prisma type for residents for appointment form
export const userResidentForAppointment = Prisma.validator<Prisma.ResidentDefaultArgs>()({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    bahayToroSystemId: true,
  },
});

export type UserResidentForAppointment = Prisma.ResidentGetPayload<typeof userResidentForAppointment>;
// #endregion

// #region Certificates dashboard
// Define Prisma type for residents with certificate requests and payments
export const userResidentWithCertificateRequests = Prisma.validator<Prisma.ResidentDefaultArgs>()({
  include: {
    certificateRequests: {
      include: {
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            transactionReference: true,
            amount: true,
            paymentStatus: true,
            paymentMethod: true,
            createdAt: true,
            updatedAt: true,
            paymentDate: true,
          },
        },
      },
    },
  },
});

export type UserResidentWithCertificateRequests = Prisma.ResidentGetPayload<typeof userResidentWithCertificateRequests>;
// #endregion