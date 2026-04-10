"use client";
import { useState } from 'react';

// Marathi rhyming words — sharing the same ending sound
const ROUNDS = [
  { word: 'मन', image: '💭', rhyme: 'वन', options: ['वन', 'काम', 'घर', 'फूल'] },
  { word: 'काम', image: '💼', rhyme: 'नाम', options: ['नाम', 'मन', 'घर', 'पान'] },
  { word: 'घर', image: '🏠', rhyme: 'नर', options: ['नर', 'फूल', 'काम', 'वन'] },
  { word: 'फूल', image: '🌸', rhyme: 'धूल', options: ['धूल', 'घर', 'नाम', 'मन'] },
  { word: 'पान', image: '🍃', rhyme: 'मान', options: ['मान', 'घर', 'मन', 'फूल'] },
  { word: 'दार', image: '🚪', rhyme: 'यार', options: ['यार', 'मन', 'काम', 'पान'] },
  { word: 'माल', image: '🏪', rhyme: 'ताल', options: ['ताल', 'घर', 'फूल', 'पान'] },
  { word: 'नाव', image: '⛵', rhyme: 'भाव', options: ['भाव', 'मन', 'काम', 'घर'] },
  { word: 'जग', image: '🌍', rhyme: 'मग', options: ['मग', 'घर', 'पान', 'फूल'] },
  { word: 'रात', image: '🌙', rhyme: 'बात', options: ['बात', 'मन', 'काम', 'नाव'] },
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
        <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">गुण: {score}/{idx}</span>
        <span className="text-2xl">🎵</span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-slate-500 font-semibold">कोणता शब्द यमक जुळतो?</p>
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
          {feedback === 'correct' ? `🎵 शाब्बास! ${round.word} आणि ${round.rhyme} यमक जुळतात!` : `❌ उत्तर: "${round.rhyme}"`}
        </div>
      )}
    </div>
  );
}
