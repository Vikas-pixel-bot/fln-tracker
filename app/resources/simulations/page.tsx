import BundleBuilder from "@/components/simulations/BundleBuilder";
import { Gamepad2, ArrowLeft, Info, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SimulationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Breadcrumb & Header */}
      <div className="space-y-6">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Training Hub
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Interactive Pedagogy
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Digital Manipulatives</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Use these interactive tools to demonstrate abstract concepts to students.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[28px] shadow-sm">
             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                <Info className="w-5 h-5" />
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight max-w-[200px]">
                Open this page on a tablet or phone for best classroom demo experience.
             </p>
          </div>
        </div>
      </div>

      {/* The Main Simulation - Bundle Builder */}
      <section className="space-y-8">
         <div className="flex items-center gap-3 px-2">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Feature: Sticks & Bundles</h2>
         </div>
         <BundleBuilder />
      </section>

      {/* Upcoming Simulations Placeholder */}
      <div className="grid md:grid-cols-2 gap-8 opacity-60 grayscale cursor-not-allowed">
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-8 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
               <Gamepad2 className="w-8 h-8 text-slate-300" />
            </div>
            <div>
               <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm">Coming Soon</h3>
               <p className="text-xs text-slate-500">Letter-to-Sound Matcher</p>
            </div>
         </div>
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-8 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
               <Gamepad2 className="w-8 h-8 text-slate-300" />
            </div>
            <div>
               <h3 className="font-bold text-slate-400 uppercase tracking-widest text-sm">Coming Soon</h3>
               <p className="text-xs text-slate-500">Number Pattern Solver</p>
            </div>
         </div>
      </div>

    </div>
  );
}
