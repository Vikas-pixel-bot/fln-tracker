'use client';
import { useState } from 'react';
import {
  Trophy, Star, RotateCcw, Lock, ChevronRight,
  BookOpen, Zap, CheckCircle2, Volume2, MapPin,
} from 'lucide-react';
import { speakLetter } from '@/lib/speak';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
type WC = 'violet' | 'blue' | 'emerald' | 'amber';
type Phase = 'map' | 'play' | 'world-complete' | 'final';

interface Challenge {
  q: string;
  emoji?: string;
  options: string[];
  answer: string;
  passage?: string; // shown above question (for reading comprehension)
  reward: number;
}

interface World {
  id: string;
  name: string;
  marathiName: string;
  subtitle: string;
  emoji: string;
  color: WC;
  unlockAt: number;   // pearls needed
  aserLevel: string;
  challenges: Challenge[];
}

// ── Content ───────────────────────────────────────────────────────────────────
const WORLDS: World[] = [
  {
    id: 'akshar',
    name: 'Akshar Gaav',
    marathiName: 'अक्षर गाव',
    subtitle: 'Letter Village',
    emoji: '🏡',
    color: 'violet',
    unlockAt: 0,
    aserLevel: 'ASER Level 0–1 · Beginner & Letter',
    challenges: [
      { q: '"आंबा" चे पहिले अक्षर कोणते?',    emoji: '🥭', options: ['आ', 'म', 'ब', 'न'],   answer: 'आ',  reward: 2 },
      { q: '"गाय" चे पहिले अक्षर कोणते?',      emoji: '🐄', options: ['य', 'ग', 'आ', 'क'],   answer: 'ग',  reward: 2 },
      { q: '"पाणी" चे पहिले अक्षर कोणते?',     emoji: '💧', options: ['न', 'प', 'ण', 'ी'],   answer: 'प',  reward: 2 },
      { q: '"झाड" चे पहिले अक्षर कोणते?',      emoji: '🌳', options: ['ड', 'ा', 'झ', 'म'],   answer: 'झ',  reward: 2 },
      { q: '"क" या अक्षराने कोणता शब्द सुरू होतो?', options: ['बदक', 'कमळ', 'सूर्य', 'दिवा'], answer: 'कमळ', reward: 3 },
      { q: '"स" या अक्षराने कोणता शब्द सुरू होतो?', options: ['आंबा', 'केळे', 'सफरचंद', 'फूल'], answer: 'सफरचंद', reward: 3 },
    ],
  },
  {
    id: 'shabd',
    name: 'Shabd Baag',
    marathiName: 'शब्द बाग',
    subtitle: 'Word Garden',
    emoji: '🌸',
    color: 'blue',
    unlockAt: 8,
    aserLevel: 'ASER Level 2 · Word',
    challenges: [
      { q: 'या प्राण्याला मराठीत काय म्हणतात?',                  emoji: '🐘', options: ['हत्ती', 'सिंह', 'वाघ', 'गाढव'],     answer: 'हत्ती', reward: 2 },
      { q: 'या फुलाला मराठीत काय म्हणतात?',                      emoji: '🌹', options: ['कमळ', 'गुलाब', 'झेंडू', 'जास्वंद'],  answer: 'गुलाब', reward: 2 },
      { q: '"ा" मात्रा असलेला शब्द कोणता?',                       options: ['किती', 'शाळा', 'गुरु', 'दिवस'],           answer: 'शाळा',  reward: 3 },
      { q: '"ी" मात्रा असलेला शब्द कोणता?',                       options: ['सूर', 'बाग', 'नदी', 'चंद्र'],             answer: 'नदी',   reward: 3 },
      { q: '"मोठा" चा उलट शब्द कोणता?',                          options: ['लहान', 'चांगला', 'काळा', 'उंच'],          answer: 'लहान',  reward: 3 },
      { q: '"दिवस" चा उलट शब्द कोणता?',                          options: ['सूर्य', 'रात्र', 'संध्याकाळ', 'पहाट'],   answer: 'रात्र', reward: 3 },
    ],
  },
  {
    id: 'vakya',
    name: 'Vakya Killa',
    marathiName: 'वाक्य किल्ला',
    subtitle: 'Sentence Fort',
    emoji: '🏰',
    color: 'emerald',
    unlockAt: 20,
    aserLevel: 'ASER Level 3 · Paragraph',
    challenges: [
      {
        passage: 'राम आणि सीता शाळेत जातात. ते अभ्यास करतात. त्यांची शिक्षिका सुलभा बाई आहेत. सुलभा बाई त्यांना गोष्टी सांगतात.',
        q: 'राम आणि सीता कुठे जातात?',
        options: ['शाळेत', 'बाजारात', 'शेतात', 'नदीत'],
        answer: 'शाळेत', reward: 3,
      },
      {
        passage: 'राम आणि सीता शाळेत जातात. ते अभ्यास करतात. त्यांची शिक्षिका सुलभा बाई आहेत. सुलभा बाई त्यांना गोष्टी सांगतात.',
        q: 'त्यांच्या शिक्षिकेचे नाव काय आहे?',
        options: ['सुलभा बाई', 'माया बाई', 'राधा बाई', 'गीता बाई'],
        answer: 'सुलभा बाई', reward: 3,
      },
      {
        passage: 'राम आणि सीता शाळेत जातात. ते अभ्यास करतात. त्यांची शिक्षिका सुलभा बाई आहेत. सुलभा बाई त्यांना गोष्टी सांगतात.',
        q: 'सुलभा बाई काय करतात?',
        options: ['गोष्टी सांगतात', 'जेवण देतात', 'खेळतात', 'गाणी म्हणतात'],
        answer: 'गोष्टी सांगतात', reward: 3,
      },
      { q: '"सूर्य पूर्वेला ___." — रिकाम्या जागी काय येईल?', options: ['उगवतो', 'मावळतो', 'फिरतो', 'झोपतो'], answer: 'उगवतो', reward: 3 },
      { q: '"झाडाला ___ येतात." — रिकाम्या जागी काय येईल?',  options: ['पाने', 'दगड', 'पाणी', 'आग'],       answer: 'पाने',    reward: 3 },
      { q: '"पाऊस ___ पडतो." — रिकाम्या जागी काय येईल?',    options: ['आकाशातून', 'जमिनीतून', 'झाडातून', 'पाण्यातून'], answer: 'आकाशातून', reward: 3 },
    ],
  },
  {
    id: 'katha',
    name: 'Katha Mahal',
    marathiName: 'कथा महाल',
    subtitle: 'Story Palace',
    emoji: '🏯',
    color: 'amber',
    unlockAt: 36,
    aserLevel: 'ASER Level 4 · Story',
    challenges: [
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'मुलीचे नाव काय होते?',
        options: ['मीना', 'सीता', 'राधा', 'गीता'],
        answer: 'मीना', reward: 4,
      },
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'मीना रोज कुठे जायची?',
        options: ['शाळेत', 'बाजारात', 'शेतात', 'मंदिरात'],
        answer: 'शाळेत', reward: 4,
      },
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'परीक्षेत मीनाला किती नंबर आला?',
        options: ['पहिला', 'दुसरा', 'तिसरा', 'चौथा'],
        answer: 'पहिला', reward: 4,
      },
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'आईने मीनाला काय दिले?',
        options: ['आंबा', 'केळे', 'पुस्तक', 'पेन्सिल'],
        answer: 'आंबा', reward: 4,
      },
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'या गोष्टीत मुख्य पात्र कोण आहे?',
        options: ['मीना', 'आई', 'शिक्षक', 'मित्र'],
        answer: 'मीना', reward: 4,
      },
      {
        passage: 'एक छोटी मुलगी होती. तिचे नाव मीना होते. मीना रोज शाळेत जायची. ती खूप अभ्यास करायची. एके दिवशी तिला परीक्षेत पहिला नंबर आला. तिची आई खूश झाली आणि तिने मीनाला आंबा दिला.',
        q: 'या गोष्टीतून काय शिकता येते?',
        options: ['अभ्यास महत्त्वाचा आहे', 'खेळणे चांगले आहे', 'बाजारात जावे', 'आंबा गोड असतो'],
        answer: 'अभ्यास महत्त्वाचा आहे', reward: 5,
      },
    ],
  },
];

