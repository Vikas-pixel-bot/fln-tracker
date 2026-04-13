'use client';
import { useState } from 'react';
import { RotateCcw, Star, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

function randomNumber(max = 999) {
  return Math.floor(Math.random() * max) + 1;
}

export default function SankhyaChakra() {
  const [target, setTarget] = useState(() => randomNumber(999));
  const [hundreds, setHundreds] = useState<number | null>(null);
  const [tens, setTens] = useState<number | null>(null);
  const [ones, setOnes] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [activeSlot, setActiveSlot] = useState<'H' | 'T' | 'O' | null>('H');

  const t_h = Math.floor(target / 100);
  const t_t = Math.floor((target % 100) / 10);
  const t_o = target % 10;

  const checkAnswer = (h: number | null, t: number | null, o: number | null) => {
    if (h === null || t === null || o === null) return;
    if (h === t_h && t === t_t && o === t_o) {
      setFeedback('success');
      setScore(s => s + 1);
      setTimeout(() => {
        setTarget(randomNumber(999));
        setHundreds(null); setTens(null); setOnes(null);
        setFeedback('idle'); setActiveSlot('H');
      }, 1400);
    } else {
      setFeedback('error');
      setTimeout(() => {
        setHundreds(null); setTens(null); setOnes(null);
        setFeedback('idle'); setActiveSlot('H');
      }, 1000);
    }
  };

  const tapDigit = (d: number) => {
    if (feedback !== 'idle') return;
    let h = hundreds, t = tens, o = ones;
    if (activeSlot === 'H') { h = d; setHundreds(d); setActiveSlot('T'); }
    else if (activeSlot === 'T') { t = d; setTens(d); setActiveSlot('O'); }
    else if (activeSlot === 'O') { o = d; setOnes(d); setActiveSlot(null); checkAnswer(h, t, o); }
  };

  const reset = () => {
    setHundreds(null); setTens(null); setOnes(null);
    setFeedback('idle'); setActiveSlot('H');
  };

  const PLACE_LABELS = ['शेकडे', 'दहे', 'एकके'];
  const PLACE_VALUES = [hundreds, tens, ones];
  const PLACE_KEYS: ('H' | 'T' | 'O')[] = ['H', 'T', 'O'];
  const PLACE_COLORS = [
    { active: 'border-purple-500 bg-purple-500/10 text-purple-300', filled: 'border-purple-400 text-purple-200 bg-purple-900/30', empty: 'border-white/10 text-white/20' },
    { active: 'border-blue-500 bg-blue-500/10 text-blue-300', filled: 'border-blue-400 text-blue-200 bg-blue-900/30', empty: 'border-white/10 text-white/20' },
    { active: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', filled: 'border-emerald-400 text-emerald-200 bg-emerald-900/30', empty: 'border-white/10 text-white/20' },
  ];

  return (
    <div className="bg-slate-950 rounded-[48px] border border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Hash className="w-3 h-3" /> संख्याज्ञान: स्थानिक किंमत
          </div>
          <h2 className="text-3xl font-black tracking-tight">संख्या चक्र</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-yellow-400 text-black rounded-2xl font-black">गुण: {score}</div>
          <button onClick={() => { setTarget(randomNumber(999)); reset(); }}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Target number — big display */}
      <div className="flex justify-center mb-8">
        <div className={cn(
          'px-16 py-6 rounded-[40px] border-4 text-center transition-all',
          feedback === 'success' ? 'border-emerald-400 bg-emerald-500/10' :
          feedback === 'error' ? 'border-red-500 bg-red-500/10 animate-bounce' :
          'border-yellow-400 bg-yellow-400/10'
        )}>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ही संख्या</div>
          <div className={cn('text-8xl font-black', feedback === 'error' ? 'text-red-400' : 'text-yellow-300')}>
            {target}
          </div>
        </div>
      </div>

      {/* Place value slots */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {PLACE_KEYS.map((key, i) => {
          const val = PLACE_VALUES[i];
          const col = PLACE_COLORS[i];
          const isActive = activeSlot === key;
          return (
            <div key={key} className={cn(
              'rounded-[28px] border-2 p-4 text-center transition-all cursor-pointer',
              isActive ? col.active : val !== null ? col.filled : col.empty
            )} onClick={() => { if (feedback === 'idle') setActiveSlot(key); }}>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{PLACE_LABELS[i]}</div>
              <div className="text-6xl font-black">{val ?? '?'}</div>
              {isActive && <div className="text-[9px] font-black uppercase tracking-widest mt-2 animate-pulse">← येथे टाका</div>}
            </div>
          );
        })}
      </div>

      {/* Digit pad */}
      <div className="grid grid-cols-5 gap-3">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <button key={d} onClick={() => tapDigit(d)}
            disabled={feedback !== 'idle' || activeSlot === null}
            className="h-14 bg-white/5 border border-white/10 rounded-2xl text-2xl font-black hover:bg-white/15 active:scale-90 transition-all disabled:opacity-30">
            {d}
          </button>
        ))}
      </div>

      {feedback === 'success' && (
        <div className="mt-6 text-center text-2xl font-black text-emerald-400 animate-bounce">
          🎉 शाब्बास! {t_h > 0 ? `${t_h} शेकडे + ` : ''}{t_t} दहे + {t_o} एकके = {target}
        </div>
      )}

      {/* Teacher tip */}
      <div className="mt-6 bg-slate-900 rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          संख्या पाहून विद्यार्थ्याने शेकडे, दहे, एकके वेगळे करायचे. उदा. ३४७ = ३ शेकडे + ४ दहे + ७ एकके.
        </p>
      </div>
    </div>
  );
}
