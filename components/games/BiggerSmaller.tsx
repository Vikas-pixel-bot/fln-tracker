"use client";
import { useState } from 'react';

const EMOJIS = ['🍎', '⭐', '🐟', '🟡', '🌸'];

function makeRound() {
  const a = Math.floor(Math.random() * 8) + 1;
  let b = Math.floor(Math.random() * 8) + 1;
  while (b === a) b = Math.floor(Math.random() * 8) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  return { a, b, emoji, answer: a > b ? 'left' : 'right' as 'left' | 'right' };
}

export default function BiggerSmaller() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<'left' | 'right' | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function pick(side: 'left' | 'right') {
    if (feedback) return;
    setChosen(side);
    const correct = side === round.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(makeRound());
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-cyan-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Score: {score}/{total}</span>
        <span className="text-2xl">🔢</span>
      </div>

      <p className="text-center font-bold text-slate-700 text-lg">Which group has MORE?</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left group */}
        <button onClick={() => pick('left')}
          className={`rounded-3xl p-4 transition-all duration-200 border-2 active:scale-95 ${
            chosen === 'left'
              ? feedback === 'correct' ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100'
              : chosen === 'right' && feedback === 'wrong'
              ? 'border-green-400 bg-green-100'
              : 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100'
          }`}>
          <div className="flex flex-wrap justify-center gap-1.5 min-h-[80px] items-center content-center">
            {Array.from({ length: round.a }).map((_, i) => (
              <span key={i} className="text-3xl">{round.emoji}</span>
            ))}
          </div>
          <p className="text-center text-2xl font-extrabold text-cyan-700 mt-2">{round.a}</p>
        </button>

        {/* Right group */}
        <button onClick={() => pick('right')}
          className={`rounded-3xl p-4 transition-all duration-200 border-2 active:scale-95 ${
            chosen === 'right'
              ? feedback === 'correct' ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100'
              : chosen === 'left' && feedback === 'wrong'
              ? 'border-green-400 bg-green-100'
              : 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100'
          }`}>
          <div className="flex flex-wrap justify-center gap-1.5 min-h-[80px] items-center content-center">
            {Array.from({ length: round.b }).map((_, i) => (
              <span key={i} className="text-3xl">{round.emoji}</span>
            ))}
          </div>
          <p className="text-center text-2xl font-extrabold text-cyan-700 mt-2">{round.b}</p>
        </button>
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct'
            ? `🎉 Yes! ${round.answer === 'left' ? round.a : round.b} is more!`
            : `❌ ${round.answer === 'left' ? round.a : round.b} was more`}
        </div>
      )}
    </div>
  );
}
