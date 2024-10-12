"use server";

import { db } from "@/lib/db";

export async function fetchCertificates() {
  return await db.certificateRequest.findMany();
}
