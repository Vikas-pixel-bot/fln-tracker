'use client';
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Zap, Play, Trophy, Clock, CheckCircle2, ChevronRight, Swords, Sparkles, BookOpen, Calendar, Book, Calculator, Layout, Users, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { getMatchCandidates, getClassStats } from '@/app/actions';
import BattleMatchmaker from '@/components/simulations/BattleMatchmaker';
import { 
  GRADE_1_2_STRUCTURE, 
  LANGUAGE_LEVEL_1, 
  LANGUAGE_LEVEL_2, 
  MATH_LEVEL_1, 
  MATH_LEVEL_2, 
  SessionStructure,
  SessionActivity
} from '@/lib/session_content';
import React from 'react';

interface ClassStats {
  majorityLevel: number;
  total: number;
}

interface BattleContext {
  p1: any;
  p2: any;
  schoolId: string;
  classNum: number;
}

// Simulations
import BundleBuilder from "@/components/simulations/BundleBuilder";
import NumberHunter from "@/components/simulations/NumberHunter";
import AdditionMaster from "@/components/simulations/AdditionMaster";
import SoundExplorer from "@/components/simulations/SoundExplorer";
import WordBuilder from "@/components/simulations/WordBuilder";
import SentenceArchitect from "@/components/simulations/SentenceArchitect";
import MathSprint from "@/components/simulations/MathSprint";
import SoundDuel from "@/components/simulations/SoundDuel";
import LetterFlash from "@/components/simulations/LetterFlash";
import WordRace from "@/components/simulations/WordRace";
import SentenceFill from "@/components/simulations/SentenceFill";
import MathDuel from "@/components/simulations/MathDuel";
import NumberRace from "@/components/simulations/NumberRace";
import PlaceValueBattle from "@/components/simulations/PlaceValueBattle";

// Games
import CountingStones from "@/components/games/CountingStones";
import BiggerSmaller from "@/components/games/BiggerSmaller";
import LetterPicker from "@/components/games/LetterPicker";
import OddOneOut from "@/components/games/OddOneOut";
import FishGame from "@/components/games/FishGame";
import MissingLetter from "@/components/games/MissingLetter";
import RhymeTime from "@/components/games/RhymeTime";
import TrueFalse from "@/components/games/TrueFalse";
import SentenceBuilder from "@/components/games/SentenceBuilder";
import StorySequence from "@/components/games/StorySequence";
import NumberTrain from "@/components/games/NumberTrain";
import WeightMatcher from "@/components/games/WeightMatcher";
import PlaceValue from "@/components/games/PlaceValue";
import NumberBonds from "@/components/games/NumberBonds";
import MarketMath from "@/components/games/MarketMath";
import NumberRiver from "@/components/games/NumberRiver";
import ClockReader from "@/components/games/ClockReader";
import SortingHat from "@/components/games/SortingHat";

const SIM_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "bundle-builder": BundleBuilder,
  "number-hunter": NumberHunter,
  "addition-master": AdditionMaster,
  "sound-explorer": SoundExplorer,
  "word-builder": WordBuilder,
  "sentence-arch": SentenceArchitect,
  "math-sprint": MathSprint,
  "sound-duel": SoundDuel,
  "marathi-letters": LetterFlash,
  "marathi-words": WordRace,
  "marathi-sent": SentenceFill,
  "math-duel-b": MathDuel,
  "num-race-b": NumberRace,
  "pv-battle-b": PlaceValueBattle,
  "g-oddone": OddOneOut,
  "g-letters": LetterPicker,
  "g-missing": MissingLetter,
  "g-fish": FishGame,
  "g-rhyme": RhymeTime,
  "g-sentence": SentenceBuilder,
  "g-story": StorySequence,
  "g-true": TrueFalse,
  "g-bigger": BiggerSmaller,
  "g-counting": CountingStones,
  "g-train": NumberTrain,
  "g-weights": WeightMatcher,
  "g-place": PlaceValue,
  "g-bonds": NumberBonds,
  "g-market": MarketMath,
  "g-river": NumberRiver,
  "g-clock": ClockReader,
  "g-sorting": SortingHat
};

