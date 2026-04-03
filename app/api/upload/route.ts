import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as xlsx from 'xlsx';

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
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const term = formData.get('term') as string || "Baseline";
    
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "File contains no data." }, { status: 400 });
    }

    // --- PHASE 1: PRE-FETCH HIERARCHY ---
    const allDivisions = await prisma.division.findMany();
    const divMap = new Map(allDivisions.map(d => [d.name, d.id]));

    const allPOs = await prisma.projectOffice.findMany();
    const poMap = new Map(allPOs.map(p => [`${p.divisionId}-${p.name}`, p.id]));

    const allSchools = await prisma.school.findMany();
    const schoolMap = new Map(allSchools.map(s => [s.udiseCode, s.id]));

    // --- PHASE 2: RESOLVE / CREATE ORGANIZATIONAL BOUNDARIES ---
    // We process top-down to ensure foreign keys are valid.
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

    // --- PHASE 3: BATCH PREPARE STUDENTS ---
    const studentsToCreate: any[] = [];
    const seenStudents = new Set<string>();

    for (const row of rows) {
      const schoolName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
      const poName = (row['Please select project office'] || 'Unknown PO').trim();
      const divName = (row['Please select Division'] || 'Unknown Division').trim();
      const dId = divMap.get(divName)!;
      const pId = poMap.get(`${dId}-${poName}`)!;
      const sId = schoolMap.get(`UDISE-${schoolName}-${pId}`.substring(0, 50))!;

      const studentName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
      if (studentName === 'Unknown Student' || !studentName) continue;

      const gender = (row['Please select student gender (कृपया विद्यार्थी लिंग निवडा)'] || 'Unknown').trim();
      const classStr = String(row['Please select assessment class (कृपया मूल्यांकन वर्ग निवडा)']);
      const classMatch = classStr.match(/\d+/);
      const classNum = classMatch ? parseInt(classMatch[0], 10) : 1;

      const uniqueKey = `${sId}-${studentName}`;
      if (!seenStudents.has(uniqueKey)) {
        studentsToCreate.push({
          name: studentName,
          class: classNum,
          gender: gender,
          schoolId: sId
        });
        seenStudents.add(uniqueKey);
      }
    }

    // Use createMany with skipDuplicates: true (Postgres specific)
    await (prisma.student as any).createMany({
       data: studentsToCreate,
       skipDuplicates: true
    });

    // --- PHASE 4: BATCH PREPARE ASSESSMENTS ---
    // Fetch students we just ensured exist to get their actual IDs
    const currentStudents = await prisma.student.findMany();
    const studentIdMap = new Map(currentStudents.map(st => [`${st.schoolId}-${st.name}`, st.id]));

    const assessmentsToCreate: any[] = [];
    for (const row of rows) {
      const studentName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
      if (studentName === 'Unknown Student' || !studentName) continue;

      const schoolName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
      const poName = (row['Please select project office'] || 'Unknown PO').trim();
      const divName = (row['Please select Division'] || 'Unknown Division').trim();
      const dId = divMap.get(divName)!;
      const pId = poMap.get(`${dId}-${poName}`)!;
      const sId = schoolMap.get(`UDISE-${schoolName}-${pId}`.substring(0, 50))!;

      const sid = studentIdMap.get(`${sId}-${studentName}`);
      if (!sid) continue;

      const assessor = row['Please select your name'] || 'Unknown Assessor';
      let dateVal = row['Date of Assessment'];
      let date = new Date();
      if (typeof dateVal === 'number') {
        date = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
      }

      const literacyStr = row['Marathi Language'] || row['Marathi (मराठी)'];
      const numeracyStr = row['Math Recognition (गणित ओळख)'] || row['Math Recognition'];
      const litLevel = parseLiteracyLevel(literacyStr);
      const numLevel = parseNumeracyLevel(numeracyStr);

      const checkOp = (val: any) => {
        if (!val) return false;
        const s = String(val).toLowerCase();
        return s.includes('can do') || s.includes('kar shakte') || s.includes('yes') || s === '1' || s === 'true';
      };

      assessmentsToCreate.push({
        date: date,
        term: term,
        assessorName: assessor,
        literacyLevel: litLevel,
        numeracyLevel: numLevel,
        addition: checkOp(row['Addition'] || row['Addition (बेरीज)']),
        subtraction: checkOp(row['Subtraction'] || row['Subtraction (वजाबाकी)']),
        multiplication: checkOp(row['Multiplication'] || row['Multiplication (गुणाकार)']),
        division: checkOp(row['Division'] || row['Division (भागाकार)']),
        studentId: sid
      });
    }

    await (prisma.assessment as any).createMany({
       data: assessmentsToCreate
    });

    return NextResponse.json({ success: true, count: rows.length });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
