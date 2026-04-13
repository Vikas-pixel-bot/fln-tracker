"use client";
import { useState } from 'react';

function makeRound() {
  const target = Math.floor(Math.random() * 90) + 10;
  const options = [target];
  while (options.length < 4) {
    const v = target + (Math.floor(Math.random() * 20) - 10);
    if (v > 0 && v !== target && !options.includes(v)) options.push(v);
  }
  return { target, options: options.sort(() => Math.random() - 0.5) };
}

export default function WeightMatcher() {
  const [round, setRound] = useState(makeRound);
  const [placed, setPlaced] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const tilt = placed === null ? 0 : placed === round.target ? 0 : placed > round.target ? 15 : -15;

  function place(n: number) {
    if (feedback) return;
    setPlaced(n);
    const correct = n === round.target;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => {
      setRound(makeRound());
      setPlaced(null);
      setFeedback(null);
    }, 1500);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
        <span className="text-2xl">⚖️</span>
      </div>

      <p className="text-center font-semibold text-slate-600">तराजू समतोल करा! <span className="text-purple-700 font-extrabold text-lg">{round.target}</span> शोधा</p>

      <div className="flex justify-center py-4">
        <div className="relative w-72 h-48">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-28 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-lg" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-600 rounded-full" />

          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-full origin-center transition-transform duration-700"
            style={{ transform: `translateX(-50%) rotate(${tilt}deg)` }}>
            <div className="absolute left-2 top-3 w-0.5 h-10 bg-slate-400" />
            <div className="absolute right-2 top-3 w-0.5 h-10 bg-slate-400" />
          </div>

          <div className="absolute left-4 top-[72px] w-20 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full flex items-center justify-center" style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center top', transition: 'transform 0.7s' }}>
            <span className="text-xs font-bold text-slate-700">{round.target}</span>
          </div>

          <div className="absolute right-4 top-[72px] w-20 h-6 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full flex items-center justify-center" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: 'center top', transition: 'transform 0.7s' }}>
            {placed !== null && <span className="text-xs font-bold text-purple-800">{placed}</span>}
          </div>

          <div className="absolute left-2 top-[105px] text-xs text-slate-400 font-semibold w-20 text-center">लक्ष्य</div>
          <div className="absolute right-2 top-[105px] text-xs text-purple-400 font-semibold w-20 text-center">तुमची निवड</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {round.options.map(n => {
          let cls = 'border-2 border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100';
          if (placed === n) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700'
              : 'border-2 border-red-400 bg-red-100 text-red-700';
          } else if (feedback === 'wrong' && n === round.target) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700';
          }
          return (
            <button key={n} onClick={() => place(n)}
              className={`rounded-2xl py-4 text-xl font-extrabold transition-all duration-200 ${cls}`}>
              {n}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-2xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '⚖️ समतोल!' : `❌ उत्तर: ${round.target}`}
        </div>
      )}
    </div>
  );
}
