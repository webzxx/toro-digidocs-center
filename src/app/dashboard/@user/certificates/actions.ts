"use server";

import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";
import { CertificateInput } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createCertificate(data: CertificateInput, residentId: number) {
  try {
    const session = await getSession();
  
    if (!session  || !session.user) {
      throw new Error("Unauthorized");
    }

    const { certificateType, purpose, ...restOfCertificateInfo } = data;
    await db.certificateRequest.create({
      data: {
        residentId: residentId,
        certificateType: data.certificateType,
        purpose: data.purpose,
        additionalInfo: {
          ...restOfCertificateInfo,
        },
      },
    });
    
    revalidatePath("/dashboard/certificates");
  } catch (error) {
    console.error("Error creating certificate:", error);
    throw new Error("Failed to create certificate");
  }
}