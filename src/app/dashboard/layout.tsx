import { ReactNode } from "react"
import DashboardSideBar from "./(components)/DashboardSideBar"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
// import DashboardTopNav from "./_components/dashbord-top-nav"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="container grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <DashboardSideBar />
      {/* <DashboardTopNav > */}
        <main className="flex flex-col gap-4 p-4 lg:gap-6">
          {children}
        </main>
      {/* </DashboardTopNav> */}
    </div>
  )
}