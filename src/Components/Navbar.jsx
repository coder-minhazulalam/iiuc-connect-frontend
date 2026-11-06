"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "./Navlink";
import Image from "next/image";
import {
  Bookmark,
  MessageSquare,
  Bell,
  BadgeCheck,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Better Auth session handling
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Detect scroll for adaptive glassmorphism depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const getInitials = (name) => {
    if (!name) return "MA";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getSubline = (currentUser) => {
    if (!currentUser) return "Alumni • CSE '22";
    const role = currentUser.accountType || currentUser.role || "Alumni";
    const dept = currentUser.department
      ? currentUser.department.match(/\(([^)]+)\)/)?.[1] ||
        currentUser.department.split(" ")[0]
      : "CSE";
    const year = currentUser.graduationYear
      ? `'${String(currentUser.graduationYear).slice(-2)}`
      : "'22";

    return `${role} • ${dept} ${year}`;
  };

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Fixed height: h-16 (64px) — compact enough for logged-in user section */}
        <div className="flex items-center justify-between h-16">

          {/* ── LEFT: Brand / Logo ── */}
          <Link
            href="/"
            className="flex flex-row group items-center justify-center select-none flex-shrink-0"
          >
            <Image
              src="/official_logo.png"
              alt="IIUC Connect Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col ml-1.5">
              <span className="text-base font-bold text-slate-700 group-hover:text-blue-900 transition-colors leading-tight">
                IIUC Connect
              </span>
              <span className="text-[9px] font-normal text-slate-500 group-hover:text-blue-700 transition-colors leading-tight">
                Alumni &amp; Student Network
              </span>
            </div>
          </Link>

          {/* ── CENTER: Desktop Navigation Links ──
              When user is logged in → show only at xl (1280px+) to avoid crowding
              When guest             → show at lg (1024px+) which is fine  */}
          <nav
            className={`items-center gap-1 xl:gap-2 ${
              user ? "hidden xl:flex" : "hidden lg:flex"
            }`}
          >
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ── RIGHT: Actions (Guest vs Logged-in) ── */}
          <div className="hidden sm:flex items-center gap-2">
            {isPending ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            ) : !user ? (
              /* Guest state */
              <div className="flex items-center gap-3">
                <Link
                  href="/signIn"
                  className="text-sm font-medium text-slate-700 hover:text-blue-900 transition-colors px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Join Community
                </Link>
              </div>
            ) : (
              /* Logged-in state */
              <div className="flex items-center gap-1.5">

                {/* 1. Bookmark */}
                <button
                  type="button"
                  aria-label="Saved items"
                  className="p-1.5 text-slate-500 hover:text-blue-900 transition-colors cursor-pointer rounded-lg hover:bg-slate-100/60"
                >
                  <Bookmark className="w-[18px] h-[18px]" />
                </button>

                {/* 2. Messages with badge */}
                <button
                  type="button"
                  aria-label="Messages"
                  className="relative p-1.5 text-slate-500 hover:text-blue-900 transition-colors cursor-pointer rounded-lg hover:bg-slate-100/60"
                >
                  <MessageSquare className="w-[18px] h-[18px]" />
                  <span className="absolute -top-0.5 -right-0.5 bg-[#0f766e] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    4
                  </span>
                </button>

                {/* 3. Notifications bell */}
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative p-1.5 text-slate-500 hover:text-blue-900 transition-colors cursor-pointer rounded-lg hover:bg-slate-100/60"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#f43f5e] rounded-full border border-white"></span>
                </button>

                {/* 4. Vertical divider */}
                <div className="h-5 w-px bg-slate-200 mx-0.5" />

                {/* 5. User profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-slate-100/60 transition-all cursor-pointer group focus:outline-none"
                    aria-expanded={dropdownOpen}
                  >
                    {/* Avatar */}
                    <div className="relative w-8 h-8 rounded-full border-2 border-[#1e3a8a] p-0.5 flex items-center justify-center bg-white flex-shrink-0 overflow-visible">
                      <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User Avatar"}
                            fill
                            unoptimized
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-[#1e3a8a] font-bold text-xs select-none">
                            {getInitials(user.name)}
                          </span>
                        )}
                      </div>
                      {/* Online dot */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full z-10"></span>
                    </div>

                    {/* Name & subtitle — hidden on screens below lg to save space */}
                    <div className="hidden lg:flex flex-col text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800 leading-tight max-w-[110px] truncate">
                          {user.name || "Minhazul Alam"}
                        </span>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium max-w-[110px] truncate">
                        {getSubline(user)}
                      </span>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ──
              When user logged in → show hamburger until xl (1280px)
              When guest          → show hamburger until lg (1024px)  */}
          <div
            className={`flex items-center gap-2.5 ${
              user ? "xl:hidden" : "lg:hidden"
            }`}
          >
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

      {/* ── MOBILE MENU DRAWER ── */}
      {mobileMenuOpen && (
        <div
          className={`${
            user ? "xl:hidden" : "lg:hidden"
          } bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 pt-3 pb-6 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200`}
        >
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
            {!user ? (
              <>
                <Link
                  href="/signIn"
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
              </>
            ) : (
              <div className="space-y-3">
                {/* Mobile user info card */}
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <div className="relative w-10 h-10 rounded-full border-2 border-[#1e3a8a] p-0.5 flex items-center justify-center bg-white flex-shrink-0">
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User Avatar"}
                          fill
                          unoptimized
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-[#1e3a8a] font-bold text-sm">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full z-10"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">
                        {user.name}
                      </span>
                      <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {getSubline(user)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
