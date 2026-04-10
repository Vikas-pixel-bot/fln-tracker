'use client';
import { useState, useEffect } from 'react';
import { SpellCheck, CheckCircle2, RotateCcw, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

// Simple Marathi CVC words — no matras, suitable for Level 2 literacy
const WORDS = [
  { word: "कप",   display: "कप",   image: "☕",  letters: ["क", "प"],      hint: "पाणी पितात त्यात" },
  { word: "घर",   display: "घर",   image: "🏠", letters: ["घ", "र"],      hint: "आपण राहतो ते ठिकाण" },
  { word: "मन",   display: "मन",   image: "💭", letters: ["म", "न"],      hint: "विचार येतात तिथे" },
  { word: "वन",   display: "वन",   image: "🌲", letters: ["व", "न"],      hint: "झाडे भरपूर असतात" },
  { word: "जग",   display: "जग",   image: "🌍", letters: ["ज", "ग"],      hint: "आपण सगळे राहतो त्यावर" },
  { word: "दल",   display: "दल",   image: "🫘", letters: ["द", "ल"],      hint: "डाळीचे दुसरे नाव" },
  { word: "नभ",   display: "नभ",   image: "🌤️", letters: ["न", "भ"],      hint: "आकाशाचे दुसरे नाव" },
  { word: "कमल",  display: "कमल",  image: "🪷", letters: ["क", "म", "ल"], hint: "पाण्यात उगवणारे फूल" },
];

// Distractor letters — common Marathi consonants
const DISTRACTORS = ["ट", "ब", "च", "त", "ह", "स", "ख", "फ", "ड", "य"];

export default function WordBuilder() {
  const [idx, setIdx] = useState(0);
  const [currentWord, setCurrentWord] = useState<string[]>([]);
  const [letterBank, setLetterBank] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  const target = WORDS[idx % WORDS.length];

  const buildBank = (t: typeof WORDS[0]) => {
    // Pick distractors that are NOT already in the target letters
    const pool = DISTRACTORS.filter(d => !t.letters.includes(d));
    const picked = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...t.letters, ...picked].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    setCurrentWord([]);
    setFeedback('idle');
    setLetterBank(buildBank(target));
  }, [idx]);

  const addLetter = (l: string, bankIdx: number) => {
    if (feedback === 'success') return;
    const newWord = [...currentWord, l];
    // Remove used letter from bank (by index, not value)
    setLetterBank(prev => prev.filter((_, i) => i !== bankIdx));
    setCurrentWord(newWord);

    if (newWord.length === target.letters.length) {
      if (newWord.join("") === target.word) {
        setFeedback('success');
        setScore(prev => prev + 1);
        setTimeout(() => setIdx(i => i + 1), 2000);
      } else {
        setFeedback('error');
        setTimeout(() => {
          setCurrentWord([]);
          setFeedback('idle');
          setLetterBank(buildBank(target));
        }, 900);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative min-h-[600px] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <SpellCheck className="w-3 h-3" /> साक्षरता: शब्द पातळी
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">शब्द बनवा</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-blue-600 dark:text-blue-400">
            गुण: {score}
          </div>
          <button onClick={() => { setScore(0); setIdx(0); }}
            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">

        {/* Image + hint */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-12 aspect-square relative flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="text-[100px] filter drop-shadow-2xl animate-bounce">{target.image}</div>
          <p className="text-slate-500 text-sm font-medium italic text-center">{target.hint}</p>

          {feedback === 'success' && (
            <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md rounded-[38px] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
              <CheckCircle2 className="w-24 h-24 mb-4" />
              <h3 className="text-4xl font-black">शाब्बास!</h3>
              <p className="font-bold opacity-80 text-2xl">{target.display}</p>
            </div>
          )}
        </div>

        {/* Builder */}
        <div className="space-y-10">

          {/* Slots */}
          <div className="flex items-center justify-center gap-4">
            {Array.from({ length: target.letters.length }).map((_, i) => (
              <div key={i}
                className={cn(
                  "w-16 h-20 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all",
                  feedback === 'error' ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-950/20 animate-bounce" :
                  currentWord[i] ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/20" :
                  "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 border-dashed"
                )}>
                {currentWord[i] || ""}
              </div>
            ))}
          </div>

          {/* Letter bank */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">अक्षरे</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {letterBank.map((letter, i) => (
                <button key={i} onClick={() => addLetter(letter, i)}
                  disabled={feedback === 'success'}
                  className="w-14 h-16 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-black text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 active:scale-90 transition-all shadow-sm">
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {WORDS.map((_, i) => (
              <div key={i} className={cn("w-2.5 h-2.5 rounded-full transition-all",
                i === idx % WORDS.length ? "bg-blue-500 w-6" :
                i < idx % WORDS.length ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>

          <div className="bg-slate-900 text-white rounded-[32px] p-6 flex items-start gap-4">
            <Star className="w-6 h-6 flex-shrink-0 mt-1 text-yellow-400" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">वर्गासाठी टीप</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                विद्यार्थ्याला चित्र पाहून शब्द सांगायला सांगा, मग एक एक अक्षर शोधून शब्द बनवायला मदत करा.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
