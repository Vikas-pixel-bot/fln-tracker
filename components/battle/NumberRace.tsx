"use client";
import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";

function genPair(level: number): [number, number] {
  if (level <= 1) {
    const a = Math.floor(Math.random() * 9) + 1;
    let b = Math.floor(Math.random() * 9) + 1;
    while (b === a) b = Math.floor(Math.random() * 9) + 1;
    return [a, b];
  } else {
    const a = Math.floor(Math.random() * 90) + 10;
    let b = Math.floor(Math.random() * 90) + 10;
    while (b === a) b = Math.floor(Math.random() * 90) + 10;
    return [a, b];
  }
}

const TOTAL_ROUNDS = 5;

export default function NumberRace({ player1, player2, level = 1, onResult }: {
  player1: string; player2: string; level?: number; onResult: (winner: "p1" | "p2" | null) => void;
}) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [pair, setPair] = useState<[number, number]>(() => genPair(level));
  const [selected, setSelected] = useState<{ p1?: number; p2?: number }>({});
  const [roundDone, setRoundDone] = useState(false);
  const [done, setDone] = useState(false);

  const bigger = Math.max(...pair);

  function tap(player: "p1" | "p2", num: number) {
    if (selected[player] || roundDone) return;
    const newSel = { ...selected, [player]: num };
    setSelected(newSel);
    if (newSel.p1 !== undefined && newSel.p2 !== undefined) {
      setScore(s => ({
        p1: s.p1 + (newSel.p1 === bigger ? 1 : 0),
        p2: s.p2 + (newSel.p2 === bigger ? 1 : 0),
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
    setPair(genPair(level));
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

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">मोठा आकडा कोणता? / Which is bigger?</p>
        <div className="flex items-center justify-center gap-8">
          <span className="text-[72px] font-black text-slate-800 dark:text-slate-100">{pair[0]}</span>
          <span className="text-2xl font-black text-slate-400">vs</span>
          <span className="text-[72px] font-black text-slate-800 dark:text-slate-100">{pair[1]}</span>
        </div>
        {roundDone && <p className="mt-2 text-green-600 font-bold text-xl">✅ {bigger}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[("p1" as const), ("p2" as const)].map((player, pi) => (
          <div key={player} className="space-y-2">
            <p className={`text-center text-xs font-bold uppercase ${player === "p1" ? "text-blue-500" : "text-rose-500"}`}>
              {player === "p1" ? player1 : player2}
            </p>
            {pair.map(num => {
              const picked = selected[player] === num;
              const correct = roundDone && num === bigger;
              const wrong = roundDone && picked && num !== bigger;
              return (
                <button key={num} onClick={() => tap(player, num)} disabled={!!selected[player] || roundDone}
                  className={`w-full py-4 rounded-2xl font-black text-3xl transition-all active:scale-95
                    ${correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : picked
                      ? (player === "p1" ? "bg-blue-500 text-white" : "bg-rose-500 text-white")
                      : (player === "p1" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 hover:bg-blue-100" : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 hover:bg-rose-100")}`}>
                  {num}
                </button>
              );
            })}
          </div>
        ))}
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
