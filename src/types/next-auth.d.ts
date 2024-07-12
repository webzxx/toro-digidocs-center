import { UserRole } from 'prisma/client'
import NextAuth from "next-auth"
import type { User } from 'next-auth'

declare module "next-auth" {
  interface User {
    username: string
  }
  interface Session {
    user: User & {
      username: string
      id: UserId 
      
    }
    token: {
      username: string
    }
  }
}