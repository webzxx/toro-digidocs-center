"use server";

import { db } from "@/lib/db";
import { ResidentWithTypes } from "@/types/types";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/auth/getSession";
import { deletePOIImages } from "@/lib/utils/resident";

export async function updateResident(id: number, data: ResidentWithTypes) {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to update resident information");
  }
  
  const userId = parseInt(session.user.id);
  const { address, emergencyContact, ...residentData } = data;

  // Check if resident belongs to the user
  const existingResident = await db.resident.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!existingResident) {
    throw new Error("Resident not found or you don't have permission to update this resident");
  }

  // Update yearsInBahayToro to be a number in address
  if (address?.yearsInBahayToro) {
    address.yearsInBahayToro = typeof address.yearsInBahayToro === "string" 
      ? parseInt(address.yearsInBahayToro) 
      : address.yearsInBahayToro;
  }

  await db.$transaction(async (prisma) => {
    // Update resident main data
    await prisma.resident.update({
      where: { id },
      data: {
        firstName: residentData.firstName,
        middleName: residentData.middleName,
        lastName: residentData.lastName,
        email: residentData.email,
        contact: residentData.contact,
        // Only admins can update certain sensitive fields like status, sector, etc.
      },
    });

    // Update address if provided
    if (address) {
      await prisma.address.update({
        where: { residentId: id },
        data: {
          blockLot: address.blockLot,
          phase: address.phase,
          street: address.street,
          subdivision: address.subdivision,
          yearsInBahayToro: address.yearsInBahayToro,
        },
      });
    }

    // Update emergency contact if provided
    if (emergencyContact) {
      await prisma.emergencyContact.update({
        where: { residentId: id },
        data: {
          name: emergencyContact.name,
          relationship: emergencyContact.relationship,
          contact: emergencyContact.contact,
          address: emergencyContact.address,
        },
      });
    }
  });
  
  revalidatePath("/dashboard/residents");
}

export async function deleteResident(id: number) {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to delete a resident");
  }
  
  const userId = parseInt(session.user.id);
  
  // Check if resident belongs to the user
  const existingResident = await db.resident.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!existingResident) {
    throw new Error("Resident not found or you don't have permission to delete this resident");
  }

  // Check if there are any pending certificate requests
  const pendingRequests = await db.certificateRequest.findFirst({
    where: {
      residentId: id,
      status: {
        in: ["PENDING", "UNDER_REVIEW", "AWAITING_PAYMENT", "PROCESSING", "READY_FOR_PICKUP", "IN_TRANSIT"],
      },
    },
  });

  if (pendingRequests) {
    throw new Error("Cannot delete resident with pending certificate requests");
  }
  
  // Delete POI images first using the shared utility function
  await deletePOIImages(id);

  // Delete resident - cascading will handle related records
  await db.resident.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/residents");
}