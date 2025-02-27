import { ReactNode } from "react"
import DashboardSideBar from "./(components)/DashboardSideBar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface DashboardLayoutProps {
  children: ReactNode;
  admin: ReactNode;
  user: ReactNode;
}

export default async function DashboardLayout({ children, admin, user }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <div className="container grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      <main className="flex flex-col gap-4 p-4 lg:gap-6">
        {role === "ADMIN" ? admin : user}
      </main>
    </div>
  )
}