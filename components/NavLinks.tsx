"use client";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, ShieldCheck, Users, Database, KeyRound, LayoutDashboard, BookOpen } from 'lucide-react';

interface TooltipProps {
  title: string;
  description: string;
}

function NavTooltip({ title, description }: TooltipProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100 dark:bg-slate-900 dark:border-slate-800" />
      <h5 className="font-extrabold text-xs text-orange-500 mb-1 relative z-10">{title}</h5>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal relative z-10">{description}</p>
    </div>
  );
}

export default function NavLinks({ userRole }: { userRole: string }) {
  const { t } = useLanguage();
  const isAdmin = userRole === 'admin';
  return (
    <div className="hidden sm:flex sm:items-center sm:gap-6">
      
      {/* Dashboards */}
      <div className="group relative py-2">
        <Link href="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors">
          {t('Dashboards')}
        </Link>
        <NavTooltip 
          title="Dashboards" 
          description="Analytics portal containing regional reports, student leaderboards, and learning growth velocity metrics." 
        />
      </div>

      {/* Classroom Implementation */}
      <div className="group relative py-2">
        <Link href="/resources" className="text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" /> {t('Classroom Implementation')}
        </Link>
        <NavTooltip 
          title={t('Classroom Implementation')} 
          description="Interactive hub for teachers to run lessons, plan sessions, view training videos, download manuals, and launch FLN games." 
        />
      </div>

      {isAdmin && (
        <div className="group relative py-2">
          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors">
            <ShieldCheck className="w-4 h-4" /> Admin Settings
          </button>
          
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl opacity-0 scale-95 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 dark:bg-slate-900 dark:border-slate-800">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100 dark:bg-slate-900 dark:border-slate-800" />
            
            <Link href="/admin/upload" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> {t('Upload')}
            </Link>
            
            <Link href="/admin/users" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <Users className="w-4 h-4 text-amber-500" /> {t('Users')}
            </Link>
            
            <Link href="/admin/data" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <Database className="w-4 h-4 text-amber-500" /> {t('Data')}
            </Link>
            
            <Link href="/admin/logins" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <KeyRound className="w-4 h-4 text-amber-500" /> {t('Logins')}
            </Link>
            
            <Link href="/admin/dashboards" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <LayoutDashboard className="w-4 h-4 text-amber-500" /> Dashboards
            </Link>
            
            <Link href="/admin/lotb" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative z-10">
              <BookOpen className="w-4 h-4 text-amber-500" /> LOTB Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
