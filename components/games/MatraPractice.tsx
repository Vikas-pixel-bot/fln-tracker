"use client";
import { useState, useMemo } from 'react';

const MATRA_META = [
  { symbol: 'ा', name: 'आ-मात्रा', vowel: 'आ', color: 'rose' },
  { symbol: 'ि', name: 'इ-मात्रा', vowel: 'इ', color: 'sky' },
  { symbol: 'ी', name: 'ई-मात्रा', vowel: 'ई', color: 'violet' },
  { symbol: 'ु', name: 'उ-मात्रा', vowel: 'उ', color: 'amber' },
  { symbol: 'ू', name: 'ऊ-मात्रा', vowel: 'ऊ', color: 'emerald' },
];

type Round = {
  word: string;
  highlight: string; // syllable containing the target matra
  matra: string;     // the matra character
  image: string;
  meaning: string;
};

const ALL_ROUNDS: Round[] = [
  // ा — आ-मात्रा
  { word: 'नाव',    highlight: 'ना', matra: 'ा', image: '⛵', meaning: 'पाण्यावर चालते' },
  { word: 'वाघ',    highlight: 'वा', matra: 'ा', image: '🐯', meaning: 'जंगलाचा राजा' },
  { word: 'गाय',    highlight: 'गा', matra: 'ा', image: '🐄', meaning: 'दूध देते' },
  { word: 'साप',    highlight: 'सा', matra: 'ा', image: '🐍', meaning: 'सरपटत जाते' },
  { word: 'बाग',    highlight: 'बा', matra: 'ा', image: '🌻', meaning: 'फुलांचे ठिकाण' },
  { word: 'काम',    highlight: 'का', matra: 'ा', image: '🔨', meaning: 'मेहनत करणे' },
  { word: 'आम',     highlight: 'आम', matra: 'ा', image: '🥭', meaning: 'गोड फळ' },
  // ि — इ-मात्रा
  { word: 'दिवस',   highlight: 'दि', matra: 'ि', image: '☀️', meaning: 'सूर्य उगवतो तेव्हा' },
  { word: 'किडा',   highlight: 'कि', matra: 'ि', image: '🐛', meaning: 'जमिनीत राहतो' },
  { word: 'विमान',  highlight: 'वि', matra: 'ि', image: '✈️', meaning: 'आकाशात उडते' },
  { word: 'मिठी',   highlight: 'मि', matra: 'ि', image: '🤗', meaning: 'जवळ घेणे' },
  { word: 'खिडकी',  highlight: 'खि', matra: 'ि', image: '🪟', meaning: 'घरात हवा येते' },
  { word: 'तिळ',    highlight: 'ति', matra: 'ि', image: '🌱', meaning: 'लहान काळे बीज' },
  { word: 'चित्र',  highlight: 'चि', matra: 'ि', image: '🖼️', meaning: 'रेखाटन किंवा फोटो' },
  // ी — ई-मात्रा
  { word: 'नदी',    highlight: 'दी', matra: 'ी', image: '🏞️', meaning: 'पाण्याचा प्रवाह' },
  { word: 'दही',    highlight: 'ही', matra: 'ी', image: '🥣', meaning: 'दुधापासून बनते' },
  { word: 'गाडी',   highlight: 'डी', matra: 'ी', image: '🚗', meaning: 'रस्त्यावर धावते' },
  { word: 'पाणी',   highlight: 'णी', matra: 'ी', image: '💧', meaning: 'पिण्यासाठी लागते' },
  { word: 'माती',   highlight: 'ती', matra: 'ी', image: '🟫', meaning: 'जमिनीतील माती' },
  { word: 'भाजी',   highlight: 'जी', matra: 'ी', image: '🥦', meaning: 'जेवणात खातो' },
  { word: 'राणी',   highlight: 'णी', matra: 'ी', image: '👑', meaning: 'राजाची पत्नी' },
  // ु — उ-मात्रा
  { word: 'कुत्रा',  highlight: 'कु', matra: 'ु', image: '🐕', meaning: 'घरचा प्राणी' },
  { word: 'मुलगा',  highlight: 'मु', matra: 'ु', image: '👦', meaning: 'लहान मुलगा' },
  { word: 'गुण',    highlight: 'गु', matra: 'ु', image: '⭐', meaning: 'परीक्षेत मिळतात' },
  { word: 'खुर्ची',  highlight: 'खु', matra: 'ु', image: '🪑', meaning: 'बसण्यासाठी' },
  { word: 'तुळस',   highlight: 'तु', matra: 'ु', image: '🌿', meaning: 'पवित्र वनस्पती' },
  { word: 'गुलाब',  highlight: 'गु', matra: 'ु', image: '🌹', meaning: 'सुंदर फूल' },
  // ू — ऊ-मात्रा
  { word: 'फूल',    highlight: 'फू', matra: 'ू', image: '🌸', meaning: 'बागेत उगवते' },
  { word: 'दूध',    highlight: 'दू', matra: 'ू', image: '🥛', meaning: 'पांढरे पेय' },
  { word: 'मूल',    highlight: 'मू', matra: 'ू', image: '👶', meaning: 'लहान बाळ' },
  { word: 'भूक',    highlight: 'भू', matra: 'ू', image: '😋', meaning: 'खाण्याची इच्छा' },
  { word: 'सूर',    highlight: 'सू', matra: 'ू', image: '🎵', meaning: 'संगीतातील सूर' },
  { word: 'मूग',    highlight: 'मू', matra: 'ू', image: '🫘', meaning: 'हिरवी डाळ' },
];

