'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

const MARATHI_LETTERS = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः',
  'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ',
  'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
  'प', 'ph', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'ळ', 'क्ष', 'ज्ञ'
];

export default function LetterFlash({ player1, player2, schoolId, classNum, onClose }: any) {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    const correct = MARATHI_LETTERS[Math.floor(Math.random() * MARATHI_LETTERS.length)];
    const others = [...MARATHI_LETTERS].filter(l => l !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
    setCurrentLetter(correct);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
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
      subject: 'literacy',
      level: 1,
      gameSlug: 'letter-flash',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="अक्षर ओळख (Letter Flash)"
      description="पहिला खेळाडू ज्याने योग्य अक्षरावर टॅप केले त्याला गुण मिळेल!"
      icon={<span className="text-2xl">अ</span>}
      player1={player1}
      player2={player2}
      onClose={onClose}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* Target Display */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-[40px] border-4 border-blue-500 flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-8xl font-black text-white">{currentLetter}</span>
            </div>
          </div>

          {/* Split Screen for 2 Players */}
          <div className="grid grid-cols-2 gap-8 h-96">
            
            {/* Player 1 Area (Blue) */}
            <PlayerSide 
              player={player1} 
              color="blue" 
              options={options} 
              target={currentLetter}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 200);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />

            {/* Player 2 Area (Red) */}
            <PlayerSide 
              player={player2} 
              color="red" 
              options={options} 
              target={currentLetter}
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

function PlayerSide({ player, color, options, target, onCorrect, disabled }: any) {
  return (
    <div className={`p-6 rounded-[40px] border-2 flex flex-col gap-4 ${color === 'blue' ? 'bg-blue-600/10 border-blue-500/40' : 'bg-red-600/10 border-red-500/40'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>
          {player?.name?.[0] || '?'}
        </div>
        <p className="font-black text-sm uppercase tracking-tighter">{player?.name || 'Player'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map((opt: string, i: number) => (
          <button
            key={`${opt}-${i}`}
            disabled={disabled}
            onClick={() => {
              if (opt === target) onCorrect();
            }}
            className={classNameForPlayerButton(color)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function classNameForPlayerButton(color: 'blue' | 'red') {
  return `h-full flex items-center justify-center text-4xl font-black rounded-3xl transition-all active:scale-90 ${
    color === 'blue' 
      ? 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20' 
      : 'bg-red-600 hover:bg-red-500 shadow-xl shadow-red-900/20'
  }`;
}
