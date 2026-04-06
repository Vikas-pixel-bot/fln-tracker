"use client";

import { useState, useTransition, useEffect } from "react";
import { School, User, CheckCircle2, Navigation, Check, X, FileText, UserPlus, WifiOff, Sparkles } from "lucide-react";
import { createAssessment, createStudent, getStudentsBySchool } from "@/app/actions";
import { useRouter } from "next/navigation";
import { addToQueue, saveHierarchyCache, getHierarchyCache } from "@/lib/offline-queue";
import { Mascot, StarBurst, StarProgress, useStarBurst } from "@/components/FunMode";

const DEFAULT_ASSETS = {
  Letters: "क   म   ल   प   र",
  Words: "कर   घर   चल   बस   सर",
  Paragraph: "मीना शाळेत जाते. तिला खेळायला खूप आवडते. तिच्याकडे एक लाल चेंडू आहे. ती मैत्रिणींसोबत बागेत खेळते.",
  Story: "एक होता शेतकरी. तो खूप कष्टाळू होता. त्याच्याकडे एक गाय होती. तो रोज शेतात जात असे आणि खूप काम करत असे. एकदा खूप पाऊस पडला. पीक खूप चांगले आले. शेतकरी खूप आनंदी झाला त्याने गावाला जेवण दिले.",
  Num1to9: "4     7     2     9     5",
  Num10to99: "45    12    89    36    74",
  Num100to999: "456   102   890   365   741",
  AddProblem: "42 + 15 = ?",
  SubProblem: "73 - 28 = ?",
  MulProblem: "14 × 3 = ?",
  DivProblem: "84 ÷ 4 = ?"
};

