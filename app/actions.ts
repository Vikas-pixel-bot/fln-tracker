"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
