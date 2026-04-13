'use client';
import { useState } from 'react';
import { RotateCcw, Star, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

// 3 rows: Hundreds, Tens, Ones — each 0–9 beads
const ROW_CONFIG = [
  { label: 'शेकडे', color: 'bg-purple-500', light: 'bg-purple-200', border: 'border-purple-400', text: 'text-purple-600', multiplier: 100 },
  { label: 'दहे',   color: 'bg-blue-500',   light: 'bg-blue-200',   border: 'border-blue-400',   text: 'text-blue-600',   multiplier: 10  },
  { label: 'एकके', color: 'bg-emerald-500', light: 'bg-emerald-200', border: 'border-emerald-400', text: 'text-emerald-600', multiplier: 1  },
];

export default function DigitalAbacus() {
  const [beads, setBeads] = useState([0, 0, 0]); // hundreds, tens, ones
  const [target, setTarget] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'free' | 'challenge'>('free');

  const total = beads[0] * 100 + beads[1] * 10 + beads[2];

  const newChallenge = () => {
    const t = Math.floor(Math.random() * 899) + 100; // 100–999
    setTarget(t);
    setBeads([0, 0, 0]);
    setFeedback('idle');
    setMode('challenge');
  };

  const check = () => {
    if (target === null) return;
    if (total === target) {
      setFeedback('success');
      setScore(s => s + 1);
      setTimeout(() => newChallenge(), 1500);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 900);
    }
  };

  const setBead = (row: number, val: number) => {
    if (feedback === 'success') return;
    const next = [...beads];
    next[row] = Math.max(0, Math.min(9, val));
    setBeads(next);
    setFeedback('idle');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Calculator className="w-3 h-3" /> डिजिटल मणी-फ्रेम
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">अबॅकस</h2>
        </div>
        <div className="flex items-center gap-3">
          {mode === 'challenge' && (
            <div className="px-5 py-2 bg-yellow-400 text-black rounded-2xl font-black">गुण: {score}</div>
          )}
          <button onClick={() => { setBeads([0, 0, 0]); setTarget(null); setFeedback('idle'); setMode('free'); }}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => { setMode('free'); setTarget(null); setBeads([0, 0, 0]); setFeedback('idle'); }}
          className={cn('flex-1 py-3 rounded-2xl font-black text-sm transition-all', mode === 'free' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
          मुक्त सराव
        </button>
        <button onClick={newChallenge}
          className={cn('flex-1 py-3 rounded-2xl font-black text-sm transition-all', mode === 'challenge' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')}>
          आव्हान
        </button>
      </div>

      {/* Challenge target */}
      {mode === 'challenge' && target !== null && (
        <div className={cn('mb-6 py-4 px-8 rounded-[28px] border-2 text-center transition-all',
          feedback === 'success' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
          feedback === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' :
          'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10')}>
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">हे दाखवा</div>
          <div className={cn('text-6xl font-black', feedback === 'error' ? 'text-red-500 animate-bounce' : 'text-yellow-600 dark:text-yellow-300')}>{target}</div>
        </div>
      )}

      {/* Abacus frame */}
      <div className="flex-1 bg-amber-50 dark:bg-slate-800/50 rounded-[36px] p-6 border-2 border-amber-200 dark:border-slate-700 space-y-4 mb-6">
        {/* Horizontal rod at top */}
        <div className="h-3 bg-amber-800 dark:bg-amber-700 rounded-full mx-4 shadow" />

        {ROW_CONFIG.map((row, ri) => (
          <div key={ri} className="flex items-center gap-4">
            {/* Label */}
            <div className="w-16 text-center">
              <div className={cn('text-[10px] font-black uppercase tracking-widest', row.text, 'dark:text-opacity-80')}>{row.label}</div>
              <div className="text-xl font-black text-slate-700 dark:text-slate-200">{beads[ri]}</div>
            </div>

            {/* Rod + beads */}
            <div className="flex-1 relative flex items-center gap-1.5 h-12">
              {/* Rod */}
              <div className="absolute inset-y-4 left-0 right-0 bg-amber-700 dark:bg-amber-600 rounded-full h-1 top-1/2 -translate-y-1/2" />

              {/* 9 bead slots */}
              {Array.from({ length: 9 }).map((_, bi) => {
                const filled = bi < beads[ri];
                return (
                  <button key={bi}
                    onClick={() => setBead(ri, filled ? bi : bi + 1)}
                    className={cn(
                      'relative z-10 w-9 h-9 rounded-full border-2 transition-all active:scale-90 shadow',
                      filled ? `${row.color} ${row.border} border-opacity-80` : `${row.light} ${row.border} border-opacity-40 dark:bg-slate-700 dark:border-slate-600`
                    )}
                  />
                );
              })}
            </div>

            {/* +/- controls */}
            <div className="flex gap-1">
              <button onClick={() => setBead(ri, beads[ri] - 1)} disabled={beads[ri] === 0}
                className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 font-black text-sm disabled:opacity-30 active:scale-90 transition-all">−</button>
              <button onClick={() => setBead(ri, beads[ri] + 1)} disabled={beads[ri] === 9}
                className={cn('w-8 h-8 rounded-xl font-black text-sm text-white disabled:opacity-30 active:scale-90 transition-all', row.color)}>+</button>
            </div>
          </div>
        ))}

        {/* Bottom rod */}
        <div className="h-3 bg-amber-800 dark:bg-amber-700 rounded-full mx-4 shadow" />
      </div>

      {/* Total display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-500 font-bold text-sm">
          {beads[0]}×100 + {beads[1]}×10 + {beads[2]}×1
        </div>
        <div className={cn('text-5xl font-black transition-all',
          feedback === 'success' ? 'text-emerald-500' :
          feedback === 'error' ? 'text-red-500' :
          'text-slate-900 dark:text-white')}>
          = {total}
        </div>
      </div>

      {mode === 'challenge' && target !== null && feedback === 'idle' && (
        <button onClick={check}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 active:scale-95 transition-all">
          तपासा ✓
        </button>
      )}

      {feedback === 'success' && <div className="text-center text-xl font-black text-emerald-500 animate-bounce">🎉 शाब्बास!</div>}

      {/* Teacher tip */}
      <div className="mt-4 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          विद्यार्थ्याने मणी सरकवून संख्या बनवायची. मुक्त सरावात स्वत:च संख्या बनवा; आव्हान मोडमध्ये दिलेली संख्या अबॅकसवर दाखवा.
        </p>
      </div>
    </div>
  );
}
