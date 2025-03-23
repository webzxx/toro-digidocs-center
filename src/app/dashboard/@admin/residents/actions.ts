"use server";

import { db } from "@/lib/db";
import { ResidentWithTypes } from "@/types/types";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { UTApi } from "uploadthing/server";

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
  
  // delete images first
  await deletePOIImages(id);

  // delete resident
  await db.resident.delete({
    where: { id },
  });
  revalidatePath("/dashboard/residents");
}

export async function deletePOIImages(residentId: number) {
  // retrieve resident's image URLs in ProofOfIdentity first
  const [{
    signaturePath, idPhoto1Path, idPhoto2Path, holdingIdPhoto1Path, holdingIdPhoto2Path
  }] = await db.proofOfIdentity.findMany({
    where: { residentId },
  });
  
  // return if the paths are null
  if (!signaturePath || !idPhoto1Path || !idPhoto2Path || !holdingIdPhoto1Path || !holdingIdPhoto2Path) {
    return;
  }

  // delete the files stored in uploadthing
  const utApi = new UTApi();
  utApi.deleteFiles([
    signaturePath.split("/").pop()!,
    idPhoto1Path.split("/").pop()!,
    idPhoto2Path.split("/").pop()!,
    holdingIdPhoto1Path.split("/").pop()!,
    holdingIdPhoto2Path.split("/").pop()!,
  ]);
}