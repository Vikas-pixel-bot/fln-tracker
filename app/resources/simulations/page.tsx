"use client";
import React, { useState } from "react";
import { ArrowLeft, Zap, Trophy, Gamepad2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Simulations
import BundleBuilder from "@/components/simulations/BundleBuilder";
import NumberHunter from "@/components/simulations/NumberHunter";
import AdditionMaster from "@/components/simulations/AdditionMaster";
import SoundExplorer from "@/components/simulations/SoundExplorer";
import WordBuilder from "@/components/simulations/WordBuilder";
import SentenceArchitect from "@/components/simulations/SentenceArchitect";
import MathSprint from "@/components/simulations/MathSprint";
import SoundDuel from "@/components/simulations/SoundDuel";
import BattleMatchmaker from "@/components/simulations/BattleMatchmaker";

// New 2v2 Games
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

type Item = { 
  id: string; 
  title: string; 
  level: string; 
  battleLevel?: number; 
  subject: string; 
  emoji: string; 
  component: (props: any) => React.ReactNode; 
  tag?: string 
};

const SIMS: Item[] = [
  // 2v2 Marathi Literacy
  { id: "marathi-letters", title: "अक्षर ओळख (Letters)", level: "Letter",     battleLevel: 1, subject: "Battle",   emoji: "अ", tag: "Marathi",  component: (p) => <LetterFlash {...p} /> },
  { id: "marathi-words",   title: "शब्द वाचन (Words)",   level: "Word",       battleLevel: 2, subject: "Battle",   emoji: "📖", tag: "Marathi",  component: (p) => <WordRace {...p} /> },
  { id: "marathi-sent",    title: "वाक्य पूर्ण करा",     level: "Paragraph",  battleLevel: 3, subject: "Battle",   emoji: "📝", tag: "Marathi",  component: (p) => <SentenceFill {...p} /> },
  
  // 2v2 Numeracy
  { id: "math-duel-b",     title: "Math Duel",          level: "Operations", battleLevel: 4, subject: "Battle",   emoji: "⚡", tag: "± / ÷",    component: (p) => <MathDuel {...p} /> },
  { id: "num-race-b",      title: "Number Race",        level: "10-99",      battleLevel: 2, subject: "Battle",   emoji: "🏁", tag: "Compare",  component: (p) => <NumberRace {...p} /> },
  { id: "pv-battle-b",     title: "Place Value Battle", level: "100-999",    battleLevel: 3, subject: "Battle",   emoji: "🏛️", tag: "H-T-O",    component: (p) => <PlaceValueBattle {...p} /> },

  // Original Sims
  { id: "math-sprint",     title: "Math Sprint",        level: "10-99",      battleLevel: 2, subject: "Battle",   emoji: "⚡", tag: "60s Race",   component: (p) => <MathSprint {...p} /> },
  { id: "sound-duel",      title: "Sound Duel",         level: "Letter",     battleLevel: 1, subject: "Battle",   emoji: "🎙️", tag: "60s Race",  component: (p) => <SoundDuel {...p} /> },
  
  { id: "number-hunter",   title: "Number Hunter",      level: "1-9",        battleLevel: 1, subject: "Math",     emoji: "🔢", component: (p) => <NumberHunter {...p} /> },
  { id: "bundle-builder",  title: "Bundle Builder",     level: "10-99",      battleLevel: 2, subject: "Math",     emoji: "📦", component: (p) => <BundleBuilder {...p} /> },
  { id: "addition-master", title: "Addition Master",    level: "Operations", battleLevel: 3, subject: "Math",     emoji: "➕", component: (p) => <AdditionMaster {...p} /> },
  { id: "sound-explorer",  title: "Sound Explorer",     level: "Letter",     battleLevel: 1, subject: "Literacy", emoji: "🔊", component: (p) => <SoundExplorer {...p} /> },
  { id: "word-builder",    title: "Word Builder",       level: "Word",       battleLevel: 2, subject: "Literacy", emoji: "🔤", component: (p) => <WordBuilder {...p} /> },
  { id: "sentence-arch",   title: "Sentence Architect", level: "Para/Story", battleLevel: 4, subject: "Literacy", emoji: "📜", component: (p) => <SentenceArchitect {...p} /> },
];

const GAMES: Item[] = [
  { id: "g-oddone",   title: "Odd One Out",        level: "Beginner",    battleLevel: 0, subject: "Literacy", emoji: "🔍", component: (p) => <OddOneOut {...p} /> },
  { id: "g-letters",  title: "Letter Explorer",    level: "Letter",      battleLevel: 1, subject: "Literacy", emoji: "🔤", component: (p) => <LetterPicker {...p} /> },
  { id: "g-missing",  title: "Missing Letter",     level: "Word",        battleLevel: 2, subject: "Literacy", emoji: "🔡", component: (p) => <MissingLetter {...p} /> },
  { id: "g-fish",     title: "Fish Word Catch",    level: "Word",        battleLevel: 2, subject: "Literacy", emoji: "🐟", component: (p) => <FishGame {...p} /> },
  { id: "g-rhyme",    title: "Rhyme Time",         level: "Word",        battleLevel: 2, subject: "Literacy", emoji: "🎵", component: (p) => <RhymeTime {...p} /> },
  { id: "g-sentence", title: "Sentence Builder",   level: "Paragraph",   battleLevel: 3, subject: "Literacy", emoji: "📝", component: (p) => <SentenceBuilder {...p} /> },
  { id: "g-story",    title: "Story Sequence",     level: "Paragraph",   battleLevel: 3, subject: "Literacy", emoji: "📖", component: (p) => <StorySequence {...p} /> },
  { id: "g-true",     title: "True or False",      level: "Story",       battleLevel: 4, subject: "Literacy", emoji: "✅", component: (p) => <TrueFalse {...p} /> },
  { id: "g-bigger",   title: "Bigger or Smaller",  level: "Beginner",    battleLevel: 0, subject: "Numeracy", emoji: "🔢", component: (p) => <BiggerSmaller {...p} /> },
  { id: "g-counting", title: "Count the Stones",   level: "Beginner",    battleLevel: 0, subject: "Numeracy", emoji: "🪨", component: (p) => <CountingStones {...p} /> },
  { id: "g-train",    title: "Number Train",       level: "1–9",         battleLevel: 1, subject: "Numeracy", emoji: "🚂", component: (p) => <NumberTrain {...p} /> },
  { id: "g-weights",  title: "Balance the Scale",  level: "10–99",       battleLevel: 2, subject: "Numeracy", emoji: "⚖️", component: (p) => <WeightMatcher {...p} /> },
  { id: "g-place",    title: "Place Value Builder", level: "10–99",       battleLevel: 2, subject: "Numeracy", emoji: "🏗️", component: (p) => <PlaceValue {...p} /> },
  { id: "g-bonds",    title: "Number Bonds",       level: "Addition",    battleLevel: 3, subject: "Numeracy", emoji: "🔗", component: (p) => <NumberBonds {...p} /> },
  { id: "g-market",   title: "Market Math",        level: "Operations",  battleLevel: 4, subject: "Numeracy", emoji: "🛒", component: (p) => <MarketMath {...p} /> },
  { id: "g-river",    title: "Number River",       level: "Operations",  battleLevel: 4, subject: "Numeracy", emoji: "🌊", component: (p) => <NumberRiver {...p} /> },
  { id: "g-clock",    title: "Clock Reader",       level: "Life Skills", battleLevel: 0, subject: "Bonus",    emoji: "🕐", component: (p) => <ClockReader {...p} /> },
  { id: "g-sorting",  title: "Sorting Hat",        level: "Cross-level", battleLevel: 0, subject: "Bonus",    emoji: "🎩", component: (p) => <SortingHat {...p} /> },
];

const ALL = [...SIMS, ...GAMES];

const SECTIONS = [
  { label: "⚡ Battle Arena",         filter: (i: Item) => i.subject === "Battle",   accent: "from-orange-500 to-red-500",   glow: "shadow-orange-500/40",  ring: "ring-orange-400",   active: "bg-gradient-to-r from-orange-500 to-red-500 text-white" },
  { label: "📦 Numeracy Simulations", filter: (i: Item) => i.subject === "Math",     accent: "from-blue-500 to-indigo-600",  glow: "shadow-blue-500/40",    ring: "ring-blue-400",     active: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" },
  { label: "📜 Literacy Simulations", filter: (i: Item) => i.subject === "Literacy" && SIMS.some(s => s.id === i.id), accent: "from-violet-500 to-purple-600", glow: "shadow-violet-500/40", ring: "ring-violet-400", active: "bg-gradient-to-r from-violet-500 to-purple-600 text-white" },
  { label: "🎮 Literacy Games",       filter: (i: Item) => i.subject === "Literacy" && GAMES.some(g => g.id === i.id), accent: "from-green-500 to-teal-500",   glow: "shadow-green-500/40",   ring: "ring-green-400",    active: "bg-gradient-to-r from-green-500 to-teal-500 text-white" },
  { label: "🔢 Numeracy Games",       filter: (i: Item) => i.subject === "Numeracy", accent: "from-cyan-500 to-blue-500",    glow: "shadow-cyan-500/40",    ring: "ring-cyan-400",     active: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" },
  { label: "🎁 Bonus",                filter: (i: Item) => i.subject === "Bonus",    accent: "from-pink-500 to-rose-500",    glow: "shadow-pink-500/40",    ring: "ring-pink-400",     active: "bg-gradient-to-r from-pink-500 to-rose-500 text-white" },
];

export default function SimulationsPage() {
  const [activeId, setActiveId] = useState("bundle-builder");
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [battleContext, setBattleContext] = useState<any>(null);

  const active = ALL.find(s => s.id === activeId)!;
  const activeSection = SECTIONS.find(s => s.filter(active)) ?? SECTIONS[1];

  const handleSimSelect = (id: string) => {
    const item = ALL.find(i => i.id === id);
    if (item?.subject === 'Battle') {
      setShowMatchmaker(true);
    }
    setActiveId(id);
    setBattleContext(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

      {/* Arcade Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-slate-700">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link href="/resources" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Training Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Simulations & Games</h1>
                <p className="text-slate-400 text-sm font-medium">Level-wise interactive tools for students & teachers</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <StatBadge icon="🎮" label="Total Tools" value={ALL.length} color="from-blue-500 to-indigo-600" />
            <StatBadge icon="⭐" label="Simulations" value={SIMS.length} color="from-orange-500 to-red-500" />
            <StatBadge icon="🏆" label="Games" value={GAMES.length} color="from-green-500 to-teal-500" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">

        {/* Sidebar */}
        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
          {SECTIONS.map(section => {
            const items = ALL.filter(section.filter);
            return (
              <div key={section.label} className="space-y-1.5">
                <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-gradient-to-r ${section.accent} bg-clip-text text-transparent`}>
                  {section.label}
                </p>
                {items.map(item => {
                  const isActive = item.id === activeId;
                  return (
                    <button key={item.id} onClick={() => handleSimSelect(item.id)}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-2xl text-left transition-all duration-200 flex items-center gap-3 group",
                        isActive
                          ? `${section.active} shadow-lg ${section.glow}`
                          : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      )}>
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-bold text-sm truncate leading-tight", isActive ? "text-white" : "")}>{item.title}</p>
                        <p className={cn("text-[10px] font-semibold truncate", isActive ? "text-white/70" : "text-slate-400")}>Lvl: {item.level}</p>
                      </div>
                      {item.tag && (
                        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0", isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600")}>
                          {item.tag}
                        </span>
                      )}
                      <ChevronRight className={cn("w-3.5 h-3.5 shrink-0 transition-all", isActive ? "text-white translate-x-0.5" : "opacity-0 group-hover:opacity-40")} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-5">

          {/* Active game label */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${activeSection.accent} shadow-lg ${activeSection.glow} text-white`}>
            <span className="text-2xl">{active.emoji}</span>
            <div className="flex-1">
              <p className="font-black text-lg leading-tight">{active.title}</p>
              <p className="text-white/70 text-xs font-semibold">Level: {active.level} · {active.subject}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-black">LIVE</span>
            </div>
          </div>

          {/* Game area */}
          <div key={activeId} className="animate-in fade-in zoom-in-95 duration-300">
            {active.component({ 
              player1: battleContext?.p1, 
              player2: battleContext?.p2,
              schoolId: battleContext?.schoolId,
              classNum: battleContext?.classNum
            })}
          </div>

          <BattleMatchmaker 
            isOpen={showMatchmaker}
            onClose={() => setShowMatchmaker(false)}
            subject={active.subject === 'Battle' ? (active.id.includes('math') ? 'numeracy' : 'literacy') : 'literacy'}
            level={active.battleLevel || 1}
            gameTitle={active.title}
            userSchoolId={undefined} // Need session hook here eventually
            isAdmin={true} // Need session hook
            onMatchComplete={(p1, p2, schoolId, classNum) => {
              setBattleContext({ p1, p2, schoolId, classNum });
              setShowMatchmaker(false);
            }}
          />

          {/* Quick-pick related games */}
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" /> More in this category
            </p>
            <div className="flex gap-2 flex-wrap">
              {ALL.filter(i => i.subject === active.subject && i.id !== activeId).slice(0, 6).map(i => (
                <button key={i.id} onClick={() => setActiveId(i.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all active:scale-95">
                  {i.emoji} {i.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${color} shadow-lg text-white`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-white/70">{label}</p>
        <p className="text-xl font-black leading-none">{value}</p>
      </div>
    </div>
  );
}
