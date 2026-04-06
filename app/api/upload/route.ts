import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as xlsx from 'xlsx';
import { auth } from '@/auth';

// Matching the logic used in seed to parse levels correctly
function parseLiteracyLevel(val: string) {
  if (!val) return 0;
  const str = String(val).toLowerCase();
  if (str.includes('beginner') || str.includes('प्रारंभिक')) return 0;
  if (str.includes('letter') || str.includes('अक्षर')) return 1;
  if (str.includes('word') || str.includes('शब्द')) return 2;
  if (str.includes('paragraph') || str.includes('उतारा')) return 3;
  if (str.includes('story') || str.includes('गोष्ट')) return 4;
  return 0;
}

function parseNumeracyLevel(val: string) {
  if (!val) return 0;
  const str = String(val).toLowerCase();
  if (str.includes('beginner') || str.includes('प्रारंभिक')) return 0;
  if (str.includes('1-9') || str.includes('1 ते 9')) return 1;
  if (str.includes('10-99') || str.includes('10 ते 99')) return 2;
  // Extended 8-tier logic
  if (str.includes('100') || str.includes('999')) return 3;
  if (str.includes('addition') || str.includes('बेरीज')) return 4;
  if (str.includes('subtraction') || str.includes('वजाबाकी')) return 5;
  if (str.includes('multiplication') || str.includes('गुणाकार')) return 6;
  if (str.includes('division') || str.includes('भागाकार')) return 7;
  return 0;
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const term = formData.get('term') as string || "Baseline";
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    if (!rows || rows.length === 0) return NextResponse.json({ error: "File contains no data." }, { status: 400 });

    // --- PHASE 1: FETCH MASTER LIST FOR LOOKUP ---
    const allDivisions = await prisma.division.findMany();
    const allPOs = await prisma.projectOffice.findMany();
    const allSchools = await prisma.school.findMany({
      include: { projectOffice: { include: { division: true } } }
    });

    // Lookup Maps
    const divMap = new Map(allDivisions.map(d => [d.name.trim(), d.id]));
    const poMap = new Map(allPOs.map(p => [`${p.divisionId}-${p.name.trim()}`, p.id]));
    const schoolMap = new Map();
    allSchools.forEach(s => {
      const key = `${s.projectOffice.division.name.trim()}-${s.projectOffice.name.trim()}-${s.name.trim()}`;
      schoolMap.set(key, s.id);
    });

    const failedRows: any[] = [];
    const studentsToCreate: any[] = [];
    const assessmentsToCreate: any[] = [];
    const seenStudents = new Set<string>();

    // --- PHASE 2: VALIDATE & PREP DATA ---
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dName = (row['Please select Division'] || '').trim();
      const pName = (row['Please select project office'] || '').trim();
      const sName = (row['School Name'] || row['Marathi (मराठी)'] || '').trim();
      const stdName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || '').trim();

      if (!dName || !pName || !sName || !stdName) {
        failedRows.push({ row: i + 2, error: "Missing required fields (Division/PO/School/Student)" });
        continue;
      }

      // Check hierarchy match
      const sId = schoolMap.get(`${dName}-${pName}-${sName}`);
      if (!sId) {
        failedRows.push({ row: i + 2, school: sName, error: "School not in Master List (Check for typos or PO/Division mismatch)" });
        continue;
      }

      const gender = (row['Please select student gender (कृपया विद्यार्थी लिंग निवडा)'] || 'Unknown').trim();
      const classStr = String(row['Please select assessment class (कृपया मूल्यांकन वर्ग निवडा)']);
      const classNum = classStr.match(/\d+/) ? parseInt(classStr.match(/\d+/)![0], 10) : 1;

      // Ensure student exists (unique by school + name in our simple model)
      const studentKey = `${sId}-${stdName}`;
      // Note: We'll create students first in the next phase
      if (!seenStudents.has(studentKey)) {
        studentsToCreate.push({ name: stdName, class: classNum, gender, schoolId: sId });
        seenStudents.add(studentKey);
      }
    }

    // --- PHASE 3: BATCH STUDENT INGEST ---
    // Using skipDuplicates: true to handle overlapping students
    for (let i = 0; i < studentsToCreate.length; i += 500) {
      await (prisma.student as any).createMany({ data: studentsToCreate.slice(i, i + 500), skipDuplicates: true });
    }

    // --- PHASE 4: PREP ASSESSMENTS (Need Student IDs) ---
    const allStudentsInScope = await prisma.student.findMany({ 
      where: { schoolId: { in: Array.from(new Set(studentsToCreate.map(s => s.schoolId))) } } 
    });
    const studentIdMap = new Map(allStudentsInScope.map(st => [`${st.schoolId}-${st.name}`, st.id]));

    for (const row of rows) {
      const dName = (row['Please select Division'] || '').trim();
      const pName = (row['Please select project office'] || '').trim();
      const sName = (row['School Name'] || row['Marathi (मराठी)'] || '').trim();
      const stdName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || '').trim();
      
      const sId = schoolMap.get(`${dName}-${pName}-${sName}`);
      if (!sId) continue; // Already logged in failedRows
      
      const sid = studentIdMap.get(`${sId}-${stdName}`);
      if (!sid) continue;

      let dateVal = row['Date of Assessment'];
      let date = typeof dateVal === 'number' ? new Date(Math.round((dateVal - 25569) * 86400 * 1000)) : new Date();

      const checkOp = (val: any) => {
        const s = String(val || '').toLowerCase();
        return s.includes('can do') || s.includes('kar shakte') || s.includes('yes') || s === '1' || s === 'true';
      };

      assessmentsToCreate.push({
        date, term, assessorName: row['Please select your name'] || 'Unknown Assessor',
        literacyLevel: parseLiteracyLevel(row['Marathi Language'] || row['Marathi (मराठी)']),
        numeracyLevel: parseNumeracyLevel(row['Math Recognition (गणित ओळख)'] || row['Math Recognition']),
        addition: checkOp(row['Addition'] || row['Addition (बेरीज)']),
        subtraction: checkOp(row['Subtraction'] || row['Subtraction (वजाबाकी)']),
        multiplication: checkOp(row['Multiplication'] || row['Multiplication (गुणाकार)']),
        division: checkOp(row['Division'] || row['Division (भागाकार)']),
        studentId: sid
      });
    }

    // Phase 5: Chunked assessment creation
    for (let i = 0; i < assessmentsToCreate.length; i += 500) {
      await (prisma.assessment as any).createMany({ data: assessmentsToCreate.slice(i, i + 500) });
    }

    return NextResponse.json({ 
      success: true, 
      count: assessmentsToCreate.length,
      failedRows: failedRows.length > 0 ? failedRows : undefined 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
