'use client';
import { useState, useEffect, useRef } from 'react';
import { Volume2, Star, Music } from 'lucide-react';
import { cn } from "@/lib/utils";

// Full Marathi consonant set (व्यंजने)
const MARATHI_LETTERS = [
  "क", "ख", "ग", "घ",
  "च", "छ", "ज", "झ",
  "ट", "ठ", "ड", "ढ",
  "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म",
  "य", "र", "ल", "व",
  "श", "ष", "स", "ह", "ळ",
];

function speakMarathi(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  // mr-IN for Marathi; falls back gracefully to hi-IN or default on devices without Marathi TTS
  u.lang = 'mr-IN';
  u.rate = 0.75;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

export default function SoundExplorer() {
  const [target, setTarget] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [speaking, setSpeaking] = useState(false);

  const speak = (letter: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(letter);
    u.lang = 'mr-IN';
    u.rate = 0.75;
    u.pitch = 1.0;
    setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const generateNew = () => {
    const t = MARATHI_LETTERS[Math.floor(Math.random() * MARATHI_LETTERS.length)];
    const others = MARATHI_LETTERS.filter(x => x !== t).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTarget(t);
    setOptions([t, ...others].sort(() => 0.5 - Math.random()));
    setFeedback('idle');
    // Auto-play after a short delay so state has settled
    setTimeout(() => speak(t), 300);
  };

  useEffect(() => {
    generateNew();
  }, []);

  const checkLetter = (l: string) => {
    if (feedback !== 'idle') return;
    if (l === target) {
      setFeedback('success');
      setScore(prev => prev + 1);
      setTimeout(() => generateNew(), 1600);
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
              <Music className="w-3 h-3" /> साक्षरता: अक्षर पातळी
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">ध्वनी शोधा</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">

         {/* SOUND BUTTON — tap to replay the letter sound */}
         <div className="relative group">
            <button
              onClick={() => speak(target)}
              disabled={!target}
              className={cn(
                "w-48 h-48 rounded-[60px] text-white flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all",
                feedback === 'success'
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
              )}
            >
               <Volume2 className={cn("w-16 h-16", speaking && "animate-pulse")} />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                 {speaking ? "बोलत आहे…" : "ध्वनी ऐका"}
               </span>
            </button>
            {feedback === 'success' && (
               <div className="absolute -top-4 -right-4 bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-xs animate-bounce">
                  +१ ⭐
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
                  feedback === 'success' && opt === target
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : feedback === 'error' && opt === target
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "text-slate-900 dark:text-white hover:border-blue-600 hover:text-blue-600",
                  feedback === 'error' && opt !== target ? "opacity-30" : ""
                )}
              >
                {opt}
              </button>
            ))}
         </div>

         {/* Teacher guide */}
         <div className="w-full max-w-xl bg-slate-900 p-6 rounded-[32px] flex items-start gap-4">
            <div className="p-3 bg-violet-600 rounded-2xl">
               <Star className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
               <h4 className="text-sm font-black text-white uppercase tracking-widest">शिक्षकांसाठी मार्गदर्शन</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  "ध्वनी ऐका" बटण दाबा — अक्षर बोलले जाईल. विद्यार्थ्याने तो ध्वनी ऐकून योग्य अक्षर टॅप करायचे. पुन्हा ऐकायचे असेल तर बटण पुन्हा दाबा.
               </p>
            </div>
         </div>
      </div>

      {/* Score */}
      <div className="absolute bottom-10 left-10 flex items-center gap-3">
         <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-400/20 text-black">
            {score}
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">गुण</span>
      </div>
    </div>
  );
}
