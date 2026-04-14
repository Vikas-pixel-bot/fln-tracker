'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePoints } from '@/lib/points-store';
import GameHeader from '@/components/games/GameHeader';
import { RotateCcw, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONSONANTS = ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'ट', 'ठ', 'ड', 'त', 'थ', 'द', 'न', 'प', 'फ', 'ब', 'म', 'य', 'र', 'ल', 'व', 'श', 'स', 'ह'];
const MATRAS = [
  { sym: '', name: 'अ (None)' },
  { sym: 'ा', name: 'आ-मात्रा' },
  { sym: 'ि', name: 'इ-मात्रा' },
  { sym: 'ी', name: 'ई-मात्रा' },
  { sym: 'ु', name: 'उ-मात्रा' },
  { sym: 'ू', name: 'ऊ-मात्रा' },
  { sym: 'े', name: 'ए-मात्रा' },
  { sym: 'ै', name: 'ऐ-मात्रा' },
  { sym: 'ो', name: 'ओ-मात्रा' },
  { sym: 'ौ', name: 'औ-मात्रा' },
];

export default function MatraChakra() {
  const { addXP } = usePoints();
  const [spinning, setSpinning] = useState(false);
  const [targetConsonant, setTargetConsonant] = useState(CONSONANTS[0]);
  const [targetMatra, setTargetMatra] = useState(MATRAS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const consonantRef = useRef<HTMLDivElement>(null);
  const matraRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setFeedback(null);
    setSelected(null);

    const newConsonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    const newMatra = MATRAS[Math.floor(Math.random() * MATRAS.length)];

    // Simulate spin duration
    setTimeout(() => {
      setTargetConsonant(newConsonant);
      setTargetMatra(newMatra);
      setSpinning(false);
      
      // Generate options
      const correct = newConsonant + newMatra.sym;
      const wrongOptions = new Set<string>();
      while (wrongOptions.size < 3) {
        const rc = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
        const rm = MATRAS[Math.floor(Math.random() * MATRAS.length)].sym;
        const opt = rc + rm;
        if (opt !== correct) wrongOptions.add(opt);
      }
      setOptions([correct, ...Array.from(wrongOptions)].sort(() => Math.random() - 0.5));
    }, 2000);
  };

  useEffect(() => {
    spin(); // Initial spin
  }, []);

  const handleSelect = (opt: string) => {
    if (feedback || spinning) return;
    setSelected(opt);
    const isCorrect = opt === targetConsonant + targetMatra.sym;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    
    if (isCorrect) {
      setScore(s => s + 1);
      addXP(15);
    }

    setTimeout(() => {
      if (isCorrect) spin();
      else {
        setFeedback(null);
        setSelected(null);
      }
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0">
      <GameHeader title="मात्रा चक्र (Matra Wheel)" score={score} total={total} />

      <div className="space-y-8">
        
        {/* The Wheels Area */}
        <div className="flex justify-center items-center gap-4 py-12 relative">
          
          {/* Decorative Laser Line */}
          <div className="absolute inset-x-0 h-1 bg-blue-500/20 top-1/2 -translate-y-1/2 blur-sm z-0" />
          <div className="absolute inset-x-0 h-0.5 bg-blue-400/50 top-1/2 -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />

          {/* Consonant Wheel */}
          <div className="relative w-32 h-48 bg-slate-900 border-4 border-slate-700 rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center">
             <div className={cn(
               "flex flex-col gap-4 py-8 transition-transform duration-[2000ms] ease-out-back",
               spinning ? "animate-wheel-spin" : "translate-y-0"
             )}>
                {spinning ? (
                  CONSONANTS.concat(CONSONANTS).map((c, i) => (
                    <div key={i} className="text-5xl font-black text-white px-8 py-2 opacity-50">{c}</div>
                  ))
                ) : (
                  <div className="text-6xl font-black text-white px-8 py-4 animate-in zoom-in-50 duration-500">{targetConsonant}</div>
                )}
             </div>
             {/* Gradient Overlays */}
             <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900 to-transparent z-10" />
             <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent z-10" />
          </div>

          <div className="text-4xl font-black text-slate-500 z-10">+</div>

          {/* Matra Wheel */}
          <div className="relative w-32 h-48 bg-slate-900 border-4 border-slate-700 rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center">
             <div className={cn(
               "flex flex-col gap-4 py-8 transition-transform duration-[2000ms] ease-out-back",
               spinning ? "animate-wheel-spin-slow" : "translate-y-0"
             )}>
                {spinning ? (
                  MATRAS.concat(MATRAS).map((m, i) => (
                    <div key={i} className="text-5xl font-black text-blue-400 px-8 py-2 opacity-50">{m.sym || 'अ'}</div>
                  ))
                ) : (
                  <div className="text-6xl font-black text-blue-400 px-8 py-4 animate-in zoom-in-50 duration-500">{targetMatra.sym || 'अ'}</div>
                )}
             </div>
             {/* Gradient Overlays */}
             <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900 to-transparent z-10" />
             <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent z-10" />
          </div>

        </div>

        {/* Question Area */}
        <div className="text-center space-y-4">
           {!spinning && (
             <>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pick the correct combination</p>
               <h3 className="text-2xl font-black text-white">
                 {targetConsonant} <span className="text-slate-500">+</span> {targetMatra.sym || 'अ'} = ?
               </h3>
               <p className="text-blue-400 text-sm font-bold">{targetMatra.name}</p>
             </>
           )}
           {spinning && (
             <div className="flex flex-col items-center gap-2 animate-pulse">
               <Zap className="w-8 h-8 text-blue-400" />
               <p className="text-blue-400 font-black uppercase text-sm tracking-tighter">Spinning Chakra...</p>
             </div>
           )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
               key={i}
               disabled={spinning || feedback !== null}
               onClick={() => handleSelect(opt)}
               className={cn(
                 "relative h-24 rounded-[24px] border-2 text-4xl font-black transition-all duration-300 active:scale-95 group overflow-hidden",
                 feedback === null && !spinning && "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                 spinning && "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 opacity-50",
                 selected === opt && feedback === 'correct' && "bg-emerald-500 border-emerald-500 text-white scale-105 shadow-xl shadow-emerald-500/30",
                 selected === opt && feedback === 'wrong' && "bg-red-500 border-red-500 text-white animate-shake",
                 feedback !== null && opt === targetConsonant + targetMatra.sym && feedback === 'wrong' && "bg-emerald-100 border-emerald-400 text-emerald-700"
               )}
            >
              {opt}
              {selected === opt && feedback === 'correct' && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-white animate-in zoom-in duration-300" />}
              {selected === opt && feedback === 'wrong' && <XCircle className="absolute top-2 right-2 w-5 h-5 text-white animate-in zoom-in duration-300" />}
            </button>
          ))}
        </div>

        {/* Hint / Instructions */}
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                 <RotateCcw className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                The **Matra Chakra** helps you understand how vowel signs (matras) change the sound of a consonant. Watch the wheels spin and try to visualize the combined letter!
              </p>
           </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes wheel-spin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-wheel-spin {
          animation: wheel-spin 0.2s linear infinite;
        }
        .animate-wheel-spin-slow {
          animation: wheel-spin 0.3s linear infinite;
        }
        .ease-out-back {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