export default function LiveTrackerClient({ hierarchy: serverHierarchy, settings }: { hierarchy: any[], settings: Record<string, string> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOnline, setIsOnline] = useState(true);
  const [hierarchy, setHierarchy] = useState(serverHierarchy);

  // Cache hierarchy for offline use, track online status
  useEffect(() => {
    if (serverHierarchy?.length > 0) {
      saveHierarchyCache(serverHierarchy);
      setHierarchy(serverHierarchy);
    } else {
      // Offline: load from cache
      const cached = getHierarchyCache();
      if (cached.length > 0) setHierarchy(cached);
    }
    setIsOnline(navigator.onLine);
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, [serverHierarchy]);

  const getAsset = (key: keyof typeof DEFAULT_ASSETS) => settings[key] || DEFAULT_ASSETS[key];

  const [step, setStep] = useState<'setup' | 'literacy' | 'numeracyRecog' | 'numeracyOps' | 'submitting'>('setup');
  
  // Hierarchy
  const [divId, setDivId] = useState("");
  const [poId, setPoId] = useState("");
  const [schoolId, setSchoolId] = useState("");

  const activeDivision = hierarchy?.find(d => d.id === divId) || null;
  const pos = activeDivision ? activeDivision.projectOffices : [];
  const activePO = pos.find((p: any) => p.id === poId);
  const schools = activePO ? activePO.schools : [];

  // Data
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // New Student Builder
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentClass, setNewStudentClass] = useState("3");
  const [newStudentGender, setNewStudentGender] = useState("Female");

  // Fun Mode
  const [funMode, setFunMode] = useState(false);
  const { burst, trigger } = useStarBurst();
  const [starsEarned, setStarsEarned] = useState(0);
  const TOTAL_STARS = 4;

  // Scoring Hooks
  const [litLevel, setLitLevel] = useState<number | null>(null);
  const [numLevel, setNumLevel] = useState<number | null>(null);
  const [ops, setOps] = useState({ add: false, sub: false, mul: false, div: false });
  const [litNode, setLitNode] = useState<'Paragraph' | 'Story' | 'Words' | 'Letters'>('Paragraph');
  const [numNode, setNumNode] = useState<'2-digit' | '1-digit' | '3-digit'>('2-digit');
  const [currentOp, setCurrentOp] = useState<'add' | 'sub' | 'mul' | 'div'>('add');

  const fetchStudents = async (sId: string) => {
    setSchoolId(sId);
    setStudentId("");
    setIsLoadingStudents(true);
    try {
      const studs = await getStudentsBySchool(sId);
      setStudents(studs);
    } catch(e) { console.error(e); }
    setIsLoadingStudents(false);
  };

  const handleSetupNext = () => {
    if (!studentId || !assessorName) return;
    if (studentId === "NEW" && !newStudentName.trim()) return alert("Enter the new student's name!");
    setStep('literacy');
  };

  const handleLitAnswer = (pass: boolean) => {
    if (funMode) { trigger(pass); if (pass) setStarsEarned(s => Math.min(s + 1, TOTAL_STARS)); }
    switch (litNode) {
      case 'Paragraph':
        if (pass) setLitNode('Story');
        else setLitNode('Words');
        break;
      case 'Story':
        if (pass) { setLitLevel(4); setTimeout(() => setStep('numeracyRecog'), funMode ? 1300 : 0); }
        else { setLitLevel(3); setTimeout(() => setStep('numeracyRecog'), funMode ? 1300 : 0); }
        break;
      case 'Words':
        if (pass) { setLitLevel(2); setTimeout(() => setStep('numeracyRecog'), funMode ? 1300 : 0); }
        else setLitNode('Letters');
        break;
      case 'Letters':
        if (pass) { setLitLevel(1); setTimeout(() => setStep('numeracyRecog'), funMode ? 1300 : 0); }
        else { setLitLevel(0); setTimeout(() => setStep('numeracyRecog'), funMode ? 1300 : 0); }
        break;
    }
  };

  const handleNumRecogAnswer = (pass: boolean) => {
    if (funMode) { trigger(pass); if (pass) setStarsEarned(s => Math.min(s + 1, TOTAL_STARS)); }
    switch (numNode) {
      case '2-digit':
        if (pass) setNumNode('3-digit');
        else setNumNode('1-digit');
        break;
      case '1-digit':
        if (pass) { setNumLevel(1); setTimeout(() => setStep('numeracyOps'), funMode ? 1300 : 0); }
        else { setNumLevel(0); setTimeout(() => setStep('numeracyOps'), funMode ? 1300 : 0); }
        break;
      case '3-digit':
        if (pass) { setNumLevel(3); setTimeout(() => setStep('numeracyOps'), funMode ? 1300 : 0); }
        else { setNumLevel(2); setTimeout(() => setStep('numeracyOps'), funMode ? 1300 : 0); }
        break;
    }
  };

  const handleOpAnswer = (pass: boolean) => {
    if (funMode) { trigger(pass); if (pass) setStarsEarned(s => Math.min(s + 1, TOTAL_STARS)); }
    setOps(prev => ({ ...prev, [currentOp]: pass }));
    const delay = funMode ? 1300 : 0;
    if (currentOp === 'add') setTimeout(() => setCurrentOp('sub'), delay);
    else if (currentOp === 'sub') setTimeout(() => setCurrentOp('mul'), delay);
    else if (currentOp === 'mul') setTimeout(() => setCurrentOp('div'), delay);
    else setTimeout(() => finishTest(pass), delay);
  };

  const finishTest = (divisionPass: boolean) => {
    setStep('submitting');

    const assessmentData = {
      assessorName,
      literacyLevel: litLevel as number,
      numeracyLevel: numLevel as number,
      addition: ops.add,
      subtraction: ops.sub,
      multiplication: ops.mul,
      division: divisionPass,
    };

    // Save offline if no network
    if (!isOnline) {
      const selectedSchool = hierarchy.flatMap((d: any) => d.projectOffices).flatMap((p: any) => p.schools).find((s: any) => s.id === schoolId);
      addToQueue({
        studentId: studentId === "NEW" ? null : studentId,
        newStudent: studentId === "NEW" ? { name: newStudentName, classNum: parseInt(newStudentClass) || 3, gender: newStudentGender, schoolId } : undefined,
        studentName: studentId === "NEW" ? newStudentName : students.find(s => s.id === studentId)?.name,
        schoolName: selectedSchool?.name,
        ...assessmentData,
      });
      window.dispatchEvent(new Event("fln_queue_updated"));
      setStep('setup');
      alert(`Saved offline! It will sync automatically when you're back online.`);
      return;
    }

    startTransition(async () => {
      let finalStudentId = studentId;
      if (studentId === "NEW") {
        const newS = await createStudent({ name: newStudentName, classNum: parseInt(newStudentClass) || 3, gender: newStudentGender, schoolId });
        finalStudentId = newS.id;
      }
      await createAssessment({ studentId: finalStudentId, ...assessmentData });
      router.push(`/students/${finalStudentId}`);
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-16">
      
      <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 rounded-full p-2 mb-8 relative">
        <div className={`flex-1 text-center py-2 rounded-full font-bold text-sm ${step === 'setup' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}>Setup</div>
        <div className={`flex-1 text-center py-2 rounded-full font-bold text-sm ${step === 'literacy' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}>Reading</div>
        <div className={`flex-1 text-center py-2 rounded-full font-bold text-sm ${step === 'numeracyRecog' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}>Numbers</div>
        <div className={`flex-1 text-center py-2 rounded-full font-bold text-sm ${step === 'numeracyOps' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}>Operations</div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[450px] flex flex-col relative">
        
        {step === 'setup' && (
          <div className="p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            {!isOnline && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-2xl text-sm font-semibold">
                <WifiOff className="w-4 h-4 flex-shrink-0" />
                You are offline. Assessments will be saved locally and synced when back online.
              </div>
            )}
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-center">Assessor Testing Terminal</h2>
            
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
               <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><School className="w-4 h-4"/> 1. Location Filters</label>
               <div className="grid grid-cols-3 gap-3">
                  <select value={divId} onChange={(e) => { setDivId(e.target.value); setPoId(""); setSchoolId(""); setStudentId(""); }} className="bg-white dark:bg-slate-800 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-sm font-semibold">
                    <option value="">-- Division --</option>
                    {hierarchy.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <select disabled={!divId} value={poId} onChange={(e) => { setPoId(e.target.value); setSchoolId(""); setStudentId(""); }} className="bg-white dark:bg-slate-800 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-sm font-semibold disabled:opacity-50">
                    <option value="">-- P.O. --</option>
                    {pos.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select disabled={!poId} value={schoolId} onChange={(e) => fetchStudents(e.target.value)} className="bg-white dark:bg-slate-800 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-sm font-semibold disabled:opacity-50">
                    <option value="">-- School --</option>
                    {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 items-start">
               <div>
                  <label className="text-sm font-bold mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200"><User className="w-4 h-4 text-blue-500"/> 2. Select Target</label>
                  <select disabled={!schoolId || isLoadingStudents} value={studentId} onChange={(e) => setStudentId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium disabled:opacity-50">
                    <option value="" disabled>{isLoadingStudents ? 'Loading Students...' : '-- Pick a child --'}</option>
                    {students.map((st: any) => <option key={st.id} value={st.id}>{st.name} (Cls {st.class})</option>)}
                    {schoolId && <option value="NEW" className="font-bold text-blue-600 bg-blue-50">➕ Add New Student...</option>}
                  </select>
               </div>
               <div>
                  <label className="text-sm font-bold mb-2 text-slate-700 dark:text-slate-200 flex items-center gap-2">3. Assessor Log</label>
                  <input type="text" value={assessorName} onChange={(e) => setAssessorName(e.target.value)} placeholder="Teacher / Vol. Name"
                         className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
               </div>
            </div>

            {/* Dynamic New Student Render Box */}
            {studentId === "NEW" && (
                <div className="bg-blue-50 dark:bg-slate-800 p-5 rounded-2xl border-l-4 border-blue-500 animate-in slide-in-from-top-4 shadow-sm flex flex-col gap-4">
                   <h3 className="text-blue-800 dark:text-blue-200 font-bold flex items-center gap-2"><UserPlus className="w-4 h-4"/> Create Profile On-The-Fly</h3>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="col-span-2">
                         <input type="text" placeholder="Full Student Name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 px-4 py-2 font-semibold text-sm rounded-lg outline-none ring-1 ring-slate-200"/>
                      </div>
                      <div>
                         <select value={newStudentClass} onChange={(e) => setNewStudentClass(e.target.value)} className="w-full bg-white dark:bg-slate-900 px-4 py-2 font-semibold text-sm rounded-lg outline-none ring-1 ring-slate-200 cursor-pointer">
                            <option value="1">Class 1</option><option value="2">Class 2</option><option value="3">Class 3</option><option value="4">Class 4</option><option value="5">Class 5</option>
                         </select>
                      </div>
                      <div>
                         <select value={newStudentGender} onChange={(e) => setNewStudentGender(e.target.value)} className="w-full bg-white dark:bg-slate-900 px-4 py-2 font-semibold text-sm rounded-lg outline-none ring-1 ring-slate-200 cursor-pointer">
                            <option value="Female">Female</option><option value="Male">Male</option>
                         </select>
                      </div>
                   </div>
                </div>
            )}

            {/* Fun Mode Toggle */}
            <div className={`flex items-center justify-between px-5 py-3 rounded-2xl border-2 transition-all ${funMode ? 'bg-yellow-50 border-yellow-300' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <p className="font-bold text-slate-700 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500"/> Fun Mode</p>
                <p className="text-xs text-slate-400">Shows mascot & stars — turn on when child is watching</p>
              </div>
              <button onClick={() => setFunMode(f => !f)}
                className={`w-12 h-6 rounded-full transition-all relative ${funMode ? 'bg-yellow-400' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${funMode ? 'left-6' : 'left-0.5'}`}/>
              </button>
            </div>

            <button onClick={handleSetupNext} disabled={!studentId || !assessorName}
                    className="w-full py-4 text-white font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 transition-all hover:opacity-90 hover:scale-[1.01] hover:shadow-md disabled:opacity-50 mt-6 flex justify-center items-center gap-2">
              Launch Framework <Navigation className="w-5 h-5"/>
            </button>
          </div>
        )}

        {/* ===================== TESTING BOARDS ===================== */}

        {step === 'literacy' && (
          <div className={`flex-1 flex flex-col ${funMode ? 'bg-gradient-to-b from-orange-50 to-yellow-50' : ''}`}>
            <StarBurst show={burst.show} pass={burst.pass} />
            <div className={`text-white p-6 text-center ${funMode ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-orange-500'}`}>
              {funMode && <StarProgress earned={starsEarned} total={TOTAL_STARS} />}
              <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-3">{funMode ? '📖 Reading Adventure!' : '📖 Reading Test'}</h2>
              {!funMode && <p className="mt-2 font-medium">Stage: <span className="font-bold underline">{litNode.toUpperCase()}</span></p>}
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 animate-in slide-in-from-right duration-300">
              {funMode && <Mascot mood="think" />}
              <div className={`w-full p-8 rounded-3xl border-2 shadow-inner min-h-[160px] flex items-center justify-center ${funMode ? 'bg-white border-orange-200' : 'bg-orange-50 dark:bg-slate-800 border-orange-100 dark:border-slate-700'}`}>
                 <p className={`text-slate-800 font-medium ${litNode === 'Story' || litNode === 'Paragraph' ? 'text-2xl leading-relaxed' : 'text-5xl tracking-widest'}`}>
                    {litNode === 'Story' && getAsset('Story')}
                    {litNode === 'Paragraph' && getAsset('Paragraph')}
                    {litNode === 'Words' && getAsset('Words')}
                    {litNode === 'Letters' && getAsset('Letters')}
                 </p>
              </div>
              <p className="text-slate-500 font-semibold text-lg flex items-center gap-2">
                {funMode ? '🌟 Can this superstar read it?' : <><FileText className="w-5 h-5"/> Did the child read this fluently?</>}
              </p>
              <div className="flex gap-4 w-full max-w-md">
                <button onClick={() => handleLitAnswer(true)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-green-400 border-green-500 text-white hover:bg-green-500 text-2xl' : 'bg-white border-slate-200 hover:border-green-500 hover:bg-green-50 text-slate-700 hover:text-green-700'}`}>
                  {funMode ? '⭐ YES!' : <><Check className="w-6 h-6"/> YES</>}
                </button>
                <button onClick={() => handleLitAnswer(false)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-orange-300 border-orange-400 text-white hover:bg-orange-400' : 'bg-white border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-700 hover:text-red-700'}`}>
                  {funMode ? '💪 Not yet' : <><X className="w-6 h-6"/> NO</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'numeracyRecog' && (
          <div className={`flex-1 flex flex-col ${funMode ? 'bg-gradient-to-b from-indigo-50 to-blue-50' : ''}`}>
            <StarBurst show={burst.show} pass={burst.pass} />
            <div className={`text-white p-6 text-center ${funMode ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-indigo-600'}`}>
              {funMode && <StarProgress earned={starsEarned} total={TOTAL_STARS} />}
              <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-3">{funMode ? '🔢 Number Magic!' : '🔢 Number Recognition'}</h2>
              {!funMode && <p className="mt-2 font-medium">Stage: <span className="font-bold underline">{numNode.toUpperCase()}</span></p>}
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 animate-in slide-in-from-right duration-300">
              {funMode && <Mascot mood="think" />}
              <div className={`w-full p-10 rounded-3xl border-2 shadow-inner flex items-center justify-center ${funMode ? 'bg-white border-indigo-200' : 'bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700'}`}>
                 <p className="text-6xl font-black text-slate-800 tracking-[0.5em]">
                    {numNode === '1-digit' && getAsset('Num1to9')}
                    {numNode === '2-digit' && getAsset('Num10to99')}
                    {numNode === '3-digit' && getAsset('Num100to999')}
                 </p>
              </div>
              <p className="text-slate-500 font-semibold text-lg">
                {funMode ? '🌟 Can this number wizard read them?' : 'Did the child recognize these numbers correctly?'}
              </p>
              <div className="flex gap-4 w-full max-w-md">
                <button onClick={() => handleNumRecogAnswer(true)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-green-400 border-green-500 text-white hover:bg-green-500' : 'bg-white border-slate-200 hover:border-green-500 hover:bg-green-50 text-slate-700 hover:text-green-700'}`}>
                  {funMode ? '⭐ YES!' : <><Check className="w-6 h-6"/> YES</>}
                </button>
                <button onClick={() => handleNumRecogAnswer(false)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-orange-300 border-orange-400 text-white hover:bg-orange-400' : 'bg-white border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-700 hover:text-red-700'}`}>
                  {funMode ? '💪 Not yet' : <><X className="w-6 h-6"/> NO</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'numeracyOps' && (
          <div className={`flex-1 flex flex-col ${funMode ? 'bg-gradient-to-b from-emerald-50 to-teal-50' : ''}`}>
            <StarBurst show={burst.show} pass={burst.pass} />
            <div className={`text-white p-6 text-center ${funMode ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-emerald-600'}`}>
              {funMode && <StarProgress earned={starsEarned} total={TOTAL_STARS} />}
              <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-3">{funMode ? '➕ Math Challenge!' : '➕ Arithmetic Operations'}</h2>
              {!funMode && <p className="mt-2 font-medium">
                {currentOp === 'add' && "Addition"}{currentOp === 'sub' && "Subtraction"}
                {currentOp === 'mul' && "Multiplication"}{currentOp === 'div' && "Division"}
              </p>}
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center animate-in slide-in-from-right duration-300">
              {funMode && <Mascot mood="idle" />}
              <div className={`w-full max-w-lg mb-8 mt-4 p-12 rounded-3xl border-4 flex items-center justify-center relative shadow-inner ${funMode ? 'bg-white border-emerald-200' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                {!funMode && <div className="absolute top-4 left-4 text-slate-400 font-bold uppercase tracking-widest text-xs">SOLVE</div>}
                {funMode && <div className="absolute top-4 left-4 text-2xl">🧮</div>}
                <h3 className="text-6xl font-black tracking-widest text-slate-800 dark:text-slate-100">
                  {currentOp === 'add' && getAsset('AddProblem')}
                  {currentOp === 'sub' && getAsset('SubProblem')}
                  {currentOp === 'mul' && getAsset('MulProblem')}
                  {currentOp === 'div' && getAsset('DivProblem')}
                </h3>
              </div>
              <div className="flex gap-4 w-full max-w-md">
                <button onClick={() => handleOpAnswer(true)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-green-400 border-green-500 text-white hover:bg-green-500' : 'bg-white border-slate-200 hover:border-green-500 hover:bg-green-50 text-slate-700 hover:text-green-700'}`}>
                  {funMode ? '⭐ Correct!' : <><Check className="w-6 h-6"/> Correct</>}
                </button>
                <button onClick={() => handleOpAnswer(false)} className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all border-2 ${funMode ? 'bg-orange-300 border-orange-400 text-white hover:bg-orange-400' : 'bg-white border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-700 hover:text-red-700'}`}>
                  {funMode ? '💪 Almost!' : <><X className="w-6 h-6"/> Incorrect</>}
                </button>
              </div>

            </div>
          </div>
        )}

        {step === 'submitting' && (
          <div className={`p-16 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 flex-1 ${funMode ? 'bg-gradient-to-b from-yellow-50 to-green-50' : ''}`}>
            {funMode ? (
              <>
                <Mascot mood="cheer" />
                <h2 className="text-3xl font-black text-green-600 mt-6">You're a Champion! 🏆</h2>
                <p className="text-slate-500 mt-2 text-lg">Amazing work today! Keep it up! 🌟</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                  <CheckCircle2 className="w-10 h-10 animate-pulse"/>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Saving Matrix...</h2>
                <p className="text-slate-500 mt-2">Uploading profile dynamics</p>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
