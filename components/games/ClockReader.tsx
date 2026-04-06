"use client";
import { useState } from 'react';

function makeRound() {
  // Only use o'clock and half-past for accessibility
  const hours = Math.floor(Math.random() * 12) + 1;
  const isHalf = Math.random() > 0.5;
  const minutes = isHalf ? 30 : 0;
  const label = isHalf ? `${hours}:30` : `${hours}:00`;
  const display = isHalf ? `Half past ${hours}` : `${hours} o'clock`;

  // Wrong options
  const wrongHour1 = hours === 12 ? 1 : hours + 1;
  const wrongHour2 = hours === 1 ? 12 : hours - 1;
  const wrong1 = isHalf ? `${wrongHour1}:30` : `${wrongHour1}:00`;
  const wrong2 = isHalf ? `${wrongHour2}:30` : `${wrongHour2}:00`;
  const wrong3 = isHalf ? `${hours}:00` : `${hours}:30`;

  const options = [label, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
  return { hours, minutes, label, display, options };
}

function ClockFace({ hours, minutes }: { hours: number; minutes: number }) {
  const cx = 80, cy = 80, r = 70;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30 - 90;
  const minAngle = (minutes / 60) * 360 - 90;

  const toXY = (angle: number, len: number) => ({
    x: cx + len * Math.cos((angle * Math.PI) / 180),
    y: cy + len * Math.sin((angle * Math.PI) / 180),
  });

  const hourEnd = toXY(hourAngle, 38);
  const minEnd = toXY(minAngle, 55);

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#e2e8f0" strokeWidth="3" />
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360 - 90;
        const outer = toXY(angle, 65);
        const inner = toXY(angle, 57);
        return <line key={i} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="#94a3b8" strokeWidth="2" />;
      })}
      {/* Numbers */}
      {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
        const angle = (i / 12) * 360 - 90;
        const pos = toXY(angle, 50);
        return <text key={n} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="bold" fill="#475569">{n}</text>;
      })}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y} stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minEnd.x} y2={minEnd.y} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="4" fill="#1e293b" />
    </svg>
  );
}

export default function ClockReader() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function pick(label: string) {
    if (feedback) return;
    setChosen(label);
    const correct = label === round.label;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(makeRound());
      setFeedback(null);
      setChosen(null);
    }, 1300);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">Score: {score}/{total}</span>
        <span className="text-2xl">🕐</span>
      </div>

      <p className="text-center font-bold text-slate-700">What time does the clock show?</p>

      <div className="flex justify-center">
        <div className="rounded-full shadow-xl border-4 border-slate-200 p-1">
          <ClockFace hours={round.hours} minutes={round.minutes} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map(label => {
          let cls = 'border-2 border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold';
          if (chosen === label) {
            cls = feedback === 'correct'
              ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105 font-bold'
              : 'border-2 border-red-400 bg-red-100 text-red-700 font-bold';
          } else if (feedback === 'wrong' && label === round.label) {
            cls = 'border-2 border-green-400 bg-green-100 text-green-700 font-bold';
          }
          return (
            <button key={label} onClick={() => pick(label)}
              className={`rounded-2xl py-4 text-lg transition-all duration-200 ${cls}`}>
              {label}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct' ? `🕐 Yes! It's ${round.display}!` : `❌ It was ${round.display}`}
        </div>
      )}
    </div>
  );
}
