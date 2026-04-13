"use client";
import { useState } from 'react';

const ITEMS = [
  { name: 'सफरचंद', emoji: '🍎', price: 5 },
  { name: 'केळे', emoji: '🍌', price: 3 },
  { name: 'पेन्सिल', emoji: '✏️', price: 7 },
  { name: 'खोडरबर', emoji: '🩹', price: 4 },
  { name: 'पुस्तक', emoji: '📚', price: 12 },
  { name: 'बिस्किट', emoji: '🍪', price: 6 },
  { name: 'आंबा', emoji: '🥭', price: 8 },
  { name: 'वही', emoji: '📓', price: 15 },
];

type Mode = 'change' | 'total' | 'canAfford';

function makeRound() {
  const modes: Mode[] = ['change', 'total', 'canAfford'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  let question = '', answer = 0, options: number[] = [];
  let wallet = 0;

  if (mode === 'change') {
    wallet = item.price + Math.floor(Math.random() * 10) + 1;
    answer = wallet - item.price;
    question = `तुमच्याकडे ₹${wallet} आहेत. ${item.name} ₹${item.price} ला विकत घेतले. किती पैसे परत मिळतील?`;
    options = [answer, answer + 2, answer - 1 >= 0 ? answer - 1 : answer + 3].sort(() => Math.random() - 0.5);
  } else if (mode === 'total') {
    const qty = Math.floor(Math.random() * 3) + 2;
    answer = item.price * qty;
    question = `${qty} ${item.emoji} ${item.name} प्रत्येकी ₹${item.price}. एकूण किती?`;
    options = [answer, answer + item.price, answer - item.price > 0 ? answer - item.price : answer + 2 * item.price].sort(() => Math.random() - 0.5);
  } else {
    wallet = Math.floor(Math.random() * 15) + 5;
    const canBuy = Math.floor(wallet / item.price);
    answer = canBuy;
    question = `तुमच्याकडे ₹${wallet} आहेत. ${item.name} ₹${item.price} एकाला. किती ${item.name} विकत घेता येतील?`;
    options = [canBuy, canBuy + 1, Math.max(0, canBuy - 1)].sort(() => Math.random() - 0.5);
  }

  return { mode, item, question, answer, options };
}

export default function MarketMath() {
  const [round, setRound] = useState(makeRound);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  function pick(n: number) {
    if (feedback) return;
    setChosen(n);
    const correct = n === round.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setRound(makeRound());
      setFeedback(null);
      setChosen(null);
    }, 1400);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-amber-100 shadow-sm">
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6 text-center">
        <div className="text-5xl">{round.item.emoji}</div>
        <p className="text-white font-bold mt-1">🛒 बाजार गणित</p>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
          <div className="flex gap-1">
            {['₹', '₹', '₹'].map((r, i) => <span key={i} className="text-amber-400 text-lg">{r}</span>)}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-bold text-slate-700 text-center leading-snug">{round.question}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {round.options.map(n => {
            let cls = 'border-2 border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xl font-extrabold';
            if (chosen === n) {
              cls = feedback === 'correct'
                ? 'border-2 border-green-400 bg-green-100 text-green-700 scale-105 text-xl font-extrabold'
                : 'border-2 border-red-400 bg-red-100 text-red-700 text-xl font-extrabold';
            } else if (feedback === 'wrong' && n === round.answer) {
              cls = 'border-2 border-green-400 bg-green-100 text-green-700 text-xl font-extrabold';
            }
            return (
              <button key={n} onClick={() => pick(n)}
                className={`rounded-2xl py-5 transition-all duration-200 ${cls}`}>
                ₹{n}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '🛒 शाब्बास!' : `❌ उत्तर होते ₹${round.answer}`}
          </div>
        )}
      </div>
    </div>
  );
}
