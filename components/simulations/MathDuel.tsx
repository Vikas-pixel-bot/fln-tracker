'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

export default function MathDuel({ player1, player2, schoolId, classNum }: any) {
  const [problem, setProblem] = useState<any>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    const isDivision = Math.random() > 0.5;
    let a, b, answer;

    if (isDivision) {
      b = Math.floor(Math.random() * 9) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
    } else {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
    }

    const others = new Set<number>();
    while (others.size < 3) {
      const off = Math.floor(Math.random() * 10) - 5;
      if (off !== 0 && (answer + off) >= 0) others.add(answer + off);
    }

    setProblem({ a, b, op: isDivision ? '÷' : '-', answer });
    setOptions([answer, ...Array.from(others)].sort(() => 0.5 - Math.random()));
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
      level: 4, // Operations level
      gameSlug: 'math-duel',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="Math Duel (वजाबाकी आणि भागाकार)"
      description="Quickly solve the math problem! Speed is key to winning the point."
      icon={<span className="text-2xl">⚡</span>}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* Problem Display */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[48px] border-2 border-white/10 shadow-2xl relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-500">Solve this problem:</div>
            <div className="flex items-center gap-8 text-7xl font-black text-white">
              <span>{problem?.a}</span>
              <span className="text-blue-500">{problem?.op}</span>
              <span>{problem?.b}</span>
              <span className="text-slate-600">=</span>
              <span className="w-24 h-24 bg-white/10 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center text-4xl text-slate-500">?</span>
            </div>
          </div>

          {/* Split Screen */}
          <div className="grid grid-cols-2 gap-8 h-96">
            <MathSide 
              player={player1} 
              color="blue" 
              options={options} 
              target={problem?.answer}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 200);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
            <MathSide 
              player={player2} 
              color="red" 
              options={options} 
              target={problem?.answer}
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

function MathSide({ player, color, options, target, onCorrect, disabled }: any) {
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
            className={classNameForMathButton(color)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
        <span>{player?.name || 'Player'}</span>
        <div className={`w-3 h-3 rounded-full ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`} />
      </div>
    </div>
  );
}

function classNameForMathButton(color: 'blue' | 'red') {
  return `h-full flex items-center justify-center text-4xl font-black rounded-3xl transition-all active:scale-90 ${
    color === 'blue' 
      ? 'bg-blue-600 hover:bg-blue-500 shadow-xl' 
      : 'bg-red-600 hover:bg-red-500 shadow-xl'
  } text-white`;
}
