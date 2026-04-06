"use client";
import { useState } from 'react';

// Original 6
import WeightMatcher from '@/components/games/WeightMatcher';
import FishGame from '@/components/games/FishGame';
import SentenceBuilder from '@/components/games/SentenceBuilder';
import LetterPicker from '@/components/games/LetterPicker';
import CountingStones from '@/components/games/CountingStones';
import NumberRiver from '@/components/games/NumberRiver';

// New 12
import OddOneOut from '@/components/games/OddOneOut';
import MissingLetter from '@/components/games/MissingLetter';
import RhymeTime from '@/components/games/RhymeTime';
import StorySequence from '@/components/games/StorySequence';
import TrueFalse from '@/components/games/TrueFalse';
import NumberTrain from '@/components/games/NumberTrain';
import BiggerSmaller from '@/components/games/BiggerSmaller';
import PlaceValue from '@/components/games/PlaceValue';
import MarketMath from '@/components/games/MarketMath';
import NumberBonds from '@/components/games/NumberBonds';
import ClockReader from '@/components/games/ClockReader';
import SortingHat from '@/components/games/SortingHat';

const GAMES = [
  // --- LITERACY ---
  {
    id: 'counting', title: 'Count the Stones', emoji: '🪨',
    level: 'Numeracy · Beginner', tag: 'Numeracy',
    color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200',
    description: 'Count and match objects',
  },
  {
    id: 'bigger', title: 'Bigger or Smaller', emoji: '🔢',
    level: 'Numeracy · Beginner', tag: 'Numeracy',
    color: 'from-cyan-400 to-sky-500', bg: 'bg-cyan-50', border: 'border-cyan-200',
    description: 'Which group has more?',
  },
  {
    id: 'letters', title: 'Letter Explorer', emoji: '🔤',
    level: 'Literacy · Letter', tag: 'Literacy',
    color: 'from-green-400 to-teal-500', bg: 'bg-green-50', border: 'border-green-200',
    description: 'Find the right letter',
  },
  {
    id: 'oddone', title: 'Odd One Out', emoji: '🔍',
    level: 'Literacy · Beginner', tag: 'Literacy',
    color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50', border: 'border-yellow-200',
    description: 'Spot what doesn\'t belong',
  },
  {
    id: 'fish', title: 'Fish Word Catch', emoji: '🐟',
    level: 'Literacy · Word', tag: 'Literacy',
    color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200',
    description: 'Catch the correct word',
  },
  {
    id: 'missing', title: 'Missing Letter', emoji: '🔡',
    level: 'Literacy · Word', tag: 'Literacy',
    color: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50', border: 'border-teal-200',
    description: 'Fill the blank to make a word',
  },
  {
    id: 'rhyme', title: 'Rhyme Time', emoji: '🎵',
    level: 'Literacy · Word', tag: 'Literacy',
    color: 'from-orange-400 to-red-400', bg: 'bg-orange-50', border: 'border-orange-200',
    description: 'Find the rhyming word',
  },
  {
    id: 'truefalse', title: 'True or False', emoji: '✅',
    level: 'Literacy · Story', tag: 'Literacy',
    color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
    description: 'Is the sentence correct?',
  },
  {
    id: 'sentence', title: 'Sentence Builder', emoji: '📝',
    level: 'Literacy · Paragraph', tag: 'Literacy',
    color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200',
    description: 'Arrange words into a sentence',
  },
  {
    id: 'story', title: 'Story Sequence', emoji: '📖',
    level: 'Literacy · Paragraph', tag: 'Literacy',
    color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50', border: 'border-violet-200',
    description: 'Put the story in order',
  },
  // --- NUMERACY ---
  {
    id: 'numbertrain', title: 'Number Train', emoji: '🚂',
    level: 'Numeracy · 1–9', tag: 'Numeracy',
    color: 'from-red-400 to-rose-500', bg: 'bg-red-50', border: 'border-red-200',
    description: 'Fill the missing number in the sequence',
  },
  {
    id: 'weights', title: 'Balance the Scale', emoji: '⚖️',
    level: 'Numeracy · 10–99', tag: 'Numeracy',
    color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-200',
    description: 'Match numbers on a balance',
  },
  {
    id: 'placevalue', title: 'Place Value Builder', emoji: '🏗️',
    level: 'Numeracy · 10–99', tag: 'Numeracy',
    color: 'from-lime-400 to-green-500', bg: 'bg-lime-50', border: 'border-lime-200',
    description: 'Build numbers with tens and ones',
  },
  {
    id: 'bonds', title: 'Number Bonds', emoji: '🔗',
    level: 'Numeracy · Addition', tag: 'Numeracy',
    color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', border: 'border-sky-200',
    description: 'Find the missing part',
  },
  {
    id: 'market', title: 'Market Math', emoji: '🛒',
    level: 'Numeracy · Operations', tag: 'Numeracy',
    color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200',
    description: 'Real-life shopping sums',
  },
  {
    id: 'river', title: 'Number River', emoji: '🌊',
    level: 'Numeracy · Operations', tag: 'Numeracy',
    color: 'from-indigo-400 to-blue-600', bg: 'bg-indigo-50', border: 'border-indigo-200',
    description: 'Hop the frog with maths',
  },
  // --- BONUS ---
  {
    id: 'clock', title: 'Clock Reader', emoji: '🕐',
    level: 'Life Skills', tag: 'Bonus',
    color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', border: 'border-rose-200',
    description: 'What time is it?',
  },
  {
    id: 'sorting', title: 'Sorting Hat', emoji: '🎩',
    level: 'Cross-level', tag: 'Bonus',
    color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50', border: 'border-purple-200',
    description: 'Sort items into categories',
  },
];

