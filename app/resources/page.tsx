"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Play, Gamepad2, GraduationCap, ExternalLink, Download,
  ChevronRight, BookOpen, Lightbulb, MonitorPlay,
  SpellCheck, Binary, Search, ClipboardPlus,
  Clock, CheckCircle2, Swords,
  Book, Calculator,
  Maximize2, Minimize2
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VIDEOS, ARTICLES, SIMULATIONS } from "@/lib/resource_data";
import { cn } from "@/lib/utils";
import BattleMatchmaker from '@/components/simulations/BattleMatchmaker';
import {
  getSessionPlan,
  SessionPlan,
  LevelGroup,
  SessionActivity,
  GROUP_COLORS
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
import MatraPractice from "@/components/games/MatraPractice";
import StoryReader from "@/components/simulations/StoryReader";
import TiliBundleDuel from "@/components/simulations/TiliBundleDuel";
import SankhyaChakra from "@/components/simulations/SankhyaChakra";
import DigitalAbacus from "@/components/simulations/DigitalAbacus";
import MultiplicationSim from "@/components/simulations/MultiplicationSim";
import DivisionSim from "@/components/simulations/DivisionSim";
import RepeatedAddition from "@/components/simulations/RepeatedAddition";
import FractionViz from "@/components/simulations/FractionViz";
import EqualSharing from "@/components/simulations/EqualSharing";
import Chaudakhadi from "@/components/simulations/Chaudakhadi";
import NumberLine from "@/components/simulations/NumberLine";

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
  "g-sorting": SortingHat,
  "g-matra": MatraPractice,
  "story-reader": StoryReader,
  "tili-bundle-duel": TiliBundleDuel,
  "sankhya-chakra": SankhyaChakra,
  "digital-abacus": DigitalAbacus,
  "multiplication-sim": MultiplicationSim,
  "division-sim": DivisionSim,
  "repeated-addition": RepeatedAddition,
  "fraction-viz": FractionViz,
  "equal-sharing": EqualSharing,
  "chaudakhadi": Chaudakhadi,
  "number-line": NumberLine,
};

interface BattleContext {
  p1: any;
  p2: any;
  schoolId: string;
  classNum: number;
}

