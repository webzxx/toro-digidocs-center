"use server";

import getSession from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { ManualPaymentInput, manualPaymentSchema } from "@/types/types";
import { generateTransactionRef, generateFile } from "@/lib/utils/payment";

export async function createManualPayment(
  values: Omit<ManualPaymentInput, "proofOfPayment">,
  files?: FormData,
) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        serverError: "Unauthorized. Only administrators can create manual payments.",
      };
    }

    // Create a complete object for validation by adding the file if present
    const valuesForValidation = { ...values } as ManualPaymentInput;
    let proofOfPaymentFile = null;
    
    if (files && files.has("proofOfPayment")) {
      proofOfPaymentFile = files.get("proofOfPayment") as File;
      valuesForValidation.proofOfPayment = proofOfPaymentFile;
    }

    // Validate incoming data against schema
    const validatedData = await manualPaymentSchema.safeParseAsync(valuesForValidation);

    if (!validatedData.success) {
      const err = validatedData.error.flatten();
      return { fieldErrors: err.fieldErrors };
    }

    // Get the certificate request to verify it exists
    const certificateRequest = await db.certificateRequest.findUnique({
      where: { id: values.certificateRequestId },
    });

    if (!certificateRequest) {
      return {
        serverError: "Certificate request not found",
      };
    }

    // Generate a unique transaction reference
    const transactionReference = generateTransactionRef("MAN");
    
    // Handle file upload if a proof of payment is provided
    let proofOfPaymentPath = null;
    
    if (proofOfPaymentFile) {
      const utApi = new UTApi();
      
      try {
        const [uploadedFile] = await utApi.uploadFiles([
          generateFile(proofOfPaymentFile),
        ]);
        
        if (!uploadedFile.data) {
          throw new Error("Unable to process file upload");
        }
        
        proofOfPaymentPath = uploadedFile.data.ufsUrl;
      } catch (error) {
        console.error("Error uploading proof of payment:", error);
        return {
          serverError: "Failed to upload proof of payment",
        };
      }
    }

    // Start a transaction for database operations
    const result = await db.$transaction(async (prisma) => {
      // Create a new payment (manual payments should have isActive=false since they don't use checkoutUrl)
      const payment = await prisma.payment.create({
        data: {
          transactionReference,
          certificateRequestId: values.certificateRequestId,
          amount: parseFloat(values.amount),
          paymentMethod: values.paymentMethod,
          paymentStatus: values.paymentStatus,
          paymentDate: new Date(values.paymentDate),
          notes: values.notes || null,
          proofOfPaymentPath,
          receiptNumber: values.receiptNumber || null,
          isActive: false, // Manual payments don't need isActive flag
        },
      });

      // Get the latest payment for this certificate (including the one we just created)
      const latestPayment = await prisma.payment.findFirst({
        where: {
          certificateRequestId: values.certificateRequestId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Update certificate status based on the latest payment's status
      // Since we just created the payment, it should be the latest
      if (
        payment.id === latestPayment?.id &&
        (values.paymentStatus === "SUCCEEDED" || values.paymentStatus === "VERIFIED")
      ) {
        // If payment is successful, move certificate to processing status
        await prisma.certificateRequest.update({
          where: { id: values.certificateRequestId },
          data: {
            status: "PROCESSING",
          },
        });
      }

      return payment;
    });

    // Revalidate the payments page to show the new payment
    revalidatePath("/dashboard/payments");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating manual payment:", error);
    return {
      serverError: "Unable to process payment request",
    };
  }
}

export async function updatePayment(
  paymentId: number,
  values: Omit<ManualPaymentInput, "proofOfPayment">,
  files?: FormData,
) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        serverError: "Unauthorized. Only administrators can update payments.",
      };
    }

    // Create a complete object for validation by adding the file if present
    const valuesForValidation = { ...values } as ManualPaymentInput;
    let proofOfPaymentFile = null;
    
    if (files && files.has("proofOfPayment")) {
      proofOfPaymentFile = files.get("proofOfPayment") as File;
      valuesForValidation.proofOfPayment = proofOfPaymentFile;
    }

    // Validate incoming data against schema
    const validatedData = await manualPaymentSchema.safeParseAsync(valuesForValidation);

    if (!validatedData.success) {
      const err = validatedData.error.flatten();
      return { fieldErrors: err.fieldErrors };
    }

    // Get the existing payment to check for changes
    const existingPayment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        // Include certificate request to access its details
        certificateRequest: true,
      },
    });

    if (!existingPayment) {
      return {
        serverError: "Payment not found",
      };
    }

    // Handle file upload if a new proof of payment is provided
    let proofOfPaymentPath = existingPayment.proofOfPaymentPath;
    
    if (proofOfPaymentFile) {
      const utApi = new UTApi();
      
      try {
        // Delete the old file if it exists
        if (existingPayment.proofOfPaymentPath) {
          try {
            // Extract the filename from the URL
            const fileName = existingPayment.proofOfPaymentPath.split("/").pop();
            if (fileName) {
              await utApi.deleteFiles(fileName);
            }
          } catch (error) {
            console.error("Error deleting old proof of payment:", error);
            // Continue with the update even if deletion fails
          }
        }

        // Upload the new file
        const [uploadedFile] = await utApi.uploadFiles([
          generateFile(proofOfPaymentFile),
        ]);
        
        if (!uploadedFile.data) {
          throw new Error("Unable to process file upload");
        }
        
        proofOfPaymentPath = uploadedFile.data.ufsUrl;
      } catch (error) {
        console.error("Error uploading proof of payment:", error);
        return {
          serverError: "Failed to upload proof of payment",
        };
      }
    }

    // Start a transaction for database operations
    const result = await db.$transaction(async (prisma) => {
      // Update the payment
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          amount: parseFloat(values.amount),
          paymentMethod: values.paymentMethod,
          paymentStatus: values.paymentStatus,
          paymentDate: new Date(values.paymentDate),
          notes: values.notes || null,
          proofOfPaymentPath,
          receiptNumber: values.receiptNumber || null,
          // Don't change isActive flag since it's only for tracking Maya checkout URL
        },
      });

      // Find the latest payment for this certificate by createdAt timestamp
      const latestPayment = await prisma.payment.findFirst({
        where: {
          certificateRequestId: values.certificateRequestId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Only update certificate status if this is the latest payment by creation date
      if (latestPayment && payment.id === latestPayment.id) {
        // Update certificate status based on latest payment's status
        if (
          values.paymentStatus === "SUCCEEDED" ||
          values.paymentStatus === "VERIFIED"
        ) {
          // If payment is successful, move certificate to processing status
          await prisma.certificateRequest.update({
            where: { id: values.certificateRequestId },
            data: {
              status: "PROCESSING",
            },
          });
        } else if (values.paymentStatus === "PENDING") {
          // Ensure certificate is in AWAITING_PAYMENT status if payment is pending
          await prisma.certificateRequest.update({
            where: { id: values.certificateRequestId },
            data: {
              status: "AWAITING_PAYMENT",
            },
          });
        } else if (
          values.paymentStatus === "CANCELLED" ||
          values.paymentStatus === "REJECTED" ||
          // values.paymentStatus === "FAILED" ||
          values.paymentStatus === "VOIDED"
        ) {
          // For failed/rejected payments, put certificate back to AWAITING_PAYMENT
          await prisma.certificateRequest.update({
            where: { id: values.certificateRequestId },
            data: {
              status: "AWAITING_PAYMENT",
            },
          });
        }
      }

      return payment;
    });

    // Revalidate the payments page to show the updated payment
    revalidatePath("/dashboard/payments");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error updating payment:", error);
    return {
      serverError: "Unable to process payment update request",
    };
  }
}

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

