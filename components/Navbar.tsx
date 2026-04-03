import Link from 'next/link';
import { UserPlus, ClipboardPlus, BarChart3 } from 'lucide-react';

export default function Navbar() {
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
              <Link href="/" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Dashboards
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/students" className="text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
              Students Roster
            </Link>
            <Link href="/admin/upload" className="text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
              Upload Data
            </Link>
            <Link href="/admin/settings" className="text-gray-400 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-medium transition-all">
              Assessments CMS
            </Link>
            <Link href="/students/new" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:bg-blue-50 dark:hover:bg-slate-800">
              <UserPlus className="w-4 h-4"/> <span className="hidden sm:inline">Add Student</span>
            </Link>
            <Link href="/assessments/live" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 px-4 sm:px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95">
              <ClipboardPlus className="w-4 h-4"/> <span>Record Score</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
