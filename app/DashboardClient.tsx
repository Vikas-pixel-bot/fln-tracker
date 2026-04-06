"use client";

import { useState, useEffect, useTransition } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, Calculator, Users, GraduationCap, School, Filter, TrendingUp, LayoutDashboard, GanttChartSquare } from 'lucide-react';
import { getDashboardStats } from "@/app/actions";
import CohortBenchmarking from "@/components/CohortBenchmarking";

const LEVEL_LABELS_LIT = ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'];
const LEVEL_LABELS_NUM = ['Beginner', 'Num 1-9', 'Num 10-99', 'Num 100-999'];
const OPS_LABELS = ['Addition', 'Subtraction', 'Multiplication', 'Division'];

const TERM_COLORS = {
  Baseline: '#dc2626', // Red
  Midline: '#f59e0b',  // Yellow
  Endline: '#22c55e'   // Green
};

export default function DashboardClient({ initialStats, hierarchy }: { initialStats: any, hierarchy: any[] }) {

  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();

  const [divId, setDivId] = useState("");
  const [poId, setPoId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [term, setTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'cohort'>('overview');

  // Process Literacy/Numeracy into Clustered Formats
  const formatClusteredData = (dataArray: any[], type: 'lit'|'num') => {
    const labels = type === 'lit' ? LEVEL_LABELS_LIT : LEVEL_LABELS_NUM;
    const key = type === 'lit' ? 'literacyLevel' : 'numeracyLevel';
    const loopArr = type === 'lit' ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
    
    return loopArr.map(level => {
      const entry: any = { name: labels[level] };
      // Search the groupBy results for Baseline, Midline, Endline matching this level
      ['Baseline', 'Midline', 'Endline'].forEach(t => {
        const found = dataArray?.find(item => item[key] === level && item.term === t);
        entry[t] = found ? found._count.studentId : 0;
      });
      return entry;
    });
  };

  // Process Operations into Clustered Formats
  const formatOperationsData = (opsRecord: Record<string, any>) => {
     return ['addition', 'subtraction', 'multiplication', 'division'].map(op => {
        const entry: any = { name: op.charAt(0).toUpperCase() + op.slice(1) };
        ['Baseline', 'Midline', 'Endline'].forEach(t => {
           entry[t] = opsRecord[t] ? opsRecord[t][op] : 0;
        });
        return entry;
     });
  };

  const [literacyData, setLiteracyData] = useState(() => formatClusteredData(stats.literacies, 'lit'));
  const [numeracyData, setNumeracyData] = useState(() => formatClusteredData(stats.numeracies, 'num'));
  const [opsData, setOpsData] = useState(() => formatOperationsData(stats.operations || {}));

  const activeDivision = hierarchy.find(d => d.id === divId);
  const pos = activeDivision ? activeDivision.projectOffices : [];
  const activePO = pos.find((p: any) => p.id === poId);
  const schools = activePO ? activePO.schools : [];

  useEffect(() => {
    startTransition(async () => {
      const newStats = await getDashboardStats({ divisionId: divId, projectOfficeId: poId, schoolId: schoolId, term: term });
      setStats(newStats);
      setLiteracyData(formatClusteredData(newStats.literacies, 'lit'));
      setNumeracyData(formatClusteredData(newStats.numeracies, 'num'));
      setOpsData(formatOperationsData(newStats.operations || {}));
    });
  }, [divId, poId, schoolId, term]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center mb-8 relative z-20">
        <div className="flex items-center gap-2 text-slate-400 font-bold px-2">
           <Filter className="w-5 h-5"/>
           <span className="hidden lg:inline">Filters:</span>
        </div>
        
        <select value={term} onChange={(e) => setTerm(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium">
          <option value="">All Terms</option>
          <option value="Baseline">Baseline</option>
          <option value="Midline">Midline</option>
          <option value="Endline">Endline</option>
        </select>
        
        <select value={divId} onChange={(e) => { setDivId(e.target.value); setPoId(""); setSchoolId(""); }}
                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium">
          <option value="">All Divisions</option>
          {hierarchy.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        
        <select value={poId} onChange={(e) => { setPoId(e.target.value); setSchoolId(""); }} disabled={!divId}
                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50">
          <option value="">All Project Offices</option>
          {pos.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} disabled={!poId}
                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50">
          <option value="">All Schools</option>
          {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {isPending && <div className="text-sm font-bold text-blue-500 animate-pulse px-4 whitespace-nowrap">Updating...</div>}
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit mb-8 border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'overview' 
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('cohort')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'cohort' 
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <GanttChartSquare className="w-4 h-4" /> Progress Trajectory
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border-l-4 border-l-blue-500 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Students Filtered</p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.totalStudents || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border-l-4 border-l-indigo-500 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Assessments Logged</p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.totalAssessments || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border-l-4 border-l-emerald-500 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-500 mb-1">Active Schools in Selection</p>
          <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100">{stats.totalSchools || 0}</h3>
        </div>
      </div>

      {/* Clustered Growth Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Literacy Growth Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2">
          <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500"/> Literacy Growth (Clustered)</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={literacyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Baseline" fill={TERM_COLORS.Baseline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Midline" fill={TERM_COLORS.Midline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Endline" fill={TERM_COLORS.Endline} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Numeracy Recognition Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-500"/> Math Recognition Growth</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={numeracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Baseline" fill={TERM_COLORS.Baseline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Midline" fill={TERM_COLORS.Midline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Endline" fill={TERM_COLORS.Endline} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operations Mastery Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><School className="w-5 h-5 text-emerald-500"/> Math Operations Mastery</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Baseline" fill={TERM_COLORS.Baseline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Midline" fill={TERM_COLORS.Midline} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Endline" fill={TERM_COLORS.Endline} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
          </div>
      </>
      ) : (
        <CohortBenchmarking 
          filters={{ divisionId: divId, projectOfficeId: poId, schoolId: schoolId }} 
          hierarchy={hierarchy} 
        />
      )}
    </div>
  );
}
