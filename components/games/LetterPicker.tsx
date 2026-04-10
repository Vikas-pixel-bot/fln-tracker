"use client";
import { useState } from 'react';

const ROUNDS = [
  { prompt: 'हे अक्षर शोधा:  क', target: 'क', options: ['क', 'ख', 'ग', 'घ', 'च', 'छ'] },
  { prompt: 'हे अक्षर शोधा:  म', target: 'म', options: ['म', 'न', 'र', 'ल', 'स', 'व'] },
  { prompt: 'हे अक्षर शोधा:  प', target: 'प', options: ['फ', 'ब', 'भ', 'प', 'म', 'त'] },
  { prompt: 'हे अक्षर शोधा:  स', target: 'स', options: ['स', 'श', 'ष', 'ह', 'न', 'त'] },
  { prompt: 'हे अक्षर शोधा:  ट', target: 'ट', options: ['ट', 'ठ', 'ड', 'ढ', 'त', 'थ'] },
  { prompt: 'हे अक्षर शोधा:  र', target: 'र', options: ['र', 'ल', 'ळ', 'व', 'य', 'न'] },
  { prompt: 'हे अक्षर शोधा:  घ', target: 'घ', options: ['घ', 'ग', 'ख', 'क', 'च', 'ज'] },
  { prompt: 'हे अक्षर शोधा:  ज', target: 'ज', options: ['ज', 'झ', 'य', 'ड', 'द', 'ब'] },
  { prompt: 'हे अक्षर शोधा:  भ', target: 'भ', options: ['भ', 'ब', 'प', 'फ', 'म', 'व'] },
  { prompt: 'हे अक्षर शोधा:  ध', target: 'ध', options: ['ध', 'द', 'त', 'थ', 'न', 'ट'] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function LetterPicker() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [shuffled] = useState(() => shuffle(ROUNDS));

  const round = shuffled[idx % shuffled.length];

  function pick(letter: string) {
    if (feedback) return;
    setChosen(letter);
    const correct = letter === round.target;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1100);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-green-100 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">गुण: {score}/{idx}</span>
        <span className="text-2xl">🔤</span>
      </div>

      <div className="text-center py-4">
        <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{round.prompt}</p>
        <div className="mt-4 w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-6xl font-extrabold text-white shadow-lg select-none">
          {round.target}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {round.options.map(letter => {
          let cls = 'border-2 border-green-200 text-green-800 bg-green-50 hover:bg-green-100 text-2xl font-bold';
          if (chosen === letter) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-500 bg-green-200 text-green-800 scale-110 text-2xl font-bold'
              : 'border-2 border-red-400 bg-red-100 text-red-700 text-2xl font-bold';
          } else if (feedback === 'wrong' && letter === round.target) {
            cls = 'border-2 border-green-500 bg-green-200 text-green-800 text-2xl font-bold';
          }
          return (
            <button key={letter} onClick={() => pick(letter)}
              className={`rounded-2xl py-5 transition-all duration-200 ${cls}`}>
              {letter}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-2xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '⭐ शाब्बास!' : '❌ हे होते → ' + round.target}
        </div>
      )}
    </div>
  );
}
