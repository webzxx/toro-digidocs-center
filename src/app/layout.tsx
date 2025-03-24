import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Chat from "@/components/Chat";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toro DigiDocs Center",
  description: "Capstone",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <NuqsAdapter>
          <ReactQueryProvider>
            <Chat />
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </ReactQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
