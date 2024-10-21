"use server";

import { db } from "@/lib/db";
import { ResidentWithTypes } from "@/types/types";

export async function fetchResidents() {
  return await db.resident.findMany({
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    },
  });
}

export async function updateResident(id: number, data: ResidentWithTypes) {
  const { address, emergencyContact, proofOfIdentity, ...residentData } = data;

  return await db.$transaction(async (prisma) => {
    // Update resident data
    const updatedResident = await prisma.resident.update({
      where: { id },
      data: residentData,
    });

    // Update address if provided
    if (address) {
      await prisma.address.update({
        where: { id: address.id },
        data: address,
      });
    }

    // Update emergency contact if provided
    if (emergencyContact) {
      await prisma.emergencyContact.update({
        where: { id: emergencyContact.id },
        data: emergencyContact,
      });
    }
    return updatedResident;
  });
}

export async function deleteResident(id: number) {
  return await db.resident.delete({
    where: { id },
  });
}
