"use client";
import React, { useState } from "react";
import { Gamepad2, ArrowLeft, Info, Sparkles, ChevronRight } from "lucide-react";
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

const SIMS = [
  { id: "number-hunter",    title: "Number Hunter",     level: "1-9",        subject: "Math",     emoji: "🔢", component: <NumberHunter /> },
  { id: "bundle-builder",   title: "Bundle Builder",    level: "10-99",      subject: "Math",     emoji: "📦", component: <BundleBuilder /> },
  { id: "addition-master",  title: "Addition Master",   level: "Operations", subject: "Math",     emoji: "➕", component: <AdditionMaster /> },
  { id: "sound-explorer",   title: "Sound Explorer",    level: "Letter",     subject: "Literacy", emoji: "🔊", component: <SoundExplorer /> },
  { id: "word-builder",     title: "Word Builder",      level: "Word",       subject: "Literacy", emoji: "🔤", component: <WordBuilder /> },
  { id: "sentence-arch",    title: "Sentence Architect",level: "Para/Story", subject: "Literacy", emoji: "📜", component: <SentenceArchitect /> },
  { id: "math-sprint",      title: "Math Sprint",       level: "10-99",      subject: "Battle",   emoji: "⚡", component: <MathSprint /> },
  { id: "sound-duel",       title: "Sound Duel",        level: "Letter",     subject: "Battle",   emoji: "🎙️", component: <SoundDuel /> },
];

const GAMES = [
  // Literacy
  { id: "g-oddone",      title: "Odd One Out",        level: "Beginner",   subject: "Literacy", emoji: "🔍", component: <OddOneOut /> },
  { id: "g-letters",     title: "Letter Explorer",    level: "Letter",     subject: "Literacy", emoji: "🔤", component: <LetterPicker /> },
  { id: "g-missing",     title: "Missing Letter",     level: "Word",       subject: "Literacy", emoji: "🔡", component: <MissingLetter /> },
  { id: "g-fish",        title: "Fish Word Catch",    level: "Word",       subject: "Literacy", emoji: "🐟", component: <FishGame /> },
  { id: "g-rhyme",       title: "Rhyme Time",         level: "Word",       subject: "Literacy", emoji: "🎵", component: <RhymeTime /> },
  { id: "g-sentence",    title: "Sentence Builder",   level: "Paragraph",  subject: "Literacy", emoji: "📝", component: <SentenceBuilder /> },
  { id: "g-story",       title: "Story Sequence",     level: "Paragraph",  subject: "Literacy", emoji: "📖", component: <StorySequence /> },
  { id: "g-truefalse",   title: "True or False",      level: "Story",      subject: "Literacy", emoji: "✅", component: <TrueFalse /> },
  // Numeracy
  { id: "g-bigger",      title: "Bigger or Smaller",  level: "Beginner",   subject: "Numeracy", emoji: "🔢", component: <BiggerSmaller /> },
  { id: "g-counting",    title: "Count the Stones",   level: "Beginner",   subject: "Numeracy", emoji: "🪨", component: <CountingStones /> },
  { id: "g-train",       title: "Number Train",       level: "1–9",        subject: "Numeracy", emoji: "🚂", component: <NumberTrain /> },
  { id: "g-weights",     title: "Balance the Scale",  level: "10–99",      subject: "Numeracy", emoji: "⚖️", component: <WeightMatcher /> },
  { id: "g-place",       title: "Place Value Builder", level: "10–99",     subject: "Numeracy", emoji: "🏗️", component: <PlaceValue /> },
  { id: "g-bonds",       title: "Number Bonds",       level: "Addition",   subject: "Numeracy", emoji: "🔗", component: <NumberBonds /> },
  { id: "g-market",      title: "Market Math",        level: "Operations", subject: "Numeracy", emoji: "🛒", component: <MarketMath /> },
  { id: "g-river",       title: "Number River",       level: "Operations", subject: "Numeracy", emoji: "🌊", component: <NumberRiver /> },
  // Bonus
  { id: "g-clock",       title: "Clock Reader",       level: "Life Skills", subject: "Bonus",   emoji: "🕐", component: <ClockReader /> },
  { id: "g-sorting",     title: "Sorting Hat",        level: "Cross-level", subject: "Bonus",   emoji: "🎩", component: <SortingHat /> },
];

const ALL = [...SIMS, ...GAMES];