// ── Color tokens ──────────────────────────────────────────────────────────────
const WORLD_STYLE: Record<WC, { bg: string; border: string; text: string; badge: string; btn: string; glow: string }> = {
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20',  border: 'border-violet-200 dark:border-violet-800',  text: 'text-violet-700 dark:text-violet-300',  badge: 'bg-violet-500', btn: 'bg-violet-500 hover:bg-violet-600', glow: 'shadow-violet-400/30' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',      border: 'border-blue-200 dark:border-blue-800',      text: 'text-blue-700 dark:text-blue-300',      badge: 'bg-blue-500',   btn: 'bg-blue-500 hover:bg-blue-600',     glow: 'shadow-blue-400/30' },
  emerald:{ bg: 'bg-emerald-50 dark:bg-emerald-900/20',border: 'border-emerald-200 dark:border-emerald-800',text: 'text-emerald-700 dark:text-emerald-300',badge: 'bg-emerald-500',btn: 'bg-emerald-500 hover:bg-emerald-600',glow: 'shadow-emerald-400/30' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',    border: 'border-amber-200 dark:border-amber-800',    text: 'text-amber-700 dark:text-amber-300',    badge: 'bg-amber-500',  btn: 'bg-amber-500 hover:bg-amber-600',   glow: 'shadow-amber-400/30' },
};

