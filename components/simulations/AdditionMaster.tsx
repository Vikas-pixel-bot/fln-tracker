'use client';
import { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Package, Info, CheckCircle2, ChevronRight, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

type NumberState = { tens: number; ones: number };

export default function AdditionMaster() {
  const [num1, setNum1] = useState<NumberState>({ tens: 1, ones: 7 });
  const [num2, setNum2] = useState<NumberState>({ tens: 0, ones: 5 });
  const [step, setStep] = useState<'setup' | 'add_ones' | 're_bundle' | 'add_tens' | 'completed'>('setup');
  const [combinedOnes, setCombinedOnes] = useState(0);
  const [combinedTens, setCombinedTens] = useState(0);

  const reset = () => {
    setNum1({ tens: Math.floor(Math.random() * 3) + 1, ones: Math.floor(Math.random() * 9) + 1 });
    setNum2({ tens: Math.floor(Math.random() * 2) + 1, ones: Math.floor(Math.random() * 9) + 1 });
    setStep('setup');
    setCombinedOnes(0);
    setCombinedTens(0);
  };

  const startAddition = () => {
    setCombinedOnes(num1.ones + num2.ones);
    setStep('add_ones');
  };

  const doRebundle = () => {
    setCombinedOnes(prev => prev - 10);
    setCombinedTens(prev => prev + 1);
    setStep('add_tens');
  };

  const finalize = () => {
    setCombinedTens(prev => prev + num1.tens + num2.tens);
    setStep('completed');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-10 max-w-5xl mx-auto overflow-hidden relative min-h-[700px]">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Package className="w-3 h-3" /> Level: Operations
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Addition Master</h2>
        </div>
        <button 
           onClick={reset}
           className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"
        >
           <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
         
         {/* THE COLUMNS (Visual Space) */}
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 h-[400px]">
               {/* TENS COLUMN */}
               <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] p-6 border-2 border-blue-100 dark:border-blue-800 relative flex flex-col items-center">
                  <span className="absolute -top-3 px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Tens</span>
                  <div className="flex flex-wrap gap-2 justify-center content-start py-4">
                     {step === 'setup' && (
                       <>
                         {Array.from({ length: num1.tens }).map((_, i) => <Bundle key={`n1t-${i}`} color="blue" />)}
                         {Array.from({ length: num2.tens }).map((_, i) => <Bundle key={`n2t-${i}`} color="blue" />)}
                       </>
                     )}
                     {(step === 'add_tens' || step === 'completed') && (
                        Array.from({ length: combinedTens + (step === 'completed' ? 0 : num1.tens + num2.tens) }).map((_, i) => <Bundle key={`combt-${i}`} color="indigo" />)
                     )}
                  </div>
               </div>

               {/* ONES COLUMN */}
               <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-[32px] p-6 border-2 border-amber-100 dark:border-amber-800 relative flex flex-col items-center overflow-hidden">
                  <span className="absolute -top-3 px-4 py-1 bg-amber-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Ones</span>
                  <div className="flex flex-wrap gap-2 justify-center content-start py-4">
                     {step === 'setup' && (
                       <>
                         {Array.from({ length: num1.ones }).map((_, i) => <Stick key={`n1o-${i}`} />)}
                         {Array.from({ length: num2.ones }).map((_, i) => <Stick key={`n2o-${i}`} />)}
                       </>
                     )}
                     {step !== 'setup' && (
                        Array.from({ length: combinedOnes }).map((_, i) => <Stick key={`combo-${i}`} />)
                     )}
                  </div>

                  {/* Addition Line Overlay */}
                  {step === 'setup' && <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-200 dark:bg-amber-800 pointer-events-none"></div>}
               </div>
            </div>

            {/* Arithmetic Result HUD */}
            <div className="p-8 bg-slate-900 rounded-[32px] text-white flex items-center justify-between shadow-2xl">
                <div className="space-y-1">
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Problem</h3>
                   <div className="text-4xl font-black tracking-widest font-mono italic">
                      {num1.tens}{num1.ones} + {num2.tens}{num2.ones} = {step === 'completed' ? (combinedTens * 10 + combinedOnes) : '?'}
                   </div>
                </div>
                {step === 'completed' && <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-in zoom-in duration-500" />}
            </div>
         </div>

         {/* STEP CONTROLS (Pedagogical Flow) */}
         <div className="space-y-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Step by Step Guide</h3>
            
            <div className="space-y-4">
               {/* Step 1: Add Ones */}
               <div className={cn("p-6 rounded-3xl border-2 transition-all", step === 'setup' ? "bg-white dark:bg-slate-800 border-blue-600 shadow-xl" : "bg-slate-50 dark:bg-slate-900 border-transparent opacity-50")}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">1</span>
                    <h4 className="font-bold">Combine the Ones</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">First, we add all the loose sticks from both numbers together in the single column.</p>
                  {step === 'setup' && (
                    <button onClick={startAddition} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                       COMBINE ONES <ArrowDown className="w-4 h-4" />
                    </button>
                  )}
               </div>

               {/* Step 2: Re-bundle */}
               <div className={cn("p-6 rounded-3xl border-2 transition-all", step === 'add_ones' ? "bg-white dark:bg-slate-800 border-amber-600 shadow-xl" : "bg-slate-50 dark:bg-slate-900 border-transparent opacity-50")}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-black">2</span>
                    <h4 className="font-bold">Re-bundle (Carry Over)</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">If you have 10 or more sticks, tie them into a bundle and move it to the Tens column.</p>
                  {step === 'add_ones' && (
                     combinedOnes >= 10 ? (
                        <button onClick={doRebundle} className="w-full py-4 bg-amber-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                           TIE 10 STICKS <Package className="w-4 h-4" />
                        </button>
                     ) : (
                        <button onClick={finalize} className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                           NO CARRY-OVER <ChevronRight className="w-4 h-4" />
                        </button>
                     )
                  )}
               </div>

               {/* Step 3: Add Tens */}
               <div className={cn("p-6 rounded-3xl border-2 transition-all", step === 'add_tens' ? "bg-white dark:bg-slate-800 border-indigo-600 shadow-xl" : "bg-slate-50 dark:bg-slate-900 border-transparent opacity-50")}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">3</span>
                    <h4 className="font-bold">Total the Tens</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Now count all the bundles together, including any new one moved from the ones.</p>
                  {step === 'add_tens' && (
                    <button onClick={finalize} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                       SUM THE TENS <Plus className="w-4 h-4" />
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function Bundle({ color }: { color: "blue" | "indigo" }) {
  return (
    <div className={cn("w-10 h-20 bg-orange-300 dark:bg-orange-800 border-x-4 border-orange-500 rounded-lg relative flex items-center justify-center shadow-lg animate-in slide-in-from-top-4 duration-500")}>
       <div className={cn("w-full h-1.5 absolute top-1/2 -translate-y-1/2 border-y", color === "blue" ? "bg-blue-600 border-blue-500" : "bg-indigo-600 border-indigo-500")}></div>
    </div>
  );
}

function Stick() {
  return (
    <div className="w-3 h-20 bg-orange-200 dark:bg-orange-900/40 border-2 border-orange-400 rounded-full animate-in zoom-in-50 duration-300 shadow-sm"></div>
  );
}
