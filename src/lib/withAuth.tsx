import { redirect } from "next/navigation";
import { ComponentType } from "react";
import { User, UserRole } from "@prisma/client";
import getSession from "./getSession";

export type WithAuthProps = {
  user: User;
};

interface AuthOptions {
  allowedRoles?: UserRole[];
  adminOverride?: boolean; // If false, admin cannot access even if they're not in allowedRoles
}

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options?: AuthOptions
) {
  return async function AuthenticatedComponent(
    props: Omit<P, keyof WithAuthProps>
  ) {
    const session = await getSession();
    
    if (!session?.user) {
      redirect("/sign-in");
    }
    const { role } = session.user;

    if (options?.allowedRoles) {
      
      const hasAccess = 
        options.allowedRoles.includes(role as UserRole) || 
        (options.adminOverride !== false && role === "ADMIN");

      if (!hasAccess) {
        redirect("/");
      }
    }

    return <WrappedComponent {...(props as P)} user={session.user} />;
  };
}