function starsFor(correct: number, total: number) {
  const pct = total > 0 ? correct / total : 0;
  return pct >= 0.9 ? 3 : pct >= 0.65 ? 2 : pct >= 0.4 ? 1 : 0;
}

// ── Pearl HUD ─────────────────────────────────────────────────────────────────
function PearlHUD({ pearls, worldsUnlocked, correct, total, onMap }: {
  pearls: number; worldsUnlocked: number; correct: number; total: number; onMap: () => void;
}) {
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
  const nextWorld = WORLDS.find(w => w.unlockAt > pearls);
  const pct = nextWorld
    ? Math.min(100, Math.round(((pearls - (WORLDS[WORLDS.indexOf(nextWorld) - 1]?.unlockAt ?? 0)) /
        (nextWorld.unlockAt - (WORLDS[WORLDS.indexOf(nextWorld) - 1]?.unlockAt ?? 0))) * 100))
    : 100;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900 rounded-[20px] px-4 py-3">
      {/* Pearls */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-400/30">
          <span className="text-lg">🔮</span>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">मोती</p>
          <p className="text-2xl font-black text-white leading-tight tabular-nums">{pearls}</p>
        </div>
      </div>

      {/* Unlock progress */}
      {nextWorld && (
        <div className="flex-1 max-w-[140px] space-y-1">
          <p className="text-[10px] font-black text-slate-500 truncate">{nextWorld.emoji} {nextWorld.marathiName} unlock</p>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* Accuracy */}
      {total > 0 && (
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</p>
          <p className="text-xl font-black text-emerald-400">{acc}%</p>
        </div>
      )}

      {/* Map button */}
      <button onClick={onMap}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black transition-all">
        <MapPin className="w-3.5 h-3.5" /> Map
      </button>
    </div>
  );
}

// ── World Map ─────────────────────────────────────────────────────────────────
function WorldMap({ pearls, worldStars, onEnter, correct, total }: {
  pearls: number;
  worldStars: Record<string, number>;
  onEnter: (worldId: string) => void;
  correct: number;
  total: number;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">वाचन प्रवास — नकाशा 🗺️</h3>
        <p className="text-slate-500 text-sm">मोती कमवा → जग उघडा → कथा महालापर्यंत पोहोचा!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WORLDS.map((world, wi) => {
          const locked = pearls < world.unlockAt;
          const stars  = worldStars[world.id] ?? 0;
          const done   = stars > 0;
          const style  = WORLD_STYLE[world.color];
          const isNext = !locked && WORLDS.slice(wi + 1).some(w => pearls < w.unlockAt || wi === WORLDS.length - 1);

          return (
            <button key={world.id} onClick={() => !locked && onEnter(world.id)} disabled={locked}
              className={cn(
                'relative rounded-2xl border-2 p-5 text-left transition-all',
                locked
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                  : cn(style.bg, style.border, 'hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg', style.glow)
              )}>
              {/* Lock / done badge */}
              <div className="absolute top-3 right-3">
                {locked
                  ? <Lock className="w-4 h-4 text-slate-400" />
                  : done
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : isNext && <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                }
              </div>

              <div className="flex items-start gap-3">
                <span className="text-4xl">{world.emoji}</span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className={cn('font-black text-base leading-tight', locked ? 'text-slate-400' : style.text)}>
                    {world.marathiName}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{world.subtitle}</p>
                  <p className={cn('text-[10px] font-bold', locked ? 'text-slate-400' : 'text-slate-500')}>
                    {world.aserLevel}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-3">
                {[0, 1, 2].map(i => (
                  <Star key={i} className={cn('w-4 h-4', i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700')} />
                ))}
                {locked && (
                  <span className="ml-auto text-[10px] font-black text-slate-400">🔮 {world.unlockAt} मोती हवे</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Challenge View ─────────────────────────────────────────────────────────────
function ChallengeView({ world, chalIdx, onAnswer }: {
  world: World;
  chalIdx: number;
  onAnswer: (correct: boolean, reward: number) => void;
}) {
  const chal = world.challenges[chalIdx];
  const style = WORLD_STYLE[world.color];
  const [chosen, setChosen] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  function pick(opt: string) {
    if (state !== 'idle') return;
    setChosen(opt);
    const correct = opt === chal.answer;
    setState(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      onAnswer(correct, chal.reward);
      setChosen(null);
      setState('idle');
    }, 1000);
  }

  const progress = ((chalIdx) / world.challenges.length) * 100;

  return (
    <div className="space-y-4">
      {/* World header */}
      <div className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl border', style.bg, style.border)}>
        <span className="text-2xl">{world.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className={cn('font-black text-sm', style.text)}>{world.marathiName}</p>
          <div className="mt-1 h-1 bg-white/40 dark:bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-current rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-xs font-black text-slate-500 shrink-0">{chalIdx + 1}/{world.challenges.length}</span>
      </div>

      {/* Passage */}
      {chal.passage && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">📖 वाचा</p>
            <button onClick={() => speakLetter(chal.passage!)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[10px] font-black transition-all hover:bg-amber-200">
              <Volume2 className="w-3 h-3" /> ऐका
            </button>
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">{chal.passage}</p>
        </div>
      )}

      {/* Question */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-start gap-3">
        {chal.emoji && <span className="text-3xl shrink-0">{chal.emoji}</span>}
        <div className="flex-1">
          <p className="font-black text-slate-900 dark:text-white text-base leading-snug">{chal.q}</p>
          <p className="text-[10px] text-amber-500 font-black mt-1">+{chal.reward} मोती मिळतील</p>
        </div>
        <button onClick={() => speakLetter(chal.q)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all">
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {chal.options.map(opt => {
          let cls = `border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:${style.border} hover:${style.bg}`;
          if (chosen === opt) {
            cls = state === 'correct'
              ? 'border-2 border-emerald-400 bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-400/30'
              : 'border-2 border-red-400 bg-red-500 text-white';
          } else if (state === 'wrong' && opt === chal.answer) {
            cls = 'border-2 border-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
          }
          return (
            <button key={opt} onClick={() => pick(opt)}
              className={cn('py-4 px-3 rounded-2xl font-black text-lg transition-all active:scale-95 text-center leading-tight', cls)}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {state !== 'idle' && (
        <div className={cn('text-center font-black text-lg animate-bounce py-2',
          state === 'correct' ? 'text-emerald-500' : 'text-red-500')}>
          {state === 'correct' ? `🎉 शाब्बास! +${chal.reward} मोती!` : `❌ बरोबर उत्तर: "${chal.answer}"`}
        </div>
      )}
    </div>
  );
}

// ── World Complete ─────────────────────────────────────────────────────────────
function WorldCompleteView({ world, correct, total, pearnsEarned, onMap, onNext }: {
  world: World; correct: number; total: number; pearnsEarned: number;
  onMap: () => void; onNext?: () => void;
}) {
  const stars = starsFor(correct, total);
  const style = WORLD_STYLE[world.color];

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-3">
        <span className="text-6xl">{world.emoji}</span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{world.marathiName} पूर्ण!</h3>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map(i => (
            <Star key={i} className={cn('w-8 h-8 transition-all',
              i < stars ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700')} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'बरोबर', value: `${correct}/${total}`, color: 'text-emerald-500' },
          { label: 'अचूकता', value: `${total > 0 ? Math.round((correct / total) * 100) : 0}%`, color: 'text-blue-500' },
          { label: 'मोती', value: `+${pearnsEarned}`, color: 'text-violet-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={cn('rounded-2xl border p-3', style.bg, style.border)}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onNext && (
          <button onClick={onNext}
            className={cn('flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-white font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95', style.btn)}>
            पुढचे जग <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <button onClick={onMap}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl transition-all hover:scale-105 active:scale-95">
          <MapPin className="w-4 h-4" /> नकाशा
        </button>
      </div>
    </div>
  );
}

// ── Final Result ───────────────────────────────────────────────────────────────
function FinalResult({ pearls, correct, total, worldStars, onRestart }: {
  pearls: number; correct: number; total: number;
  worldStars: Record<string, number>; onRestart: () => void;
}) {
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
  const totalStars = Object.values(worldStars).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-3">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-400/30 mx-auto">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white">वाचन प्रवास पूर्ण! 🎉</h3>
        <p className="text-slate-500 text-sm">तुम्ही अक्षर गावापासून कथा महालापर्यंत पोहोचलात!</p>
      </div>

      {/* World stars summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORLDS.map(w => {
          const s = worldStars[w.id] ?? 0;
          const style = WORLD_STYLE[w.color];
          return (
            <div key={w.id} className={cn('rounded-2xl border p-3 space-y-1', style.bg, style.border)}>
              <span className="text-2xl">{w.emoji}</span>
              <p className={cn('text-[10px] font-black', style.text)}>{w.marathiName}</p>
              <div className="flex justify-center gap-0.5">
                {[0, 1, 2].map(i => (
                  <Star key={i} className={cn('w-3.5 h-3.5', i < s ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700')} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'मोती', value: pearls, color: 'text-violet-500', emoji: '🔮' },
          { label: 'अचूकता', value: `${acc}%`, color: 'text-emerald-500', emoji: '🎯' },
          { label: 'तारे', value: `${totalStars}/12`, color: 'text-amber-500', emoji: '⭐' },
        ].map(({ label, value, color, emoji }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
            <span className="text-2xl">{emoji}</span>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      <button onClick={onRestart}
        className="flex items-center justify-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-violet-500 to-blue-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
        <RotateCcw className="w-5 h-5" /> पुन्हा खेळा
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function VachanPravas() {
  const [phase, setPhase] = useState<Phase>('map');
  const [pearls, setPearls] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeWorldId, setActiveWorldId] = useState<string | null>(null);
  const [chalIdx, setChalIdx] = useState(0);
  const [worldStars, setWorldStars] = useState<Record<string, number>>({});
  const [worldCorrect, setWorldCorrect] = useState(0);
  const [worldPearls, setWorldPearls] = useState(0);

  const activeWorld = WORLDS.find(w => w.id === activeWorldId);

  function enterWorld(worldId: string) {
    setActiveWorldId(worldId);
    setChalIdx(0);
    setWorldCorrect(0);
    setWorldPearls(0);
    setPhase('play');
  }

  function handleAnswer(isCorrect: boolean, reward: number) {
    setTotal(t => t + 1);
    const earned = isCorrect ? reward : 0;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setPearls(p => p + earned);
      setWorldCorrect(c => c + 1);
      setWorldPearls(p => p + earned);
    }

    const world = WORLDS.find(w => w.id === activeWorldId)!;
    if (chalIdx + 1 >= world.challenges.length) {
      // World done
      const wc = isCorrect ? worldCorrect + 1 : worldCorrect;
      const stars = starsFor(wc, world.challenges.length);
      setWorldStars(prev => ({ ...prev, [world.id]: Math.max(prev[world.id] ?? 0, stars) }));
      setTimeout(() => setPhase('world-complete'), 1100);
    } else {
      setTimeout(() => setChalIdx(i => i + 1), 1100);
    }
  }

  function goToNextWorld() {
    if (!activeWorld) return;
    const wi = WORLDS.indexOf(activeWorld);
    const next = WORLDS[wi + 1];
    if (next && pearls >= next.unlockAt) {
      enterWorld(next.id);
    } else if (!next) {
      setPhase('final');
    } else {
      setPhase('map');
    }
  }

  function restart() {
    setPhase('map');
    setPearls(0);
    setCorrect(0);
    setTotal(0);
    setActiveWorldId(null);
    setChalIdx(0);
    setWorldStars({});
    setWorldCorrect(0);
    setWorldPearls(0);
  }

  const allWorldsDone = WORLDS.every(w => (worldStars[w.id] ?? 0) > 0);
  const nextWorldAfterCurrent = activeWorld ? WORLDS[WORLDS.indexOf(activeWorld) + 1] : null;
  const canGoNext = nextWorldAfterCurrent ? pearls >= nextWorldAfterCurrent.unlockAt : !nextWorldAfterCurrent;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-700 px-5 py-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <BookOpen className="w-3 h-3" /> Ultimate Language Quest
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
            📖 वाचन प्रवास
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-medium mt-1">
            मोती कमवा → जग उघडा → कथा महालापर्यंत पोहोचा!
          </p>
        </div>
      </div>

      {/* Pearl HUD (always visible during play) */}
      {phase !== 'final' && (
        <div className="px-4 pt-4">
          <PearlHUD
            pearls={pearls} worldsUnlocked={WORLDS.filter(w => pearls >= w.unlockAt).length}
            correct={correct} total={total}
            onMap={() => setPhase('map')}
          />
        </div>
      )}

      {/* Phase content */}
      <div className="p-4 sm:p-5">
        {phase === 'map' && (
          <WorldMap
            pearls={pearls} worldStars={worldStars}
            correct={correct} total={total}
            onEnter={worldId => {
              if (allWorldsDone) { setPhase('final'); return; }
              enterWorld(worldId);
            }}
          />
        )}

        {phase === 'play' && activeWorld && (
          <ChallengeView
            world={activeWorld}
            chalIdx={chalIdx}
            onAnswer={handleAnswer}
          />
        )}

        {phase === 'world-complete' && activeWorld && (
          <WorldCompleteView
            world={activeWorld}
            correct={worldCorrect}
            total={activeWorld.challenges.length}
            pearnsEarned={worldPearls}
            onMap={() => setPhase('map')}
            onNext={nextWorldAfterCurrent
              ? (canGoNext ? goToNextWorld : undefined)
              : (allWorldsDone ? () => setPhase('final') : undefined)
            }
          />
        )}

        {phase === 'final' && (
          <FinalResult
            pearls={pearls} correct={correct} total={total}
            worldStars={worldStars} onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
