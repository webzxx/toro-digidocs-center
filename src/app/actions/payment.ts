"use server";

import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";
import paymaya from "@api/paymaya";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import { ManualPaymentInput, manualPaymentSchema } from "@/types/types";
import { revalidatePath } from "next/cache";

// Generate transaction reference number with prefix, date, and random string
function generateTransactionRef(prefix = "TR"){
  // Format: TR-YYYYMMDD-XXXXX (where X is alphanumeric)
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0");
    
  // Generate 5 character unique ID
  const uniqueId = nanoid(5).replace(/[^A-Z0-9]/g, () => {
    // Generate random alphanumeric character if not A-Z or 0-9
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }).toUpperCase();
    
  return `${prefix}-${dateStr}-${uniqueId}`;
};

function generateFile(file: File): File {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");
  const fileName = `${dateStr}-payment-proof-${file.name.replaceAll(" ", "_")}`;
  return new File([file], fileName, { type: file.type });
}

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
      include: {
        payments: {
          where: { isActive: true },
        },
      },
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
      // Create a new payment
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
          isActive: true,
        },
      });

      // Set previous active payments to inactive
      if (certificateRequest.payments.length > 0) {
        await prisma.payment.updateMany({
          where: {
            certificateRequestId: values.certificateRequestId,
            id: { not: payment.id },
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });
      }

      // Update certificate status based on payment status
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

export async function initiatePayment(params: {
  certificateId: number;
  deliveryMethod: "pickup" | "delivery";
}) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { error: "You must be logged in to process payments" };
    }

    const { certificateId, deliveryMethod } = params;
    const includeShipping = deliveryMethod === "delivery";
    
    if (!certificateId) {
      return { error: "Certificate ID is required for payment processing" };
    }

    const certificate = await db.certificateRequest.findUnique({
      where: {
        id: certificateId,
      },
      include: {
        resident: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new Error("Certificate not found with the provided ID");
    }
    if (certificate.status !== "AWAITING_PAYMENT") {
      throw new Error("This certificate is not ready for payment");
    }
    if (!certificate.resident) {
      throw new Error("Resident information is missing for this certificate");
    }
    
    const resident = certificate.resident;
    if (!resident.address) {
      throw new Error("Resident address information is required for payment");
    }
    const address = resident.address;
    const line1 = `${address.blockLot || ""} ${address.phase || ""}`;
    const line2 = `${address.street || ""}, ${address.subdivision}, ${address.barangay}`;
    const transactionRef = generateTransactionRef();
        
    // Check if payment already exists for this certificate
    const existingPayment = await db.payment.findFirst({
      where: {
        certificateRequestId: certificateId,
        paymentStatus: {
          in: ["PENDING"],
        },
        isActive: true,
      },
    });

    if (existingPayment) {
      // If payment exists and is pending, return early with existing checkout URL
      if (existingPayment.metadata && (existingPayment.metadata as any).redirectUrl) {
        return {
          checkoutUrl: (existingPayment.metadata as any).redirectUrl,
          transactionId: existingPayment.transactionReference,
        };
      }
    }
    
    // Calculate total amount based on delivery method
    const processingFee = 280;
    const serviceCharge = 20;
    const baseAmount = processingFee + serviceCharge;
    const shippingFee = includeShipping ? 50 : 0;
    const totalAmount = baseAmount + shippingFee;
    
    // Get the host from headers
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Create PayMaya checkout
    paymaya.auth("pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah", "sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl");
    const { data } = await paymaya.createV1Checkout({
      totalAmount: {
        currency: "PHP",
        value: totalAmount,
        details: {
          processingFee: processingFee.toFixed(2),
          serviceCharge: serviceCharge.toFixed(2),
          shippingFee: shippingFee.toFixed(2),
        },
      },
      buyer: {
        contact: {phone: resident.contact, email: resident.email || session.user.email!},
        billingAddress: {
          line1: line1,
          line2: line2,
          city: address.city,
          state: "Metro Manila",
          zipCode: "1106",
          countryCode: "PH",
        },
        shippingAddress: {
          firstName: resident.firstName,
          lastName: resident.lastName,
          phone: resident.contact,
          email: resident.email || session.user.email!,
          // shippingType: 'SD', optional; SD -same day shipping, ST -standard shipping (just showing the options)
          line1: line1,
          line2: line2,
          city:  address.city,
          state: "Metro Manila",
          zipCode: "1106",
          countryCode: "PH",
        },
        firstName: resident.firstName,
        lastName: resident.lastName,
      },
      redirectUrl: {
        success: `${baseUrl}/payment/success?id=${transactionRef}`,
        failure: `${baseUrl}/payment/failure?id=${transactionRef}`,
        cancel: `${baseUrl}/payment/cancel?id=${transactionRef}`,
      },
      items: [
        {
          name: `${certificate.certificateType.replaceAll("_", " ")} Certificate`,
          code: certificate.referenceNumber,
          description: `Certificate for ${resident.firstName} ${resident.lastName}`,
          quantity: "1",
          amount: {value: baseAmount},
          totalAmount: {value: totalAmount},
        },
      ],
      requestReferenceNumber: transactionRef,
    });

    // Save payment record in database
    await db.payment.create({
      data: {
        transactionReference: transactionRef,
        certificateRequestId: certificateId,
        amount: totalAmount,
        paymentMethod: "MAYA",
        paymentStatus: "PENDING",
        metadata: {
          checkoutId: data.checkoutId,
          redirectUrl: data.redirectUrl,
          includeShipping: includeShipping,
          shippingFee: shippingFee,
        },
      },
    });

    // Return the checkout URL for the client to redirect to
    return {
      checkoutUrl: data.redirectUrl,
      transactionId: transactionRef,
    };

  } catch (error) {
    console.error("Payment processing error:", error);
    return { error: error instanceof Error ? error.message : "Unable to initialize payment gateway. Please try again later." };
  }
}

