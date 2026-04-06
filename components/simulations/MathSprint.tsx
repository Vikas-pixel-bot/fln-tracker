'use client';
import { useState, useEffect } from 'react';
import { Binary, Plus, Percent as Minus, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import CompetitiveArena from './CompetitiveArena';
import { cn } from "@/lib/utils";

type Problem = { q: string; a: number; options: number[] };

function generateProblem(): Problem {
  const isAdd = Math.random() > 0.5;
  const n1 = Math.floor(Math.random() * 20) + 1;
  const n2 = Math.floor(Math.random() * 10) + 1;
  const a = isAdd ? n1 + n2 : n1 - n2;
  const q = `${n1} ${isAdd ? "+" : "-"} ${n2}`;
  const options = [a, a + 1, a - 1, a + 2].sort(() => 0.5 - Math.random());
  return { q, a, options };
}

export default function MathSprint() {
  const [probA, setProbA] = useState<Problem>(generateProblem());
  const [probB, setProbB] = useState<Problem>(generateProblem());
  const [feedbackA, setFeedbackA] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackB, setFeedbackB] = useState<'idle' | 'success' | 'error'>('idle');

  return (
    <CompetitiveArena 
      title="Flash Math Sprint" 
      description="2v2 Arithmetic Race: Solve addition and subtraction problems as fast as you can!"
      icon={<Binary className="w-10 h-10 text-white" />}
      duration={60}
    >
      {({ gameState, addPoint, scores }) => (
        <div className="flex-1 flex gap-px bg-white/5 overflow-hidden rounded-[40px] border border-white/5">
          
          {/* TEAM A ARENA */}
          <div className={cn("flex-1 p-10 flex flex-col items-center justify-center space-y-12 transition-all", feedbackA === 'success' ? "bg-blue-600/10" : feedbackA === 'error' ? "bg-red-600/10" : "bg-slate-900/40")}>
            <div className="text-center space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Team A Zone
               </div>
               <div className="text-8xl font-black font-mono tracking-tighter text-blue-100">
                  {probA.q}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
               {probA.options.map((opt, i) => (
                 <button
                   key={`a-${i}-${opt}`}
                   onClick={() => {
                     if (opt === probA.a) {
                       setFeedbackA('success');
                       addPoint('A');
                       setTimeout(() => { setProbA(generateProblem()); setFeedbackA('idle'); }, 300);
                     } else {
                       setFeedbackA('error');
                       setTimeout(() => setFeedbackA('idle'), 500);
                     }
                   }}
                   disabled={gameState !== 'running'}
                   className="h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-3xl font-black hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-95"
                 >
                   {opt}
                 </button>
               ))}
            </div>
          </div>

          {/* TEAM B ARENA */}
          <div className={cn("flex-1 p-10 flex flex-col items-center justify-center space-y-12 transition-all", feedbackB === 'success' ? "bg-emerald-600/10" : feedbackB === 'error' ? "bg-red-600/10" : "bg-slate-900/40")}>
             <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Team B Zone
                </div>
                <div className="text-8xl font-black font-mono tracking-tighter text-emerald-100">
                   {probB.q}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
               {probB.options.map((opt, i) => (
                 <button
                   key={`b-${i}-${opt}`}
                   onClick={() => {
                     if (opt === probB.a) {
                       setFeedbackB('success');
                       addPoint('B');
                       setTimeout(() => { setProbB(generateProblem()); setFeedbackB('idle'); }, 300);
                     } else {
                       setFeedbackB('error');
                       setTimeout(() => setFeedbackB('idle'), 500);
                     }
                   }}
                   disabled={gameState !== 'running'}
                   className="h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-3xl font-black hover:bg-emerald-600 hover:border-emerald-500 transition-all active:scale-95"
                 >
                   {opt}
                 </button>
               ))}
             </div>
          </div>

          {/* Center Decoration */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-950 rounded-full border border-white/10 shadow-2xl z-10">
             <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}
