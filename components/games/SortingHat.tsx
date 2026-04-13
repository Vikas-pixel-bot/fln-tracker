"use client";
import { useState } from 'react';

const CATEGORIES = [
  {
    name: 'प्राणी की अन्न?',
    bins: [
      { label: 'प्राणी 🐾', color: 'bg-green-100 border-green-400', textColor: 'text-green-700', items: ['🐶', '🐱', '🐸', '🦁', '🐟', '🐦'] },
      { label: 'अन्न 🍽️', color: 'bg-orange-100 border-orange-400', textColor: 'text-orange-700', items: ['🍎', '🍕', '🍌', '🥕', '🍔', '🍦'] },
    ]
  },
  {
    name: 'आकाश की पाणी?',
    bins: [
      { label: 'आकाशात ☁️', color: 'bg-sky-100 border-sky-400', textColor: 'text-sky-700', items: ['✈️', '🦅', '🌤️', '⭐', '🦋', '🎈'] },
      { label: 'पाण्यात 🌊', color: 'bg-blue-100 border-blue-400', textColor: 'text-blue-700', items: ['🐟', '🐙', '🦀', '🐬', '🐚', '🦑'] },
    ]
  },
  {
    name: 'शाळा की मैदान?',
    bins: [
      { label: 'शाळा 📚', color: 'bg-violet-100 border-violet-400', textColor: 'text-violet-700', items: ['📚', '✏️', '📏', '🖊️', '🗂️', '📐'] },
      { label: 'मैदान ⚽', color: 'bg-red-100 border-red-400', textColor: 'text-red-700', items: ['⚽', '🏏', '🎯', '🏐', '🎪', '🏸'] },
    ]
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function SortingHat() {
  const [catIdx, setCatIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const cat = CATEGORIES[catIdx % CATEGORIES.length];
  const allItems = shuffle([...cat.bins[0].items.slice(0, 3), ...cat.bins[1].items.slice(0, 3)]);

  const [remaining, setRemaining] = useState(allItems);
  const [sorted, setSorted] = useState<{ [bin: string]: string[] }>({ [cat.bins[0].label]: [], [cat.bins[1].label]: [] });
  const [current, setCurrent] = useState<string | null>(remaining[0] ?? null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);

  function reset(idx: number) {
    const c = CATEGORIES[idx % CATEGORIES.length];
    const items = shuffle([...c.bins[0].items.slice(0, 3), ...c.bins[1].items.slice(0, 3)]);
    setRemaining(items);
    setSorted({ [c.bins[0].label]: [], [c.bins[1].label]: [] });
    setCurrent(items[0]);
    setFeedback(null);
    setDone(false);
  }

  function drop(binLabel: string) {
    if (!current || feedback) return;
    const bin = cat.bins.find(b => b.label === binLabel)!;
    const correct = bin.items.includes(current);
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      const newSorted = { ...sorted, [binLabel]: [...sorted[binLabel], current] };
      const newRemaining = remaining.slice(1);
      setSorted(newSorted);
      setRemaining(newRemaining);
      setCurrent(newRemaining[0] ?? null);
      setFeedback(null);
      if (newRemaining.length === 0) setDone(true);
    }, 800);
  }

  if (done) {
    const correct = Object.entries(sorted).reduce((acc, [binLabel, items]) => {
      const bin = cat.bins.find(b => b.label === binLabel)!;
      return acc + items.filter(item => bin.items.includes(item)).length;
    }, 0);
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 shadow-sm text-center space-y-5">
        <div className="text-6xl">🎩</div>
        <h2 className="text-2xl font-extrabold text-slate-800">वर्गीकरण झाले!</h2>
        <p className="text-slate-500">तुम्हाला <span className="font-bold text-green-600">{correct}/6</span> बरोबर मिळाले!</p>
        <div className="flex gap-4 justify-center">
          {cat.bins.map(bin => (
            <div key={bin.label} className={`rounded-2xl border-2 p-4 ${bin.color} flex-1`}>
              <p className={`font-bold text-sm mb-2 ${bin.textColor}`}>{bin.label}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {sorted[bin.label].map((item, i) => {
                  const isCorrect = bin.items.includes(item);
                  return <span key={i} className={`text-2xl ${isCorrect ? '' : 'opacity-30 line-through'}`}>{item}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setCatIdx(i => i + 1); reset(catIdx + 1); }}
          className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all">
          पुढील फेरी →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
        <span className="text-2xl">🎩</span>
      </div>

      <p className="text-center font-bold text-slate-700">{cat.name} — बरोबर डब्यात टाका!</p>

      <div className="flex justify-center py-4">
        <div className={`w-28 h-28 rounded-3xl bg-slate-50 border-4 border-dashed border-slate-300 flex items-center justify-center text-7xl transition-all ${feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50' : ''}`}>
          {current}
        </div>
      </div>

      <p className="text-center text-slate-400 text-sm">खालील डब्यावर टॅप करा ↓</p>

      <div className="grid grid-cols-2 gap-4">
        {cat.bins.map(bin => (
          <button key={bin.label} onClick={() => drop(bin.label)}
            className={`rounded-2xl border-2 p-4 text-left transition-all hover:scale-105 active:scale-95 ${bin.color}`}>
            <p className={`font-extrabold text-sm mb-3 ${bin.textColor}`}>{bin.label}</p>
            <div className="flex flex-wrap gap-1 min-h-[32px]">
              {sorted[bin.label].map((item, i) => (
                <span key={i} className="text-2xl">{item}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-1">
        {allItems.map((item, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${remaining.includes(item) || item === current ? 'bg-violet-400' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
}
