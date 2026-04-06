"use client";
import { useState } from 'react';

function makeRound() {
  const num = Math.floor(Math.random() * 90) + 10;
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return { num, tens, ones };
}

export default function PlaceValue() {
  const [round, setRound] = useState(makeRound);
  const [selectedTens, setSelectedTens] = useState<number | null>(null);
  const [selectedOnes, setSelectedOnes] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const tensOptions = Array.from({ length: 9 }, (_, i) => (i + 1) * 10).sort(() => Math.random() - 0.5).slice(0, 4);
  if (!tensOptions.includes(round.tens * 10)) { tensOptions[0] = round.tens * 10; }

  const onesOptions = Array.from({ length: 10 }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 4);
  if (!onesOptions.includes(round.ones)) { onesOptions[0] = round.ones; }

  function check() {
    if (selectedTens === null || selectedOnes === null || feedback) return;
    const correct = selectedTens === round.tens * 10 && selectedOnes === round.ones;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(makeRound());
      setSelectedTens(null);
      setSelectedOnes(null);
      setFeedback(null);
    }, 1400);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-lime-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-lime-600 bg-lime-50 px-3 py-1 rounded-full">Score: {score}/{total}</span>
        <span className="text-2xl">🏗️</span>
      </div>

      <div className="text-center space-y-1">
        <p className="text-slate-500 font-semibold">Build this number using tens and ones!</p>
        <div className="text-7xl font-extrabold text-lime-700">{round.num}</div>
      </div>

      {/* Visual blocks */}
      <div className="flex justify-center gap-6 py-2">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: round.tens }).map((_, i) => (
              <div key={i} className="w-4 h-16 bg-lime-400 rounded-sm" />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold">Tens ({round.tens * 10})</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-wrap gap-0.5 w-20 justify-center">
            {Array.from({ length: round.ones }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-orange-400 rounded-sm" />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold">Ones ({round.ones})</span>
        </div>
      </div>

      {/* Tens picker */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pick the TENS</p>
        <div className="grid grid-cols-4 gap-2">
          {tensOptions.sort((a, b) => a - b).map(n => (
            <button key={n} onClick={() => !feedback && setSelectedTens(n)}
              className={`rounded-xl py-3 font-bold transition-all text-sm ${
                selectedTens === n
                  ? 'bg-lime-500 text-white ring-2 ring-lime-300'
                  : 'bg-lime-50 border border-lime-200 text-lime-700 hover:bg-lime-100'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Ones picker */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pick the ONES</p>
        <div className="grid grid-cols-4 gap-2">
          {onesOptions.sort((a, b) => a - b).map(n => (
            <button key={n} onClick={() => !feedback && setSelectedOnes(n)}
              className={`rounded-xl py-3 font-bold transition-all text-sm ${
                selectedOnes === n
                  ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                  : 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100'
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <button onClick={check} disabled={selectedTens === null || selectedOnes === null || !!feedback}
        className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-lime-500 to-green-500 disabled:opacity-40 hover:opacity-90 transition-all">
        Build it! 🏗️
      </button>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct'
            ? `🎉 ${round.tens * 10} + ${round.ones} = ${round.num}!`
            : `❌ It was ${round.tens * 10} tens + ${round.ones} ones`}
        </div>
      )}
    </div>
  );
}
