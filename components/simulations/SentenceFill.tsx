'use client';
import { useState, useEffect } from 'react';
import CompetitiveArena from './CompetitiveArena';
import { recordBattleResult } from '@/app/actions';

const MARATHI_SENTENCES = [
  { sentence: 'सूर्य {blank} उगवतो.', correct: 'पूर्वेला', others: ['पश्चिमेला', 'उत्तरेला', 'दक्षिणेला'] },
  { sentence: 'झाडावर {blank} बसली आहे.', correct: 'चिमणी', others: ['नदी', 'शाळा', 'गाडी'] },
  { sentence: 'मी रोज शाळेत {blank}.', correct: 'जातो', others: ['खातो', 'पीतो', 'झोपतो'] },
  { sentence: 'आई छान {blank} बनवते.', correct: 'जेवण', others: ['पाणी', 'हवा', 'माती'] },
  { sentence: 'गाय आपल्याला {blank} देते.', correct: 'दूध', others: ['पाणी', 'पैसे', 'कपडे'] },
  { sentence: 'फुलांचा {blank} छान येतो.', correct: 'वास', others: ['रंग', 'आकार', 'पाटी'] },
  { sentence: 'पुस्तके {blank} साठी असतात.', correct: 'वाचण्यासाठी', others: ['खाण्यासाठी', 'पिण्यासाठी', 'झोपण्यासाठी'] },
  { sentence: 'मुले मैदानावर {blank} आहेत.', correct: 'खेळत', others: ['रडत', 'झोपत', 'बसून'] }
];

export default function SentenceFill({ player1, player2, schoolId, classNum }: any) {
  const [currentSentence, setCurrentSentence] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<'A' | 'B' | null>(null);

  const generateRound = () => {
    const item = MARATHI_SENTENCES[Math.floor(Math.random() * MARATHI_SENTENCES.length)];
    setCurrentSentence(item);
    setOptions([item.correct, ...item.others].sort(() => 0.5 - Math.random()));
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
      subject: 'literacy',
      level: 3,
      gameSlug: 'sentence-fill',
      player1Id: player1.id,
      player2Id: player2.id,
      winnerId: winner === 'A' ? player1.id : winner === 'B' ? player2.id : null
    });
  };

  return (
    <CompetitiveArena
      title="वाक्य पूर्ण करा (Sentence Fill)"
      description="योग्य शब्द निवडून वाक्य पूर्ण करा! पहिला टॅप करणारा खेळाडू गुण मिळवेल."
      icon={<span className="text-2xl">📝</span>}
      onGameEnd={handleEnd}
    >
      {({ addPoint, gameState }) => (
        <div className="flex flex-col h-full gap-8">
          {/* Sentence Display */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[48px] border-2 border-white/10 shadow-2xl">
            <p className="text-4xl font-black text-white text-center leading-relaxed">
              {currentSentence?.sentence.replace('{blank}', '______')}
            </p>
          </div>

          {/* Player Sides */}
          <div className="grid grid-cols-2 gap-8 h-96">
            <OptionSide 
              player={player1} 
              color="blue" 
              options={options} 
              target={currentSentence?.correct}
              onCorrect={() => {
                addPoint('A');
                setLastWinner('A');
                setTimeout(generateRound, 400);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
            <OptionSide 
              player={player2} 
              color="red" 
              options={options} 
              target={currentSentence?.correct}
              onCorrect={() => {
                addPoint('B');
                setLastWinner('B');
                setTimeout(generateRound, 400);
              }}
              disabled={gameState !== 'running' || !!lastWinner}
            />
          </div>
        </div>
      )}
    </CompetitiveArena>
  );
}

function OptionSide({ player, color, options, target, onCorrect, disabled }: any) {
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
            className={classNameForButton(color)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${color === 'blue' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
          {player?.name?.[0] || 'P'}
        </div>
        <p className="font-black text-sm text-slate-400">{player?.name || 'Player'}</p>
      </div>
    </div>
  );
}

function classNameForButton(color: 'blue' | 'red') {
  return `h-full flex items-center justify-center text-xl font-black rounded-3xl transition-all active:scale-95 text-center px-2 leading-tight ${
    color === 'blue' 
      ? 'bg-blue-600 hover:bg-blue-500 shadow-xl' 
      : 'bg-red-600 hover:bg-red-500 shadow-xl'
  } text-white`;
}
