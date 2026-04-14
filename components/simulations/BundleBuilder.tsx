'use client';
import { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Package, Info, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { usePoints } from '@/lib/points-store';
import GameHeader from '@/components/games/GameHeader';

export default function BundleBuilder() {
  const { addXP } = usePoints();
  const [sticks, setSticks] = useState(0);
  const [bundles, setBundles] = useState(0);
  const [showTieHint, setShowTieHint] = useState(false);

  const addStick = () => {
    if (sticks < 9) {
      setSticks(prev => prev + 1);
    } else {
      setShowTieHint(true);
    }
  };

  const removeStick = () => {
    if (sticks > 0) setSticks(prev => prev - 1);
  };

  const tieBundle = () => {
    setBundles(prev => prev + 1);
    setSticks(0);
    setShowTieHint(false);
    addXP(10); // 10 XP per bundle tied
  };

  const reset = () => {
    setSticks(0);
    setBundles(0);
    setShowTieHint(false);
  };

  return (
    <div className="space-y-4">
      <GameHeader title="काड्या आणि गट्टे (Sticks & Bundles)" score={bundles} total={bundles + (sticks > 0 ? 1 : 0)} />
      
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative">
      
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div className="space-y-1 text-center sm:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Package className="w-3 h-3" /> Digital Manipulative
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sticks & Bundles</h2>
           <p className="text-slate-500 text-sm font-medium">Demonstrate units (ones) and tens to students.</p>
        </div>

        <button 
           onClick={reset}
           className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all active:scale-90"
        >
           <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
         
         {/* LEFT: The Workspace */}
         <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-8 aspect-video relative flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
               
               {/* Sticks Grid */}
               <div className="flex flex-wrap gap-3 justify-center max-w-[280px]">
                  {Array.from({ length: sticks }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-4 h-24 bg-orange-200 dark:bg-orange-900/40 border-2 border-orange-400 dark:border-orange-500/50 rounded-full animate-in zoom-in-50 slide-in-from-top-12 duration-300 shadow-sm"
                    ></div>
                  ))}
                  {sticks === 0 && <span className="text-slate-400 font-bold text-sm tracking-widest uppercase opacity-40">Add sticks here</span>}
               </div>

               {/* Tie Alert Modal/Hint */}
               {showTieHint && (
                 <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 rounded-[30px]">
                    <CheckCircle2 className="w-16 h-16 text-white mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-white mb-2">You have 10 sticks!</h3>
                    <p className="text-blue-100 mb-8 font-medium">In TaRL, 10 sticks must be tied into 1 bundle.</p>
                    <button 
                       onClick={tieBundle}
                       className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl shadow-xl shadow-blue-900/40 active:scale-95 transition-all flex items-center gap-2"
                    >
                       TIE BUNDLE NOW <Package className="w-5 h-5"/>
                    </button>
                 </div>
               )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
               <button 
                  onClick={addStick}
                  className="flex-1 h-20 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-xl flex items-center justify-center gap-3"
               >
                  <Plus className="w-6 h-6" /> ADD STICK
               </button>
               <button 
                  onClick={removeStick}
                  className="w-20 h-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 font-black rounded-3xl active:scale-95 transition-all flex items-center justify-center"
               >
                  <Minus className="w-6 h-6" />
               </button>
            </div>
         </div>

         {/* RIGHT: The Storage (Bundles) */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Bundles (Tens)</h3>
               <span className="bg-blue-600 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">{bundles}</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[32px] p-8 min-h-[300px] flex flex-wrap gap-6 items-start content-start border border-blue-100 dark:border-blue-800">
               {Array.from({ length: bundles }).map((_, i) => (
                 <div key={i} className="relative group animate-in slide-in-from-right-8 duration-500">
                    {/* The Bundle Visual */}
                    <div className="w-14 h-24 bg-orange-300 dark:bg-orange-800 border-x-4 border-orange-500 dark:border-orange-600 rounded-lg relative flex items-center justify-center shadow-lg">
                       <div className="absolute inset-y-0 w-1 bg-orange-400/30 left-2"></div>
                       <div className="absolute inset-y-0 w-1 bg-orange-400/30 right-2"></div>
                       <div className="w-full h-2 bg-blue-600/80 absolute top-1/2 -translate-y-1/2 shadow-sm border-y border-blue-500"></div>
                       <span className="text-[10px] font-black text-white absolute bottom-1">10</span>
                    </div>
                 </div>
               ))}
               {bundles === 0 && <p className="text-blue-500/40 font-black text-xs uppercase tracking-widest mt-4">Empty Storage</p>}
            </div>

            {/* Instruction Card */}
            <div className="bg-slate-900 text-white rounded-[32px] p-6 space-y-3 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Info className="w-8 h-8" />
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Classroom Use</h4>
               <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Use this digital tool for demonstrating place value to a group of students in the field. Ideal for showing that <span className="text-white font-bold">10 units</span> are equivalent to <span className="text-white font-bold">1 ten</span>.
               </p>
            </div>
         </div>
         </div>
      </div>
    </div>
  );
}
