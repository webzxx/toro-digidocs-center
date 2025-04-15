"use server";

import { db } from "@/lib/db";
import { ResidentWithRelations } from "@/types/shared";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/auth/getSession";
import { deletePOIImages } from "@/lib/utils/resident";

export async function updateResident(id: number, data: ResidentWithRelations) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update residents");
  }
  const { address, emergencyContact, proofOfIdentity, ...residentData } = data;

  // Update yearsInBahayToro to be a number in address
  if (address?.yearsInBahayToro) {
    address.yearsInBahayToro = parseInt(address.yearsInBahayToro as unknown as string);
  }
  

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
  
  // Delete images first using the shared utility function
  await deletePOIImages(id);

  // Delete resident
  await db.resident.delete({
    where: { id },
  });
  revalidatePath("/dashboard/residents");
}