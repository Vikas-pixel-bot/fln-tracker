"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// -- READS --

export async function getSchools() {
  return await prisma.school.findMany({
    orderBy: { name: 'asc' },
    include: { projectOffice: { include: { division: true } } }
  });
}

export async function getStudentsBySchool(schoolId: string) {
  return await prisma.student.findMany({
    where: { schoolId },
    orderBy: { name: 'asc' }
  });
}

export async function getStudentsList(query: string = "", page: number = 1, divId?: string, poId?: string, schoolId?: string) {
  const take = 20;
  const skip = (page - 1) * take;

  // Scope to the logged-in user's school if they have one (teacher login)
  const session = await auth();
  const userSchoolId = (session?.user as any)?.schoolId;

  const whereFilter: any = {};
  if (query) whereFilter.name = { contains: query, mode: 'insensitive' };

  if (userSchoolId) {
    // Teacher: always locked to their school, ignore other filters
    whereFilter.schoolId = userSchoolId;
  } else if (schoolId) {
    whereFilter.schoolId = schoolId;
  } else if (poId) {
    whereFilter.school = { projectOfficeId: poId };
  } else if (divId) {
    whereFilter.school = { projectOffice: { divisionId: divId } };
  }

  const students = await prisma.student.findMany({
    where: whereFilter,
    include: { school: true },
    orderBy: { name: 'asc' },
    take,
    skip
  });

  const total = await prisma.student.count({ where: whereFilter });
  return { students, total, pages: Math.ceil(total / take) };
}

export async function getStudentProfile(studentId: string) {
  const session = await auth();
  const userSchoolId = (session?.user as any)?.schoolId;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      school: { include: { projectOffice: { include: { division: true } } } },
      assessments: { orderBy: { date: 'desc' } }
    }
  });

  // Non-admin users scoped to a school can only view their own students
  if (student && userSchoolId && student.schoolId !== userSchoolId) {
    throw new Error("Access denied");
  }

  return student;
}

// -- ANALYTICS --

export async function getHierarchy() {
  return await prisma.division.findMany({
    orderBy: { name: 'asc' },
    include: {
      projectOffices: {
        orderBy: { name: 'asc' },
        include: {
          schools: { orderBy: { name: 'asc' } }
        }
      }
    }
  });
}