export default function MissionControl() {
  const [step, setStep] = useState<'setup' | 'session' | 'summary'>('setup');
  const [classNum, setClassNum] = useState<number | null>(null);
  const [subject, setSubject] = useState<'language' | 'maths' | null>(null);
  const [dayNum, setDayNum] = useState<1 | 2>(1);
  const [teacherName, setTeacherName] = useState("");
  const [schoolName, setSchoolName] = useState("Vikas Public School"); // Default or from session
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Session State
  const [sessionStructure, setSessionStructure] = useState<SessionStructure | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
  const [activityLogs, setActivityLogs] = useState<Record<number, number>>({});

  useEffect(() => {
    let active = true;
    if (classNum) {
      setIsLoadingStats(true);
      getClassStats("mock-school-id", classNum).then(stats => {
        if (!active) return;
        setClassStats(stats);
        setIsLoadingStats(false);
      });
    }
    return () => { active = false; };
  }, [classNum]);

  // Determine Session Structure
  useEffect(() => {
    if (!classNum || !classStats) return;

    if (classNum <= 2) {
      setSessionStructure(GRADE_1_2_STRUCTURE);
    } else {
      if (subject === 'language') {
        setSessionStructure(classStats.majorityLevel >= 4 ? LANGUAGE_LEVEL_2 : LANGUAGE_LEVEL_1);
      } else if (subject === 'maths') {
        setSessionStructure(classStats.majorityLevel >= 3 ? MATH_LEVEL_2 : MATH_LEVEL_1);
      }
    }
  }, [classNum, subject, classStats]);

  // Set initial timer when activity changes
  useEffect(() => {
    if (sessionStructure && sessionStructure.activities[currentActivityIndex]) {
      const activity = sessionStructure.activities[currentActivityIndex];
      // Check if this activity is day-specific
      if (activity.daySpecific && activity.daySpecific !== dayNum) {
        // Skip this activity if it's not for today
        if (currentActivityIndex < sessionStructure.activities.length - 1) {
          setCurrentActivityIndex(prev => prev + 1);
        } else {
          setStep('summary');
        }
        return;
      }
      setTimeLeft(activity.duration * 60);
      setBattleContext(null); // Clear previous battle context
    }
  }, [currentActivityIndex, sessionStructure, dayNum]);

  // Timer Logic & Heartbeat Tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'session') {
      interval = setInterval(() => {
        // Countdown timer (visual only)
        if (isTimerRunning && timeLeft > 0) {
          setTimeLeft(prev => prev - 1);
        }
        
        // Cumulative activity tracking (heartbeat)
        setActivityLogs(prev => ({
          ...prev,
          [currentActivityIndex]: (prev[currentActivityIndex] || 0) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isTimerRunning, timeLeft, currentActivityIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentActivity = sessionStructure?.activities[currentActivityIndex];
  const progress = sessionStructure 
    ? ((currentActivityIndex) / sessionStructure.activities.length) * 100 
    : 0;

  const ActiveSimulation = useMemo(() => {
    if (!currentActivity?.simulationId) return null;
    return SIM_COMPONENTS[currentActivity.simulationId] || null;
  }, [currentActivity]);

  return (
    <div className={cn(
      "max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 flex flex-col transition-all",
      isFocusMode ? "max-w-full h-screen py-4 space-y-4" : "min-h-[90vh]"
    )}>
      
      {/* HUD: Global Mission Progress */}
      <div className={cn(
        "bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group transition-all",
        isFocusMode ? "p-4 py-4 rounded-3xl" : ""
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-6">
            <div className={cn(
              "rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-500",
              isTimerRunning ? "bg-orange-500 animate-pulse shadow-orange-500/20" : "bg-slate-800",
              isFocusMode ? "w-12 h-12 rounded-xl" : "w-20 h-20"
            )}>
              <Clock className={cn("text-white", isFocusMode ? "w-6 h-6" : "w-10 h-10")} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Daily Mission Flow
                </span>
                {isTimerRunning && <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />}
              </div>
              <h1 className={cn("font-black text-white tracking-tighter", isFocusMode ? "text-xl" : "text-4xl")}>
                {step === 'setup' ? "Ready for Action?" : currentActivity?.name}
              </h1>
            </div>
          </div>

          {step !== 'setup' && (
            <div className={cn("flex items-center gap-8 bg-black/20 rounded-[32px] border border-white/5", isFocusMode ? "p-3 px-6 rounded-2xl gap-4" : "p-6")}>
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phase Time</p>
                  <p className={cn("font-black text-white font-mono", isFocusMode ? "text-2xl" : "text-4xl")}>{formatTime(timeLeft)}</p>
               </div>
               <div className="h-8 w-px bg-white/10" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Activity</p>
                  <p className={cn("font-black text-emerald-500", isFocusMode ? "text-2xl" : "text-4xl")}>{currentActivityIndex + 1}/{sessionStructure?.activities.length}</p>
               </div>
               {step === 'session' && (
                 <>
                   <div className="h-8 w-px bg-white/10" />
                   <button 
                     onClick={() => setIsFocusMode(!isFocusMode)}
                     className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                   >
                     {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                   </button>
                 </>
               )}
            </div>
          )}
        </div>

        {/* Global Progress Bar */}
        {step !== 'setup' && !isFocusMode && (
          <div className="mt-8 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {step === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                Initiate Today&apos;s 90-Minute Flow
              </h2>
              <p className="text-slate-500 text-xl font-medium">
                Select your class and subject to begin the guided pedagogical sequence.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* School & Teacher Info */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                   <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">School Name</p>
                      <input 
                        type="text" 
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter School..."
                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-slate-700 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                   </div>
                   <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Teacher Name</p>
                      <input 
                        type="text" 
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Trainer Name..."
                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-slate-700 dark:text-white placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                   </div>
                </div>

                {/* Select Class */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Classroom</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[1,2,3,4].map(n => (
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

                {/* Select Subject (only for 3+) */}
                {classNum && classNum >= 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Subject</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setSubject('language')}
                        className={cn(
                          "h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all",
                          subject === 'language' ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                        )}
                      >
                        <Book className="w-5 h-5" /> Language
                      </button>
                      <button 
                        onClick={() => setSubject('maths')}
                        className={cn(
                          "h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all",
                          subject === 'maths' ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                        )}
                      >
                        <Calculator className="w-5 h-5" /> Maths
                      </button>
                    </div>

                    {/* Day Selection for Language Level 2 */}
                    {subject === 'language' && (classStats?.majorityLevel ?? 0) >= 4 && (
                       <div className="pt-2 animate-in fade-in zoom-in-95">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Select Cycle Day</p>
                          <div className="flex gap-2">
                             {[1,2].map(d => (
                                <button 
                                  key={d}
                                  onClick={() => setDayNum(d as 1 | 2)}
                                  className={cn(
                                    "flex-1 h-10 rounded-xl font-black text-sm transition-all",
                                    dayNum === d ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                  )}
                                >
                                  Day {d}
                                </button>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
                )}
              </div>

              {classStats && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 animate-in zoom-in-95 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                         <Layout className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-xl font-black text-slate-900 dark:text-white">Level {classStats?.majorityLevel ?? "N/A"}</p>
                         <p className="text-sm font-bold text-slate-500">Majority {subject === 'maths' ? 'Numeracy' : 'Literacy'} Level</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{classStats?.total ?? 0}</p>
                      <p className="text-sm font-bold text-slate-500">Assessed Students</p>
                   </div>
                </div>
              )}

              <button 
                onClick={() => { setStep('session'); setIsTimerRunning(true); }}
                disabled={!classNum || (classNum >= 3 && !subject) || !teacherName || !schoolName || isLoadingStats}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-3xl text-2xl shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 group transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoadingStats ? "Analyzing Stats..." : "INITIATE SESSION"} <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'session' && currentActivity && (
          <div className={cn("flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-8 duration-700", isFocusMode ? "space-y-4" : "space-y-8")}>
             {!isFocusMode && (
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                          {currentActivity.type || "Activity"}
                       </span>
                       {currentActivity.daySpecific && (
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-500/20">
                             Day {currentActivity.daySpecific} Feature
                          </span>
                       )}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                       {currentActivity.name}
                    </h3>
                    <p className="text-slate-500 text-lg font-medium max-w-3xl">
                       {currentActivity.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={cn(
                        "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-lg",
                        isTimerRunning ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white" : "bg-orange-500 text-white"
                      )}
                    >
                      {isTimerRunning ? <Clock className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>
                  </div>
               </div>
             )}

             <div className={cn(
               "flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[64px] border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col min-h-0",
               isFocusMode ? "rounded-3xl p-4" : "p-12"
             )}>
                <div className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-0">
                   
                   {/* Main Content Area: Simulation or Activity */}
                   <div className={cn(
                     "w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative group min-h-0 overflow-auto",
                     isFocusMode ? "rounded-2xl p-4 h-full" : "p-12 min-h-[500px]"
                   )}>
                      
                      {ActiveSimulation ? (
                        <div className="w-full h-full">
                           <ActiveSimulation 
                              player1={battleContext?.p1} 
                              player2={battleContext?.p2}
                              schoolId={battleContext?.schoolId || "mock-school-id"}
                              classNum={classNum || 1}
                              isAdmin={true}
                              onComplete={() => {
                                // Potentially auto-advance or just mark done
                              }}
                           />
                        </div>
                      ) : (currentActivity.name === "Role Play" || currentActivity.name === "The Battle Arena" || currentActivity.name === "Play") ? (
                         <div className="space-y-6 text-center py-20">
                            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mx-auto">
                               <Swords className="w-12 h-12" />
                            </div>
                            <h4 className="text-2xl font-black">Launch Battle Arena</h4>
                            <p className="text-slate-500 max-w-sm mx-auto">Select two students at the correct level to compete in a head-to-head TaRL challenge.</p>
                            <button 
                              onClick={() => setShowMatchmaker(true)}
                              className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all"
                            >
                               OPEN MATCHMAKER
                            </button>
                         </div>
                      ) : (
                         <div className="text-center space-y-8">
                            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-20">
                               {subject === 'maths' ? <Calculator className="w-16 h-16" /> : <BookOpen className="w-16 h-16" />}
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-3xl font-black text-slate-900 dark:text-white italic">"Ready for Activity"</h4>
                               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Please use the Manual-Based Methodology for {currentActivity.name}</p>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Quick Tips */}
                   {!isFocusMode && (
                     <div className="mt-8 flex gap-4">
                        {['Think', 'Talk', 'Act'].map(t => (
                          <span key={t} className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-black text-slate-500 border border-slate-100 dark:border-slate-700 shadow-sm">
                             {t}
                          </span>
                        ))}
                     </div>
                   )}
                </div>
                
                <div className={cn("flex justify-between items-center relative z-10", isFocusMode ? "mt-4 pt-2 border-t border-white/5" : "mt-12")}>
                  <div className="flex gap-2">
                    {sessionStructure?.activities.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500",
                          i === currentActivityIndex ? "bg-blue-500 w-8" : i < currentActivityIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {currentActivityIndex > 0 && !isFocusMode && (
                       <button 
                         onClick={() => setCurrentActivityIndex(prev => prev - 1)}
                         className="px-8 py-5 bg-white dark:bg-slate-800 text-slate-500 font-black rounded-3xl shadow-lg hover:scale-105 transition-all border border-slate-100 dark:border-slate-700"
                       >
                         PREVIOUS
                       </button>
                    )}
                    <button 
                      onClick={() => {
                        if (currentActivityIndex < (sessionStructure?.activities.length ?? 0) - 1) {
                          setCurrentActivityIndex(prev => prev + 1);
                        } else {
                          setStep('summary');
                        }
                      }}
                      className={cn(
                        "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-3",
                        isFocusMode ? "px-6 py-3 rounded-xl text-sm" : "px-10 py-5"
                      )}
                    >
                      {currentActivityIndex < (sessionStructure?.activities.length ?? 0) - 1 ? "NEXT ACTIVITY" : "FINISH SESSION"} <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <BattleMatchmaker 
                  isOpen={showMatchmaker} 
                  onClose={() => setShowMatchmaker(false)} 
                  subject={subject === 'maths' ? 'numeracy' : 'literacy'}
                  level={classStats?.majorityLevel ?? 1} 
                  gameTitle={currentActivity.name} 
                  isAdmin={true} 
                  onMatchComplete={(p1, p2, schoolId, cNum) => {
                    setBattleContext({ p1, p2, schoolId, classNum: cNum });
                    setShowMatchmaker(false);
                  }} 
                />
             </div>
          </div>
        )}

        {step === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000 py-12">
            <div className="w-full max-w-4xl space-y-12">
              
              {/* Report Header */}
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                 </div>
                 <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic capitalize">Mission Accomplishment Report</h2>
                 <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-slate-500">
                    <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{schoolName}</span>
                    <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">Class {classNum} • {subject?.toUpperCase()}</span>
                    <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">Trainer: {teacherName}</span>
                 </div>
              </div>

              {/* Activity Breakdown Table */}
              <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Pedagogical Activity</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Target</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Actual Duration</th>
                          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Performance</th>
                       </tr>
                    </thead>
                    <tbody>
                       {sessionStructure?.activities.map((activity, i) => {
                          const actualSecs = activityLogs[i] || 0;
                          const targetSecs = activity.duration * 60;
                          const diff = actualSecs - targetSecs;
                          
                          let status = "On Track";
                          let statusColor = "text-emerald-500";
                          if (Math.abs(diff) < 30) { status = "Perfect Tempo"; statusColor = "text-blue-500"; }
                          else if (diff > 60) { status = "Duration Extended"; statusColor = "text-orange-500"; }
                          else if (diff < -60) { status = "Condensed Phase"; statusColor = "text-indigo-500"; }

                          return (
                             <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="p-8 border-b border-slate-100 dark:border-slate-800">
                                   <p className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{activity.name}</p>
                                   <p className="text-xs font-bold text-slate-400">{activity.type}</p>
                                </td>
                                <td className="p-8 border-b border-slate-100 dark:border-slate-800">
                                   <span className="font-mono font-bold text-slate-400">{activity.duration}m</span>
                                </td>
                                <td className="p-8 border-b border-slate-100 dark:border-slate-800">
                                   <span className="font-mono font-black text-slate-900 dark:text-white">
                                      {Math.floor(actualSecs / 60)}m {actualSecs % 60}s
                                   </span>
                                </td>
                                <td className="p-8 border-b border-slate-100 dark:border-slate-800">
                                   <div className={cn("flex items-center gap-2 font-black text-[10px] uppercase tracking-widest", statusColor)}>
                                      <Zap className="w-3 h-3 fill-current" /> {status}
                                   </div>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>

              {/* Total Summary */}
              <div className="grid md:grid-cols-3 gap-8">
                 <SummaryStat 
                    label="Total Mission Time" 
                    value={`${Math.floor(Object.values(activityLogs).reduce((a, b) => a + b, 0) / 60)}m`} 
                    color="blue" 
                 />
                 <SummaryStat 
                    label="Efficiency Rating" 
                    value="Optimal" 
                    color="emerald" 
                 />
                 <SummaryStat 
                    label="Pedagogical Score" 
                    value="9.4" 
                    color="orange" 
                 />
              </div>

              <div className="flex justify-center gap-6 pt-8">
                 <Link href="/" className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl">
                   LOG & EXIT MISSION
                 </Link>
                 <button 
                   onClick={() => { 
                      setStep('setup'); 
                      setClassNum(null); 
                      setSubject(null); 
                      setIsFocusMode(false); 
                      setActivityLogs({}); 
                      setCurrentActivityIndex(0);
                   }}
                   className="px-12 py-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all text-xl border border-slate-100 dark:border-slate-700"
                 >
                   NEW SESSION
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }: { label: string, value: string, color: 'blue' | 'orange' | 'emerald' }) {
  const colors = {
    blue: "text-blue-600",
    orange: "text-orange-500",
    emerald: "text-emerald-500"
  };
  return (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
       <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px] mb-4 text-center">{label}</p>
       <p className={cn("text-5xl font-black tracking-tighter text-center", colors[color])}>{value}</p>
    </div>
  );
}
