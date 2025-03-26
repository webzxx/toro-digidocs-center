"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import getSession from "@/lib/auth/getSession";
import { PaymentStatus } from "@prisma/client";

export async function approvePayment(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can approve payments");
  }
  
  await db.payment.update({
    where: { id },
    data: {
      paymentStatus: PaymentStatus.VERIFIED,
      paymentDate: new Date(),
    },
  });
  revalidatePath("/dashboard/payments");
}

export async function rejectPayment(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can reject payments");
  }
  
  await db.payment.update({
    where: { id },
    data: {
      paymentStatus: PaymentStatus.REJECTED,
    },
  });
  revalidatePath("/dashboard/payments");
}

export async function updatePaymentNotes(id: number, notes: string) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update payment notes");
  }
  
  await db.payment.update({
    where: { id },
    data: { notes },
  });
  revalidatePath("/dashboard/payments");
}