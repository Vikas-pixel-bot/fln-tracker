"use client";
import { useState, useTransition } from 'react';
import { generateSchoolLogins } from '@/app/actions';
import { Download, Loader2, Users, Zap, School, CheckCircle } from 'lucide-react';

type Credential = { po: string; school: string; email: string; password: string };

export default function LoginsClient({ initialCredentials }: { initialCredentials: Credential[] }) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [search, setSearch] = useState('');

  function generate() {
    startTransition(async () => {
      const res = await generateSchoolLogins();
      setResult(res);
      // Refresh credentials list
      const r = await fetch('/api/admin/credentials');
      if (r.ok) setCredentials(await r.json());
    });
  }

  function downloadCSV() {
    const header = 'Project Office,School Name,Login Email,Password\n';
    const rows = credentials
      .map(c => `"${c.po}","${c.school}","${c.email}","${c.password}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school-logins-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = credentials.filter(c =>
    c.school.toLowerCase().includes(search.toLowerCase()) ||
    c.po.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">School Login Generator</h1>
        <p className="text-slate-500 mt-1">Generate one login account per school. Format: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">po.schoolname@flnhub.in</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">Pratham@2025</code></p>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white">Generate Logins</p>
            <p className="text-sm text-slate-400 mt-0.5">Creates accounts for all schools not yet registered. Safe to run multiple times.</p>
          </div>
          <button onClick={generate} disabled={isPending}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isPending ? 'Generating...' : 'Generate Now'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white">Download CSV</p>
            <p className="text-sm text-slate-400 mt-0.5">Export all school credentials as a spreadsheet to distribute to Project Office coordinators.</p>
          </div>
          <button onClick={downloadCSV} disabled={credentials.length === 0}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-40">
            <Download className="w-4 h-4" />
            Download CSV ({credentials.length})
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
            <Users className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white">Total School Logins</p>
            <p className="text-sm text-slate-400 mt-0.5">School accounts currently active in the system.</p>
          </div>
          <div className="mt-auto text-4xl font-extrabold text-violet-600">{credentials.length}</div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-6 py-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-green-700 dark:text-green-300 font-semibold">
            Done! Created <span className="font-extrabold">{result.created}</span> new logins, skipped <span className="font-extrabold">{result.skipped}</span> that already existed.
          </p>
        </div>
      )}

      {/* Credentials table */}
      {credentials.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <School className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search school or PO..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 font-semibold">{filtered.length} schools</span>
          </div>

          <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-3 border-b border-slate-100 dark:border-slate-800">
            <span>Project Office</span>
            <span>School Name</span>
            <span>Login Email</span>
            <span>Password</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[480px] overflow-y-auto">
            {filtered.map((c, i) => (
              <div key={i} className="grid grid-cols-4 items-center px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-sm">
                <span className="text-slate-500 truncate">{c.po}</span>
                <span className="font-medium text-slate-800 dark:text-slate-100 truncate">{c.school}</span>
                <span className="text-blue-600 font-mono text-xs truncate">{c.email}</span>
                <span className="font-mono text-xs text-slate-400">{c.password}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400">No results for "{search}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
