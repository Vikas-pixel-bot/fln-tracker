"use client";
import { useState } from 'react';

const EMOJIS = ['🪨', '🍎', '⭐', '🐸', '🌸', '🎈', '🍌', '🐟'];
const MAX = 9;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeRound() {
  const count = Math.floor(Math.random() * MAX) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const wrong1 = count === 1 ? 2 : count - 1;
  const wrong2 = count === MAX ? MAX - 1 : count + 1;
  const options = shuffle([count, wrong1, wrong2]);
  return { count, emoji, options };
}

export default function CountingStones() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);

  function pick(n: number) {
    if (feedback) return;
    setChosen(n);
    const correct = n === round.count;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => {
      setRound(makeRound());
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-amber-100 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
        <span className="text-2xl">🪨</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-slate-500 font-semibold">किती {round.emoji} दिसतात?</p>
        <div className="flex flex-wrap justify-center gap-2 py-4 min-h-[80px] items-center">
          {Array.from({ length: round.count }).map((_, i) => (
            <span key={i} className="text-4xl select-none">{round.emoji}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {round.options.map(n => {
          let cls = 'border-2 border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100';
          if (chosen === n) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105'
              : 'border-2 border-red-400 bg-red-100 text-red-700 scale-95';
          } else if (feedback === 'wrong' && n === round.count) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700';
          }
          return (
            <button key={n} onClick={() => pick(n)}
              className={`rounded-2xl py-5 text-3xl font-extrabold transition-all duration-200 ${cls}`}>
              {n}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-2xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '🎉 शाब्बास!' : '❌ पुन्हा करा!'}
        </div>
      )}
    </div>
  );
}
