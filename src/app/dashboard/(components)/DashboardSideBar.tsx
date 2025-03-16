"use client"

import clsx from 'clsx'
import {
  HomeIcon,
  User,
  Settings,
  Calendar,
  Menu,
  X
} from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaCertificate, FaHouseUser } from 'react-icons/fa'
import SignOutButton from '@/components/SignOutButton'
import { useState } from 'react'

interface DashboardSideBarProps {
  role?: string;
}

export default function DashboardSideBar({ role }: DashboardSideBarProps) {
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden block">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="lg:block hidden h-full bg-gray-50 dark:bg-gray-900">
        <div className="flex h-full max-h-screen flex-col">
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            {/* Common or role-specific navigation links */}
            <Link
              className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard"
              })}
              href="/dashboard"
            >
              <div className="text-primary dark:text-white">
                <HomeIcon className="h-5 w-5" />
              </div>
              {isAdmin ? "Dashboard" : "Overview"}
            </Link>
            
            {isAdmin ? (
              // Admin-specific links
              <>
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/users"
                  })}
                  href="/dashboard/users"
                >
                  <div className="text-primary dark:text-white">
                    <User className="h-5 w-5" />
                  </div>
                  Users
                </Link>
                
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/residents"
                  })}
                  href="/dashboard/residents"
                >
                  <div className="text-primary dark:text-white">
                    <FaHouseUser className="h-5 w-5" />
                  </div>
                  Residents
                </Link>

                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates"
                  })}
                  href="/dashboard/certificates"
                >
                  <div className="text-primary dark:text-white">
                    <FaCertificate className="h-5 w-5" />
                  </div>
                  Certificates
                </Link>

                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/bookings"
                  })}
                  href="/dashboard/bookings"
                >
                  <div className="text-primary dark:text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  Bookings
                </Link>
              </>
            ) : (
              // User-specific links
              <>
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments"
                  })}
                  href="/dashboard/appointments"
                >
                  <div className="text-primary dark:text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  My Appointments
                </Link>
                
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates"
                  })}
                  href="/dashboard/certificates"
                >
                  <div className="text-primary dark:text-white">
                    <FaCertificate className="h-5 w-5" />
                  </div>
                  My Certificates
                </Link>

                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/settings"
                  })}
                  href="/dashboard/settings"
                >
                  <div className="text-primary dark:text-white">
                    <Settings className="h-5 w-5" />
                  </div>
                  Settings
                </Link>
              </>
            )}
            
            {/* Sign Out Button */}
            <div className="mt-8 px-3">
              <SignOutButton />
            </div>
          </nav>
        </div>
      </div>
    </div>

    {/* Mobile sidebar */}
    <div 
      className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{isAdmin ? "Admin Dashboard" : "My Account"}</h2>
          <button onClick={toggleMobileMenu} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            {/* Common or role-specific navigation links - same as desktop */}
            <Link
              className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard"
              })}
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="text-primary dark:text-white">
                <HomeIcon className="h-5 w-5" />
              </div>
              {isAdmin ? "Dashboard" : "Overview"}
            </Link>
            
            {isAdmin ? (
              // Admin-specific links
              <>
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/users"
                  })}
                  href="/dashboard/users"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <User className="h-5 w-5" />
                  </div>
                  Users
                </Link>
                
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates"
                  })}
                  href="/dashboard/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <FaCertificate className="h-5 w-5" />
                  </div>
                  Certificates
                </Link>

                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/bookings"
                  })}
                  href="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  Bookings
                </Link>
              </>
            ) : (
              // User-specific links
              <>
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/appointments"
                  })}
                  href="/dashboard/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  My Appointments
                </Link>
                
                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/certificates"
                  })}
                  href="/dashboard/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <FaCertificate className="h-5 w-5" />
                  </div>
                  My Certificates
                </Link>

                <Link
                  className={clsx("flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800", {
                    "flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-medium transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-100 dark:hover:bg-blue-900/30": pathname === "/dashboard/settings"
                  })}
                  href="/dashboard/settings"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="text-primary dark:text-white">
                    <Settings className="h-5 w-5" />
                  </div>
                  Settings
                </Link>
              </>
            )}
            
            {/* Sign Out Button */}
            <div className="mt-8 px-3">
              <SignOutButton />
            </div>
          </nav>
        </div>
      </div>
    </div>
    
    {/* Overlay when mobile menu is open */}
    {mobileMenuOpen && (
      <div 
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={toggleMobileMenu}
      />
    )}
    </>
    
  )
}