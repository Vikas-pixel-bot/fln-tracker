"use client";
import { useState } from 'react';
import WeightMatcher from '@/components/games/WeightMatcher';
import FishGame from '@/components/games/FishGame';
import SentenceBuilder from '@/components/games/SentenceBuilder';
import LetterPicker from '@/components/games/LetterPicker';
import CountingStones from '@/components/games/CountingStones';
import NumberRiver from '@/components/games/NumberRiver';

const GAMES = [
  {
    id: 'counting',
    title: 'Count the Stones',
    emoji: '🪨',
    level: 'Numeracy: Beginner',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'Count and match objects'
  },
  {
    id: 'letters',
    title: 'Letter Explorer',
    emoji: '🔤',
    level: 'Literacy: Letter Level',
    color: 'from-green-400 to-teal-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    description: 'Find the right letter'
  },
  {
    id: 'fish',
    title: 'Fish Word Catch',
    emoji: '🐟',
    level: 'Literacy: Word Level',
    color: 'from-blue-400 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: 'Catch the correct word'
  },
  {
    id: 'weights',
    title: 'Balance the Scale',
    emoji: '⚖️',
    level: 'Numeracy: Numbers 10–99',
    color: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    description: 'Match numbers on a balance'
  },
  {
    id: 'sentence',
    title: 'Sentence Builder',
    emoji: '📝',
    level: 'Literacy: Paragraph Level',
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    description: 'Build sentences from words'
  },
  {
    id: 'river',
    title: 'Number River',
    emoji: '🌊',
    level: 'Numeracy: Operations',
    color: 'from-indigo-400 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    description: 'Cross the river with math'
  },
];

export default function PlayPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const game = GAMES.find(g => g.id === activeGame);

  if (activeGame === 'counting') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><CountingStones /></div>;
  if (activeGame === 'letters') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><LetterPicker /></div>;
  if (activeGame === 'fish') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><FishGame /></div>;
  if (activeGame === 'weights') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><WeightMatcher /></div>;
  if (activeGame === 'sentence') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><SentenceBuilder /></div>;
  if (activeGame === 'river') return <div className="max-w-2xl mx-auto"><BackBtn onBack={() => setActiveGame(null)} title={game!.title} emoji={game!.emoji} /><NumberRiver /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      <div className="text-center space-y-2 pt-4">
        <div className="text-5xl">🎮</div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Learning Games</h1>
        <p className="text-slate-500 text-lg">Fun activities to practise reading and maths!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`group ${g.bg} ${g.border} border-2 rounded-3xl p-6 text-left space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-95`}
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-3xl shadow-lg`}>
              {g.emoji}
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-lg leading-tight">{g.title}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{g.level}</p>
              <p className="text-sm text-slate-500 mt-1">{g.description}</p>
            </div>
            <div className={`text-xs font-bold bg-gradient-to-r ${g.color} bg-clip-text text-transparent group-hover:underline`}>
              Play now →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onBack, title, emoji }: { onBack: () => void; title: string; emoji: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pt-2">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all">
        ← Back
      </button>
      <span className="text-2xl">{emoji}</span>
      <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{title}</h2>
    </div>
  );
}
