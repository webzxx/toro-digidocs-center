import { redirect } from "next/navigation";
import { ComponentType } from "react";
import { User, UserRole } from "@prisma/client";
import getSession from "./getSession";

/**
 * Props that will be injected into components wrapped with withAuth
 */
export type WithAuthProps = {
  user: User;
};

/**
 * Configuration options for the withAuth higher-order component
 * @property {UserRole[]} [allowedRoles] - List of user roles that are allowed to access the component. Must be strictly based on the UserRole enum defined in Prisma schema (currently only ADMIN and USER)
 * @property {boolean} [adminOverride] - If false, admin cannot access even if they're not in allowedRoles
 */
interface AuthOptions {
  allowedRoles?: UserRole[];
  adminOverride?: boolean; // If false, admin cannot access even if they're not in allowedRoles
}

/**
 * Higher-order component that handles authentication and authorization
 * 
 * @template P - Component props type that extends WithAuthProps
 * @param {ComponentType<P>} WrappedComponent - The component to wrap with authentication
 * @param {AuthOptions} [options] - Authentication and authorization options
 * @returns {Function} - Authenticated component that redirects if auth fails
 * 
 * @example
 * // Basic usage - requires user to be logged in
 * const ProtectedPage = withAuth(MyComponent);
 * 
 * @example
 * // Role-based access control - USER role can access, ADMIN has access by default
 * const RoleProtectedPage = withAuth(MyComponent, {
 *   allowedRoles: ["USER"]
 * });
 * 
 * @example
 * // Prevent admin override - only USER role can access, ADMIN has no access
 * const StrictRoleProtectedPage = withAuth(MyComponent, {
 *   allowedRoles: ["USER"],
 *   adminOverride: false
 * });
 */
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
