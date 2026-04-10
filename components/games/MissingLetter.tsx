"use client";
import { useState } from 'react';

// Marathi CVC words with one letter missing
const ROUNDS = [
  { template: '_प', answer: 'क', options: ['क', 'ग', 'त', 'प'], image: '☕', hint: 'पाणी पितात त्यात' },
  { template: 'घ_', answer: 'र', options: ['र', 'न', 'ल', 'म'], image: '🏠', hint: 'आपण राहतो ते ठिकाण' },
  { template: '_न', answer: 'व', options: ['व', 'म', 'ज', 'न'], image: '🌲', hint: 'झाडे भरपूर असतात' },
  { template: 'ज_', answer: 'ग', options: ['ग', 'र', 'न', 'ल'], image: '🌍', hint: 'आपण सगळे राहतो त्यावर' },
  { template: '_ल', answer: 'द', options: ['द', 'त', 'न', 'म'], image: '🫘', hint: 'डाळीचे दुसरे नाव' },
  { template: 'न_', answer: 'भ', options: ['भ', 'म', 'ल', 'व'], image: '🌤️', hint: 'आकाशाचे दुसरे नाव' },
  { template: 'म_', answer: 'न', options: ['न', 'र', 'ल', 'व'], image: '💭', hint: 'विचार येतात तिथे' },
  { template: 'क_ल', answer: 'म', options: ['म', 'न', 'ल', 'व'], image: '🪷', hint: 'पाण्यात उगवणारे फूल' },
  { template: '_र', answer: 'घ', options: ['घ', 'क', 'त', 'म'], image: '🏠', hint: 'आपण राहतो ते ठिकाण' },
  { template: 'क_', answer: 'प', options: ['प', 'म', 'न', 'ल'], image: '☕', hint: 'पाणी पितात त्यात' },
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
        <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">गुण: {score}/{idx}</span>
        <span className="text-2xl">🔡</span>
      </div>

      <div className="text-center space-y-3">
        <div className="text-6xl">{round.image}</div>
        <p className="text-slate-400 text-sm italic">{round.hint}</p>
        <div className="text-5xl font-extrabold text-slate-800 tracking-widest">
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
          {feedback === 'correct'
            ? `⭐ शाब्बास! "${round.template.replace('_', round.answer)}"`
            : `❌ उत्तर: "${round.answer}"`}
        </div>
      )}
    </div>
  );
}
