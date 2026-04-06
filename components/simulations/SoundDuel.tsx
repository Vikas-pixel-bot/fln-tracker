'use client';
import { useState, useEffect } from 'react';
import { Volume2, SpellCheck, Star, Zap, Swords } from 'lucide-react';
import CompetitiveArena from './CompetitiveArena';
import { cn } from "@/lib/utils";

const MARATHI_LETTERS = ["अ", "ब", "क", "ड", "ए", "फ", "ग", "ह", "इ", "ज"];

function generateSoundProblem(): { t: string; options: string[] } {
  const t = MARATHI_LETTERS[Math.floor(Math.random() * MARATHI_LETTERS.length)];
  const others = MARATHI_LETTERS.filter(x => x !== t).sort(() => 0.5 - Math.random()).slice(0, 3);
  return { t, options: [t, ...others].sort(() => 0.5 - Math.random()) };
}

export default function SoundDuel() {
  const [probA, setProbA] = useState(generateSoundProblem());
  const [probB, setProbB] = useState(generateSoundProblem());
  const [feedbackA, setFeedbackA] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackB, setFeedbackB] = useState<'idle' | 'success' | 'error'>('idle');

  return (
    <CompetitiveArena 
      title="Phonics Sound Duel" 
      description="2v2 Literacy Battle: Identify the correct letter sound faster than the opposing team!"
      icon={<SpellCheck className="w-10 h-10 text-white" />}
      duration={60}
    >
      {({ gameState, addPoint, scores }) => (
        <div className="flex-1 flex gap-px bg-white/5 overflow-hidden rounded-[40px] border border-white/5">
          
          {/* TEAM A ARENA */}
          <div className={cn("flex-1 p-10 flex flex-col items-center justify-center space-y-8 transition-all", feedbackA === 'success' ? "bg-indigo-600/10" : feedbackA === 'error' ? "bg-red-600/10" : "bg-slate-900/40")}>
            <div className="text-center space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Team A Zone
               </div>
               <button className="w-32 h-32 bg-indigo-600 rounded-[40px] shadow-2xl flex items-center justify-center animate-pulse">
                  <Volume2 className="w-12 h-12 text-white" />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
               {probA.options.map((opt, i) => (
                 <button
                   key={`a-s-${i}-${opt}`}
                   onClick={() => {
                     if (opt === probA.t) {
                       setFeedbackA('success');
                       addPoint('A');
                       setTimeout(() => { setProbA(generateSoundProblem()); setFeedbackA('idle'); }, 400);
                     } else {
                       setFeedbackA('error');
                       setTimeout(() => setFeedbackA('idle'), 500);
                     }
                   }}
                   disabled={gameState !== 'running'}
                   className="h-28 bg-white/5 border-2 border-white/10 rounded-3xl text-5xl font-black hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-95"
                 >
                   {opt}
                 </button>
               ))}
            </div>
          </div>

          {/* TEAM B ARENA */}
          <div className={cn("flex-1 p-10 flex flex-col items-center justify-center space-y-8 transition-all", feedbackB === 'success' ? "bg-violet-600/10" : feedbackB === 'error' ? "bg-red-600/10" : "bg-slate-900/40")}>
             <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Team B Zone
                </div>
                <button className="w-32 h-32 bg-violet-600 rounded-[40px] shadow-2xl flex items-center justify-center animate-pulse">
                   <Volume2 className="w-12 h-12 text-white" />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
               {probB.options.map((opt, i) => (
                 <button
                   key={`b-s-${i}-${opt}`}
                   onClick={() => {
                     if (opt === probB.t) {
                       setFeedbackB('success');
                       addPoint('B');
                       setTimeout(() => { setProbB(generateSoundProblem()); setFeedbackB('idle'); }, 400);
                     } else {
                       setFeedbackB('error');
                       setTimeout(() => setFeedbackB('idle'), 500);
                     }
                   }}
                   disabled={gameState !== 'running'}
                   className="h-28 bg-white/5 border-2 border-white/10 rounded-3xl text-5xl font-black hover:bg-violet-600 hover:border-violet-500 transition-all active:scale-95"
                 >
                   {opt}
                 </button>
               ))}
             </div>
          </div>

          {/* Center Decoration */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-950 rounded-full border border-white/10 shadow-2xl z-10">
             <Swords className="w-8 h-8 text-indigo-500 animate-bounce" />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}
