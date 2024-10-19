"use server";

import { db } from "@/lib/db";

export async function fetchResidents() {
  return await db.resident.findMany({
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    },
  });
}

export async function updateResident(id: number, data: any) {
  return await db.resident.update({
    where: { id },
    data,
  });
}

export async function deleteResident(id: number) {
  return await db.resident.delete({
    where: { id },
  });
}