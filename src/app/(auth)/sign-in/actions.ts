"use server";

import { getServerSession } from "next-auth"; // Import next-auth session handling
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Update path as necessary

export async function goToDashboard() {
  const session = await getServerSession(authOptions);

  // Check if the user is an admin
  if (session?.user?.role === "ADMIN") {
    redirect("/dashboard");
  } else {
    // If the user is not an admin, you can redirect them to a different page
    redirect("/"); // Or any other route for regular users
  }
}
