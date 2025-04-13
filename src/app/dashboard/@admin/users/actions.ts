"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";
import getSession from "@/lib/auth/getSession";
import { deletePOIImages } from "@/lib/utils/resident";

export async function updateUser(id: number, data: any) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can update users");
  }
  
  await db.user.update({
    where: { id },
    data,
  });
  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: number) {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can delete users");
  }
  
  // Check if user has any residents
  const residents = await db.resident.findMany({
    where: { userId: id },
  });

  // Delete POI images for each resident before cascading delete
  if (residents.length > 0) {
    for (const resident of residents) {
      await deletePOIImages(resident.id);
    }
  }

  // Delete user - cascading will handle related records in the database
  await db.user.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard/users");
}

type CreateUserParams = {
  username: string;
  email: string;
  password: string;
  role: string;
};

export async function createUser(data: CreateUserParams) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can create users");
    }
    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    // Check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: data.username },
    });
    if (existingUserByUsername) {
      throw new Error("User with this username already exists");
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10);

    // Create the user
    await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create user");
  }
}
