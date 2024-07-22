import { UserRole } from "prisma/client";
import NextAuth from "next-auth";
import type { User } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: UserRole;
  }
  interface Session {
    user: User & {
      username: string;
      id: UserId;
      role: UserRole;
    };
    token: {
      username: string;
    };
  }
}
