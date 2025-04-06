// auth.ts - Centralized authentication schemas
import { UserRole } from "@prisma/client";
import { z } from "zod";

// Basic email validation schema
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email");

// Basic password validation schema
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must have at least 8 characters");

// Sign In Form Schema
export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;

// Sign Up Form Schema
export const signUpFormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

// Create User Schema (for admin)
export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.nativeEnum(UserRole, {
    required_error: "Role is required",
  }),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;