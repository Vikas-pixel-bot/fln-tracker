"use client";
import { useState } from 'react';

const ROUNDS = [
  { image: '🐟', statement: 'मासा आकाशात उडतो.', answer: false },
  { image: '☀️', statement: 'सूर्य आपल्याला उजेड आणि ऊब देतो.', answer: true },
  { image: '🐘', statement: 'हत्ती उंदरापेक्षा लहान असतो.', answer: false },
  { image: '🌧️', statement: 'पाऊस ढगांमधून येतो.', answer: true },
  { image: '🐝', statement: 'मधमाश्या मध बनवतात.', answer: true },
  { image: '🦅', statement: 'गरुड समुद्रात खोल राहतो.', answer: false },
  { image: '🌙', statement: 'चंद्र रात्री दिसतो.', answer: true },
  { image: '🌿', statement: 'झाडांना सूर्यप्रकाश लागतो.', answer: true },
  { image: '🔥', statement: 'बर्फ खूप गरम असतो.', answer: false },
  { image: '🐸', statement: 'बेडूक पाण्यात आणि जमिनीवर राहतो.', answer: true },
  { image: '🦁', statement: 'सिंह फक्त गवत खातो.', answer: false },
  { image: '📚', statement: 'आपण पुस्तके वाचून नवीन गोष्टी शिकतो.', answer: true },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TrueFalse() {
  const [rounds] = useState(() => shuffle(ROUNDS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const round = rounds[idx % rounds.length];

  function pick(val: boolean) {
    if (feedback) return;
    setChosen(val);
    const correct = val === round.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1300);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">गुण: {score}/{idx}</span>
        <span className="text-2xl">✅</span>
      </div>

      <div className="text-center space-y-4 py-4">
        <div className="text-8xl">{round.image}</div>
        <p className="text-xl font-bold text-slate-700 dark:text-slate-200 leading-snug max-w-xs mx-auto">
          "{round.statement}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => pick(true)}
          className={`rounded-2xl py-6 text-2xl font-extrabold transition-all duration-200 active:scale-95 ${
            chosen === true
              ? feedback === 'correct'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-red-400 text-white'
              : chosen === false && feedback === 'wrong' && round.answer === true
              ? 'bg-green-500 text-white'
              : 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
          }`}>
          ✅ बरोबर
        </button>
        <button onClick={() => pick(false)}
          className={`rounded-2xl py-6 text-2xl font-extrabold transition-all duration-200 active:scale-95 ${
            chosen === false
              ? feedback === 'correct'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-red-400 text-white'
              : chosen === true && feedback === 'wrong' && round.answer === false
              ? 'bg-green-500 text-white'
              : 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200'
          }`}>
          ❌ चूक
        </button>
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '🎉 बरोबर!' : `❌ उत्तर: ${round.answer ? 'बरोबर' : 'चूक'}`}
        </div>
      )}
    </div>
  );
}
