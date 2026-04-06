"use client";
import React, { useState } from "react";
import { Gamepad2, ArrowLeft, Info, Sparkles, Binary, SpellCheck, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Import all simulations
import BundleBuilder from "@/components/simulations/BundleBuilder";
import NumberHunter from "@/components/simulations/NumberHunter";
import AdditionMaster from "@/components/simulations/AdditionMaster";
import SoundExplorer from "@/components/simulations/SoundExplorer";
import WordBuilder from "@/components/simulations/WordBuilder";
import SentenceArchitect from "@/components/simulations/SentenceArchitect";
import MathSprint from "@/components/simulations/MathSprint";
import SoundDuel from "@/components/simulations/SoundDuel";

const SIMS = [
  { id: "number-hunter", title: "Number Hunter", level: "1-9", subject: "Math", component: <NumberHunter /> },
  { id: "bundle-builder", title: "Bundle Builder", level: "10-99", subject: "Math", component: <BundleBuilder /> },
  { id: "addition-master", title: "Addition Master", level: "Operations", subject: "Math", component: <AdditionMaster /> },
  { id: "sound-explorer", title: "Sound Explorer", level: "Letter", subject: "Literacy", component: <SoundExplorer /> },
  { id: "word-builder", title: "Word Builder", level: "Word", subject: "Literacy", component: <WordBuilder /> },
  { id: "sentence-architect", title: "Sentence Architect", level: "Para/Story", subject: "Literacy", component: <SentenceArchitect /> },
  { id: "math-sprint", title: "Math Sprint", level: "10-99", subject: "Battle", component: <MathSprint /> },
  { id: "sound-duel", title: "Sound Duel", level: "Letter", subject: "Battle", component: <SoundDuel /> },
];

export default function SimulationsPage() {
  const [activeSimId, setActiveSimId] = useState("bundle-builder");
  const activeSim = SIMS.find(s => s.id === activeSimId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      
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
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Level-Wise <span className="text-blue-600">Simulations</span></h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Select a student level to launch the corresponding digital manipulative.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[28px] shadow-sm">
             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                <Info className="w-5 h-5" />
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight max-w-[200px]">
                These tools are optimized for tablets and mobile devices in high-impact field settings.
             </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12 items-start">
         
         {/* Sidebar: Level Selector */}
         <div className="space-y-8 h-full bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800">
            
            {/* 2v2 Battle Mode */}
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 px-2">
                  <Play className="w-3 h-3 fill-current" /> 2v2 Battle Arena
               </h3>
               <div className="space-y-2">
                  {SIMS.filter(s => s.subject === "Battle").map(sim => (
                     <button
                        key={sim.id}
                        onClick={() => setActiveSimId(sim.id)}
                        className={cn(
                           "w-full px-5 py-4 rounded-2xl text-left transition-all flex items-center justify-between group",
                           activeSimId === sim.id 
                              ? "bg-orange-600 shadow-xl shadow-orange-900/10 text-white" 
                              : "text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        )}
                     >
                        <div className="space-y-0.5">
                           <p className={cn("text-[8px] font-black uppercase tracking-widest", activeSimId === sim.id ? "text-orange-200" : "text-orange-400")}>Timer: 60s</p>
                           <p className="font-bold">{sim.title}</p>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 transition-transform", activeSimId === sim.id ? "translate-x-1" : "opacity-0")} />
                     </button>
                  ))}
               </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Math Section */}
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                  <Binary className="w-3 h-3" /> Numeracy Levels
               </h3>
               <div className="space-y-2">
                  {SIMS.filter(s => s.subject === "Math").map(sim => (
                     <button
                        key={sim.id}
                        onClick={() => setActiveSimId(sim.id)}
                        className={cn(
                           "w-full px-5 py-4 rounded-2xl text-left transition-all flex items-center justify-between group",
                           activeSimId === sim.id 
                              ? "bg-white dark:bg-slate-700 shadow-xl shadow-blue-900/5 text-blue-600 border border-blue-100 dark:border-blue-600" 
                              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                     >
                        <div className="space-y-0.5">
                           <p className="text-xs font-black uppercase tracking-widest opacity-60">Level: {sim.level}</p>
                           <p className="font-bold">{sim.title}</p>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 transition-transform", activeSimId === sim.id ? "translate-x-1" : "opacity-0")} />
                     </button>
                  ))}
               </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Literacy Section */}
            <div className="space-y-4">
               <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                  <SpellCheck className="w-3 h-3" /> Literacy Levels
               </h3>
               <div className="space-y-2">
                  {SIMS.filter(s => s.subject === "Literacy").map(sim => (
                     <button
                        key={sim.id}
                        onClick={() => setActiveSimId(sim.id)}
                        className={cn(
                           "w-full px-5 py-4 rounded-2xl text-left transition-all flex items-center justify-between group",
                           activeSimId === sim.id 
                              ? "bg-white dark:bg-slate-700 shadow-xl shadow-blue-900/5 text-blue-600 border border-blue-100 dark:border-blue-600" 
                              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                     >
                        <div className="space-y-0.5">
                           <p className="text-xs font-black uppercase tracking-widest opacity-60">Level: {sim.level}</p>
                           <p className="font-bold">{sim.title}</p>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 transition-transform", activeSimId === sim.id ? "translate-x-1" : "opacity-0")} />
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Main Content: The Active Simulation */}
         <div className="lg:col-span-3 space-y-8">
            <div className="animate-in fade-in zoom-in-95 duration-500">
               {activeSim?.component}
            </div>

            {/* Simulation Context Card */}
            <div className="bg-slate-900 rounded-[48px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-16 h-16" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className={cn("p-5 rounded-3xl", activeSim?.subject === "Battle" ? "bg-orange-600" : "bg-blue-600")}>
                     <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                     <h3 className="text-xl font-bold">You are running the {activeSim?.title} tool</h3>
                     <p className="text-slate-400 text-sm font-medium">This manipulative is specifically designed for {activeSim?.subject === "Battle" ? "Competitive Team Play" : `students at the ${activeSim?.level} Level`}.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
