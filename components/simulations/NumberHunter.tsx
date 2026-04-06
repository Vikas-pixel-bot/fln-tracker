'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function NumberHunter() {
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  const generateNew = () => {
    setTarget(Math.floor(Math.random() * 9) + 1);
    setFeedback('idle');
  };

  useEffect(() => {
    generateNew();
  }, []);

  const handleGuess = (num: number) => {
    if (num === target) {
      setFeedback('success');
      setScore(prev => prev + 1);
      setTimeout(generateNew, 1500);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative min-h-[600px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Trophy className="w-3 h-3" /> Level: 1-9 (Number Sense)
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Number Hunter</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-blue-600 dark:text-blue-400">
              Score: {score}
           </div>
           <button 
              onClick={() => { setScore(0); generateNew(); }}
              className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"
           >
              <RotateCcw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
         
         {/* Visual Count Side */}
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-12 aspect-square relative flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4 justify-center max-w-[300px]">
               {Array.from({ length: target }).map((_, i) => (
                 <div 
                   key={i} 
                   className="w-5 h-28 bg-orange-200 dark:bg-orange-900/40 border-2 border-orange-400 dark:border-orange-500/50 rounded-full animate-in zoom-in-50 slide-in-from-bottom-12 duration-500 shadow-sm"
                 ></div>
               ))}
            </div>

            {/* Success Overlay */}
            {feedback === 'success' && (
              <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md rounded-[38px] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                 <CheckCircle2 className="w-24 h-24 mb-4 animate-bounce" />
                 <h3 className="text-4xl font-black">Correct!</h3>
                 <p className="font-bold opacity-80">You found {target} sticks!</p>
              </div>
            )}

            {/* Error Feedback */}
            {feedback === 'error' && (
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[2px] rounded-[38px] flex items-center justify-center animate-in zoom-in-95 duration-200">
                 <XCircle className="w-24 h-24 text-red-500 animate-shake" />
              </div>
            )}
         </div>

         {/* Number Pad Side */}
         <div className="space-y-8">
            <div className="text-center lg:text-left">
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">How many sticks do you see?</h3>
               <p className="text-slate-500 font-medium">Count carefully and pick the matching number below.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[1,2,3,4,5,6,7,8,9].map((num) => (
                 <button
                   key={num}
                   onClick={() => handleGuess(num)}
                   disabled={feedback === 'success'}
                   className={cn(
                     "h-24 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl text-3xl font-black transition-all active:scale-90",
                     feedback === 'success' && num === target ? "bg-emerald-500 border-emerald-500 text-white" : "text-slate-600 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600"
                   )}
                 >
                   {num}
                 </button>
               ))}
            </div>

            <div className="bg-blue-600 text-white rounded-[32px] p-6 flex items-start gap-4">
               <HelpCircle className="w-6 h-6 flex-shrink-0 mt-1 opacity-60" />
               <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-200">Instruction</h4>
                  <p className="text-xs text-blue-50 leading-relaxed font-medium">
                     This activity helps students at the <span className="font-bold">Beginner level</span> connect a physical quantity of objects to its numerical symbol.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
