"use client";
import { useState } from 'react';

function makeRound() {
  const start = Math.floor(Math.random() * 15) + 1;
  const gapPos = Math.floor(Math.random() * 3) + 1; // gap at position 1,2,3 (not ends)
  const sequence = [start, start + 1, start + 2, start + 3, start + 4];
  const answer = sequence[gapPos];
  const wrong1 = answer + 2;
  const wrong2 = answer - 1 > 0 ? answer - 1 : answer + 3;
  const options = [answer, wrong1, wrong2].sort(() => Math.random() - 0.5);
  return { sequence, gapPos, answer, options };
}

export default function NumberTrain() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function pick(n: number) {
    if (feedback) return;
    setChosen(n);
    const correct = n === round.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(makeRound());
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  const WAGONS = ['🚂', '🚃', '🚃', '🚃', '🚃'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-red-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">Score: {score}/{total}</span>
        <span className="text-2xl">🚂</span>
      </div>

      <p className="text-center font-bold text-slate-700">What number is missing from the train?</p>

      {/* Train */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto py-2">
        {round.sequence.map((num, i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl border-2 transition-all ${
              i === round.gapPos
                ? 'border-dashed border-red-400 bg-red-50 text-red-400'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              {i === round.gapPos ? '?' : num}
            </div>
            <span className="text-xl mt-1">{WAGONS[i]}</span>
          </div>
        ))}
      </div>

      {/* Track */}
      <div className="h-1.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full mx-4" />

      <div className="grid grid-cols-3 gap-3">
        {round.options.map(n => {
          let cls = 'border-2 border-red-200 bg-red-50 text-red-800 hover:bg-red-100 text-2xl font-extrabold';
          if (chosen === n) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105 text-2xl font-extrabold'
              : 'border-2 border-red-500 bg-red-100 text-red-700 text-2xl font-extrabold';
          } else if (feedback === 'wrong' && n === round.answer) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700 text-2xl font-extrabold';
          }
          return (
            <button key={n} onClick={() => pick(n)}
              className={`rounded-2xl py-5 transition-all duration-200 ${cls}`}>
              {n}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '🚂 Choo choo! Correct!' : `❌ It was ${round.answer}`}
        </div>
      )}
    </div>
  );
}
