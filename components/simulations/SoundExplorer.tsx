'use client';
import { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, HelpCircle, Star, Music } from 'lucide-react';
import { cn } from "@/lib/utils";

const MARATHI_LETTERS = ["अ", "ब", "क", "ड", "ए", "फ", "ग", "ह", "इ", "ज"];
const ENGLISH_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export default function SoundExplorer() {
  const [lang, setLang] = useState<'marathi' | 'english'>('marathi');
  const [target, setTarget] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  const generateNew = (l = lang) => {
    const pool = l === 'marathi' ? MARATHI_LETTERS : ENGLISH_LETTERS;
    const t = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter(x => x !== t).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTarget(t);
    setOptions([t, ...others].sort(() => 0.5 - Math.random()));
    setFeedback('idle');
  };

  useEffect(() => {
    generateNew();
  }, []);

  const handleLangChange = (l: 'marathi' | 'english') => {
    setLang(l);
    generateNew(l);
  };

  const checkLetter = (l: string) => {
    if (l === target) {
      setFeedback('success');
      setScore(prev => prev + 1);
      setTimeout(() => generateNew(), 1500);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative min-h-[600px] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div className="space-y-1 text-center sm:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Music className="w-3 h-3" /> Literacy: Letter Level
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sound Explorer</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 p-1 rounded-2xl">
          <button 
            onClick={() => handleLangChange('marathi')}
            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all", lang === 'marathi' ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500")}
          >
            मराठी
          </button>
          <button 
            onClick={() => handleLangChange('english')}
            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all", lang === 'english' ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500")}
          >
            English
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
         
         {/* THE SOUND BUTTON */}
         <div className="relative group">
            <button 
              onClick={() => {}} // In a real app, play audio here
              className={cn(
                "w-48 h-48 rounded-[60px] bg-blue-600 text-white flex flex-col items-center justify-center gap-2 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all group-hover:bg-blue-700",
                feedback === 'success' && "bg-emerald-500 shadow-emerald-500/20 group-hover:bg-emerald-500"
              )}
            >
               <Volume2 className="w-16 h-16 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Listen to Sound</span>
            </button>
            {feedback === 'success' && (
               <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-xs animate-bounce">
                  +1 Star
               </div>
            )}
         </div>

         {/* LETTER OPTIONS */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-2xl px-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => checkLetter(opt)}
                disabled={feedback === 'success'}
                className={cn(
                  "aspect-square rounded-[32px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-6xl font-black transition-all active:scale-90",
                  feedback === 'success' && opt === target ? "bg-emerald-500 border-emerald-500 text-white" : "text-slate-900 dark:text-white hover:border-blue-600 hover:text-blue-600",
                  feedback === 'error' && opt !== target ? "opacity-30" : ""
                )}
              >
                {opt}
              </button>
            ))}
         </div>

         {/* Instructional HUD */}
         <div className="w-full max-w-xl bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 flex items-start gap-4">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/40 rounded-2xl">
               <Star className="w-6 h-6 text-violet-600" />
            </div>
            <div className="space-y-1">
               <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Teacher Guide</h4>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Focus on students identifying the <span className="text-violet-600 font-bold">Phonetic Sound</span>. Play the sound and ask the student to touch the letter they hear. Use this to bridge the gap between spoken and written language.
               </p>
            </div>
         </div>
      </div>

      {/* Persistence Hud */}
      <div className="absolute bottom-10 left-10 flex items-center gap-3">
         <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-400/20 text-black">
            {score}
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Stars</span>
      </div>
    </div>
  );
}
