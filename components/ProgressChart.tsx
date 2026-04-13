'use client';
import { cn } from '@/lib/utils';

const LIT_LABELS  = ['Beginner', 'Letter', 'Word', 'Para', 'Story'];
const NUM_LABELS  = ['Beginner', '1–9', '10–99', '100–999', 'Add', 'Sub', 'Mul', 'Div'];
const LIT_MAX = 4;
const NUM_MAX = 7;

// Chart dimensions
const W = 700;
const H = 260;
const PAD = { top: 24, right: 32, bottom: 56, left: 64 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

type Assessment = {
  id: string;
  term: string;
  date: string | Date;
  literacyLevel: number;
  numeracyLevel: number;
  assessorName: string;
};

function xPos(i: number, total: number) {
  if (total === 1) return INNER_W / 2;
  return (i / (total - 1)) * INNER_W;
}

function yPos(level: number, max: number) {
  return INNER_H - (level / max) * INNER_H;
}

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

function LevelBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest', color)}>
      {label}
    </span>
  );
}

interface Props {
  assessments: Assessment[];
}

export default function ProgressChart({ assessments }: Props) {
  // Chronological order (oldest first)
  const data = [...assessments].reverse();
  const n = data.length;

  if (n === 0) return null;

  // Compute SVG points
  const litPoints = data.map((a, i) => ({
    x: PAD.left + xPos(i, n),
    y: PAD.top + yPos(a.literacyLevel, LIT_MAX),
    level: a.literacyLevel,
    label: LIT_LABELS[a.literacyLevel] ?? String(a.literacyLevel),
  }));
  const numPoints = data.map((a, i) => ({
    x: PAD.left + xPos(i, n),
    y: PAD.top + yPos(a.numeracyLevel, NUM_MAX),
    level: a.numeracyLevel,
    label: NUM_LABELS[a.numeracyLevel] ?? String(a.numeracyLevel),
  }));

  // Grid lines (0–4 for literacy reference, 0–7 for numeracy — show 0,1,2,3,4 as shared grid)
  const gridLevels = [0, 1, 2, 3, 4];

  // Summary stats
  const first = data[0];
  const last  = data[n - 1];
  const litRise = last.literacyLevel - first.literacyLevel;
  const numRise = last.numeracyLevel - first.numeracyLevel;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl p-6 space-y-6">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Progress Journey</h3>
          <p className="text-sm text-slate-400 font-medium">{n} assessment{n !== 1 ? 's' : ''} · {first.term} → {last.term}</p>
        </div>

        {/* Rise badges */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Literacy</span>
            <span className={cn('text-lg font-black', litRise > 0 ? 'text-emerald-500' : litRise < 0 ? 'text-red-500' : 'text-slate-400')}>
              {litRise > 0 ? `+${litRise}` : litRise === 0 ? '—' : litRise}
            </span>
            <LevelBadge label={LIT_LABELS[first.literacyLevel]} color="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" />
            <span className="text-slate-300">→</span>
            <LevelBadge label={LIT_LABELS[last.literacyLevel]} color="bg-orange-500 text-white" />
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Numeracy</span>
            <span className={cn('text-lg font-black', numRise > 0 ? 'text-emerald-500' : numRise < 0 ? 'text-red-500' : 'text-slate-400')}>
              {numRise > 0 ? `+${numRise}` : numRise === 0 ? '—' : numRise}
            </span>
            <LevelBadge label={NUM_LABELS[first.numeracyLevel]} color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" />
            <span className="text-slate-300">→</span>
            <LevelBadge label={NUM_LABELS[last.numeracyLevel]} color="bg-emerald-500 text-white" />
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[400px]" style={{ minHeight: 200 }}>

          {/* Grid lines */}
          {gridLevels.map(lvl => {
            const y = PAD.top + yPos(lvl, LIT_MAX);
            return (
              <g key={lvl}>
                <line x1={PAD.left} y1={y} x2={PAD.left + INNER_W} y2={y}
                  stroke="currentColor" strokeOpacity={0.07} strokeWidth={1} className="text-slate-500" />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize={10}
                  fill="currentColor" className="text-slate-400" opacity={0.5}>
                  {lvl}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text x={12} y={PAD.top + INNER_H / 2} textAnchor="middle" fontSize={9}
            fill="currentColor" className="text-slate-400" opacity={0.5}
            transform={`rotate(-90, 12, ${PAD.top + INNER_H / 2})`}>
            LEVEL
          </text>

          {/* Numeracy line (emerald) */}
          <path d={buildPath(numPoints)} fill="none" stroke="#10b981" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          {/* Gradient fill under numeracy */}
          <defs>
            <linearGradient id="numGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="litGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
          </defs>
          {numPoints.length > 1 && (
            <path
              d={`${buildPath(numPoints)} L ${numPoints[numPoints.length-1].x} ${PAD.top + INNER_H} L ${numPoints[0].x} ${PAD.top + INNER_H} Z`}
              fill="url(#numGrad)" />
          )}

          {/* Literacy line (orange) */}
          <path d={buildPath(litPoints)} fill="none" stroke="#f97316" strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
          {litPoints.length > 1 && (
            <path
              d={`${buildPath(litPoints)} L ${litPoints[litPoints.length-1].x} ${PAD.top + INNER_H} L ${litPoints[0].x} ${PAD.top + INNER_H} Z`}
              fill="url(#litGrad)" />
          )}

          {/* Numeracy dots + labels */}
          {numPoints.map((p, i) => (
            <g key={`num-${i}`}>
              <circle cx={p.x} cy={p.y} r={6} fill="#10b981" stroke="white" strokeWidth={2} />
              {/* Label above dot */}
              <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight="bold">
                {p.label}
              </text>
            </g>
          ))}

          {/* Literacy dots + labels */}
          {litPoints.map((p, i) => (
            <g key={`lit-${i}`}>
              <circle cx={p.x} cy={p.y} r={6} fill="#f97316" stroke="white" strokeWidth={2} />
              <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={9} fill="#f97316" fontWeight="bold">
                {p.label}
              </text>
            </g>
          ))}

          {/* X-axis labels (term + date) */}
          {data.map((a, i) => {
            const x = PAD.left + xPos(i, n);
            const dateStr = new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            return (
              <g key={`xlabel-${i}`}>
                <line x1={x} y1={PAD.top + INNER_H} x2={x} y2={PAD.top + INNER_H + 6}
                  stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} className="text-slate-400" />
                <text x={x} y={PAD.top + INNER_H + 18} textAnchor="middle" fontSize={10}
                  fill="currentColor" className="text-slate-600 dark:text-slate-400" fontWeight="bold">
                  {a.term}
                </text>
                <text x={x} y={PAD.top + INNER_H + 32} textAnchor="middle" fontSize={9}
                  fill="currentColor" opacity={0.4} className="text-slate-400">
                  {dateStr}
                </text>
              </g>
            );
          })}

          {/* Vertical column separators */}
          {data.map((_, i) => {
            const x = PAD.left + xPos(i, n);
            return (
              <line key={`vsep-${i}`} x1={x} y1={PAD.top} x2={x} y2={PAD.top + INNER_H}
                stroke="currentColor" strokeOpacity={0.04} strokeWidth={1} className="text-slate-500" />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 justify-center text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-1.5 rounded-full bg-orange-400" />
          Literacy
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-1.5 rounded-full bg-emerald-500" />
          Numeracy
        </div>
      </div>

      {/* Single-assessment callout */}
      {n === 1 && (
        <p className="text-center text-xs text-slate-400 font-medium italic">
          Only one assessment recorded — the chart will show growth once more assessments are added.
        </p>
      )}
    </div>
  );
}
