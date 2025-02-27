"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateCertificateRequest(id: number, data: any) {
  await db.certificateRequest.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/certificates");
}

export async function deleteCertificateRequest(id: number) {
  await db.certificateRequest.delete({
    where: { id },
  });
  revalidatePath("/dashboard/certificates");
}
