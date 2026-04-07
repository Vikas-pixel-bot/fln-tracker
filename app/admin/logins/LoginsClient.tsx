"use client";
import { useState, useTransition } from 'react';
import { generateSchoolLogins, updateLoginEmail, deleteSchoolLogins } from '@/app/actions';
import { Download, Loader2, Users, Zap, School, CheckCircle, Pencil, X, Check, Trash2 } from 'lucide-react';

type Credential = { id: string; po: string; school: string; email: string; password: string };

export default function LoginsClient({ initialCredentials }: { initialCredentials: Credential[] }) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [search, setSearch] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const filtered = credentials.filter(c =>
    c.school.toLowerCase().includes(search.toLowerCase()) ||
    c.po.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected = filtered.length > 0 && filtered.every(c => selected.has(c.id));

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allFilteredSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(c => next.delete(c.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(c => next.add(c.id));
        return next;
      });
    }
  }

  async function deleteSelected() {
    const ids = [...selected];
    if (!ids.length) return;
    setDeleting(true);
    const res = await deleteSchoolLogins(ids);
    setCredentials(prev => prev.filter(c => !selected.has(c.id)));
    setSelected(new Set());
    setDeleting(false);
  }

  function generate() {
    startTransition(async () => {
      const res = await generateSchoolLogins();
      setResult(res);
      const r = await fetch('/api/admin/credentials');
      if (r.ok) setCredentials(await r.json());
    });
  }

  function downloadCSV() {
    const header = 'Project Office,School Name,Login Email,Password\n';
    const rows = credentials.map(c => `"${c.po}","${c.school}","${c.email}","${c.password}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school-logins-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function startEdit(c: Credential) {
    setEditingId(c.id);
    setEditEmail(c.email);
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditEmail('');
    setEditError('');
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setEditError('');
    const res = await updateLoginEmail(id, editEmail);
    if (res.error) { setEditError(res.error); setSavingId(null); return; }
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, email: editEmail.trim().toLowerCase() } : c));
    setEditingId(null);
    setSavingId(null);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">School Login Generator</h1>
        <p className="text-slate-500 mt-1">Generate one login account per school. Format: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">po.school@flnhub.in</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">Pratham@2025</code></p>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white">Generate Logins</p>
            <p className="text-sm text-slate-400 mt-0.5">Bulk-creates all missing school accounts in one shot. Safe to re-run.</p>
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
            <p className="text-sm text-slate-400 mt-0.5">Export all school credentials as a spreadsheet to distribute to coordinators.</p>
          </div>
          <button onClick={downloadCSV} disabled={credentials.length === 0}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-40">
            <Download className="w-4 h-4" /> Download CSV ({credentials.length})
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

          {/* Search + bulk delete bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <School className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Search school or PO..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
            <span className="text-xs text-slate-400 font-semibold shrink-0">{filtered.length} schools</span>

            {selected.size > 0 && (
              <button onClick={deleteSelected} disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-60 shrink-0">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete {selected.size} selected
              </button>
            )}
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[auto_1fr_1fr_1.5fr_auto] bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider px-6 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll}
              className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
            <span>Project Office</span>
            <span>School Name</span>
            <span>Login Email</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[480px] overflow-y-auto">
            {filtered.map((c) => (
              <div key={c.id}
                className={`grid grid-cols-[auto_1fr_1fr_1.5fr_auto] items-center px-6 py-3 transition-colors text-sm gap-3 ${selected.has(c.id) ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                <span className="text-slate-500 truncate">{c.po}</span>
                <span className="font-medium text-slate-800 dark:text-slate-100 truncate">{c.school}</span>

                {editingId === c.id ? (
                  <div className="flex flex-col gap-1">
                    <input autoFocus value={editEmail}
                      onChange={e => { setEditEmail(e.target.value); setEditError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(c.id); if (e.key === 'Escape') cancelEdit(); }}
                      className="font-mono text-xs px-2 py-1 rounded-lg border border-blue-400 outline-none ring-2 ring-blue-200 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-full" />
                    {editError && <span className="text-red-500 text-xs">{editError}</span>}
                  </div>
                ) : (
                  <span className="text-blue-600 font-mono text-xs truncate">{c.email}</span>
                )}

                <div className="flex items-center gap-1.5 justify-end">
                  {editingId === c.id ? (
                    <>
                      <button onClick={() => saveEdit(c.id)} disabled={savingId === c.id}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50">
                        {savingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={cancelEdit}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
