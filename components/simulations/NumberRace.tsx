'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

export default function NumberRace({ player1, player2, schoolId, classNum }: any) {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    // Determine level: 1-9 or 10-99
    const isHard = Math.random() > 0.5;
    const range = isHard ? 90 : 9;
    const min = isHard ? 10 : 1;

    const roundNumbers = new Set<number>();
    while (roundNumbers.size < 4) {
      roundNumbers.add(Math.floor(Math.random() * range) + min);
    }
    const arr = Array.from(roundNumbers);
    setNumbers(arr.sort(() => 0.5 - Math.random()));
    setTarget(Math.max(...arr));
    setLastWinner(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleEnd = async (winner: 'A' | 'B' | 'Draw', scores: { a: number, b: number }) => {
    if (!player1 || !player2 || !schoolId) return;
    await recordBattleResult({
      schoolId,
      classNum: classNum || 3,
      subject: 'numeracy',
      level: 2, // 10-99 level
      gameSlug: 'number-race',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="Number Race (सर्वात मोठी संख्या)"
      description="Find the LARGEST number before your opponent does! Be the fastest to score."
      icon={<span className="text-2xl">🏁</span>}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* Instructions */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[48px] border-2 border-white/10 shadow-2xl relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Find the Largest Number:</div>
            <div className="flex items-center gap-6">
               <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-orange-400 to-red-500 shadow-xl shadow-orange-500/20 flex items-center justify-center text-4xl font-black text-white italic">BIG</div>
               <div className="text-4xl text-slate-600 font-bold mb-2">?</div>
            </div>
          </div>

          {/* Player Sides */}
          <div className="grid grid-cols-2 gap-8 h-96">
            <NumberSide 
              player={player1} 
              color="blue" 
              options={numbers} 
              target={target}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 200);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
            <NumberSide 
              player={player2} 
              color="red" 
              options={numbers} 
              target={target}
              onCorrect={() => {
                addPoint('B');
                setLastWinner('B');
                setTimeout(generateRound, 200);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}

function NumberSide({ player, color, options, target, onCorrect, disabled }: any) {
  return (
    <div className={`p-6 rounded-[40px] border-2 flex flex-col gap-4 ${color === 'blue' ? 'bg-blue-600/10 border-blue-500/40' : 'bg-red-600/10 border-red-500/40'}`}>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map((opt: number, i: number) => (
          <button
            key={`${opt}-${i}`}
            disabled={disabled}
            onClick={() => {
              if (opt === target) onCorrect();
            }}
            className={`h-full flex items-center justify-center text-5xl font-black rounded-3xl transition-all active:scale-90 ${
              color === 'blue' 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-xl' 
                : 'bg-red-600 hover:bg-red-500 shadow-xl'
            } text-white`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-2">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>
            {player?.name?.[0] || 'P'}
         </div>
         <p className="font-extrabold text-xs uppercase tracking-tighter text-slate-400">{player?.name || 'Player'}</p>
      </div>
    </div>
  );
}
