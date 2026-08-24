"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  Info,
  Calendar,
  ExternalLink,
  Target,
  Sparkles,
  TrendingUp
} from "lucide-react";
import WarliMotif from "@/components/warli/WarliMotif";
import { cn } from "@/lib/utils";

type TabId = "about" | "levels" | "flow" | "implementation" | "manuals";

export default function CatchupPage() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  
  // Implementation tracker state (48 days)
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  
  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("catchup_48_days_log");
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse log", e);
      }
    }
  }, []);

  const toggleDay = (dayNum: number) => {
    const newDays = completedDays.includes(dayNum) 
      ? completedDays.filter(d => d !== dayNum)
      : [...completedDays, dayNum];
      
    setCompletedDays(newDays);
    localStorage.setItem("catchup_48_days_log", JSON.stringify(newDays));
  };

  const tabs = [
    { id: "about", label: "About the Course", icon: Info },
    { id: "levels", label: "Learning Levels", icon: Award },
    { id: "flow", label: "Daily 120m Flow", icon: Clock },
    { id: "implementation", label: "48-Day Log", icon: Calendar },
    { id: "manuals", label: "Teaching Manuals", icon: BookOpen },
  ];

  return (
    <div className="w-full pb-10">
      
      {/* Header section */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link 
          href="/about-lotb/msms" 
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to MSMS Cohorts
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <WarliMotif variant="sun" size={42} className="warli-ink opacity-80 shrink-0" />
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Catch-up Course (Grades 5-7)
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-2xl">
                A 48-day academic intervention designed to bridge the gap and shift students to Grade 5 competency in Maths and Marathi.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50 self-start md:self-auto text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4" /> 8 Weeks Program
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
          <div className="space-y-3 px-3 mb-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Course Outline</p>
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100/30 dark:border-orange-900/30 text-[10px] font-bold uppercase tracking-wider">
              Targets foundational gaps in Maths and Marathi through rapid, incremental remediation.
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
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
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

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB: About */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">About the Course</h2>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                  The Catch-Up Course is a time-bound academic intervention designed to help learners in Grades 5 to 7 strengthen their foundational skills in Mathematics and Marathi. The central goal is to ensure a shift in competency level among students, enabling them to bridge the gap between what they currently know and Grade 5-level expectations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-black text-orange-600 dark:text-orange-400 text-sm">Baseline Competency</h5>
                      <Target className="w-5 h-5 text-orange-500/50" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Assumed to be at a <strong>Grade 4</strong> level (considering most students will have just entered Grade 5).
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-black text-amber-600 dark:text-amber-400 text-sm">Target Competency</h5>
                      <CheckCircle className="w-5 h-5 text-amber-500/50" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Reaching <strong>Grade 5</strong> competency (core concepts useful even for Grades 6 and 7).
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Core Learning Outcomes</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>📐</span> Mathematics
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium pl-6 list-disc">
                        <li>Understanding numbers (place value, number sense)</li>
                        <li>Addition & subtraction (without & with carry/borrow)</li>
                        <li>Multiplication (single-digit & two-digit)</li>
                        <li>Division (basic concept & practical applications)</li>
                        <li>Word problems using all four operations</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>🗣️</span> Marathi (Language)
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium pl-6 list-disc">
                        <li>Recognizing letters & words</li>
                        <li>Reading simple sentences with correct pronunciation</li>
                        <li>Reading short paragraphs fluently</li>
                        <li>Reading comprehension (answering basic questions)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Levels & Assessment */}
          {activeTab === "levels" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Assessment Framework</h2>
                
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 mb-8">
                  <h4 className="font-black text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Baseline Assessment (Day 1)
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed font-medium mb-4">
                    Conducted at the start of the course to determine current learner levels against the Grade 4 baseline expectation.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 border-b border-blue-200 dark:border-blue-800 pb-1">Marathi Competencies</h5>
                      <ul className="space-y-1.5 text-xs text-blue-700 dark:text-blue-200 list-disc pl-4">
                        <li><strong>Reading:</strong> Letter → Word → Paragraph → Story</li>
                        <li><strong>Writing:</strong> Word → Paragraph (Picture comprehension based)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 border-b border-blue-200 dark:border-blue-800 pb-1">Maths Competencies</h5>
                      <ul className="space-y-1.5 text-xs text-blue-700 dark:text-blue-200 list-disc pl-4">
                        <li>Recognition of 2- and 3-digit numbers</li>
                        <li>Basic comparison (greater/lesser)</li>
                        <li>Ordering, place value</li>
                        <li>Simple operations and word problems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Continuous Monitoring (Every 6th Day)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Tracking progress is critical to ensuring the catch-up course is effective. We use a combination of checkpoints and comparative analysis:
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5">
                    <li>On every 6th day, a recap/checkpoint assessment is conducted.</li>
                    <li>All recap/checkpoint assessments should be recorded (in written or oral formats).</li>
                    <li>Educators use both the score and the competency movement to show progress.</li>
                    <li>Ultimately, we compare <strong>baseline → endline shifts</strong> in specific skill areas rather than just looking at flat marks.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Flow */}
          {activeTab === "flow" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">The 120-Minute Daily Flow</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-semibold uppercase tracking-wider">Incremental Pedagogy: Start basics, build complexity</p>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Literacy timeline */}
                  <div>
                    <h4 className="text-sm font-extrabold text-orange-500 mb-6 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Marathi Block (60 Mins)
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 italic">Based on LSRW Framework (Listening, Speaking, Reading, Writing)</p>
                    <div className="space-y-5 border-l-2 border-orange-200 dark:border-orange-950/80 ml-3 pl-6">
                      {[
                        { time: "5–7 mins", title: "Listening" },
                        { time: "8–10 mins", title: "Speaking" },
                        { time: "15–18 mins", title: "Reading" },
                        { time: "15–18 mins", title: "Writing" },
                        { time: "5 mins", title: "Wrap-up" }
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white dark:border-slate-950" />
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-orange-500 px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20">{step.time}</span>
                            <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{step.title}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Numeracy timeline */}
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-600 mb-6 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Mathematics Block (60 Mins)
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 italic">Structured Daily Format (TaRL Inspired)</p>
                    <div className="space-y-5 border-l-2 border-amber-200 dark:border-amber-950/80 ml-3 pl-6">
                      {[
                        { time: "10 mins", title: "Warm-Up", desc: "Physical movement, energizers" },
                        { time: "40 mins", title: "Core Activity", desc: "Concept teaching, examples, individual problem-solving, group tasks" },
                        { time: "10 mins", title: "Wrap-Up", desc: "Relay-style games, summary board activity" }
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-950" />
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-amber-600 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20">{step.time}</span>
                              <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{step.title}</h5>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3">Teaching Methodology</h4>
                  <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400 list-disc pl-5">
                    <li><strong>Activity-Based Learning:</strong> Games, stories, hands-on exercises</li>
                    <li><strong>Group Work:</strong> Peer learning and collaboration</li>
                    <li><strong>Daily Reinforcement:</strong> Revisiting previous concepts before moving ahead</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Implementation (48 days) */}
          {activeTab === "implementation" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Implementation Log</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Track the delivery of your 48-day catch-up course. Click a day to mark it as delivered.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-orange-500">{completedDays.length} / 48</div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Days Completed</div>
                  </div>
                </div>

                {/* Grid of 8 weeks */}
                <div className="space-y-6">
                  {Array.from({ length: 8 }).map((_, weekIndex) => {
                    const weekNum = weekIndex + 1;
                    return (
                      <div key={weekNum} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Week {weekNum}</h4>
                          {weekNum === 8 && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">Revision & Assessment</span>}
                          {weekNum % 4 === 0 && weekNum !== 8 && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700">Checkpoint</span>}
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {Array.from({ length: 6 }).map((_, dayIndex) => {
                            const globalDay = (weekIndex * 6) + dayIndex + 1;
                            const isCompleted = completedDays.includes(globalDay);
                            
                            return (
                              <button
                                key={globalDay}
                                onClick={() => toggleDay(globalDay)}
                                className={cn(
                                  "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all group relative overflow-hidden",
                                  isCompleted 
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-orange-300 dark:hover:border-orange-600"
                                )}
                              >
                                {isCompleted && (
                                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 opacity-50" />
                                )}
                                <span className="relative z-10 text-[10px] font-bold uppercase opacity-60">Day</span>
                                <span className="relative z-10 text-lg font-black">{globalDay}</span>
                                {globalDay % 6 === 0 && !isCompleted && (
                                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-xs text-slate-400 text-center mt-6 italic">
                  Note: This log is currently saved locally on your device.
                </p>
              </div>
            </div>
          )}

          {/* TAB: Manuals */}
          {activeTab === "manuals" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/30 dark:shadow-none">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Teaching Manuals & PDF Downloads</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                  Access the complete 48-day lesson plans and TaRL pedagogical manuals via interactive flipbooks or direct PDF downloads for offline classroom use.
                </p>

                {/* Flipbooks Grid */}
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Interactive Digital Flipbooks</h3>
                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  {/* Maths Manual Flipbook */}
                  <div className="group flex flex-col rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 hover:border-amber-400 transition-all shadow-sm hover:shadow-xl bg-slate-50 dark:bg-slate-900 p-6 relative justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/30">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Mathematics Manual</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">48 Days Catch-up Course (Flipbook)</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6 relative z-10">
                      <a 
                        href="https://heyzine.com/flip-book/681071e52c.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Flipbook
                      </a>
                      <a 
                        href="/api/download-manual?file=Level%201%2C%20MAR%20Math%20Manual.pdf"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" /> Download PDF
                      </a>
                    </div>
                  </div>

                  {/* Marathi Manual Flipbook */}
                  <div className="group flex flex-col rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 hover:border-orange-400 transition-all shadow-sm hover:shadow-xl bg-slate-50 dark:bg-slate-900 p-6 relative justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/30">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Marathi Manual</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">48 Days Catch-up Course (Flipbook)</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6 relative z-10">
                      <a 
                        href="https://heyzine.com/flip-book/764579235d.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Flipbook
                      </a>
                      <a 
                        href="/api/download-manual?file=Level%201%2C%20MAR%20Language.pdf"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" /> Download PDF
                      </a>
                    </div>
                  </div>
                </div>

                {/* Direct PDF Download List */}
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">Direct TaRL Manual Downloads (PDF)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "Level 1 Marathi Math Manual (TaRL)", file: "Level 1, MAR Math Manual.pdf", size: "31.5 MB" },
                    { name: "Level 1 Marathi Language Manual (TaRL)", file: "Level 1, MAR Language.pdf", size: "15.3 MB" },
                    { name: "Level 2 Marathi Language & Math Manual", file: "Level 2, MAR Language & Math.pdf", size: "15.3 MB" },
                    { name: "Level 2 Hindi Language & Math Manual", file: "Level 2, HIN Language & Math.pdf", size: "1.8 MB" },
                    { name: "Gatividhi Chart (Activity Roadmap)", file: "Gatividhi Chart.pdf", size: "57.6 MB" },
                    { name: "Class 3-5 Level 1 Math Worksheets", file: "Class 3-5, Level 1, Math Worksheet.pdf", size: "8.0 MB" },
                    { name: "Class 3-5 Level 2 Math Worksheets", file: "Class 3-5, Level 2, Math Worksheet.pdf", size: "93.8 MB" },
                    { name: "Class 3-5 Word Problem Cards", file: "Class 3-5, Word Problem Card.pdf", size: "1.9 MB" },
                    { name: "Basic Stories Level 1 Booklet", file: "Basic Stories  1.pdf", size: "42.4 MB" },
                    { name: "Anuched Pustika (Paragraph Booklet)", file: "Anuched Pustika.pdf", size: "44.2 MB" },
                  ].map((m, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-amber-400 transition-all">
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">{m.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{m.size} · PDF</p>
                      </div>
                      <a 
                        href={`/api/download-manual?file=${encodeURIComponent(m.file)}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-xl shadow transition-all shrink-0 flex items-center gap-1.5"
                      >
                        Download PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
