"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcrypt";
import getSession from "@/lib/auth/getSession";
import { ChangePasswordValues } from "@/types/auth";

export async function changePassword(data: ChangePasswordValues) {
  const session = await getSession();
  
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to change your password");
  }
  
  const userId = parseInt(session.user.id);

  // Get the current user data to check password
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await compare(data.currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Hash the new password
  const hashedPassword = await hash(data.newPassword, 10);

  // Update the password
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  
  revalidatePath("/dashboard/settings");
}