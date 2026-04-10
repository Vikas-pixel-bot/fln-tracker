'use client';
import { useState, useEffect } from 'react';
import { Volume2, SpellCheck, Swords } from 'lucide-react';
import CompetitiveArena from './CompetitiveArena';
import { cn } from "@/lib/utils";
import { speakLetter } from '@/lib/speak';
import { recordBattleResult } from '@/app/actions';

const MARATHI_LETTERS = [
  "क", "ख", "ग", "घ",
  "च", "छ", "ज", "झ",
  "ट", "ठ", "ड", "ढ",
  "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म",
  "य", "र", "ल", "व",
  "श", "ष", "स", "ह", "ळ",
];

function generateProblem(): { t: string; options: string[] } {
  const t = MARATHI_LETTERS[Math.floor(Math.random() * MARATHI_LETTERS.length)];
  const others = MARATHI_LETTERS.filter(x => x !== t).sort(() => 0.5 - Math.random()).slice(0, 3);
  return { t, options: [t, ...others].sort(() => 0.5 - Math.random()) };
}

export default function SoundDuel({ player1, player2, schoolId, classNum }: any) {
  const [probA, setProbA] = useState(generateProblem);
  const [probB, setProbB] = useState(generateProblem);
  const [feedbackA, setFeedbackA] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedbackB, setFeedbackB] = useState<'idle' | 'success' | 'error'>('idle');
  const [speakingA, setSpeakingA] = useState(false);
  const [speakingB, setSpeakingB] = useState(false);

  // Auto-play both letters when component mounts
  useEffect(() => {
    speakLetter(probA.t);
  }, []);

  const playA = () => {
    setSpeakingA(true);
    speakLetter(probA.t, () => setSpeakingA(false));
  };

  const playB = () => {
    setSpeakingB(true);
    speakLetter(probB.t, () => setSpeakingB(false));
  };

  const nextA = () => {
    const next = generateProblem();
    setProbA(next);
    setFeedbackA('idle');
    setTimeout(() => speakLetter(next.t), 200);
  };

  const nextB = () => {
    const next = generateProblem();
    setProbB(next);
    setFeedbackB('idle');
    setTimeout(() => speakLetter(next.t), 200);
  };

  const handleEnd = async (winner: 'A' | 'B' | 'Draw', _scores: { a: number, b: number }) => {
    if (!player1 || !player2 || !schoolId) return;
    await recordBattleResult({
      schoolId,
      classNum: classNum || 3,
      subject: 'literacy',
      level: 1,
      gameSlug: 'sound-duel',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="ध्वनी द्वंद्व"
      description="अक्षराचा ध्वनी ऐका आणि बरोबर अक्षर शोधा — दुसऱ्या संघापेक्षा जास्त गुण मिळवा!"
      icon={<SpellCheck className="w-10 h-10 text-white" />}
      duration={60}
      player1={player1}
      player2={player2}
      onGameEnd={handleEnd}
    >
      {({ gameState, addPoint }) => (
        <div className="flex-1 flex gap-px bg-white/5 overflow-hidden rounded-[40px] border border-white/5">

          {/* TEAM A ARENA */}
          <div className={cn(
            "flex-1 p-10 flex flex-col items-center justify-center space-y-8 transition-all",
            feedbackA === 'success' ? "bg-indigo-600/10" : feedbackA === 'error' ? "bg-red-600/10" : "bg-slate-900/40"
          )}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                संघ अ
              </div>
              <button
                onClick={playA}
                disabled={speakingA || gameState !== 'running'}
                className={cn(
                  "w-32 h-32 bg-indigo-600 rounded-[40px] shadow-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95",
                  speakingA && "opacity-70"
                )}
              >
                <Volume2 className={cn("w-12 h-12 text-white", speakingA && "animate-pulse")} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                  {speakingA ? "बोलत आहे" : "ऐका"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
              {probA.options.map((opt, i) => (
                <button
                  key={`a-${i}-${opt}`}
                  onClick={() => {
                    if (gameState !== 'running') return;
                    if (opt === probA.t) {
                      setFeedbackA('success');
                      addPoint('A');
                      setTimeout(nextA, 400);
                    } else {
                      setFeedbackA('error');
                      setTimeout(() => setFeedbackA('idle'), 500);
                    }
                  }}
                  disabled={gameState !== 'running'}
                  className="h-28 bg-white/5 border-2 border-white/10 rounded-3xl text-5xl font-black hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* TEAM B ARENA */}
          <div className={cn(
            "flex-1 p-10 flex flex-col items-center justify-center space-y-8 transition-all",
            feedbackB === 'success' ? "bg-violet-600/10" : feedbackB === 'error' ? "bg-red-600/10" : "bg-slate-900/40"
          )}>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                संघ ब
              </div>
              <button
                onClick={playB}
                disabled={speakingB || gameState !== 'running'}
                className={cn(
                  "w-32 h-32 bg-violet-600 rounded-[40px] shadow-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95",
                  speakingB && "opacity-70"
                )}
              >
                <Volume2 className={cn("w-12 h-12 text-white", speakingB && "animate-pulse")} />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                  {speakingB ? "बोलत आहे" : "ऐका"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-[340px]">
              {probB.options.map((opt, i) => (
                <button
                  key={`b-${i}-${opt}`}
                  onClick={() => {
                    if (gameState !== 'running') return;
                    if (opt === probB.t) {
                      setFeedbackB('success');
                      addPoint('B');
                      setTimeout(nextB, 400);
                    } else {
                      setFeedbackB('error');
                      setTimeout(() => setFeedbackB('idle'), 500);
                    }
                  }}
                  disabled={gameState !== 'running'}
                  className="h-28 bg-white/5 border-2 border-white/10 rounded-3xl text-5xl font-black hover:bg-violet-600 hover:border-violet-500 transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Center divider */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-950 rounded-full border border-white/10 shadow-2xl z-10">
            <Swords className="w-8 h-8 text-indigo-500 animate-bounce" />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}
