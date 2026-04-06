"use client";
import { useState } from 'react';

const ROUNDS = [
  { word: 'Cat', image: '🐱', rhyme: 'Hat', options: ['Hat', 'Dog', 'Tree', 'Book'] },
  { word: 'Sun', image: '☀️', rhyme: 'Run', options: ['Run', 'Moon', 'Bird', 'Fish'] },
  { word: 'Bat', image: '🦇', rhyme: 'Mat', options: ['Mat', 'Cup', 'Ball', 'Frog'] },
  { word: 'Bee', image: '🐝', rhyme: 'Tree', options: ['Tree', 'Dog', 'Hat', 'Cake'] },
  { word: 'Frog', image: '🐸', rhyme: 'Log', options: ['Log', 'Fish', 'Sun', 'Bird'] },
  { word: 'Star', image: '⭐', rhyme: 'Car', options: ['Car', 'Moon', 'Sun', 'Rain'] },
  { word: 'Hen', image: '🐔', rhyme: 'Ten', options: ['Ten', 'Cat', 'Dog', 'Fish'] },
  { word: 'Cake', image: '🎂', rhyme: 'Lake', options: ['Lake', 'Book', 'Tree', 'Bird'] },
  { word: 'Ring', image: '💍', rhyme: 'Sing', options: ['Sing', 'Fish', 'Moon', 'Hat'] },
  { word: 'Boat', image: '⛵', rhyme: 'Goat', options: ['Goat', 'Fish', 'Bird', 'Sun'] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RhymeTime() {
  const [rounds] = useState(() => shuffle(ROUNDS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const round = rounds[idx % rounds.length];
  const [shuffledOptions] = useState(() => shuffle(round.options));

  function pick(word: string) {
    if (feedback) return;
    setChosen(word);
    const correct = word === round.rhyme;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-orange-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Score: {score}/{idx}</span>
        <span className="text-2xl">🎵</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-slate-500 font-semibold">Which word rhymes with...</p>
        <div className="inline-flex flex-col items-center gap-1 bg-orange-50 border-2 border-orange-200 rounded-3xl px-10 py-5">
          <span className="text-6xl">{round.image}</span>
          <span className="text-3xl font-extrabold text-orange-700">{round.word}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map(word => {
          let cls = 'border-2 border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 text-lg font-bold';
          if (chosen === word) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105 text-lg font-bold'
              : 'border-2 border-red-400 bg-red-100 text-red-700 text-lg font-bold';
          } else if (feedback === 'wrong' && word === round.rhyme) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700 text-lg font-bold';
          }
          return (
            <button key={word} onClick={() => pick(word)}
              className={`rounded-2xl py-5 transition-all duration-200 active:scale-95 ${cls}`}>
              {word}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? `🎵 Yes! ${round.word} & ${round.rhyme} rhyme!` : `❌ It was "${round.rhyme}"`}
        </div>
      )}
    </div>
  );
}
