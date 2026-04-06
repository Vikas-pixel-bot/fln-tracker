"use client";
import { useState } from 'react';

const ROUNDS = [
  {
    sentence: ['The', 'cat', 'sat', 'on', 'the', 'mat'],
    emoji: ['🐱', '🛋️'],
  },
  {
    sentence: ['A', 'dog', 'runs', 'in', 'the', 'park'],
    emoji: ['🐕', '🌳'],
  },
  {
    sentence: ['The', 'sun', 'is', 'very', 'bright'],
    emoji: ['☀️', '😎'],
  },
  {
    sentence: ['I', 'eat', 'rice', 'with', 'dal'],
    emoji: ['🍚', '🫕'],
  },
  {
    sentence: ['The', 'bird', 'flew', 'over', 'the', 'tree'],
    emoji: ['🐦', '🌳'],
  },
  {
    sentence: ['She', 'reads', 'a', 'big', 'book'],
    emoji: ['👧', '📚'],
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SentenceBuilder() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledRounds] = useState(() => shuffle(ROUNDS));
  const round = shuffledRounds[roundIdx % shuffledRounds.length];

  const [placed, setPlaced] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>(() => shuffle(round.sentence));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function startRound(idx: number) {
    const r = shuffledRounds[idx % shuffledRounds.length];
    setPlaced([]);
    setBank(shuffle(r.sentence));
    setFeedback(null);
  }

  function tapBank(word: string, i: number) {
    if (feedback) return;
    const newBank = [...bank];
    newBank.splice(i, 1);
    setBank(newBank);
    setPlaced(p => [...p, word]);
  }

  function tapPlaced(word: string, i: number) {
    if (feedback) return;
    const newPlaced = [...placed];
    newPlaced.splice(i, 1);
    setPlaced(newPlaced);
    setBank(b => [...b, word]);
  }

  function check() {
    const correct = placed.join(' ') === round.sentence.join(' ');
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  }

  function next() {
    const nextIdx = roundIdx + 1;
    setRoundIdx(nextIdx);
    startRound(nextIdx);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">Score: {score}/{roundIdx}</span>
        <span className="text-2xl">{round.emoji.join('')}</span>
      </div>

      <p className="text-center font-semibold text-slate-600">Arrange the words to make a sentence!</p>

      {/* Drop zone */}
      <div className="min-h-[64px] border-2 border-dashed border-pink-300 rounded-2xl p-3 flex flex-wrap gap-2 bg-pink-50/50">
        {placed.length === 0 && <span className="text-slate-300 text-sm self-center mx-auto">Tap words below to build the sentence</span>}
        {placed.map((word, i) => (
          <button key={i} onClick={() => tapPlaced(word, i)}
            className="bg-pink-500 text-white px-3 py-1.5 rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-95">
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
        {bank.map((word, i) => (
          <button key={i} onClick={() => tapBank(word, i)}
            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-semibold text-sm hover:bg-pink-100 hover:text-pink-700 transition-all border border-slate-200 active:scale-95">
            {word}
          </button>
        ))}
      </div>

      {/* Check / next */}
      {feedback === null ? (
        <button onClick={check} disabled={placed.length !== round.sentence.length}
          className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 disabled:opacity-40 hover:opacity-90 transition-all">
          Check ✓
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`text-center text-xl font-extrabold ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '🎉 Perfect sentence!' : '❌ Not quite — correct: ' + round.sentence.join(' ')}
          </div>
          <button onClick={next} className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition-all">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
