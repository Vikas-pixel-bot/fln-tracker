'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

const MARATHI_WORDS = [
  { word: 'साखर', cat: 'खाद्यपदार्थ' },
  { word: 'पाणी', cat: 'पेय' },
  { word: 'हाथी', cat: 'प्राणी' },
  { word: 'सूर्य', cat: 'निसर्ग' },
  { word: 'गुलाब', cat: 'फूल' },
  { word: 'आंबा', cat: 'फळ' },
  { word: 'कपडा', cat: 'वस्तू' },
  { word: 'शाळा', cat: 'ठिकाण' },
  { word: 'गाडी', cat: 'वाहन' },
  { word: 'पेन', cat: 'वस्तू' },
  { word: 'मांजर', cat: 'प्राणी' },
  { word: 'कांदा', cat: 'भाजी' },
  { word: 'नदी', cat: 'जल' },
  { word: 'डोंगर', cat: 'निसर्ग' },
  { word: 'पक्षी', cat: 'प्राणी' }
];

const CATEGORIES = ['प्राणी', 'खाद्यपदार्थ', 'वस्तू', 'निसर्ग', 'ठिकाण', 'वाहन', 'फूल', 'फळ', 'भाजी', 'पेय', 'जल'];

export default function WordRace({ player1, player2, schoolId, classNum }: any) {
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    const correct = MARATHI_WORDS[Math.floor(Math.random() * MARATHI_WORDS.length)];
    const others = CATEGORIES.filter(c => c !== correct.cat).sort(() => 0.5 - Math.random()).slice(0, 3);
    setCurrentWord(correct);
    setOptions([correct.cat, ...others].sort(() => 0.5 - Math.random()));
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
      level: 2,
      gameSlug: 'word-race',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="शब्द वाचन (Word Race)"
      description="योग्य श्रेणी निवडा! पहिला टॅप करणारा जिंकतो."
      icon={<span className="text-2xl">📖</span>}
      player1={player1}
      player2={player2}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* Target Word */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">या शब्दाची श्रेणी सांगा:</p>
            <div className="px-12 py-8 bg-white/5 rounded-[48px] border-2 border-white/10 flex items-center justify-center shadow-2xl">
              <span className="text-7xl font-black text-white">{currentWord?.word}</span>
            </div>
          </div>

          {/* Split Screen */}
          <div className="grid grid-cols-2 gap-8 h-96">
            
            <CategorySide 
              player={player1} 
              color="blue" 
              options={options} 
              target={currentWord?.cat}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 300);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />

            <CategorySide 
              player={player2} 
              color="red" 
              options={options} 
              target={currentWord?.cat}
              onCorrect={() => {
                addPoint('B');
                setLastWinner('B');
                setTimeout(generateRound, 300);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}

function CategorySide({ player, color, options, target, onCorrect, disabled }: any) {
  return (
    <div className={`p-6 rounded-[40px] border-2 flex flex-col gap-4 ${color === 'blue' ? 'bg-blue-600/10 border-blue-500/40' : 'bg-red-600/10 border-red-500/40'}`}>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {options.map((opt: string, i: number) => (
          <button
            key={`${opt}-${i}`}
            disabled={disabled}
            onClick={() => {
              if (opt === target) onCorrect();
            }}
            className={`h-full flex items-center justify-center text-2xl font-black rounded-3xl transition-all active:scale-90 ${
              color === 'blue' 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-xl' 
                : 'bg-red-600 hover:bg-red-500 shadow-xl'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}`}>
          {player?.name?.[0] || '?'}
        </div>
        <p className="font-black text-xs uppercase tracking-tighter text-slate-400">{player?.name || 'Player'}</p>
      </div>
    </div>
  );
}
