'use client';
import { useState, useEffect } from 'react';
import { SpellCheck, CheckCircle2, XCircle, RotateCcw, HelpCircle, Star, Image as LucideImage } from 'lucide-react';
import { cn } from "@/lib/utils";

const WORDS = [
  { word: "CAT", image: "🐱", letters: ["C", "A", "T"] },
  { word: "DOG", image: "🐶", letters: ["D", "O", "G"] },
  { word: "SUN", image: "☀️", letters: ["S", "U", "N"] },
  { word: "BAT", image: "🦇", letters: ["B", "A", "T"] },
  { word: "PEN", image: "🖋️", letters: ["P", "E", "N"] },
];

export default function WordBuilder() {
  const [target, setTarget] = useState(WORDS[0]);
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [letterBank, setLetterBank] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  const generateNew = () => {
    const t = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(t);
    setCurrentWord([]);
    // Shuffle target letters and add distractions
    const pool = [...t.letters, "B", "R", "L", "M"].sort(() => 0.5 - Math.random());
    setLetterBank(pool);
    setFeedback('idle');
  };

  useEffect(() => {
    generateNew();
  }, []);

  const addLetter = (l: string) => {
    if (feedback === 'success') return;
    const newWord = [...currentWord, l];
    setCurrentWord(newWord);

    if (newWord.length === target.word.length) {
      if (newWord.join("") === target.word) {
        setFeedback('success');
        setScore(prev => prev + 1);
        setTimeout(generateNew, 2000);
      } else {
        setFeedback('error');
        setTimeout(() => {
          setCurrentWord([]);
          setFeedback('idle');
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative min-h-[600px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <SpellCheck className="w-3 h-3" /> Literacy: Word Level
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Word Builder</h2>
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
         
         {/* THE IMAGE PROMPT */}
         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-12 aspect-square relative flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-[120px] filter drop-shadow-2xl animate-bounce">
               {target.image}
            </div>

            {/* Success Overlay */}
            {feedback === 'success' && (
              <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md rounded-[38px] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                 <CheckCircle2 className="w-24 h-24 mb-4 zoom-in duration-500" />
                 <h3 className="text-4xl font-black">Well Done!</h3>
                 <p className="font-bold opacity-80">You spelled {target.word}</p>
              </div>
            )}
         </div>

         {/* BUILDER AREA */}
         <div className="space-y-12">
            
            {/* The Input Slots */}
            <div className="flex items-center justify-center gap-4">
               {Array.from({ length: target.word.length }).map((_, i) => (
                 <div 
                   key={i} 
                   className={cn(
                     "w-16 h-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all",
                     feedback === 'error' ? "border-red-500 text-red-500 bg-red-50" :
                     currentWord[i] ? "border-blue-600 text-blue-600 bg-white" : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 border-dashed"
                   )}
                 >
                   {currentWord[i] || ""}
                 </div>
               ))}
            </div>

            {/* Letter Bank */}
            <div className="space-y-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">Available Letters</h3>
               <div className="flex flex-wrap gap-3 justify-center">
                  {letterBank.map((letter, i) => (
                    <button
                      key={i}
                      onClick={() => addLetter(letter)}
                      className="w-14 h-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-2xl font-black text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all shadow-sm"
                    >
                      {letter}
                    </button>
                  ))}
               </div>
            </div>

            {/* Instruction Card */}
            <div className="bg-slate-900 text-white rounded-[32px] p-6 flex items-start gap-4">
               <Star className="w-6 h-6 flex-shrink-0 mt-1 text-yellow-400" />
               <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Classroom Fun</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     Ask the student to say the name of the picture, then find each sound to build the word. This reinforces both phonics and spelling.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
