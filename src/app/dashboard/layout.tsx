import { ReactNode } from "react"
import DashboardSideBar from "./_components/DashboardSideBar"
import getSession from '@/lib/auth/getSession';

interface DashboardLayoutProps {
  children: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}

export default async function DashboardLayout({ children, admin, user }: DashboardLayoutProps) {
  const session = await getSession();
  const role = session?.user?.role;

  return (
    <div className="container px-1 min-[420px]:px-9 flex flex-col min-h-screen w-full lg:grid lg:grid-cols-[280px_1fr] mt-6">
      <DashboardSideBar role={role} />
      <main className="w-full overflow-x-hidden flex flex-col gap-4 pt-4 lg:p-4 lg:gap-6">
        {role === "ADMIN" ? admin : user}
      </main>
    </div>
  )
}