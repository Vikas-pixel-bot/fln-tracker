"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Play, FileText, Gamepad2, GraduationCap, Download, ExternalLink, 
  ChevronRight, BookOpen, Lightbulb, BoxSelect, MonitorPlay, 
  SpellCheck, Binary, Info, Search, ClipboardPlus, 
  ArrowLeft, Zap, Trophy, Clock, CheckCircle2, Swords, 
  Sparkles, Calendar, Book, Calculator, Layout, Users, 
  Maximize2, Minimize2 
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VIDEOS, ARTICLES, SIMULATIONS, Resource } from "@/lib/resource_data";
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
import { logImplementationSession } from '@/app/actions/implementation';

// Simulations & Games Imports
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

// --- Sub-component: Mission Control (Integrated Version) ---
function MissionControl() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [step, setStep] = useState<'setup' | 'session' | 'summary'>('setup');
  const [classNum, setClassNum] = useState<number | null>(null);
  const [subject, setSubject] = useState<'language' | 'maths' | null>(null);
  const [dayNum, setDayNum] = useState<1 | 2>(1);
  const [teacherName, setTeacherName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [sessionStructure, setSessionStructure] = useState<SessionStructure | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
  const [activityLogs, setActivityLogs] = useState<Record<number, number>>({});
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).schoolName) {
        setSchoolName((session.user as any).schoolName);
      } else if (session.user.schoolId) {
        setSchoolName(`School ID: ${session.user.schoolId}`);
      }
      if (session.user.name) {
        setTeacherName(session.user.name);
      }
    }
  }, [session]);

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

  useEffect(() => {
    if (!classNum || !classStats) return;
    if (classNum <= 2) {
      setSessionStructure(GRADE_1_2_STRUCTURE);
    } else {
      if (subject === 'language') {
        setSessionStructure((classStats.majorityLevel ?? 0) >= 4 ? LANGUAGE_LEVEL_2 : LANGUAGE_LEVEL_1);
      } else if (subject === 'maths') {
        setSessionStructure((classStats.majorityLevel ?? 0) >= 3 ? MATH_LEVEL_2 : MATH_LEVEL_1);
      }
    }
  }, [classNum, subject, classStats]);

  useEffect(() => {
    if (sessionStructure && sessionStructure.activities[currentActivityIndex]) {
      const activity = sessionStructure.activities[currentActivityIndex];
      if (activity.daySpecific && activity.daySpecific !== dayNum) {
        if (currentActivityIndex < sessionStructure.activities.length - 1) {
          setCurrentActivityIndex(prev => prev + 1);
        } else {
          setStep('summary');
        }
        return;
      }
      setTimeLeft(activity.duration * 60);
      setBattleContext(null);
    }
  }, [currentActivityIndex, sessionStructure, dayNum]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'session') {
      interval = setInterval(() => {
        if (isTimerRunning && timeLeft > 0) {
          setTimeLeft(prev => prev - 1);
        }
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

  const handleFinishAndLog = async () => {
    if (!session?.user?.schoolId) {
      alert("Error: No School ID found in session. Please sign in again.");
      return;
    }

    setIsLogging(true);
    const totalSeconds = Object.values(activityLogs).reduce((acc, val) => acc + val, 0);
    
    const result = await logImplementationSession({
      schoolId: session.user.schoolId,
      teacherName: teacherName || session.user.name || "Anonymous",
      classNum: classNum || 0,
      subject: subject || undefined,
      totalDuration: totalSeconds,
      activityLogs: activityLogs
    });

    setIsLogging(false);
    if (result.success) {
      setLogSuccess(true);
    } else {
      alert("Failed to save implementation log. Please try again.");
    }
  };

  const currentActivity = sessionStructure?.activities[currentActivityIndex];
  const progress = sessionStructure ? ((currentActivityIndex) / sessionStructure.activities.length) * 100 : 0;
  const ActiveSimulation = useMemo(() => {
    if (!currentActivity?.simulationId) return null;
    return SIM_COMPONENTS[currentActivity.simulationId] || null;
  }, [currentActivity]);

  return (
    <div className={cn(
      "max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col transition-all",
      isFocusMode ? "fixed inset-0 z-[100] bg-white dark:bg-slate-950 p-4" : "min-h-[600px]"
    )}>
      {/* HUD */}
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
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">Daily Mission Flow</span>
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
                   <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                     {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                   </button>
                 </>
               )}
            </div>
          )}
        </div>
        {step !== 'setup' && !isFocusMode && (
          <div className="mt-8 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {step === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">Initiate Today&apos;s 90-Minute Flow</h2>
              <p className="text-slate-500 text-xl font-medium">Select your class and subject to begin the guided pedagogical sequence.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                   <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">School Name</p>
                      <input 
                        type="text" 
                        value={schoolName} 
                        readOnly
                        placeholder="Loading school..."
                        className="w-full h-14 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-6 font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed" 
                      />
                   </div>
                   <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Teacher Name</p>
                      <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" />
                   </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Classroom</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[1,2,3,4].map(n => (
                      <button key={n} onClick={() => setClassNum(n)} className={cn("h-14 rounded-2xl font-black text-lg transition-all", classNum === n ? "bg-blue-600 text-white shadow-xl scale-105" : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100")}>{n}</button>
                    ))}
                  </div>
                </div>
                {classNum && classNum >= 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Subject</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setSubject('language')} className={cn("h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all", subject === 'language' ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-800")}>
                        <Book className="w-5 h-5" /> Language
                      </button>
                      <button onClick={() => setSubject('maths')} className={cn("h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all", subject === 'maths' ? "bg-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800")}>
                        <Calculator className="w-5 h-5" /> Maths
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {classStats && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white"><Layout className="w-6 h-6" /></div>
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
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-3xl text-2xl shadow-2xl flex items-center justify-center gap-4 group transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoadingStats ? "Analyzing Stats..." : "INITIATE SESSION"} <Play className="w-8 h-8 fill-current group-hover:scale-110" />
              </button>
            </div>
          </div>
        )}

        {step === 'session' && currentActivity && (
          <div className={cn("flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-8", isFocusMode ? "space-y-4" : "space-y-8")}>
             {!isFocusMode && (
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-500/20">{currentActivity.type || "Activity"}</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{currentActivity.name}</h3>
                    <p className="text-slate-500 text-lg font-medium">{currentActivity.description}</p>
                  </div>
                  <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-lg", isTimerRunning ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white" : "bg-orange-500 text-white")}>
                    {isTimerRunning ? <Clock className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>
               </div>
             )}
             <div className={cn("flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[64px] border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col min-h-0", isFocusMode ? "rounded-3xl p-4" : "p-12")}>
                <div className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-0">
                   <div className={cn("w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative min-h-0 overflow-auto", isFocusMode ? "rounded-2xl p-4 h-full" : "p-12 min-h-[500px]")}>
                      {ActiveSimulation ? (
                        <div className="w-full h-full">
                           <ActiveSimulation player1={battleContext?.p1} player2={battleContext?.p2} schoolId={battleContext?.schoolId || "mock-school-id"} classNum={classNum || 1} isAdmin={true} />
                        </div>
                      ) : (currentActivity.name === "Role Play" || currentActivity.name === "The Battle Arena") ? (
                         <div className="space-y-6 text-center">
                            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mx-auto"><Swords className="w-12 h-12" /></div>
                            <h4 className="text-2xl font-black">Launch Battle Arena</h4>
                            <button onClick={() => setShowMatchmaker(true)} className="px-8 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all">OPEN MATCHMAKER</button>
                         </div>
                      ) : (
                         <div className="text-center space-y-8 opacity-20"><div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto">{subject === 'maths' ? <Calculator className="w-16 h-16" /> : <BookOpen className="w-16 h-16" />}</div><h4 className="text-3xl font-black italic">"Ready for Activity"</h4></div>
                      )}
                   </div>
                </div>
                <div className={cn("flex justify-between items-center relative z-10 mt-12", isFocusMode ? "mt-4" : "")}>
                   <div className="flex gap-2">
                    {sessionStructure?.activities.map((_, i) => (
                      <div key={i} className={cn("w-3 h-3 rounded-full transition-all", i === currentActivityIndex ? "bg-blue-500 w-8" : i < currentActivityIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800")} />
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {currentActivityIndex > 0 && !isFocusMode && (
                      <button onClick={() => setCurrentActivityIndex(prev => prev - 1)} className="px-8 py-5 bg-white dark:bg-slate-800 font-black rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">PREVIOUS</button>
                    )}
                    <button onClick={() => { if (currentActivityIndex < (sessionStructure?.activities.length ?? 0) - 1) { setCurrentActivityIndex(prev => prev + 1); } else { setStep('summary'); } }} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl flex items-center gap-3">
                      {currentActivityIndex < (sessionStructure?.activities.length ?? 0) - 1 ? "NEXT ACTIVITY" : "FINISH SESSION"} <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <BattleMatchmaker 
                  isOpen={showMatchmaker} onClose={() => setShowMatchmaker(false)} 
                  subject={subject === 'maths' ? 'numeracy' : 'literacy'} level={classStats?.majorityLevel ?? 1} 
                  gameTitle={currentActivity.name} isAdmin={true} 
                  onMatchComplete={(p1, p2, schoolId, cNum) => { setBattleContext({ p1, p2, schoolId, classNum: cNum }); setShowMatchmaker(false); }} 
                />
             </div>
          </div>
        )}

        {step === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 py-12">
            <div className="w-full max-w-4xl space-y-12">
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-white" /></div>
                 <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">Mission Accomplishment Report</h2>
                 <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-slate-500">
                    <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{schoolName}</span>
                    <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">Trainer: {teacherName}</span>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                 <table className="w-full text-left truncate"><thead className="bg-slate-50 dark:bg-slate-800/50"><tr><th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedagogical Activity</th><th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</th><th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actual</th><th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th></tr></thead>
                    <tbody>{sessionStructure?.activities.map((activity, i) => { const actualSecs = activityLogs[i] || 0; const targetSecs = activity.duration * 60; const diff = actualSecs - targetSecs; return (<tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"><td className="p-8 border-b border-slate-100 dark:border-slate-800"><p className="font-black">{activity.name}</p><p className="text-xs font-bold text-slate-400">{activity.type}</p></td><td className="p-8 border-b border-slate-100 space-y-1"><span className="font-mono text-slate-400">{activity.duration}m</span></td><td className="p-8 border-b border-slate-100 font-mono font-black">{Math.floor(actualSecs / 60)}m {actualSecs % 60}s</td><td className="p-8 border-b border-slate-100"><Zap className={cn("w-3 h-3 fill-current", diff > 60 ? "text-orange-500" : "text-emerald-500")} /></td></tr>)})}</tbody>
                 </table>
              </div>
              <div className="flex justify-center gap-6 pt-8">
                 <button 
                   onClick={handleFinishAndLog} 
                   disabled={isLogging || logSuccess}
                   className={cn(
                     "px-12 py-6 font-black rounded-3xl shadow-2xl hover:scale-105 transition-all text-xl flex items-center gap-3",
                     logSuccess 
                       ? "bg-emerald-500 text-white cursor-default" 
                       : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                   )}
                 >
                   {logSuccess ? (
                     <><CheckCircle2 className="w-6 h-6" /> LOGGED SUCCESSFULLY</>
                   ) : isLogging ? (
                     "LOGGING..."
                   ) : (
                     "FINISH & LOG"
                   )}
                 </button>
                 <button onClick={() => { setStep('setup'); setClassNum(null); setSubject(null); setIsFocusMode(false); setActivityLogs({}); setCurrentActivityIndex(0); setLogSuccess(false); }} className="px-12 py-6 bg-white dark:bg-slate-800 font-black rounded-3xl shadow-xl hover:scale-105 transition-all text-xl border border-slate-100 dark:border-slate-700">NEW MISSION</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Resources Page Component (Implementation Corner) ---
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"mission" | "videos" | "articles" | "simulations">("mission");
  const [searchTerm, setSearchTerm] = useState("");

  const TABS = [
    { id: "mission", label: "Mission Mode", icon: <ClipboardPlus className="w-5 h-5" /> },
    { id: "videos", label: "Training Videos", icon: <MonitorPlay className="w-5 h-5" /> },
    { id: "articles", label: "Coaching Articles", icon: <BookOpen className="w-5 h-5" /> },
    { id: "simulations", label: "Level Simulations", icon: <Gamepad2 className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" /> Implementation Corner
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Classroom <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-blue-500/30">Action Hub</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          The ultimate engine for FLN training and pedagogical execution. Run your 90-minute daily missions or sharpen your skills with our library.
        </p>
      </div>

      {/* Tabs Controller */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-900/5" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab !== "mission" && (
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 placeholder="Search resource..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
           </div>
        )}
      </div>

      {/* MISSION MODE - The Integrated Component */}
      {activeTab === "mission" && <MissionControl />}

      {/* Tab Content: VIDEOS */}
      {activeTab === "videos" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {VIDEOS.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase())).map((v, i) => (
            <div key={i} className="space-y-4 group">
               <div className="relative aspect-video rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5">
                  <iframe 
                     src={`https://www.youtube.com/embed/${v.id}`}
                     className="absolute inset-0 w-full h-full"
                     allowFullScreen
                  ></iframe>
               </div>
               <div className="px-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                       Level: {v.level || "General"}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{v.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{v.description}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: ARTICLES */}
      {activeTab === "articles" && (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {ARTICLES.filter(art => art.title.toLowerCase().includes(searchTerm.toLowerCase())).map((art, i) => (
             <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <BookOpen className="w-3 h-3" /> Teacher Insights
                </div>
                <div className="space-y-3">
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-all">{art.title}</h3>
                   <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{art.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                   {art.tags?.map(t => <span key={t} className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">#{t}</span>)}
                </div>
                <button className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">
                   Read Full Article <ChevronRight className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      )}

      {/* Tab Content: SIMULATIONS */}
      {activeTab === "simulations" && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {SIMULATIONS.filter(sim => sim.title.toLowerCase().includes(searchTerm.toLowerCase())).map((sim, i) => (
             <Link key={i} href={sim.link || "#"} className="group relative bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/5 hover:bg-blue-600 transition-all duration-500 overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-2xl group-hover:bg-white/20 transition-all">
                        <Gamepad2 className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-all">
                        Level: {sim.level}
                     </span>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-white transition-all leading-tight">
                        {sim.title}
                     </h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-100 transition-all">
                        {sim.description}
                     </p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 group-hover:border-white/20 flex items-center justify-between">
                     <span className="text-xs font-black text-blue-600 group-hover:text-white transition-all uppercase tracking-widest">Launch Tool</span>
                     <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-white transition-all" />
                  </div>
                </div>
             </Link>
           ))}
        </div>
      )}

      {/* Classroom Guide / Offline Section */}
      <div className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden text-center lg:text-left shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase">
                   <Lightbulb className="w-4 h-4" /> Pro Teacher Tip
                </div>
                <h2 className="text-4xl font-black text-white leading-tight underline decoration-blue-500/30 decoration-8 underline-offset-4">Need a quick refresher <br/>for tomorrow&apos;s Class?</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                   Download our level-specific &ldquo;Pedagogical Cheat-Sheets&rdquo; for at-a-glance grouping rules and activity targets.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                   <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                      <Download className="w-5 h-5"/> Download PDF Pack
                   </button>
                   <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center gap-2">
                       <ExternalLink className="w-5 h-5"/> Visit ASER Portal
                   </button>
                </div>
             </div>
             <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3 opacity-30">
                <div className="aspect-square bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center space-y-2">
                   <SpellCheck className="w-8 h-8 text-blue-600" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Literacy</span>
                </div>
                <div className="aspect-square bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center space-y-2 translate-y-6">
                   <Binary className="w-8 h-8 text-indigo-600" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math</span>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
