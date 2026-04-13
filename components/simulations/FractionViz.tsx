'use client';
import { useState } from 'react';
import { RotateCcw, Star, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Fractions we cover: halves, thirds, quarters, fifths
const FRACTIONS = [
  { num: 1, den: 2,  label: '½',   marathi: 'अर्धा' },
  { num: 1, den: 3,  label: '⅓',   marathi: 'एक तृतीयांश' },
  { num: 2, den: 3,  label: '⅔',   marathi: 'दोन तृतीयांश' },
  { num: 1, den: 4,  label: '¼',   marathi: 'एक चतुर्थांश' },
  { num: 3, den: 4,  label: '¾',   marathi: 'तीन चतुर्थांश' },
  { num: 1, den: 5,  label: '⅕',   marathi: 'एक पंचमांश' },
  { num: 2, den: 5,  label: '⅖',   marathi: 'दोन पंचमांश' },
  { num: 3, den: 5,  label: '⅗',   marathi: 'तीन पंचमांश' },
];

// Real-world contexts — the "whole" to divide
const CONTEXTS = [
  { emoji: '🍕', name: 'पिझ्झा', color: 'orange' },
  { emoji: '🍫', name: 'चॉकलेट', color: 'amber' },
  { emoji: '🥧', name: 'चपाती', color: 'yellow' },
  { emoji: '🍉', name: 'टरबूज', color: 'green' },
  { emoji: '🎂', name: 'केक', color: 'pink' },
];

const COLOR_MAP: Record<string, { filled: string; empty: string; border: string; text: string }> = {
  orange: { filled: 'bg-orange-400', empty: 'bg-orange-100 dark:bg-orange-900/20', border: 'border-orange-300', text: 'text-orange-600' },
  amber:  { filled: 'bg-amber-500',  empty: 'bg-amber-100 dark:bg-amber-900/20',   border: 'border-amber-300',  text: 'text-amber-600'  },
  yellow: { filled: 'bg-yellow-400', empty: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-300', text: 'text-yellow-600' },
  green:  { filled: 'bg-green-500',  empty: 'bg-green-100 dark:bg-green-900/20',   border: 'border-green-300',  text: 'text-green-600'  },
  pink:   { filled: 'bg-pink-400',   empty: 'bg-pink-100 dark:bg-pink-900/20',     border: 'border-pink-300',   text: 'text-pink-600'   },
};

function shuffle<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5); }

function newRound() {
  const frac = FRACTIONS[Math.floor(Math.random() * FRACTIONS.length)];
  const ctx  = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];
  // Build options: correct + 2 distractors
  const others = shuffle(FRACTIONS.filter(f => !(f.num === frac.num && f.den === frac.den))).slice(0, 2);
  const options = shuffle([frac, ...others]);
  return { frac, ctx, options };
}

