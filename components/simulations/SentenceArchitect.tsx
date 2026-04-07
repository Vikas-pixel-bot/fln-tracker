'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Send, Brain } from 'lucide-react';

const PROBLEMS = [
  { emoji: "🍎 + 😋", options: ["मी सफरचंद खातो", "मला आंबा आवडतो", "ते घर आहे"], answer: 0 },
  { emoji: "🏫 + 🚶", options: ["मी शाळेत जातो", "मी खेळायला जातो", "बाबा घरी आले"], answer: 0 },
  { emoji: "📖 + 👀", options: ["मी पुस्तक वाचतो", "मी चित्र काढतो", "मी गाणे गातो"], answer: 0 },
  { emoji: "🐱 + 🥛", options: ["मांजर दूध पिते", "कुत्रा धावतो", "चिमणी उडते"], answer: 0 },
  { emoji: "🌦️ + 🌈", options: ["आकाशात इंद्रधनुष्य आहे", "पाऊस पडत आहे", "खूप वारा सुटला आहे"], answer: 0 },
];

export default function SentenceArchitect({ onScore, isBattle, player }: { onScore: (s: number) => void; isBattle?: boolean; player?: 1 | 2 }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleSelect = (idx: number) => {
    if (feedback) return;
    if (idx === PROBLEMS[index].answer) {
      setFeedback('correct');
      onScore(10);
      setTimeout(() => {
        setFeedback(null);
        setIndex((index + 1) % PROBLEMS.length);
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const prob = PROBLEMS[index];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 h-full bg-indigo-50/30 dark:bg-slate-900/50 rounded-[48px]">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[40px] shadow-2xl border-4 border-indigo-100 dark:border-indigo-900 flex flex-col items-center gap-4 min-w-[300px]">
         <div className="text-6xl animate-bounce mb-4">{prob.emoji}</div>
         <p className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-4 h-4" /> Translate to Marathi
         </p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        {prob.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`p-6 rounded-3xl font-black text-lg transition-all text-left flex items-center justify-between group shadow-lg ${
              feedback === 'correct' && i === prob.answer ? 'bg-emerald-500 text-white scale-105' :
              feedback === 'wrong' && i !== prob.answer ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' :
              'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white hover:scale-[1.02]'
            }`}
          >
            {opt}
            <Send className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
         <Sparkles className="w-3 h-3 text-yellow-500" /> Powered by FLN AI Engine
      </div>
    </div>
  );
}
