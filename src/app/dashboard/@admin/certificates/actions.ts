"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/auth/getSession";
import { sendEmail } from "@/lib/utils/email";
import { CertificateStatus, CertificateType } from "@prisma/client";

export async function updateCertificateRequest(id: number, data: any) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update certificate requests");
  }

  // Get the current request to check for status changes
  const currentRequest = await db.certificateRequest.findUnique({
    where: { id },
    include: {
      resident: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!currentRequest) {
    throw new Error("Certificate request not found");
  }

  // Update the certificate request
  const updatedRequest = await db.certificateRequest.update({
    where: { id },
    data,
    include: {
      resident: {
        include: {
          user: true,
        },
      },
    },
  });

  // Send email notifications based on status changes
  if (data.status && data.status !== currentRequest.status) {
    const userEmail = updatedRequest.resident.user.email;
    const userName = `${updatedRequest.resident.firstName} ${updatedRequest.resident.lastName}`;
    const certificateType = formatCertificateType(updatedRequest.certificateType);
    
    // Handle different status changes
    switch (data.status) {
    case CertificateStatus.REJECTED:
      await sendEmail({
        to: userEmail,
        templateName: "rejected",
        templateProps: {
          recipientName: userName,
          certificateType,
          referenceNumber: updatedRequest.referenceNumber,
          notes: updatedRequest.remarks || "No specific reason provided.",
        },
      });
      break;
      
    case CertificateStatus.AWAITING_PAYMENT:
      await sendEmail({
        to: userEmail,
        templateName: "awaitingPayment",
        templateProps: {
          recipientName: userName,
          certificateType,
          referenceNumber: updatedRequest.referenceNumber,
        },
      });
      break;
      
    case CertificateStatus.READY_FOR_PICKUP:
      await sendEmail({
        to: userEmail,
        templateName: "readyForPickup",
        templateProps: {
          recipientName: userName,
          certificateType,
          referenceNumber: updatedRequest.referenceNumber,
        },
      });
      break;
      
    case CertificateStatus.IN_TRANSIT:
      await sendEmail({
        to: userEmail,
        templateName: "inTransit",
        templateProps: {
          recipientName: userName,
          certificateType,
          referenceNumber: updatedRequest.referenceNumber,
        },
      });
      break;
    }
  }
  
  revalidatePath("/dashboard/certificates");
  revalidatePath("/dashboard/payments");
}

// Helper function to format certificate type for display in emails
function formatCertificateType(type: CertificateType): string {
  return type
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  revalidatePath("/dashboard/payments");
}
