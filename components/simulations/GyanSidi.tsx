'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePoints } from '@/lib/points-store';
import GameHeader from '@/components/games/GameHeader';
import { 
  Dices, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, XCircle, HelpCircle, 
  Trophy, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── TYPES & DATA ──────────────────────────────────────────────────────────────

type ChallengeType = 'math' | 'marathi' | 'logic';

interface Question {
  id: string;
  type: ChallengeType;
  prompt: string;
  hint: string;
  options: string[];
  answer: string;
}

const SNAKES: Record<number, number> = {
  16: 6, 46: 25, 49: 11, 54: 34, 62: 19, 64: 60, 87: 24, 92: 73, 95: 75, 98: 79
};

const LADDERS: Record<number, number> = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 50: 93, 51: 67, 71: 91, 80: 100
};

// ── COMPONENT ────────────────────────────────────────────────────────────────

export default function GyanSidi() {
  const { addXP } = usePoints();
  
  // Game State
  const [playerPos, setPlayerPos] = useState(0); // 0 = start line
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [moving, setMoving] = useState(false);
  const [gameStatus, setGameStatus] = useState<'idle' | 'question' | 'won'>('idle');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [triggerCell, setTriggerCell] = useState<{ pos: number; type: 'snake' | 'ladder' } | null>(null);
  const [message, setMessage] = useState('Dice रोल करा!');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // ── Utils ──────────────────────────────────────────────────────────────────

  const generateQuestion = useCallback((): Question => {
    const types: ChallengeType[] = ['math', 'marathi', 'logic'];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = Math.random().toString(36).substr(2, 9);

    if (type === 'math') {
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 15) + 2;
      const op = Math.random() > 0.5 ? '+' : '-';
      const ans = op === '+' ? a + b : a - b;
      const prompt = `${a} ${op} ${b} = ?`;
      const options = [ans, ans + 2, ans - 3, ans + 5].sort(() => Math.random() - 0.5).map(String);
      return { id, type, prompt, hint: 'व्यवस्थित बेरीज किंवा वजाबाकी करा', options, answer: String(ans) };
    } 
    
    if (type === 'marathi') {
      const words = [
        { q: 'क + ा = ?', a: 'का', o: ['की', 'कु', 'के'] },
        { q: 'म + ी = ?', a: 'मी', o: ['मा', 'मु', 'मो'] },
        { q: 'स + ो = ?', a: 'सो', o: ['सा', 'से', 'सौ'] },
        { q: 'त + ु = ?', a: 'तु', o: ['ता', 'ती', 'ते'] },
      ];
      const selected = words[Math.floor(Math.random() * words.length)];
      return { 
        id, type, prompt: selected.q, hint: 'मात्रा ओळखा', 
        options: [selected.a, ...selected.o].sort(() => Math.random() - 0.5), 
        answer: selected.a 
      };
    }

    // Logic/Pattern
    const patterns = [
      { q: '2, 4, 6, ?', a: '8', o: ['7', '9', '10'] },
      { q: 'A, B, A, ?', a: 'B', o: ['A', 'C', 'D'] },
      { q: 'पाच नंतर काय येते?', a: 'सहा', o: ['चार', 'सात', 'आठ'] },
    ];
    const selected = patterns[Math.floor(Math.random() * patterns.length)];
    return { 
      id, type, prompt: selected.q, hint: 'क्रम ओळखा',
      options: [selected.a, ...selected.o].sort(() => Math.random() - 0.5),
      answer: selected.a
    };
  }, []);

  // ── Game Logic ─────────────────────────────────────────────────────────────

  const rollDice = () => {
    if (rolling || moving || gameStatus === 'won') return;
    setRolling(true);
    setDiceValue(Math.floor(Math.random() * 6) + 1);
    
    setTimeout(() => {
      setRolling(false);
      const val = Math.floor(Math.random() * 6) + 1;
      setDiceValue(val);
      processMove(val);
    }, 1000);
  };

  const processMove = async (steps: number) => {
    setMoving(true);
    let current = playerPos;
    const target = Math.min(playerPos + steps, 100);

    // Step-by-step animation
    for (let i = playerPos + 1; i <= target; i++) {
      setPlayerPos(i);
      await new Promise(r => setTimeout(r, 200));
    }

    setMoving(false);

    // Check for Snake or Ladder
    if (SNAKES[target]) {
      setTriggerCell({ pos: target, type: 'snake' });
      setActiveQuestion(generateQuestion());
      setGameStatus('question');
      setMessage('साप चावला! वाचण्यासाठी उत्तर द्या!');
    } else if (LADDERS[target]) {
      setTriggerCell({ pos: target, type: 'ladder' });
      setActiveQuestion(generateQuestion());
      setGameStatus('question');
      setMessage('शिडी मिळाली! चढण्यासाठी उत्तर द्या!');
    } else if (target === 100) {
      setGameStatus('won');
      setMessage('अभिनंदन! तुम्ही जिंकलात!');
      addXP(100);
    } else {
      setMessage('तुमची वेळ संपली, पुढच्या चालीसाठी सज्ज व्हा!');
    }
  };

  const handleAnswer = (choice: string) => {
    if (!activeQuestion || !triggerCell) return;
    
    setTotal(t => t + 1);
    const isCorrect = choice === activeQuestion.answer;
    
    if (isCorrect) {
      setScore(s => s + 1);
      addXP(20);
      if (triggerCell.type === 'ladder') {
        const top = LADDERS[triggerCell.pos];
        setPlayerPos(top);
        setMessage('शाब्बास! तुम्ही शिडी चढलात!');
        if (top === 100) setGameStatus('won');
        else setGameStatus('idle');
      } else {
        setMessage('नशीबवान! तुम्ही सापापासून वाचलात!');
        setGameStatus('idle');
      }
    } else {
      if (triggerCell.type === 'snake') {
        const tail = SNAKES[triggerCell.pos];
        setPlayerPos(tail);
        setMessage('अरेरे! साप चावून खाली गेलात!');
        setGameStatus('idle');
      } else {
        setMessage('चुकले! तुम्ही शिडी चढू शकला नाही.');
        setGameStatus('idle');
      }
    }
    
    setActiveQuestion(null);
    setTriggerCell(null);
  };

  const resetGame = () => {
    setPlayerPos(0);
    setDiceValue(1);
    setRolling(false);
    setMoving(false);
    setGameStatus('idle');
    setScore(0);
    setTotal(0);
    setMessage('Dice रोल करा!');
  };

  // ── Render Helpers ─────────────────────────────────────────────────────────

  const renderCells = () => {
    const cells = [];
    for (let r = 9; r >= 0; r--) {
      for (let c = 0; c < 10; c++) {
        const index = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (9 - c) + 1;
        const isSnakeHead = !!SNAKES[index];
        const isLadderBase = !!LADDERS[index];
        const hasPlayer = playerPos === index;

        cells.push(
          <div 
            key={index} 
            className={cn(
              "relative w-full aspect-square border-2 border-clay flex items-center justify-center text-sm font-bold transition-all duration-300",
              (r + c) % 2 === 0 ? "bg-[#E2725B]/20" : "bg-[#CC7722]/10",
              isSnakeHead && "bg-red-500/10",
              isLadderBase && "bg-green-500/10"
            )}
          >
            <span className="absolute top-1 left-1 text-[10px] opacity-40">{index}</span>
            
            {/* Visual Indicators for Snakes/Ladders */}
            {isSnakeHead && <ArrowDownRight className="w-6 h-6 text-red-600/40 absolute rotate-45" />}
            {isLadderBase && <ArrowUpRight className="w-6 h-6 text-green-600/40 absolute" />}
            
            {/* Player Piece */}
            {hasPlayer && (
              <div className="z-20 w-8 h-8 md:w-10 md:h-10 animate-bounce transition-all duration-300">
                 <div className="w-full h-full bg-blue-600 rounded-lg shadow-xl border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                 </div>
              </div>
            )}
            
            {/* Goal Marker */}
            {index === 100 && (
              <Trophy className="w-8 h-8 text-yellow-500 absolute animate-pulse opacity-50" />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <GameHeader title="ज्ञानशिडी (GyanSidi)" score={score} total={total} />

      <div className="w-full grid lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: Game Controls */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative overflow-hidden">
             {/* Village Decoration */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-3xl -mr-12 -mt-12" />
             
             <div className="space-y-2">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Village Oracle says</p>
                <p className="text-white font-bold leading-tight">{message}</p>
             </div>

             {/* Dice Area */}
             <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center transition-all duration-300",
                  rolling && "animate-spin scale-110",
                  moving && "opacity-50 grayscale"
                )}>
                   <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: diceValue }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-slate-900 rounded-full" />
                      ))}
                   </div>
                </div>
                
                <button 
                  onClick={rollDice}
                  disabled={rolling || moving || gameStatus !== 'idle'}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl",
                    (rolling || moving || gameStatus !== 'idle') 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                      : "bg-[#CC7722] hover:bg-[#E2725B] text-white"
                  )}
                >
                  <Dices className="w-6 h-6" /> ROLL DICE
                </button>
             </div>

             <button onClick={resetGame} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                <RotateCcw className="w-3 h-3" /> Reset Board
             </button>
          </div>

          {/* Rules/Hint */}
          <div className="bg-[#CC7722]/5 border border-[#CC7722]/20 rounded-3xl p-6 space-y-3">
             <div className="flex items-center gap-2 text-[#CC7722]">
                <HelpCircle className="w-4 h-4" />
                <h4 className="text-xs font-black uppercase tracking-widest">Village Rules</h4>
             </div>
             <ul className="text-[10px] text-slate-500 space-y-2 font-medium">
                <li>• साप (Snake) चावला तर उत्तर देऊन स्वतःला वाचवा!</li>
                <li>• शिडी (Ladder) चढण्यासाठी योग्य उत्तर द्या!</li>
                <li>• १०० व्या घरावर सर्वात आधी पोहोचा.</li>
             </ul>
          </div>

        </div>

        {/* CENTER: The Board */}
        <div className="lg:col-span-2 order-1 lg:order-2">
           <div className="bg-clay/10 p-4 rounded-[40px] border-8 border-clay shadow-2xl relative overflow-hidden">
              {/* Board Grid */}
              <div className="grid grid-cols-10 border-2 border-clay rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                 {renderCells()}
              </div>

              {/* Victory Overlay */}
              {gameStatus === 'won' && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-700">
                   <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce mb-6">
                      <Trophy className="w-12 h-12 text-white" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2">विजय!</h2>
                   <p className="text-slate-400 mb-8">तुम्ही गावातील सगळ्यात हुशार खेळाडू आहात!</p>
                   <button 
                    onClick={resetGame}
                    className="px-8 py-4 bg-[#CC7722] text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
                   >
                     पुन्हा खेळा
                   </button>
                </div>
              )}

              {/* Question Overlay */}
              {gameStatus === 'question' && activeQuestion && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in zoom-in duration-300">
                   <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-2xl space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="px-3 py-1 bg-[#CC7722]/10 text-[#CC7722] border border-[#CC7722]/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {activeQuestion.type} Challenge
                         </span>
                         <div className="flex items-center gap-1 text-slate-400">
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-[10px] font-bold">दिलेल्या प्रश्नाचे उत्तर द्या</span>
                         </div>
                      </div>

                      <div className="text-center space-y-2">
                         <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                            {activeQuestion.prompt}
                         </h3>
                         <p className="text-slate-400 text-sm italic">"{activeQuestion.hint}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         {activeQuestion.options.map((opt, i) => (
                           <button 
                             key={i}
                             onClick={() => handleAnswer(opt)}
                             className="py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-xl font-black text-slate-900 dark:text-white rounded-2xl hover:border-[#CC7722] hover:bg-[#CC7722]/5 transition-all active:scale-95"
                           >
                              {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>

      <style jsx>{`
        .bg-clay {
          background-color: #633A34;
        }
        .border-clay {
          border-color: #633A34;
        }
      `}</style>
    </div>
  );
}
