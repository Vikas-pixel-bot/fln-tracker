"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, BarChart3, GraduationCap, Users, Database,
  ShieldCheck, KeyRound, ClipboardPlus, LogOut, LogIn,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Props {
  isAdmin: boolean;
  userName?: string | null;
  userImage?: string | null;
  isLoggedIn: boolean;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboards", icon: BarChart3 },
  { href: "/resources", label: "Implementation Corner", icon: GraduationCap },
  { href: "/students", label: "Students", icon: Users },
  { href: "/assessments/live", label: "Record Score", icon: ClipboardPlus, highlight: true },
];

const ADMIN_LINKS = [
  { href: "/admin/upload", label: "Upload Data", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/data", label: "Data", icon: Database },
  { href: "/admin/logins", label: "Logins", icon: KeyRound },
];

export default function MobileMenu({ isAdmin, userName, userImage, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function close() { setOpen(false); }

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen(o => !o)}
        className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed top-16 inset-x-0 z-50 sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-200 overflow-hidden",
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="px-4 py-4 space-y-1">

          {/* User info */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt={userName ?? "User"} className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {userName?.[0] ?? "U"}
                </div>
              )}
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1 min-w-0 truncate">
                {userName ?? "Signed in"}
              </span>
              {isAdmin && (
                <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full uppercase tracking-widest">
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Main nav */}
          {NAV_LINKS.map(({ href, label, icon: Icon, highlight }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                highlight
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : pathname.startsWith(href)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}

          {/* Admin links */}
          {isAdmin && (
            <>
              <div className="pt-2 pb-1 px-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</span>
              </div>
              {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                    pathname.startsWith(href)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </>
          )}

          {/* Sign in / out */}
          <div className="pt-2">
            {isLoggedIn ? (
              <button
                onClick={() => { close(); signOut({ callbackUrl: "/" }); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/signin"
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
