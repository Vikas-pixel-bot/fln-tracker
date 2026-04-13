'use client';
import { useState } from 'react';
import { RotateCcw, Star, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

function newProblem() {
  const a = Math.floor(Math.random() * 9) + 2; // 2–10
  const b = Math.floor(Math.random() * 9) + 2;
  return { a, b };
}

export default function MultiplicationSim() {
  const [prob, setProb] = useState(newProblem);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);
  const [showArray, setShowArray] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const { a, b } = prob;
  const correct = a * b;

  const check = () => {
    if (!answer) return;
    if (parseInt(answer) === correct) {
      setFeedback('success');
      setScore(s => s + 1);
      setTimeout(() => { setProb(newProblem()); setAnswer(''); setFeedback('idle'); setRevealed(false); }, 1500);
    } else {
      setFeedback('error');
      setTimeout(() => { setAnswer(''); setFeedback('idle'); }, 900);
    }
  };

  const tapDigit = (d: string) => {
    if (feedback !== 'idle') return;
    if (d === '⌫') { setAnswer(v => v.slice(0, -1)); return; }
    if (answer.length < 3) setAnswer(v => v + d);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Grid3x3 className="w-3 h-3" /> गुणाकार
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">गुणाकार शिका</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-orange-100 text-orange-700 rounded-2xl font-black">गुण: {score}</div>
          <button onClick={() => { setProb(newProblem()); setAnswer(''); setFeedback('idle'); setRevealed(false); }}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-8">
        {/* Left: Visual array */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              {a} ओळी × {b} स्तंभ
            </h3>
            <button onClick={() => setShowArray(v => !v)}
              className="text-xs font-black text-blue-500 underline">
              {showArray ? 'लपवा' : 'दाखवा'}
            </button>
          </div>
          {showArray && (
            <div className="bg-orange-50 dark:bg-slate-800/50 rounded-[32px] p-6 border-2 border-orange-100 dark:border-slate-700">
              <div className="space-y-1.5">
                {Array.from({ length: a }).map((_, ri) => (
                  <div key={ri} className="flex gap-1.5 justify-center">
                    {Array.from({ length: b }).map((_, ci) => (
                      <div key={ci} className={cn(
                        'w-7 h-7 rounded-lg transition-all',
                        revealed ? 'bg-orange-500' : 'bg-orange-300 dark:bg-orange-700'
                      )} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-xs font-bold text-slate-500">
                एकूण ठिपके = {a} × {b} = {revealed ? correct : '?'}
              </div>
            </div>
          )}
          <button onClick={() => setRevealed(v => !v)}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
            {revealed ? 'उत्तर लपवा' : 'उत्तर पहा (मदत)'}
          </button>
        </div>

        {/* Right: Input */}
        <div className="space-y-6 flex flex-col justify-center">
          {/* Problem display */}
          <div className={cn('text-center py-6 px-8 rounded-[32px] border-4 transition-all',
            feedback === 'success' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
            feedback === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-bounce' :
            'border-orange-300 bg-orange-50 dark:bg-slate-800 dark:border-orange-700')}>
            <div className="text-6xl font-black text-slate-900 dark:text-white">
              {a} × {b}
            </div>
            <div className="text-xl font-bold text-slate-400 mt-1">=</div>
            <div className={cn('text-5xl font-black min-h-[56px]',
              feedback === 'success' ? 'text-emerald-500' :
              feedback === 'error' ? 'text-red-500' :
              answer ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600')}>
              {answer || '?'}
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(d => (
              <button key={d}
                onClick={() => d === '✓' ? check() : tapDigit(d)}
                disabled={feedback !== 'idle'}
                className={cn(
                  'h-14 rounded-2xl font-black text-xl transition-all active:scale-90 disabled:opacity-40',
                  d === '✓' ? 'bg-blue-600 text-white col-span-1' :
                  d === '⌫' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900/30'
                )}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher tip */}
      <div className="mt-6 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          ठिपक्यांचा आयत म्हणजेच गुणाकार. ३ ओळी × ४ स्तंभ = १२ ठिपके. विद्यार्थ्याने आधी मोजायचे, मग उत्तर टाकायचे.
        </p>
      </div>
    </div>
  );
}
