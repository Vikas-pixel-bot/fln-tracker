'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

export default function PlaceValueBattle({ player1, player2, schoolId, classNum, onClose }: any) {
  const [targetNumber, setTargetNumber] = useState<{ h: number; t: number; o: number }>({ h: 0, t: 0, o: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = h * 100 + t * 10 + o;
    
    const others = new Set<number>();
    while (others.size < 3) {
      const off = (Math.floor(Math.random() * 3) - 1) * 100 + 
                  (Math.floor(Math.random() * 3) - 1) * 10 + 
                  (Math.floor(Math.random() * 3) - 1);
      const val = num + off;
      if (val !== num && val >= 100 && val <= 999) others.add(val);
      else others.add(Math.floor(Math.random() * 900) + 100);
    }
    
    setTargetNumber({ h, t, o });
    setOptions([num, ...Array.from(others).slice(0, 3)].sort(() => 0.5 - Math.random()));
    setLastWinner(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleEnd = async (winner: 'A' | 'B' | 'Draw', _scores: { a: number, b: number }) => {
    if (!player1 || !player2 || !schoolId) return;
    await recordBattleResult({
      schoolId,
      classNum: classNum || 3,
      subject: 'numeracy',
      level: 3, // 100-999 level
      gameSlug: 'place-value-battle',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="Place Value Battle (शतक-दशक-एकक)"
      description="Identify the total number from the H-T-O representation! First correct tap wins."
      icon={<span className="text-2xl">🏛️</span>}
      player1={player1}
      player2={player2}
      onClose={onClose}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* HTO Display */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[48px] border-2 border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm shadow-inner" />
             <div className="flex items-center gap-12 relative z-10">
                <PlaceBox value={targetNumber.h} label="H" color="orange" />
                <PlaceBox value={targetNumber.t} label="T" color="blue" />
                <PlaceBox value={targetNumber.o} label="O" color="emerald" />
             </div>
             <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-widest italic">याचे एकूण मूल्य किती?</p>
          </div>

          {/* Player Sides */}
          <div className="grid grid-cols-2 gap-8 h-96">
            <PlaceSide 
              player={player1} 
              color="blue" 
              options={options} 
              target={targetNumber.h * 100 + targetNumber.t * 10 + targetNumber.o}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 200);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
            <PlaceSide 
              player={player2} 
              color="red" 
              options={options} 
              target={targetNumber.h * 100 + targetNumber.t * 10 + targetNumber.o}
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

function PlaceBox({ value, label, color }: { value: number, label: string, color: 'orange' | 'blue' | 'emerald' }) {
  const bg = color === 'orange' ? 'from-orange-500 to-amber-600' : color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600';
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`w-28 h-28 rounded-[32px] bg-gradient-to-br ${bg} shadow-2xl flex flex-col items-center justify-center border-2 border-white/20 transition-all hover:scale-105 active:scale-95`}>
         <span className="text-5xl font-black text-white">{value}</span>
      </div>
      <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full text-slate-400 border border-white/5">{label}</span>
    </div>
  );
}

function PlaceSide({ player, color, options, target, onCorrect, disabled }: any) {
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
            className={`h-full flex items-center justify-center text-4xl font-black rounded-3xl transition-all active:scale-90 ${
              color === 'blue' 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20' 
                : 'bg-red-600 hover:bg-red-500 shadow-xl shadow-red-500/20'
            } text-white`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>
            {player?.name?.[0] || 'P'}
         </div>
         <p className="font-extrabold text-xs uppercase tracking-tighter text-slate-400">{player?.name || 'Player'}</p>
      </div>
    </div>
  );
}

