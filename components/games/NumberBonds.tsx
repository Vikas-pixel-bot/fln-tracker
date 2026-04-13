"use client";
import { useState } from 'react';

function makeRound() {
  const total = Math.floor(Math.random() * 14) + 4;
  const known = Math.floor(Math.random() * (total - 1)) + 1;
  const missing = total - known;
  const wrong1 = missing + 1;
  const wrong2 = missing - 1 > 0 ? missing - 1 : missing + 2;
  const options = [missing, wrong1, wrong2].sort(() => Math.random() - 0.5);
  return { total, known, missing, options };
}

export default function NumberBonds() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function pick(n: number) {
    if (feedback) return;
    setChosen(n);
    const correct = n === round.missing;
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-sky-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
        <span className="text-2xl">🔗</span>
      </div>

      <p className="text-center font-bold text-slate-700 text-lg">गायब संख्या शोधा!</p>

      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full bg-sky-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg">
          {round.total}
        </div>

        <div className="flex items-start gap-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-8">
            <div className="w-0.5 h-10 bg-slate-300 -rotate-12 origin-top" />
            <div className="w-0.5 h-10 bg-slate-300 rotate-12 origin-top" />
          </div>
        </div>

        <div className="flex gap-10 mt-6">
          <div className="w-20 h-20 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl font-extrabold text-sky-700">
            {round.known}
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-dashed border-sky-400 bg-sky-50 flex items-center justify-center text-3xl font-extrabold text-sky-300">
            ?
          </div>
        </div>

        <p className="text-slate-500 text-sm mt-2">{round.known} + ? = {round.total}</p>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {Array.from({ length: round.total }).map((_, i) => (
          <div key={i} className={`w-6 h-6 rounded-full ${i < round.known ? 'bg-sky-400' : 'bg-sky-200 border-2 border-dashed border-sky-400'}`} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {round.options.map(n => {
          let cls = 'border-2 border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 text-2xl font-extrabold';
          if (chosen === n) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105 text-2xl font-extrabold'
              : 'border-2 border-red-400 bg-red-100 text-red-700 text-2xl font-extrabold';
          } else if (feedback === 'wrong' && n === round.missing) {
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
          {feedback === 'correct' ? `🔗 शाब्बास! ${round.known} + ${round.missing} = ${round.total}` : `❌ उत्तर: ${round.missing}`}
        </div>
      )}
    </div>
  );
}