// --- Sub-component: Mission Control ---
function MissionControl() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [step, setStep] = useState<'setup' | 'session' | 'summary'>('setup');
  const [classNum, setClassNum] = useState<number | null>(null);
  const [subject, setSubject] = useState<'language' | 'maths' | null>(null);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number | null>(null);
  const [dayNum, setDayNum] = useState<1 | 2>(1);
  const [teacherName, setTeacherName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [sessionPlan, setSessionPlan] = useState<SessionPlan | null>(null);
  const [groupActivityIdx, setGroupActivityIdx] = useState<number[]>([0, 0]);
  const [selectedDetail, setSelectedDetail] = useState<{ groupIdx: number; actIdx: number } | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [allSchools, setAllSchools] = useState<any[]>([]);

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'ADMIN';
  // If teacher picked a specific group, treat as single-group session for that group only
  const activeGroupIdx = selectedGroupIdx ?? 0;
  const needsGroupPick = !!sessionPlan && sessionPlan.groups.length > 1;
  const isSingleGroup = !sessionPlan || sessionPlan.groups.length === 1 || selectedGroupIdx !== null;
  const hasDayToggle = sessionPlan?.subject === 'language' && selectedGroupIdx === 1; // only Pushpagandh

  const getVisibleActivities = (group: LevelGroup) =>
    group.activities.filter(a => !a.daySpecific || a.daySpecific === dayNum);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any).schoolName && !schoolName) {
        setSchoolName((session.user as any).schoolName);
        setSchoolId((session.user as any).schoolId);
      } else if (session.user.schoolId && !schoolId) {
        setSchoolId(session.user.schoolId);
      }
      if (session.user.name && !teacherName) setTeacherName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (isAdmin) {
      import("@/app/actions").then(a => a.getSchools().then(setAllSchools));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!classNum) { setSessionPlan(null); return; }
    if (classNum >= 3 && !subject) { setSessionPlan(null); return; }
    const plan = getSessionPlan(classNum, subject || undefined);
    setSessionPlan(plan);
    setGroupActivityIdx(plan.groups.map(() => 0));
    setSelectedDetail(null);
    setCompletedActivities(new Set());
    setSelectedGroupIdx(null);
  }, [classNum, subject]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'session' && isTimerRunning) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, isTimerRunning]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const toggleComplete = (groupIdx: number, actIdx: number) => {
    const key = `${groupIdx}-${actIdx}`;
    setCompletedActivities(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalActivities = sessionPlan
    ? (selectedGroupIdx !== null
        ? getVisibleActivities(sessionPlan.groups[selectedGroupIdx]).length
        : sessionPlan.groups.reduce((s, g) => s + getVisibleActivities(g).length, 0))
    : 0;
  const totalCompleted = completedActivities.size;

  const selectedActivity = selectedDetail && sessionPlan
    ? sessionPlan.groups[selectedDetail.groupIdx]?.activities[selectedDetail.actIdx]
    : null;

  const ActiveSimulation = useMemo(() => {
    if (!selectedActivity?.simulationId) return null;
    return SIM_COMPONENTS[selectedActivity.simulationId] || null;
  }, [selectedActivity]);

  const getNextDetail = () => {
    if (!selectedDetail || !sessionPlan) return null;
    const { groupIdx, actIdx } = selectedDetail;
    const group = sessionPlan.groups[groupIdx];
    const visible = getVisibleActivities(group);
    const curVis = visible.findIndex(a => group.activities.indexOf(a) === actIdx);
    // Still have activities in this group
    if (curVis < visible.length - 1) {
      const next = visible[curVis + 1];
      return { groupIdx, actIdx: group.activities.indexOf(next) };
    }
    // Only advance to next group if teacher is running all groups (isSingleGroup = false)
    if (!isSingleGroup && groupIdx < sessionPlan.groups.length - 1) {
      const ng = sessionPlan.groups[groupIdx + 1];
      const nv = getVisibleActivities(ng);
      if (nv.length > 0) return { groupIdx: groupIdx + 1, actIdx: ng.activities.indexOf(nv[0]) };
    }
    return null;
  };

  const resetSession = () => {
    setStep('setup'); setClassNum(null); setSubject(null); setSelectedGroupIdx(null); setIsFocusMode(false);
    setGroupActivityIdx([0, 0]); setCompletedActivities(new Set());
    setElapsed(0); setLogSuccess(false); setSelectedDetail(null);
  };

  const handleFinishAndLog = async () => {
    if (!schoolId) {
      alert("Error: No School selected. Please select a school.");
      return;
    }
    setIsLogging(true);
    const result = await logImplementationSession({
      schoolId,
      teacherName: teacherName || session?.user?.name || "Anonymous",
      classNum: classNum || 0,
      subject: subject || undefined,
      totalDuration: elapsed,
      activityLogs: { completed: Array.from(completedActivities), groupProgress: groupActivityIdx },
    });
    setIsLogging(false);
    if (result.success) setLogSuccess(true);
    else alert("Failed to save implementation log. Please try again.");
  };

  return (
    <div className={cn(
      "max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 flex flex-col",
      isFocusMode ? "fixed inset-0 z-[100] bg-white dark:bg-slate-950 p-4" : "min-h-[600px]"
    )}>
      {/* ── HUD ── */}
      <div className={cn(
        "bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden",
        isFocusMode ? "p-4 rounded-3xl" : "p-8"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={cn(
              "rounded-[32px] flex items-center justify-center shadow-2xl transition-all",
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
                {step === 'setup' ? "Ready for Action?" : `Class ${classNum}${subject ? ` — ${subject === 'maths' ? 'Maths' : 'Language'}` : ''}${selectedGroupIdx !== null && sessionPlan ? ` · ${sessionPlan.groups[selectedGroupIdx].name}` : ''}`}
              </h1>
            </div>
          </div>
          {step !== 'setup' && (
            <div className={cn("flex items-center gap-5 bg-black/20 rounded-[32px] border border-white/5", isFocusMode ? "p-3 px-5 rounded-2xl gap-3" : "p-6")}>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Elapsed</p>
                <p className={cn("font-black text-white font-mono", isFocusMode ? "text-2xl" : "text-4xl")}>{formatTime(elapsed)}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Done</p>
                <p className={cn("font-black text-emerald-500", isFocusMode ? "text-2xl" : "text-4xl")}>{totalCompleted}/{totalActivities}</p>
              </div>
              {hasDayToggle && step === 'session' && (
                <>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Day</p>
                    <div className="flex gap-1">
                      {([1, 2] as const).map(d => (
                        <button key={d} onClick={() => setDayNum(d)}
                          className={cn("w-10 h-10 rounded-xl font-black text-sm transition-all",
                            dayNum === d ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600")}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {step === 'session' && (
                <>
                  <div className="h-8 w-px bg-white/10" />
                  <button onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      isTimerRunning ? "bg-white/10 text-white" : "bg-orange-500 text-white")}>
                    {isTimerRunning ? <Clock className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <button onClick={() => setIsFocusMode(!isFocusMode)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                    {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {step !== 'setup' && !isFocusMode && (
          <div className="mt-6 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${totalActivities ? (totalCompleted / totalActivities) * 100 : 0}%` }} />
          </div>
        )}
      </div>

      {/* ── SETUP ── */}
      {step === 'setup' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
          <div className="text-center max-w-2xl space-y-4">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">Initiate Today&apos;s 90-Minute Flow</h2>
            <p className="text-slate-500 text-xl font-medium">Select your class and subject to begin the guided pedagogical sequence.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl space-y-8">
            {/* School + Teacher */}
            <div className="grid grid-cols-2 gap-4 pb-8 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-3">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">School Name</p>
                {isAdmin ? (
                  <div className="relative">
                    <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)}
                      placeholder="Type to search schools..."
                      className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" />
                    {schoolName && !allSchools.find(s => s.name === schoolName) && allSchools.filter(s => s.name.toLowerCase().includes(schoolName.toLowerCase())).length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {allSchools.filter(s => s.name.toLowerCase().includes(schoolName.toLowerCase())).map(s => (
                          <button key={s.id} onClick={() => { setSchoolName(s.name); setSchoolId(s.id); }}
                            className="w-full px-6 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors border-b border-slate-50 dark:border-slate-800 last:border-none">
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input type="text" value={schoolName} readOnly placeholder="Loading school..."
                    className="w-full h-14 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-6 font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                )}
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Teacher Name</p>
                <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)}
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>

            {/* Class 1–4 */}
            <div className="space-y-3">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Classroom</p>
              <div className="grid grid-cols-4 gap-3">
                {[1,2,3,4].map(n => (
                  <button key={n} onClick={() => { setClassNum(n); setSubject(null); }}
                    className={cn("h-14 rounded-2xl font-black text-xl transition-all",
                      classNum === n ? "bg-blue-600 text-white shadow-xl scale-105" : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700")}>
                    {n}
                  </button>
                ))}
              </div>
              {classNum && classNum >= 3 && (
                <p className="text-xs text-slate-400 font-medium">Class {classNum} runs two simultaneous level groups — select subject below.</p>
              )}
            </div>

            {/* Subject (Class 3+) */}
            {classNum && classNum >= 3 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Subject</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSubject('language')}
                    className={cn("h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all",
                      subject === 'language' ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100")}>
                    <Book className="w-5 h-5" /> Language
                  </button>
                  <button onClick={() => setSubject('maths')}
                    className={cn("h-14 rounded-2xl font-black flex items-center justify-center gap-2 transition-all",
                      subject === 'maths' ? "bg-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100")}>
                    <Calculator className="w-5 h-5" /> Maths
                  </button>
                </div>
              </div>
            )}

            {/* Group Selection (Class 3+) */}
            {needsGroupPick && sessionPlan && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Which Group Will You Conduct?</p>
                <div className="grid grid-cols-1 gap-3">
                  {sessionPlan.groups.map((g, gi) => {
                    const clr = GROUP_COLORS[g.color] || GROUP_COLORS.blue;
                    const isSelected = selectedGroupIdx === gi;
                    return (
                      <button key={gi} onClick={() => { setSelectedGroupIdx(gi); setSelectedDetail(null); }}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4",
                          isSelected
                            ? `${clr.bg} ${clr.border} shadow-lg scale-[1.01]`
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        )}>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-3 h-3 rounded-full shrink-0", isSelected ? clr.badge : "bg-slate-300")} />
                          <div>
                            <p className={cn("font-black text-sm", isSelected ? clr.text : "text-slate-700 dark:text-slate-200")}>{g.name}</p>
                            {g.marathiName && <p className="text-xs text-slate-400">{g.marathiName}</p>}
                            <p className="text-xs text-slate-400 mt-0.5">{g.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn("font-black text-sm", isSelected ? clr.text : "text-slate-500")}>{g.totalTime}m</p>
                          <p className="text-xs text-slate-400">{g.activities.length} activities</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day toggle (Pushpagandh only) */}
            {hasDayToggle && (
              <div className="space-y-3 animate-in fade-in">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Day in Story Cycle (Pushpagandh)</p>
                <div className="grid grid-cols-2 gap-3">
                  {([1, 2] as const).map(d => (
                    <button key={d} onClick={() => setDayNum(d)}
                      className={cn("h-12 rounded-2xl font-black transition-all",
                        dayNum === d ? "bg-violet-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100")}>
                      Day {d}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Day 1 = new story introduced. Day 2 = continuation and comprehension.</p>
              </div>
            )}

            {/* Plan preview */}
            {sessionPlan && !needsGroupPick && (
              <div className="space-y-2 animate-in fade-in">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Today&apos;s Groups</p>
                <div className="space-y-2">
                  {sessionPlan.groups.map((g, gi) => {
                    const clr = GROUP_COLORS[g.color] || GROUP_COLORS.blue;
                    const visible = getVisibleActivities(g);
                    return (
                      <div key={gi} className={cn("p-4 rounded-2xl border flex items-center justify-between", clr.bg, clr.border)}>
                        <div>
                          <p className={cn("font-black text-sm", clr.text)}>{g.name}</p>
                          {g.marathiName && <p className="text-xs text-slate-500">{g.marathiName}</p>}
                          <p className="text-xs text-slate-500 mt-0.5">{g.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("font-black", clr.text)}>{g.totalTime}m</p>
                          <p className="text-xs text-slate-500">{visible.length} activities</p>
                        </div>
                      </div>
                    );
                  })}
                  {sessionPlan.note && <p className="text-xs text-slate-400 italic px-1">{sessionPlan.note}</p>}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setStep('session');
                setIsTimerRunning(true);
                if (sessionPlan) setSelectedDetail({ groupIdx: activeGroupIdx, actIdx: 0 });
              }}
              disabled={!classNum || (classNum >= 3 && !subject) || !teacherName || !schoolName || !sessionPlan || (needsGroupPick && selectedGroupIdx === null)}
              className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-3xl text-2xl shadow-2xl flex items-center justify-center gap-4 group transition-all transform hover:scale-105 disabled:opacity-40 disabled:scale-100">
              {needsGroupPick && selectedGroupIdx === null ? 'SELECT A GROUP ABOVE' : 'INITIATE SESSION'} <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ── SESSION ── */}
      {step === 'session' && sessionPlan && (
        <div className={cn("flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-8", isFocusMode ? "gap-4" : "gap-6")}>
          {isSingleGroup ? (
            /* Single group layout — Class 1-2 OR teacher picked one group from Class 3-4 */
            <div className="flex flex-col flex-1 min-h-0 gap-4">
              <div className="flex gap-6 flex-1 min-h-0">
                {/* Sidebar */}
                <div className="w-72 shrink-0 bg-slate-50 dark:bg-slate-900/60 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-y-auto p-4 space-y-2">
                  {/* Group badge for Class 3+ */}
                  {selectedGroupIdx !== null && (() => {
                    const grp = sessionPlan.groups[activeGroupIdx];
                    const clr = GROUP_COLORS[grp.color] || GROUP_COLORS.blue;
                    return (
                      <div className={cn("px-4 py-3 rounded-2xl mb-2 flex items-center gap-2 border", clr.bg, clr.border)}>
                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", clr.badge)} />
                        <div>
                          <p className={cn("font-black text-xs", clr.text)}>{grp.name}</p>
                          {grp.marathiName && <p className="text-[10px] text-slate-500">{grp.marathiName}</p>}
                        </div>
                      </div>
                    );
                  })()}
                  {getVisibleActivities(sessionPlan.groups[activeGroupIdx]).map((act, ai) => {
                    const realIdx = sessionPlan.groups[activeGroupIdx].activities.indexOf(act);
                    const isDone = completedActivities.has(`${activeGroupIdx}-${realIdx}`);
                    const isSel = selectedDetail?.groupIdx === activeGroupIdx && selectedDetail?.actIdx === realIdx;
                    return (
                      <button key={ai} onClick={() => setSelectedDetail({ groupIdx: activeGroupIdx, actIdx: realIdx })}
                        className={cn("w-full text-left p-4 rounded-2xl transition-all",
                          isSel ? "bg-blue-600 text-white shadow-lg" :
                          isDone ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" :
                          "bg-white dark:bg-slate-800 hover:shadow-md text-slate-700 dark:text-slate-300")}>
                        <div className="flex items-center gap-3">
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                            isSel ? "bg-white/20 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500")}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : ai + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm truncate">{act.name}</p>
                            {act.marathiName && act.marathiName !== act.name && <p className={cn("text-xs truncate", isSel ? "text-blue-100" : "text-slate-400")}>{act.marathiName}</p>}
                          </div>
                          <span className={cn("ml-auto text-xs font-bold shrink-0", isSel ? "text-blue-100" : "text-slate-400")}>{act.duration}m</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Detail panel */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-0">
                  {selectedActivity ? (
                    <>
                      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedActivity.duration} minutes</span>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedActivity.name}</h3>
                          {selectedActivity.marathiName && selectedActivity.marathiName !== selectedActivity.name && (
                            <p className="text-lg text-slate-500 font-medium">{selectedActivity.marathiName}</p>
                          )}
                          <p className="text-slate-500 mt-2">{selectedActivity.description}</p>
                        </div>
                        <button
                          onClick={() => { const ri = sessionPlan.groups[activeGroupIdx].activities.indexOf(selectedActivity); toggleComplete(activeGroupIdx, ri); }}
                          className={cn("shrink-0 px-5 py-3 rounded-2xl font-black text-sm transition-all",
                            completedActivities.has(`${activeGroupIdx}-${sessionPlan.groups[activeGroupIdx].activities.indexOf(selectedActivity)}`)
                              ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600")}>
                          {completedActivities.has(`${activeGroupIdx}-${sessionPlan.groups[activeGroupIdx].activities.indexOf(selectedActivity)}`) ? "✓ Done" : "Mark Done"}
                        </button>
                      </div>
                      {ActiveSimulation ? (
                        <div className="flex-1 flex flex-col min-h-0">
                          <div className="flex-1 min-h-[520px] bg-slate-950 overflow-hidden">
                            <ActiveSimulation player1={battleContext?.p1} player2={battleContext?.p2} schoolId={battleContext?.schoolId || "mock-school-id"} classNum={classNum || 1} />
                          </div>
                          {selectedActivity.materials.length > 0 && (
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Materials:</span>
                              {selectedActivity.materials.map((m, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-medium">{m}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : selectedActivity.name === "The Battle Arena" ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                          <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/30 rounded-3xl flex items-center justify-center text-orange-600"><Swords className="w-12 h-12" /></div>
                          <button onClick={() => setShowMatchmaker(true)} className="px-10 py-5 bg-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all text-lg">OPEN MATCHMAKER</button>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Step-by-Step Instructions</h4>
                            <ol className="space-y-3">
                              {selectedActivity.instructions.map((ins, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                  <span className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{ins}</p>
                                </li>
                              ))}
                            </ol>
                          </div>
                          {selectedActivity.materials.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Materials Needed</h4>
                              <ul className="flex flex-wrap gap-2">
                                {selectedActivity.materials.map((m, i) => (
                                  <li key={i} className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-sm font-medium">{m}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <div className="text-center space-y-4">
                        <BookOpen className="w-16 h-16 mx-auto opacity-30" />
                        <p className="font-black text-xl">Select an activity to see details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Next / Finish for single-group (always present) */}
              <div className="flex justify-end gap-4 pb-2">
                {getNextDetail() ? (
                  <button onClick={() => setSelectedDetail(getNextDetail())}
                    className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                    NEXT ACTIVITY <ChevronRight className="w-6 h-6" />
                  </button>
                ) : (
                  <button onClick={() => setStep('summary')}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-3xl shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                    FINISH SESSION <CheckCircle2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Dual group (Class 3–4): two columns + shared detail panel */
            <div className="flex flex-col gap-6 flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-4">
                {sessionPlan.groups.map((group, gi) => {
                  const clr = GROUP_COLORS[group.color] || GROUP_COLORS.blue;
                  const visible = getVisibleActivities(group);
                  return (
                    <div key={gi} className={cn("rounded-[32px] border overflow-hidden", clr.border)}>
                      <div className={cn("px-6 py-4 flex items-center gap-3", clr.bg)}>
                        <div className={cn("w-3 h-3 rounded-full shrink-0", clr.badge)} />
                        <div className="min-w-0">
                          <p className={cn("font-black", clr.text)}>{group.name}</p>
                          {group.marathiName && <p className="text-xs text-slate-500 truncate">{group.marathiName}</p>}
                        </div>
                        <span className={cn("ml-auto text-xs font-bold shrink-0", clr.text)}>{group.totalTime}m</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 space-y-1.5">
                        {visible.map((act, ai) => {
                          const realIdx = group.activities.indexOf(act);
                          const isDone = completedActivities.has(`${gi}-${realIdx}`);
                          const isSel = selectedDetail?.groupIdx === gi && selectedDetail?.actIdx === realIdx;
                          return (
                            <button key={ai} onClick={() => setSelectedDetail({ groupIdx: gi, actIdx: realIdx })}
                              className={cn("w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                                isSel ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" :
                                isDone ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300" :
                                "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300")}>
                              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                                isSel ? "bg-white/20 dark:bg-slate-900/20" : isDone ? "bg-emerald-500 text-white" : clr.badge + " text-white opacity-70")}>
                                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : ai + 1}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-black text-sm truncate">{act.name}</p>
                                {act.marathiName && act.marathiName !== act.name && <p className="text-xs truncate opacity-60">{act.marathiName}</p>}
                              </div>
                              <span className="text-xs font-bold opacity-60 shrink-0">{act.duration}m</span>
                            </button>
                          );
                        })}
                        {group.note && <p className="text-xs text-slate-400 italic px-3 pt-1">{group.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedActivity ? (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      {selectedDetail && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn("w-2.5 h-2.5 rounded-full", (GROUP_COLORS[sessionPlan.groups[selectedDetail.groupIdx]?.color] || GROUP_COLORS.blue).badge)} />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {sessionPlan.groups[selectedDetail.groupIdx]?.name} · {selectedActivity.duration}m
                          </span>
                        </div>
                      )}
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedActivity.name}</h3>
                      {selectedActivity.marathiName && selectedActivity.marathiName !== selectedActivity.name && (
                        <p className="text-slate-500 font-medium">{selectedActivity.marathiName}</p>
                      )}
                      <p className="text-slate-500 text-sm mt-1">{selectedActivity.description}</p>
                    </div>
                    <button
                      onClick={() => { if (selectedDetail) toggleComplete(selectedDetail.groupIdx, selectedDetail.actIdx); }}
                      className={cn("shrink-0 px-5 py-3 rounded-2xl font-black text-sm transition-all",
                        selectedDetail && completedActivities.has(`${selectedDetail.groupIdx}-${selectedDetail.actIdx}`)
                          ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600")}>
                      {selectedDetail && completedActivities.has(`${selectedDetail.groupIdx}-${selectedDetail.actIdx}`) ? "✓ Done" : "Mark Done"}
                    </button>
                  </div>
                  {/* Instructions + Materials (compact 2-col) */}
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Instructions</h4>
                      <ol className="space-y-2">
                        {selectedActivity.instructions.map((ins, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{ins}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[4px]">Materials</h4>
                      <ul className="flex flex-wrap gap-2">
                        {selectedActivity.materials.map((m, i) => (
                          <li key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-medium">{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Simulation — full-width, tall */}
                  {ActiveSimulation && (
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      <div className="min-h-[520px] bg-slate-950 overflow-hidden rounded-b-[32px]">
                        <ActiveSimulation player1={battleContext?.p1} player2={battleContext?.p2} schoolId={battleContext?.schoolId || "mock-school-id"} classNum={classNum || 3} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-600">
                  <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-black">Tap any activity above to see instructions and materials</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                {getNextDetail() ? (
                  <button onClick={() => setSelectedDetail(getNextDetail())}
                    className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                    NEXT ACTIVITY <ChevronRight className="w-6 h-6" />
                  </button>
                ) : (
                  <button onClick={() => setStep('summary')}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-3xl shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                    FINISH SESSION <CheckCircle2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          {sessionPlan && (
            <BattleMatchmaker
              isOpen={showMatchmaker} onClose={() => setShowMatchmaker(false)}
              subject={subject === 'maths' ? 'numeracy' : 'literacy'} level={1}
              gameTitle={selectedActivity?.name || "Battle Arena"} isAdmin={true}
              onMatchComplete={(p1, p2, sId, cNum) => { setBattleContext({ p1, p2, schoolId: sId, classNum: cNum }); setShowMatchmaker(false); }}
            />
          )}
        </div>
      )}

      {/* ── SUMMARY ── */}
      {step === 'summary' && sessionPlan && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 py-12">
          <div className="w-full max-w-4xl space-y-10">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">Mission Accomplishment Report</h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-slate-500">
                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{schoolName}</span>
                <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">Trainer: {teacherName}</span>
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">Duration: {formatTime(elapsed)}</span>
                <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">{totalCompleted}/{totalActivities} done</span>
              </div>
            </div>
            {sessionPlan.groups
              .filter((_, gi) => selectedGroupIdx === null || gi === selectedGroupIdx)
              .map((group, _idx) => {
              const gi = selectedGroupIdx ?? _idx;
              const clr = GROUP_COLORS[group.color] || GROUP_COLORS.blue;
              const visible = getVisibleActivities(group);
              return (
                <div key={gi} className={cn("rounded-[40px] border overflow-hidden shadow-xl", clr.border)}>
                  <div className={cn("px-8 py-5 flex items-center gap-3", clr.bg)}>
                    <div className={cn("w-3 h-3 rounded-full", clr.badge)} />
                    <h3 className={cn("font-black text-lg", clr.text)}>{group.name}</h3>
                    {group.marathiName && <span className="text-sm text-slate-400 ml-2">{group.marathiName}</span>}
                    <span className="ml-auto text-xs font-bold text-slate-500">{group.subtitle}</span>
                  </div>
                  <table className="w-full bg-white dark:bg-slate-900">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Activity</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Duration</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((act, ai) => {
                        const realIdx = group.activities.indexOf(act);
                        const done = completedActivities.has(`${gi}-${realIdx}`);
                        return (
                          <tr key={ai} className="border-t border-slate-100 dark:border-slate-800">
                            <td className="p-6">
                              <p className="font-black">{act.name}</p>
                              {act.marathiName && act.marathiName !== act.name && <p className="text-xs text-slate-400">{act.marathiName}</p>}
                            </td>
                            <td className="p-6 font-mono text-slate-500">{act.duration}m</td>
                            <td className="p-6">
                              {done
                                ? <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm"><CheckCircle2 className="w-4 h-4" /> Done</span>
                                : <span className="text-slate-400 text-sm">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <div className="flex justify-center gap-6 pt-4">
              <button onClick={handleFinishAndLog} disabled={isLogging || logSuccess}
                className={cn("px-12 py-6 font-black rounded-3xl shadow-2xl hover:scale-105 transition-all text-xl flex items-center gap-3",
                  logSuccess ? "bg-emerald-500 text-white cursor-default" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900")}>
                {logSuccess ? <><CheckCircle2 className="w-6 h-6" /> LOGGED SUCCESSFULLY</> : isLogging ? "LOGGING..." : "FINISH & LOG"}
              </button>
              <button onClick={resetSession}
                className="px-12 py-6 bg-white dark:bg-slate-800 font-black rounded-3xl shadow-xl hover:scale-105 transition-all text-xl border border-slate-100 dark:border-slate-700">
                NEW MISSION
              </button>
            </div>
          </div>
        </div>
      )}
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
