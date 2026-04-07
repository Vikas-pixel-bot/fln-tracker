"use client";
import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";

const SENTENCES = [
  { sentence: "मी रोज शाळेत ______ जातो.", options: ["चालत", "झोपत", "खाऊन"], answer: "चालत" },
  { sentence: "आई घरी ______ बनवते.", options: ["जेवण", "खेळ", "झाड"], answer: "जेवण" },
  { sentence: "आकाशात ______ चमकतो.", options: ["सूर्य", "पाणी", "दगड"], answer: "सूर्य" },
  { sentence: "मुले ______ खेळतात.", options: ["मैदानात", "पुस्तकात", "नदीत"], answer: "मैदानात" },
  { sentence: "गाय ______ देते.", options: ["दूध", "पाणी", "फळ"], answer: "दूध" },
  { sentence: "पक्षी ______ उडतो.", options: ["आकाशात", "जमिनीत", "पाण्यात"], answer: "आकाशात" },
  { sentence: "रात्री ______ येते.", options: ["झोप", "भूक", "तहान"], answer: "झोप" },
  { sentence: "शाळेत ______ शिकवतात.", options: ["शिक्षक", "दुकानदार", "शेतकरी"], answer: "शिक्षक" },
  { sentence: "मासे ______ राहतात.", options: ["पाण्यात", "झाडावर", "आकाशात"], answer: "पाण्यात" },
  { sentence: "फुले ______ फुलतात.", options: ["बागेत", "रस्त्यात", "नदीत"], answer: "बागेत" },
];

const TOTAL_ROUNDS = 5;
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

export default function VakyaPurna({ player1, player2, onResult }: {
  player1: string; player2: string; onResult: (winner: "p1" | "p2" | null) => void;
}) {
  const [order] = useState(() => shuffle(SENTENCES.map((_, i) => i)));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [selected, setSelected] = useState<{ p1?: string; p2?: string }>({});
  const [roundDone, setRoundDone] = useState(false);
  const [done, setDone] = useState(false);

  const current = SENTENCES[order[(round - 1) % order.length]];
  const opts = useState(() => current.options)[0];

  function tap(player: "p1" | "p2", option: string) {
    if (selected[player] || roundDone) return;
    const newSel = { ...selected, [player]: option };
    setSelected(newSel);
    if (newSel.p1 && newSel.p2) {
      const p1Correct = newSel.p1 === current.answer;
      const p2Correct = newSel.p2 === current.answer;
      setScore(s => ({
        p1: s.p1 + (p1Correct ? 1 : 0),
        p2: s.p2 + (p2Correct ? 1 : 0),
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

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">रिकाम्या जागी योग्य शब्द निवडा</p>
        <p className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">{current.sentence}</p>
        {roundDone && <p className="mt-3 text-green-600 font-bold">✅ उत्तर: {current.answer}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 options — left side */}
        <div className="space-y-2">
          <p className="text-center text-xs font-bold text-blue-500 uppercase">{player1}</p>
          {current.options.map(opt => {
            const picked = selected.p1 === opt;
            const correct = roundDone && opt === current.answer;
            const wrong = roundDone && picked && opt !== current.answer;
            return (
              <button key={opt} onClick={() => tap("p1", opt)} disabled={!!selected.p1}
                className={`w-full py-3 rounded-2xl font-black text-base transition-all active:scale-95
                  ${correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : picked ? "bg-blue-500 text-white" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100"}`}>
                {opt}
              </button>
            );
          })}
        </div>
        {/* Player 2 options — right side */}
        <div className="space-y-2">
          <p className="text-center text-xs font-bold text-rose-500 uppercase">{player2}</p>
          {current.options.map(opt => {
            const picked = selected.p2 === opt;
            const correct = roundDone && opt === current.answer;
            const wrong = roundDone && picked && opt !== current.answer;
            return (
              <button key={opt} onClick={() => tap("p2", opt)} disabled={!!selected.p2}
                className={`w-full py-3 rounded-2xl font-black text-base transition-all active:scale-95
                  ${correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : picked ? "bg-rose-500 text-white" : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100"}`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {roundDone && (
        <div className="flex justify-center">
          <button onClick={next} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all">
            <RefreshCw className="w-4 h-4" /> पुढची फेरी
          </button>
        </div>
      )}
    </div>
  );
}
