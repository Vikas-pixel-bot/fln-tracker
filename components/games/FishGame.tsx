"use client";
import { useState, useEffect, useRef } from 'react';

const ROUNDS = [
  { image: '🌳', word: 'Tree', distractors: ['Bird', 'Fish', 'Leaf'] },
  { image: '🐶', word: 'Dog', distractors: ['Cat', 'Cow', 'Fox'] },
  { image: '🏠', word: 'House', distractors: ['Room', 'Door', 'Wall'] },
  { image: '🌙', word: 'Moon', distractors: ['Star', 'Sun', 'Sky'] },
  { image: '🍎', word: 'Apple', distractors: ['Mango', 'Grape', 'Lemon'] },
  { image: '🐟', word: 'Fish', distractors: ['Frog', 'Crab', 'Duck'] },
  { image: '✏️', word: 'Pencil', distractors: ['Eraser', 'Ruler', 'Chalk'] },
  { image: '🎒', word: 'Bag', distractors: ['Book', 'Box', 'Pen'] },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Fish = { id: number; word: string; x: number; speed: number; caught: boolean; correct: boolean };

export default function FishGame() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [shuffledRounds] = useState(() => shuffle(ROUNDS));

  const round = shuffledRounds[roundIdx % shuffledRounds.length];
  const options = shuffle([round.word, ...round.distractors.slice(0, 3)]);

  function catch_(word: string) {
    if (feedback) return;
    setChosen(word);
    const correct = word === round.word;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRoundIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-blue-100 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Score: {score}/{roundIdx}</span>
        <span className="text-2xl">🐟</span>
      </div>

      {/* River scene */}
      <div className="relative bg-gradient-to-b from-sky-300 to-blue-500 h-48 flex items-center justify-center overflow-hidden">
        {/* Water ripples */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white" style={{
              width: `${60 + i * 40}px`, height: `${20 + i * 10}px`,
              top: `${20 + i * 15}%`, left: `${10 + i * 18}%`, opacity: 0.5 - i * 0.08
            }} />
          ))}
        </div>

        {/* Emoji to identify */}
        <div className="relative z-10 text-center">
          <div className="text-8xl select-none drop-shadow-lg">{round.image}</div>
          <p className="text-white font-bold text-sm mt-2 drop-shadow">What is this? Catch the right word!</p>
        </div>

        {/* Swimming fish labels */}
        {options.map((word, i) => (
          <div key={word} className="absolute bottom-3 text-xs font-bold bg-white/90 rounded-full px-2 py-0.5 text-blue-700 animate-pulse"
            style={{ left: `${10 + i * 22}%` }}>
            🐟 {word}
          </div>
        ))}
      </div>

      <div className="p-6 space-y-4">
        <p className="text-center font-semibold text-slate-600">Tap the correct word to catch it!</p>
        <div className="grid grid-cols-2 gap-3">
          {options.map(word => {
            let cls = 'border-2 border-blue-200 text-blue-800 bg-blue-50 hover:bg-blue-100';
            if (chosen === word) {
              cls = feedback === 'correct'
                ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105'
                : 'border-2 border-red-400 bg-red-100 text-red-700';
            } else if (feedback === 'wrong' && word === round.word) {
              cls = 'border-2 border-green-400 bg-green-100 text-green-700';
            }
            return (
              <button key={word} onClick={() => catch_(word)}
                className={`rounded-2xl py-4 text-lg font-bold transition-all duration-200 ${cls}`}>
                🎣 {word}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`text-center text-2xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '🎣 Caught it!' : '❌ Missed! It was ' + round.word}
          </div>
        )}
      </div>
    </div>
  );
}
