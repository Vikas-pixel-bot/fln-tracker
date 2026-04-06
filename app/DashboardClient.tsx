"use client";

import { useState, useEffect, useTransition } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar, Cell, PieChart, Pie } from 'recharts';
import { BookOpen, Calculator, Users, School, Filter, TrendingUp, TrendingDown, Minus, LayoutDashboard, GanttChartSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getDashboardStats } from "@/app/actions";
import CohortBenchmarking from "@/components/CohortBenchmarking";

const LIT_LABELS = ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'];
const NUM_LABELS = ['Beginner', '1-9', '10-99', '100-999'];
const LIT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const NUM_COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];

const TERM_COLORS: Record<string, string> = {
  Baseline: '#dc2626',
  Midline: '#f59e0b',
  Endline: '#22c55e'
};

export default function DashboardClient({ initialStats, hierarchy }: { initialStats: any, hierarchy: any[] }) {
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  const [divId, setDivId] = useState("");
  const [poId, setPoId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [term, setTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'growth' | 'cohort'>('overview');

  const activeDivision = hierarchy.find(d => d.id === divId);
  const pos = activeDivision ? activeDivision.projectOffices : [];
  const activePO = pos.find((p: any) => p.id === poId);
  const schools = activePO ? activePO.schools : [];

  useEffect(() => {
    startTransition(async () => {
      const newStats = await getDashboardStats({ divisionId: divId, projectOfficeId: poId, schoolId, term });
      setStats(newStats);
    });
  }, [divId, poId, schoolId, term]);

  const formatClusteredData = (dataArray: any[], type: 'lit' | 'num') => {
    const labels = type === 'lit' ? LIT_LABELS : NUM_LABELS;
    const key = type === 'lit' ? 'literacyLevel' : 'numeracyLevel';
    const levels = type === 'lit' ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
    return levels.map(level => {
      const entry: any = { name: labels[level] };
      ['Baseline', 'Midline', 'Endline'].forEach(t => {
        const found = dataArray?.find(item => item[key] === level && item.term === t);
        entry[t] = found ? found._count.studentId : 0;
      });
      return entry;
    });
  };

  const formatOpsData = (opsRecord: Record<string, any>) =>
    ['addition', 'subtraction', 'multiplication', 'division'].map(op => {
      const entry: any = { name: op[0].toUpperCase() + op.slice(1) };
      ['Baseline', 'Midline', 'Endline'].forEach(t => { entry[t] = opsRecord[t]?.[op] ?? 0; });
      return entry;
    });

  const litData = formatClusteredData(stats.literacies, 'lit');
  const numData = formatClusteredData(stats.numeracies, 'num');
  const opsData = formatOpsData(stats.operations || {});

  const growth = stats.growth || { studentsWithGrowthData: 0, literacy: { improved: 0, declined: 0, same: 0 }, numeracy: { improved: 0, declined: 0, same: 0 } };
  const latestDist = stats.latestDistribution || { literacy: {}, numeracy: {} };

  const litPieData = LIT_LABELS.map((name, i) => ({ name, value: latestDist.literacy[i] || 0, color: LIT_COLORS[i] })).filter(d => d.value > 0);
  const numPieData = NUM_LABELS.map((name, i) => ({ name, value: latestDist.numeracy[i] || 0, color: NUM_COLORS[i] })).filter(d => d.value > 0);

  const litImprovePct = growth.studentsWithGrowthData > 0 ? Math.round((growth.literacy.improved / growth.studentsWithGrowthData) * 100) : 0;
  const numImprovePct = growth.studentsWithGrowthData > 0 ? Math.round((growth.numeracy.improved / growth.studentsWithGrowthData) * 100) : 0;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700">

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-400 font-bold px-2">
          <Filter className="w-5 h-5" /><span className="hidden lg:inline">Filters:</span>
        </div>
        <select value={term} onChange={e => setTerm(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-sm border-none">
          <option value="">All Terms</option>
          <option value="Baseline">Baseline</option>
          <option value="Midline">Midline</option>
          <option value="Endline">Endline</option>
        </select>
        <select value={divId} onChange={e => { setDivId(e.target.value); setPoId(""); setSchoolId(""); }} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-sm border-none">
          <option value="">All Divisions</option>
          {hierarchy.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={poId} onChange={e => { setPoId(e.target.value); setSchoolId(""); }} disabled={!divId} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-sm border-none disabled:opacity-50">
          <option value="">All Project Offices</option>
          {pos.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={schoolId} onChange={e => setSchoolId(e.target.value)} disabled={!poId} className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium text-sm border-none disabled:opacity-50">
          <option value="">All Schools</option>
          {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {isPending && <div className="text-sm font-bold text-blue-500 animate-pulse whitespace-nowrap">Updating…</div>}
      </div>

      {/* Summary KPIs */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <KPI label="Total Students" value={stats.totalStudents} icon={<Users className="w-5 h-5" />} color="blue" />
        <KPI label="Total Assessments" value={stats.totalAssessments} icon={<BookOpen className="w-5 h-5" />} color="indigo" />
        <KPI label="Active Schools" value={stats.totalSchools} icon={<School className="w-5 h-5" />} color="emerald" />
        <KPI label="Students with Growth Data" value={growth.studentsWithGrowthData} icon={<TrendingUp className="w-5 h-5" />} color="violet" subtitle="assessed 2+ times" />
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        {([['overview', 'Overview', LayoutDashboard], ['growth', 'Student Growth', TrendingUp], ['cohort', 'Progress Trajectory', GanttChartSquare]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === id ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* TAB: GROWTH */}
      {activeTab === 'growth' && (
        <div className={`space-y-6 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
          {growth.studentsWithGrowthData === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-10 text-center space-y-2">
              <p className="text-2xl">📊</p>
              <p className="font-bold text-amber-800">No growth data yet</p>
              <p className="text-amber-600 text-sm">Growth is calculated when a student has 2 or more assessments recorded. Upload Midline or Endline data to see progress.</p>
            </div>
          ) : (
            <>
              {/* Growth headline cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <GrowthCard
                  title="Literacy Growth"
                  icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                  improved={growth.literacy.improved}
                  same={growth.literacy.same}
                  declined={growth.literacy.declined}
                  total={growth.studentsWithGrowthData}
                  pct={litImprovePct}
                  color="blue"
                />
                <GrowthCard
                  title="Numeracy Growth"
                  icon={<Calculator className="w-5 h-5 text-indigo-600" />}
                  improved={growth.numeracy.improved}
                  same={growth.numeracy.same}
                  declined={growth.numeracy.declined}
                  total={growth.studentsWithGrowthData}
                  pct={numImprovePct}
                  color="indigo"
                />
              </div>

              {/* Level distribution pies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DistributionCard title="Current Literacy Levels" data={litPieData} labels={LIT_LABELS} colors={LIT_COLORS} />
                <DistributionCard title="Current Numeracy Levels" data={numPieData} labels={NUM_LABELS} colors={NUM_COLORS} />
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: OVERVIEW (term charts) */}
      {activeTab === 'overview' && (
        <div className={`space-y-6 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
          <BarCard title="Literacy Levels by Term" icon={<BookOpen className="w-5 h-5 text-blue-500" />} data={litData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarCard title="Numeracy Levels by Term" icon={<Calculator className="w-5 h-5 text-indigo-500" />} data={numData} />
            <BarCard title="Math Operations Mastery" icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} data={opsData} />
          </div>
        </div>
      )}

      {/* TAB: COHORT */}
      {activeTab === 'cohort' && (
        <CohortBenchmarking filters={{ divisionId: divId, projectOfficeId: poId, schoolId }} hierarchy={hierarchy} />
      )}
    </div>
  );
}

function KPI({ label, value, icon, color, subtitle }: { label: string; value: number; icon: React.ReactNode; color: string; subtitle?: string }) {
  const colors: Record<string, string> = {
    blue: 'border-l-blue-500 text-blue-600',
    indigo: 'border-l-indigo-500 text-indigo-600',
    emerald: 'border-l-emerald-500 text-emerald-600',
    violet: 'border-l-violet-500 text-violet-600',
  };
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 ${colors[color]}`}>
      <div className={`mb-2 ${colors[color]}`}>{icon}</div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{value?.toLocaleString() ?? 0}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function GrowthCard({ title, icon, improved, same, declined, total, pct, color }: any) {
  const barColor = color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500';
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">{icon}{title}</div>
        <span className={`text-3xl font-black ${pct >= 50 ? 'text-green-500' : pct >= 25 ? 'text-amber-500' : 'text-red-400'}`}>{pct}%</span>
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Improved" value={improved} icon={<ArrowUpRight className="w-4 h-4 text-green-500" />} textColor="text-green-600" />
        <Stat label="Same" value={same} icon={<Minus className="w-4 h-4 text-slate-400" />} textColor="text-slate-500" />
        <Stat label="Declined" value={declined} icon={<ArrowDownRight className="w-4 h-4 text-red-400" />} textColor="text-red-500" />
      </div>
      <p className="text-xs text-slate-400 text-center">Based on {total.toLocaleString()} students with 2+ assessments</p>
    </div>
  );
}

function Stat({ label, value, icon, textColor }: any) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl py-3 px-2 space-y-1">
      <div className="flex justify-center">{icon}</div>
      <p className={`text-xl font-extrabold ${textColor}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-slate-400 font-semibold">{label}</p>
    </div>
  );
}

function DistributionCard({ title, data, labels, colors }: { title: string; data: any[]; labels: string[]; colors: string[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 flex-1">
          {labels.map((label, i) => {
            const item = data.find(d => d.name === label);
            const val = item?.value ?? 0;
            const total = data.reduce((s, d) => s + d.value, 0);
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return (
              <div key={label} className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i] }} />
                <span className="text-slate-600 dark:text-slate-300 flex-1">{label}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{val.toLocaleString()}</span>
                <span className="text-slate-400 text-xs w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BarCard({ title, icon, data }: { title: string; icon: React.ReactNode; data: any[] }) {
  const hasData = data.some(d => d.Baseline > 0 || d.Midline > 0 || d.Endline > 0);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
        {icon} {title}
      </div>
      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No assessment data for selected filters</div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px' }} />
              <Bar dataKey="Baseline" fill={TERM_COLORS.Baseline} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Midline" fill={TERM_COLORS.Midline} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Endline" fill={TERM_COLORS.Endline} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
