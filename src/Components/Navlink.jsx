'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children, onClick, className = '' }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-3 py-1 text-sm font-medium transition-all duration-300 ease-out select-none ${
        isActive
          ? 'text-blue-900 font-semibold'
          : 'text-slate-600 hover:text-blue-800'
      } ${className}`}
    >
      {/* Left side-border indicator with smooth animation */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full bg-blue-900 transition-all duration-300 ease-out ${
          isActive
            ? 'h-4 opacity-100 scale-x-100'
            : 'h-2 opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100 group-hover:h-3'
        }`}
      />

      {/* Text with gentle smooth scale (without distorting letters) */}
      <span
        className={`inline-block transition-transform duration-300 ease-out ${
          isActive
            ? 'scale-105'
            : 'group-hover:scale-105 group-hover:text-blue-900'
        }`}
      >
        {children}
      </span>

      {/* Right side-border indicator with smooth animation */}
      <span
        aria-hidden="true"
        className={`absolute right-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full bg-blue-900 transition-all duration-300 ease-out ${
          isActive
            ? 'h-4 opacity-100 scale-x-100'
            : 'h-2 opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100 group-hover:h-3'
        }`}
      />

      {/* Subtle soft glass pill background when active */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ease-out ${
          isActive
            ? 'bg-blue-50/70 opacity-100 scale-100'
            : 'bg-slate-100/0 opacity-0 scale-95 group-hover:bg-slate-100/50 group-hover:opacity-100 group-hover:scale-100'
        }`}
      />
    </Link>
  );
}

export default NavLink;