export async function getDashboardStats(filters: { divisionId?: string, projectOfficeId?: string, schoolId?: string, term?: string } = {}) {
  const whereFilter: any = {};
  if (filters.schoolId) {
    whereFilter.schoolId = filters.schoolId;
  } else if (filters.projectOfficeId) {
    whereFilter.school = { projectOfficeId: filters.projectOfficeId };
  } else if (filters.divisionId) {
    whereFilter.school = { projectOffice: { divisionId: filters.divisionId } };
  }

  const assessmentWhere: any = { student: whereFilter };
  if (filters.term) assessmentWhere.term = filters.term;

  const schoolWhere: any = {};
  if (filters.schoolId) schoolWhere.id = filters.schoolId;
  else if (filters.projectOfficeId) schoolWhere.projectOfficeId = filters.projectOfficeId;
  else if (filters.divisionId) schoolWhere.projectOffice = { divisionId: filters.divisionId };

  const [totalStudents, totalAssessments, totalSchools, literacies, numeracies, allAssessments] = await Promise.all([
    prisma.student.count({ where: whereFilter }),
    prisma.assessment.count({ where: assessmentWhere }),
    prisma.school.count({ where: schoolWhere }),
    prisma.assessment.groupBy({
      by: ['term', 'literacyLevel'] as any,
      where: assessmentWhere,
      _count: { studentId: true }
    }),
    prisma.assessment.groupBy({
      by: ['term', 'numeracyLevel'] as any,
      where: assessmentWhere,
      _count: { studentId: true }
    }),
    // Fetch all assessments with student class for class-wise breakdown
    prisma.assessment.findMany({
      where: assessmentWhere,
      select: {
        term: true,
        literacyLevel: true,
        numeracyLevel: true,
        addition: true,
        subtraction: true,
        multiplication: true,
        division: true,
        student: { select: { class: true } }
      }
    }),
  ]);

  // Operations by term
  const operations = allAssessments.reduce((acc: any, curr: any) => {
    if (!acc[curr.term]) acc[curr.term] = { addition: 0, subtraction: 0, multiplication: 0, division: 0, total: 0 };
    acc[curr.term].total += 1;
    if (curr.addition) acc[curr.term].addition += 1;
    if (curr.subtraction) acc[curr.term].subtraction += 1;
    if (curr.multiplication) acc[curr.term].multiplication += 1;
    if (curr.division) acc[curr.term].division += 1;
    return acc;
  }, {});

  // --- CLASS-WISE LEVEL BREAKDOWN ---
  // Structure: classLit[classNum][term][level] = count
  const TERMS = ['Baseline', 'Midline', 'Endline'];
  const classLit: Record<number, Record<string, Record<number, number>>> = {};
  const classNum: Record<number, Record<string, Record<number, number>>> = {};

  for (const a of allAssessments) {
    const cls = (a as any).student.class as number;
    if (!classLit[cls]) classLit[cls] = {};
    if (!classLit[cls][a.term]) classLit[cls][a.term] = {};
    classLit[cls][a.term][a.literacyLevel] = (classLit[cls][a.term][a.literacyLevel] || 0) + 1;

    if (!classNum[cls]) classNum[cls] = {};
    if (!classNum[cls][a.term]) classNum[cls][a.term] = {};
    classNum[cls][a.term][a.numeracyLevel] = (classNum[cls][a.term][a.numeracyLevel] || 0) + 1;
  }

  // Convert to percentage + count per (class, term, level)
  // Output: { [cls]: { [term]: { total, levels: { [level]: { count, pct } } } } }
  function computePcts(raw: Record<number, Record<string, Record<number, number>>>) {
    const result: Record<number, Record<string, { total: number; levels: Record<number, { count: number; pct: number }> }>> = {};
    for (const cls of Object.keys(raw).map(Number)) {
      result[cls] = {};
      for (const term of Object.keys(raw[cls])) {
        const levelCounts = raw[cls][term];
        const total = Object.values(levelCounts).reduce((s, v) => s + v, 0);
        result[cls][term] = {
          total,
          levels: Object.fromEntries(
            Object.entries(levelCounts).map(([lvl, count]) => [
              lvl,
              { count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }
            ])
          )
        };
      }
    }
    return result;
  }

  // Also compute overall (all classes) breakdown
  const overallLit: Record<string, Record<number, number>> = {};
  const overallNum: Record<string, Record<number, number>> = {};
  for (const a of allAssessments) {
    if (!overallLit[a.term]) overallLit[a.term] = {};
    overallLit[a.term][a.literacyLevel] = (overallLit[a.term][a.literacyLevel] || 0) + 1;
    if (!overallNum[a.term]) overallNum[a.term] = {};
    overallNum[a.term][a.numeracyLevel] = (overallNum[a.term][a.numeracyLevel] || 0) + 1;
  }

  function computeOverallPcts(raw: Record<string, Record<number, number>>) {
    const result: Record<string, { total: number; levels: Record<number, { count: number; pct: number }> }> = {};
    for (const term of Object.keys(raw)) {
      const total = Object.values(raw[term]).reduce((s, v) => s + v, 0);
      result[term] = {
        total,
        levels: Object.fromEntries(
          Object.entries(raw[term]).map(([lvl, count]) => [
            lvl,
            { count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }
          ])
        )
      };
    }
    return result;
  }

  const availableClasses = Object.keys(classLit).map(Number).sort((a, b) => a - b);

  return {
    totalStudents,
    totalAssessments,
    totalSchools,
    literacies,
    numeracies,
    operations,
    classBreakdown: {
      literacy: computePcts(classLit),
      numeracy: computePcts(classNum),
    },
    overallBreakdown: {
      literacy: computeOverallPcts(overallLit),
      numeracy: computeOverallPcts(overallNum),
    },
    availableClasses,
  };
}

