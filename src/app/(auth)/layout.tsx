import { FC, ReactNode } from "react";
import { redirect } from "next/navigation";
import getSession from '@/lib/auth/getSession';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = async ({ children }) => {
  const session = await getSession();

  if (session) {
    if (session.user.role === "ADMIN")
      redirect("/dashboard"); // Redirect to the dashboard if the user is an admin
    else
      redirect("/"); // Redirect to the home page if the user is already signed in
  }

  return (
    <main className="flex min-h-screen justify-center items-center">
        <section id="first-section" className="relative w-full">
            <div className="w-[30rem] h-[48rem] mx-auto relative flex flex-col items-center bg-slate-300 pt-10">
                {children}
            </div>
        </section>
    </main>
  )
}

export default AuthLayout;
