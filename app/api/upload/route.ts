import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

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

    let processedCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        const assessor = row['Please select your name'] || 'Unknown Assessor';
        let dateVal = row['Date of Assessment'];
        let date = new Date();
        if (typeof dateVal === 'number') {
          date = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
        }
        
        const divName = (row['Please select Division'] || 'Unknown Division').trim();
        const poName = (row['Please select project office'] || 'Unknown PO').trim();
        const schoolName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
        const studentName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
        const gender = (row['Please select student gender (कृपया विद्यार्थी लिंग निवडा)'] || 'Unknown').trim();
        const classStr = String(row['Please select assessment class (कृपया मूल्यांकन वर्ग निवडा)']);
        const classMatch = classStr.match(/\d+/);
        const classNum = classMatch ? parseInt(classMatch[0], 10) : 1;
        
        const literacyStr = row['Marathi Language'] || row['Marathi (मराठी)'];
        const numeracyStr = row['Math Recognition (गणित ओळख)'] || row['Math Recognition'];
        
        const litLevel = parseLiteracyLevel(literacyStr);
        const numLevel = parseNumeracyLevel(numeracyStr);

        const checkOp = (val: any) => {
           if (!val) return false;
           const s = String(val).toLowerCase();
           return s.includes('can do') || s.includes('kar shakte') || s.includes('yes') || s === '1' || s === 'true';
        };

        const canAdd = checkOp(row['Addition'] || row['Addition (बेरीज)']);
        const canSub = checkOp(row['Subtraction'] || row['Subtraction (वजाबाकी)']);
        const canMul = checkOp(row['Multiplication'] || row['Multiplication (गुणाकार)']);
        const canDiv = checkOp(row['Division'] || row['Division (भागाकार)']);
    
        if (studentName === 'Unknown Student' || !studentName) continue;
    
        // 1. Division
        let division = await prisma.division.findFirst({ where: { name: divName }});
        if (!division) division = await prisma.division.create({ data: { name: divName } });
    
        // 2. Project Office
        let po = await prisma.projectOffice.findFirst({ where: { name: poName, divisionId: division.id } });
        if (!po) po = await prisma.projectOffice.create({ data: { name: poName, divisionId: division.id } });
    
        // 3. School
        const fakeUdise = `UDISE-${schoolName}-${po.id}`.substring(0, 50);
        let school = await prisma.school.findUnique({ where: { udiseCode: fakeUdise } });
        if (!school) {
          school = await prisma.school.create({ data: { name: schoolName, udiseCode: fakeUdise, projectOfficeId: po.id } });
        }
    
        // 4. Student
        let student = await prisma.student.findFirst({ where: { name: studentName, schoolId: school.id } });
        if (!student) {
          student = await prisma.student.create({ data: { name: studentName, class: classNum, gender: gender, schoolId: school.id } });
        }
    
        // 5. Assessment
        await prisma.assessment.create({
          data: {
            date: date,
            term: term,
            assessorName: assessor,
            literacyLevel: litLevel,
            numeracyLevel: numLevel,
            addition: canAdd,
            subtraction: canSub,
            multiplication: canMul,
            division: canDiv,
            studentId: student.id
          }
        });

        processedCount++;
    }

    return NextResponse.json({ success: true, count: processedCount });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
