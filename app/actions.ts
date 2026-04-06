"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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
  
  const whereFilter: any = {};
  if (query) whereFilter.name = { contains: query };
  
  if (schoolId) {
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
  return await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      school: { include: { projectOffice: { include: { division: true } } } },
      assessments: { orderBy: { date: 'desc' } }
    }
  });
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

  const totalStudents = await prisma.student.count({ where: whereFilter });
  const totalAssessments = await prisma.assessment.count({ 
     where: assessmentWhere 
  });
  
  const schoolWhere: any = {};
  if (filters.schoolId) schoolWhere.id = filters.schoolId;
  else if (filters.projectOfficeId) schoolWhere.projectOfficeId = filters.projectOfficeId;
  else if (filters.divisionId) schoolWhere.projectOffice = { divisionId: filters.divisionId };
  const totalSchools = await prisma.school.count({ where: schoolWhere });

  const literacies = await prisma.assessment.groupBy({
    by: ['term', 'literacyLevel'] as any,
    where: assessmentWhere,
    _count: { studentId: true }
  });
  
  const numeracies = await prisma.assessment.groupBy({
    by: ['term', 'numeracyLevel'] as any,
    where: assessmentWhere,
    _count: { studentId: true }
  });

  const rawOps = await prisma.assessment.findMany({
    where: assessmentWhere,
    select: { term: true, addition: true, subtraction: true, multiplication: true, division: true }
  });
  
  const operations = rawOps.reduce((acc: any, curr: any) => {
    if (!acc[curr.term]) acc[curr.term] = { addition: 0, subtraction: 0, multiplication: 0, division: 0, total: 0 };
    acc[curr.term].total += 1;
    if (curr.addition) acc[curr.term].addition += 1;
    if (curr.subtraction) acc[curr.term].subtraction += 1;
    if (curr.multiplication) acc[curr.term].multiplication += 1;
    if (curr.division) acc[curr.term].division += 1;
    return acc;
  }, {});

  return {
    totalStudents,
    totalAssessments,
    totalSchools,
    literacies,
    numeracies,
    operations
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
    },
  });
  return users;
}

export async function setUserRole(userId: string, role: "user" | "admin") {
  await requireAdmin();
  await (prisma as any).user.update({ where: { id: userId }, data: { role } });
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
