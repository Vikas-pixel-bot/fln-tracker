"use client";

import { useState, useTransition } from "react";
import { UserPlus, School, CheckCircle2 } from "lucide-react";
// In real-world, we'd fetch schools, but to keep prototype easy, we'll assume a dummy list or load via Server Component.
// Wait, Server Actions are great, but we need data on load. We'll make this a client component that fetches data, OR make the parent page a server component and pass schools. Let's make it simple.

import { createStudent } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function AddStudentPage({ schools }: { schools: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const classNum = Number(formData.get("class"));
    const gender = formData.get("gender") as string;
    const schoolId = formData.get("schoolId") as string;

    startTransition(async () => {
      await createStudent({ name, classNum, gender, schoolId });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/");
      }, 2000);
    });
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-100 dark:ring-slate-800 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <UserPlus className="w-7 h-7 text-blue-100" />
            Register New Student
          </h1>
          <p className="text-blue-100 mt-2 text-sm">Add a student to the tracker baseline</p>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-6 h-6" />
              <p className="font-medium">Student registered successfully!</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="name">Full Name</label>
            <input required type="text" name="name" id="name" placeholder="e.g. Aditya Ahire"
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="class">Standard (Class)</label>
              <select required name="class" id="class" defaultValue="1"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none appearance-none">
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Class {n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="gender">Gender</label>
              <select required name="gender" id="gender" defaultValue="Male"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none appearance-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2" htmlFor="schoolId">
              <School className="w-4 h-4 text-slate-400"/> School
            </label>
            <select required name="schoolId" id="schoolId"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none appearance-none">
              <option value="" disabled selected>Select a school...</option>
              {schools.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button disabled={isPending} type="submit" 
              className="w-full py-3 px-6 text-white text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Saving...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
