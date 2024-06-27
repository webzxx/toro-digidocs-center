import { FC, ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
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
