'use client';
import { useState, useEffect, ReactNode } from 'react';
import { Timer, Trophy, Users, RotateCcw, Play, Swords, Star, Medal } from 'lucide-react';
import { cn } from "@/lib/utils";

type GameState = 'waiting' | 'running' | 'finished';

interface CompetitiveArenaProps {
  title: string;
  description: string;
  icon: ReactNode;
  duration?: number;
  player1?: { id: string; name: string } | null;
  player2?: { id: string; name: string } | null;
  onGameEnd?: (winner: 'A' | 'B' | 'Draw', scores: { a: number, b: number }) => void;
  children: (props: {
    gameState: GameState;
    addPoint: (team: 'A' | 'B') => void;
    scores: { a: number; b: number };
  }) => ReactNode;
}

export default function CompetitiveArena({
  title,
  description,
  icon,
  duration = 60,
  player1,
  player2,
  onGameEnd,
  children
}: CompetitiveArenaProps) {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [scores, setScores] = useState({ a: 0, b: 0 });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'running' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'running') {
      const winner = scores.a > scores.b ? 'A' : scores.b > scores.a ? 'B' : 'Draw';
      setGameState('finished');
      onGameEnd?.(winner, scores);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScores({ a: 0, b: 0 });
    setTimeLeft(duration);
    setGameState('running');
  };

  const addPoint = (team: 'A' | 'B') => {
    if (gameState !== 'running') return;
    setScores(prev => ({ ...prev, [team.toLowerCase()]: prev[team.toLowerCase() as 'a' | 'b'] + 1 }));
  };

  const p1Name = player1?.name ?? 'Player 1';
  const p2Name = player2?.name ?? 'Player 2';
  const winner = scores.a > scores.b ? p1Name : scores.b > scores.a ? p2Name : 'Draw';

  return (
    <div className="bg-slate-950 rounded-[48px] border border-slate-800 shadow-2xl p-8 max-w-6xl mx-auto overflow-hidden relative min-h-[750px] flex flex-col text-white">
      
      {/* HUD: Timer & Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-6">
           <div className="p-4 bg-blue-600 rounded-[28px] shadow-lg shadow-blue-600/20">
              {icon}
           </div>
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                 <Swords className="w-3 h-3" /> 2v2 Competitive Battle
              </div>
              <h2 className="text-3xl font-black tracking-tight">{title}</h2>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className={cn(
             "px-8 py-4 rounded-[32px] border-2 flex items-center gap-4 transition-all",
             timeLeft <= 10 ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "bg-white/5 border-white/10 text-white"
           )}>
              <Timer className="w-8 h-8" />
              <span className="text-4xl font-black font-mono tracking-tighter w-12">{timeLeft}s</span>
           </div>
           <button 
              onClick={startGame}
              className="p-5 bg-white text-black hover:bg-blue-500 hover:text-white rounded-[28px] transition-all active:scale-90"
           >
              <RotateCcw className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* THE ARENA */}
      <div className="flex-1 relative flex flex-col items-stretch">
         
         {/* WAIT OVERLAY */}
         {gameState === 'waiting' && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center space-y-2">
                 <h3 className="text-5xl font-black">Ready for Battle?</h3>
                 <p className="text-slate-400 font-medium">{description}</p>
              </div>
              <button 
                 onClick={startGame}
                 className="group px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[32px] shadow-2xl shadow-blue-600/40 active:scale-95 transition-all text-2xl flex items-center gap-4"
              >
                 START COMPETITION <Play className="w-8 h-8 fill-current" />
              </button>
              <div className="flex items-center gap-12 pt-8 opacity-40">
                 <div className="flex flex-col items-center gap-2"><Users className="w-8 h-8" /><span className="text-[10px] font-black uppercase">2 Students</span></div>
                 <div className="text-xl font-black">VS</div>
                 <div className="flex flex-col items-center gap-2"><Users className="w-8 h-8" /><span className="text-[10px] font-black uppercase">2 Students</span></div>
              </div>
           </div>
         )}

         {/* GAME RUNNING */}
         <div className={cn("flex-1 transition-all duration-700", gameState === 'waiting' ? 'blur-2xl opacity-20 scale-95 pointer-events-none' : '')}>
            {children({ gameState, addPoint, scores })}
         </div>

         {/* FINISHED OVERLAY */}
         {gameState === 'finished' && (
           <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-105 duration-1000 bg-slate-950/90 backdrop-blur-xl rounded-[40px]">
              <div className="relative">
                 <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
                 <Trophy className="w-32 h-32 text-yellow-500 mb-8 relative z-10" />
              </div>
              <h3 className="text-6xl font-black mb-2 tracking-tighter">
                 {winner === 'Draw' ? "IT'S A DRAW!" : `${winner} WINS!`}
              </h3>
              <p className="text-slate-500 text-sm font-bold mb-2">{p1Name} vs {p2Name}</p>
              <p className="text-slate-400 text-xl font-medium mb-12">Congratulations to all participants!</p>
              
              <div className="flex items-center gap-12 mb-12">
                 <div className="text-center p-8 bg-white/5 rounded-[40px] border border-white/10 min-w-[180px]">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{p1Name}</div>
                    <div className="text-6xl font-black text-blue-500">{scores.a}</div>
                 </div>
                 <div className="text-center p-8 bg-white/5 rounded-[40px] border border-white/10 min-w-[180px]">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{p2Name}</div>
                    <div className="text-6xl font-black text-emerald-500">{scores.b}</div>
                 </div>
              </div>

              <button 
                 onClick={startGame}
                 className="px-10 py-5 bg-white text-black font-black rounded-3xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
              >
                 REPLAY BATTLE
              </button>
           </div>
         )}
      </div>

      {/* TEAM HUD (Bottom) */}
      <div className="mt-8 flex items-center justify-between pointer-events-none">
         <div className={cn("px-8 py-4 rounded-3xl border-2 transition-all flex items-center gap-4", scores.a >= scores.b ? "bg-blue-600/20 border-blue-600 text-blue-400" : "bg-white/5 border-white/10 text-white")}>
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-xs font-black uppercase tracking-widest">{p1Name}: <span className="text-2xl ml-2">{scores.a}</span></span>
         </div>
         <div className={cn("px-8 py-4 rounded-3xl border-2 transition-all flex items-center gap-4", scores.b >= scores.a ? "bg-emerald-600/20 border-emerald-600 text-emerald-400" : "bg-white/5 border-white/10 text-white")}>
            <span className="text-xs font-black uppercase tracking-widest">{p2Name}: <span className="text-2xl mr-2">{scores.b}</span></span>
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
         </div>
      </div>
    </div>
  );
}
