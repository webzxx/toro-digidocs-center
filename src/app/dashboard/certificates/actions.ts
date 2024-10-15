"use server";

import { db } from "@/lib/db";

export async function fetchCertificates() {
  return await db.certificateRequest.findMany();
}

export async function updateCertificateRequest(id: number, data: any) {
  return await db.certificateRequest.update({
    where: { id },
    data,
  });
}

export async function deleteCertificateRequest(id: number) {
  return await db.certificateRequest.delete({
    where: { id },
  });
}
