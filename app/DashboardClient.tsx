"use client";

import { useState, useEffect, useTransition } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { BookOpen, Calculator, Users, School, Filter, TrendingUp, LayoutDashboard, Search, Sparkles, AlertCircle, TrendingDown, Trophy, Medal, BrainCircuit, Lightbulb } from 'lucide-react';
import { getDashboardStats, getStrugglingStudents, getGrowthVelocity, getInterventionPlan, getPORankings } from "@/app/actions";
import { analyzeDashboardQuery } from "@/app/actions/ai";

const LIT_LABELS = ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'];
const NUM_LABELS = ['Beginner', '1-9', '10-99', '100-999'];
const LIT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const NUM_COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];
const TERM_COLORS: Record<string, string> = { Baseline: '#6366f1', Midline: '#f59e0b', Endline: '#22c55e' };
const TERMS = ['Baseline', 'Midline', 'Endline'];

export default function DashboardClient({ initialStats, hierarchy }: { initialStats: any; hierarchy: any[] }) {
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  const [divId, setDivId] = useState("");
  const [poId, setPoId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [term, setTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'ranking'>('trends');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [rankings, setRankings] = useState<any[]>([]);
  const [trendType, setTrendType] = useState<'literacy' | 'numeracy'>('literacy');
  const [showPct, setShowPct] = useState(true);
  const [query, setQuery] = useState("");
  const [struggling, setStruggling] = useState<any[]>([]);
  const [velocity, setVelocity] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ insight: string; recommendation?: string; summary?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);

  // AI Smart Filter Logic
  const handleQuery = (val: string) => {
    setQuery(val);
    const v = val.toLowerCase();
    
    // Class matching
    const classMatch = v.match(/class\s+(\d)/);
    if (classMatch) setSelectedClass(Number(classMatch[1]));
    
    // Type matching
    if (v.includes("literacy") || v.includes("read")) setTrendType("literacy");
    if (v.includes("numeracy") || v.includes("math")) setTrendType("numeracy");
    
    // Tab switching
    if (v.includes("trend") || v.includes("growth")) setActiveTab("trends");
    if (v.includes("overview") || v.includes("summary")) setActiveTab("overview");
  };

  const activeDivision = hierarchy.find(d => d.id === divId);
  const pos = activeDivision ? activeDivision.projectOffices : [];
  const activePO = pos.find((p: any) => p.id === poId);
  const schools = activePO ? activePO.schools : [];

  useEffect(() => {
    startTransition(async () => {
      const newStats = await getDashboardStats({ divisionId: divId, projectOfficeId: poId, schoolId, term });
      setStats(newStats);
      
      const v = await getGrowthVelocity(schoolId);
      setVelocity(v);

      if (schoolId) {
        const s = await getStrugglingStudents(schoolId);
        setStruggling(s);
      }

      const r = await getPORankings(divId || undefined);
      setRankings(r);
    });
  }, [divId, poId, schoolId, term]);

  // --- Build chart data for the selected class + type ---
  function buildChartData(type: 'literacy' | 'numeracy') {
    const labels = type === 'literacy' ? LIT_LABELS : NUM_LABELS;
    const numLevels = labels.length;

    let breakdown: Record<string, { total: number; levels: Record<number, { count: number; pct: number }> }>;

    if (selectedClass === 'all') {
      breakdown = stats.overallBreakdown?.[type] ?? {};
    } else {
      breakdown = stats.classBreakdown?.[type]?.[selectedClass] ?? {};
    }

    // One row per level; columns per term
    return labels.map((label, lvl) => {
      const row: any = { name: label };
      for (const t of TERMS) {
        const data = breakdown[t];
        row[`${t}_pct`] = data?.levels?.[lvl]?.pct ?? 0;
        row[`${t}_count`] = data?.levels?.[lvl]?.count ?? 0;
        row[`${t}_total`] = data?.total ?? 0;
      }
      return row;
    });
  }

  // For the overview term charts — returns % normalised within each term
  const formatTermData = (dataArray: any[], type: 'lit' | 'num', asPct: boolean) => {
    const labels = type === 'lit' ? LIT_LABELS : NUM_LABELS;
    const key = type === 'lit' ? 'literacyLevel' : 'numeracyLevel';
    const termTotals: Record<string, number> = {};
    TERMS.forEach(t => {
      termTotals[t] = (dataArray ?? [])
        .filter((item: any) => item.term === t)
        .reduce((sum: number, item: any) => sum + item._count.studentId, 0);
    });
    return labels.map((label, level) => {
      const entry: any = { name: label };
      TERMS.forEach(t => {
        const found = dataArray?.find((item: any) => item[key] === level && item.term === t);
        const count = found ? found._count.studentId : 0;
        entry[t] = asPct ? (termTotals[t] > 0 ? Math.round((count / termTotals[t]) * 100) : 0) : count;
      });
      return entry;
    });
  };

  const formatOpsData = (ops: any, asPct: boolean) => {
    const termTotals: Record<string, number> = {};
    TERMS.forEach(t => {
      termTotals[t] = (stats.literacies ?? [])
        .filter((item: any) => item.term === t)
        .reduce((sum: number, item: any) => sum + item._count.studentId, 0);
    });
    return ['addition', 'subtraction', 'multiplication', 'division'].map(op => {
      const entry: any = { name: op[0].toUpperCase() + op.slice(1) };
      TERMS.forEach(t => {
        const count = ops?.[t]?.[op] ?? 0;
        entry[t] = asPct ? (termTotals[t] > 0 ? Math.round((count / termTotals[t]) * 100) : 0) : count;
      });
      return entry;
    });
  };

  const litChartData = buildChartData('literacy');
  const numChartData = buildChartData('numeracy');
  const availableClasses: number[] = stats.availableClasses ?? [];

  // Custom tooltip for % + count
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 text-sm min-w-[180px]">
        <p className="font-extrabold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((p: any) => {
          const term = p.dataKey.replace('_pct', '');
          const count = p.payload[`${term}_count`];
          const total = p.payload[`${term}_total`];
          return (
            <div key={term} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
                <span className="text-slate-500">{term}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-800 dark:text-slate-100">{p.value}%</span>
                <span className="text-slate-400 text-xs ml-1">({count ?? 0}/{total ?? 0})</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">


      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-slate-400 font-bold px-2 shrink-0">
          <Filter className="w-5 h-5" /><span className="hidden lg:inline text-sm">Filters:</span>
        </div>
        <select value={term} onChange={e => setTerm(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm border-none">
          <option value="">All Terms</option>
          {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={divId} onChange={e => { setDivId(e.target.value); setPoId(""); setSchoolId(""); }} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm border-none">
          <option value="">All Divisions</option>
          {hierarchy.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={poId} onChange={e => { setPoId(e.target.value); setSchoolId(""); }} disabled={!divId} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm border-none disabled:opacity-50">
          <option value="">All Project Offices</option>
          {pos.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={schoolId} onChange={e => setSchoolId(e.target.value)} disabled={!poId} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-sm border-none disabled:opacity-50">
          <option value="">All Schools</option>
          {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {isPending && <span className="text-sm font-bold text-blue-500 animate-pulse shrink-0">Updating…</span>}
      </div>

      {/* KPIs */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <KPI label="Total Students" value={stats.totalStudents} icon={<Users className="w-5 h-5" />} color="blue" />
        <KPI label="Total Assessments" value={stats.totalAssessments} icon={<BookOpen className="w-5 h-5" />} color="indigo" />
        <KPI label="Learning Velocity" value={velocity?.velocity ?? 0} icon={<TrendingUp className="w-5 h-5" />} color="emerald" suffix="%" />
        <KPI label="Arena Engagement" value={stats.totalArenaBattles ?? 0} icon={<Sparkles className="w-5 h-5" />} color="blue" suffix=" Battles" />
      </div>

      {/* STRUGGLING STUDENTS ALERT */}
      {(query.toLowerCase().includes("struggle") || query.toLowerCase().includes("zero") || struggling.length > 5) && (
        <div className="animate-in slide-in-from-top-4 duration-500 my-8">
          <div className="bg-red-50 dark:bg-red-950/20 rounded-[40px] p-8 border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-red-500/5">
             <div className="w-20 h-20 bg-red-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-red-500/20 shrink-0">
                <AlertCircle className="w-10 h-10 text-white" />
             </div>
             <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-red-900 dark:text-red-400">Critical: {struggling.length} Students with Zero Progress</h3>
                <p className="text-red-700 dark:text-red-500/70 font-medium">These students have not moved from their Baseline level. Recommended: Intensive 10-day Bootcamp.</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                   {struggling.slice(0, 10).map((s: any) => (
                      <div key={s.id} className="px-3 py-1.5 bg-white dark:bg-red-900/40 rounded-xl text-xs font-bold text-red-600 border border-red-200 dark:border-red-800 flex items-center gap-2">
                         <TrendingDown className="w-3 h-3" /> {s.name} (Lvl {s.baselineLevel ?? 0} → {s.latestLevel})
                      </div>
                   ))}
                </div>
             </div>
             <button 
               onClick={async () => {
                 setIsGeneratingPlan(true);
                 const p = await getInterventionPlan(struggling);
                 setPlan(p);
                 setIsGeneratingPlan(false);
               }}
               disabled={isGeneratingPlan}
               className="px-8 py-4 bg-red-600 text-white font-black rounded-3xl hover:bg-red-700 transition-all shadow-lg shrink-0 uppercase tracking-widest text-[10px] disabled:opacity-50"
             >
                {isGeneratingPlan ? "Analyzing..." : "Generate Intervention"}
             </button>
          </div>
        </div>
      )}

      {/* INTERVENTION PLAN DISPLAY */}
      {plan && (
        <div className="animate-in zoom-in-95 duration-500 my-8">
           <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32" />
              <button onClick={() => setPlan(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 font-bold">Close X</button>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Core Focus</p>
                       <p className="text-xl font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{plan.focus}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Required Resources</p>
                       <div className="flex flex-wrap gap-2">
                          {plan.resources.map((r: string) => (
                             <span key={r} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{r}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Milestone Schedule</p>
                    <div className="space-y-4">
                       {plan.schedule.map((s: any) => (
                          <div key={s.day} className="flex gap-4">
                             <div className="w-12 text-blue-600 font-black text-sm pt-0.5">D{s.day}</div>
                             <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{s.activity}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        {([
          ['trends', 'Level Trends', TrendingUp],
          ['overview', 'Term Overview', LayoutDashboard],
          ['ranking', 'P.O. Ranking', Trophy],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* TAB: LEVEL TRENDS */}
      {activeTab === 'trends' && (
        <div className={`space-y-5 transition-opacity ${isPending ? 'opacity-50' : ''}`}>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Type toggle */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
              <button onClick={() => setTrendType('literacy')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${trendType === 'literacy' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <BookOpen className="w-4 h-4 inline mr-1" />Literacy
              </button>
              <button onClick={() => setTrendType('numeracy')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${trendType === 'numeracy' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>
                <Calculator className="w-4 h-4 inline mr-1" />Numeracy
              </button>
            </div>

            {/* Class selector */}
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setSelectedClass('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${selectedClass === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                All Classes
              </button>
              {availableClasses.map(cls => (
                <button key={cls} onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${selectedClass === cls ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  Class {cls}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 ml-auto">
              % normalised within each term — totals differ across terms
            </span>
          </div>

          {/* Main trend chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              {trendType === 'literacy' ? '📚 Literacy' : '🔢 Numeracy'} Level Distribution by Term
              {selectedClass !== 'all' && <span className="ml-2 text-blue-600">— Class {selectedClass}</span>}
            </h2>
            <p className="text-xs text-slate-400 mb-6">Each bar shows % of assessed students at that level within the term. Hover for actual counts.</p>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendType === 'literacy' ? litChartData : numChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<TrendTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px' }}
                    formatter={(value) => value.replace('_pct', '')} />
                  {TERMS.map(t => (
                    <Bar key={t} dataKey={`${t}_pct`} name={t} fill={TERM_COLORS[t]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary table */}
          <SummaryTable
            type={trendType}
            selectedClass={selectedClass}
            overallBreakdown={stats.overallBreakdown}
            classBreakdown={stats.classBreakdown}
          />
        </div>
      )}

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className={`space-y-6 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
          <div className="flex justify-end">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
              <button onClick={() => setShowPct(true)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${showPct ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                %
              </button>
              <button onClick={() => setShowPct(false)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${!showPct ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                #
              </button>
            </div>
          </div>
          <BarCard title={`Literacy Levels by Term (${showPct ? '%' : '#'})`} icon="📚" data={formatTermData(stats.literacies, 'lit', showPct)} percentage={showPct} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarCard title={`Numeracy Levels by Term (${showPct ? '%' : '#'})`} icon="🔢" data={formatTermData(stats.numeracies, 'num', showPct)} percentage={showPct} />
            <BarCard title={`Operations Mastery by Term (${showPct ? '%' : '#'})`} icon="➕" data={formatOpsData(stats.operations, showPct)} percentage={showPct} />
          </div>
        </div>
      )}

      {/* TAB: RANKING */}
      {activeTab === 'ranking' && (
        <div className={`space-y-6 animate-in slide-in-from-bottom-4 duration-500 ${isPending ? 'opacity-50' : ''}`}>
           <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                       <Trophy className="w-8 h-8 text-yellow-500" /> Project Office Leaderboard
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Ranking based on student story reading and subtraction mastery rates.</p>
                 </div>
                 <div className="hidden md:flex gap-2">
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                       Top Performer: {rankings[0]?.name || "N/A"}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 {rankings.map((po, index) => (
                    <div key={po.id} className="group relative bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1">
                       <div className="flex flex-col md:flex-row items-center gap-8">
                          {/* Rank */}
                          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                             {index === 0 && <Medal className="w-8 h-8 text-yellow-500" />}
                             {index === 1 && <Medal className="w-8 h-8 text-slate-400" />}
                             {index === 2 && <Medal className="w-8 h-8 text-orange-400" />}
                             {index > 2 && <span className="text-xl font-black text-slate-300">#{index + 1}</span>}
                          </div>

                          <div className="flex-1 space-y-4">
                             <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white">{po.name}</h3>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Score</p>
                                   <p className="text-2xl font-black text-blue-600">{po.score}%</p>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Story Progress */}
                                <div className="space-y-2">
                                   <div className="flex justify-between text-[11px] font-bold">
                                      <span className="text-slate-500 uppercase tracking-wider">Story Reading</span>
                                      <span className="text-slate-800 dark:text-slate-200">{po.storyPct}%</span>
                                   </div>
                                   <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${po.storyPct}%` }} />
                                   </div>
                                </div>
                                {/* Subtraction Progress */}
                                <div className="space-y-2">
                                   <div className="flex justify-between text-[11px] font-bold">
                                      <span className="text-slate-500 uppercase tracking-wider">Subtraction Mastery</span>
                                      <span className="text-slate-800 dark:text-slate-200">{po.subtractionPct}%</span>
                                   </div>
                                   <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${po.subtractionPct}%` }} />
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="shrink-0 text-center px-6 border-l border-slate-100 dark:border-slate-800 hidden lg:block">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessed</p>
                             <p className="text-xl font-black text-slate-800 dark:text-slate-100">{po.totalAssessed}</p>
                          </div>
                       </div>
                    </div>
                 ))}

                 {rankings.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                          <AlertCircle className="w-10 h-10 text-slate-300" />
                       </div>
                       <p className="text-slate-400 font-bold">No ranking data available for selected filters.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
      {/* FLOATING MISSION ASSISTANT (THE BRAIN) */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {/* Chat Panel */}
        {isBotOpen && (
          <div className="mb-4 w-[380px] md:w-[450px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500 group text-left">
             {/* Header */}
             <div className="bg-slate-900 p-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16" />
                <div className="flex items-center gap-3 relative z-10">
                   <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BrainCircuit className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h4 className="text-white font-black tracking-tight">Mission Assistant</h4>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Accessing Global Context</p>
                   </div>
                </div>
                <button onClick={() => setIsBotOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                   <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
             </div>

             {/* Content Area */}
             <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
                {aiInsight ? (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                     <div className="flex gap-2 items-center">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                           {aiInsight.summary || "Executive Insight"}
                        </span>
                     </div>
                     <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed">{aiInsight.insight}</p>
                     
                     {aiInsight.recommendation && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-3 items-start">
                           <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategist's Recommendation</p>
                              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{aiInsight.recommendation}</p>
                           </div>
                        </div>
                     )}

                     <button onClick={() => setAiInsight(null)} className="w-full py-3 text-xs font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all">
                        Ask another question
                     </button>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 text-center">
                     <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[24px] flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                     </div>
                     <p className="text-slate-600 dark:text-slate-400 font-medium px-4">Hello! I am "The Brain". I have access to all Mission data including rankings, struggling students, and regional performance. How can I assist today?</p>
                     
                     <div className="grid grid-cols-1 gap-2 pt-4">
                        {[
                          "Compare Baseline vs Endline results",
                          "Which PO is the top performer?",
                          "Summarize status of struggling students",
                          "How is Class 3 literacy moving?"
                        ].map(q => (
                          <button key={q} onClick={() => { setQuery(q); }} className="text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-800">
                             {q}
                          </button>
                        ))}
                     </div>
                  </div>
                )}
             </div>

             {/* Input Area */}
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!query.trim()) return;
                    setIsAnalyzing(true);
                    try {
                      const result = await analyzeDashboardQuery(query, {
                        stats,
                        hierarchy,
                        rankings,
                        struggling,
                        velocity
                      });
                      if (result.filters) {
                         if (result.filters.classNum) setSelectedClass(result.filters.classNum);
                         if (result.filters.subject === 'literacy') setTrendType('literacy');
                         if (result.filters.subject === 'numeracy') setTrendType('numeracy');
                         if (result.tab) setActiveTab(result.tab);
                      }
                      setAiInsight(result);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  className="relative flex items-center"
                >
                   <input 
                      type="text"
                      className="w-full bg-white dark:bg-slate-900 rounded-2xl px-5 py-3.5 pr-14 text-sm font-medium border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none"
                      placeholder="Ask the Mission Brain..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                   />
                   <button 
                     type="submit" 
                     disabled={isAnalyzing}
                     className="absolute right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                   >
                      {isAnalyzing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                   </button>
                </form>
             </div>
          </div>
        )}

        {/* FAB Button */}
        <button 
          onClick={() => setIsBotOpen(!isBotOpen)}
          className={`group flex items-center gap-3 p-4 rounded-[32px] shadow-2xl transition-all hover:scale-105 active:scale-95 ${isBotOpen ? 'bg-slate-900 dark:bg-slate-800 scale-90' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
           {!isBotOpen && <span className="text-white text-sm font-black uppercase tracking-widest pl-2 hidden md:inline">Ask Mission Brain</span>}
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isBotOpen ? 'rotate-90 bg-white/10' : 'bg-white shadow-xl'}`}>
              <BrainCircuit className={`w-6 h-6 ${isBotOpen ? 'text-white' : 'text-blue-600'}`} />
           </div>
        </button>
      </div>

    </div>
  );
}

function SummaryTable({ type, selectedClass, overallBreakdown, classBreakdown }: any) {
  const labels = type === 'literacy' ? ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'] : ['Beginner', '1-9', '10-99', '100-999'];
  const breakdown = selectedClass === 'all' ? overallBreakdown?.[type] : classBreakdown?.[type]?.[selectedClass];
  if (!breakdown) return null;
  const termsPresent = TERMS.filter(t => breakdown[t]);
  if (termsPresent.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
          Detailed Breakdown {selectedClass !== 'all' ? `— Class ${selectedClass}` : '— All Classes'}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3">Level</th>
              {termsPresent.map(t => (
                <th key={t} className="px-4 py-3 text-center" colSpan={2}>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: TERM_COLORS[t] }} />
                    {t} <span className="text-slate-400 font-normal">(n={breakdown[t]?.total ?? 0})</span>
                  </span>
                </th>
              ))}
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-400">
              <th className="px-6 py-1" />
              {termsPresent.map(t => (
                <>
                  <th key={`${t}_pct`} className="px-4 py-1 text-center">%</th>
                  <th key={`${t}_cnt`} className="px-4 py-1 text-center">#</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {labels.map((label, lvl) => (
              <tr key={label} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-3 font-semibold text-slate-700 dark:text-slate-200">{label}</td>
                {termsPresent.map(t => {
                  const d = breakdown[t]?.levels?.[lvl];
                  return (
                    <>
                      <td key={`${t}_pct`} className="px-4 py-3 text-center">
                        <span className="font-extrabold" style={{ color: TERM_COLORS[t] }}>{d?.pct ?? 0}%</span>
                      </td>
                      <td key={`${t}_cnt`} className="px-4 py-3 text-center text-slate-500">{d?.count ?? 0}</td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPI({ label, value, icon, color, suffix = "" }: { label: string; value: number; icon: React.ReactNode; color: string; suffix?: string }) {
  const colors: Record<string, string> = {
    blue: 'border-l-blue-500 text-blue-600',
    indigo: 'border-l-indigo-500 text-indigo-600',
    emerald: 'border-l-emerald-500 text-emerald-600',
  };
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 ${colors[color]}`}>
      <div className={`mb-2 ${colors[color]}`}>{icon}</div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{(value ?? 0).toLocaleString()}{suffix}</h3>
    </div>
  );
}

function BarCard({ title, icon, data, percentage }: { title: string; icon: string; data: any[]; percentage?: boolean }) {
  const hasData = data.some((d: any) => TERMS.some(t => (d[t] ?? 0) > 0));
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">{icon} {title}</h2>
      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data for selected filters</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={percentage ? (v: number) => `${v}%` : undefined}
                domain={percentage ? [0, 100] : undefined} />
              <Tooltip cursor={{ fill: '#f8fafc' }}
                formatter={percentage ? (value: any) => [`${value}%`] : undefined}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '12px' }} />
              {TERMS.map(t => <Bar key={t} dataKey={t} fill={TERM_COLORS[t]} radius={[4, 4, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
