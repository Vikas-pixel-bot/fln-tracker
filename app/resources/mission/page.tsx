'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Play, Trophy, Clock, CheckCircle2, ChevronRight, Swords, Sparkles, BookOpen, Calendar, Book, Calculator, Layout, Users } from 'lucide-react';
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

export default function MissionControl() {
  const [step, setStep] = useState<'setup' | 'session' | 'summary'>('setup');
  const [classNum, setClassNum] = useState<number | null>(null);
  const [subject, setSubject] = useState<'language' | 'maths' | null>(null);
  const [dayNum, setDayNum] = useState<1 | 2>(1);
  const [classStats, setClassStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Session State
  const [sessionStructure, setSessionStructure] = useState<SessionStructure | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);

  useEffect(() => {
    if (classNum) {
      setIsLoadingStats(true);
      getClassStats("mock-school-id", classNum).then(stats => {
        setClassStats(stats);
        setIsLoadingStats(false);
      });
    }
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
    }
  }, [currentActivityIndex, sessionStructure, dayNum]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      // Auto-advance or alert could go here
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentActivity = sessionStructure?.activities[currentActivityIndex];
  const progress = sessionStructure 
    ? ((currentActivityIndex) / sessionStructure.activities.length) * 100 
    : 0;

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
                {step === 'setup' ? "Ready for Action?" : currentActivity?.name}
              </h1>
            </div>
          </div>

          {step !== 'setup' && (
            <div className="flex items-center gap-8 bg-black/20 p-6 rounded-[32px] border border-white/5">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phase Time</p>
                  <p className="text-4xl font-black text-white font-mono">{formatTime(timeLeft)}</p>
               </div>
               <div className="h-12 w-px bg-white/10" />
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Activity</p>
                  <p className="text-4xl font-black text-emerald-500">{currentActivityIndex + 1}/{sessionStructure?.activities.length}</p>
               </div>
            </div>
          )}
        </div>

        {/* Global Progress Bar */}
        {step !== 'setup' && (
          <div className="mt-8 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {step === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                Initiate Today's 90-Minute Flow
              </h2>
              <p className="text-slate-500 text-xl font-medium">
                Select your class and subject to begin the guided pedagogical sequence.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Select Class */}
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Classroom</p>
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
                    {subject === 'language' && classStats?.majorityLevel >= 4 && (
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
                         <p className="text-xl font-black text-slate-900 dark:text-white">Level {classStats.majorityLevel}</p>
                         <p className="text-sm font-bold text-slate-500">Majority {subject === 'maths' ? 'Numeracy' : 'Literacy'} Level</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{classStats.total}</p>
                      <p className="text-sm font-bold text-slate-500">Assessed Students</p>
                   </div>
                </div>
              )}

              <button 
                onClick={() => { setStep('session'); setIsTimerRunning(true); }}
                disabled={!classNum || (classNum >= 3 && !subject) || isLoadingStats}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-3xl text-2xl shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-4 group transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoadingStats ? "Analyzing Stats..." : "INITIATE SESSION"} <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'session' && currentActivity && (
          <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-8 duration-700">
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

             <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[64px] border border-slate-100 dark:border-slate-800 p-12 relative overflow-hidden flex flex-col">
                <div className="flex-1 relative z-10 flex flex-col items-center justify-center text-center space-y-12">
                   {/* PPT Content Placeholder */}
                   <div className="w-full max-w-4xl p-12 bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center space-y-8 relative group">
                      <div className="absolute top-6 left-6">
                         <Sparkles className="w-8 h-8 text-yellow-500" />
                      </div>
                      
                      {/* Integrated Tools for specific activities */}
                      {currentActivity.name === "Role Play" || currentActivity.name === "The Battle Arena" || currentActivity.name === "Play" ? (
                         <div className="space-y-6">
                            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mx-auto">
                               <Swords className="w-12 h-12" />
                            </div>
                            <h4 className="text-2xl font-black">Launch Competition</h4>
                            <button 
                              onClick={() => setShowMatchmaker(true)}
                              className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all"
                            >
                               OPEN MATCHMAKER
                            </button>
                         </div>
                      ) : (
                         <>
                            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-20">
                               {subject === 'maths' ? <Calculator className="w-16 h-16" /> : <BookOpen className="w-16 h-16" />}
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-3xl font-black text-slate-900 dark:text-white italic">"Pedagogical Material Display"</h4>
                               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for specific Story/Image uploads for LEVEL {classStats?.majorityLevel ?? 'X'}</p>
                            </div>
                         </>
                      )}
                   </div>

                   {/* Quick Tips */}
                   <div className="flex gap-4">
                      {['Think', 'Talk', 'Act'].map(t => (
                        <span key={t} className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-black text-slate-500 border border-slate-100 dark:border-slate-700 shadow-sm">
                           {t}
                        </span>
                      ))}
                   </div>
                </div>
                
                <div className="mt-12 flex justify-between items-center relative z-10">
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
                    {currentActivityIndex > 0 && (
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
                      className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
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
                  onMatchComplete={() => setShowMatchmaker(false)} 
                />
             </div>
          </div>
        )}

        {step === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-1000">
            <div className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[56px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-12 relative">
               <div className="absolute inset-0 bg-white opacity-20 rounded-[56px] scale-90 translate-y-2" />
               <CheckCircle2 className="w-20 h-20 text-white relative z-10" />
            </div>
            <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Mission Accomplished</h2>
            <p className="text-2xl text-slate-500 font-medium mt-6 max-w-2xl mx-auto">
              You've successfully completed the {subject ? subject.toUpperCase() : 'FLN'} 90-minute session for Class {classNum}. 
              Today's engagement data has been logged to the dashboard.
            </p>
            
            <div className="grid grid-cols-3 gap-8 w-full max-w-4xl mt-20">
               <SummaryStat label="Participation" value="98%" color="blue" />
               <SummaryStat label="Energy Level" value="High" color="orange" />
               <SummaryStat label="Battles Run" value="5" color="emerald" />
            </div>

            <div className="flex gap-6 mt-16">
               <Link href="/" className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-[32px] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl">
                 BACK TO DASHBOARD
               </Link>
               <button 
                 onClick={() => { setStep('setup'); setClassNum(null); setSubject(null); }}
                 className="px-12 py-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black rounded-[32px] shadow-xl hover:scale-105 active:scale-95 transition-all text-xl border border-slate-100 dark:border-slate-700"
               >
                 NEW SESSION
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }: any) {
  const colors: any = {
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
