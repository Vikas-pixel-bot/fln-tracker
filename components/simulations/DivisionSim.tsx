'use client';
import { useState } from 'react';
import { RotateCcw, Star, Divide } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = ['🍎', '⭐', '🟡', '🔵', '🍬', '🌸', '🎯', '🍕'];

function newProblem() {
  const divisors = [2, 3, 4, 5];
  const d = divisors[Math.floor(Math.random() * divisors.length)];
  const q = Math.floor(Math.random() * 5) + 2; // quotient 2–6
  const total = d * q;
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  return { total, divisor: d, quotient: q, item };
}

export default function DivisionSim() {
  const [prob, setProb] = useState(newProblem);
  const [groups, setGroups] = useState<string[][]>([]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);

  const { total, divisor, quotient, item } = prob;

  // How many items have been placed
  const placed = groups.reduce((s, g) => s + g.length, 0);
  const remaining = total - placed;

  const initGroups = () => {
    return Array.from({ length: divisor }, () => [] as string[]);
  };

  // Initialize groups when problem changes
  const [initialized, setInitialized] = useState(false);
  if (!initialized) { setGroups(initGroups()); setInitialized(true); }

  const placeItem = (groupIdx: number) => {
    if (feedback !== 'idle' || remaining === 0) return;
    const next = groups.map((g, i) => i === groupIdx ? [...g, item] : [...g]);
    setGroups(next);
    // Auto-check once all placed
    if (remaining === 1) {
      const allEqual = next.every(g => g.length === quotient);
      if (allEqual) {
        setFeedback('success');
        setScore(s => s + 1);
        setTimeout(() => { const p = newProblem(); setProb(p); setGroups(Array.from({ length: p.divisor }, () => [])); setAnswer(''); setFeedback('idle'); setInitialized(true); }, 1800);
      } else {
        setFeedback('error');
        setTimeout(() => { setGroups(initGroups()); setFeedback('idle'); }, 1000);
      }
    }
  };

  const reset = () => { setGroups(initGroups()); setFeedback('idle'); };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Divide className="w-3 h-3" /> भागाकार
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">समान वाटणी</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-teal-100 text-teal-700 rounded-2xl font-black">गुण: {score}</div>
          <button onClick={() => { const p = newProblem(); setProb(p); setGroups(Array.from({ length: p.divisor }, () => [])); setFeedback('idle'); }}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Problem statement */}
      <div className={cn('mb-6 py-4 px-8 rounded-[28px] border-2 text-center transition-all',
        feedback === 'success' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
        feedback === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-bounce' :
        'border-teal-300 bg-teal-50 dark:bg-teal-900/10 dark:border-teal-800')}>
        <p className="text-sm font-bold text-slate-500 mb-1">प्रश्न</p>
        <p className="text-xl font-black text-slate-800 dark:text-white">
          {total} {item} → {divisor} मुलांमध्ये समान वाटा
        </p>
        <p className="text-4xl font-black text-teal-600 dark:text-teal-400 mt-1">{total} ÷ {divisor} = ?</p>
      </div>

      {/* Remaining items bank */}
      <div className="mb-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">वाटायचे आहेत ({remaining} उरले)</div>
        <div className="min-h-[48px] bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 flex flex-wrap gap-2">
          {Array.from({ length: remaining }).map((_, i) => (
            <span key={i} className="text-2xl select-none">{item}</span>
          ))}
          {remaining === 0 && <span className="text-slate-300 text-sm self-center">सर्व वाटले!</span>}
        </div>
      </div>

      {/* Groups */}
      <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(divisor, 4)}, 1fr)` }}>
        {groups.map((g, gi) => (
          <button key={gi} onClick={() => placeItem(gi)}
            disabled={feedback !== 'idle' || remaining === 0}
            className={cn(
              'rounded-[24px] border-2 p-3 flex flex-col items-center gap-1 min-h-[100px] transition-all active:scale-95',
              feedback === 'success' && g.length === quotient ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
              feedback === 'error' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
              'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-slate-800 hover:border-teal-400'
            )}>
            <div className="text-[10px] font-black uppercase tracking-widest text-teal-500">मुलगा {gi + 1}</div>
            <div className="flex flex-wrap gap-1 justify-center flex-1 items-center">
              {g.map((it, ii) => <span key={ii} className="text-xl">{it}</span>)}
              {g.length === 0 && <span className="text-slate-300 text-xs">टॅप करा</span>}
            </div>
            <div className="text-lg font-black text-teal-600 dark:text-teal-400">{g.length}</div>
          </button>
        ))}
      </div>

      {feedback === 'success' && (
        <div className="mt-4 text-center text-xl font-black text-emerald-500 animate-bounce">
          🎉 शाब्बास! {total} ÷ {divisor} = {quotient}
        </div>
      )}

      <button onClick={reset} className="mt-4 w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-200 transition-all active:scale-95">
        पुन्हा सुरू करा
      </button>

      {/* Teacher tip */}
      <div className="mt-4 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          विद्यार्थ्याने एक एक वस्तू गटांमध्ये वाटायची. समान वाटणी झाली की उत्तर मिळते — भागाकाराचा अर्थ "समान वाटणी".
        </p>
      </div>
    </div>
  );
}
