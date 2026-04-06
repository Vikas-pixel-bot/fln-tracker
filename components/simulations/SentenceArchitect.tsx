'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, ChevronUp, ChevronDown, RotateCcw, HelpCircle, GraduationCap } from 'lucide-react';
import { cn } from "@/lib/utils";

const STORIES = [
  {
    title: "Morning Routine",
    sentences: [
      "I wake up when the sun comes up.",
      "Then I brush my teeth and wash my face.",
      "After that, I eat my breakfast.",
      "Finally, I pick up my bag and go to school."
    ]
  },
  {
    title: "The Little Seed",
    sentences: [
      "First, I planted a small seed in the soil.",
      "I gave it some water every day.",
      "Soon, a tiny green leaf came out.",
      "Now, it has grown into a beautiful flower."
    ]
  }
];

export default function SentenceArchitect() {
  const [target, setTarget] = useState(STORIES[0]);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success'>('idle');

  const generateNew = () => {
    const s = STORIES[Math.floor(Math.random() * STORIES.length)];
    setTarget(s);
    setShuffled([...s.sentences].sort(() => 0.5 - Math.random()));
    setFeedback('idle');
  };

  useEffect(() => {
    generateNew();
  }, []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...shuffled];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setShuffled(newItems);
  };

  const checkOrder = () => {
    if (JSON.stringify(shuffled) === JSON.stringify(target.sentences)) {
      setFeedback('success');
      setScore(prev => prev + 1);
      setTimeout(generateNew, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-4xl mx-auto overflow-hidden relative min-h-[700px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <BookOpen className="w-3 h-3" /> Literacy: Para/Story Level
           </div>
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sentence Architect</h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-black text-blue-600 dark:text-blue-400">
              Score: {score}
           </div>
           <button 
              onClick={() => { setScore(0); generateNew(); }}
              className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"
           >
              <RotateCcw className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 space-y-12 max-w-2xl mx-auto w-full">
         
         <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Build the Story: &ldquo;{target.title}&rdquo;</h3>
            <p className="text-slate-500 font-medium">Reorder the sentences to tell the story correctly.</p>
         </div>

         {/* THE SENTENCE STACK */}
         <div className="space-y-3">
            {shuffled.map((sentence, i) => (
              <div 
                key={i} 
                className={cn(
                  "group p-6 rounded-3xl border-2 flex items-center justify-between gap-6 transition-all duration-300",
                  feedback === 'success' ? "bg-emerald-50 border-emerald-500" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-blue-600 hover:shadow-xl"
                )}
              >
                 <p className={cn("flex-1 text-sm font-bold", feedback === 'success' ? "text-emerald-700" : "text-slate-700 dark:text-slate-200")}>
                    {sentence}
                 </p>
                 
                 {feedback !== 'success' && (
                    <div className="flex flex-col gap-1">
                       <button 
                          onClick={() => moveItem(i, 'up')}
                          disabled={i === 0}
                          className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-blue-600 rounded-lg disabled:opacity-0"
                       >
                          <ChevronUp className="w-4 h-4" />
                       </button>
                       <button 
                          onClick={() => moveItem(i, 'down')}
                          disabled={i === shuffled.length - 1}
                          className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-blue-600 rounded-lg disabled:opacity-0"
                       >
                          <ChevronDown className="w-4 h-4" />
                       </button>
                    </div>
                 )}

                 {feedback === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
              </div>
            ))}
         </div>

         {/* ACTION AREA */}
         <div className="flex flex-col items-center gap-6">
            {feedback !== 'success' ? (
              <button 
                 onClick={checkOrder}
                 className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-600/20 active:scale-95 transition-all text-xl"
              >
                 CHECK ORDER
              </button>
            ) : (
              <div className="px-8 py-4 bg-emerald-100 text-emerald-700 rounded-2xl font-black animate-in zoom-in duration-500">
                 Story Complete! Great Reading!
              </div>
            )}

            {/* Instruction Card */}
            <div className="w-full bg-slate-900 rounded-[32px] p-8 flex items-start gap-6 border border-slate-800 relative overflow-hidden">
               <GraduationCap className="w-10 h-10 text-blue-500 opacity-40 flex-shrink-0" />
               <div className="space-y-1 relative z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">Coaching Note</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     For children at the <span className="text-white font-bold">Story level</span>, logic is just as important as reading. Ask the child to explain *why* one sentence comes before another (e.g. &ldquo;We can&apos;t eat breakfast until we wake up!&rdquo;).
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
