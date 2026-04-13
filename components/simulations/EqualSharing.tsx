'use client';
import { useState } from 'react';
import { RotateCcw, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Meaningful real-world sharing scenarios
const SCENARIOS = [
  {
    item: '🍎', itemName: 'सफरचंद', itemColor: 'red',
    children: ['👦', '👧', '👦', '👧'],
    totals: [8, 12, 16, 20],
  },
  {
    item: '🍬', itemName: 'गोळ्या', itemColor: 'pink',
    children: ['👦', '👧', '👦'],
    totals: [9, 12, 15, 18],
  },
  {
    item: '📚', itemName: 'पुस्तके', itemColor: 'blue',
    children: ['👦', '👧', '👦', '👧', '👦'],
    totals: [10, 15, 20, 25],
  },
  {
    item: '🌸', itemName: 'फुले', itemColor: 'purple',
    children: ['👧', '👧', '👧'],
    totals: [6, 9, 12, 15],
  },
  {
    item: '🍊', itemName: 'संत्री', itemColor: 'orange',
    children: ['👦', '👧', '👦', '👧'],
    totals: [8, 12, 16, 20],
  },
];

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; item: string }> = {
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',    border: 'border-red-300 dark:border-red-700',    text: 'text-red-600 dark:text-red-400',    item: 'bg-red-400'    },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20',  border: 'border-pink-300 dark:border-pink-700',  text: 'text-pink-600 dark:text-pink-400',  item: 'bg-pink-400'   },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',  border: 'border-blue-300 dark:border-blue-700',  text: 'text-blue-600 dark:text-blue-400',  item: 'bg-blue-400'   },
  purple: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-700', text: 'text-violet-600 dark:text-violet-400', item: 'bg-violet-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-600 dark:text-orange-400', item: 'bg-orange-400' },
};

function newRound() {
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
  const total = scenario.totals[Math.floor(Math.random() * scenario.totals.length)];
  const divisor = scenario.children.length;
  const quotient = total / divisor;
  return { ...scenario, total, divisor, quotient };
}

