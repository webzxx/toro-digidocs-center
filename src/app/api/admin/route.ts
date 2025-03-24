import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define a schema for input validation
const adminSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    adminSecret: z.string().min(1, "Admin secret is required")
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, adminSecret } = adminSchema.parse(body);

    // Verify admin secret
    const expectedSecret = process.env.ADMIN_SECRET;
    if (!expectedSecret || adminSecret !== expectedSecret) {
      return NextResponse.json({ message: "Invalid admin secret" }, { status: 403 });
    }

    // check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email }
    });
    if(existingUserByEmail) {
      return NextResponse.json({user: null, message: "User with this email already exists"}, { status : 409 });
    }

    // check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username }
    });
    if(existingUserByUsername) {
      return NextResponse.json({user: null, message: "User with this username already exists"}, { status : 409 });
    }

    const hashedPassword = await hash(password, 10);
    const newAdmin = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "ADMIN" // Set role to ADMIN
      }
    });
    const { password: newAdminPassword, ...rest } = newAdmin;
        
    return NextResponse.json({ user: rest, message: "Admin created successfully"}, {status: 201});
  } catch(error) {
    return NextResponse.json({ message: "Something went wrong!"}, {status: 500});
  }
}