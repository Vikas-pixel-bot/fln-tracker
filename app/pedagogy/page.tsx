"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  Info,
  Wrench,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Search,
  BookOpenCheck,
  Globe,
  Download
} from "lucide-react";
import WarliMotif from "@/components/warli/WarliMotif";

type TabId = "philosophy" | "levels" | "flow" | "activities" | "materials" | "role" | "manuals";

export default function PedagogyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("philosophy");
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const tabs = [
    { id: "philosophy", label: "Core Philosophy", icon: BookOpen },
    { id: "levels", label: "learning levels", icon: Award },
    { id: "flow", label: "Daily 90m Flow", icon: Clock },
    { id: "activities", label: "Classroom Activities", icon: Users },
    { id: "materials", label: "Manipulatives Map", icon: Wrench },
    { id: "role", label: "Teacher & Assessment", icon: GraduationCap },
    { id: "manuals", label: "TaRL Manuals & PDFs", icon: Download },
  ];

  return (
    <div className="w-full pb-10">
      
      {/* Header section */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <WarliMotif variant="tree" size={36} className="warli-ink opacity-80 shrink-0" />
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                About Pedagogy
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Level-wise grouping methodology, manuals, and instructional framework.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 self-start md:self-auto text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4" /> Pratham Education Foundation
          </div>
        </div>
      </div>

      {/* Main interactive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (lg:col-span-3) */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
          <div className="space-y-3 px-3 mb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Pedagogy Outline</p>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/30 text-[10px] font-bold uppercase tracking-wider">
              Focuses on grouping children by their current learning level rather than their grade.
            </div>
          </div>
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 text-left w-full ${
                    isActive 
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area (lg:col-span-9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB: Philosophy */}
          {activeTab === "philosophy" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Core Philosophy: Teaching at the Right Level</h2>
                
                <div className="relative p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/10 dark:to-amber-950/10 border border-orange-100/50 dark:border-orange-900/30 mb-8 italic">
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider">Foundational Insight</div>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    "A child's grade in school does not reflect their learning level."
                  </p>
                </div>

                <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed text-sm font-medium">
                  <p>
                    A Class 5 student may read at a Class 1 level. A Class 3 student may be unable to count to 10. The Pedagogy approach stops pretending otherwise. Instead of moving every child through the same curriculum at the same pace, it focuses on real skills.
                  </p>
                  <p>
                    Developed by Pratham, Pedagogy is a pedagogy built on four systematic pillars:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Assess Learning Levels</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Determine where each child actually stands using rapid, one-on-one Learning assessment tools.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Group Homogeneously</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Group children by their actual learning level (not grade or age) to eliminate learning shame.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Targeted Instruction</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Teach at that specific level using level-based activities, group games, and concrete materials.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold">4</div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Continuous Progression</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Move children forward to higher learning groups as soon as they master the target competency.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COVID context card */}
              <div className="bg-slate-900 text-white p-8 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 blur-2xl opacity-15 aspect-square w-72 rounded-full bg-amber-500" />
                <h3 className="text-lg font-extrabold mb-3 flex items-center gap-2 text-amber-400">
                  <Info className="w-5 h-5 text-amber-400" /> Post-COVID Intervention Context
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  The disruption from the COVID-19 pandemic significantly widened learning gaps, especially in tribal ashramshalas. Children moved up grades without consolidating foundational reading and math skills. Pedagogy addresses this head-on by bypasssing traditional grade level boundaries to repair foundations first.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Levels */}
          {activeTab === "levels" && (
            <div className="space-y-6 animate-fade-in">
              {/* Literacy Levels */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Literacy (Language Progression)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Learning labels and matching learning capabilities for Marathi / Hindi</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead>
                      <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3 pr-4">Level</th>
                        <th className="pb-3 px-4">Learning Label</th>
                        <th className="pb-3 px-4">Core Capabilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {[
                        { level: "0", label: "Beginner (सुरुवात)", desc: "Cannot recognize letters; confuses similar-looking characters." },
                        { level: "1", label: "Letter (अक्षर)", desc: "Identifies individual letters. Cannot read words fluently; may know letter names but not sounds." },
                        { level: "2", label: "Word (शब्द)", desc: "Reads simple 2-3 letter words. Decodes letter-by-letter but is not yet fluent." },
                        { level: "3", label: "Paragraph (परिच्छेद)", desc: "Reads a Class 1-level paragraph aloud. Pace may be slow; understands basic meaning." },
                        { level: "4", label: "Story (गोष्ट)", desc: "Reads a Class 2-level story fluently with expression and appropriate speed. Understands content details." }
                      ].map((row) => (
                        <tr key={row.level} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-4 pr-4 font-black text-slate-900 dark:text-white"><span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{row.level}</span></td>
                          <td className="py-4 px-4 font-black text-orange-500">{row.label}</td>
                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400 leading-normal">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Reading = Decoding + Comprehension.</strong> The Pedagogy framework explicitly states that fluent reading is only the first step. True reading capability requires understanding the content, relating it to personal context, and discussing it.
                  </p>
                </div>
              </div>

              {/* Numeracy Levels */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Numeracy (Mathematics Progression)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Learning labels and matching learning capabilities for arithmetic</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead>
                      <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3 pr-4">Level</th>
                        <th className="pb-3 px-4">Learning Label</th>
                        <th className="pb-3 px-4">Core Capabilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {[
                        { level: "0", label: "Beginner (सुरुवात)", desc: "Cannot recognize single-digit numbers; cannot count objects reliably." },
                        { level: "1", label: "Number 1-9 (संख्या १-९)", desc: "Recognizes and writes numbers 1-9; can count objects up to 9." },
                        { level: "2", label: "Number 10-99 (संख्या १०-९९)", desc: "Recognizes and reads 2-digit numbers; understands place value (tens and units) and skip counting." },
                        { level: "3", label: "Subtraction (वजाबाकी)", desc: "Performs 2-digit subtraction with borrowing; understands place value columns up to hundreds." },
                        { level: "4", label: "Division (भागाकार)", desc: "Performs division with 2-digit numbers; understands fair sharing and links division to multiplication." }
                      ].map((row) => (
                        <tr key={row.level} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="py-4 pr-4 font-black text-slate-900 dark:text-white"><span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{row.level}</span></td>
                          <td className="py-4 px-4 font-black text-amber-605 text-amber-600">{row.label}</td>
                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400 leading-normal">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Numeracy = Conceptual Understanding + Procedural Fluency.</strong> Students are not drilled for speed. They are expected to estimate first, use multiple solving methods, and explain their reasoning logically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Flow */}
          {activeTab === "flow" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">The 90-Minute Daily Flow</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-semibold uppercase tracking-wider">Operational structure followed in ashramshala classrooms</p>

                {/* Literacy timeline */}
                <div className="mb-10">
                  <h4 className="text-sm font-extrabold text-orange-500 mb-6 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Literacy Block (45 Minutes)
                  </h4>
                  <div className="space-y-6 border-l-2 border-orange-200 dark:border-orange-950/80 ml-3 pl-6">
                    {[
                      { time: "15 mins", title: "Story Discussion", desc: "Groups read together, highlight unfamiliar words, build comprehension by creating questions." },
                      { time: "10 mins", title: "Vocabulary & Mind Mapping", desc: "Central word association to populate a whiteboard network; kids write sentences using new vocabulary." },
                      { time: "10 mins", title: "Role Play / Writing", desc: "Students perform 3-minute dialogues or participate in situational sentence-completion exercises." },
                      { time: "10 mins", title: "Worksheet Practice", desc: "Level-specific worksheets evaluated through small-group feedback and peer correction." }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white dark:border-slate-950" />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-orange-500 px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20">{step.time}</span>
                          <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{step.title}</h5>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Numeracy timeline */}
                <div>
                  <h4 className="text-sm font-extrabold text-amber-600 mb-6 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Numeracy Block (45 Minutes)
                  </h4>
                  <div className="space-y-6 border-l-2 border-amber-200 dark:border-amber-950/80 ml-3 pl-6">
                    {[
                      { time: "10 mins", title: "Daily Life Math Talk", desc: "Discussing real-world story problems (e.g., buying toys, household budgeting) to develop estimation skills." },
                      { time: "10 mins", title: "Number Games & Chanting", desc: "Skip-counting drills (powers of 10, times-tables) and Number Diary games for digit recognition." },
                      { time: "15 mins", title: "Word Problem Solving", desc: "Using H-T-U (Hundreds, Tens, Units) grids and physical currency notes to visually solve operations." },
                      { time: "10 mins", title: "Small Group Tasks", desc: "Authentic tasks like household grocery billing, fraction sharing drawings, or measuring classroom objects." }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-950" />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-amber-600 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20">{step.time}</span>
                          <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{step.title}</h5>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grouping Strategy Card */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Pillar 2: Grouping Strategy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">homogeneous Levels</h5>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Children are grouped strictly by learning levels, not grades. A Class 3 and Class 5 child at the same learning level sit in the same group, removing grade-based shame.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Group Size: 5-6 Children</h5>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Optimal cohort size ensures everyone participates. Roles like group leader rotate continuously to build peer support and agency.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">Teacher Circulation</h5>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">The teacher does not lecture from a blackboard. Instead, they rotate through the groups, facilitating activities and checking logs.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Activities */}
          {activeTab === "activities" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Classroom Activities Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-semibold uppercase tracking-wider">Detailed view of instruction methods compiled from manuals</p>

                <div className="space-y-4">
                  {/* Literacy Activities */}
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Literacy Focus</h4>
                  {[
                    {
                      id: "story_disc",
                      title: "Story Discussion (गोष्ट चर्चा)",
                      detail: "Students read in groups of 5–6. They identify unfamiliar words and deduce meanings individually. The group then constructs 2–3 analytical questions about characters or plot points. Groups exchange questions, creating a child-led dialogue where reading is tied directly to reasoning."
                    },
                    {
                      id: "mind_map",
                      title: "Mind Mapping / Vocabulary Building (शब्द-जाल)",
                      detail: "The teacher writes a central trigger word (e.g., 'बाजार' / 'market') on the board. Students call out every associated word they know. Words are category-grouped on the board. Each student then writes original sentences using at least three of these words."
                    },
                    {
                      id: "role_play",
                      title: "Role Play & Dialogues (नाट्यीकरण)",
                      detail: "Groups prepare short 3-minute dialogic performances based on characters in the stories they read. Performed in front of the classroom, this builds public speaking, verbal fluency, and contextual comprehension."
                    }
                  ].map((act) => {
                    const isOpen = expandedActivity === act.id;
                    return (
                      <div key={act.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
                        <button
                          onClick={() => setExpandedActivity(isOpen ? null : act.id)}
                          className="flex items-center justify-between px-6 py-4 w-full text-left"
                        >
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">{act.title}</span>
                          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 pt-1 border-t border-slate-100 dark:border-slate-850 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                            {act.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Numeracy Activities */}
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 pt-6 border-b border-slate-100 dark:border-slate-800 pb-2">Numeracy Focus</h4>
                  {[
                    {
                      id: "math_talk",
                      title: "Daily Life Math Discussion (व्यवहारिक गणित)",
                      detail: "Real-world word problems from children's environments are introduced (e.g., 'If one football costs ₹24 and a team needs 3, what is the cost?'). Estimation is mandatory before calculating. Multiple correct methods (addition chains vs place value tables) are celebrated."
                    },
                    {
                      id: "number_chant",
                      title: "Number Games & Chart Chanting (संख्या खेळ)",
                      detail: "Daily chanting of number charts (powers of 10, skip counting by 100s, multiplication intervals) to strengthen place value understanding. Students play 'Number Diary' where they write digits read aloud by peers, boosting listening-to-symbol transcription."
                    },
                    {
                      id: "real_world_math",
                      title: "Authentic Small Group Tasks (कृती आधारित गणित)",
                      detail: "Activities that involve physical tracking, such as compiling school mid-day meal ingredient lists, drawing split roti shapes for fractions, or measuring desk lengths to record decimals, bridging abstract equations and actual physical variables."
                    }
                  ].map((act) => {
                    const isOpen = expandedActivity === act.id;
                    return (
                      <div key={act.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
                        <button
                          onClick={() => setExpandedActivity(isOpen ? null : act.id)}
                          className="flex items-center justify-between px-6 py-4 w-full text-left"
                        >
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">{act.title}</span>
                          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 pt-1 border-t border-slate-100 dark:border-slate-850 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                            {act.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Materials */}
          {activeTab === "materials" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Physical Manipulatives & Digital Twins</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">How physical concrete materials map to FLN Hub simulations</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { physical: "Matchsticks & Bundles", use: "Multiplication (equal groups) & Division (fair sharing)", twin: "BundleBuilder", level: "Numeracy L3-L4", desc: "Students bundle 10 sticks together to concretize 'tens' and 'units' grouping.", link: "/arcade/play/bundle-builder" },
                    { physical: "Currency Notes (₹1, ₹10, ₹100, ₹1000)", use: "Place value columns, subtraction borrowing, addition", twin: "PlaceValue", level: "Numeracy L2-L4", desc: "Uses cash transactions to visually represent carrying and regrouping operations.", link: "/arcade/play/g-place" },
                    { physical: "Number Flash Cards", use: "Number recognition, digit ordering, comparison", twin: "NumberHunter", level: "Numeracy L1-L2", desc: "Supports tactile digit recognition and comparative magnitude (greater than/less than).", link: "/arcade/play/number-hunter" },
                    { physical: "Word Cards / Linking Cards", use: "Word decoding, sentence assembly", twin: "ShabdaVachan", level: "Literacy L2-L3", desc: "Enables students to link single letter cards into words, and words into complete sentences.", link: "/arcade/play/word-builder" },
                    { physical: "Picture Cards (Chitra Card)", use: "Vocabulary building, categorization, story prompts", twin: "AksharOlakh", level: "Literacy L0-L2", desc: "Aligns images of common village items to vowel and consonant sounds.", link: "/arcade/play/marathi-letters" },
                    { physical: "Story Booklets", use: "Reading fluency and story comprehension", twin: "VakyaPurna", level: "Literacy L3-L4", desc: "Short paragraphs and story collections used for expressional reading and role-play activities.", link: "/arcade/play/story-reader" }
                  ].map((mat, idx) => (
                    <Link href={mat.link} key={idx} className="block group h-full">
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3 flex flex-col justify-between h-full group-hover:border-amber-400 dark:group-hover:border-amber-600 group-hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h5 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{mat.physical}</h5>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-650 dark:bg-orange-950/20">{mat.level}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-3">{mat.desc}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 dark:text-slate-500 font-bold">DigitalTwin:</span>
                          <span className="inline-flex items-center gap-1 font-black text-amber-600 group-hover:translate-x-1 transition-transform">
                            {mat.twin} <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Teacher */}
          {activeTab === "role" && (
            <div className="space-y-6 animate-fade-in">
              {/* Teacher Role comparison */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Teacher's Role: The "Sherpa" Model</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-semibold uppercase tracking-wider">Shifting from traditional lecturing to active facilitation</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-semibold">
                  {/* DO Column */}
                  <div className="space-y-4">
                    <h5 className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wider border-b border-emerald-50 dark:border-emerald-950/50 pb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Facilitators Do
                    </h5>
                    <ul className="space-y-3 text-slate-500 dark:text-slate-400 list-disc pl-4 leading-relaxed font-medium">
                      <li>Circulate between homogeneous learning groups constantly.</li>
                      <li>Ask guided inquiry questions (e.g., "How did you solve it?").</li>
                      <li>Acknowledge effort and celebrate alternative solving methods.</li>
                      <li>Offer one specific, actionable improvement suggestion per task.</li>
                      <li>Design tasks directly related to the child's daily household/village environment.</li>
                    </ul>
                  </div>

                  {/* DONT Column */}
                  <div className="space-y-4">
                    <h5 className="font-extrabold text-red-500 text-sm uppercase tracking-wider border-b border-red-50 dark:border-red-950/50 pb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Facilitators Do Not
                    </h5>
                    <ul className="space-y-3 text-slate-500 dark:text-slate-400 list-disc pl-4 leading-relaxed font-medium">
                      <li>Stand at the front lecturing from a blackboard.</li>
                      <li>Correct children publicly in ways that induce learning shame.</li>
                      <li>Allow confident students to dominate the small group discussions.</li>
                      <li>Reject non-procedural correct answers (multiple paths are valid).</li>
                      <li>Drill children for speed; focus instead on conceptual understanding.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Assessment approach */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Formal Testing</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold uppercase tracking-wider">Continuous, embedded diagnostic assessment</p>
                
                <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <p className="leading-relaxed">
                    Rather than penalizing students with marks, assessment is observational. The teacher tracks:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                      <h6 className="font-extrabold text-slate-900 dark:text-white text-xs mb-1">Language Checkpoints</h6>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Pacing & expression, vocabulary application in writing, and story reconstruction skills.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                      <h6 className="font-extrabold text-slate-900 dark:text-white text-xs mb-1">Math Checkpoints</h6>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Rough estimation checks, manipulative usage efficiency, andplace value component breakdown.</p>
                    </div>
                  </div>
                  <p className="leading-relaxed text-slate-400 dark:text-slate-500 italic mt-2">
                    Learning snapshots are recorded at Baseline, Midline, and Endline terms to track cohort growth velocity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Manuals */}
          {activeTab === "manuals" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <Download className="w-6 h-6 text-amber-500" /> TaRL & Pedagogy Manual Downloads
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Download official Teaching at the Right Level (TaRL) instructional manuals, activity charts, workbooks, and story cards for offline field usage.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  {[
                    {
                      title: "Level 1 Marathi Math Manual (TaRL)",
                      desc: "Teacher manual outlining sticks-and-bundles methods and place value charts in Marathi.",
                      size: "31.5 MB · PDF",
                      file: "Level 1, MAR Math Manual.pdf"
                    },
                    {
                      title: "Level 1 Marathi Language Manual (TaRL)",
                      desc: "Comprehensive pedagogical guide for teaching foundational Marathi letters, words, and simple sentences.",
                      size: "15.3 MB · PDF",
                      file: "Level 1, MAR Language.pdf"
                    },
                    {
                      title: "Level 2 Marathi Language & Math Manual",
                      desc: "Integrated manual for Class 3-5 Marathi reading camp sessions and mathematical operations.",
                      size: "15.3 MB · PDF",
                      file: "Level 2, MAR Language & Math.pdf"
                    },
                    {
                      title: "Level 2 Hindi Language & Math Manual",
                      desc: "Integrated manual for advanced Hindi reading comprehension and intermediate operations.",
                      size: "1.8 MB · PDF",
                      file: "Level 2, HIN Language & Math.pdf"
                    },
                    {
                      title: "Gatividhi Chart (Activity Roadmap)",
                      desc: "Large-format activity roadmap mapping daily tasks and teaching steps across learning levels.",
                      size: "57.6 MB · PDF",
                      file: "Gatividhi Chart.pdf"
                    },
                    {
                      title: "Aao Gayen Sune Banayen (Std. 1-2)",
                      desc: "Activity handbook containing stories, songs, and conversational prompts for Class 1-2.",
                      size: "176.6 MB · PDF",
                      file: "Aao Gayen Sune Banayen Std. 1-2_HG_2022-23.pdf"
                    },
                    {
                      title: "Aao Khele (Let's Play)",
                      desc: "Compendium of physical and conversational learning games designed for camp warm-ups.",
                      size: "6.3 MB · PDF",
                      file: "Aao Khele (2).pdf"
                    },
                    {
                      title: "Anuched Pustika (Paragraph Booklet)",
                      desc: "Structured compilation of paragraphs and simple texts for decoding practice and checks.",
                      size: "44.2 MB · PDF",
                      file: "Anuched Pustika.pdf"
                    },
                    {
                      title: "Class 3-5 Level 1 Math Worksheets",
                      desc: "Foundational math worksheets covering number recognition (1-99) and simple operations.",
                      size: "8.0 MB · PDF",
                      file: "Class 3-5, Level 1, Math Worksheet.pdf"
                    },
                    {
                      title: "Class 3-5 Level 2 Math Worksheets",
                      desc: "Intermediate worksheets targeting subtraction with borrowing and basic multiplication.",
                      size: "93.8 MB · PDF",
                      file: "Class 3-5, Level 2, Math Worksheet.pdf"
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md">{item.size}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                      <a 
                        href={`/api/download-manual?file=${encodeURIComponent(item.file)}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow transition-all"
                      >
                        <Download className="w-4 h-4" /> Download PDF Manual
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* Bottom CTA Card */}
          <div className="p-8 rounded-[32px] bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-orange-500/20 shadow-xl shadow-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 hover:scale-[1.01] transition-all mt-8">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-black flex items-center justify-center sm:justify-start gap-2">
                <BookOpenCheck className="w-6 h-6 animate-bounce" /> Start Practicing Pedagogy Today
              </h3>
              <p className="text-xs text-orange-50 font-medium max-w-xl">
                Access our digital interactive arcade, launch multiplayer student simulations, and record real-time progress using offline-first sync.
              </p>
            </div>
            <Link 
              href="/resources" 
              className="px-6 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all text-xs shrink-0 shadow-lg"
            >
              Start Practicing Pedagogy
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