export default function EqualSharing() {
  const [prob, setProb] = useState(newRound);
  const [baskets, setBaskets] = useState<number[]>(() => new Array(prob.divisor).fill(0));
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [animItem, setAnimItem] = useState<number | null>(null); // which basket last received

  const placed = baskets.reduce((a, b) => a + b, 0);
  const remaining = prob.total - placed;
  const c = COLOR_CLASSES[prob.itemColor];

  const placeOne = (idx: number) => {
    if (feedback !== 'idle' || remaining === 0) return;
    setAnimItem(idx);
    setTimeout(() => setAnimItem(null), 400);

    const next = [...baskets];
    next[idx]++;
    setBaskets(next);

    if (remaining === 1) {
      const allEqual = next.every(v => v === prob.quotient);
      if (allEqual) {
        setFeedback('success');
        setScore(s => s + 1);
        setTimeout(() => {
          const p = newRound();
          setProb(p);
          setBaskets(new Array(p.divisor).fill(0));
          setFeedback('idle');
        }, 2000);
      } else {
        setFeedback('error');
        setTimeout(() => {
          setBaskets(new Array(prob.divisor).fill(0));
          setFeedback('idle');
        }, 1200);
      }
    }
  };

  const reset = () => {
    setBaskets(new Array(prob.divisor).fill(0));
    setFeedback('idle');
  };

  const newProb = () => {
    const p = newRound();
    setProb(p);
    setBaskets(new Array(p.divisor).fill(0));
    setFeedback('idle');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Users className="w-3 h-3" /> समान वाटणी — भागाकार
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">वाटणी करा</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-2xl font-black">गुण: {score}</div>
          <button onClick={newProb} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Story context */}
      <div className={cn('mb-6 rounded-[28px] border-2 p-5', c.bg, c.border)}>
        <p className="text-sm font-bold text-slate-500 mb-1">गोष्ट</p>
        <p className="text-xl font-black text-slate-800 dark:text-white leading-snug">
          आईने {prob.total} {prob.item} {prob.itemName} आणली.
          तिने {prob.divisor} मुलांमध्ये <span className={cn('underline', c.text)}>समान</span> वाटायचे आहेत.
          प्रत्येकाला किती मिळतील?
        </p>
        <div className="mt-3 text-3xl font-black text-slate-800 dark:text-white">
          {prob.total} ÷ {prob.divisor} = ?
        </div>
      </div>

      {/* Item bank */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">वाटायचे आहे ({remaining} उरले)</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">एका मुलाला टॅप करून द्या</span>
        </div>
        <div className={cn('min-h-[56px] rounded-2xl border-2 p-3 flex flex-wrap gap-2 items-center', c.bg, c.border)}>
          {Array.from({ length: remaining }).map((_, i) => (
            <span key={i} className="text-2xl select-none animate-in zoom-in-50 duration-150">{prob.item}</span>
          ))}
          {remaining === 0 && (
            <span className={cn('text-sm font-black', c.text)}>सगळे वाटले! ✓</span>
          )}
        </div>
      </div>

      {/* Children baskets */}
      <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(prob.divisor, 4)}, 1fr)` }}>
        {prob.children.slice(0, prob.divisor).map((childEmoji, ci) => (
          <button key={ci} onClick={() => placeOne(ci)}
            disabled={feedback !== 'idle' || remaining === 0}
            className={cn(
              'rounded-[24px] border-2 p-3 flex flex-col items-center gap-2 min-h-[120px] transition-all active:scale-95',
              feedback === 'success' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
              feedback === 'error' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
              animItem === ci ? cn(c.border, c.bg, 'scale-105') :
              cn('hover:scale-105', c.border, 'bg-slate-50 dark:bg-slate-800')
            )}>
            {/* Child avatar */}
            <div className="text-4xl">{childEmoji}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">मूल {ci + 1}</div>

            {/* Items in basket */}
            <div className="flex-1 flex flex-wrap gap-1 justify-center items-center">
              {Array.from({ length: baskets[ci] }).map((_, ii) => (
                <span key={ii} className="text-lg animate-in zoom-in-50 duration-200">{prob.item}</span>
              ))}
              {baskets[ci] === 0 && <span className="text-slate-300 text-xs">येथे द्या</span>}
            </div>

            {/* Count badge */}
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm',
              baskets[ci] === prob.quotient && remaining === 0 ? 'bg-emerald-500' : c.item.replace('bg-', 'bg-') )}>
              {baskets[ci]}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'success' && (
        <div className="mt-4 text-center space-y-1 animate-bounce">
          <div className="text-2xl font-black text-emerald-500">🎉 शाब्बास! समान वाटणी झाली!</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {prob.total} ÷ {prob.divisor} = {prob.quotient} — प्रत्येकाला {prob.quotient} {prob.item} मिळाले
          </div>
        </div>
      )}
      {feedback === 'error' && (
        <div className="mt-4 text-center text-red-500 font-black text-lg animate-bounce">
          ❌ समान नाही! पुन्हा करा — प्रत्येकाला {prob.quotient} मिळायला हवेत.
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={reset} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-200 transition-all active:scale-95">
          पुन्हा सुरू करा
        </button>
        <button onClick={newProb} className="flex-1 py-3 bg-teal-600 text-white rounded-2xl font-black text-sm hover:bg-teal-700 transition-all active:scale-95">
          नवीन प्रश्न →
        </button>
      </div>

      {/* Teacher tip */}
      <div className="mt-4 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          एक एक वस्तू क्रमाने वाटा — "एकाला दे, दुसऱ्याला दे..." हा भागाकाराचा अर्थ आहे.
          शेवटी विचारा: "प्रत्येकाला किती मिळाले? ते समान आहेत का?"
          <span className="text-white font-bold"> समान वाटणी = भागाकार.</span>
        </p>
      </div>
    </div>
  );
}
