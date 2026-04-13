'use client';
import { useState } from 'react';
import { RotateCcw, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const GROUP_EMOJIS = ['🍎', '⭐', '🟡', '🔵', '🍬', '🌸', '🎯', '🍊', '🐟', '🌻'];

function newProblem() {
  const groupSize = Math.floor(Math.random() * 5) + 2;   // 2–6 items per group
  const numGroups = Math.floor(Math.random() * 4) + 2;   // 2–5 groups
  const emoji = GROUP_EMOJIS[Math.floor(Math.random() * GROUP_EMOJIS.length)];
  return { groupSize, numGroups, emoji };
}

export default function RepeatedAddition() {
  const [prob, setProb] = useState(newProblem);
  const [revealed, setRevealed] = useState(0); // how many groups shown so far
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [score, setScore] = useState(0);

  const { groupSize, numGroups, emoji } = prob;
  const correct = groupSize * numGroups;
  const additionString = Array.from({ length: revealed }, () => groupSize).join(' + ');
  const runningTotal = groupSize * revealed;

  const addGroup = () => {
    if (revealed < numGroups) setRevealed(r => r + 1);
  };

  const check = () => {
    if (!answer) return;
    if (parseInt(answer) === correct) {
      setFeedback('success');
      setScore(s => s + 1);
      setTimeout(() => {
        setProb(newProblem());
        setRevealed(0);
        setAnswer('');
        setFeedback('idle');
      }, 1600);
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

  const reset = () => { setRevealed(0); setAnswer(''); setFeedback('idle'); };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Plus className="w-3 h-3" /> वारंवार बेरीज → गुणाकार
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">गट बेरीज</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-2xl font-black">गुण: {score}</div>
          <button onClick={reset} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
            <RotateCcw className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Problem statement */}
      <div className="mb-6 text-center bg-green-50 dark:bg-green-900/10 rounded-[28px] py-4 px-6 border-2 border-green-200 dark:border-green-800">
        <p className="text-sm font-bold text-slate-500 mb-1">प्रश्न</p>
        <p className="text-xl font-black text-slate-800 dark:text-white">
          {numGroups} गट आहेत, प्रत्येक गटात {groupSize} {emoji} आहेत.
        </p>
        <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-1">
          एकूण किती {emoji}?
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-8">
        {/* Left: Groups visual */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              गट ({revealed}/{numGroups})
            </h3>
            <button onClick={addGroup} disabled={revealed >= numGroups || feedback === 'success'}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-black text-sm hover:bg-green-600 active:scale-95 transition-all disabled:opacity-30">
              + गट जोडा
            </button>
          </div>

          <div className="space-y-3">
            {Array.from({ length: revealed }).map((_, gi) => (
              <div key={gi}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
                <span className="text-[10px] font-black text-slate-400 w-12">गट {gi + 1}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: groupSize }).map((_, ii) => (
                    <span key={ii} className="text-2xl animate-in zoom-in-50 duration-200">{emoji}</span>
                  ))}
                </div>
                <span className="ml-auto text-sm font-black text-green-600 dark:text-green-400">= {groupSize}</span>
              </div>
            ))}
            {Array.from({ length: numGroups - revealed }).map((_, gi) => (
              <div key={gi} className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 opacity-20">
                <span className="text-[10px] font-black text-slate-400 w-12">गट {revealed + gi + 1}</span>
                <div className="flex gap-1.5">
                  {Array.from({ length: groupSize }).map((_, ii) => (
                    <span key={ii} className="text-2xl grayscale">❓</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Running addition */}
          {revealed > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">बेरीज</div>
              <div className="text-lg font-black text-green-400">{additionString} = {runningTotal}</div>
              {revealed === numGroups && (
                <div className="text-sm text-yellow-400 font-black mt-1 animate-pulse">
                  ∴ {numGroups} × {groupSize} = ?
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Answer input */}
        <div className="flex flex-col justify-center space-y-6">
          <div className={cn('text-center py-6 px-8 rounded-[32px] border-4 transition-all',
            feedback === 'success' ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
            feedback === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-bounce' :
            'border-green-300 bg-green-50 dark:bg-slate-800 dark:border-green-800')}>
            <div className="text-4xl font-black text-slate-700 dark:text-white mb-1">
              {numGroups} × {groupSize} =
            </div>
            <div className={cn('text-6xl font-black min-h-[72px]',
              feedback === 'success' ? 'text-emerald-500' :
              feedback === 'error' ? 'text-red-500' :
              answer ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600')}>
              {answer || '?'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map(d => (
              <button key={d}
                onClick={() => d === '✓' ? check() : tapDigit(d)}
                disabled={feedback !== 'idle' || (d === '✓' && !answer)}
                className={cn(
                  'h-14 rounded-2xl font-black text-xl transition-all active:scale-90 disabled:opacity-40',
                  d === '✓' ? 'bg-green-600 text-white' :
                  d === '⌫' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-900/30'
                )}>
                {d}
              </button>
            ))}
          </div>

          {feedback === 'success' && (
            <div className="text-center text-xl font-black text-emerald-500 animate-bounce">
              🎉 शाब्बास! {numGroups} गट × {groupSize} = {correct}
            </div>
          )}
        </div>
      </div>

      {/* Teacher tip */}
      <div className="mt-6 bg-slate-900 text-white rounded-[28px] p-5 flex items-start gap-3">
        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          एक एक गट जोडत जा — प्रत्येक वेळी बेरीज वाढते. शेवटी {numGroups} वेळा {groupSize} जोडले = गुणाकार. <span className="text-white font-bold">वारंवार बेरीज = गुणाकार</span> हा संबंध स्पष्ट होतो.
        </p>
      </div>
    </div>
  );
}