const TAG_COLORS: Record<string, string> = {
  Literacy: 'bg-green-100 text-green-700',
  Numeracy: 'bg-blue-100 text-blue-700',
  Bonus: 'bg-purple-100 text-purple-700',
};

const GAME_MAP: Record<string, React.ReactNode> = {
  counting: <CountingStones />, bigger: <BiggerSmaller />, letters: <LetterPicker />,
  oddone: <OddOneOut />, fish: <FishGame />, missing: <MissingLetter />,
  rhyme: <RhymeTime />, truefalse: <TrueFalse />, sentence: <SentenceBuilder />,
  story: <StorySequence />, numbertrain: <NumberTrain />, weights: <WeightMatcher />,
  placevalue: <PlaceValue />, bonds: <NumberBonds />, market: <MarketMath />,
  river: <NumberRiver />, clock: <ClockReader />, sorting: <SortingHat />,
};

export default function PlayPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Literacy' | 'Numeracy' | 'Bonus'>('All');

  if (activeGame) {
    const game = GAMES.find(g => g.id === activeGame)!;
    return (
      <div className="max-w-2xl mx-auto pb-16">
        <div className="flex items-center gap-3 mb-6 pt-2">
          <button onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all">
            ← Back
          </button>
          <span className="text-2xl">{game.emoji}</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{game.title}</h2>
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[game.tag]}`}>{game.level}</span>
        </div>
        {GAME_MAP[activeGame]}
      </div>
    );
  }

  const filtered = filter === 'All' ? GAMES : GAMES.filter(g => g.tag === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      <div className="text-center space-y-2 pt-4">
        <div className="text-5xl">🎮</div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Learning Games</h1>
        <p className="text-slate-500 text-lg">Fun activities to practise reading and maths!</p>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {(['All', 'Literacy', 'Numeracy', 'Bonus'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
              filter === f
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}>
            {f} {f !== 'All' && <span className="opacity-60 ml-1">{GAMES.filter(g => g.tag === f).length}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(g => (
          <button key={g.id} onClick={() => setActiveGame(g.id)}
            className={`group ${g.bg} ${g.border} border-2 rounded-3xl p-6 text-left space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-95`}>
            <div className="flex items-start justify-between">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-3xl shadow-md`}>
                {g.emoji}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[g.tag]}`}>{g.tag}</span>
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-base leading-tight">{g.title}</p>
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
