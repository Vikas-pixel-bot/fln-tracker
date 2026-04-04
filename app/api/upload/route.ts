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

    // --- PHASE 1: PRE-ANALYZE EXCEL (EXTRACT KEYS) ---
    const divNames = new Set<string>();
    const poNames = new Set<string>();
    const schoolNames = new Set<string>();

    for (const row of rows) {
      divNames.add((row['Please select Division'] || 'Unknown Division').trim());
      poNames.add((row['Please select project office'] || 'Unknown PO').trim());
      schoolNames.add((row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim());
    }

    // --- PHASE 2: SELECTIVE FETCH ---
    const allDivisions = await prisma.division.findMany({ where: { name: { in: Array.from(divNames) } } });
    const divMap = new Map(allDivisions.map(d => [d.name, d.id]));

    // Build PO Search Keys
    const allPOs = await prisma.projectOffice.findMany({ where: { name: { in: Array.from(poNames) } } });
    const poMap = new Map(allPOs.map(p => [`${p.divisionId}-${p.name}`, p.id]));

    // Build School Search Keys (using UDISE codes constructed from names in memory)
    const schoolHierarchyKeys = new Set<string>();
    for (const row of rows) {
      const dName = (row['Please select Division'] || 'Unknown Division').trim();
      const pName = (row['Please select project office'] || 'Unknown PO').trim();
      const sName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
      const dId = divMap.get(dName);
      if (dId) {
        const pId = poMap.get(`${dId}-${pName}`);
        if (pId) schoolHierarchyKeys.add(`UDISE-${sName}-${pId}`.substring(0, 50));
      }
    }

    const allSchools = await prisma.school.findMany({ where: { udiseCode: { in: Array.from(schoolHierarchyKeys) } } });
    const schoolMap = new Map(allSchools.map(s => [s.udiseCode, s.id]));

    // --- PHASE 3: RESOLVE / ENSURE ORGANIZATIONAL HIERARCHY ---
    for (const row of rows) {
      const divName = (row['Please select Division'] || 'Unknown Division').trim();
      const poName = (row['Please select project office'] || 'Unknown PO').trim();
      const schoolName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();

      if (!divMap.has(divName)) {
        const d = await prisma.division.create({ data: { name: divName } });
        divMap.set(divName, d.id);
      }
      const dId = divMap.get(divName)!;
      const poKey = `${dId}-${poName}`;

      if (!poMap.has(poKey)) {
        const p = await prisma.projectOffice.create({ data: { name: poName, divisionId: dId } });
        poMap.set(poKey, p.id);
      }
      const pId = poMap.get(poKey)!;
      const fakeUdise = `UDISE-${schoolName}-${pId}`.substring(0, 50);

      if (!schoolMap.has(fakeUdise)) {
        const s = await prisma.school.create({ data: { name: schoolName, udiseCode: fakeUdise, projectOfficeId: pId } });
        schoolMap.set(fakeUdise, s.id);
      }
    }

    // --- PHASE 4: BATCH STUDENT PREP & INGEST ---
    const studentsToCreate: any[] = [];
    const seenStudents = new Set<string>();
    const activeSchoolIds = Array.from(schoolMap.values());

    for (const row of rows) {
      const sName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
      const pName = (row['Please select project office'] || 'Unknown PO').trim();
      const dId = divMap.get((row['Please select Division'] || 'Unknown Division').trim())!;
      const pId = poMap.get(`${dId}-${pName}`)!;
      const sId = schoolMap.get(`UDISE-${sName}-${pId}`.substring(0, 50))!;

      const stdName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
      if (!stdName || stdName === 'Unknown Student') continue;
      const gender = (row['Please select student gender (कृपया विद्यार्थी लिंग निवडा)'] || 'Unknown').trim();
      const classStr = String(row['Please select assessment class (कृपया मूल्यांकन वर्ग निवडा)']);
      const classNum = classStr.match(/\d+/) ? parseInt(classStr.match(/\d+/)![0], 10) : 1;

      const uniqueKey = `${sId}-${stdName}`;
      if (!seenStudents.has(uniqueKey)) {
        studentsToCreate.push({ name: stdName, class: classNum, gender, schoolId: sId });
        seenStudents.add(uniqueKey);
      }
    }

    // Chunked student creation to keep DB calls lightning fast
    for (let i = 0; i < studentsToCreate.length; i += 500) {
      await (prisma.student as any).createMany({ data: studentsToCreate.slice(i, i + 500), skipDuplicates: true });
    }

    // --- PHASE 5: BATCH ASSESSMENT PREP & INGEST ---
    const scopedStudents = await prisma.student.findMany({ where: { schoolId: { in: activeSchoolIds } } });
    const studentIdMap = new Map(scopedStudents.map(st => [`${st.schoolId}-${st.name}`, st.id]));
    const assessmentsToCreate: any[] = [];

    for (const row of rows) {
      const sName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
      const pName = (row['Please select project office'] || 'Unknown PO').trim();
      const dId = divMap.get((row['Please select Division'] || 'Unknown Division').trim())!;
      const pId = poMap.get(`${dId}-${pName}`)!;
      const sId = schoolMap.get(`UDISE-${sName}-${pId}`.substring(0, 50))!;
      const stdName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
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

    // Chunked assessment creation
    for (let i = 0; i < assessmentsToCreate.length; i += 500) {
      await (prisma.assessment as any).createMany({ data: assessmentsToCreate.slice(i, i + 500) });
    }

    return NextResponse.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
