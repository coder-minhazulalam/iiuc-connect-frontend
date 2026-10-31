"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLink from "./Navlink";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for adaptive glassmorphism depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setUserDropdownOpen(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Network", href: "/network" },
    { name: "Community", href: "/community" },
    { name: "Career Hub", href: "/career-hub" },
    { name: "Campus Life", href: "/campus-life" },
    { name: "Our Mission", href: "/our-mission" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
          : "bg-white/70 backdrop-blur-md border-b border-slate-200/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand / Logo */}
          <Link href="/" className="flex flex-row group items-center justify-center select-none">
            <Image
              src="/official_logo.png"
              alt="IIUC Connect Logo"
              width={40}
              height={40}
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col ml-2">
            <span className="text-xl font-semibold text-slate-700 group-hover:text-blue-900 transition-colors">IIUC Connect</span>
             <span className="text-[10px] font-normal text-slate-500 group-hover:text-blue-700 transition-colors">Alumni & Student Network</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions (Login, Join Community, Profile) */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-5">
            {/* Login Link */}
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-900 transition-colors px-2 py-1"
            >
              Login
            </Link>

            {/* Join Community Button */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Join Community
            </Link>

            {/* Profile Avatar Button */}
            <Link
              href="/profile"
              aria-label="User Profile"
              className="w-10 h-10 rounded-full bg-[#0a1936] text-white flex items-center justify-center hover:bg-[#122855] hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu & Profile Toggle Button */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <Link
              href="/profile"
              aria-label="User Profile"
              className="w-9 h-9 rounded-full bg-[#0a1936] text-white flex items-center justify-center sm:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-blue-900 hover:bg-slate-100/60 focus:outline-none transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Glassmorphism Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 pt-3 pb-6 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-2 rounded-lg hover:bg-slate-50 block"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-200/70 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] shadow-md shadow-blue-500/25 active:scale-95 transition-all duration-200"
            >
              Join Community
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
