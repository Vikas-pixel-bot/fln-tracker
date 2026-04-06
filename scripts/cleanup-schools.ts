import { PrismaClient } from '@prisma/client';
import { HIERARCHY_DATA } from '../prisma/hierarchy-data';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING SCHOOL CLEANUP (497 MASTER LIMIT) ---');

  // 1. Extract all valid UDISE codes from HIERARCHY_DATA
  const validUdiseCodes = new Set<string>();
  Object.values(HIERARCHY_DATA).forEach((pos: any) => {
    Object.values(pos).forEach((schools: any) => {
      schools.forEach((s: any) => validUdiseCodes.add(s.udise));
    });
  });

  console.log(`Master List contains ${validUdiseCodes.size} valid UDISE codes.`);

  // 2. Fetch all schools in DB
  const allSchools = await prisma.school.findMany({
    select: { id: true, udiseCode: true, name: true }
  });

  console.log(`Current DB contains ${allSchools.length} schools.`);

  const schoolsToDelete = allSchools.filter(s => !validUdiseCodes.has(s.udiseCode));
  const schoolIdsToDelete = schoolsToDelete.map(s => s.id);

  console.log(`Found ${schoolsToDelete.length} schools to delete.`);

  if (schoolsToDelete.length === 0) {
    console.log('No schools to delete. Database is already synchronized with Master List.');
    return;
  }

  // 3. Delete in order due to foreign keys
  console.log('Deleting assessments for students in invalid schools...');
  const assessmentsDeleted = await prisma.assessment.deleteMany({
    where: { student: { schoolId: { in: schoolIdsToDelete } } }
  });
  console.log(`Deleted ${assessmentsDeleted.count} assessments.`);

  console.log('Deleting students in invalid schools...');
  const studentsDeleted = await prisma.student.deleteMany({
    where: { schoolId: { in: schoolIdsToDelete } }
  });
  console.log(`Deleted ${studentsDeleted.count} students.`);

  console.log('Deleting extra schools...');
  const schoolsDeletedResult = await prisma.school.deleteMany({
    where: { id: { in: schoolIdsToDelete } }
  });
  console.log(`Deleted ${schoolsDeletedResult.count} schools.`);

  // 4. Final verification
  const finalCount = await prisma.school.count();
  console.log(`--- CLEANUP COMPLETE. FINAL DB SCHOOL COUNT: ${finalCount} ---`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