const FILTER_OPTIONS = [
  { label: 'सर्व', value: 'all' },
  { label: 'ा (आ)', value: 'ा' },
  { label: 'ि (इ)', value: 'ि' },
  { label: 'ी (ई)', value: 'ी' },
  { label: 'ु (उ)', value: 'ु' },
  { label: 'ू (ऊ)', value: 'ू' },
];

// Colour classes per matra
const MATRA_COLORS: Record<string, { bg: string; text: string; ring: string; light: string }> = {
  'ा': { bg: 'bg-rose-500',   text: 'text-rose-700',   ring: 'ring-rose-300',   light: 'bg-rose-50 border-rose-200' },
  'ि': { bg: 'bg-sky-500',    text: 'text-sky-700',    ring: 'ring-sky-300',    light: 'bg-sky-50 border-sky-200' },
  'ी': { bg: 'bg-violet-500', text: 'text-violet-700', ring: 'ring-violet-300', light: 'bg-violet-50 border-violet-200' },
  'ु': { bg: 'bg-amber-500',  text: 'text-amber-700',  ring: 'ring-amber-300',  light: 'bg-amber-50 border-amber-200' },
  'ू': { bg: 'bg-emerald-500',text: 'text-emerald-700',ring: 'ring-emerald-300',light: 'bg-emerald-50 border-emerald-200' },
};

function WordDisplay({ word, highlight }: { word: string; highlight: string }) {
  const idx = word.indexOf(highlight);
  if (idx === -1) return <span className="text-slate-800">{word}</span>;
  return (
    <>
      <span className="text-slate-800">{word.slice(0, idx)}</span>
      <span className="text-orange-500 underline decoration-wavy decoration-orange-400 underline-offset-4 font-black">
        {highlight}
      </span>
      <span className="text-slate-800">{word.slice(idx + highlight.length)}</span>
    </>
  );
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(correct: string): string[] {
  const others = MATRA_META.map(m => m.symbol).filter(s => s !== correct);
  return shuffle([correct, ...shuffle(others).slice(0, 3)]);
}

export default function MatraPractice() {
  const [filter, setFilter] = useState<string>('all');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [idx, setIdx] = useState(0);

  const filteredRounds = useMemo(() => {
    const pool = filter === 'all' ? ALL_ROUNDS : ALL_ROUNDS.filter(r => r.matra === filter);
    return shuffle(pool);
  }, [filter]);

  const round = filteredRounds[idx % filteredRounds.length];
  const options = useMemo(() => buildOptions(round.matra), [round]);
  const matraMeta = MATRA_META.find(m => m.symbol === round.matra)!;
  const colors = MATRA_COLORS[round.matra];

  function pick(matra: string) {
    if (feedback) return;
    setChosen(matra);
    const correct = matra === round.matra;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setIdx(i => i + 1);
      setFeedback(null);
      setChosen(null);
    }, 1400);
  }

  const matraName = (sym: string) => MATRA_META.find(m => m.symbol === sym)?.name ?? sym;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-orange-100 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          गुण: {score}/{total}
        </span>
        <span className="text-2xl">✍️</span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(f => (
          <button key={f.value}
            onClick={() => { setFilter(f.value); setIdx(0); setFeedback(null); setChosen(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border ${
              filter === f.value
                ? 'bg-orange-500 text-white border-orange-500 shadow'
                : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Word card */}
      <div className={`rounded-3xl p-6 border-2 ${colors.light} text-center space-y-3`}>
        <div className="text-6xl">{round.image}</div>
        <div className="text-5xl font-extrabold tracking-widest leading-tight">
          <WordDisplay word={round.word} highlight={round.highlight} />
        </div>
        <p className="text-slate-400 text-sm italic">{round.meaning}</p>
      </div>

      {/* Instruction */}
      <p className="text-center text-slate-500 text-sm font-semibold">
        ठळक अक्षरात कोणती मात्रा आहे?
      </p>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(sym => {
          const meta = MATRA_META.find(m => m.symbol === sym)!;
          const optColors = MATRA_COLORS[sym];
          let cls = `${optColors.light} ${optColors.text} border-2`;
          if (chosen === sym) {
            cls = feedback === 'correct'
              ? 'bg-green-100 border-2 border-green-400 text-green-700 scale-105'
              : 'bg-red-100 border-2 border-red-400 text-red-700';
          } else if (feedback === 'wrong' && sym === round.matra) {
            cls = 'bg-green-100 border-2 border-green-400 text-green-700';
          }
          return (
            <button key={sym} onClick={() => pick(sym)}
              className={`rounded-2xl py-4 transition-all duration-200 active:scale-95 ${cls}`}>
              <div className="text-2xl font-extrabold leading-none">{sym}</div>
              <div className="text-xs font-bold mt-1 opacity-80">{meta.name}</div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-lg font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
          {feedback === 'correct'
            ? `🌟 शाब्बास! "${round.word}" मध्ये ${matraMeta.name} आहे!`
            : `❌ उत्तर: "${round.highlight}" → ${matraMeta.name}`}
        </div>
      )}

      {/* Matra reference strip */}
      <div className="flex justify-center gap-3 pt-1 flex-wrap">
        {MATRA_META.map(m => (
          <div key={m.symbol} className={`flex flex-col items-center px-2 py-1 rounded-xl ${MATRA_COLORS[m.symbol].light} border`}>
            <span className={`text-lg font-extrabold ${MATRA_COLORS[m.symbol].text}`}>{m.symbol}</span>
            <span className="text-[9px] font-bold text-slate-400">{m.vowel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