// SVG pie chart — draws filled arc for numerator/denominator
function PieSlice({ numerator, denominator, color }: { numerator: number; denominator: number; color: string }) {
  const size = 180;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const sliceAngle = (2 * Math.PI) / denominator;

  const slices = Array.from({ length: denominator }, (_, i) => {
    const startAngle = -Math.PI / 2 + i * sliceAngle;
    const endAngle   = startAngle + sliceAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const filled = i < numerator;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, filled };
  });

  const c = COLOR_MAP[color];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-xl">
      {slices.map((s, i) => (
        <path key={i} d={s.d}
          className={cn('transition-all', s.filled ? c.filled : c.empty)}
          stroke="white" strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="3" />
    </svg>
  );
}

// Bar model — horizontal strips
function BarModel({ numerator, denominator, color }: { numerator: number; denominator: number; color: string }) {
  const c = COLOR_MAP[color];
  return (
    <div className={cn('w-full h-14 rounded-2xl overflow-hidden flex border-2', c.border)}>
      {Array.from({ length: denominator }).map((_, i) => (
        <div key={i}
          className={cn('flex-1 border-r last:border-r-0 border-white/50 transition-all', i < numerator ? c.filled : c.empty)} />
      ))}
    </div>
  );
}

export default function FractionViz() {
  const [round, setRound] = useState(newRound);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [tapCount, setTapCount] = useState(0); // for interactive build mode
  const [vizMode, setVizMode] = useState<'pie' | 'bar'>('pie');

  const { frac, ctx, options } = round;
  const c = COLOR_MAP[ctx.color];

  const pick = (f: typeof frac) => {
    if (feedback !== 'idle') return;
    const correct = f.num === frac.num && f.den === frac.den;
    setChosen(`${f.num}/${f.den}`);
    setFeedback(correct ? 'success' : 'error');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(newRound());
      setChosen(null);
      setFeedback('idle');
    }, 1400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <PieChart className="w-3 h-3" /> अपूर्णांक — आकृतीद्वारे
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">अपूर्णांक शिका</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-2xl font-black">गुण: {score}</div>
          <button onClick={() => { setRound(newRound()); setChosen(null); setFeedback('idle'); }}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Viz toggle */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button onClick={() => setVizMode('pie')}
          className={cn('flex-1 py-2 rounded-xl font-black text-sm transition-all',
            vizMode === 'pie' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow' : 'text-slate-400')}>
          🥧 गोल आकृती
        </button>
        <button onClick={() => setVizMode('bar')}
          className={cn('flex-1 py-2 rounded-xl font-black text-sm transition-all',
            vizMode === 'bar' ? 'bg-white dark:bg-slate-700 text-pink-600 shadow' : 'text-slate-400')}>
          📊 पट्टी आकृती
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-8">
        {/* Left: Visualisation */}
        <div className="space-y-4 flex flex-col">
          {/* Context */}
          <div className="text-center">
            <span className="text-6xl">{ctx.emoji}</span>
            <p className="text-sm font-bold text-slate-500 mt-1">{ctx.name}</p>
          </div>

          {/* Main visual */}
          <div className="flex-1 flex items-center justify-center">
            {vizMode === 'pie' ? (
              <div className="w-48 h-48">
                <PieSlice numerator={frac.num} denominator={frac.den} color={ctx.color} />
              </div>
            ) : (
              <div className="w-full space-y-3">
                <BarModel numerator={frac.num} denominator={frac.den} color={ctx.color} />
                <div className="flex gap-2">
                  <div className={cn('w-5 h-5 rounded', c.filled)} />
                  <span className="text-xs font-bold text-slate-500">रंगीत भाग = {frac.num}/{frac.den}</span>
                </div>
              </div>
            )}
          </div>

          {/* Fraction breakdown */}
          <div className={cn('rounded-[24px] border-2 p-4 text-center', c.border, 'bg-opacity-10')}>
            <div className="text-5xl font-black mb-1">
              <span className={c.text}>{frac.num}</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-slate-700 dark:text-slate-200">{frac.den}</span>
            </div>
            <p className="text-sm font-bold text-slate-500">{frac.den} समान भागांपैकी <span className={cn('font-black', c.text)}>{frac.num} भाग</span></p>
            <p className={cn('text-lg font-black mt-1', c.text)}>{frac.marathi}</p>
          </div>
        </div>

        {/* Right: Quiz */}
        <div className="flex flex-col justify-center space-y-4">
          <p className="text-center font-black text-slate-700 dark:text-slate-200 text-lg">
            रंगीत भाग कोणता अपूर्णांक दाखवतो?
          </p>
          <p className="text-center text-slate-400 text-sm font-medium">
            {ctx.name}चे {frac.den} समान तुकडे केले — {frac.num} रंगीत आहे{frac.num > 1 ? 'त' : ''}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {options.map((opt, i) => {
              const key = `${opt.num}/${opt.den}`;
              const isCorrect = opt.num === frac.num && opt.den === frac.den;
              let cls = 'border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white hover:border-pink-400';
              if (chosen === key) {
                cls = isCorrect && feedback === 'success'
                  ? 'border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 scale-105'
                  : 'border-2 border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600';
              } else if (feedback !== 'idle' && isCorrect) {
                cls = 'border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300';
              }
              return (
                <button key={i} onClick={() => pick(opt)}
                  className={cn('rounded-2xl py-4 px-6 font-black text-xl transition-all active:scale-95 flex items-center justify-between', cls)}>
                  <span>{opt.label} = {opt.num}/{opt.den}</span>
                  <span className="text-sm font-bold text-slate-400">{opt.marathi}</span>
                </button>
              );
            })}
          </div>

          {feedback === 'success' && (
            <div className="text-center text-xl font-black text-emerald-500 animate-bounce">
              🎉 शाब्बास! {frac.label} म्हणजे {frac.marathi}
            </div>
          )}
          {feedback === 'error' && (
            <div className="text-center text-base font-black text-red-500">
              ❌ उत्तर: {frac.label} — {frac.marathi}
            </div>
          )}
        </div>
      </div>

      {/* Teacher tip */}
      <div className="mt-6 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          "पिझ्झाचे ४ भाग केले — एक तुम्हाला दिला. तुम्हाला किती मिळाले?" — वास्तव संदर्भातून अपूर्णांक समजतो. पट्टी आणि गोल दोन्ही आकृत्या दाखवा.
        </p>
      </div>
    </div>
  );
}
