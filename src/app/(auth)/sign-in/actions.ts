"use server";

import { redirect } from "next/navigation";

export async function goToDashboard() {
  redirect("/dashboard");
}
