"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateUser(id: number, data: any) {
  await db.user.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: number) {
  await db.user.delete({
    where: { id },
  });
  revalidatePath("/dashboard/users");
}
