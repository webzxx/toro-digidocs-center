"use server";

import { db } from "@/lib/db";

export async function fetchUsers() {
  return await db.user.findMany();
}

export async function updateUser(id: number, data: any) {
  return await db.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return await db.user.delete({
    where: { id },
  });
}
