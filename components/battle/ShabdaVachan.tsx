"use client";
import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";

const WORDS = [
  { word: "आई", meaning: "आई (Mother)" }, { word: "बाबा", meaning: "बाबा (Father)" },
  { word: "घर", meaning: "घर (House)" }, { word: "शाळा", meaning: "शाळा (School)" },
  { word: "पाणी", meaning: "पाणी (Water)" }, { word: "भात", meaning: "भात (Rice)" },
  { word: "दूध", meaning: "दूध (Milk)" }, { word: "झाड", meaning: "झाड (Tree)" },
  { word: "फूल", meaning: "फूल (Flower)" }, { word: "पक्षी", meaning: "पक्षी (Bird)" },
  { word: "मासा", meaning: "मासा (Fish)" }, { word: "कुत्रा", meaning: "कुत्रा (Dog)" },
  { word: "मांजर", meaning: "मांजर (Cat)" }, { word: "सूर्य", meaning: "सूर्य (Sun)" },
  { word: "चंद्र", meaning: "चंद्र (Moon)" }, { word: "आकाश", meaning: "आकाश (Sky)" },
  { word: "नदी", meaning: "नदी (River)" }, { word: "डोंगर", meaning: "डोंगर (Mountain)" },
  { word: "रस्ता", meaning: "रस्ता (Road)" }, { word: "दुकान", meaning: "दुकान (Shop)" },
];

const TOTAL_ROUNDS = 5;
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function ShabdaVachan({ player1, player2, onResult }: {
  player1: string; player2: string; onResult: (winner: "p1" | "p2" | null) => void;
}) {
  const [order] = useState(() => shuffle(WORDS.map((_, i) => i)));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [revealed, setRevealed] = useState(false);
  const [roundWinner, setRoundWinner] = useState<"p1" | "p2" | null>(null);
  const [done, setDone] = useState(false);

  const current = WORDS[order[(round - 1) % order.length]];

  function award(player: "p1" | "p2") {
    if (roundWinner) return;
    setScore(s => ({ ...s, [player]: s[player] + 1 }));
    setRoundWinner(player);
  }

  function next() {
    if (round >= TOTAL_ROUNDS) {
      setDone(true);
      onResult(score.p1 > score.p2 ? "p1" : score.p2 > score.p1 ? "p2" : null);
      return;
    }
    setRound(r => r + 1);
    setRevealed(false);
    setRoundWinner(null);
  }

  if (done) {
    const winner = score.p1 > score.p2 ? player1 : score.p2 > score.p1 ? player2 : null;
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {winner ? `🎉 ${winner} जिंकला!` : "🤝 बरोबरी!"}
        </h2>
        <p className="text-slate-500 text-lg">{player1}: {score.p1} · {player2}: {score.p2}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-400 uppercase">खेळाडू १</p>
          <p className="font-black text-blue-700 dark:text-blue-300 truncate">{player1}</p>
          <p className="text-4xl font-black text-blue-600">{score.p1}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 font-semibold">फेरी</p>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{round}/{TOTAL_ROUNDS}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4">
          <p className="text-xs font-bold text-rose-400 uppercase">खेळाडू २</p>
          <p className="font-black text-rose-700 dark:text-rose-300 truncate">{player2}</p>
          <p className="text-4xl font-black text-rose-600">{score.p2}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-10 flex flex-col items-center gap-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">हा शब्द वाचा</p>
        <p className="text-[80px] font-black leading-none text-slate-800 dark:text-slate-100 select-none">{current.word}</p>
        {revealed
          ? <p className="text-xl font-bold text-green-600">{current.meaning}</p>
          : <button onClick={() => setRevealed(true)} className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all">अर्थ पाहा</button>
        }
      </div>

      {!roundWinner ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => award("p1")} className="py-5 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg">✅ {player1}</button>
          <button onClick={() => award("p2")} className="py-5 rounded-2xl bg-rose-600 text-white font-black text-lg hover:bg-rose-700 active:scale-95 transition-all shadow-lg">✅ {player2}</button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-black text-green-600">🎉 {roundWinner === "p1" ? player1 : player2} ने गुण मिळवला!</p>
          <button onClick={next} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all">
            <RefreshCw className="w-4 h-4" /> पुढची फेरी
          </button>
        </div>
      )}
    </div>
  );
}
