"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function updateCertificateRequest(id: number, data: any) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update certificate requests");
  }
  await db.certificateRequest.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/certificates");
}

export async function deleteCertificateRequest(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete certificate requests");
  }
  await db.certificateRequest.delete({
    where: { id },
  });
  revalidatePath("/dashboard/certificates");
}
