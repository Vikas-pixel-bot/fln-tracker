"use client";
import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";

function genQuestion(level: number) {
  if (level <= 1) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { q: `${a} + ${b} = ?`, answer: a + b };
  } else if (level === 2) {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 20) + 1;
    return { q: `${a} - ${b} = ?`, answer: a - b };
  } else {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    return { q: `${a} × ${b} = ?`, answer: a * b };
  }
}

function makeOptions(answer: number): number[] {
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const delta = Math.floor(Math.random() * 10) + 1;
    opts.add(answer + (Math.random() > 0.5 ? delta : -delta));
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

const TOTAL_ROUNDS = 5;

export default function MathDuel({ player1, player2, level = 2, onResult }: {
  player1: string; player2: string; level?: number; onResult: (winner: "p1" | "p2" | null) => void;
}) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [current, setCurrent] = useState(() => genQuestion(level));
  const [options, setOptions] = useState(() => makeOptions(genQuestion(level).answer));
  const [selected, setSelected] = useState<{ p1?: number; p2?: number }>({});
  const [roundDone, setRoundDone] = useState(false);
  const [done, setDone] = useState(false);

  function tap(player: "p1" | "p2", opt: number) {
    if (selected[player] || roundDone) return;
    const newSel = { ...selected, [player]: opt };
    setSelected(newSel);
    if (newSel.p1 !== undefined && newSel.p2 !== undefined) {
      setScore(s => ({
        p1: s.p1 + (newSel.p1 === current.answer ? 1 : 0),
        p2: s.p2 + (newSel.p2 === current.answer ? 1 : 0),
      }));
      setRoundDone(true);
    }
  }

  function next() {
    if (round >= TOTAL_ROUNDS) {
      setDone(true);
      onResult(score.p1 > score.p2 ? "p1" : score.p2 > score.p1 ? "p2" : null);
      return;
    }
    const q = genQuestion(level);
    setCurrent(q);
    setOptions(makeOptions(q.answer));
    setRound(r => r + 1);
    setSelected({});
    setRoundDone(false);
  }

  if (done) {
    const winner = score.p1 > score.p2 ? player1 : score.p2 > score.p1 ? player2 : null;
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {winner ? `🎉 ${winner} Wins!` : "🤝 Draw!"}
        </h2>
        <p className="text-slate-500 text-lg">{player1}: {score.p1} · {player2}: {score.p2}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-400 uppercase">Player 1</p>
          <p className="font-black text-blue-700 dark:text-blue-300 truncate">{player1}</p>
          <p className="text-4xl font-black text-blue-600">{score.p1}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 font-semibold">Round</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{round}/{TOTAL_ROUNDS}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-rose-400 uppercase">Player 2</p>
          <p className="font-black text-rose-700 dark:text-rose-300 truncate">{player2}</p>
          <p className="text-4xl font-black text-rose-600">{score.p2}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-10 text-center">
        <p className="text-[56px] font-black text-slate-800 dark:text-slate-100">{current.q}</p>
        {roundDone && <p className="mt-2 text-green-600 font-bold text-xl">✅ Answer: {current.answer}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-center text-xs font-bold text-blue-500 uppercase">{player1}</p>
          {options.map(opt => {
            const picked = selected.p1 === opt;
            const correct = roundDone && opt === current.answer;
            const wrong = roundDone && picked && opt !== current.answer;
            return (
              <button key={opt} onClick={() => tap("p1", opt)} disabled={!!selected.p1 || roundDone}
                className={`w-full py-3 rounded-2xl font-black text-xl transition-all active:scale-95
                  ${correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : picked ? "bg-blue-500 text-white" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 hover:bg-blue-100"}`}>
                {opt}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          <p className="text-center text-xs font-bold text-rose-500 uppercase">{player2}</p>
          {options.map(opt => {
            const picked = selected.p2 === opt;
            const correct = roundDone && opt === current.answer;
            const wrong = roundDone && picked && opt !== current.answer;
            return (
              <button key={opt} onClick={() => tap("p2", opt)} disabled={!!selected.p2 || roundDone}
                className={`w-full py-3 rounded-2xl font-black text-xl transition-all active:scale-95
                  ${correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : picked ? "bg-rose-500 text-white" : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 hover:bg-rose-100"}`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {roundDone && (
        <div className="flex justify-center">
          <button onClick={next} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all">
            <RefreshCw className="w-4 h-4" /> Next Round
          </button>
        </div>
      )}
    </div>
  );
}
