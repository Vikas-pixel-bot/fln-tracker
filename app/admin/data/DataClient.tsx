"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAssessment, deleteAssessment, clearAllAssessments, clearAllData } from "@/app/actions";
import { Trash2, Pencil, X, Check, AlertTriangle, Filter } from "lucide-react";

const LIT_LABELS = ["Beginner", "Letter", "Word", "Paragraph", "Story"];
const NUM_LABELS = ["Beginner", "1–9", "10–99", "100–999"];
const TERMS = ["Baseline", "Midline", "Endline"];

type Assessment = {
  id: string;
  date: Date;
  term: string;
  assessorName: string;
  literacyLevel: number;
  numeracyLevel: number;
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
  student: {
    name: string;
    class: number;
    school: { name: string; projectOffice: { name: string; division: { name: string } } };
  };
};

export default function DataClient({
  initialAssessments,
  total,
  pages,
  currentPage,
}: {
  initialAssessments: Assessment[];
  total: number;
  pages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const [assessments, setAssessments] = useState(initialAssessments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [clearTerm, setClearTerm] = useState("");
  const [clearMode, setClearMode] = useState<"assessments" | "all">("assessments");
  const [filterTerm, setFilterTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  function applyFilter(term: string) {
    setFilterTerm(term);
    const params = new URLSearchParams();
    if (term) params.set("term", term);
    params.set("page", "1");
    router.push(`/admin/data?${params.toString()}`);
  }

  function startEdit(a: Assessment) {
    setEditingId(a.id);
    setEditForm({
      assessorName: a.assessorName,
      literacyLevel: a.literacyLevel,
      numeracyLevel: a.numeracyLevel,
      term: a.term,
      addition: a.addition,
      subtraction: a.subtraction,
      multiplication: a.multiplication,
      division: a.division,
    });
  }

  function handleSave(id: string) {
    startTransition(async () => {
      await updateAssessment(id, editForm);
      setAssessments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...editForm } : a))
      );
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this assessment? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteAssessment(id);
      setAssessments((prev) => prev.filter((a) => a.id !== id));
    });
  }

  function handleClear() {
    startTransition(async () => {
      if (clearMode === "all") {
        await clearAllData();
      } else {
        await clearAllAssessments(clearTerm || undefined);
      }
      setClearConfirm(false);
      setAssessments([]);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Assessment Data</h1>
          <p className="text-slate-500 text-sm mt-1">{total} records total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterTerm}
              onChange={(e) => applyFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="">All Terms</option>
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={() => setClearConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Clear Data
          </button>
        </div>
      </div>

      {/* Clear Confirm Modal */}
      {clearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Clear Data</h2>
            </div>
            <p className="text-slate-500 mb-4">Choose what to delete. This cannot be undone.</p>

            {/* Mode selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setClearMode("assessments")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${clearMode === "assessments" ? "bg-red-50 border-red-300 text-red-700" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                Assessments only
              </button>
              <button
                onClick={() => setClearMode("all")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${clearMode === "all" ? "bg-red-50 border-red-300 text-red-700" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                Everything (students + schools too)
              </button>
            </div>

            {clearMode === "assessments" && (
              <select
                value={clearTerm}
                onChange={(e) => setClearTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4 text-sm font-medium outline-none"
              >
                <option value="">All terms</option>
                {TERMS.map((t) => <option key={t} value={t}>{t} only</option>)}
              </select>
            )}

            {clearMode === "all" && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 mb-4">
                This will delete all assessments, all students, all schools, all project offices, and all divisions. The entire database will be empty.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setClearConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isPending ? "Clearing..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">School / Division</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Assessor</th>
                <th className="px-4 py-3">Literacy</th>
                <th className="px-4 py-3">Numeracy</th>
                <th className="px-4 py-3">Operations</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessments.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">No assessments found.</td>
                </tr>
              )}
              {assessments.map((a) => {
                const isEditing = editingId === a.id;
                return (
                  <tr key={a.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors ${isEditing ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      {a.student.name}
                      <span className="ml-1 text-xs text-slate-400">Cl.{a.student.class}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      <div>{a.student.school.name}</div>
                      <div className="text-slate-400">{a.student.school.projectOffice.division.name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(a.date).toLocaleDateString("en-IN")}
                    </td>

                    {/* Term */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select value={editForm.term} onChange={(e) => setEditForm({ ...editForm, term: e.target.value })}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs w-28 outline-none">
                          {TERMS.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{a.term}</span>
                      )}
                    </td>

                    {/* Assessor */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input value={editForm.assessorName} onChange={(e) => setEditForm({ ...editForm, assessorName: e.target.value })}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs w-32 outline-none" />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-300">{a.assessorName}</span>
                      )}
                    </td>

                    {/* Literacy */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select value={editForm.literacyLevel} onChange={(e) => setEditForm({ ...editForm, literacyLevel: Number(e.target.value) })}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs w-28 outline-none">
                          {LIT_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-md text-xs font-bold">{LIT_LABELS[a.literacyLevel]}</span>
                      )}
                    </td>

                    {/* Numeracy */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select value={editForm.numeracyLevel} onChange={(e) => setEditForm({ ...editForm, numeracyLevel: Number(e.target.value) })}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs w-28 outline-none">
                          {NUM_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-bold">{NUM_LABELS[a.numeracyLevel]}</span>
                      )}
                    </td>

                    {/* Operations */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex flex-col gap-1 text-xs">
                          {(["addition", "subtraction", "multiplication", "division"] as const).map((op) => (
                            <label key={op} className="flex items-center gap-1 capitalize cursor-pointer">
                              <input type="checkbox" checked={editForm[op]} onChange={(e) => setEditForm({ ...editForm, [op]: e.target.checked })} className="rounded" />
                              {op}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(["addition", "subtraction", "multiplication", "division"] as const).filter((op) => a[op]).map((op) => (
                            <span key={op} className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded text-xs capitalize">{op.slice(0, 3)}</span>
                          ))}
                          {!a.addition && !a.subtraction && !a.multiplication && !a.division && <span className="text-slate-300 text-xs">—</span>}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSave(a.id)} disabled={isPending}
                              className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-all" title="Save">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg transition-all" title="Cancel">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(a)}
                              className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(a.id)} disabled={isPending}
                              className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
            <span>Page {currentPage} of {pages}</span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <a href={`?page=${currentPage - 1}`} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">← Prev</a>
              )}
              {currentPage < pages && (
                <a href={`?page=${currentPage + 1}`} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Next →</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
