"use client";
import { useState } from 'react';

const ROUNDS = [
  { items: ['🐶', '🐱', '🐟', '🐰'], odd: '🐟', reason: 'Fish lives in water, others are land animals' },
  { items: ['🍎', '🍌', '🥕', '🍇'], odd: '🥕', reason: 'Carrot is a vegetable, others are fruits' },
  { items: ['🚗', '🚌', '✈️', '🚲'], odd: '✈️', reason: 'Aeroplane flies, others are on the road' },
  { items: ['📚', '✏️', '🖊️', '⚽'], odd: '⚽', reason: 'Ball is for play, others are for studying' },
  { items: ['🌹', '🌸', '🌻', '🍀'], odd: '🍀', reason: 'Clover is a leaf, others are flowers' },
  { items: ['🍕', '🍔', '🍜', '🍦'], odd: '🍦', reason: 'Ice cream is a dessert, others are main meals' },
  { items: ['🦁', '🐯', '🦊', '🐄'], odd: '🐄', reason: 'Cow is a farm animal, others are wild' },
  { items: ['☀️', '🌙', '⭐', '🌈'], odd: '🌈', reason: 'Rainbow appears after rain, others are always in sky' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function OddOneOut() {
  const [rounds] = useState(() => shuffle(ROUNDS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const round = rounds[idx % rounds.length];
  const [shuffledItems] = useState(() => shuffle(round.items));

  function pick(item: string) {
    if (feedback) return;
    setChosen(item);
    const correct = item === round.odd;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1400);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-yellow-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Score: {score}/{idx}</span>
        <span className="text-2xl">🔍</span>
      </div>

      <p className="text-center font-bold text-slate-700 text-lg">Which one does NOT belong?</p>

      <div className="grid grid-cols-2 gap-4">
        {round.items.map(item => {
          let cls = 'border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
          if (chosen === item) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 scale-105'
              : 'border-2 border-red-400 bg-red-100';
          } else if (feedback === 'wrong' && item === round.odd) {
            cls = 'border-2 border-green-400 bg-green-100';
          }
          return (
            <button key={item} onClick={() => pick(item)}
              className={`rounded-3xl py-8 text-6xl transition-all duration-200 active:scale-95 ${cls}`}>
              {item}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center space-y-1 ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
          <p className="text-xl font-extrabold animate-bounce">
            {feedback === 'correct' ? '🎉 Correct!' : `❌ It was ${round.odd}`}
          </p>
          <p className="text-sm text-slate-500">{round.reason}</p>
        </div>
      )}
    </div>
  );
}
