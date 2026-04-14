import Link from 'next/link';
import Image from 'next/image';
import { ClipboardPlus, BarChart3, GraduationCap, ShieldCheck, Users, Database, KeyRound, LogIn, LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';
import MobileMenu from '@/components/MobileMenu';

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 border-b border-gray-100 shadow-sm supports-[backdrop-filter]:bg-white/60 transition-all dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left: Logo + desktop nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600 dark:text-blue-400 gap-2 tracking-tight">
              <BarChart3 className="w-7 h-7" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Mission FLN
              </span>
            </Link>
            <div className="hidden sm:flex sm:items-center sm:gap-6">
              <Link href="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Dashboards
              </Link>
              <Link href="/resources" className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Implementation Corner
              </Link>
              <Link href="/students" className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors">
                Students
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin/upload" className="flex items-center gap-1 text-gray-400 hover:text-blue-600 text-sm font-medium transition-all">
                    <ShieldCheck className="w-4 h-4" /> Upload
                  </Link>
                  <Link href="/admin/users" className="flex items-center gap-1 text-gray-400 hover:text-blue-600 text-sm font-medium transition-all">
                    <Users className="w-4 h-4" /> Users
                  </Link>
                  <Link href="/admin/data" className="flex items-center gap-1 text-gray-400 hover:text-blue-600 text-sm font-medium transition-all">
                    <Database className="w-4 h-4" /> Data
                  </Link>
                  <Link href="/admin/logins" className="flex items-center gap-1 text-gray-400 hover:text-blue-600 text-sm font-medium transition-all">
                    <KeyRound className="w-4 h-4" /> Logins
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: CTA + user avatar (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/assessments/live"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <ClipboardPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Record Score</span>
            </Link>

            {/* Desktop: avatar + sign out */}
            {session?.user ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-blue-100 object-cover w-8 h-8"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {session.user.name?.[0] ?? 'U'}
                  </div>
                )}
                <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}>
                  <button type="submit" className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors" title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/signin" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Mobile hamburger — client component */}
            <MobileMenu
              isAdmin={isAdmin}
              userName={session?.user?.name}
              userImage={session?.user?.image}
              isLoggedIn={!!session?.user}
            />
          </div>

        </div>
      </div>
    </nav>
  );
}
