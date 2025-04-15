import { Prisma } from "@prisma/client";

// #region Certificate dashboard
// Define Prisma type for certificate requests with relations for admin dashboard
export const adminCertificateWithRelations = Prisma.validator<Prisma.CertificateRequestDefaultArgs>()({
  include: {
    resident: {
      select: {
        firstName: true,
        lastName: true,
        bahayToroSystemId: true,
      },
    },
    payments: {
      orderBy: {
        createdAt: "desc",  // Get payments in reverse chronological order
      },
      take: 1,  // Take only the most recent payment
      select: {
        id: true,
        paymentStatus: true,
        amount: true,
        paymentDate: true,
        isActive: true,  // Include isActive status for reference
      },
    },
  },
});

export type AdminCertificate = Prisma.CertificateRequestGetPayload<typeof adminCertificateWithRelations>;
// #endregion

// #region Appointment dashboard
// Define Prisma type for appointments with relations for admin dashboard
export const adminAppointmentWithRelations = Prisma.validator<Prisma.AppointmentDefaultArgs>()({
  include: {
    user: {
      select: {
        username: true,
        email: true,
      },
    },
    resident: {
      select: {
        firstName: true,
        lastName: true,
        bahayToroSystemId: true,
      },
    },
  },
});

export type AdminAppointment = Prisma.AppointmentGetPayload<typeof adminAppointmentWithRelations>;

// Define Prisma type for residents for appointment form
export const adminResidentForAppointment = Prisma.validator<Prisma.ResidentDefaultArgs>()({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    bahayToroSystemId: true,
    userId: true,
  },
});

export type AdminResidentForAppointment = Prisma.ResidentGetPayload<typeof adminResidentForAppointment>;
// #endregion

// #region Payment dashboard
// Define Prisma type for payments with relations for admin dashboard
export const adminPaymentWithRelations = Prisma.validator<Prisma.PaymentDefaultArgs>()({
  include: {
    certificateRequest: {
      select: {
        referenceNumber: true,
        certificateType: true,
        resident: {
          select: {
            firstName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
      },
    },
  },
});

export type AdminPayment = Prisma.PaymentGetPayload<typeof adminPaymentWithRelations>;

// Define Prisma type for certificates for awaiting payment
export const adminCertificateForAwaitingPayment = Prisma.validator<Prisma.CertificateRequestDefaultArgs>()({
  include: {
    resident: {
      select: {
        firstName: true,
        lastName: true,
        bahayToroSystemId: true,
      },
    },
  },
});

export type AdminCertificateForAwaitingPayment = Prisma.CertificateRequestGetPayload<typeof adminCertificateForAwaitingPayment>;
// #endregion
