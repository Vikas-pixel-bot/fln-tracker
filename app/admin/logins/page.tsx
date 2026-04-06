export const dynamic = 'force-dynamic';
import { getSchoolCredentials } from '@/app/actions';
import LoginsClient from './LoginsClient';

export default async function SchoolLoginsPage() {
  const credentials = await getSchoolCredentials();
  return <LoginsClient initialCredentials={credentials} />;
}
