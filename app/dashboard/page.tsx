export const dynamic = 'force-dynamic';
import { getDashboardStats, getHierarchy } from "@/app/actions";
import DashboardClient from "../DashboardClient"; // Adjusted relative path
import Link from "next/link";
import { UserPlus, ClipboardPlus } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const hierarchy = await getHierarchy();

  return (
    <div className="space-y-10">
      {/* Header section with CTAs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Real-time analytics for your ASER Foundational Literacy and Numeracy program.
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/students/new" className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold shadow-sm hover:border-blue-400 transition-all flex items-center justify-center gap-2 text-sm">
            <UserPlus className="w-4 h-4 text-blue-500" /> New Student
          </Link>
          <Link href="/assessments/live" className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
            <ClipboardPlus className="w-4 h-4" /> Add Score
          </Link>
        </div>
      </div>

      {/* Main Charts area */}
      <DashboardClient initialStats={stats} hierarchy={hierarchy} />
    </div>
  );
}
