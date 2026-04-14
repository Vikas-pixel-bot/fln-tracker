'use client';
import { useState, useEffect } from 'react';
import {
  ShoppingCart, Zap, Trophy, Plus, Minus, RotateCcw,
  ChevronRight, CheckCircle2, Lock, Star, Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Item { id: string; name: string; emoji: string; price: number; }
interface Stall { id: string; name: string; emoji: string; color: SC; unlockAt: number; items: Item[]; }
interface CartEntry { item: Item; qty: number; }
interface Challenge { question: string; answer: number; options: number[]; reward: number; difficulty: 'easy' | 'medium' | 'hard' | 'expert'; }
type SC = 'green' | 'red' | 'orange' | 'blue' | 'violet' | 'amber';
type Phase = 'earn' | 'shop' | 'checkout' | 'result';

// ── Market Data ───────────────────────────────────────────────────────────────
const STALLS: Stall[] = [
  {
    id: 'sabzi', name: 'सब्जी बाजार', emoji: '🥦', color: 'green', unlockAt: 0,
    items: [
      { id: 's1', name: 'बटाटा',   emoji: '🥔', price: 6  },
      { id: 's2', name: 'टोमॅटो', emoji: '🍅', price: 8  },
      { id: 's3', name: 'कांदा',   emoji: '🧅', price: 5  },
      { id: 's4', name: 'गाजर',   emoji: '🥕', price: 7  },
      { id: 's5', name: 'मटार',   emoji: '🫛', price: 12 },
      { id: 's6', name: 'पालक',   emoji: '🌿', price: 10 },
    ],
  },
  {
    id: 'fal', name: 'फळ बाजार', emoji: '🍎', color: 'red', unlockAt: 0,
    items: [
      { id: 'f1', name: 'सफरचंद', emoji: '🍎', price: 10 },
      { id: 'f2', name: 'केळे',     emoji: '🍌', price: 5  },
      { id: 'f3', name: 'आंबा',    emoji: '🥭', price: 18 },
      { id: 'f4', name: 'द्राक्षे', emoji: '🍇', price: 20 },
      { id: 'f5', name: 'संत्री',   emoji: '🍊', price: 8  },
      { id: 'f6', name: 'पपई',     emoji: '🍈', price: 15 },
    ],
  },
  {
    id: 'khaau', name: 'खाऊ गल्ली', emoji: '🍪', color: 'orange', unlockAt: 0,
    items: [
      { id: 'k1', name: 'बिस्किट',   emoji: '🍪', price: 5  },
      { id: 'k2', name: 'चिप्स',     emoji: '🥨', price: 8  },
      { id: 'k3', name: 'चॉकलेट',   emoji: '🍫', price: 15 },
      { id: 'k4', name: 'आइस्क्रीम', emoji: '🍦', price: 20 },
      { id: 'k5', name: 'लॉलीपॉप',  emoji: '🍭', price: 4  },
      { id: 'k6', name: 'जुस',       emoji: '🧃', price: 12 },
    ],
  },
  {
    id: 'stationary', name: 'स्टेशनरी', emoji: '✏️', color: 'blue', unlockAt: 30,
    items: [
      { id: 'st1', name: 'पेन्सिल',  emoji: '✏️', price: 5  },
      { id: 'st2', name: 'खोडरबर', emoji: '🟥', price: 4  },
      { id: 'st3', name: 'पेन',      emoji: '🖊️', price: 10 },
      { id: 'st4', name: 'वही',      emoji: '📓', price: 25 },
      { id: 'st5', name: 'रंगपेटी',  emoji: '🎨', price: 30 },
      { id: 'st6', name: 'कात्री',   emoji: '✂️', price: 18 },
    ],
  },
  {
    id: 'khelne', name: 'खेळणी दुकान', emoji: '🎮', color: 'violet', unlockAt: 60,
    items: [
      { id: 'kh1', name: 'गोळा',         emoji: '⚽', price: 35 },
      { id: 'kh2', name: 'बाहुली',       emoji: '🪆', price: 45 },
      { id: 'kh3', name: 'पतंग',         emoji: '🪁', price: 20 },
      { id: 'kh4', name: 'क्रिकेट बॅट', emoji: '🏏', price: 80 },
      { id: 'kh5', name: 'पझल',          emoji: '🧩', price: 50 },
      { id: 'kh6', name: 'यो-यो',        emoji: '🪀', price: 25 },
    ],
  },
  {
    id: 'dream', name: 'ड्रीम शॉप', emoji: '⭐', color: 'amber', unlockAt: 100,
    items: [
      { id: 'dr1', name: 'शाळेची बॅग', emoji: '🎒', price: 120 },
      { id: 'dr2', name: 'छत्री',       emoji: '☂️',  price: 90  },
      { id: 'dr3', name: 'टिफिन',       emoji: '🍱', price: 70  },
      { id: 'dr4', name: 'वॉटर बॉटल',  emoji: '🧴', price: 60  },
    ],
  },
];

const STALL_STYLE: Record<SC, { bg: string; border: string; text: string; badge: string; btn: string }> = {
  green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20',  border: 'border-emerald-200 dark:border-emerald-800',  text: 'text-emerald-700 dark:text-emerald-300',  badge: 'bg-emerald-500',  btn: 'bg-emerald-500 hover:bg-emerald-600' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',          border: 'border-red-200 dark:border-red-800',          text: 'text-red-700 dark:text-red-300',          badge: 'bg-red-500',    btn: 'bg-red-500 hover:bg-red-600' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20',    border: 'border-orange-200 dark:border-orange-800',    text: 'text-orange-700 dark:text-orange-300',    badge: 'bg-orange-500',  btn: 'bg-orange-500 hover:bg-orange-600' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',        border: 'border-blue-200 dark:border-blue-800',        text: 'text-blue-700 dark:text-blue-300',        badge: 'bg-blue-500',    btn: 'bg-blue-500 hover:bg-blue-600' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20',    border: 'border-violet-200 dark:border-violet-800',    text: 'text-violet-700 dark:text-violet-300',    badge: 'bg-violet-500',  btn: 'bg-violet-500 hover:bg-violet-600' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',      border: 'border-amber-200 dark:border-amber-800',      text: 'text-amber-700 dark:text-amber-300',      badge: 'bg-amber-500',   btn: 'bg-amber-500 hover:bg-amber-600' },
};

