import { Prisma } from "@prisma/client";

// #region Resident dashboard
// Define Prisma type for residents with relations for both admin and user dashboards
export const residentWithRelations = Prisma.validator<Prisma.ResidentDefaultArgs>()({
  include: {
    address: true,
    emergencyContact: true,
    proofOfIdentity: true,
  },
});
  
export type ResidentWithRelations = Prisma.ResidentGetPayload<typeof residentWithRelations>;
// #endregion