export async function cancelPayment(params: {
  certificateId: number;
  transactionId: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { error: "You must be logged in to cancel payments" };
    }

    const { certificateId, transactionId } = params;
    
    if (!certificateId || !transactionId) {
      return { error: "Certificate ID and transaction ID are required" };
    }

    // Check if payment exists in database
    const payment = await db.payment.findFirst({
      where: {
        certificateRequestId: certificateId,
        transactionReference: transactionId,
        isActive: true,
      },
    });

    if (!payment) {
      return { error: "Active payment not found" };
    }

    // Only allow cancellation of pending payments
    if (payment.paymentStatus !== "PENDING") {
      return { error: `Cannot cancel payment with status: ${payment.paymentStatus}` };
    }

    const checkoutId = payment.metadata ? (payment.metadata as any).checkoutId : null;
    
    if (!checkoutId) {
      return { error: "Payment checkout information is missing" };
    }

    // Cancel payment with PayMaya
    paymaya.auth("sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl");
    paymaya.server("https://pg-sandbox.paymaya.com");
    console.log("Cancelling payment with PayMaya:", checkoutId);
    try {
      // Attempt to cancel the payment with PayMaya
      const { data } = await paymaya.cancelV1PaymentViaIdViaPostMethod({
        paymentId: checkoutId,
      });
      console.log("PayMaya cancellation response:", data);
      
      // Update payment status in database
      await db.payment.update({
        where: { id: payment.id },
        data: { 
          paymentStatus: "CANCELLED",
          isActive: false,
        },
      });
      
      return { 
        success: true,
        message: "Payment cancelled successfully",
      };
    } catch (paymentError) {
      console.error("PayMaya cancellation error:", paymentError);
      
      // If PayMaya cancellation fails, we still mark our payment as cancelled
      // This handles cases where the payment might be in a state that can't be cancelled in PayMaya
      // but we want to cancel it in our system
      await db.payment.update({
        where: { id: payment.id },
        data: { 
          paymentStatus: "CANCELLED",
          isActive: false,
        },
      });
      
      return { 
        success: true,
        message: "Payment marked as cancelled in our system",
      };
    }
  } catch (error) {
    console.error("Payment cancellation error:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to cancel payment",
    };
  }
}