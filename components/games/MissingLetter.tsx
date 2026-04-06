"use client";
import { useState } from 'react';

const ROUNDS = [
  { template: '_at', answer: 'C', options: ['C', 'B', 'X', 'Z'], image: '🐱', hint: 'It says meow' },
  { template: '_og', answer: 'D', options: ['D', 'L', 'M', 'R'], image: '🐶', hint: 'Man\'s best friend' },
  { template: 'su_', answer: 'N', options: ['N', 'M', 'G', 'P'], image: '☀️', hint: 'Shines in the sky' },
  { template: 'tre_', answer: 'E', options: ['E', 'A', 'S', 'T'], image: '🌳', hint: 'Has leaves and branches' },
  { template: '_ish', answer: 'F', options: ['F', 'D', 'W', 'H'], image: '🐟', hint: 'Lives in water' },
  { template: 'bir_', answer: 'D', options: ['D', 'T', 'G', 'S'], image: '🐦', hint: 'It can fly' },
  { template: 'bo_k', answer: 'O', options: ['O', 'A', 'E', 'I'], image: '📚', hint: 'You read this' },
  { template: '_oon', answer: 'M', options: ['M', 'S', 'B', 'N'], image: '🌙', hint: 'Shines at night' },
  { template: 'r_in', answer: 'A', options: ['A', 'E', 'U', 'O'], image: '🌧️', hint: 'Comes from clouds' },
  { template: 'han_', answer: 'D', options: ['D', 'G', 'K', 'S'], image: '✋', hint: 'At the end of your arm' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MissingLetter() {
  const [rounds] = useState(() => shuffle(ROUNDS));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const round = rounds[idx % rounds.length];
  const completed = round.template.replace('_', chosen ?? '_');

  function pick(letter: string) {
    if (feedback) return;
    setChosen(letter);
    const correct = letter === round.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1200);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-teal-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Score: {score}/{idx}</span>
        <span className="text-2xl">🔡</span>
      </div>

      <div className="text-center space-y-3">
        <div className="text-6xl">{round.image}</div>
        <p className="text-slate-400 text-sm italic">{round.hint}</p>
        <div className="text-5xl font-extrabold text-slate-800 tracking-widest uppercase">
          {completed.split('').map((ch, i) => (
            <span key={i} className={ch === '_' ? 'text-teal-400 underline' : ''}>
              {ch === '_' ? '?' : ch}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {round.options.map(letter => {
          let cls = 'border-2 border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 text-2xl font-extrabold';
          if (chosen === letter) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-110 text-2xl font-extrabold'
              : 'border-2 border-red-400 bg-red-100 text-red-700 text-2xl font-extrabold';
          } else if (feedback === 'wrong' && letter === round.answer) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700 text-2xl font-extrabold';
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
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? `⭐ Yes! "${round.template.replace('_', round.answer)}"` : `❌ It was "${round.answer}"`}
        </div>
      )}
    </div>
  );
}
