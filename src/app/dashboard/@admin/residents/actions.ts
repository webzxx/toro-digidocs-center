"use server";

import { db } from "@/lib/db";
import { ResidentWithTypes } from "@/types/types";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/getSession";

export async function updateResident(id: number, data: ResidentWithTypes) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update residents");
  }
  const { address, emergencyContact, proofOfIdentity, ...residentData } = data;
  await db.$transaction(async (prisma) => {
    // Update resident data
    await prisma.resident.update({
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
  });
  
  revalidatePath("/dashboard/residents");
}

export async function deleteResident(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete residents");
  }
  await db.resident.delete({
    where: { id },
  });
  revalidatePath("/dashboard/residents");
}
