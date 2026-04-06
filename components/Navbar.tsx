import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, ClipboardPlus, BarChart3, LogIn, LogOut, ShieldCheck, Users, Database, GraduationCap } from 'lucide-react';
import { auth, signIn, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 border-b border-gray-100 shadow-sm supports-[backdrop-filter]:bg-white/60 transition-all dark:bg-slate-900/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600 dark:text-blue-400 gap-2 tracking-tight">
              <BarChart3 className="w-7 h-7" />
              <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">FLN Tracker</span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Dashboards
              </Link>
              <Link href="/resources" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors gap-2">
                <GraduationCap className="w-4 h-4" /> Training Hub
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/students" className="text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
              Students
            </Link>

            {isAdmin && (
              <>
                <Link href="/admin/upload" className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
                  <ShieldCheck className="w-4 h-4" /> Upload Data
                </Link>
                <Link href="/admin/users" className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
                  <Users className="w-4 h-4" /> Users
                </Link>
                <Link href="/admin/data" className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
                  <Database className="w-4 h-4" /> Data
                </Link>
                <Link href="/admin/settings" className="text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
                  CMS
                </Link>
              </>
            )}

            <Link href="/students/new" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:bg-blue-50 dark:hover:bg-slate-800">
              <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Add Student</span>
            </Link>

            <Link href="/assessments/live" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95">
              <ClipboardPlus className="w-4 h-4" /> <span className="hidden sm:inline">Record Score</span>
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-blue-100"
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
              <form action={async () => { 'use server'; await signIn('google'); }}>
                <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all">
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
