import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@flnhub.in';
  const password = 'Admin@2025';
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await (prisma as any).user.findUnique({ where: { email } });

  if (existing) {
    await (prisma as any).user.update({
      where: { email },
      data: { role: 'admin', passwordHash },
    });
    console.log(`✅ Updated existing user to admin: ${email}`);
  } else {
    await (prisma as any).user.create({
      data: {
        email,
        name: 'Admin',
        role: 'admin',
        passwordHash,
      },
    });
    console.log(`✅ Created admin user: ${email}`);
  }

  console.log(`📧 Email:    ${email}`);
  console.log(`🔑 Password: ${password}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
