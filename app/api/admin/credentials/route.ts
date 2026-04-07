import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await (prisma as any).user.findMany({
    where: { email: { endsWith: '@flnhub.in' }, schoolId: { not: null } },
    include: { school: { include: { projectOffice: true } } },
    orderBy: { email: 'asc' },
  });

  const result = users.map((u: any) => ({
    id: u.id,
    po: u.school?.projectOffice?.name ?? '',
    school: u.school?.name ?? '',
    email: u.email,
    password: 'Pratham@2025',
  }));

  return NextResponse.json(result);
}
