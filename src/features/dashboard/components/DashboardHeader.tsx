'use client';

/**
 * Dashboard Header
 */

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { LogoIcon } from '@/components/icons';
import { signOut } from '@/features/auth/actions';

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-serif text-xl font-semibold"
          >
            <LogoIcon className="h-7 w-7 text-teal-600" />
            <span className="hidden sm:inline">PaperTalks</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Public profile link */}
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900 hidden sm:block"
          >
            View public site
          </Link>

          {/* User dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-stone-100 transition-colors"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-medium">
                  {initials}
                </div>
              )}
              <ChevronDownIcon className="h-4 w-4 text-stone-500 hidden sm:block" />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-stone-200 bg-white py-2 shadow-lg">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-medium text-stone-900 text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-stone-100 pt-1">
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white py-2">
          <MobileNavItem href="/dashboard" label="Overview" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem href="/dashboard/profile" label="Profile" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem href="/dashboard/papers" label="Papers" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem href="/dashboard/videos" label="Videos" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavItem href="/dashboard/analytics" label="Analytics" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

function MobileNavItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

