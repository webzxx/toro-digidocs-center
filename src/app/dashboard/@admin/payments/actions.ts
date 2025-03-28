"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/auth/getSession";
import { PaymentStatus } from "@prisma/client";
import { UTApi } from "uploadthing/server";

export async function approvePayment(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can approve payments");
  }
  
  // First, get the payment we're approving
  const payment = await db.payment.findUnique({
    where: { id },
    select: {
      certificateRequestId: true,
    },
  });
  
  if (!payment) {
    throw new Error("Payment not found");
  }
  
  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update the payment status
    await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.VERIFIED,
        paymentDate: new Date(),
      },
    });
    
    // Check if this is the latest payment for the certificate
    const latestPayment = await prisma.payment.findFirst({
      where: { 
        certificateRequestId: payment.certificateRequestId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Only update certificate status if this is the latest payment
    if (latestPayment && latestPayment.id === id) {
      await prisma.certificateRequest.update({
        where: { id: payment.certificateRequestId },
        data: {
          status: "PROCESSING",
        },
      });
    }
  });
  
  revalidatePath("/dashboard/payments");
}

export async function rejectPayment(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can reject payments");
  }
  
  // First, get the payment we're rejecting
  const payment = await db.payment.findUnique({
    where: { id },
    select: {
      certificateRequestId: true,
    },
  });
  
  if (!payment) {
    throw new Error("Payment not found");
  }
  
  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update the payment status
    await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.REJECTED,
      },
    });
    
    // Check if this is the latest payment for the certificate
    const latestPayment = await prisma.payment.findFirst({
      where: { 
        certificateRequestId: payment.certificateRequestId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Only update certificate status if this is the latest payment
    if (latestPayment && latestPayment.id === id) {
      await prisma.certificateRequest.update({
        where: { id: payment.certificateRequestId },
        data: {
          status: "AWAITING_PAYMENT",
        },
      });
    }
  });
  
  revalidatePath("/dashboard/payments");
}

export async function deletePayment(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete payments");
  }
  
  // Get the payment to check if it has a file that needs deletion
  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      certificateRequest: true, // Include certificate request to handle status updates
    },
  });
  
  if (!payment) {
    throw new Error("Payment not found");
  }
  
  // Start a transaction for all operations
  await db.$transaction(async (prisma) => {
    // If there's a proof of payment file, delete it using UploadThing
    if (payment.proofOfPaymentPath) {
      try {
        const utApi = new UTApi();
        // Extract the filename from the URL (last part after the last slash)
        const fileName = payment.proofOfPaymentPath.split("/").pop();
        if (fileName) {
          await utApi.deleteFiles(fileName);
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        // Continue with payment deletion even if file deletion fails
      }
    }
    
    // Delete the payment
    await prisma.payment.delete({
      where: { id },
    });
    
    // Check if this was the latest payment for the certificate
    const latestPayment = await prisma.payment.findFirst({
      where: { 
        certificateRequestId: payment.certificateRequestId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // If we're deleting the latest payment or there are no more payments,
    // we need to update the certificate status
    if (!latestPayment) {
      // No more payments - set certificate back to AWAITING_PAYMENT
      await prisma.certificateRequest.update({
        where: { id: payment.certificateRequestId },
        data: {
          status: "AWAITING_PAYMENT",
        },
      });
    } else if (
      latestPayment && 
      (latestPayment.paymentStatus === "SUCCEEDED" || latestPayment.paymentStatus === "VERIFIED")
    ) {
      // If the new latest payment is successful, set certificate to PROCESSING
      await prisma.certificateRequest.update({
        where: { id: payment.certificateRequestId },
        data: {
          status: "PROCESSING",
        },
      });
    } else {
      // The new latest payment is not successful, set certificate to AWAITING_PAYMENT
      await prisma.certificateRequest.update({
        where: { id: payment.certificateRequestId },
        data: {
          status: "AWAITING_PAYMENT",
        },
      });
    }
  });
  
  revalidatePath("/dashboard/payments");
}