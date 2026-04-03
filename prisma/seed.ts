// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

// Helper to convert English strings or Marathi string to levels
function parseLiteracyLevel(val) {
  if (!val) return 0;
  const str = String(val).toLowerCase();
  if (str.includes('beginner') || str.includes('प्रारंभिक')) return 0;
  if (str.includes('letter') || str.includes('अक्षर')) return 1;
  if (str.includes('word') || str.includes('शब्द')) return 2;
  if (str.includes('paragraph') || str.includes('उतारा')) return 3;
  if (str.includes('story') || str.includes('गोष्ट')) return 4;
  return 0;
}

function parseNumeracyLevel(val) {
  if (!val) return 0;
  const str = String(val).toLowerCase();
  if (str.includes('beginner') || str.includes('प्रारंभिक')) return 0;
  // If it's a number recognition or 1-9
  if (str.includes('1-9') || str.includes('1 ते 9') || str.includes('number 1-9')) return 1;
  // 10-99
  if (str.includes('10-99') || str.includes('10 ते 99') || str.includes('number 10-99')) return 2;
  if (str.includes('subtraction') || str.includes('वजाबाकी')) return 3;
  if (str.includes('division') || str.includes('भागाकार')) return 4;
  return 0;
}

function extractClass(val) {
  if (!val) return 1;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

async function processFile(filename) {
  console.log(`Processing ${filename}...`);
  const workbook = xlsx.readFile(`./prisma/${filename}`);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    const assessor = row['Please select your name'] || 'Unknown Assessor';
    let dateVal = row['Date of Assessment'];
    let date = new Date();
    // Excel dates are numbers (days since 1900)
    if (typeof dateVal === 'number') {
      date = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
    }
    
    const divName = (row['Please select Division'] || 'Unknown Division').trim();
    const poName = (row['Please select project office'] || 'Unknown PO').trim();
    
    // Some rows use 'School Name', some use shift mapping
    const schoolName = (row['School Name'] || row['Marathi (मराठी)'] || 'Unknown School').trim();
    const studentName = (row['Write Student Name (विद्यार्थ्याचे नाव लिहा)'] || 'Unknown Student').trim();
    const gender = (row['Please select student gender (कृपया विद्यार्थी लिंग निवडा)'] || 'Unknown').trim();
    const classNum = extractClass(row['Please select assessment class (कृपया मूल्यांकन वर्ग निवडा)']);
    
    const literacyStr = row['Marathi Language'] || row['Marathi (मराठी)'];
    const numeracyStr = row['Math Recognition (गणित ओळख)'] || row['Math Recognition'];
    
    const litLevel = parseLiteracyLevel(literacyStr);
    const numLevel = parseNumeracyLevel(numeracyStr);

    if (studentName === 'Unknown Student' || !studentName) continue;

    // Database insertions (Upserts)
    // 1. Division
    let division = await prisma.division.findFirst({ where: { name: divName }});
    if (!division) {
      division = await prisma.division.create({ data: { name: divName } });
    }

    // 2. Project Office
    let po = await prisma.projectOffice.findFirst({ where: { name: poName, divisionId: division.id } });
    if (!po) {
      po = await prisma.projectOffice.create({ data: { name: poName, divisionId: division.id } });
    }

    // 3. School (using schoolName as unqiue since udiseCode isn't provided directly, we'll fake UDISE)
    const fakeUdise = `UDISE-${schoolName}-${po.id}`.substring(0, 50);
    let school = await prisma.school.findUnique({ where: { udiseCode: fakeUdise } });
    if (!school) {
      school = await prisma.school.create({
        data: {
          name: schoolName,
          udiseCode: fakeUdise,
          projectOfficeId: po.id
        }
      });
    }

    // 4. Student (Find by Name + School to avoid duplicates across baseline/midline)
    let student = await prisma.student.findFirst({
      where: { name: studentName, schoolId: school.id }
    });
    if (!student) {
      student = await prisma.student.create({
        data: {
          name: studentName,
          class: classNum,
          gender: gender,
          schoolId: school.id
        }
      });
    }

    // 5. Assessment
    await prisma.assessment.create({
      data: {
        date: date,
        assessorName: assessor,
        literacyLevel: litLevel,
        numeracyLevel: numLevel,
        studentId: student.id
      }
    });
  }
}

async function main() {
  console.log('Seeding Database with Excel Data...');
  try {
    await processFile('baseline.xlsx');
    await processFile('midline.xlsx');
    await processFile('endline.xlsx');
    console.log('Database Seeding Completed Successfully! 🎉');
  } catch(e) {
    console.error('Error during seeding:', e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