export default function SimulationsPage() {
  const [activeId, setActiveId] = useState("bundle-builder");
  const active = ALL.find(s => s.id === activeId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">

      {/* Header */}
      <div className="space-y-6">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Training Hub
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Interactive Pedagogy
            </div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Level-Wise <span className="text-blue-600">Simulations & Games</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Select a tool from the sidebar to launch it.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[28px] shadow-sm">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight max-w-[200px]">
              Optimized for tablets and mobile devices in field settings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">

        {/* Sidebar */}
        <div className="space-y-6 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto">

          {/* Battle */}
          <Section label="⚡ 2v2 Battle Arena" color="text-orange-500">
            {SIMS.filter(s => s.subject === "Battle").map(sim => (
              <SidebarBtn key={sim.id} sim={sim} active={activeId === sim.id} onClick={() => setActiveId(sim.id)}
                activeClass="bg-orange-600 text-white" hoverClass="hover:bg-orange-50 dark:hover:bg-orange-900/20" />
            ))}
          </Section>

          <Divider />

          {/* Numeracy Simulations */}
          <Section label="📦 Numeracy Simulations" color="text-slate-400">
            {SIMS.filter(s => s.subject === "Math").map(sim => (
              <SidebarBtn key={sim.id} sim={sim} active={activeId === sim.id} onClick={() => setActiveId(sim.id)} />
            ))}
          </Section>

          <Divider />

          {/* Literacy Simulations */}
          <Section label="📜 Literacy Simulations" color="text-slate-400">
            {SIMS.filter(s => s.subject === "Literacy").map(sim => (
              <SidebarBtn key={sim.id} sim={sim} active={activeId === sim.id} onClick={() => setActiveId(sim.id)} />
            ))}
          </Section>

          <Divider />

          {/* Literacy Games */}
          <Section label="🎮 Literacy Games" color="text-green-500">
            {GAMES.filter(g => g.subject === "Literacy").map(g => (
              <SidebarBtn key={g.id} sim={g} active={activeId === g.id} onClick={() => setActiveId(g.id)}
                activeClass="bg-green-600 text-white" hoverClass="hover:bg-green-50 dark:hover:bg-green-900/20" />
            ))}
          </Section>

          <Divider />

          {/* Numeracy Games */}
          <Section label="🔢 Numeracy Games" color="text-blue-500">
            {GAMES.filter(g => g.subject === "Numeracy").map(g => (
              <SidebarBtn key={g.id} sim={g} active={activeId === g.id} onClick={() => setActiveId(g.id)}
                activeClass="bg-blue-600 text-white" hoverClass="hover:bg-blue-50 dark:hover:bg-blue-900/20" />
            ))}
          </Section>

          <Divider />

          {/* Bonus Games */}
          <Section label="🎁 Bonus Games" color="text-purple-500">
            {GAMES.filter(g => g.subject === "Bonus").map(g => (
              <SidebarBtn key={g.id} sim={g} active={activeId === g.id} onClick={() => setActiveId(g.id)}
                activeClass="bg-purple-600 text-white" hoverClass="hover:bg-purple-50 dark:hover:bg-purple-900/20" />
            ))}
          </Section>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="animate-in fade-in zoom-in-95 duration-500" key={activeId}>
            {active?.component}
          </div>

          <div className="bg-slate-900 rounded-[48px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-16 h-16" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className={cn("p-5 rounded-3xl", active?.subject === "Battle" ? "bg-orange-600" : active?.subject === "Literacy" ? "bg-green-600" : active?.subject === "Numeracy" ? "bg-blue-600" : "bg-purple-600")}>
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl font-bold">{active?.emoji} {active?.title}</h3>
                <p className="text-slate-400 text-sm font-medium">
                  {active?.subject === "Battle"
                    ? "Competitive Team Play — 2 players race against the clock"
                    : `Designed for students at the ${active?.level} level · ${active?.subject}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className={`text-[10px] font-black uppercase tracking-widest px-2 ${color}`}>{label}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2" />;
}

function SidebarBtn({ sim, active, onClick, activeClass = "bg-white dark:bg-slate-700 text-blue-600 border border-blue-100 dark:border-blue-600 shadow-xl shadow-blue-900/5", hoverClass = "hover:bg-slate-100 dark:hover:bg-slate-800" }: {
  sim: { emoji: string; title: string; level: string };
  active: boolean;
  onClick: () => void;
  activeClass?: string;
  hoverClass?: string;
}) {
  return (
    <button onClick={onClick}
      className={cn(
        "w-full px-4 py-3 rounded-2xl text-left transition-all flex items-center justify-between gap-2",
        active ? activeClass : `text-slate-500 ${hoverClass}`
      )}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base shrink-0">{sim.emoji}</span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 truncate">Level: {sim.level}</p>
          <p className="font-bold text-sm truncate">{sim.title}</p>
        </div>
      </div>
      <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform", active ? "translate-x-0.5" : "opacity-0")} />
    </button>
  );
}
