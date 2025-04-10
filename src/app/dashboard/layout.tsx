import { ReactNode } from "react";
import DashboardSideBar from "./_components/DashboardSideBar";
import getSession from "@/lib/auth/getSession";

interface DashboardLayoutProps {
  children: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}

export default async function DashboardLayout({ children, admin, user }: DashboardLayoutProps) {
  const session = await getSession();
  const role = session?.user?.role;

  return (
    <div className="container my-6 flex min-h-screen w-full flex-col px-1 min-[420px]:px-9 lg:grid lg:grid-cols-[280px_1fr]">
      <DashboardSideBar role={role} />
      <main className="flex w-full flex-col gap-4 overflow-x-hidden pt-4 lg:gap-6 lg:p-4">
        {role === "ADMIN" ? admin : user}
      </main>
    </div>
  );
}