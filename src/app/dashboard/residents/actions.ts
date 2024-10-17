"use server";

import { db } from "@/lib/db";

export async function fetchResidents(){
  return await db.resident.findMany({
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    }
  })
}