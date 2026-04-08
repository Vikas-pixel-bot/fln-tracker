"use client";
import React, { useState } from "react";
import { Play, FileText, Gamepad2, GraduationCap, Download, ExternalLink, ChevronRight, BookOpen, Lightbulb, BoxSelect, MonitorPlay, SpellCheck, Binary, Info, Search, ClipboardPlus } from "lucide-react";
import Link from "next/link";
import { VIDEOS, ARTICLES, SIMULATIONS, Resource } from "@/lib/resource_data";
import { cn } from "@/lib/utils";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "articles" | "simulations">("videos");
  const [searchTerm, setSearchTerm] = useState("");

  const TABS = [
    { id: "videos", label: "Training Videos", icon: <MonitorPlay className="w-5 h-5" /> },
    { id: "articles", label: "Coaching Articles", icon: <BookOpen className="w-5 h-5" /> },
    { id: "simulations", label: "Level Simulations", icon: <Gamepad2 className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" /> Teacher Capacity Hub
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Level-Wise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-blue-500/30">Coaching Tools</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Access high-impact training materials and interactive simulations mapped specifically to every ASER/FLN level.
        </p>
        
        {/* Featured: 90-Min Runner */}
        <div className="pt-6">
           <Link href="/resources/mission" className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-slate-900 to-blue-900 dark:from-blue-600 dark:to-indigo-600 rounded-[32px] shadow-2xl hover:scale-[1.02] transition-all text-left border border-white/10 group">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
                 <ClipboardPlus className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white">90-Minute Classroom Runner</h3>
                 <p className="text-blue-200 text-sm font-medium">Start today's automated pedagogical flow with level-matched simulations.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full text-white group-hover:bg-white group-hover:text-blue-600 transition-all">
                 <ChevronRight className="w-6 h-6" />
              </div>
           </Link>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                activeTab === tab.id 
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-900/5" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
              type="text" 
              placeholder="Search resource..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
           />
        </div>
      </div>

      {/* Tab Content: VIDEOS */}
      {activeTab === "videos" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {VIDEOS.map((v, i) => (
            <div key={i} className="space-y-4 group">
               <div className="relative aspect-video rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5">
                  <iframe 
                     src={`https://www.youtube.com/embed/${v.id}`}
                     className="absolute inset-0 w-full h-full"
                     allowFullScreen
                  ></iframe>
               </div>
               <div className="px-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                       Level: {v.level || "General"}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{v.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{v.description}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: ARTICLES */}
      {activeTab === "articles" && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {ARTICLES.map((art, i) => (
             <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <BookOpen className="w-3 h-3" /> Teacher Insights
                </div>
                <div className="space-y-3">
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-all">{art.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{art.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                   {art.tags?.map(t => <span key={t} className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">#{t}</span>)}
                </div>
                <button className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">
                   Read Full Article <ChevronRight className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      )}

      {/* Tab Content: SIMULATIONS */}
      {activeTab === "simulations" && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {SIMULATIONS.map((sim, i) => (
             <Link key={i} href={sim.link || "#"} className="group relative bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 hover:bg-blue-600 transition-all duration-500 overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-2xl group-hover:bg-white/20 transition-all">
                        <Gamepad2 className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-all">
                        Level: {sim.level}
                     </span>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-white transition-all leading-tight">
                        {sim.title}
                     </h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 transition-all">
                        {sim.description}
                     </p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 group-hover:border-white/20 flex items-center justify-between">
                     <span className="text-xs font-black text-blue-600 group-hover:text-white transition-all uppercase tracking-widest">Launch Tool</span>
                     <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-all" />
                  </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/5 rounded-full group-hover:bg-white/10 transition-all"></div>
             </Link>
           ))}
        </div>
      )}

      {/* Classroom Guide / Offline Section */}
      <div className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden text-center lg:text-left shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase">
                   <Lightbulb className="w-4 h-4" /> Pro Teacher Tip
                </div>
                <h2 className="text-4xl font-black text-white leading-tight underline decoration-blue-500/30 decoration-8 underline-offset-4">Need a quick refresher <br/>for tomorrow&apos;s Class?</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                   Download our level-specific &ldquo;Pedagogical Cheat-Sheets&rdquo; for at-a-glance grouping rules and activity targets.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                   <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                      <Download className="w-5 h-5"/> Download PDF Pack
                   </button>
                   <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5"/> Visit ASER Portal
                   </button>
                </div>
             </div>
             
             <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3 opacity-30">
                <div className="aspect-square bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center space-y-2">
                   <SpellCheck className="w-8 h-8 text-blue-600" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Literacy</span>
                </div>
                <div className="aspect-square bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center space-y-2 translate-y-6">
                   <Binary className="w-8 h-8 text-indigo-600" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math</span>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
