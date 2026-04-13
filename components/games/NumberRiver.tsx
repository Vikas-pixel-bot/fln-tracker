"use client";
import { useState } from 'react';

type Op = '+' | '-' | '×' | '÷';

function makeQuestion() {
  const ops: Op[] = ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;

  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * 9) + 2;
    answer = Math.floor(Math.random() * 9) + 2;
    a = b * answer;
  }

  const wrong1 = answer + Math.floor(Math.random() * 5) + 1;
  const wrong2 = answer - Math.floor(Math.random() * 5) - 1;
  const options = [answer, wrong1, Math.abs(wrong2) || wrong1 + 2].sort(() => Math.random() - 0.5);
  return { a, b, op, answer, options };
}

const STONES = 5;

export default function NumberRiver() {
  const [position, setPosition] = useState(0);
  const [question, setQuestion] = useState(makeQuestion);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [won, setWon] = useState(false);

  function answer(n: number) {
    if (feedback) return;
    setChosen(n);
    const correct = n === question.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (correct) {
      setScore(s => s + 1);
      const newPos = position + 1;
      setTimeout(() => {
        if (newPos >= STONES) {
          setWon(true);
        } else {
          setPosition(newPos);
          setQuestion(makeQuestion());
          setFeedback(null);
          setChosen(null);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setFeedback(null);
        setChosen(null);
      }, 1000);
    }
  }

  function restart() {
    setPosition(0);
    setQuestion(makeQuestion());
    setFeedback(null);
    setChosen(null);
    setWon(false);
    setScore(0);
    setTotal(0);
  }

  if (won) return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-indigo-100 shadow-sm text-center space-y-6">
      <div className="text-7xl animate-bounce">🏆</div>
      <h2 className="text-3xl font-extrabold text-indigo-700">नदी पार केली!</h2>
      <p className="text-slate-500 text-lg"><span className="font-bold text-indigo-600">{score}</span> / <span className="font-bold">{total}</span> बरोबर!</p>
      <button onClick={restart} className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 transition-all">
        पुन्हा खेळा 🌊
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-indigo-100 shadow-sm">
      <div className="bg-gradient-to-b from-sky-400 to-blue-600 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white/80 bg-white/20 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
          <span className="text-white font-bold text-sm">{STONES} दगड पार करा!</span>
        </div>

        <div className="flex items-end justify-between gap-1 px-2">
          <div className="text-2xl shrink-0">🌿</div>
          {Array.from({ length: STONES }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {position === i && <span className="text-xl animate-bounce">🐸</span>}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                i < position
                  ? 'bg-green-400 text-green-900'
                  : i === position
                  ? 'bg-yellow-300 text-yellow-900 ring-2 ring-white'
                  : 'bg-blue-300/50 text-blue-200'
              }`}>
                {i < position ? '✓' : i + 1}
              </div>
            </div>
          ))}
          <div className="text-2xl shrink-0">🏡</div>
        </div>

        <div className="flex justify-center gap-4 text-blue-300 text-xs opacity-60">
          {['〰️', '〰️', '〰️', '〰️', '〰️'].map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="text-center">
          <p className="text-slate-400 text-sm font-semibold mb-1">उत्तर द्या — पुढचा दगड!</p>
          <div className="text-4xl font-extrabold text-indigo-700">
            {question.a} {question.op} {question.b} = ?
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {question.options.map(n => {
            let cls = 'border-2 border-indigo-200 text-indigo-800 bg-indigo-50 hover:bg-indigo-100';
            if (chosen === n) {
              cls = feedback === 'correct'
                ? 'border-2 border-green-400 bg-green-100 text-green-700'
                : 'border-2 border-red-400 bg-red-100 text-red-700';
            } else if (feedback === 'wrong' && n === question.answer) {
              cls = 'border-2 border-green-400 bg-green-100 text-green-700';
            }
            return (
              <button key={n} onClick={() => answer(n)}
                className={`rounded-2xl py-5 text-2xl font-extrabold transition-all duration-200 ${cls}`}>
                {n}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`text-center text-xl font-extrabold animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '🐸 उडी! पुढचा दगड!' : `❌ उत्तर: ${question.answer}`}
          </div>
        )}
      </div>
    </div>
  );
}
