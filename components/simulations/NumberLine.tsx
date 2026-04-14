'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { speakLetter } from '@/lib/speak';
import { cn } from '@/lib/utils';

type Range = '0-10' | '0-20' | '0-100';

const RANGE_CONFIG: Record<Range, { max: number; step: number; jumpBig: number }> = {
  '0-10':  { max: 10,  step: 1, jumpBig: 5 },
  '0-20':  { max: 20,  step: 1, jumpBig: 5 },
  '0-100': { max: 100, step: 10, jumpBig: 10 },
};

// Colors for hop arcs in addition mode
const HOP_COLORS = ['#E8232A', '#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

function speak(n: number) {
  speakLetter(n.toString());
}

// ── Number Line SVG ───────────────────────────────────────────────────────────
function NumberLineSVG({
  range,
  current,
  hops,
  onTap,
}: {
  range: Range;
  current: number;
  hops: { from: number; to: number; color: string }[];
  onTap: (n: number) => void;
}) {
  const { max, step } = RANGE_CONFIG[range];
  const numbers = Array.from({ length: max / step + 1 }, (_, i) => i * step);
  const PAD = 24;
  const W = Math.max(numbers.length * 52, 320);
  const H = 120;
  const Y_LINE = 70;
  const RADIUS = 16;

  function xOf(n: number) {
    return PAD + (n / max) * (W - PAD * 2);
  }

  return (
    <div className="overflow-x-auto w-full -mx-2 px-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="block mx-auto"
        style={{ minWidth: `${W}px` }}
      >
        {/* Base line */}
        <line x1={PAD} y1={Y_LINE} x2={W - PAD} y2={Y_LINE}
          stroke="#CBD5E1" strokeWidth={3} strokeLinecap="round" />

        {/* Hop arcs */}
        {hops.map((hop, i) => {
          const x1 = xOf(hop.from);
          const x2 = xOf(hop.to);
          const mx = (x1 + x2) / 2;
          const arcH = Math.abs(x2 - x1) * 0.55;
          const dy = Y_LINE - arcH;
          return (
            <path
              key={i}
              d={`M${x1},${Y_LINE} Q${mx},${dy} ${x2},${Y_LINE}`}
              fill="none"
              stroke={hop.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="5 3"
              opacity={0.75}
            />
          );
        })}

        {/* Number ticks */}
        {numbers.map(n => {
          const x = xOf(n);
          const isCurrent = n === current;
          return (
            <g key={n} onClick={() => onTap(n)} style={{ cursor: 'pointer' }}>
              {/* Tick mark */}
              <line x1={x} y1={Y_LINE - 6} x2={x} y2={Y_LINE + 6}
                stroke="#94A3B8" strokeWidth={1.5} />
              {/* Circle (only for current or small ranges) */}
              {(isCurrent || range !== '0-100') && (
                <circle
                  cx={x} cy={Y_LINE}
                  r={isCurrent ? RADIUS : 10}
                  fill={isCurrent ? '#E8232A' : '#F1F5F9'}
                  stroke={isCurrent ? '#c41e24' : '#CBD5E1'}
                  strokeWidth={isCurrent ? 3 : 1.5}
                  className="transition-all"
                />
              )}
              {/* Number label */}
              <text
                x={x}
                y={isCurrent ? Y_LINE + 5 : Y_LINE + (range === '0-100' ? 18 : 4)}
                textAnchor="middle"
                fontSize={isCurrent ? 14 : range === '0-100' ? 11 : 10}
                fontWeight={isCurrent ? 'bold' : '600'}
                fill={isCurrent ? 'white' : '#475569'}
              >
                {n}
              </text>
            </g>
          );
        })}

        {/* Current position big pulse ring */}
        {(() => {
          const x = xOf(current);
          return (
            <circle cx={x} cy={Y_LINE} r={RADIUS + 6}
              fill="none" stroke="#E8232A" strokeWidth={2} opacity={0.25} />
          );
        })()}
      </svg>
    </div>
  );
}

// ── Addition Mode ─────────────────────────────────────────────────────────────
function AdditionMode({ range }: { range: Range }) {
  const { max, step } = RANGE_CONFIG[range];
  const [start, setStart] = useState(0);
  const [addend, setAddend] = useState(0);
  const [show, setShow] = useState(false);

  const result = Math.min(start + addend, max);
  const hops: { from: number; to: number; color: string }[] = [];
  if (show && addend > 0) {
    const hopSize = step;
    const hopsCount = Math.min(Math.round(addend / step), 10);
    for (let i = 0; i < hopsCount; i++) {
      hops.push({
        from: Math.min(start + i * hopSize, max),
        to:   Math.min(start + (i + 1) * hopSize, max),
        color: HOP_COLORS[i % HOP_COLORS.length],
      });
    }
  }

  return (
    <div className="space-y-4">
      <NumberLineSVG range={range} current={show ? result : start} hops={hops} onTap={() => {}} />

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Start */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Start</span>
          <div className="flex items-center gap-1">
            <button onClick={() => { setStart(s => Math.max(0, s - step)); setShow(false); }}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
              <Minus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="w-12 text-center text-3xl font-black text-slate-900 dark:text-white">{start}</span>
            <button onClick={() => { setStart(s => Math.min(max - step, s + step)); setShow(false); }}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
              <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        <span className="text-2xl font-black text-[#E8232A]">+</span>

        {/* Addend */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Add</span>
          <div className="flex items-center gap-1">
            <button onClick={() => { setAddend(a => Math.max(0, a - step)); setShow(false); }}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
              <Minus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="w-12 text-center text-3xl font-black text-slate-900 dark:text-white">{addend}</span>
            <button onClick={() => { setAddend(a => Math.min(max - start, a + step)); setShow(false); }}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all">
              <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        <span className="text-2xl font-black text-slate-400">=</span>

        {/* Result */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Result</span>
          <div className={cn(
            'w-16 h-12 rounded-2xl flex items-center justify-center text-3xl font-black transition-all',
            show ? 'bg-[#E8232A] text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-transparent'
          )}>
            {result}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { setShow(true); speak(result); }}
          className="flex items-center gap-2 px-6 py-3 bg-[#E8232A] hover:bg-[#c41e24] text-white font-black rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          Show Answer
        </button>
        <button
          onClick={() => { setStart(0); setAddend(0); setShow(false); }}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {show && (
        <p className="text-center text-sm font-black text-slate-700 dark:text-slate-200">
          {start} + {addend} = <span className="text-[#E8232A]">{result}</span>
          &nbsp;— {hops.length} hop{hops.length !== 1 ? 's' : ''} of {step}
        </p>
      )}
    </div>
  );
}

// ── Count Mode ────────────────────────────────────────────────────────────────
function CountMode({ range }: { range: Range }) {
  const { max, step, jumpBig } = RANGE_CONFIG[range];
  const [current, setCurrent] = useState(0);

  function moveTo(n: number) {
    const clamped = Math.max(0, Math.min(max, n));
    setCurrent(clamped);
    speak(clamped);
  }

  return (
    <div className="space-y-4">
      <NumberLineSVG range={range} current={current} hops={[]} onTap={moveTo} />

      {/* Current number big display */}
      <div className="text-center">
        <button
          onClick={() => speak(current)}
          className="inline-flex flex-col items-center gap-1 group"
        >
          <span className="text-7xl font-black text-[#E8232A] tabular-nums leading-none">
            {current}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium group-hover:text-[#E8232A] transition-colors">
            <Volume2 className="w-3 h-3" /> tap to hear
          </span>
        </button>
      </div>

      {/* Jump controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {jumpBig > step && (
          <button onClick={() => moveTo(current - jumpBig)}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-sm active:scale-90 transition-all hover:bg-slate-200">
            −{jumpBig}
          </button>
        )}
        <button onClick={() => moveTo(current - step)}
          className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-all hover:bg-slate-200">
          <Minus className="w-6 h-6 text-slate-700 dark:text-slate-200" />
        </button>
        <button
          onClick={() => { setCurrent(0); speak(0); }}
          className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-black text-xs active:scale-90 transition-all">
          Reset
        </button>
        <button onClick={() => moveTo(current + step)}
          className="w-14 h-14 rounded-2xl bg-[#E8232A] flex items-center justify-center active:scale-90 transition-all hover:bg-[#c41e24] shadow-md">
          <Plus className="w-6 h-6 text-white" />
        </button>
        {jumpBig > step && (
          <button onClick={() => moveTo(current + jumpBig)}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-sm active:scale-90 transition-all hover:bg-slate-200">
            +{jumpBig}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 font-medium">
        Tap any number on the line to jump there directly
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function NumberLine() {
  const [range, setRange] = useState<Range>('0-10');
  const [mode, setMode] = useState<'count' | 'add'>('count');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="space-y-1 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            संख्यारेखा — Digital Manipulative
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Number Line</h2>
          <p className="text-slate-500 text-xs font-medium">
            {mode === 'count'
              ? 'Count forward and backward. Tap any number to jump.'
              : 'Visualise addition as hops on the number line.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
          {(['count', 'add'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn(
                'px-4 py-2 text-xs font-black transition-all',
                mode === m
                  ? 'bg-[#E8232A] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700'
              )}>
              {m === 'count' ? 'Count' : 'Add'}
            </button>
          ))}
        </div>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {(['0-10', '0-20', '0-100'] as Range[]).map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-black transition-all',
              range === r
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700'
            )}>
            {r}
          </button>
        ))}
      </div>

      {mode === 'count'
        ? <CountMode key={range} range={range} />
        : <AdditionMode key={range} range={range} />
      }
    </div>
  );
}
