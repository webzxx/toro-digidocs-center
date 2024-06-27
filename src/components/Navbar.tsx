import Link from 'next/link';
import Image from "next/image";
import '@/styles/globals.css'
import { buttonVariants } from './ui/button';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav>

      {/* First Section */}
      <section id="first-section" className="relative justify-center w-full">
        <div className="flex bg-green-primary h-14 text-white justify-center">
          <div className="flex items-center pl-96">
            <div className="text-xs">
              <div className="text-xs">Click here to </div>
            </div>
            <hr className="mx-2 border-l-2 border-white h-6"/>
              {session?.user ? (
                <UserAccountnav />
              ) : (
                <Link href="/sign-in" className={buttonVariants()}>Sign in</Link>
              )}
          </div> 
        </div> 
      </section>

      {/* Second Section */}
      <section id="second-section" className="relative justify-center w-full">
        <div className="relative bg-beige-light flex items-center h-[9rem]">
            <Link href="/" className="flex ml-96">
              <Image src="/toro-logo.png" alt="toro" width={100} height={100} className="rounded-full"/>
            </Link>
            <div className="ml-8 justify-center">
              <div>
                <h1 className="text-xl uppercase">Official Website of</h1>
              </div>
              <div className="pt-2">
                <h2 className="text-3xl uppercase font-semibold">Barangay Bahay Toro</h2>
              </div>
              <div className="pt-4">
                <h2 className="text-xs">6 Rd 12, Project 8, Quezon City, Metro Manila</h2>
              </div>
            </div>
        </div>
      </section>

      {/* Third Section */}
      <section id="third-section" className="relative justify-center w-full">
        <div className="relative bg-beige-light h-[13rem] flex">
          <div className="container">
            <hr className="border-t border-gray-300 my-8"/>
            <div className="flex justify-center uppercase font-medium">
              <div className="mx-16">
                <Link href="/">Home</Link>
              </div>
              <div className="mx-16">
                <Link href="/pages/about">About</Link>
              </div>
              <div className="mx-16">
                <Link href="/pages/services">Services</Link>
              </div>
              <div className="mx-16">
                <Link href="/pages/news">News</Link>
              </div>
              <div className="mx-16">
                <Link href="/pages/faq">FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </nav>
    
  );
};


export default Navbar;