const DIFF_STYLE = {
  easy:   { label: 'Easy',   reward: '+₹8',  color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  medium: { label: 'Medium', reward: '+₹15', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  hard:   { label: 'Hard',   reward: '+₹25', color: 'text-violet-600 bg-violet-50 border-violet-200' },
  expert: { label: 'Expert', reward: '+₹40', color: 'text-orange-600 bg-orange-50 border-orange-200' },
};

// ── Challenge generator ────────────────────────────────────────────────────────
function makeChallenge(): Challenge {
  const roll = Math.random();
  let difficulty: Challenge['difficulty'];
  let question: string, answer: number, reward: number;

  if (roll < 0.35) {
    difficulty = 'easy'; reward = 8;
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    if (Math.random() > 0.5 && a >= b) {
      answer = a - b; question = `${a} − ${b} = ?`;
    } else {
      answer = a + b; question = `${a} + ${b} = ?`;
    }
  } else if (roll < 0.65) {
    difficulty = 'medium'; reward = 15;
    const a = Math.floor(Math.random() * 40) + 10;
    const b = Math.floor(Math.random() * 20) + 5;
    if (Math.random() > 0.5 && a > b) {
      answer = a - b; question = `${a} − ${b} = ?`;
    } else {
      answer = a + b; question = `${a} + ${b} = ?`;
    }
  } else if (roll < 0.85) {
    difficulty = 'hard'; reward = 25;
    const tables = [2, 3, 4, 5, 6];
    const t = tables[Math.floor(Math.random() * tables.length)];
    const m = Math.floor(Math.random() * 8) + 2;
    answer = t * m; question = `${t} × ${m} = ?`;
  } else {
    difficulty = 'expert'; reward = 40;
    const allItems = STALLS.slice(0, 3).flatMap(s => s.items);
    const item = allItems[Math.floor(Math.random() * allItems.length)];
    const qty = Math.floor(Math.random() * 3) + 2;
    answer = item.price * qty;
    question = `${qty} ${item.emoji} ${item.name} — प्रत्येकी ₹${item.price}. एकूण किती?`;
  }

  const wrong = new Set<number>();
  while (wrong.size < 2) {
    const v = answer + (Math.floor(Math.random() * 10) - 5) * (difficulty === 'hard' || difficulty === 'expert' ? 2 : 1);
    if (v !== answer && v >= 0) wrong.add(v);
  }
  const options = [answer, ...Array.from(wrong)].sort(() => Math.random() - 0.5);
  return { question, answer, options, reward, difficulty };
}

function roundUpPay(total: number): number {
  const steps = [10, 20, 50, 100, 150, 200, 300, 500];
  return steps.find(s => s > total) ?? Math.ceil(total / 100) * 100;
}

function makeChangeChal(total: number): { paid: number; chal: Challenge } {
  const paid = roundUpPay(total);
  const answer = paid - total;
  const wrong = new Set<number>();
  while (wrong.size < 2) {
    const v = answer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    if (v !== answer && v >= 0) wrong.add(v);
  }
  const options = [answer, ...Array.from(wrong)].sort(() => Math.random() - 0.5);
  return {
    paid,
    chal: {
      question: `तुमची खरेदी ₹${total}. तुम्ही ₹${paid} दिले. परत किती मिळेल?`,
      answer, options, reward: 0, difficulty: 'medium',
    },
  };
}

// ── Wallet HUD ─────────────────────────────────────────────────────────────────
function WalletHUD({ wallet, correct, total, cartCount, onGoShop, onGoEarn, phase }: {
  wallet: number; correct: number; total: number; cartCount: number;
  onGoShop: () => void; onGoEarn: () => void; phase: Phase;
}) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900 rounded-[20px] px-4 py-3">
      {/* Wallet */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
          <span className="text-lg font-black text-white">₹</span>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Wallet</p>
          <p className="text-2xl font-black text-white leading-tight tabular-nums">{wallet}</p>
        </div>
      </div>

      {/* Stars + accuracy */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <Star key={i} className={cn('w-5 h-5', i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700')} />
        ))}
        {total > 0 && (
          <span className="text-xs font-black text-slate-400 ml-1">{accuracy}%</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={onGoEarn}
          className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all',
            phase === 'earn' ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')}>
          <Zap className="w-3.5 h-3.5" /> Earn
        </button>
        <button onClick={onGoShop}
          className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all',
            phase === 'shop' ? 'bg-[#E8232A] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700')}>
          <ShoppingCart className="w-3.5 h-3.5" /> Shop {cartCount > 0 && <span className="bg-white text-[#E8232A] rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-black">{cartCount}</span>}
        </button>
      </div>
    </div>
  );
}

// ── Challenge Card ─────────────────────────────────────────────────────────────
function ChallengeCard({ chal, onAnswer, isCheckout = false }: {
  chal: Challenge; onAnswer: (correct: boolean) => void; isCheckout?: boolean;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  function pick(n: number) {
    if (state !== 'idle') return;
    setChosen(n);
    const correct = n === chal.answer;
    setState(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      onAnswer(correct);
      setChosen(null);
      setState('idle');
    }, 1000);
  }

  const ds = DIFF_STYLE[chal.difficulty];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className={cn('px-3 py-1 rounded-full text-xs font-black border', ds.color)}>
          {ds.label}
        </span>
        {!isCheckout && (
          <span className="text-sm font-black text-amber-500">{ds.reward} रुपये मिळतील</span>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-center">
        <p className="text-xl font-black text-slate-900 dark:text-white leading-snug">{chal.question}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {chal.options.map(opt => {
          let cls = 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20';
          if (chosen === opt) {
            cls = state === 'correct'
              ? 'bg-emerald-500 border-2 border-emerald-500 text-white scale-105'
              : 'bg-red-500 border-2 border-red-500 text-white';
          } else if (state === 'wrong' && opt === chal.answer) {
            cls = 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700';
          }
          return (
            <button key={opt} onClick={() => pick(opt)}
              className={cn('py-4 rounded-2xl font-black text-2xl transition-all active:scale-95', cls)}>
              {isCheckout ? `₹${opt}` : opt}
            </button>
          );
        })}
      </div>

      {state !== 'idle' && (
        <div className={cn('text-center font-black text-lg animate-bounce',
          state === 'correct' ? 'text-emerald-500' : 'text-red-500')}>
          {state === 'correct' ? '🎉 शाब्बास! बरोबर!' : `❌ बरोबर उत्तर: ${isCheckout ? `₹${chal.answer}` : chal.answer}`}
        </div>
      )}
    </div>
  );
}

// ── Earn Phase ─────────────────────────────────────────────────────────────────
function EarnPhase({ onEarn, correct, total }: {
  onEarn: (reward: number, correct: boolean) => void; correct: number; total: number;
}) {
  const [chal, setChal] = useState<Challenge>(makeChallenge);
  const [streak, setStreak] = useState(0);
  const [lastReward, setLastReward] = useState<number | null>(null);

  function handleAnswer(isCorrect: boolean) {
    if (isCorrect) {
      const bonus = streak >= 2 ? Math.floor(chal.reward * 0.5) : 0;
      const total = chal.reward + bonus;
      setLastReward(total);
      setStreak(s => s + 1);
      onEarn(total, true);
    } else {
      setLastReward(0);
      setStreak(0);
      onEarn(0, false);
    }
    setTimeout(() => { setChal(makeChallenge()); setLastReward(null); }, 1100);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">गणित सोडवा — पैसे कमवा!</h3>
        <p className="text-slate-500 text-sm">बाजारात खरेदीसाठी पैसे कमवण्यासाठी प्रश्न सोडवा</p>
      </div>

      {/* Streak banner */}
      {streak >= 2 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-black text-amber-600 dark:text-amber-400">
            🔥 {streak} streak! +50% bonus!
          </span>
        </div>
      )}

      <ChallengeCard chal={chal} onAnswer={handleAnswer} />

      {/* Reward popup */}
      {lastReward !== null && (
        <div className={cn(
          'text-center py-3 rounded-2xl font-black text-lg transition-all',
          lastReward > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-500'
        )}>
          {lastReward > 0 ? `+₹${lastReward} wallet मध्ये जोडले! 💰` : 'चुकले — पुन्हा प्रयत्न करा!'}
        </div>
      )}

      {/* Stats */}
      {total > 0 && (
        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-black text-emerald-500">{correct}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-500">{total}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-500">{Math.round((correct / total) * 100)}%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase">Accuracy</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shop Phase ─────────────────────────────────────────────────────────────────
function ShopPhase({ wallet, cart, onAdd, onRemove, onCheckout }: {
  wallet: number;
  cart: Map<string, CartEntry>;
  onAdd: (item: Item) => void;
  onRemove: (item: Item) => void;
  onCheckout: () => void;
}) {
  const [activeStall, setActiveStall] = useState<string | null>(null);
  const cartTotal = Array.from(cart.values()).reduce((s, e) => s + e.item.price * e.qty, 0);
  const cartCount = Array.from(cart.values()).reduce((s, e) => s + e.qty, 0);
  const stall = STALLS.find(s => s.id === activeStall);

  return (
    <div className="space-y-4">
      {/* Stall grid */}
      {!activeStall ? (
        <>
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">बाजारात आपले स्वागत आहे! 🛒</h3>
            <p className="text-slate-500 text-sm">एखादे दुकान निवडा आणि खरेदी सुरू करा</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STALLS.map(st => {
              const locked = wallet < st.unlockAt;
              const style = STALL_STYLE[st.color];
              const itemsInCart = st.items.reduce((s, it) => s + (cart.get(it.id)?.qty ?? 0), 0);
              return (
                <button key={st.id} onClick={() => !locked && setActiveStall(st.id)}
                  disabled={locked}
                  className={cn(
                    'relative rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all',
                    locked
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
                      : cn(style.bg, style.border, 'hover:scale-105 active:scale-95 cursor-pointer')
                  )}>
                  {locked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  {itemsInCart > 0 && !locked && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#E8232A] rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-black text-white">{itemsInCart}</span>
                    </div>
                  )}
                  <span className="text-4xl">{st.emoji}</span>
                  <span className={cn('text-xs font-black text-center leading-tight', locked ? 'text-slate-400' : style.text)}>
                    {st.name}
                  </span>
                  {locked && (
                    <span className="text-[10px] font-bold text-slate-400">₹{st.unlockAt} वर unlock</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Cart summary + Checkout */}
          {cartCount > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-black text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> माझी पिशवी ({cartCount} वस्तू)
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Array.from(cart.values()).map(e => (
                  <div key={e.item.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{e.item.emoji} {e.item.name} × {e.qty}</span>
                    <span className="font-black text-slate-700 dark:text-slate-200">₹{e.item.price * e.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-black text-slate-900 dark:text-white">एकूण: ₹{cartTotal}</span>
                {wallet >= cartTotal ? (
                  <button onClick={onCheckout}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E8232A] hover:bg-[#c41e24] text-white font-black rounded-xl text-sm transition-all active:scale-95">
                    Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-black text-red-500">पैसे कमी आहेत!</span>
                )}
              </div>
            </div>
          )}
        </>
      ) : stall ? (
        // Stall detail view
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStall(null)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 transition-all">
              ← परत
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stall.emoji}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{stall.name}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stall.items.map(item => {
              const inCart = cart.get(item.id)?.qty ?? 0;
              const canAfford = wallet >= item.price;
              const style = STALL_STYLE[stall.color];
              return (
                <div key={item.id} className={cn('rounded-2xl border-2 p-3 flex flex-col items-center gap-2', style.bg, style.border)}>
                  <span className="text-4xl">{item.emoji}</span>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-200 text-center">{item.name}</p>
                  <p className={cn('text-sm font-black', style.text)}>₹{item.price}</p>
                  {inCart === 0 ? (
                    <button onClick={() => canAfford && onAdd(item)} disabled={!canAfford}
                      className={cn('w-full py-1.5 rounded-xl text-xs font-black transition-all active:scale-95',
                        canAfford
                          ? `${style.btn} text-white`
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed')}>
                      {canAfford ? '+ जोडा' : 'पैसे कमी'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <button onClick={() => onRemove(item)}
                        className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-600 dark:text-slate-300 active:scale-90 transition-all">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center font-black text-slate-800 dark:text-white">{inCart}</span>
                      <button onClick={() => canAfford && onAdd(item)} disabled={!canAfford}
                        className={cn('w-7 h-7 rounded-lg flex items-center justify-center font-black text-white active:scale-90 transition-all',
                          canAfford ? style.btn : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed')}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Checkout Phase ─────────────────────────────────────────────────────────────
function CheckoutPhase({ cart, wallet, onComplete, onBack }: {
  cart: Map<string, CartEntry>;
  wallet: number;
  onComplete: (correct: boolean) => void;
  onBack: () => void;
}) {
  const cartTotal = Array.from(cart.values()).reduce((s, e) => s + e.item.price * e.qty, 0);
  const { paid, chal } = makeChangeChal(cartTotal);

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Checkout 🧾</h3>
        <p className="text-slate-500 text-sm">आपल्या खरेदीची यादी तपासा आणि सुटे पैसे मोजा</p>
      </div>

      {/* Bill */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-2">
        {Array.from(cart.values()).map(e => (
          <div key={e.item.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300 font-medium">{e.item.emoji} {e.item.name} × {e.qty}</span>
            <span className="font-black text-slate-800 dark:text-white">₹{e.item.price * e.qty}</span>
          </div>
        ))}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
          <span className="font-black text-slate-900 dark:text-white text-base">एकूण</span>
          <span className="font-black text-[#E8232A] text-base">₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>दिलेले</span>
          <span className="font-bold">₹{paid}</span>
        </div>
      </div>

      {/* Change challenge */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">सुटे पैसे मोजा</p>
        <ChallengeCard chal={chal} onAnswer={onComplete} isCheckout />
      </div>

      <button onClick={onBack}
        className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">
        ← परत जा
      </button>
    </div>
  );
}

// ── Result Phase ───────────────────────────────────────────────────────────────
function ResultPhase({ cart, wallet, correct, total, paid: paidAmount, changeCorrect, onRestart }: {
  cart: Map<string, CartEntry>; wallet: number; correct: number; total: number;
  paid: number; changeCorrect: boolean; onRestart: () => void;
}) {
  const cartTotal = Array.from(cart.values()).reduce((s, e) => s + e.item.price * e.qty, 0);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
  const itemsBought = Array.from(cart.values()).reduce((s, e) => s + e.qty, 0);

  return (
    <div className="space-y-6 text-center">
      {/* Trophy */}
      <div className="space-y-3">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-400/30 mx-auto">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white">शाब्बास! 🎉</h3>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map(i => (
            <Star key={i} className={cn('w-8 h-8', i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700')} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'खरेदी', value: `₹${cartTotal}`, sub: `${itemsBought} वस्तू`, color: 'text-[#E8232A]' },
          { label: 'Wallet', value: `₹${wallet}`, sub: 'शिल्लक', color: 'text-emerald-500' },
          { label: 'Accuracy', value: `${accuracy}%`, sub: `${correct}/${total}`, color: 'text-blue-500' },
          { label: 'सुटे पैसे', value: changeCorrect ? '✓' : '✗', sub: changeCorrect ? 'बरोबर!' : 'चुकले', color: changeCorrect ? 'text-emerald-500' : 'text-red-500' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
            <p className="text-xs text-slate-400 font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Bought items */}
      {itemsBought > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">आज तुम्ही विकत घेतले</p>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(cart.values()).map(e => (
              <div key={e.item.id} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{e.item.emoji}</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{e.item.name}</span>
                <span className="text-[10px] text-slate-400">×{e.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onRestart}
        className="flex items-center justify-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-[#E8232A] to-[#f97316] text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
        <RotateCcw className="w-5 h-5" /> पुन्हा खेळा
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MathManiaMarket() {
  const [phase, setPhase] = useState<Phase>('earn');
  const [wallet, setWallet] = useState(0);
  const [cart, setCart] = useState<Map<string, CartEntry>>(new Map());
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [changeCorrect, setChangeCorrect] = useState(false);
  const [paidAmt, setPaidAmt] = useState(0);

  const cartCount = Array.from(cart.values()).reduce((s, e) => s + e.qty, 0);
  const cartTotal = Array.from(cart.values()).reduce((s, e) => s + e.item.price * e.qty, 0);

  function onEarn(reward: number, isCorrect: boolean) {
    if (isCorrect) setWallet(w => w + reward);
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
  }

  function addItem(item: Item) {
    if (wallet < item.price) return;
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      next.set(item.id, { item, qty: (existing?.qty ?? 0) + 1 });
      return next;
    });
    setWallet(w => w - item.price);
  }

  function removeItem(item: Item) {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      if (!existing) return prev;
      if (existing.qty <= 1) next.delete(item.id);
      else next.set(item.id, { item, qty: existing.qty - 1 });
      setWallet(w => w + item.price);
      return next;
    });
  }

  function onCheckoutAnswer(isCorrect: boolean) {
    setChangeCorrect(isCorrect);
    if (isCorrect) {
      setCorrect(c => c + 1);
    }
    setTotal(t => t + 1);
    setTimeout(() => setPhase('result'), 800);
  }

  function restart() {
    setPhase('earn');
    setWallet(0);
    setCart(new Map());
    setCorrect(0);
    setTotal(0);
    setChangeCorrect(false);
    setPaidAmt(0);
  }

  // Unlock progress bar
  const nextLock = STALLS.find(s => s.unlockAt > wallet);
  const prevLock = STALLS.slice().reverse().find(s => s.unlockAt <= wallet);
  const unlockPct = nextLock
    ? Math.round(((wallet - (prevLock?.unlockAt ?? 0)) / (nextLock.unlockAt - (prevLock?.unlockAt ?? 0))) * 100)
    : 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#E8232A] via-orange-500 to-amber-400 px-5 py-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <Zap className="w-3 h-3" /> Ultimate Math Mania
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
            🛒 गणिताचा बाजार
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-medium mt-1">
            गणित सोडवा → पैसे कमवा → बाजारात खरेदी करा!
          </p>
        </div>
      </div>

      {/* Unlock progress strip */}
      {nextLock && (
        <div className="px-5 py-2 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${unlockPct}%` }} />
          </div>
          <span className="text-[10px] font-black text-slate-400 shrink-0">
            {nextLock.emoji} ₹{nextLock.unlockAt} unlock
          </span>
        </div>
      )}

      {/* Wallet HUD */}
      <div className="px-4 pt-4">
        <WalletHUD
          wallet={wallet} correct={correct} total={total} cartCount={cartCount}
          phase={phase}
          onGoEarn={() => setPhase('earn')}
          onGoShop={() => setPhase('shop')}
        />
      </div>

      {/* Phase Content */}
      <div className="p-4 sm:p-5">
        {phase === 'earn' && (
          <EarnPhase onEarn={onEarn} correct={correct} total={total} />
        )}
        {phase === 'shop' && (
          <ShopPhase
            wallet={wallet} cart={cart}
            onAdd={addItem} onRemove={removeItem}
            onCheckout={() => setPhase('checkout')}
          />
        )}
        {phase === 'checkout' && (
          <CheckoutPhase
            cart={cart} wallet={wallet}
            onComplete={onCheckoutAnswer}
            onBack={() => setPhase('shop')}
          />
        )}
        {phase === 'result' && (
          <ResultPhase
            cart={cart} wallet={wallet} correct={correct} total={total}
            paid={paidAmt} changeCorrect={changeCorrect}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
