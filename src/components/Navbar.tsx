"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../app/toro-logo.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import "@/styles/globals.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="w-full h-24 shadow-xl bg-white z-50">
      <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16">
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo"
            width="80"
            height="50"
            className="cursor-pointer rounded-full"
            priority
          />
        </Link>

        <div className="hidden sm:flex">
          <ul className="hidden sm:flex">
            <Link href="/pages/about">
              <li className="ml-10 uppercase hover:border-b text-xl">
                About Us
              </li>
            </Link>
            <Link href="/pages/services">
              <li className="ml-10 uppercase hover:border-b text-xl">
                Services
              </li>
            </Link>
          </ul>
        </div>
        <div onClick={handleNav} className="sm:hidden cursor-pointer pl-24">
          <AiOutlineMenu size={25} />
        </div>
      </div>
      <div
        className={
          menuOpen
            ? "fixed left-0 top-0 w-[65%] sm:hidden h-screen bg-[#ecf0f3] p-10 ease-in duration-500"
            : "fixed left-[-100%] top-0 p-10 ease-in duration-500"
        }
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <div className="flex-col py-4">
          <ul>
            <Link href="/pages/about">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer"
              >
                About Us
              </li>
            </Link>
            <Link href="/pages/services">
              <li
                onClick={() => setMenuOpen(false)}
                className="py-4 cursor-pointer"
              >
                Services
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {/* <section id="second-section" className="relative justify-center w-full">
        <div className="relative bg-beige-light flex items-center h-[9rem]">
          <Link href="/" className="flex ml-96">
            <Image
              src="/toro-logo.png"
              alt="toro"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>
          <div className="ml-8 justify-center">
            <div>
              <h1 className="text-xl uppercase">Official Website of</h1>
            </div>
            <div className="pt-2">
              <h2 className="text-3xl uppercase font-semibold">
                Barangay Bahay Toro
              </h2>
            </div>
            <div className="pt-4">
              <h2 className="text-xs">
                6 Rd 12, Project 8, Quezon City, Metro Manila
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section id="third-section" className="relative justify-center w-full">
        <div className="relative bg-beige-light h-[13rem] flex">
          <div className="container">
            <hr className="border-t border-gray-300 my-8" />
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
      </section> */}
    </nav>
  );
};

export default Navbar;
