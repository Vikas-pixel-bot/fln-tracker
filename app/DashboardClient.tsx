"use client";

import { useState, useEffect, useTransition } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { BookOpen, Calculator, Users, School, Filter, TrendingUp, LayoutDashboard } from 'lucide-react';
import { getDashboardStats } from "@/app/actions";

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
  const [activeTab, setActiveTab] = useState<'overview' | 'trends'>('trends');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [trendType, setTrendType] = useState<'literacy' | 'numeracy'>('literacy');

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
  const formatTermData = (dataArray: any[], type: 'lit' | 'num') => {
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
        entry[t] = termTotals[t] > 0 ? Math.round((count / termTotals[t]) * 100) : 0;
      });
      return entry;
    });
  };

  const formatOpsData = (ops: any) =>
    ['addition', 'subtraction', 'multiplication', 'division'].map(op => {
      const entry: any = { name: op[0].toUpperCase() + op.slice(1) };
      TERMS.forEach(t => { entry[t] = ops?.[t]?.[op] ?? 0; });
      return entry;
    });

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
    <div className="w-full space-y-6 animate-in fade-in duration-700">

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
      <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <KPI label="Total Students" value={stats.totalStudents} icon={<Users className="w-5 h-5" />} color="blue" />
        <KPI label="Total Assessments" value={stats.totalAssessments} icon={<BookOpen className="w-5 h-5" />} color="indigo" />
        <KPI label="Active Schools" value={stats.totalSchools} icon={<School className="w-5 h-5" />} color="emerald" />
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        {([
          ['trends', 'Level Trends', TrendingUp],
          ['overview', 'Term Overview', LayoutDashboard],
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
          <BarCard title="Literacy Levels by Term (%)" icon="📚" data={formatTermData(stats.literacies, 'lit')} percentage />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarCard title="Numeracy Levels by Term (%)" icon="🔢" data={formatTermData(stats.numeracies, 'num')} percentage />
            <BarCard title="Operations Mastery by Term" icon="➕" data={formatOpsData(stats.operations)} />
          </div>
        </div>
      )}

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

function KPI({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: 'border-l-blue-500 text-blue-600',
    indigo: 'border-l-indigo-500 text-indigo-600',
    emerald: 'border-l-emerald-500 text-emerald-600',
  };
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 ${colors[color]}`}>
      <div className={`mb-2 ${colors[color]}`}>{icon}</div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{(value ?? 0).toLocaleString()}</h3>
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
