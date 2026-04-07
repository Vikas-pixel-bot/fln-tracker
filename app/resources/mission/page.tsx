'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Play, Trophy, Clock, CheckCircle2, ChevronRight, Swords, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
 import { getMatchCandidates, getClassStats } from '@/app/actions';
import BattleMatchmaker from '@/components/simulations/BattleMatchmaker';

// We'll reuse our simulation definitions for suggestions
const SUGGESTIONS = [
  { id: "marathi-letters", title: "अक्षर ओळख (Letters)", level: "Letter", battleLevel: 1, subject: "Literacy", emoji: "अ" },
  { id: "num-race-b",      title: "Number Race",        level: "10-99",  battleLevel: 2, subject: "Numeracy", emoji: "🏁" },
  { id: "marathi-sent",    title: "वाक्य पूर्ण करा",     level: "Paragraph", battleLevel: 3, subject: "Battle", emoji: "📝" },
  { id: "sentence-arch",   title: "Sentence Architect", level: "Para/Story", battleLevel: 4, subject: "Literacy", emoji: "📜" },
];

export default function MissionControl() {
  const [step, setStep] = useState<'setup' | 'explore' | 'activity' | 'battle' | 'summary'>('setup');
  const [classNum, setClassNum] = useState<number | null>(null);
  const [classStats, setClassStats] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (classNum) {
      setIsLoadingStats(true);
      // In a real scenario, we'd get the schoolId from the session
      getClassStats("mock-school-id", classNum).then(stats => {
        setClassStats(stats);
        setIsLoadingStats(false);
      });
    }
  }, [classNum]);

  // Global Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((5400 - timeLeft) / 5400) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 min-h-[90vh] flex flex-col">
      
      {/* HUD: Global Mission Progress */}
      <div className="bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-500",
              isTimerRunning ? "bg-orange-500 animate-pulse shadow-orange-500/20" : "bg-slate-800"
            )}>
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Daily Mission Flow
                </span>
                {isTimerRunning && <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />}
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                {step === 'setup' ? "Ready for Action?" : 
                 step === 'explore' ? "Phase 1: Exploration" :
                 step === 'activity' ? "Phase 2: Interactive Game" :
                 step === 'battle' ? "Phase 3: The Battle Arena" : "Mission Complete!"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-black/20 p-6 rounded-[32px] border border-white/5">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Remaining</p>
                <p className="text-4xl font-black text-white font-mono">{formatTime(timeLeft)}</p>
             </div>
             <div className="h-12 w-px bg-white/10" />
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Rate</p>
                <p className="text-4xl font-black text-emerald-500">88%</p>
             </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {step === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                Accelerate Learning with the 90-Minute Flow
              </h2>
              <p className="text-slate-500 text-xl font-medium">
                Choose your class and start today's mission. We'll guide you through exploration, group activity, and a competitive battle.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xl space-y-8">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px] text-center">Step 1: Select Classroom</p>
                 <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <button 
                      key={n}
                      onClick={() => setClassNum(n)}
                      className={cn(
                        "h-14 rounded-2xl font-black text-lg transition-all",
                        classNum === n 
                          ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105" 
                          : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {classStats && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 animate-in zoom-in-95">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Class Intelligence</p>
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-3xl font-black text-slate-900 dark:text-white">Level {classStats.majorityLevel}</p>
                         <p className="text-sm font-bold text-slate-500">Majority Literacy Level</p>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-blue-600">{classStats.total}</p>
                         <p className="text-sm font-bold text-slate-500">Students</p>
                      </div>
                   </div>
                </div>
              )}

              <button 
                onClick={() => { setStep('explore'); setIsTimerRunning(true); }}
                disabled={!classNum || isLoadingStats}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-3xl text-2xl shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 group transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoadingStats ? "Analyzing..." : "START MISSION"} <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'explore' && (
          <PhaseView 
            title="Individual Exploration"
            timeLeft="30:00"
            color="blue"
            description="Students interact independently with level-appropriate simulations. Encourage them to master the Letter recognition tool today."
            onNext={() => setStep('activity')}
          >
            <div className="grid md:grid-cols-3 gap-6 pt-8">
               {SUGGESTIONS
                 .filter(s => !classStats || Math.abs((s.battleLevel || 0) - classStats.majorityLevel) <= 1)
                 .slice(0, 3)
                 .map(s => (
                 <SuggestionCard key={s.id} {...s} />
               ))}
            </div>
          </PhaseView>
        )}

        {step === 'activity' && (
          <PhaseView 
            title="Interactive Group Activity"
            timeLeft="30:00"
            color="indigo"
            description="Gather the students for a group-led activity. Use the Word Race simulation on the main tablet/screen."
            onNext={() => setStep('battle')}
          >
            <div className="flex-1 flex items-center justify-center">
               <div className="w-full max-w-4xl h-96 bg-slate-100 dark:bg-slate-800/40 rounded-[64px] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <BookOpen className="w-16 h-16 opacity-30" />
                  <p className="font-bold text-center italic">Launch a group game like 'Word Race' from the Simulations Gallery to engage the whole class.</p>
                  <Link href="/resources/simulations" className="px-6 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold shadow-sm hover:scale-105 transition-all">
                    Open Simulations Gallery
                  </Link>
               </div>
            </div>
          </PhaseView>
        )}

        {step === 'battle' && (
          <PhaseView 
            title="The 2v2 Battle Arena"
            timeLeft="30:00"
            color="orange"
            description="Select students of the same level to compete! This builds high-energy engagement and reinforces today's learning."
            onNext={() => setStep('summary')}
          >
            <div className="flex-1 flex flex-col items-center justify-center py-12">
               <div className="relative group cursor-pointer" onClick={() => setShowMatchmaker(true)}>
                  <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="w-32 h-32 bg-orange-500 rounded-[40px] flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
                     <Swords className="w-16 h-16 text-white" />
                  </div>
               </div>
               <h3 className="mt-8 text-2xl font-black text-slate-900 dark:text-white">Start Competition</h3>
               <p className="text-slate-500 font-medium mb-8">Tap above to launch the 2v2 Matchmaker</p>
               
               <BattleMatchmaker 
                 isOpen={showMatchmaker} 
                 onClose={() => setShowMatchmaker(false)} 
                 subject="literacy" 
                 level={1} 
                 gameTitle="ਅक्षर ओळख" 
                 isAdmin={true} 
                 onMatchComplete={(p1, p2) => {
                   setShowMatchmaker(false);
                   // Navigate to a battle or just log it
                 }} 
               />
            </div>
          </PhaseView>
        )}

        {step === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-1000">
            <div className="w-32 h-32 bg-emerald-500 rounded-[48px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-8">
               <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Mission Complete!</h2>
            <p className="text-xl text-slate-500 font-medium mt-4 max-w-xl">
              You've successfully completed the 90-minute daily flow. [School Name] is one step closer to 100% FLN mastery.
            </p>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mt-16">
               <SummaryStat label="Participation" value="95%" />
               <SummaryStat label="Levels Gained" value="+2" />
               <SummaryStat label="Battles Won" value="4" />
            </div>

            <Link href="/" className="mt-16 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl active:scale-95 transition-all">
              GO TO DASHBOARD
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

function PhaseView({ title, timeLeft, color, description, onNext, children }: any) {
  const colorStyles: any = {
    blue: "from-blue-600 to-indigo-600 shadow-blue-500/20",
    indigo: "from-indigo-600 to-violet-600 shadow-indigo-500/20",
    orange: "from-orange-500 to-red-600 shadow-orange-500/20",
  };
  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-8 duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black flex items-center gap-2">
               <Sparkles className="w-6 h-6 text-yellow-500" /> {title}
            </h3>
            <p className="text-slate-500 font-medium max-w-2xl">{description}</p>
          </div>
          <div className={cn("px-8 py-4 rounded-[32px] bg-gradient-to-r text-white shadow-xl flex items-center gap-4 shrink-0", colorStyles[color])}>
             <Clock className="w-6 h-6" />
             <span className="text-2xl font-black font-mono">{timeLeft}</span>
          </div>
       </div>

       <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[64px] border border-slate-100 dark:border-slate-800 p-12 relative overflow-hidden flex flex-col">
          <div className="flex-1 relative z-10 flex flex-col">
             {children}
          </div>
          
          <div className="mt-12 flex justify-end relative z-10">
            <button 
              onClick={onNext}
              className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 border border-slate-100 dark:border-slate-700"
            >
              NEXT PHASE <ChevronRight className="w-6 h-6" />
            </button>
          </div>
       </div>
    </div>
  );
}

function SuggestionCard({ title, level, subject, emoji }: any) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group cursor-pointer hover:-translate-y-2">
       <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
          {emoji}
       </div>
       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{subject} · Lvl {level}</p>
       <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{title}</h4>
       <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 underline">Preview Tool</span>
          <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180 group-hover:translate-x-1 transition-transform" />
       </div>
    </div>
  );
}

function SummaryStat({ label, value }: any) {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
       <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
    </div>
  );
}