export async function getCohortStats(filters: { divisionId?: string, projectOfficeId?: string, schoolId?: string, startTerm: string, endTerm: string }) {
  const whereFilter: any = {};
  if (filters.schoolId) {
    whereFilter.schoolId = filters.schoolId;
  } else if (filters.projectOfficeId) {
    whereFilter.school = { projectOfficeId: filters.projectOfficeId };
  } else if (filters.divisionId) {
    whereFilter.school = { projectOffice: { divisionId: filters.divisionId } };
  }

  // Get all students matching the filters
  const students = await prisma.student.findMany({
    where: whereFilter,
    include: {
      assessments: {
        where: {
          term: { in: [filters.startTerm, filters.endTerm] }
        }
      }
    }
  });

  // Calculate transitions
  const litTransitions: Record<string, number> = {};
  const numTransitions: Record<string, number> = {};
  const opsTransitions: Record<string, any> = {
    addition: { gained: 0, maintained: 0, regressed: 0, stagnant: 0 },
    subtraction: { gained: 0, maintained: 0, regressed: 0, stagnant: 0 },
    multiplication: { gained: 0, maintained: 0, regressed: 0, stagnant: 0 },
    division: { gained: 0, maintained: 0, regressed: 0, stagnant: 0 }
  };

  students.forEach(student => {
    const startAssessment = student.assessments.find(a => a.term === filters.startTerm);
    const endAssessment = student.assessments.find(a => a.term === filters.endTerm);

    if (startAssessment && endAssessment) {
      // Literacy transition
      const litKey = `${startAssessment.literacyLevel}to${endAssessment.literacyLevel}`;
      litTransitions[litKey] = (litTransitions[litKey] || 0) + 1;

      // Numeracy transition
      const numKey = `${startAssessment.numeracyLevel}to${endAssessment.numeracyLevel}`;
      numTransitions[numKey] = (numTransitions[numKey] || 0) + 1;

      // Operations transitions
      ['addition', 'subtraction', 'multiplication', 'division'].forEach(op => {
         const start = (startAssessment as any)[op];
         const end = (endAssessment as any)[op];
         if (!start && end) opsTransitions[op].gained++;
         else if (start && end) opsTransitions[op].maintained++;
         else if (start && !end) opsTransitions[op].regressed++;
         else if (!start && !end) opsTransitions[op].stagnant++;
      });
    }
  });

  return { 
    litTransitions, 
    numTransitions, 
    opsTransitions,
    totalCohort: students.filter(s => s.assessments.length >= 2).length 
  };
}


// -- WRITES --

export async function createStudent(data: {
  name: string;
  classNum: number;
  gender: string;
  schoolId: string;
}) {
  const student = await prisma.student.create({
    data: {
      name: data.name,
      class: data.classNum,
      gender: data.gender,
      schoolId: data.schoolId,
    }
  });
  
  revalidatePath('/students/new');
  revalidatePath('/');
  return student;
}

export async function createAssessment(data: { studentId: string, assessorName: string, literacyLevel: number, numeracyLevel: number, addition?: boolean, subtraction?: boolean, multiplication?: boolean, division?: boolean }) {
  const assessment = await prisma.assessment.create({
    data: {
      studentId: data.studentId,
      assessorName: data.assessorName,
      literacyLevel: data.literacyLevel,
      numeracyLevel: data.numeracyLevel,
      addition: data.addition || false,
      subtraction: data.subtraction || false,
      multiplication: data.multiplication || false,
      division: data.division || false,
      date: new Date()
    } as any
  });

  revalidatePath('/assessments/new');
  revalidatePath('/');
  return assessment;
}

// -- CMS SETTINGS --

export async function getSettings() {
  const records = await (prisma as any).systemSetting.findMany();
  const settings: Record<string, string> = {};
  records.forEach((r: any) => settings[r.key] = r.value);
  return settings;
}

export async function saveSettings(payload: Record<string, string>) {
  for (const [key, value] of Object.entries(payload)) {
    await (prisma as any).systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }
}

// -- ADMIN --

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function getUsers(): Promise<any[]> {
  await requireAdmin();
  const users = await (prisma as any).user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { sessions: true } },
      school: { select: { id: true, name: true } },
    },
  });
  return users;
}

export async function setUserRole(userId: string, role: "user" | "admin") {
  await requireAdmin();
  await (prisma as any).user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function assignUserSchool(userId: string, schoolId: string | null) {
  await requireAdmin();
  await (prisma as any).user.update({
    where: { id: userId },
    data: { schoolId: schoolId || null },
  });
  revalidatePath("/admin/users");
}

export async function getAssessmentsAdmin(page: number = 1, schoolId?: string, term?: string) {
  await requireAdmin();
  const take = 50;
  const skip = (page - 1) * take;
  const where: any = {};
  if (term) where.term = term;
  if (schoolId) where.student = { schoolId };

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      orderBy: { date: "desc" },
      take,
      skip,
      include: {
        student: {
          include: { school: { include: { projectOffice: { include: { division: true } } } } }
        }
      }
    }),
    prisma.assessment.count({ where })
  ]);
  return { assessments, total, pages: Math.ceil(total / take) };
}

