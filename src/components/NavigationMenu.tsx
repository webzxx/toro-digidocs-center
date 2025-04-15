"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "../app/icon.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

interface NavigationMenuProps {
  isAuthenticated: boolean;
  userRole?: string;
}

const NavigationMenu = ({ isAuthenticated, userRole }: NavigationMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="relative z-30 h-24 w-full bg-white shadow-xl">
      <div className="container flex h-full w-full items-center justify-between px-4 2xl:px-16">
        <Link href="/">
          <Image
            src={Icon}
            alt="Icon"
            width="80"
            height="50"
            className="cursor-pointer rounded-full"
            priority
          />
        </Link>

        <div className="hidden sm:flex">
          <ul className="hidden sm:flex">
            <Link href="/">
              <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                Home
              </li>
            </Link>
            <Link href="/pages/about">
              <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                About
              </li>
            </Link>
            <Link href="/pages/services">
              <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                Services
              </li>
            </Link>
            <Link href="/pages/faq">
              <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                FAQ
              </li>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                  {userRole === "ADMIN" ? "Dashboard" : "My Account"}
                </li>
              </Link>
            ) : (
              <Link href="/sign-in">
                <li className="ml-10 text-xl hover:border-b hover:border-b-green-500">
                  Sign In
                </li>
              </Link>
            )}
          </ul>
        </div>
        <div onClick={handleNav} className="cursor-pointer pl-24 sm:hidden">
          <AiOutlineMenu size={25} />
        </div>
      </div>
      <div
        className={`absolute left-0 top-0 h-screen w-[65%] bg-[#ecf0f3] p-10 transition-transform duration-500 sm:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <div className="flex-col py-4">
          <ul>
            <Link href="/">
              <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                Home
              </li>
            </Link>
            <Link href="/pages/about">
              <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                About
              </li>
            </Link>
            <Link href="/pages/services">
              <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                Services
              </li>
            </Link>
            <Link href="/pages/faq">
              <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                FAQ
              </li>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                  {userRole === "ADMIN" ? "Dashboard" : "My Account"}
                </li>
              </Link>
            ) : (
              <Link href="/sign-in">
                <li onClick={() => setMenuOpen(false)} className="cursor-pointer py-4">
                  Sign In
                </li>
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;