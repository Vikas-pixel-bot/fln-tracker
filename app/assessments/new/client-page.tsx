"use client";

import { useState, useTransition } from "react";
import { ClipboardPlus, School, User, CheckCircle2, TrendingUp, Calculator } from "lucide-react";
import { createAssessment, getStudentsBySchool } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function RecordAssessmentPage({ schools }: { schools: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const fetchStudents = async (sId: string) => {
    setIsLoadingStudents(true);
    setSchoolId(sId);
    setStudentId("");
    try {
      const studs = await getStudentsBySchool(sId);
      setStudents(studs);
    } catch(e) {
      console.error(e);
    }
    setIsLoadingStudents(false);
  };

  async function handleSubmit(formData: FormData) {
    const sId = formData.get("studentId") as string;
    const assessorName = formData.get("assessorName") as string;
    const litLevel = Number(formData.get("literacyLevel"));
    const numLevel = Number(formData.get("numeracyLevel"));

    if(!sId) {
      alert("Please select a student.");
      return;
    }

    startTransition(async () => {
      await createAssessment({ studentId: sId, assessorName, literacyLevel: litLevel, numeracyLevel: numLevel });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/");
      }, 2000);
    });
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <ClipboardPlus className="w-7 h-7 text-blue-100" />
              Record Assessment
            </h1>
            <p className="text-blue-100 mt-2 text-sm">Log a new ASER score for a student</p>
          </div>
          <div className="hidden sm:block p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 text-white"/>
          </div>
        </div>

        <form action={handleSubmit} className="p-8 space-y-8">
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-6 h-6" />
              <p className="font-medium">Assessment recorded successfully!</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2" htmlFor="schoolId">
                <School className="w-4 h-4 text-slate-400"/> Select School
              </label>
              <select required id="schoolId" onChange={(e) => fetchStudents(e.target.value)} value={schoolId}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none appearance-none cursor-pointer">
                <option value="" disabled>Select a school...</option>
                {schools.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.projectOffice.name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2" htmlFor="studentId">
                <User className="w-4 h-4 text-slate-400"/> Select Student
              </label>
              <select required name="studentId" id="studentId" disabled={!schoolId || isLoadingStudents} value={studentId} onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <option value="" disabled>{isLoadingStudents ? 'Loading...' : 'Select a student...'}</option>
                {students.map((st: any) => (
                  <option key={st.id} value={st.id}>{st.name} (Class {st.class})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold mb-4">Scores</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Literacy */}
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700">
                <label className="block text-sm font-bold mb-3 flex items-center gap-2" htmlFor="literacyLevel">
                  📖 Literacy Level (Reading)
                </label>
                <div className="space-y-3">
                  {[
                    { val: 0, label: "Beginner" },
                    { val: 1, label: "Letter" },
                    { val: 2, label: "Word" },
                    { val: 3, label: "Paragraph (Class 1)" },
                    { val: 4, label: "Story (Class 2)" }
                  ].map(lvl => (
                    <label key={lvl.val} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="literacyLevel" value={lvl.val} defaultChecked={lvl.val === 0}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{lvl.val} - {lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Numeracy */}
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700">
                <label className="block text-sm font-bold mb-3 flex items-center gap-2" htmlFor="numeracyLevel">
                  <Calculator className="w-4 h-4 text-slate-500"/> Numeracy Level (Maths)
                </label>
                <div className="space-y-3">
                  {[
                    { val: 0, label: "Beginner" },
                    { val: 1, label: "Number 1-9" },
                    { val: 2, label: "Number 10-99" },
                    { val: 3, label: "Subtraction" },
                    { val: 4, label: "Division" }
                  ].map(lvl => (
                    <label key={lvl.val} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="numeracyLevel" value={lvl.val} defaultChecked={lvl.val === 0}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{lvl.val} - {lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold mb-2" htmlFor="assessorName">Assessor Name</label>
            <input required type="text" name="assessorName" id="assessorName" placeholder="Your Name"
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none" />
          </div>

          <div className="pt-4">
            <button disabled={isPending || !studentId} type="submit" 
              className="w-full py-4 px-6 text-white text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {isPending ? 'Recording Score...' : 'Record Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