export async function updateAssessment(id: string, data: {
  assessorName: string;
  literacyLevel: number;
  numeracyLevel: number;
  term: string;
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
}) {
  await requireAdmin();
  await prisma.assessment.update({ where: { id }, data });
  revalidatePath("/admin/data");
}

export async function deleteAssessment(id: string) {
  await requireAdmin();
  await prisma.assessment.delete({ where: { id } });
  revalidatePath("/admin/data");
  revalidatePath("/");
}

export async function clearAllAssessments(term?: string) {
  await requireAdmin();
  await prisma.assessment.deleteMany(term ? { where: { term } } : undefined);
  revalidatePath("/admin/data");
  revalidatePath("/");
}

export async function clearAllData() {
  await requireAdmin();
  // Must delete in order due to foreign key constraints
  await prisma.assessment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.school.deleteMany();
  await prisma.projectOffice.deleteMany();
  await prisma.division.deleteMany();
  revalidatePath("/admin/data");
  revalidatePath("/");
  revalidatePath("/students");
}

export async function seedHierarchy() {
  await requireAdmin();

  const { HIERARCHY_DATA } = await import("@/prisma/hierarchy-data");

  let divCount = 0, poCount = 0, schoolCount = 0;

  // Fetch all existing records in one shot
  const existingDivisions = await prisma.division.findMany();
  const existingPOs = await prisma.projectOffice.findMany();
  const existingSchools = await prisma.school.findMany({ select: { udiseCode: true } });

  const divMap = new Map(existingDivisions.map(d => [d.name, d.id]));
  const poMap = new Map(existingPOs.map(p => [`${p.name}__${p.divisionId}`, p.id]));
  const schoolSet = new Set(existingSchools.map(s => s.udiseCode));

  for (const [divName, pos] of Object.entries(HIERARCHY_DATA)) {
    if (!divMap.has(divName)) {
      const div = await prisma.division.create({ data: { name: divName } });
      divMap.set(divName, div.id);
      divCount++;
    }
    const divId = divMap.get(divName)!;

    for (const [poName, schools] of Object.entries(pos as any)) {
      const poKey = `${poName}__${divId}`;
      if (!poMap.has(poKey)) {
        const po = await prisma.projectOffice.create({ data: { name: poName, divisionId: divId } });
        poMap.set(poKey, po.id);
        poCount++;
      }
      const poId = poMap.get(poKey)!;

      const newSchools = (schools as any[]).filter(s => !schoolSet.has(s.udise));
      if (newSchools.length > 0) {
        await prisma.school.createMany({
          data: newSchools.map(s => ({ name: s.name, udiseCode: s.udise, projectOfficeId: poId })),
          skipDuplicates: true,
        });
        newSchools.forEach(s => schoolSet.add(s.udise));
        schoolCount += newSchools.length;
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/upload");
  return { divCount, poCount, schoolCount };
}

export async function cleanupSchools() {
  await requireAdmin();

  const { HIERARCHY_DATA } = await import("@/prisma/hierarchy-data");

  // 1. Extract valid UDISE codes from Master List
  const validUdiseCodes = new Set<string>();
  Object.values(HIERARCHY_DATA).forEach((pos: any) => {
    Object.values(pos).forEach((schools: any) => {
      schools.forEach((s: any) => validUdiseCodes.add(s.udise));
    });
  });

  // 2. Find schools to delete
  const allSchools = await prisma.school.findMany({ select: { id: true, udiseCode: true } });
  const invalidSchoolIds = allSchools
    .filter(s => !validUdiseCodes.has(s.udiseCode))
    .map(s => s.id);

  if (invalidSchoolIds.length === 0) return { count: 0 };

  // 3. Batch delete
  await prisma.assessment.deleteMany({ where: { student: { schoolId: { in: invalidSchoolIds } } } });
  await prisma.student.deleteMany({ where: { schoolId: { in: invalidSchoolIds } } });
  const result = await prisma.school.deleteMany({ where: { id: { in: invalidSchoolIds } } });

  revalidatePath("/");
  return { count: result.count };
}

// -- SCHOOL LOGINS --

function transliterateDevanagari(str: string): string {
  // Multi-char conjuncts first
  str = str
    .replace(/क्ष/g, 'ksh')
    .replace(/ज्ञ/g, 'dny')
    .replace(/त्र/g, 'tr')
    .replace(/श्र/g, 'shr');

  const consonants: Record<string, string> = {
    'क': 'k',  'ख': 'kh', 'ग': 'g',  'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh','ज': 'j',  'झ': 'jh', 'ञ': 'n',
    'ट': 't',  'ठ': 'th', 'ड': 'd',  'ढ': 'dh', 'ण': 'n',
    'त': 't',  'थ': 'th', 'द': 'd',  'ध': 'dh', 'न': 'n',
    'प': 'p',  'फ': 'ph', 'ब': 'b',  'भ': 'bh', 'म': 'm',
    'य': 'y',  'र': 'r',  'ल': 'l',  'व': 'v',  'श': 'sh',
    'ष': 'sh', 'स': 's',  'ह': 'h',  'ळ': 'l',
  };
  const vowels: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ru', 'ऍ': 'e',
  };
  const matras: Record<string, string | null> = {
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o',  'ौ': 'au', 'ृ': 'ru',
    'ं': 'n', 'ँ': 'n', 'ः': 'h',
    '्': null, // halant — suppress inherent vowel
  };
  const digits: Record<string, string> = {
    '०':'0','१':'1','२':'2','३':'3','४':'4',
    '५':'5','६':'6','७':'7','८':'8','९':'9',
  };

  const chars = [...str];
  let result = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (ch in consonants) {
      result += consonants[ch];
      const nextIsMatra = next !== undefined && next in matras;
      if (!nextIsMatra) result += 'a'; // inherent vowel unless matra/halant follows
    } else if (ch in matras) {
      const v = matras[ch];
      if (v !== null) result += v;
    } else if (ch in vowels) {
      result += vowels[ch];
    } else if (ch in digits) {
      result += digits[ch];
    } else {
      result += ch; // ASCII chars (spaces, hyphens, brackets) pass through
    }
  }
  return result;
}

function toSlug(str: string): string {
  return transliterateDevanagari(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
    .replace(/\s+/g, '.');
}

export async function generateSchoolLogins(): Promise<{ created: number; skipped: number }> {
  await requireAdmin();

  const DEFAULT_PASSWORD = "Pratham@2025";
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const schools = await prisma.school.findMany({ include: { projectOffice: true } });

  const data = schools.map(school => ({
    email: `${toSlug(school.projectOffice.name)}.${toSlug(school.name)}@flnhub.in`,
    name: school.name,
    role: "user",
    schoolId: school.id,
    passwordHash,
  }));

  const result = await (prisma as any).user.createMany({ data, skipDuplicates: true });

  revalidatePath("/admin/users");
  return { created: result.count, skipped: schools.length - result.count };
}

export async function deleteSchoolLogins(ids: string[]): Promise<{ deleted: number }> {
  await requireAdmin();
  const result = await (prisma as any).user.deleteMany({
    where: { id: { in: ids }, email: { endsWith: '@flnhub.in' } },
  });
  revalidatePath('/admin/logins');
  return { deleted: result.count };
}

export async function getSchoolCredentials(): Promise<{ id: string; school: string; po: string; email: string; password: string }[]> {
  await requireAdmin();

  const users = await (prisma as any).user.findMany({
    where: { email: { endsWith: "@flnhub.in" }, schoolId: { not: null } },
    include: { school: { include: { projectOffice: true } } },
    orderBy: { email: 'asc' },
  });

  return users.map((u: any) => ({
    id: u.id,
    po: u.school?.projectOffice?.name ?? '',
    school: u.school?.name ?? '',
    email: u.email,
    password: 'Pratham@2025',
  }));
}

export async function updateLoginEmail(userId: string, newEmail: string): Promise<{ error?: string }> {
  await requireAdmin();
  const trimmed = newEmail.trim().toLowerCase();
  if (!trimmed) return { error: 'Email cannot be empty' };
  const existing = await (prisma as any).user.findUnique({ where: { email: trimmed } });
  if (existing && existing.id !== userId) return { error: 'Email already in use' };
  await (prisma as any).user.update({ where: { id: userId }, data: { email: trimmed } });
  revalidatePath('/admin/logins');
  return {};
}
