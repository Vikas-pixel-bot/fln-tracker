"use client";
import { useState } from 'react';

const ROUNDS = [
  { image: '🐟', statement: 'Fish can fly in the sky.', answer: false },
  { image: '☀️', statement: 'The sun gives us light and heat.', answer: true },
  { image: '🐘', statement: 'An elephant is smaller than a mouse.', answer: false },
  { image: '🌧️', statement: 'Rain comes from clouds.', answer: true },
  { image: '🐝', statement: 'Bees make honey.', answer: true },
  { image: '🦅', statement: 'Eagles live deep under the ocean.', answer: false },
  { image: '🌙', statement: 'We can see the moon at night.', answer: true },
  { image: '🌿', statement: 'Plants need sunlight to grow.', answer: true },
  { image: '🔥', statement: 'Ice is very hot.', answer: false },
  { image: '🐸', statement: 'Frogs can live in water and on land.', answer: true },
  { image: '🦁', statement: 'Lions eat only grass.', answer: false },
  { image: '📚', statement: 'We read books to learn new things.', answer: true },
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
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Score: {score}/{idx}</span>
        <span className="text-2xl">✅</span>
      </div>

      <div className="text-center space-y-4 py-4">
        <div className="text-8xl">{round.image}</div>
        <p className="text-xl font-bold text-slate-700 dark:text-slate-200 leading-snug max-w-xs mx-auto">
          "{round.statement}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* True */}
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
          ✅ TRUE
        </button>
        {/* False */}
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
          ❌ FALSE
        </button>
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? '🎉 Correct!' : `❌ It is ${round.answer ? 'TRUE' : 'FALSE'}`}
        </div>
      )}
    </div>
  );
}
