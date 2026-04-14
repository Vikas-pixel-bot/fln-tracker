'use client';
import { useState } from 'react';
import { Volume2, RotateCcw, ChevronLeft, Shuffle } from 'lucide-react';
import { speakLetter } from '@/lib/speak';
import { cn } from '@/lib/utils';

const CONSONANTS = [
  'क','ख','ग','घ','ङ',
  'च','छ','ज','झ','ञ',
  'ट','ठ','ड','ढ','ण',
  'त','थ','द','ध','न',
  'प','फ','ब','भ','म',
  'य','र','ल','व',
  'श','ष','स','ह','ळ',
];

const MATRAS = [
  { label: 'अ',  symbol: '',   bg: 'bg-slate-100 dark:bg-slate-700',   text: 'text-slate-700 dark:text-slate-200',   ring: 'ring-slate-400' },
  { label: 'आ',  symbol: 'ा',  bg: 'bg-red-50 dark:bg-red-900/30',     text: 'text-red-700 dark:text-red-300',       ring: 'ring-red-400' },
  { label: 'इ',  symbol: 'ि',  bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', ring: 'ring-orange-400' },
  { label: 'ई',  symbol: 'ी',  bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300',   ring: 'ring-amber-400' },
  { label: 'उ',  symbol: 'ु',  bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', ring: 'ring-yellow-400' },
  { label: 'ऊ',  symbol: 'ू',  bg: 'bg-lime-50 dark:bg-lime-900/30',   text: 'text-lime-700 dark:text-lime-300',     ring: 'ring-lime-500' },
  { label: 'ए',  symbol: 'े',  bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-400' },
  { label: 'ऐ',  symbol: 'ै',  bg: 'bg-teal-50 dark:bg-teal-900/30',   text: 'text-teal-700 dark:text-teal-300',     ring: 'ring-teal-400' },
  { label: 'ओ',  symbol: 'ो',  bg: 'bg-cyan-50 dark:bg-cyan-900/30',   text: 'text-cyan-700 dark:text-cyan-300',     ring: 'ring-cyan-400' },
  { label: 'औ',  symbol: 'ौ',  bg: 'bg-blue-50 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-300',     ring: 'ring-blue-400' },
  { label: 'अं', symbol: 'ं',  bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', ring: 'ring-violet-400' },
  { label: 'अः', symbol: 'ः',  bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', ring: 'ring-purple-400' },
];

function getSyllable(consonant: string, symbol: string) {
  return consonant + symbol;
}

// ── Grid View ─────────────────────────────────────────────────────────────────
function GridView({ onSelectRow }: { onSelectRow: (c: string) => void }) {
  const [speaking, setSpeaking] = useState<string | null>(null);

  function tap(syllable: string) {
    setSpeaking(syllable);
    speakLetter(syllable, () => setSpeaking(null));
  }

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="text-center border-collapse min-w-max mx-auto">
        <thead>
          <tr>
            <th className="px-2 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest w-10">व्यंजन</th>
            {MATRAS.map(m => (
              <th key={m.label} className={cn('px-1 py-1 text-xs font-black w-10', m.text)}>
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONSONANTS.map(con => (
            <tr key={con} className="group">
              <td>
                <button
                  onClick={() => onSelectRow(con)}
                  className="w-9 h-9 rounded-lg bg-[#E8232A] text-white font-black text-base hover:bg-[#c41e24] active:scale-95 transition-all shadow-sm"
                >
                  {con}
                </button>
              </td>
              {MATRAS.map(m => {
                const syl = getSyllable(con, m.symbol);
                const isActive = speaking === syl;
                return (
                  <td key={m.label} className="p-0.5">
                    <button
                      onClick={() => tap(syl)}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-bold transition-all active:scale-90',
                        m.bg, m.text,
                        isActive && `ring-2 ${m.ring} scale-110 shadow-md`,
                        !isActive && 'hover:brightness-95'
                      )}
                    >
                      {syl}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Row Practice View ─────────────────────────────────────────────────────────
function RowPractice({ consonant, onBack }: { consonant: string; onBack: () => void }) {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function tap(syllable: string, idx: number) {
    if (quizMode && !revealed.has(idx)) {
      setRevealed(prev => new Set([...prev, idx]));
    }
    setSpeaking(syllable);
    speakLetter(syllable, () => setSpeaking(null));
  }

  function toggleQuiz() {
    setQuizMode(q => !q);
    setRevealed(new Set());
  }

  return (
    <div className="space-y-4">
      {/* Row header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-5xl font-black text-[#E8232A]">{consonant}</span>
        </div>
        <button
          onClick={toggleQuiz}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all',
            quizMode
              ? 'bg-[#E8232A] text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          )}
        >
          <Shuffle className="w-3.5 h-3.5" />
          {quizMode ? 'Quiz ON' : 'Quiz'}
        </button>
      </div>

      {quizMode && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Tap a card to reveal the syllable and hear it pronounced
        </p>
      )}

      {/* Matra cards grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {MATRAS.map((m, idx) => {
          const syl = getSyllable(consonant, m.symbol);
          const isActive = speaking === syl;
          const isHidden = quizMode && !revealed.has(idx);

          return (
            <button
              key={m.label}
              onClick={() => tap(syl, idx)}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl p-4 min-h-[96px] transition-all active:scale-95 border-2',
                m.bg,
                isActive ? `border-current ${m.ring} shadow-lg scale-105` : 'border-transparent hover:border-current',
                m.text
              )}
            >
              <span className={cn(
                'text-4xl font-black leading-none mb-2 transition-all duration-300',
                isHidden && 'blur-sm opacity-40'
              )}>
                {syl}
              </span>
              <span className="text-[11px] font-bold opacity-80">{m.label}</span>
              {isActive && <Volume2 className="w-3.5 h-3.5 mt-1 opacity-60 animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* Speak all button */}
      <button
        onClick={() => {
          const syllables = MATRAS.map(m => getSyllable(consonant, m.symbol));
          let i = 0;
          function next() {
            if (i >= syllables.length) return;
            const syl = syllables[i++];
            setSpeaking(syl);
            speakLetter(syl, () => { setSpeaking(null); setTimeout(next, 400); });
          }
          next();
        }}
        className="w-full py-3 flex items-center justify-center gap-2 bg-[#E8232A] hover:bg-[#c41e24] text-white font-black rounded-2xl transition-all active:scale-95 shadow-md"
      >
        <Volume2 className="w-4 h-4" />
        सर्व ऐका — Listen to all {consonant} matras
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Chaudakhadi() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/40 text-[#E8232A] rounded-full text-[10px] font-black uppercase tracking-widest">
            चौदाखडी — TaRL TLM
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {selectedRow ? `${selectedRow} — मात्रा सराव` : 'Marathi Syllable Chart'}
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            {selectedRow
              ? 'Tap any card to hear the syllable. Use Quiz mode to hide and reveal.'
              : 'Tap any syllable to hear it. Tap a red consonant button to practice that row.'}
          </p>
        </div>
        {selectedRow && (
          <button
            onClick={() => setSelectedRow(null)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {selectedRow ? (
        <RowPractice consonant={selectedRow} onBack={() => setSelectedRow(null)} />
      ) : (
        <>
          <GridView onSelectRow={setSelectedRow} />
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
            35 व्यंजन × 12 मात्रा — {35 * 12} syllables total
          </p>
        </>
      )}
    </div>
  );
}
